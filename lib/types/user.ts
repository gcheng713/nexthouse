export interface User {
  id: string;
  email: string;
  name: string;
  profile: UserProfile;
  createdAt: string;
  lastLogin: string;
}

export interface UserProfile {
  state: string;
  county?: string;
  licenseNumber?: string;
  agencyName?: string;
  specializations: string[];
  savedSearches: string[];
}
