const { PDFDocument, StandardFonts, rgb } = require('pdf-lib')
const fs = require('fs')
const path = require('path')

interface FormTemplate {
  state: string
  name: string
  filename: string
  title: string
  fields: string[]
}

const forms: FormTemplate[] = [
  {
    state: 'CA',
    name: 'RPA-CA',
    filename: 'RPA-CA.pdf',
    title: 'California Residential Purchase Agreement',
    fields: [
      'Property Address',
      'Purchase Price',
      'Buyer Name',
      'Seller Name',
      'Closing Date',
      'Deposit Amount',
      'Loan Amount',
      'Inspection Period'
    ]
  },
  {
    state: 'CA',
    name: 'AVID',
    filename: 'AVID.pdf',
    title: 'Agent Visual Inspection Disclosure',
    fields: [
      'Property Address',
      'Inspection Date',
      'Agent Name',
      'Brokerage',
      'Interior Condition',
      'Exterior Condition',
      'Known Issues',
      'Recommendations'
    ]
  },
  {
    state: 'TX',
    name: '1-4-Family-Contract',
    filename: '1-4-Family-Contract.pdf',
    title: 'One to Four Family Residential Contract',
    fields: [
      'Property Address',
      'Sales Price',
      'Earnest Money',
      'Option Fee',
      'Title Company',
      'Survey Requirements',
      'Property Condition',
      'Closing Date'
    ]
  }
]

async function createForm(template: FormTemplate) {
  const pdfDoc = await PDFDocument.create()
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman)
  const page = pdfDoc.addPage([612, 792]) // Letter size

  // Add title
  page.drawText(template.title, {
    x: 50,
    y: 750,
    size: 16,
    font: timesRomanFont,
    color: rgb(0, 0, 0)
  })

  // Add state association
  page.drawText(`${template.state} ASSOCIATION OF REALTORS®`, {
    x: 50,
    y: 730,
    size: 12,
    font: timesRomanFont,
    color: rgb(0, 0, 0)
  })

  // Add form fields
  let y = 680
  for (const field of template.fields) {
    page.drawText(`${field}:`, {
      x: 50,
      y,
      size: 12,
      font: timesRomanFont,
      color: rgb(0, 0, 0)
    })

    // Draw a line for the field
    page.drawLine({
      start: { x: 200, y: y - 2 },
      end: { x: 550, y: y - 2 },
      thickness: 1,
      color: rgb(0.8, 0.8, 0.8)
    })

    y -= 40
  }

  // Add form ID and version
  page.drawText(`Form ${template.name} | Rev. 01/2025`, {
    x: 50,
    y: 50,
    size: 10,
    font: timesRomanFont,
    color: rgb(0.5, 0.5, 0.5)
  })

  // Save the PDF
  const pdfBytes = await pdfDoc.save()
  const outputDir = path.join(process.cwd(), 'public', 'forms', template.state)
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  const outputPath = path.join(outputDir, template.filename)
  fs.writeFileSync(outputPath, pdfBytes)
  console.log(`✅ Created ${template.state}/${template.filename}`)
}

async function createAllForms() {
  console.log('Creating sample forms...')
  
  for (const template of forms) {
    await createForm(template)
  }
  
  console.log('Finished creating forms')
}

createAllForms()
