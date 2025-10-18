import type { Metadata } from 'next';
import { Poppins, Lora } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import AuthInit from '@/components/AuthInit';
import Footer from '@/components/Footer';
import { Toaster } from 'react-hot-toast';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

const lora = Lora({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-lora',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'SRIJAN - Handcrafted Indian Handicrafts & Clothing',
  description: 'From India\'s roots — handcrafted with love. Discover authentic Indian handicrafts, traditional clothing, and artisan-made treasures.',
  keywords: 'Indian handicrafts, handmade clothing, artisan products, ethnic wear, traditional crafts, handloom, sustainable fashion',
  authors: [{ name: 'SRIJAN' }],
  openGraph: {
    title: 'SRIJAN - Handcrafted Indian Handicrafts & Clothing',
    description: 'Discover authentic Indian handicrafts and traditional clothing handcrafted with love',
    type: 'website',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SRIJAN - Handcrafted Indian Handicrafts & Clothing',
    description: 'Discover authentic Indian handicrafts and traditional clothing',
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${poppins.variable} ${lora.variable}`}>
      <body className="min-h-screen flex flex-col">
        <AuthInit />
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-neutral-900 text-white px-3 py-2 rounded">Skip to content</a>
        <Header />
        <main id="main" className="flex-1">{children}</main>
        <Footer />
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              iconTheme: {
                primary: '#FF9933',
                secondary: '#fff',
              },
            },
          }}
        />
        {/* Razorpay script */}
        <script src="https://checkout.razorpay.com/v1/checkout.js" async></script>
      </body>
    </html>
  );
}

