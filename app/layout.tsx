import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ShiftLink — On-Demand Healthcare Staffing',
  description: 'ShiftLink connects healthcare professionals with facilities that need on-demand shift coverage.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
