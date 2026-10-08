'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import {
  ShieldAlert,
  ShieldCheck,
  MapPin,
  Users,
  Radio,
  AlertTriangle,
  PhoneCall,
  Volume2,
  VolumeX,
  ArrowRight,
  User,
  Flame,
  CheckCircle2,
  Clock,
  ExternalLink,
  Plus,
  Trash2,
  Phone,
  MessageSquare,
  Lock,
  Mic,
  LogIn,
  LogOut,
  UserPlus,
  ChevronDown,
} from 'lucide-react';
import { useSafeHerStore } from '@/lib/store';
import { StatusBadgePill } from '@/components/dashboard/StatusBadgePill';
import { safeAudio } from '@/lib/audio';
import { safeSpeech } from '@/lib/speech';

// Dynamic import for Leaflet Map to avoid SSR issues
const SafetyMap = dynamic(
  () => import('@/components/map/SafetyMap').then((mod) => mod.SafetyMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[460px] rounded-2xl bg-[#F9FAFB] border border-[#E5E7EB] flex items-center justify-center animate-pulse">
        <div className="text-center space-y-2">
          <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center mx-auto text-black">
            <MapPin className="w-5 h-5" />
          </div>
          <p className="text-xs font-semibold text-[#6B7280]">Loading Live Safety Map...</p>
        </div>
      </div>
    ),
  }
);

export const SafeHerMonochromeApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'profile' | 'map' | 'safewalk' | 'tools' | 'logs'
  >('profile');

  // Zustand state
  const userProfile = useSafeHerStore((state) => state.userProfile);
  const setUserProfile = useSafeHerStore((state) => state.setUserProfile);
  const contacts = useSafeHerStore((state) => state.contacts);
  const addContact = useSafeHerStore((state) => state.addContact);
  const deleteContact = useSafeHerStore((state) => state.deleteContact);
  const isSOSActive = useSafeHerStore((state) => state.isSOSActive);
  const setSOSCountdownOpen = useSafeHerStore((state) => state.setSOSCountdownOpen);
  const currentLocation = useSafeHerStore((state) => state.currentLocation);
  const activeSafeWalk = useSafeHerStore((state) => state.activeSafeWalk);
  const startSafeWalk = useSafeHerStore((state) => state.startSafeWalk);
  const checkInSafeWalk = useSafeHerStore((state) => state.checkInSafeWalk);
  const endSafeWalk = useSafeHerStore((state) => state.endSafeWalk);
  const setChatOpen = useSafeHerStore((state) => state.setChatOpen);
  const isAuthenticated = useSafeHerStore((state) => state.isAuthenticated);
  const currentUser = useSafeHerStore((state) => state.currentUser);
  const setAuthModalOpen = useSafeHerStore((state) => state.setAuthModalOpen);
  const logout = useSafeHerStore((state) => state.logout);

  // User menu dropdown
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Profile Form States
  const [name, setName] = useState(userProfile.name);
  const [phone, setPhone] = useState(userProfile.phone);
  const [email, setEmail] = useState(userProfile.email);
  const [bloodGroup, setBloodGroup] = useState(userProfile.bloodGroup);
  const [emergencyNotes, setEmergencyNotes] = useState(userProfile.emergencyNotes);
  const [guardianName, setGuardianName] = useState('');
  const [guardianPhone, setGuardianPhone] = useState('');
  const [guardianRelation, setGuardianRelation] = useState<'Family' | 'Partner' | 'Guardian' | 'Friend'>('Family');
  const [profileSuccess, setProfileSuccess] = useState(false);

  // Sync profile inputs when user logs in or switches account
  useEffect(() => {
    setName(userProfile.name || '');
    setPhone(userProfile.phone || '');
    setEmail(userProfile.email || '');
    setBloodGroup(userProfile.bloodGroup || 'O+ Positive');
    setEmergencyNotes(userProfile.emergencyNotes || '');
  }, [userProfile]);

  // SafeWalk Form States
  const [destination, setDestination] = useState('Central Metro Station');
  const [walkMinutes, setWalkMinutes] = useState(20);
  const [walkInterval, setWalkInterval] = useState(5);
  const [remainingSecs, setRemainingSecs] = useState(1200);

  // Discreet Tools States
  const [fakeCallerName, setFakeCallerName] = useState('Dad');
  const [fakeCallDelay, setFakeCallDelay] = useState(3);
  const [fakeCallState, setFakeCallState] = useState<'idle' | 'waiting' | 'ringing' | 'connected'>('idle');
  const [isSirenPlaying, setIsSirenPlaying] = useState(false);

  // SafeWalk countdown
  useEffect(() => {
    if (!activeSafeWalk) return;
    const timer = setInterval(() => {
      setRemainingSecs((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [activeSafeWalk]);

  // Trigger SOS modal when SafeWalk timer hits 0
  useEffect(() => {
    if (activeSafeWalk && remainingSecs === 0) {
      setSOSCountdownOpen(true);
    }
  }, [activeSafeWalk, remainingSecs, setSOSCountdownOpen]);

  // Clean audio on unmount
  useEffect(() => {
    return () => {
      safeAudio.stopSiren();
      safeAudio.stopRingtone();
    };
  }, []);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    setUserProfile({
      name,
      phone,
      email,
      bloodGroup,
      emergencyNotes,
    });

    if (guardianName && guardianPhone) {
      addContact({
        name: guardianName,
        phone: guardianPhone,
        relationship: guardianRelation,
        isPrimary: true,
        notifyViaWhatsapp: true,
        notifyViaSMS: true,
        notifyViaCall: false,
      });
      setGuardianName('');
      setGuardianPhone('');
    }

    setProfileSuccess(true);
    setTimeout(() => setProfileSuccess(false), 3000);
  };

  const handleStartSafeWalk = (e: React.FormEvent) => {
    e.preventDefault();
    startSafeWalk(
      {
        name: destination,
        lat: (currentLocation?.lat || 28.6139) + 0.012,
        lng: (currentLocation?.lng || 77.2090) + 0.012,
      },
      walkMinutes,
      walkInterval
    );
  };

  const handleEndSafeWalk = async () => {
    endSafeWalk();
    try {
      const confettiMod = await import('canvas-confetti');
      const shoot = confettiMod.default || confettiMod;
      if (typeof shoot === 'function') {
        shoot({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    } catch (e) {
      // Safe fallback if canvas-confetti cannot run
    }
  };

  const handleTriggerFakeCall = () => {
    setFakeCallState('waiting');
    setTimeout(() => {
      setFakeCallState('ringing');
      safeAudio.startRingtone();
    }, fakeCallDelay * 1000);
  };

  const handleAcceptFakeCall = () => {
    safeAudio.stopRingtone();
    setFakeCallState('connected');
    setTimeout(() => {
      safeSpeech.speak(`Hey, I am waiting outside in the car right now. Please come out immediately.`);
    }, 500);
  };

  const handleEndFakeCall = () => {
    safeAudio.stopRingtone();
    setFakeCallState('idle');
  };

  const toggleSiren = () => {
    if (isSirenPlaying) {
      safeAudio.stopSiren();
      setIsSirenPlaying(false);
    } else {
      safeAudio.startSiren();
      setIsSirenPlaying(true);
    }
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#000000] font-satoshi flex flex-col justify-between">
      
      {/* ========================================================
          STICKY HEADER
         ======================================================== */}
      <header className="sticky top-0 z-30 bg-[#FFFFFF] border-b border-[#F3F4F6] px-4 sm:px-8 py-6">
        <div className="max-w-[896px] mx-auto flex items-center justify-between">
          {/* Left Brand Container */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#000000] flex items-center justify-center text-[#FFFFFF] shadow-sm">
              <ShieldAlert className="w-4 h-4 text-white" />
            </div>
            <span className="font-general font-bold text-xl tracking-tight text-[#000000]">
              SafeHer
            </span>
          </div>

          {/* Right Action Suite */}
          <div className="flex items-center gap-3">
            {/* System Status */}
            <div className="hidden sm:flex items-center gap-2 mr-2">
              <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
              <span className="text-[10px] font-general font-bold uppercase tracking-widest text-[#6B7280]">
                System Armed
              </span>
            </div>

            {/* Emergency SOS Button */}
            <button
              onClick={() => setSOSCountdownOpen(true)}
              className="h-10 px-4 rounded-xl bg-[#000000] hover:bg-[#262626] text-[#FFFFFF] text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-xs"
            >
              <Flame className="w-4 h-4 fill-current text-[#22C55E]" />
              <span>SOS Distress (5s)</span>
            </button>

            {/* AI Safety Assistant Button */}
            <button
              onClick={() => setChatOpen(true)}
              className="w-10 h-10 rounded-xl bg-[#F3F4F6] hover:bg-black hover:text-white text-[#374151] flex items-center justify-center transition-all cursor-pointer shadow-xs"
              title="Open SafeHer AI Assistant"
            >
              <Mic className="w-4 h-4" />
            </button>

            {/* Authentication Suite */}
            {isAuthenticated && currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 h-10 px-2.5 rounded-full bg-[#F3F4F6] hover:bg-[#E5E7EB] border border-[#E5E7EB] shadow-xs cursor-pointer transition-colors"
                  title="Account Menu"
                >
                  <div className="relative w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-[11px] font-bold">
                    {currentUser.name.charAt(0)}
                    <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#22C55E] border-2 border-white" />
                  </div>
                  <span className="hidden sm:inline text-xs font-bold text-black max-w-[100px] truncate">
                    {currentUser.name.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#6B7280]" />
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-[#E5E7EB] shadow-xl p-3 z-50 animate-fade-in space-y-2">
                      <div className="px-3 py-2 border-b border-[#F3F4F6]">
                        <p className="text-xs font-bold text-black truncate">{currentUser.name}</p>
                        <p className="text-[11px] text-[#6B7280] truncate">{currentUser.email}</p>
                        <div className="mt-1.5 flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded-full bg-[#F0FDF4] text-[#15803d] text-[10px] font-bold">
                            {currentUser.bloodGroup}
                          </span>
                          <span className="text-[10px] text-[#6B7280] font-medium">Verified ID</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <button
                          onClick={() => {
                            setActiveTab('profile');
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full h-9 px-3 rounded-xl text-left text-xs font-semibold text-black hover:bg-[#F3F4F6] flex items-center gap-2 transition-colors cursor-pointer"
                        >
                          <User className="w-3.5 h-3.5 text-[#6B7280]" />
                          <span>View Safety Profile</span>
                        </button>

                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            setAuthModalOpen(true, 'signin');
                          }}
                          className="w-full h-9 px-3 rounded-xl text-left text-xs font-semibold text-black hover:bg-[#F3F4F6] flex items-center gap-2 transition-colors cursor-pointer"
                        >
                          <LogIn className="w-3.5 h-3.5 text-[#6B7280]" />
                          <span>Switch Account</span>
                        </button>

                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            logout();
                          }}
                          className="w-full h-9 px-3 rounded-xl text-left text-xs font-semibold text-[#DC2626] hover:bg-[#FEF2F2] flex items-center gap-2 transition-colors cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5 text-[#DC2626]" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setAuthModalOpen(true, 'signin')}
                  className="h-10 px-3.5 rounded-xl border border-[#E5E7EB] bg-white hover:bg-[#F9FAFB] text-black text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                >
                  <LogIn className="w-3.5 h-3.5 text-black" />
                  <span>Sign In</span>
                </button>
                <button
                  onClick={() => setAuthModalOpen(true, 'signup')}
                  className="h-10 px-3.5 rounded-xl bg-black hover:bg-[#262626] text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                >
                  <UserPlus className="w-3.5 h-3.5 text-[#22C55E]" />
                  <span>Sign Up</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ========================================================
          MAIN CONTENT AREA (Max-width: 896px)
         ======================================================== */}
      <main className="max-w-[896px] w-full mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8 flex-1">
        
        {/* ========================================================
            BENTO-STYLE STATS GRID (3 Columns Desktop, 1 Mobile)
           ======================================================== */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Protected Journeys */}
          <div className="rounded-2xl border border-[#F3F4F6] bg-[#FFFFFF] p-6 flat-shadow space-y-2">
            <span className="text-sm font-medium text-[#6B7280]">Protected SafeWalks</span>
            <div className="text-3xl font-general font-bold text-[#000000] tracking-tight">
              340
            </div>
          </div>

          {/* Card 2: Connected Guardians */}
          <div className="rounded-2xl border border-[#F3F4F6] bg-[#FFFFFF] p-6 flat-shadow space-y-2">
            <span className="text-sm font-medium text-[#6B7280]">Emergency Guardians</span>
            <div className="text-3xl font-general font-bold text-[#000000] tracking-tight">
              0{contacts.length}
            </div>
          </div>

          {/* Card 3: Safe Hubs Nearby */}
          <div className="rounded-2xl border border-[#F3F4F6] bg-[#FFFFFF] p-6 flat-shadow space-y-2">
            <span className="text-sm font-medium text-[#6B7280]">Nearby Safe Hubs</span>
            <div className="text-3xl font-general font-bold text-[#000000] tracking-tight">
              12 Places
            </div>
          </div>
        </section>

        {/* ========================================================
            TABBED SAFETY SUITE CARD (Max-width 896px, 24px Radius)
           ======================================================== */}
        <section className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-3xl flat-shadow overflow-hidden">
          
          {/* Top Horizontal Tab Navigation */}
          <div className="flex border-b border-[#F3F4F6] px-4 sm:px-8 overflow-x-auto">
            {[
              { id: 'profile', label: 'Safety Profile & Circle' },
              { id: 'map', label: 'Interactive Safe Map' },
              { id: 'safewalk', label: 'SafeWalk Guardian' },
              { id: 'tools', label: 'Discreet Utilities' },
              { id: 'logs', label: 'Safety Logs' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-5 px-4 text-sm font-semibold whitespace-nowrap transition-all duration-300 relative cursor-pointer ${
                  activeTab === tab.id
                    ? 'text-[#000000] border-b-2 border-[#000000]'
                    : 'text-[#9CA3AF] hover:text-[#000000]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* ========================================================
              TAB 1: SAFETY PROFILE & GUARDIAN REGISTRATION
             ======================================================== */}
          {activeTab === 'profile' && (
            <div className="p-6 sm:p-12 space-y-8 animate-fade-in">
              <div className="space-y-1">
                <h2 className="font-general font-bold text-2xl tracking-tight text-[#000000]">
                  Safety Profile & Emergency Guardians
                </h2>
                <p className="text-sm text-[#6B7280]">
                  Configure your verified personal credentials, medical notes, and primary trusted contacts.
                </p>
              </div>

              {/* Account Status / Guest Callout Banner */}
              {isAuthenticated && currentUser ? (
                <div className="p-4 rounded-2xl bg-[#F9FAFB] border border-[#E5E7EB] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center font-bold text-sm">
                      {currentUser.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-black">{currentUser.name}</h3>
                        <span className="px-2 py-0.5 rounded-full bg-[#F0FDF4] border border-[#22C55E]/30 text-[#15803d] text-[10px] font-bold">
                          Verified Member
                        </span>
                      </div>
                      <p className="text-xs text-[#6B7280]">
                        {currentUser.email} • {currentUser.phone}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => setAuthModalOpen(true, 'signin')}
                      className="flex-1 sm:flex-initial h-8 px-3 rounded-lg border border-[#E5E7EB] bg-white hover:bg-[#F9FAFB] text-xs font-semibold text-black transition-colors cursor-pointer"
                    >
                      Switch Account
                    </button>
                    <button
                      type="button"
                      onClick={logout}
                      className="flex-1 sm:flex-initial h-8 px-3 rounded-lg border border-[#EF4444]/20 bg-[#FEF2F2] hover:bg-[#FEE2E2] text-xs font-semibold text-[#DC2626] transition-colors cursor-pointer"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-5 rounded-2xl bg-[#FFFBEB] border border-[#F59E0B]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#F59E0B] text-white flex items-center justify-center flex-shrink-0">
                      <ShieldAlert className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#92400E]">
                        You are currently in Guest Mode
                      </h3>
                      <p className="text-xs text-[#B45309] mt-0.5">
                        Sign in or create a free SafeHer account to sync your verified emergency guardians and medical vault securely.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => setAuthModalOpen(true, 'signin')}
                      className="flex-1 sm:flex-initial h-9 px-4 rounded-xl bg-black text-white text-xs font-bold hover:bg-[#262626] transition-all cursor-pointer shadow-xs"
                    >
                      Sign In
                    </button>
                    <button
                      type="button"
                      onClick={() => setAuthModalOpen(true, 'signup')}
                      className="flex-1 sm:flex-initial h-9 px-4 rounded-xl border border-[#D97706] bg-white text-[#92400E] text-xs font-bold hover:bg-[#FEF3C7] transition-all cursor-pointer shadow-xs"
                    >
                      Register
                    </button>
                  </div>
                </div>
              )}

              {profileSuccess && (
                <div className="p-4 rounded-xl bg-[#F0FDF4] border border-[#22C55E]/30 text-sm text-[#15803d] font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#22C55E]" />
                  <span>Safety profile and emergency circle updated successfully!</span>
                </div>
              )}

              <form onSubmit={handleProfileSave} className="space-y-6">
                {/* 2-Column Inputs Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[#374151] block">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. ABCD User"
                      className="w-full h-12 px-4 rounded-xl border border-[#E5E7EB] bg-[#FFFFFF] text-sm text-[#000000] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#000000] transition-colors"
                    />
                  </div>

                  {/* Primary Phone */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[#374151] block">
                      Primary Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 9XXXXXXXXX"
                      className="w-full h-12 px-4 rounded-xl border border-[#E5E7EB] bg-[#FFFFFF] text-sm text-[#000000] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#000000] transition-colors"
                    />
                  </div>

                  {/* Email Address */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[#374151] block">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="demo.abcd@example.com"
                      className="w-full h-12 px-4 rounded-xl border border-[#E5E7EB] bg-[#FFFFFF] text-sm text-[#000000] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#000000] transition-colors"
                    />
                  </div>

                  {/* Blood Group */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[#374151] block">
                      Blood Group
                    </label>
                    <select
                      value={bloodGroup}
                      onChange={(e) => setBloodGroup(e.target.value)}
                      className="w-full h-12 px-4 rounded-xl border border-[#E5E7EB] bg-[#FFFFFF] text-sm text-[#000000] focus:outline-none focus:border-[#000000] transition-colors font-medium"
                    >
                      <option value="O+ Positive">O+ Positive</option>
                      <option value="O- Negative">O- Negative</option>
                      <option value="A+ Positive">A+ Positive</option>
                      <option value="A- Negative">A- Negative</option>
                      <option value="B+ Positive">B+ Positive</option>
                      <option value="B- Negative">B- Negative</option>
                      <option value="AB+ Positive">AB+ Positive</option>
                      <option value="AB- Negative">AB- Negative</option>
                    </select>
                  </div>
                </div>

                {/* Emergency Medical Notes */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#374151] block">
                    Emergency Medical Notes (Allergies / Critical Info)
                  </label>
                  <textarea
                    rows={2}
                    value={emergencyNotes}
                    onChange={(e) => setEmergencyNotes(e.target.value)}
                    placeholder="e.g. Allergic to Penicillin. Carries asthma inhaler."
                    className="w-full p-4 rounded-xl border border-[#E5E7EB] bg-[#FFFFFF] text-sm text-[#000000] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#000000] transition-colors"
                  />
                </div>

                {/* Add Guardian Sub-Section */}
                <div className="pt-6 border-t border-[#F3F4F6] space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-general font-bold text-lg text-[#000000]">
                        Add Primary Guardian Contact
                      </h3>
                      <p className="text-xs text-[#6B7280]">
                        Receives immediate distress coordinates via WhatsApp & SMS.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <input
                      type="text"
                      placeholder="Guardian Name (e.g. Mom)"
                      value={guardianName}
                      onChange={(e) => setGuardianName(e.target.value)}
                      className="w-full h-12 px-4 rounded-xl border border-[#E5E7EB] text-sm text-[#000000] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#000000]"
                    />
                    <input
                      type="tel"
                      placeholder="Phone (+91 9XXXXXXXX1)"
                      value={guardianPhone}
                      onChange={(e) => setGuardianPhone(e.target.value)}
                      className="w-full h-12 px-4 rounded-xl border border-[#E5E7EB] text-sm text-[#000000] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#000000]"
                    />
                    <select
                      value={guardianRelation}
                      onChange={(e) => setGuardianRelation(e.target.value as any)}
                      className="w-full h-12 px-4 rounded-xl border border-[#E5E7EB] text-sm text-[#000000] focus:outline-none focus:border-[#000000]"
                    >
                      <option value="Family">Family</option>
                      <option value="Partner">Partner</option>
                      <option value="Guardian">Guardian</option>
                      <option value="Friend">Friend</option>
                    </select>
                  </div>
                </div>

                {/* Guardian Contacts List */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider block">
                    Active Guardians ({contacts.length})
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {contacts.map((c) => (
                      <div
                        key={c.id}
                        className="p-3.5 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] flex items-center justify-between"
                      >
                        <div>
                          <span className="text-sm font-semibold text-[#000000] block">{c.name}</span>
                          <span className="text-xs font-mono text-[#6B7280]">{c.phone} ({c.relationship})</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => deleteContact(c.id)}
                          className="p-2 text-[#6B7280] hover:text-[#000000] transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Action Bar */}
                <div className="pt-6 border-t border-[#F9FAFB] flex items-center justify-end">
                  <button
                    type="submit"
                    className="h-12 px-6 rounded-xl bg-[#000000] hover:bg-[#262626] text-[#FFFFFF] font-semibold text-sm transition-all duration-200 flex items-center gap-2 shadow-xs cursor-pointer"
                  >
                    <span>Save Safety Settings</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ========================================================
              TAB 2: INTERACTIVE LIVE SAFETY MAP
             ======================================================== */}
          {activeTab === 'map' && (
            <div className="p-6 sm:p-8 space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="font-general font-bold text-2xl tracking-tight text-[#000000]">
                    Live Safety Map & Nearby Hubs
                  </h2>
                  <p className="text-sm text-[#6B7280]">
                    Verified 24/7 police stations, women shelters, and emergency hospitals.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href="tel:112"
                    className="h-10 px-4 rounded-xl bg-[#000000] text-white text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#22C55E]" />
                    <span>Police (112)</span>
                  </a>
                  <a
                    href="tel:1091"
                    className="h-10 px-4 rounded-xl border border-[#E5E7EB] text-xs font-semibold flex items-center gap-1.5 hover:bg-[#F9FAFB]"
                  >
                    <span>Women Desk (1091)</span>
                  </a>
                </div>
              </div>

              <SafetyMap selectedCategory="all" />
            </div>
          )}

          {/* ========================================================
              TAB 3: SAFEWALK JOURNEY GUARDIAN
             ======================================================== */}
          {activeTab === 'safewalk' && (
            <div className="p-6 sm:p-12 space-y-8 animate-fade-in">
              <div className="space-y-1">
                <h2 className="font-general font-bold text-2xl tracking-tight text-[#000000]">
                  SafeWalk Commute Guardian
                </h2>
                <p className="text-sm text-[#6B7280]">
                  Monitors your commute with periodic check-ins. Missing check-ins auto-escalates to SOS.
                </p>
              </div>

              {!activeSafeWalk ? (
                <form onSubmit={handleStartSafeWalk} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-[#374151] block">
                        Destination
                      </label>
                      <input
                        type="text"
                        required
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        placeholder="e.g. Home, Metro Station"
                        className="w-full h-12 px-4 rounded-xl border border-[#E5E7EB] text-sm text-[#000000] focus:outline-none focus:border-[#000000]"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-[#374151] block">
                        Estimated Commute Time (Minutes)
                      </label>
                      <input
                        type="number"
                        min="2"
                        max="180"
                        value={walkMinutes}
                        onChange={(e) => setWalkMinutes(Number(e.target.value))}
                        className="w-full h-12 px-4 rounded-xl border border-[#E5E7EB] text-sm text-[#000000] focus:outline-none focus:border-[#000000]"
                      />
                    </div>
                  </div>

                  <div className="pt-6 border-t border-[#F9FAFB] flex items-center justify-end">
                    <button
                      type="submit"
                      className="h-12 px-6 rounded-xl bg-[#000000] hover:bg-[#262626] text-[#FFFFFF] font-semibold text-sm transition-all duration-200 flex items-center gap-2 cursor-pointer"
                    >
                      <Radio className="w-4 h-4 text-[#22C55E]" />
                      <span>Start SafeWalk Session</span>
                    </button>
                  </div>
                </form>
              ) : (
                <div className="p-8 rounded-2xl border border-[#E5E7EB] bg-[#F9FAFB] text-center space-y-6">
                  <div className="flex items-center justify-center gap-2 text-xs font-semibold text-[#22C55E]">
                    <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-ping" />
                    <span>SafeWalk Session Active</span>
                  </div>

                  <div>
                    <div className="text-5xl sm:text-6xl font-general font-bold text-[#000000] tracking-tight">
                      {formatTimer(remainingSecs)}
                    </div>
                    <p className="text-xs text-[#6B7280] mt-2">
                      Destination: <strong>{activeSafeWalk.destinationName}</strong>
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-4">
                    <button
                      onClick={checkInSafeWalk}
                      className="h-12 px-6 rounded-xl border border-[#E5E7EB] bg-[#FFFFFF] hover:bg-[#F3F4F6] text-sm font-semibold text-[#000000] flex items-center gap-2 cursor-pointer shadow-xs"
                    >
                      <ShieldCheck className="w-4 h-4 text-[#22C55E]" />
                      <span>Check-in: I am Safe</span>
                    </button>

                    <button
                      onClick={handleEndSafeWalk}
                      className="h-12 px-6 rounded-xl bg-[#000000] hover:bg-[#262626] text-white text-sm font-semibold flex items-center gap-2 cursor-pointer shadow-xs"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>I Have Arrived Safely</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================
              TAB 4: DISCREET SAFETY UTILITIES (Fake Call & Siren)
             ======================================================== */}
          {activeTab === 'tools' && (
            <div className="p-6 sm:p-12 space-y-8 animate-fade-in">
              <div className="space-y-1">
                <h2 className="font-general font-bold text-2xl tracking-tight text-[#000000]">
                  Discreet Safety Utilities
                </h2>
                <p className="text-sm text-[#6B7280]">
                  Immediate exit mechanisms and acoustic alarm deterrents.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Fake Call Card */}
                <div className="p-6 rounded-2xl border border-[#E5E7EB] bg-[#FFFFFF] space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-[#F3F4F6] flex items-center justify-center text-[#000000]">
                    <PhoneCall className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-general font-bold text-lg text-[#000000]">
                      Simulated Fake Caller
                    </h3>
                    <p className="text-xs text-[#6B7280] mt-1">
                      Simulates incoming call with pre-recorded escape voice.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <select
                      value={fakeCallerName}
                      onChange={(e) => setFakeCallerName(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB] text-xs font-medium text-[#000000]"
                    >
                      <option value="Dad">Preset: Dad</option>
                      <option value="Mom">Preset: Mom</option>
                      <option value="Police Desk">Preset: Police Inspector</option>
                      <option value="Boss">Preset: Manager</option>
                    </select>

                    <button
                      onClick={handleTriggerFakeCall}
                      className="w-full h-11 rounded-xl bg-[#000000] hover:bg-[#262626] text-white text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                    >
                      <span>Trigger Fake Call (3s Delay)</span>
                    </button>
                  </div>
                </div>

                {/* Alarm Siren Card */}
                <div className="p-6 rounded-2xl border border-[#E5E7EB] bg-[#FFFFFF] space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-[#F3F4F6] flex items-center justify-center text-[#000000]">
                    <Volume2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-general font-bold text-lg text-[#000000]">
                      High-Decibel Siren
                    </h3>
                    <p className="text-xs text-[#6B7280] mt-1">
                      Synthesizes a piercing dual-frequency acoustic alarm.
                    </p>
                  </div>

                  <button
                    onClick={toggleSiren}
                    className={`w-full h-11 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors ${
                      isSirenPlaying
                        ? 'bg-[#000000] text-[#22C55E]'
                        : 'border border-[#E5E7EB] bg-[#FFFFFF] hover:bg-[#F3F4F6] text-[#000000]'
                    }`}
                  >
                    {isSirenPlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    <span>{isSirenPlaying ? 'STOP SIREN' : 'START SIREN ALARM'}</span>
                  </button>
                </div>
              </div>

              {/* Fake Call Overlay */}
              {fakeCallState === 'ringing' && (
                <div className="p-6 rounded-2xl bg-[#000000] text-white text-center space-y-4 animate-bounce">
                  <p className="text-xs uppercase tracking-widest text-[#22C55E]">Incoming Call...</p>
                  <h3 className="text-2xl font-bold">{fakeCallerName}</h3>
                  <div className="flex items-center justify-center gap-4 pt-2">
                    <button
                      onClick={handleAcceptFakeCall}
                      className="px-6 py-2.5 rounded-xl bg-[#22C55E] text-black font-semibold text-xs cursor-pointer"
                    >
                      Accept Call
                    </button>
                    <button
                      onClick={handleEndFakeCall}
                      className="px-6 py-2.5 rounded-xl bg-white/20 text-white font-semibold text-xs cursor-pointer"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              )}

              {fakeCallState === 'connected' && (
                <div className="p-6 rounded-2xl bg-[#000000] text-white text-center space-y-3">
                  <p className="text-xs uppercase tracking-widest text-[#22C55E]">Call In Progress</p>
                  <h3 className="text-2xl font-bold">{fakeCallerName}</h3>
                  <p className="text-xs text-neutral-400">Audio voice simulation playing...</p>
                  <button
                    onClick={handleEndFakeCall}
                    className="px-6 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-semibold text-xs cursor-pointer"
                  >
                    End Call
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ========================================================
              TAB 5: SAFETY LOGS & RECENT TRANSACTIONS TABLE
             ======================================================== */}
          {activeTab === 'logs' && (
            <div className="p-0 animate-fade-in">
              <div className="p-6 sm:p-8 pb-4 space-y-1">
                <h2 className="font-general font-bold text-2xl tracking-tight text-[#000000]">
                  Safety Telemetry & Alert Logs
                </h2>
                <p className="text-sm text-[#6B7280]">
                  Real-time log of emergency triggers, SafeWalk check-ins, and guardian notifications.
                </p>
              </div>

              {/* Overflow table wrapper with smooth horizontal scrolling */}
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left border-collapse min-w-[640px]">
                  <thead>
                    <tr className="bg-[#F9FAFB] border-y border-[#F3F4F6] text-sm font-semibold text-[#374151]">
                      <th className="py-4 px-6 sm:px-8">Log ID</th>
                      <th className="py-4 px-6">Event Type</th>
                      <th className="py-4 px-6">Timestamp</th>
                      <th className="py-4 px-6">Location</th>
                      <th className="py-4 px-6 sm:px-8 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F3F4F6] text-sm text-[#374151]">
                    <tr className="hover:bg-[#F9FAFB]/60 transition-colors">
                      <td className="py-4 px-6 sm:px-8 font-mono font-medium text-xs text-[#6B7280]">
                        LOG-9921
                      </td>
                      <td className="py-4 px-6 font-semibold text-[#000000]">
                        SafeWalk Arrival
                      </td>
                      <td className="py-4 px-6 text-[#6B7280]">
                        Today, 02:45 AM
                      </td>
                      <td className="py-4 px-6 font-mono text-xs text-[#6B7280]">
                        Lotus Residency
                      </td>
                      <td className="py-4 px-6 sm:px-8 text-right">
                        <StatusBadgePill status="paid" label="Resolved" />
                      </td>
                    </tr>

                    <tr className="hover:bg-[#F9FAFB]/60 transition-colors">
                      <td className="py-4 px-6 sm:px-8 font-mono font-medium text-xs text-[#6B7280]">
                        LOG-9920
                      </td>
                      <td className="py-4 px-6 font-semibold text-[#000000]">
                        Periodic GPS Check-in
                      </td>
                      <td className="py-4 px-6 text-[#6B7280]">
                        Today, 02:30 AM
                      </td>
                      <td className="py-4 px-6 font-mono text-xs text-[#6B7280]">
                        Outer Ring Walkway
                      </td>
                      <td className="py-4 px-6 sm:px-8 text-right">
                        <StatusBadgePill status="paid" label="Verified" />
                      </td>
                    </tr>

                    <tr className="hover:bg-[#F9FAFB]/60 transition-colors">
                      <td className="py-4 px-6 sm:px-8 font-mono font-medium text-xs text-[#6B7280]">
                        LOG-9919
                      </td>
                      <td className="py-4 px-6 font-semibold text-[#000000]">
                        Emergency Circle Synced
                      </td>
                      <td className="py-4 px-6 text-[#6B7280]">
                        Yesterday, 11:15 PM
                      </td>
                      <td className="py-4 px-6 font-mono text-xs text-[#6B7280]">
                        Encrypted Local Vault
                      </td>
                      <td className="py-4 px-6 sm:px-8 text-right">
                        <StatusBadgePill status="paid" label="Active" />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </section>

      </main>

      {/* ========================================================
          FLOATING AI ASSISTANT BUTTON (mobile-first)
         ======================================================== */}
      <button
        onClick={() => setChatOpen(true)}
        className="fixed bottom-6 right-5 z-40 w-14 h-14 rounded-2xl bg-black hover:bg-[#262626] text-white flex items-center justify-center shadow-lg transition-all hover:scale-105 cursor-pointer sm:hidden"
        title="Open AI Safety Assistant"
        aria-label="Open SafeHer AI Assistant"
      >
        <Mic className="w-5 h-5" />
      </button>

      {/* ========================================================
          FOOTER (Border-top #F3F4F6, 32px Vertical Padding)
         ======================================================== */}
      <footer className="border-t border-[#F3F4F6] py-8 px-4 sm:px-8 bg-[#FFFFFF]">
        <div className="max-w-[896px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs uppercase tracking-widest text-[#9CA3AF]">
          {/* Left Links */}
          <div className="flex flex-wrap items-center gap-2">
            <span>© {new Date().getFullYear()} SafeHer Platform</span>
            <span>•</span>
            <a href="tel:112" className="hover:text-[#000000] transition-colors font-bold text-[#000000]">National 112</a>
            <span>•</span>
            <a href="tel:1091" className="hover:text-[#000000] transition-colors font-bold text-[#000000]">Women 1091</a>
            <span>•</span>
            <a href="#" className="hover:text-[#000000] transition-colors">Privacy Charter</a>
          </div>

          {/* Right System Secure Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F0FDF4] border border-[#22C55E]/20 text-[#15803d] font-semibold text-[11px] tracking-normal lowercase first-letter:uppercase">
            <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
            <span>System Armed & 24/7 Monitored</span>
          </div>
        </div>
      </footer>

    </div>
  );
};
