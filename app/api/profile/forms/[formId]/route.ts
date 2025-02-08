import { NextResponse } from 'next/server';

// In a real app, this would update the database
export async function PUT(
  request: Request,
  { params }: { params: { formId: string } }
) {
  try {
    const { status } = await request.json();
    const { formId } = params;

    // For demo purposes, just return success
    // In a real app, you'd update the form status in the database
    return NextResponse.json({ success: true, formId, status });
  } catch (error) {
    console.error('Error updating form:', error);
    return NextResponse.json(
      { error: 'Failed to update form' },
      { status: 500 }
    );
  }
}
