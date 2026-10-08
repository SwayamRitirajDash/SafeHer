'use client';

import React, { useState } from 'react';
import {
  Lock,
  Mail,
  Phone,
  User,
  Shield,
  Eye,
  EyeOff,
  X,
  Check,
  AlertCircle,
  Sparkles,
  Users,
} from 'lucide-react';
import { useSafeHerStore } from '@/lib/store';
import { DEMO_ACCOUNTS } from '@/lib/mockData';

export const AuthModal: React.FC = () => {
  const isAuthModalOpen = useSafeHerStore((s) => s.isAuthModalOpen);
  const authModalMode = useSafeHerStore((s) => s.authModalMode);
  const setAuthModalOpen = useSafeHerStore((s) => s.setAuthModalOpen);
  const login = useSafeHerStore((s) => s.login);
  const signup = useSafeHerStore((s) => s.signup);
  const addContact = useSafeHerStore((s) => s.addContact);

  const [mode, setMode] = useState<'signin' | 'signup'>(authModalMode || 'signin');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Sign In Form States
  const [signInIdentifier, setSignInIdentifier] = useState('demo.abcd@example.com');
  const [signInPassword, setSignInPassword] = useState('password123');

  // Sign Up Form States
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPhone, setSignUpPhone] = useState('+91 ');
  const [signUpBloodGroup, setSignUpBloodGroup] = useState('O+ Positive');
  const [signUpEmergencyNotes, setSignUpEmergencyNotes] = useState('');
  const [signUpAddress, setSignUpAddress] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('');
  const [signUpGuardianName, setSignUpGuardianName] = useState('');
  const [signUpGuardianPhone, setSignUpGuardianPhone] = useState('');

  // Sync mode if store mode changes
  React.useEffect(() => {
    if (authModalMode) {
      setMode(authModalMode);
      setErrorMsg('');
      setSuccessMsg('');
    }
  }, [authModalMode, isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);

    setTimeout(() => {
      const res = login(signInIdentifier, signInPassword);
      setIsLoading(false);
      if (res.success) {
        setSuccessMsg('Welcome back! Successfully logged in.');
        setTimeout(() => {
          setAuthModalOpen(false);
        }, 500);
      } else {
        setErrorMsg(res.error || 'Failed to sign in. Please verify your credentials.');
      }
    }, 400);
  };

  const handleQuickDemoLogin = (account: typeof DEMO_ACCOUNTS[0]) => {
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);

    setTimeout(() => {
      login(account.email, account.password);
      setIsLoading(false);
      setSuccessMsg(`Logged in as ${account.name}!`);
      setTimeout(() => {
        setAuthModalOpen(false);
      }, 500);
    }, 300);
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!signUpName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!signUpEmail.trim() || !signUpEmail.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!signUpPhone.trim() || signUpPhone.trim() === '+91') {
      setErrorMsg('Please enter your primary mobile number.');
      return;
    }
    if (signUpPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }
    if (signUpPassword !== signUpConfirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const res = signup(
        {
          name: signUpName.trim(),
          email: signUpEmail.trim(),
          phone: signUpPhone.trim(),
          bloodGroup: signUpBloodGroup,
          emergencyNotes: signUpEmergencyNotes.trim() || 'No known medical allergies.',
          primaryAddress: signUpAddress.trim() || 'Delhi NCR, India',
        },
        signUpPassword
      );

      // If guardian details were provided, automatically register primary contact
      if (signUpGuardianName.trim() && signUpGuardianPhone.trim()) {
        addContact({
          name: signUpGuardianName.trim(),
          phone: signUpGuardianPhone.trim(),
          relationship: 'Guardian',
          isPrimary: true,
          notifyViaWhatsapp: true,
          notifyViaSMS: true,
          notifyViaCall: true,
        });
      }

      setIsLoading(false);

      if (res.success) {
        setSuccessMsg('Account created successfully! Protected by SafeHer Network.');
        setTimeout(() => {
          setAuthModalOpen(false);
        }, 600);
      } else {
        setErrorMsg(res.error || 'Failed to create account.');
      }
    }, 450);
  };

  const handlePreFillSignUp = () => {
    setSignUpName('ABCD User');
    setSignUpEmail('demo.abcd@example.com');
    setSignUpPhone('+91 9XXXXXXXXX');
    setSignUpBloodGroup('O+ Positive');
    setSignUpEmergencyNotes('No known allergies. Carries asthma inhaler.');
    setSignUpAddress('123 Demo Street, Tech Zone, New Delhi');
    setSignUpPassword('securePass123');
    setSignUpConfirmPassword('securePass123');
    setSignUpGuardianName('Demo Guardian');
    setSignUpGuardianPhone('+91 9XXXXXXXX1');
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in font-satoshi">
      <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 border border-[#E5E7EB] shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#F3F4F6] flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-black flex items-center justify-center text-white">
              <Shield className="w-4 h-4 text-[#22C55E]" />
            </div>
            <div>
              <h3 className="font-general font-bold text-lg text-black leading-tight">
                SafeHer Shield ID
              </h3>
              <p className="text-[11px] text-[#6B7280]">
                {mode === 'signin'
                  ? 'Sign in to access encrypted circle & safety vaults'
                  : 'Create your 24/7 emergency response profile'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setAuthModalOpen(false)}
            className="w-8 h-8 rounded-full bg-[#F3F4F6] hover:bg-[#E5E7EB] flex items-center justify-center text-[#6B7280] hover:text-black transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="grid grid-cols-2 p-1 bg-[#F3F4F6] rounded-2xl my-4 flex-shrink-0">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              mode === 'signin'
                ? 'bg-white text-black shadow-xs'
                : 'text-[#6B7280] hover:text-black'
            }`}
          >
            Sign In / लॉग इन
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              mode === 'signup'
                ? 'bg-white text-black shadow-xs'
                : 'text-[#6B7280] hover:text-black'
            }`}
          >
            Sign Up / नया खाता
          </button>
        </div>

        {/* Feedback Messages */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-[#FEF2F2] border border-[#EF4444]/20 text-xs text-[#DC2626] font-medium flex items-center gap-2 flex-shrink-0 animate-fade-in">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-[#F0FDF4] border border-[#22C55E]/20 text-xs text-[#15803d] font-medium flex items-center gap-2 flex-shrink-0 animate-fade-in">
            <Check className="w-4 h-4 flex-shrink-0 text-[#22C55E]" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Scrollable Form Body */}
        <div className="overflow-y-auto pr-1 flex-1 space-y-5 scrollbar-thin">
          {mode === 'signin' ? (
            /* ========================================================
               SIGN IN TAB
               ======================================================== */
            <form onSubmit={handleSignIn} className="space-y-4">
              {/* Email or Phone Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#374151] flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#6B7280]" />
                  Email or Registered Phone
                </label>
                <input
                  type="text"
                  required
                  value={signInIdentifier}
                  onChange={(e) => setSignInIdentifier(e.target.value)}
                  placeholder="e.g. demo.abcd@example.com or +91 9XXXXXXXXX"
                  className="w-full h-11 px-3.5 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] text-sm text-black placeholder:text-[#9CA3AF] focus:outline-none focus:border-black focus:bg-white transition-all"
                />
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#374151] flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-[#6B7280]" />
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[11px] text-[#6B7280] hover:text-black font-medium flex items-center gap-1 cursor-pointer"
                  >
                    {showPassword ? (
                      <>
                        <EyeOff className="w-3 h-3" /> Hide
                      </>
                    ) : (
                      <>
                        <Eye className="w-3 h-3" /> Show
                      </>
                    )}
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    placeholder="Enter account password"
                    className="w-full h-11 px-3.5 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] text-sm text-black placeholder:text-[#9CA3AF] focus:outline-none focus:border-black focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 rounded-xl bg-black hover:bg-[#262626] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md disabled:bg-[#9CA3AF]"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In to Protected Account</span>
                  </>
                )}
              </button>

              {/* Quick 1-Click Demo Accounts */}
              <div className="pt-4 border-t border-[#F3F4F6] space-y-2.5">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280] text-center">
                  ⚡ 1-Click Instant Demo Login
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {DEMO_ACCOUNTS.map((acc) => (
                    <button
                      key={acc.id}
                      type="button"
                      onClick={() => handleQuickDemoLogin(acc)}
                      className="p-2.5 rounded-xl border border-[#E5E7EB] bg-[#FFFFFF] hover:border-black hover:bg-[#F9FAFB] text-left transition-all cursor-pointer flex items-center gap-2.5 group"
                    >
                      <div className="w-7 h-7 rounded-lg bg-[#F3F4F6] group-hover:bg-black group-hover:text-white flex items-center justify-center text-xs font-bold text-black transition-colors">
                        {acc.name.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-black truncate">{acc.name}</p>
                        <p className="text-[10px] text-[#6B7280] truncate">{acc.bloodGroup}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </form>
          ) : (
            /* ========================================================
               SIGN UP TAB
               ======================================================== */
            <form onSubmit={handleSignUp} className="space-y-4">
              {/* Quick Fill Demo */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F0FDF4] border border-[#22C55E]/20 text-[11px] text-[#15803d]">
                <span className="flex items-center gap-1.5 font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-[#22C55E]" />
                  Need to test fast? Auto-fill sample credentials:
                </span>
                <button
                  type="button"
                  onClick={handlePreFillSignUp}
                  className="px-2.5 py-1 rounded-lg bg-[#22C55E] text-white font-bold text-[10px] hover:bg-[#16a34a] transition-colors cursor-pointer"
                >
                  Auto-Fill
                </button>
              </div>

              {/* Name & Phone Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#374151] flex items-center gap-1">
                    <User className="w-3 h-3 text-[#6B7280]" /> Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={signUpName}
                    onChange={(e) => setSignUpName(e.target.value)}
                    placeholder="e.g. ABCD User"
                    className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] text-xs text-black placeholder:text-[#9CA3AF] focus:outline-none focus:border-black focus:bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#374151] flex items-center gap-1">
                    <Phone className="w-3 h-3 text-[#6B7280]" /> Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={signUpPhone}
                    onChange={(e) => setSignUpPhone(e.target.value)}
                    placeholder="+91 9XXXXXXXXX"
                    className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] text-xs text-black placeholder:text-[#9CA3AF] focus:outline-none focus:border-black focus:bg-white"
                  />
                </div>
              </div>

              {/* Email & Blood Group */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#374151] flex items-center gap-1">
                    <Mail className="w-3 h-3 text-[#6B7280]" /> Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                    placeholder="demo.abcd@example.com"
                    className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] text-xs text-black placeholder:text-[#9CA3AF] focus:outline-none focus:border-black focus:bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#374151] flex items-center gap-1">
                    Blood Group
                  </label>
                  <select
                    value={signUpBloodGroup}
                    onChange={(e) => setSignUpBloodGroup(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] text-xs text-black focus:outline-none focus:border-black focus:bg-white font-medium"
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

              {/* Primary Guardian Contact Sub-Section */}
              <div className="p-3 rounded-2xl bg-[#F9FAFB] border border-[#E5E7EB] space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-black uppercase tracking-wider">
                  <Users className="w-3.5 h-3.5 text-[#22C55E]" />
                  <span>Primary Guardian (SOS Recipient)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={signUpGuardianName}
                    onChange={(e) => setSignUpGuardianName(e.target.value)}
                    placeholder="Guardian Name (e.g. Father)"
                    className="w-full h-9 px-3 rounded-lg border border-[#E5E7EB] bg-white text-xs text-black placeholder:text-[#9CA3AF] focus:outline-none focus:border-black"
                  />
                  <input
                    type="tel"
                    value={signUpGuardianPhone}
                    onChange={(e) => setSignUpGuardianPhone(e.target.value)}
                    placeholder="Guardian Phone (+91 9XXXXXXXX1)"
                    className="w-full h-9 px-3 rounded-lg border border-[#E5E7EB] bg-white text-xs text-black placeholder:text-[#9CA3AF] focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              {/* Medical Allergies & Address */}
              <div className="space-y-2">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#374151]">
                    Emergency Medical Notes
                  </label>
                  <input
                    type="text"
                    value={signUpEmergencyNotes}
                    onChange={(e) => setSignUpEmergencyNotes(e.target.value)}
                    placeholder="e.g. Allergic to Sulfa drugs, Diabetic"
                    className="w-full h-9 px-3 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] text-xs text-black placeholder:text-[#9CA3AF] focus:outline-none focus:border-black"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#374151]">
                    Primary Residence Address
                  </label>
                  <input
                    type="text"
                    value={signUpAddress}
                    onChange={(e) => setSignUpAddress(e.target.value)}
                    placeholder="e.g. Sector 18, Rohini, New Delhi"
                    className="w-full h-9 px-3 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] text-xs text-black placeholder:text-[#9CA3AF] focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              {/* Password & Confirm */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#374151] flex items-center gap-1">
                    <Lock className="w-3 h-3 text-[#6B7280]" /> Password (min 6)
                  </label>
                  <input
                    type="password"
                    required
                    value={signUpPassword}
                    onChange={(e) => setSignUpPassword(e.target.value)}
                    placeholder="Create password"
                    className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] text-xs text-black placeholder:text-[#9CA3AF] focus:outline-none focus:border-black focus:bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#374151]">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    required
                    value={signUpConfirmPassword}
                    onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] text-xs text-black placeholder:text-[#9CA3AF] focus:outline-none focus:border-black focus:bg-white"
                  />
                </div>
              </div>

              {/* Submit Sign Up */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 rounded-xl bg-black hover:bg-[#262626] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md disabled:bg-[#9CA3AF]"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Create SafeHer Protected Profile</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Footer info */}
        <div className="pt-3 border-t border-[#F3F4F6] text-center flex-shrink-0">
          <p className="text-[10px] text-[#9CA3AF]">
            🔒 All emergency records are end-to-end encrypted and dispatch-ready.
          </p>
        </div>
      </div>
    </div>
  );
};
