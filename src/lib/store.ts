import { create } from 'zustand';
import { EmergencyContact, IncidentReport, SafePlace, SOSAlert, SafeWalkSession, UserProfile, UserAccount, AuthMode, ChatMessage } from './types';
import { INITIAL_CONTACTS, INITIAL_INCIDENTS, INITIAL_SAFE_PLACES, DEFAULT_USER_PROFILE, DEFAULT_USER_ACCOUNT, DEMO_ACCOUNTS } from './mockData';

interface SafeHerState {
  // Authentication
  isAuthenticated: boolean;
  currentUser: UserAccount | null;
  isAuthModalOpen: boolean;
  authModalMode: AuthMode;
  setAuthModalOpen: (open: boolean, mode?: AuthMode) => void;
  login: (emailOrPhone: string, password?: string) => { success: boolean; error?: string };
  signup: (accountData: Omit<UserAccount, 'id'>, password?: string) => { success: boolean; error?: string };
  logout: () => void;

  // User Profile
  userProfile: UserProfile;
  setUserProfile: (profile: Partial<UserProfile>) => void;

  // Contacts
  contacts: EmergencyContact[];
  addContact: (contact: Omit<EmergencyContact, 'id'>) => void;
  updateContact: (id: string, contact: Partial<EmergencyContact>) => void;
  deleteContact: (id: string) => void;

  // Location
  currentLocation: { lat: number; lng: number; accuracy?: number; address?: string } | null;
  setCurrentLocation: (loc: { lat: number; lng: number; accuracy?: number; address?: string }) => void;

  // SOS Engine
  isSOSActive: boolean;
  activeAlert: SOSAlert | null;
  alertHistory: SOSAlert[];
  triggerSOS: (location?: { lat: number; lng: number; address?: string }) => SOSAlert;
  resolveSOS: (id: string) => void;
  cancelSOS: () => void;

  // Incidents
  incidents: IncidentReport[];
  addIncident: (incident: Omit<IncidentReport, 'id' | 'timestamp' | 'upvotes' | 'verified'>) => void;
  upvoteIncident: (id: string) => void;

  // Safe Places
  safePlaces: SafePlace[];

  // SafeWalk
  activeSafeWalk: SafeWalkSession | null;
  startSafeWalk: (destination: { name: string; lat: number; lng: number }, minutes: number, checkInMinutes: number) => void;
  checkInSafeWalk: () => void;
  endSafeWalk: () => void;

  // SOS Countdown Modal
  isSOSCountdownOpen: boolean;
  setSOSCountdownOpen: (open: boolean) => void;

  // AI Chatbot
  isChatOpen: boolean;
  setChatOpen: (open: boolean) => void;
  chatMessages: ChatMessage[];
  addChatMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  clearChatMessages: () => void;
}

export const useSafeHerStore = create<SafeHerState>((set, get) => ({
  // Authentication implementation
  isAuthenticated: true,
  currentUser: DEFAULT_USER_ACCOUNT,
  isAuthModalOpen: false,
  authModalMode: 'signin',
  setAuthModalOpen: (open, mode = 'signin') => set({ isAuthModalOpen: open, authModalMode: mode }),

  login: (emailOrPhone, password) => {
    const cleanInput = emailOrPhone.trim().toLowerCase();
    // Check demo accounts first
    const demo = DEMO_ACCOUNTS.find(
      (a) => a.email.toLowerCase() === cleanInput || a.phone.includes(cleanInput) || a.name.toLowerCase() === cleanInput
    );
    if (demo) {
      const { password: _, ...account } = demo;
      set({
        isAuthenticated: true,
        currentUser: account,
        userProfile: account,
        isAuthModalOpen: false,
      });
      return { success: true };
    }

    // Allow custom login for any valid email/phone
    if (cleanInput.length >= 3) {
      const customUser: UserAccount = {
        id: `usr-${Date.now()}`,
        name: cleanInput.includes('@') ? cleanInput.split('@')[0].replace('.', ' ') : 'Verified User',
        email: cleanInput.includes('@') ? cleanInput : `${cleanInput}@safeher.app`,
        phone: cleanInput.includes('@') ? '+91 9XXXXXXXXX' : cleanInput,
        bloodGroup: 'O+ Positive',
        emergencyNotes: 'Protected by SafeHer Emergency Network.',
        primaryAddress: 'Connaught Place, Central Delhi, 110001',
        createdAt: new Date().toISOString().split('T')[0],
      };
      set({
        isAuthenticated: true,
        currentUser: customUser,
        userProfile: customUser,
        isAuthModalOpen: false,
      });
      return { success: true };
    }

    return { success: false, error: 'Please enter a valid email or phone number.' };
  },

  signup: (accountData, password) => {
    if (!accountData.name || !accountData.phone || !accountData.email) {
      return { success: false, error: 'Name, phone number, and email are required.' };
    }

    const newAccount: UserAccount = {
      ...accountData,
      id: `usr-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };

    set({
      isAuthenticated: true,
      currentUser: newAccount,
      userProfile: {
        name: newAccount.name,
        phone: newAccount.phone,
        email: newAccount.email,
        bloodGroup: newAccount.bloodGroup || 'O+ Positive',
        emergencyNotes: newAccount.emergencyNotes || '',
        primaryAddress: newAccount.primaryAddress || '',
      },
      isAuthModalOpen: false,
    });

    return { success: true };
  },

  logout: () => {
    set({
      isAuthenticated: false,
      currentUser: null,
      userProfile: {
        name: 'Guest User',
        phone: '',
        email: '',
        bloodGroup: 'Not Specified',
        emergencyNotes: '',
        primaryAddress: '',
      },
    });
  },

  userProfile: DEFAULT_USER_PROFILE,
  setUserProfile: (profile) =>
    set((state) => {
      const updated = { ...state.userProfile, ...profile };
      return {
        userProfile: updated,
        currentUser: state.currentUser ? { ...state.currentUser, ...updated } : null,
      };
    }),

  contacts: INITIAL_CONTACTS,
  addContact: (contactData) =>
    set((state) => ({
      contacts: [
        ...state.contacts,
        { ...contactData, id: `contact-${Date.now()}` },
      ],
    })),
  updateContact: (id, updated) =>
    set((state) => ({
      contacts: state.contacts.map((c) => (c.id === id ? { ...c, ...updated } : c)),
    })),
  deleteContact: (id) =>
    set((state) => ({
      contacts: state.contacts.filter((c) => c.id !== id),
    })),

  currentLocation: {
    lat: 28.6139,
    lng: 77.2090,
    address: 'Connaught Place, Central Delhi, 110001',
    accuracy: 12,
  },
  setCurrentLocation: (loc) => set({ currentLocation: loc }),

  isSOSActive: false,
  activeAlert: null,
  alertHistory: [],

  triggerSOS: (overrideLoc) => {
    const loc = overrideLoc || get().currentLocation || { lat: 28.6139, lng: 77.2090, address: 'Live Location Captured' };
    const primaryContacts = get().contacts.filter((c) => c.isPrimary);
    const recipientNames = primaryContacts.length > 0 ? primaryContacts.map((c) => c.name) : ['Emergency Services (112)'];

    const newAlert: SOSAlert = {
      id: `sos-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      latitude: loc.lat,
      longitude: loc.lng,
      address: loc.address || `GPS: ${loc.lat.toFixed(4)}, ${loc.lng.toFixed(4)}`,
      batteryLevel: 84,
      status: 'active',
      dispatchedTo: recipientNames,
    };

    set((state) => ({
      isSOSActive: true,
      activeAlert: newAlert,
      alertHistory: [newAlert, ...state.alertHistory],
      isSOSCountdownOpen: false,
    }));

    return newAlert;
  },

  resolveSOS: (id) =>
    set((state) => ({
      isSOSActive: false,
      activeAlert: null,
      alertHistory: state.alertHistory.map((a) =>
        a.id === id
          ? {
              ...a,
              status: 'resolved',
              resolvedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            }
          : a
      ),
    })),

  cancelSOS: () => set({ isSOSActive: false, activeAlert: null, isSOSCountdownOpen: false }),

  incidents: INITIAL_INCIDENTS,
  addIncident: (incData) =>
    set((state) => ({
      incidents: [
        {
          ...incData,
          id: `inc-${Date.now()}`,
          timestamp: 'Just now',
          upvotes: 1,
          verified: false,
        },
        ...state.incidents,
      ],
    })),
  upvoteIncident: (id) =>
    set((state) => ({
      incidents: state.incidents.map((inc) =>
        inc.id === id ? { ...inc, upvotes: inc.upvotes + 1 } : inc
      ),
    })),

  safePlaces: INITIAL_SAFE_PLACES,

  activeSafeWalk: null,
  startSafeWalk: (dest, minutes, checkInMinutes) => {
    const loc = get().currentLocation || { lat: 28.6139, lng: 77.2090 };
    const now = new Date();
    const nextCheckIn = new Date(now.getTime() + checkInMinutes * 60000);

    const session: SafeWalkSession = {
      id: `walk-${Date.now()}`,
      destinationName: dest.name,
      destinationLat: dest.lat,
      destinationLng: dest.lng,
      originLat: loc.lat,
      originLng: loc.lng,
      currentLat: loc.lat,
      currentLng: loc.lng,
      estimatedMinutes: minutes,
      checkInIntervalMinutes: checkInMinutes,
      startedAt: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      lastCheckInAt: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      nextCheckInAt: nextCheckIn.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'active',
      trackingToken: Math.random().toString(36).substring(2, 10),
    };

    set({ activeSafeWalk: session });
  },

  checkInSafeWalk: () =>
    set((state) => {
      if (!state.activeSafeWalk) return {};
      const now = new Date();
      const nextCheckIn = new Date(now.getTime() + state.activeSafeWalk.checkInIntervalMinutes * 60000);
      return {
        activeSafeWalk: {
          ...state.activeSafeWalk,
          lastCheckInAt: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          nextCheckInAt: nextCheckIn.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      };
    }),

  endSafeWalk: () =>
    set((state) => ({
      activeSafeWalk: state.activeSafeWalk
        ? { ...state.activeSafeWalk, status: 'completed' }
        : null,
    })),

  isSOSCountdownOpen: false,
  setSOSCountdownOpen: (open) => set({ isSOSCountdownOpen: open }),

  isChatOpen: false,
  setChatOpen: (open) => set({ isChatOpen: open }),
  chatMessages: [],
  addChatMessage: (msg) =>
    set((state) => ({
      chatMessages: [
        ...state.chatMessages,
        {
          ...msg,
          id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ],
    })),
  clearChatMessages: () => set({ chatMessages: [] }),
}));
