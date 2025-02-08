'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProgressSteps } from '@/components/ui/progress-steps';
import { RealtorProfile } from '@/lib/types/profile';
import { cn } from '@/lib/utils';

const SPECIALIZATIONS = [
  'Residential',
  'Commercial',
  'Industrial',
  'Luxury',
  'Investment',
  'Property Management',
  'Land',
  'New Construction'
];

const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
  'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
  'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
  'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
  'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma',
  'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee',
  'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<Partial<RealtorProfile>>({
    specializations: []
  });

  const handleSpecializationToggle = (specialization: string) => {
    setProfile(prev => ({
      ...prev,
      specializations: prev.specializations?.includes(specialization)
        ? prev.specializations.filter(s => s !== specialization)
        : [...(prev.specializations || []), specialization]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
      return;
    }

    setLoading(true);
    try {
      // Find forms for the realtor
      const formsResponse = await fetch('/api/forms/auto-find', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          state: profile.state,
          county: profile.county,
          specializations: profile.specializations
        })
      });

      const formsData = await formsResponse.json();

      if (formsData.success) {
        // Save profile and forms
        const response = await fetch('/api/profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...profile,
            savedForms: [],
            requiredForms: formsData.forms.required.map((form: any) => ({
              id: form.id || Math.random().toString(36).substr(2, 9),
              name: form.name,
              description: form.description,
              priority: form.priority,
              status: 'pending'
            }))
          })
        });

        if (response.ok) {
          router.push('/profile');
        }
      }
    } catch (error) {
      console.error('Error during onboarding:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20 p-4">
      <Card className="w-full max-w-2xl p-8 backdrop-blur-sm bg-background/80 border-muted/20 shadow-lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            Welcome to Your Future in Real Estate
          </h1>
          <p className="text-muted-foreground mb-8">Complete your profile to get started with personalized forms and resources.</p>
          
          <ProgressSteps
            currentStep={step}
            steps={['Personal Info', 'Location', 'Expertise']}
            className="mb-8"
          />
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={profile.name || ''}
                  onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email || ''}
                  onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="license">License Number (Optional)</Label>
                <Input
                  id="license"
                  value={profile.licenseNumber || ''}
                  onChange={(e) => setProfile(prev => ({ ...prev, licenseNumber: e.target.value }))}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="state">State</Label>
                <Select
                  value={profile.state}
                  onValueChange={(value) => setProfile(prev => ({ ...prev, state: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your state" />
                  </SelectTrigger>
                  <SelectContent>
                    {US_STATES.map(state => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="county">County (Optional)</Label>
                <Input
                  id="county"
                  value={profile.county || ''}
                  onChange={(e) => setProfile(prev => ({ ...prev, county: e.target.value }))}
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <Label>Specializations</Label>
              <div className="grid grid-cols-2 gap-2">
                {SPECIALIZATIONS.map(specialization => (
                  <Button
                    key={specialization}
                    type="button"
                    variant={profile.specializations?.includes(specialization) ? "default" : "outline"}
                    onClick={() => handleSpecializationToggle(specialization)}
                    className="justify-start"
                  >
                    {specialization}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <motion.div 
            className="flex justify-between pt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {step > 1 && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setStep(step - 1)}
                className="w-32 transition-all hover:border-primary"
              >
                ← Back
              </Button>
            )}
            <Button 
              type="submit" 
              disabled={loading}
              className={cn(
                "w-32 transition-all",
                step === 3 ? "bg-gradient-to-r from-primary to-primary/80" : ""
              )}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing
                </div>
              ) : (
                <>{step === 3 ? 'Complete →' : 'Next →'}</>
              )}
            </Button>
          </motion.div>
        </form>
        </motion.div>
      </Card>
    </div>
  );
}
