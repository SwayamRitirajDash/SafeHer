import type { Metadata } from 'next';
import '@/styles/globals.css';
import { SafeHerModals } from '@/components/modals/SafeHerModals';

export const metadata: Metadata = {
  title: 'SafeHer — Minimalist Women Safety Support System',
  description:
    'High-fidelity Women Safety Platform with instant SOS distress alerts, live journey monitoring, and verified safe zone maps.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased selection:bg-[#000000] selection:text-[#FFFFFF] bg-[#F9FAFB] text-[#000000]">
        {children}
        <SafeHerModals />
      </body>
    </html>
  );
}
