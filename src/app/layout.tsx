import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Wearly - Virtual Try-On Experience',
  description: 'Experience the future of online shopping with AI-powered virtual try-on technology. See how clothes look on you before you purchase.',
  keywords: ['virtual try-on', 'AI fashion', 'online shopping', 'augmented reality', 'fashion tech', 'try before you buy'],
  authors: [{ name: 'Wearly Team' }],
  creator: 'Wearly',
  publisher: 'Wearly',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  // Basic meta tags
  metadataBase: new URL('https://wearly.com'), // Replace with your actual domain
  alternates: {
    canonical: '/',
  },

  // Open Graph / Facebook
  openGraph: {
    type: 'website',
    url: '/',
    title: 'Wearly - Virtual Try-On Experience',
    description: 'Experience the future of online shopping with AI-powered virtual try-on technology. See how clothes look on you before you purchase.',
    siteName: 'Wearly',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Wearly - Virtual Try-On Experience',
      },
    ],
    locale: 'en_US',
  },

  // Twitter
  twitter: {
    card: 'summary_large_image',
    title: 'Wearly - Virtual Try-On Experience',
    description: 'Experience the future of online shopping with AI-powered virtual try-on technology. See how clothes look on you before you purchase.',
    images: ['/og-image.jpg'],
    creator: '@wearly',
  },

  // Favicons and icons
  icons: {
    icon: '/favicon.ico',
  },

  // Additional meta tags
  other: {
    'theme-color': '#000000',
    'msapplication-TileColor': '#000000',
    'msapplication-config': '/browserconfig.xml',
  },

  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // Verification (add your actual verification codes)
  verification: {
    google: 'your-google-site-verification-code',
    yandex: 'your-yandex-verification-code',
    // Note: Bing verification is handled through other means
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="referrer" content="no-referrer" />
        <meta httpEquiv="Content-Security-Policy" content="frame-ancestors 'none';" />
      </head>
      <body className={`${inter.className} dark antialiased`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
