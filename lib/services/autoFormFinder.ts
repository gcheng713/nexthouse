import { GoogleGenerativeAI } from '@google/generative-ai';

export interface RealtorInfo {
  state: string;
  county?: string;
  licenseNumber?: string;
  specializations?: string[];
}

export interface FormResult {
  name: string;
  description: string;
  url: string;
  pdfUrl?: string;
  jurisdiction: string;
  requiredFor?: string[];
  lastUpdated?: string;
  priority: 'required' | 'recommended' | 'optional';
}

export class AutoFormFinder {
  private genAI: GoogleGenerativeAI;
  
  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  private generatePrompt(realtorInfo: RealtorInfo): string {
    return `As a real estate forms expert, I need to find all essential forms for a realtor in ${realtorInfo.state}
    ${realtorInfo.county ? `specifically in ${realtorInfo.county} county` : ''}.
    ${realtorInfo.specializations?.length ? `They specialize in: ${realtorInfo.specializations.join(', ')}` : ''}

    Please provide a comprehensive list of:
    1. Required forms for real estate transactions
    2. State-specific disclosure forms
    3. Agency agreements and listing contracts
    4. Purchase agreements and related addenda
    5. Property management forms (if applicable)
    6. Broker-specific forms and agreements

    For each form, I need:
    - Exact form name/number
    - Direct URL to access the form (prefer official state/board websites)
    - PDF download link if available
    - Whether it's required, recommended, or optional
    - Specific situations when the form is needed
    - Last known update date
    - Jurisdiction validity

    Format the response as a JSON array with these fields:
    {
      "name": "Form name/number",
      "description": "Purpose and usage",
      "url": "Direct access link",
      "pdfUrl": "PDF download link (if available)",
      "jurisdiction": "State/county validity",
      "requiredFor": ["list", "of", "situations"],
      "lastUpdated": "Date or version",
      "priority": "required/recommended/optional"
    }

    Focus on official sources:
    1. State Real Estate Commission
    2. State Association of REALTORS®
    3. Local/County Real Estate Boards
    4. Multiple Listing Services (MLS)

    Only include forms that are currently valid and from authorized sources.`;
  }

  async findEssentialForms(realtorInfo: RealtorInfo): Promise<FormResult[]> {
    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
      const prompt = this.generatePrompt(realtorInfo);
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Extract JSON from the response
      const jsonMatch = text.match(/\\[([\\s\\S]*?)\\]/)?.[0] || '[]';
      const forms: FormResult[] = JSON.parse(jsonMatch);
      
      // Sort forms by priority
      return forms.sort((a, b) => {
        const priorityOrder = { required: 0, recommended: 1, optional: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });
    } catch (error) {
      console.error('Error finding forms:', error);
      return [];
    }
  }

  async findSpecificForm(realtorInfo: RealtorInfo, formType: string): Promise<FormResult[]> {
    const prompt = `Find the specific ${formType} form for a realtor in ${realtorInfo.state}.
    ${realtorInfo.county ? `The realtor operates in ${realtorInfo.county} county.` : ''}
    
    I need:
    1. The exact form name/number
    2. Direct URL to access the form
    3. PDF download link if available
    4. Whether it's required or optional
    5. When this form must be used
    6. Latest version information

    Only return forms from official sources like:
    - State Real Estate Commission
    - State Association of REALTORS®
    - Local Real Estate Boards
    
    Format as JSON with the same fields as before.`;

    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\\[([\\s\\S]*?)\\]/)?.[0] || '[]';
      return JSON.parse(jsonMatch);
    } catch (error) {
      console.error('Error finding specific form:', error);
      return [];
    }
  }
}
