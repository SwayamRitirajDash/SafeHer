'use client';

import React, { useState } from 'react';
import {
  ArrowRight,
  User,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  Users,
  Activity,
  CreditCard,
  Building,
  Mail,
  Phone,
  Search,
  ChevronRight,
} from 'lucide-react';
import { StatusBadgePill } from './StatusBadgePill';

interface PaymentRow {
  id: string;
  transactionId: string;
  client: string;
  date: string;
  amount: string;
  method: string;
  status: 'paid' | 'pending';
}

const SAMPLE_PAYMENTS: PaymentRow[] = [
  {
    id: 'tx-1',
    transactionId: 'TX-89210',
    client: 'Alexander Wright',
    date: 'Oct 24, 2026',
    amount: '$1,250.00',
    method: 'Mastercard •••• 4242',
    status: 'paid',
  },
  {
    id: 'tx-2',
    transactionId: 'TX-89209',
    client: 'Sophia Chen',
    date: 'Oct 23, 2026',
    amount: '$840.00',
    method: 'Visa •••• 8891',
    status: 'paid',
  },
  {
    id: 'tx-3',
    transactionId: 'TX-89208',
    client: 'Marcus Vance',
    date: 'Oct 22, 2026',
    amount: '$2,400.00',
    method: 'ACH Transfer',
    status: 'pending',
  },
  {
    id: 'tx-4',
    transactionId: 'TX-89207',
    client: 'Elena Rostova',
    date: 'Oct 20, 2026',
    amount: '$620.00',
    method: 'Apple Pay',
    status: 'paid',
  },
  {
    id: 'tx-5',
    transactionId: 'TX-89206',
    client: 'David K. Miller',
    date: 'Oct 19, 2026',
    amount: '$1,750.00',
    method: 'Visa •••• 1044',
    status: 'paid',
  },
];

export const MonochromeDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'registration' | 'payments'>('registration');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    role: 'Administrator',
  });
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 3500);
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
              <span className="font-general font-bold text-sm">S</span>
            </div>
            <span className="font-general font-bold text-xl tracking-tight text-[#000000]">
              SalesConnect
            </span>
          </div>

          {/* Right Status & Avatar */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
              <span className="text-[10px] font-general font-bold uppercase tracking-widest text-[#6B7280]">
                System Online
              </span>
            </div>

            <div className="w-10 h-10 rounded-full bg-[#F3F4F6] flex items-center justify-center text-[#6B7280] border border-[#E5E7EB] shadow-xs cursor-pointer hover:border-[#000000] transition-colors">
              <User className="w-5 h-5 stroke-[1.8]" />
            </div>
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
          {/* Card 1 */}
          <div className="rounded-2xl border border-[#F3F4F6] bg-[#FFFFFF] p-6 flat-shadow space-y-2">
            <span className="text-sm font-medium text-[#6B7280]">Total Revenue</span>
            <div className="text-3xl font-general font-bold text-[#000000] tracking-tight">
              $128,430
            </div>
          </div>

          {/* Card 2 */}
          <div className="rounded-2xl border border-[#F3F4F6] bg-[#FFFFFF] p-6 flat-shadow space-y-2">
            <span className="text-sm font-medium text-[#6B7280]">Active Members</span>
            <div className="text-3xl font-general font-bold text-[#000000] tracking-tight">
              1,420
            </div>
          </div>

          {/* Card 3 */}
          <div className="rounded-2xl border border-[#F3F4F6] bg-[#FFFFFF] p-6 flat-shadow space-y-2">
            <span className="text-sm font-medium text-[#6B7280]">Conversion Rate</span>
            <div className="text-3xl font-general font-bold text-[#000000] tracking-tight">
              24.8%
            </div>
          </div>
        </section>

        {/* ========================================================
            TABBED REGISTRATION & ACTIVITY CARD (Max-width 896px, 24px Radius)
           ======================================================== */}
        <section className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-3xl flat-shadow overflow-hidden">
          
          {/* Top Horizontal Tab Navigation */}
          <div className="flex border-b border-[#F3F4F6] px-6 sm:px-8">
            <button
              onClick={() => setActiveTab('registration')}
              className={`py-5 px-4 text-sm font-semibold transition-all duration-300 relative ${
                activeTab === 'registration'
                  ? 'text-[#000000] border-b-2 border-[#000000]'
                  : 'text-[#9CA3AF] hover:text-[#000000]'
              }`}
            >
              User Registration
            </button>

            <button
              onClick={() => setActiveTab('payments')}
              className={`py-5 px-4 text-sm font-semibold transition-all duration-300 relative ${
                activeTab === 'payments'
                  ? 'text-[#000000] border-b-2 border-[#000000]'
                  : 'text-[#9CA3AF] hover:text-[#000000]'
              }`}
            >
              Recent Transactions
            </button>
          </div>

          {/* ========================================================
              TAB 1: REGISTRATION FORM SECTION (48px / 24px Padding)
             ======================================================== */}
          {activeTab === 'registration' && (
            <div className="p-6 sm:p-12 space-y-8 animate-fade-in">
              <div className="space-y-1">
                <h2 className="font-general font-bold text-2xl tracking-tight text-[#000000]">
                  Create Member Account
                </h2>
                <p className="text-sm text-[#6B7280]">
                  Enter personal credentials and role assignments for the new team member.
                </p>
              </div>

              {isSuccess && (
                <div className="p-4 rounded-xl bg-[#F0FDF4] border border-[#22C55E]/30 text-sm text-[#15803d] font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#22C55E]" />
                  <span>Member registration successfully created and verified!</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* 2-Column Inputs Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* First Name */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[#374151] block">
                      First Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full h-12 px-4 rounded-xl border border-[#E5E7EB] bg-[#FFFFFF] text-sm text-[#000000] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#000000] transition-colors"
                    />
                  </div>

                  {/* Last Name */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[#374151] block">
                      Last Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Doe"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
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
                      placeholder="john.doe@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full h-12 px-4 rounded-xl border border-[#E5E7EB] bg-[#FFFFFF] text-sm text-[#000000] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#000000] transition-colors"
                    />
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[#374151] block">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+1 (555) 019-2834"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full h-12 px-4 rounded-xl border border-[#E5E7EB] bg-[#FFFFFF] text-sm text-[#000000] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#000000] transition-colors"
                    />
                  </div>

                  {/* Company */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[#374151] block">
                      Organization / Company
                    </label>
                    <input
                      type="text"
                      placeholder="Acme Corporation"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full h-12 px-4 rounded-xl border border-[#E5E7EB] bg-[#FFFFFF] text-sm text-[#000000] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#000000] transition-colors"
                    />
                  </div>

                  {/* Role Assignment */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[#374151] block">
                      Assigned Role
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full h-12 px-4 rounded-xl border border-[#E5E7EB] bg-[#FFFFFF] text-sm text-[#000000] focus:outline-none focus:border-[#000000] transition-colors font-medium"
                    >
                      <option value="Administrator">Administrator</option>
                      <option value="Billing Manager">Billing Manager</option>
                      <option value="Security Officer">Security Officer</option>
                      <option value="Member">Member</option>
                    </select>
                  </div>
                </div>

                {/* Bottom Action Bar */}
                <div className="pt-6 border-t border-[#F9FAFB] flex items-center justify-end">
                  <button
                    type="submit"
                    className="h-12 px-6 rounded-xl bg-[#000000] hover:bg-[#262626] text-[#FFFFFF] font-semibold text-sm transition-all duration-200 flex items-center gap-2 shadow-xs cursor-pointer"
                  >
                    <span>Create Member</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ========================================================
              TAB 2: PAYMENT / TRANSACTIONS TABLE
             ======================================================== */}
          {activeTab === 'payments' && (
            <div className="p-0 animate-fade-in">
              <div className="p-6 sm:p-8 pb-4 space-y-1">
                <h2 className="font-general font-bold text-2xl tracking-tight text-[#000000]">
                  Payment History & Logs
                </h2>
                <p className="text-sm text-[#6B7280]">
                  Recent settlement transactions and status confirmations.
                </p>
              </div>

              {/* Overflow table wrapper with smooth horizontal scrolling */}
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left border-collapse min-w-[640px]">
                  <thead>
                    <tr className="bg-[#F9FAFB] border-y border-[#F3F4F6] text-sm font-semibold text-[#374151]">
                      <th className="py-4 px-6 sm:px-8">Transaction ID</th>
                      <th className="py-4 px-6">Client</th>
                      <th className="py-4 px-6">Date</th>
                      <th className="py-4 px-6">Amount</th>
                      <th className="py-4 px-6">Method</th>
                      <th className="py-4 px-6 sm:px-8 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F3F4F6] text-sm text-[#374151]">
                    {SAMPLE_PAYMENTS.map((row) => (
                      <tr key={row.id} className="hover:bg-[#F9FAFB]/60 transition-colors">
                        <td className="py-4 px-6 sm:px-8 font-mono font-medium text-xs text-[#6B7280]">
                          {row.transactionId}
                        </td>
                        <td className="py-4 px-6 font-semibold text-[#000000]">
                          {row.client}
                        </td>
                        <td className="py-4 px-6 text-[#6B7280]">
                          {row.date}
                        </td>
                        <td className="py-4 px-6 font-general font-bold text-[#000000]">
                          {row.amount}
                        </td>
                        <td className="py-4 px-6 text-xs text-[#6B7280]">
                          {row.method}
                        </td>
                        <td className="py-4 px-6 sm:px-8 text-right">
                          <StatusBadgePill status={row.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </section>

      </main>

      {/* ========================================================
          FOOTER (Border-top #F3F4F6, 32px Vertical Padding)
         ======================================================== */}
      <footer className="border-t border-[#F3F4F6] py-8 px-4 sm:px-8 bg-[#FFFFFF]">
        <div className="max-w-[896px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs uppercase tracking-widest text-[#9CA3AF]">
          {/* Left Links */}
          <div className="flex flex-wrap items-center gap-2">
            <span>© {new Date().getFullYear()} SalesConnect Inc.</span>
            <span>•</span>
            <a href="#" className="hover:text-[#000000] transition-colors">Privacy</a>
            <span>•</span>
            <a href="#" className="hover:text-[#000000] transition-colors">Terms</a>
            <span>•</span>
            <a href="#" className="hover:text-[#000000] transition-colors">Security</a>
          </div>

          {/* Right System Secure Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F0FDF4] border border-[#22C55E]/20 text-[#15803d] font-semibold text-[11px] tracking-normal lowercase first-letter:uppercase">
            <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
            <span>System Secure & Encrypted</span>
          </div>
        </div>
      </footer>

    </div>
  );
};
