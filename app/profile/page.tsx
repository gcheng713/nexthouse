'use client';

import { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RealtorProfile, SavedForm, FormRequirement } from '@/lib/types/profile';

export default function ProfilePage() {
  const [profile, setProfile] = useState<RealtorProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profile');
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const markFormComplete = async (formId: string) => {
    try {
      await fetch(`/api/profile/forms/${formId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'completed' })
      });
      fetchProfile();
    } catch (error) {
      console.error('Error updating form status:', error);
    }
  };

  if (loading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  if (!profile) {
    return <div className="container mx-auto p-4">Profile not found</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="grid gap-6">
        {/* Profile Header */}
        <Card className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold">{profile.name}</h1>
              <p className="text-gray-600">{profile.email}</p>
              <p className="text-sm mt-2">
                {profile.state}{profile.county ? `, ${profile.county} County` : ''}
              </p>
              {profile.licenseNumber && (
                <p className="text-sm">License: {profile.licenseNumber}</p>
              )}
            </div>
            <div className="text-right">
              <div className="flex flex-wrap gap-2 justify-end">
                {profile.specializations.map(spec => (
                  <span
                    key={spec}
                    className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Forms Tabs */}
        <Tabs defaultValue="required" className="w-full">
          <TabsList>
            <TabsTrigger value="required">Required Forms</TabsTrigger>
            <TabsTrigger value="saved">Saved Forms</TabsTrigger>
          </TabsList>

          <TabsContent value="required">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Required Forms</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Form Name</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {profile.requiredForms.map((form) => (
                    <TableRow key={form.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{form.name}</div>
                          <div className="text-sm text-gray-500">{form.description}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-sm ${
                          form.priority === 'required' ? 'bg-red-100 text-red-800' :
                          form.priority === 'recommended' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {form.priority}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-sm ${
                          form.status === 'completed' ? 'bg-green-100 text-green-800' :
                          form.status === 'expired' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {form.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        {form.status !== 'completed' && (
                          <Button
                            size="sm"
                            onClick={() => markFormComplete(form.id)}
                          >
                            Mark Complete
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="saved">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Saved Forms</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Form Name</TableHead>
                    <TableHead>Jurisdiction</TableHead>
                    <TableHead>Last Accessed</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {profile.savedForms.map((form) => (
                    <TableRow key={form.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{form.name}</div>
                          <div className="text-sm text-gray-500">{form.description}</div>
                        </div>
                      </TableCell>
                      <TableCell>{form.jurisdiction}</TableCell>
                      <TableCell>{new Date(form.lastAccessed).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="space-x-2">
                          <a
                            href={form.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            View
                          </a>
                          {form.pdfUrl && (
                            <a
                              href={form.pdfUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              PDF
                            </a>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
