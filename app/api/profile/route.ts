import { NextResponse } from 'next/server';
import { RealtorProfile } from '@/lib/types/profile';

// In a real app, this would be a database
let profiles: RealtorProfile[] = [];

export async function GET() {
  // For demo purposes, return the first profile
  // In a real app, you'd get the profile based on the authenticated user
  return NextResponse.json(profiles[0] || null);
}

export async function POST(request: Request) {
  try {
    const profile = await request.json();
    
    // Generate an ID for the new profile
    const newProfile: RealtorProfile = {
      ...profile,
      id: Math.random().toString(36).substr(2, 9),
      savedForms: profile.savedForms || [],
      requiredForms: profile.requiredForms || []
    };

    // In a real app, you'd save this to a database
    profiles = [newProfile]; // For demo, just keep one profile

    return NextResponse.json(newProfile);
  } catch (error) {
    console.error('Error creating profile:', error);
    return NextResponse.json(
      { error: 'Failed to create profile' },
      { status: 500 }
    );
  }
}
