import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

export async function POST(request: Request) {
  try {
    const { message, location } = await request.json();
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // Create a simpler prompt that returns text instead of JSON
    const prompt = `As a real estate forms expert, help with finding forms in ${location?.state || 'any state'}.
    Question: ${message}

    Please provide:
    1. Names of relevant forms
    2. Where to find them
    3. When they are required
    4. Any special requirements

    Focus on official sources like state real estate boards and REALTOR® associations.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    return NextResponse.json({ 
      message: response.text(),
      success: true 
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ 
      message: 'Failed to get response from AI',
      success: false 
    }, { status: 500 });
  }
}
