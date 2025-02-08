import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

interface FormRequest {
  message: string;
  location?: {
    state: string;
    county?: string;
  };
  formType?: string;
}

interface FormResult {
  name: string;
  description: string;
  url: string;
  pdfUrl?: string;
  jurisdiction: string;
  requiredFor?: string[];
  lastUpdated?: string;
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

export async function POST(request: Request) {
  try {
    const { message, location, formType }: FormRequest = await request.json();
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // Construct a detailed prompt based on location and form type
    const prompt = `As a real estate forms expert, I need you to find specific forms and resources for ${location?.state || 'any state'}.
    ${formType ? `Specifically looking for ${formType} forms.` : ''}
    ${message}

    Please provide:
    1. Direct links to official forms from state real estate boards or associations
    2. Links to PDF versions if available
    3. Information about when these forms are required
    4. Last known update date
    5. Any specific jurisdictional requirements

    Format your response as a JSON array with these fields:
    - name: Form name/title
    - description: Brief description of the form's purpose
    - url: Direct link to access the form
    - pdfUrl: Direct link to PDF version (if available)
    - jurisdiction: State/county where this form is valid
    - requiredFor: Array of situations when this form is required
    - lastUpdated: Last known update date

    Focus only on official, current forms from authorized sources.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from the response
    const jsonMatch = text.match(/\[([\s\S]*?)\]/)?.[0] || '[]';
    const forms: FormResult[] = JSON.parse(jsonMatch);

    return NextResponse.json({ 
      forms,
      message: `Found ${forms.length} relevant forms for ${location?.state || 'your search'}.`,
      success: true 
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ 
      message: 'Failed to find relevant forms',
      success: false,
      forms: [] 
    }, { status: 500 });
  }
}
