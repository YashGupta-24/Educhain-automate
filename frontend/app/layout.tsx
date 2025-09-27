// frontend/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { Toaster } from "@/components/ui/sonner"; // Import from sonner

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'EduChain Automate',
  description: 'Automated Scholarships on the Blockchain',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <Providers>{children}</Providers>
        <Toaster richColors /> {/* Use the new Toaster */}
      </body>
    </html>
  );
}