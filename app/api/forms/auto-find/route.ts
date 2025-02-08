import { NextResponse } from 'next/server';
import { AutoFormFinder, RealtorInfo } from '@/lib/services/autoFormFinder';

const formFinder = new AutoFormFinder(process.env.GOOGLE_AI_API_KEY || '');

export async function POST(request: Request) {
  try {
    const realtorInfo: RealtorInfo = await request.json();

    if (!realtorInfo.state) {
      return NextResponse.json({
        error: 'State is required',
        success: false
      }, { status: 400 });
    }

    // Find all essential forms for the realtor
    const forms = await formFinder.findEssentialForms(realtorInfo);

    // Group forms by priority
    const groupedForms = {
      required: forms.filter(f => f.priority === 'required'),
      recommended: forms.filter(f => f.priority === 'recommended'),
      optional: forms.filter(f => f.priority === 'optional')
    };

    return NextResponse.json({
      success: true,
      message: `Found ${forms.length} forms for ${realtorInfo.state}`,
      forms: groupedForms
    });

  } catch (error) {
    console.error('Error in auto-find forms:', error);
    return NextResponse.json({
      error: 'Failed to find forms',
      success: false
    }, { status: 500 });
  }
}

// Endpoint for finding specific form types
export async function PUT(request: Request) {
  try {
    const { realtorInfo, formType }: { realtorInfo: RealtorInfo; formType: string } = await request.json();

    if (!realtorInfo.state || !formType) {
      return NextResponse.json({
        error: 'State and form type are required',
        success: false
      }, { status: 400 });
    }

    const forms = await formFinder.findSpecificForm(realtorInfo, formType);

    return NextResponse.json({
      success: true,
      message: `Found ${forms.length} ${formType} forms for ${realtorInfo.state}`,
      forms
    });

  } catch (error) {
    console.error('Error finding specific form:', error);
    return NextResponse.json({
      error: 'Failed to find specific form',
      success: false
    }, { status: 500 });
  }
}
