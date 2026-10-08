export type Priority = 'high' | 'medium' | 'low';

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  relationship: 'Family' | 'Partner' | 'Friend' | 'Guardian' | 'Colleague' | 'Other';
  isPrimary: boolean;
  notifyViaWhatsapp: boolean;
  notifyViaSMS: boolean;
  notifyViaCall: boolean;
}

export type IncidentCategory =
  | 'harassment'
  | 'poor-lighting'
  | 'unsafe-zone'
  | 'suspicious-activity'
  | 'stalking'
  | 'medical-emergency'
  | 'other';

export interface IncidentReport {
  id: string;
  category: IncidentCategory;
  title: string;
  description: string;
  locationName: string;
  latitude: number;
  longitude: number;
  severity: 1 | 2 | 3 | 4 | 5;
  isAnonymous: boolean;
  reporterName?: string;
  timestamp: string;
  upvotes: number;
  verified: boolean;
}

export type SafePlaceType = 'police' | 'hospital' | 'shelter' | 'safe-hub' | 'transit';

export interface SafePlace {
  id: string;
  name: string;
  type: SafePlaceType;
  address: string;
  phone: string;
  latitude: number;
  longitude: number;
  isOpen24Hours: boolean;
  distanceKm?: number;
}

export interface SOSAlert {
  id: string;
  timestamp: string;
  latitude: number;
  longitude: number;
  accuracyMeters?: number;
  address?: string;
  batteryLevel?: number;
  status: 'active' | 'resolved' | 'cancelled';
  dispatchedTo: string[];
  resolvedAt?: string;
  audioRecordingUrl?: string;
}

export interface SafeWalkSession {
  id: string;
  destinationName: string;
  destinationLat: number;
  destinationLng: number;
  originLat: number;
  originLng: number;
  currentLat: number;
  currentLng: number;
  estimatedMinutes: number;
  checkInIntervalMinutes: number;
  startedAt: string;
  lastCheckInAt: string;
  nextCheckInAt: string;
  status: 'active' | 'completed' | 'sos-triggered' | 'cancelled';
  trackingToken: string;
}

export interface UserProfile {
  name: string;
  phone: string;
  email: string;
  bloodGroup: string;
  emergencyNotes: string;
  primaryAddress: string;
}

export interface UserAccount extends UserProfile {
  id: string;
  avatarUrl?: string;
  createdAt?: string;
}

export type AuthMode = 'signin' | 'signup';

export type ChatMessageSender = 'user' | 'bot';

export interface ChatMessage {
  id: string;
  sender: ChatMessageSender;
  text: string;
  timestamp: string;
  action?: string;
}

