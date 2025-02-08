export interface RealtorProfile {
  id: string;
  name: string;
  email: string;
  state: string;
  county?: string;
  licenseNumber?: string;
  specializations: string[];
  savedForms: SavedForm[];
  requiredForms: FormRequirement[];
}

export interface SavedForm {
  id: string;
  name: string;
  description: string;
  url: string;
  pdfUrl?: string;
  jurisdiction: string;
  lastAccessed: string;
  priority: 'required' | 'recommended' | 'optional';
}

export interface FormRequirement {
  id: string;
  name: string;
  description: string;
  priority: 'required' | 'recommended' | 'optional';
  dueDate?: string;
  status: 'pending' | 'completed' | 'expired';
}
