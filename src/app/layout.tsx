
import type { Metadata } from 'next';
import './globals.css';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { Toaster } from '@/components/ui/toaster';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Desert Scout Dashboard | Drone Surveillance',
  description: 'AI-Powered Desert Surveillance and Drone Telemetry Dashboard',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* <link rel="icon" href="/images/favicon.png" type="image/png" /> */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background text-foreground overflow-x-hidden flex flex-col min-h-screen">
        <FirebaseClientProvider>
          {children}
          <Toaster />
          <Footer />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
