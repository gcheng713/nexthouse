import axios from 'axios'
import * as cheerio from 'cheerio'
import { RateLimiter } from 'limiter'

interface FormSource {
  organization: string
  baseUrl: string
  searchEndpoint?: string
  formPatterns: string[]
  versionPattern?: RegExp
  apiKey?: string
  rateLimitPerMinute?: number
}

// Rate limiters for each source
const rateLimiters = new Map<string, RateLimiter>()

const formSources: FormSource[] = [
  {
    organization: 'California Association of REALTORS®',
    baseUrl: 'https://www.car.org',
    searchEndpoint: '/legal/standard-forms/search',
    formPatterns: ['RPA', 'AVID', 'TDS', 'NHD'],
    versionPattern: /(\d+\.\d+\.\d+)|(\d{2}\/\d{2}\/\d{4})/,
    rateLimitPerMinute: 30
  },
  {
    organization: 'National Association of REALTORS®',
    baseUrl: 'https://www.nar.realtor',
    searchEndpoint: '/realtor-forms',
    formPatterns: ['Purchase Agreement', 'Disclosure', 'Listing Agreement'],
    versionPattern: /v(\d+\.\d+)/,
    rateLimitPerMinute: 60
  },
  {
    organization: 'Arizona Association of REALTORS®',
    baseUrl: 'https://www.aaronline.com',
    searchEndpoint: '/forms',
    formPatterns: ['Contract', 'SPDS', 'LSC'],
    versionPattern: /Rev\.\s*(\d{2}\/\d{2})/,
    rateLimitPerMinute: 30
  },
  {
    organization: 'Texas REALTORS®',
    baseUrl: 'https://www.texasrealestate.com',
    searchEndpoint: '/realtors/forms',
    formPatterns: ['1-4 Family Residential', 'Seller\'s Disclosure', 'Residential Lease'],
    versionPattern: /TXR\s*(\d+)-(\d+)/,
    rateLimitPerMinute: 40
  },
  {
    organization: 'Florida REALTORS®',
    baseUrl: 'https://www.floridarealtors.org',
    searchEndpoint: '/forms-and-contracts',
    formPatterns: ['Residential Contract', 'Disclosure Statement', 'Lease Agreement'],
    versionPattern: /FR-(\d+)\s*Rev\.\s*(\d{2}\/\d{2})/,
    rateLimitPerMinute: 30
  },
  {
    organization: 'New York State Association of REALTORS®',
    baseUrl: 'https://www.nysar.com',
    searchEndpoint: '/legal/forms',
    formPatterns: ['Purchase Contract', 'Property Condition Disclosure', 'Counter Offer'],
    versionPattern: /Form\s*(\d{4})\s*Rev\.\s*(\d{2}\/\d{2})/,
    rateLimitPerMinute: 30
  },
  {
    organization: 'Hawaii REALTORS®',
    baseUrl: 'https://hawaiirealtors.com',
    searchEndpoint: '/standard-forms',
    formPatterns: ['Purchase Contract', 'Seller\'s Real Property Disclosure', 'Rental Agreement'],
    versionPattern: /RR(\d{3})\s*Rev\.\s*(\d{2}\/\d{2})/,
    rateLimitPerMinute: 20
  },
  {
    organization: 'Illinois REALTORS®',
    baseUrl: 'https://www.illinoisrealtors.org',
    searchEndpoint: '/legal/forms',
    formPatterns: ['Multi-Board Residential', 'Disclosure Report', 'Exclusive Listing'],
    versionPattern: /Form\s*(\d+)\s*v(\d+\.\d+)/,
    rateLimitPerMinute: 30
  },
  // Third-party form providers
  {
    organization: 'ZipLogix',
    baseUrl: 'https://www.ziplogix.com',
    searchEndpoint: '/forms-catalog',
    formPatterns: ['Purchase Agreement', 'Disclosure', 'Listing Contract'],
    apiKey: process.env.ZIPLOGIX_API_KEY,
    rateLimitPerMinute: 100
  },
  {
    organization: 'DotLoop',
    baseUrl: 'https://www.dotloop.com',
    searchEndpoint: '/forms',
    formPatterns: ['Purchase Contract', 'Disclosure Statement', 'Listing Agreement'],
    apiKey: process.env.DOTLOOP_API_KEY,
    rateLimitPerMinute: 100
  }
]

interface CrawlResult {
  formName: string
  url: string
  source: string
  lastChecked: Date
  isValid: boolean
  version?: string
  nextUpdate?: Date
}

interface VersionInfo {
  version: string
  releaseDate?: Date
  isLatest: boolean
}

export class FormCrawler {
  constructor() {
    formSources.forEach(source => {
      rateLimiters.set(
        source.organization,
        new RateLimiter({
          tokensPerInterval: source.rateLimitPerMinute || 30,
          interval: 'minute'
        })
      )
    })
  }

  async validateExistingUrl(url: string): Promise<boolean> {
    try {
      const response = await axios.head(url, {
        validateStatus: (status) => status === 200,
        timeout: 5000,
        maxRedirects: 5
      })
      return response.status === 200
    } catch {
      return false
    }
  }

  async findFormUrl(formName: string, state: string): Promise<CrawlResult | null> {
    // Find the appropriate source for this state
    const source = formSources.find(s => s.organization.includes(state))
    if (!source) {
      return null
    }

    try {
      // Check rate limit
      const canProceed = await this.checkRateLimit(source)
      if (!canProceed) {
        throw new Error('Rate limit exceeded')
      }

      // Try different search methods
      let result: CrawlResult | null = null

      // First try API if available
      if (source.apiKey) {
        result = await this.searchApi(source, formName)
      }

      // Then try web search
      if (!result) {
        result = await this.searchSource(source, formName)
      }

      // Finally try third-party providers
      if (!result) {
        result = await this.searchZipLogix(source, formName)
      }

      if (!result) {
        result = await this.searchDotLoop(source, formName)
      }

      if (result?.url) {
        // Validate the URL
        const isValid = await this.validateExistingUrl(result.url)
        if (!isValid) {
          return null
        }

        // Get version info
        const versionInfo = await this.getVersionInfo(source, result.url, formName)
        if (versionInfo) {
          result.version = versionInfo.version
        }
      }

      return result
    } catch (error) {
      console.error('Error finding form URL:', error)
      return null
    }
  }

  private async searchSource(source: FormSource, formName: string): Promise<CrawlResult | null> {
    try {
      const searchUrl = `${source.baseUrl}${source.searchEndpoint || ''}`
      const response = await axios.get(searchUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; RealEstateBot/1.0)',
          'Accept': 'text/html,application/xhtml+xml'
        }
      })

      const $ = cheerio.load(response.data)
      
      // Look for links containing the form name
      const links = $('a').filter((_, el) => {
        const text = $(el).text().toLowerCase()
        return text.includes(formName.toLowerCase())
      })

      if (links.length > 0) {
        const href = $(links[0]).attr('href')
        if (href) {
          const url = href.startsWith('http') ? href : `${source.baseUrl}${href}`
          return {
            url,
            source: source.organization
          }
        }
      }

      return null
    } catch (error) {
      console.error('Error searching source:', error)
      return null
    }
  }

  private async searchApi(source: FormSource, formName: string): Promise<CrawlResult | null> {
    if (!source.apiKey) return null

    try {
      const response = await axios.get(`${source.baseUrl}/api/forms/search`, {
        params: {
          q: formName,
          apiKey: source.apiKey
        }
      })

      if (response.data?.url) {
        return {
          url: response.data.url,
          source: source.organization,
          version: response.data.version
        }
      }

      return null
    } catch {
      return null
    }
  }

  private async checkRateLimit(source: FormSource): Promise<boolean> {
    const limiter = rateLimiters.get(source.organization)
    if (!limiter) return true

    try {
      await limiter.removeTokens(1)
      return true
    } catch {
      return false
    }
  }
}
