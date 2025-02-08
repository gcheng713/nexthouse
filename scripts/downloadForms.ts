const axios = require('axios')
const fs = require('fs')
const path = require('path')
const { PDFDocument } = require('pdf-lib')
const sharp = require('sharp')

interface FormSource {
  state: string
  name: string
  url: string
  outputPath: string
}

const forms: FormSource[] = [
  // California Forms
  {
    state: 'CA',
    name: 'RPA-CA',
    url: 'https://www.car.org/-/media/CAR/Documents/Your-CAR/Standard-Forms/December-2023-Forms-Release/RPA-12-23.pdf',
    outputPath: 'RPA-CA.pdf'
  },
  {
    state: 'CA',
    name: 'AVID',
    url: 'https://www.car.org/-/media/CAR/Documents/Your-CAR/Standard-Forms/December-2023-Forms-Release/AVID-12-23.pdf',
    outputPath: 'AVID.pdf'
  },
  // Texas Forms
  {
    state: 'TX',
    name: '1-4-Family-Contract',
    url: 'https://www.trec.texas.gov/sites/default/files/pdf-forms/20-17_0.pdf',
    outputPath: '1-4-Family-Contract.pdf'
  },
  {
    state: 'TX',
    name: 'SDN',
    url: 'https://www.trec.texas.gov/sites/default/files/pdf-forms/op-h_0.pdf',
    outputPath: 'SDN.pdf'
  },
  // Add more forms here...
]

async function downloadForm(form: FormSource) {
  const outputDir = path.join(process.cwd(), 'public', 'forms', form.state)
  const outputPath = path.join(outputDir, form.outputPath)
  const previewPath = path.join(outputDir, form.outputPath.replace('.pdf', '-preview.png'))

  try {
    // Create directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }

    // Download PDF
    const response = await axios.get(form.url, { responseType: 'arraybuffer' })
    fs.writeFileSync(outputPath, response.data)

    // Generate preview
    const pdfDoc = await PDFDocument.load(response.data)
    const pages = pdfDoc.getPages()
    if (pages.length > 0) {
      const firstPage = pages[0]
      // Convert PDF page to PNG using pdf-lib
      const pdfBytes = await pdfDoc.save()
      
      // Use sharp to convert PDF to PNG
      await sharp(pdfBytes, { density: 300 })
        .resize(800, 1000, { fit: 'inside' })
        .png()
        .toFile(previewPath)
    }

    console.log(`✅ Downloaded ${form.state}/${form.name}`)
  } catch (error) {
    if (error instanceof Error) {
      console.error(`❌ Failed to download ${form.state}/${form.name}:`, error.message)
    } else {
      console.error(`❌ Failed to download ${form.state}/${form.name}:`, error)
    }
  }
}

async function downloadAllForms() {
  console.log('Starting form downloads...')
  
  for (const form of forms) {
    await downloadForm(form)
  }
  
  console.log('Finished downloading forms')
}

downloadAllForms()
