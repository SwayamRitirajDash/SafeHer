import React from 'react';

interface StatusBadgePillProps {
  status: 'paid' | 'active' | 'success' | 'pending' | 'processing';
  label?: string;
}

export const StatusBadgePill: React.FC<StatusBadgePillProps> = ({ status, label }) => {
  const isSuccess = status === 'paid' || status === 'active' || status === 'success';

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-medium transition-colors ${
        isSuccess
          ? 'bg-[#F0FDF4] text-[#15803d]'
          : 'bg-[#F9FAFB] text-[#6B7280]'
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          isSuccess ? 'bg-[#22C55E]' : 'bg-[#D1D5DB]'
        }`}
      />
      <span>{label || (isSuccess ? 'Paid' : 'Pending')}</span>
    </span>
  );
};
