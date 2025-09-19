import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/hooks/useAuth'
import { ThemeProvider } from 'next-themes'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
})

export const metadata: Metadata = {
  title: {
    default: 'MyGrowVest - Smart Investment Platform',
    template: '%s | MyGrowVest'
  },
  description: 'Grow your wealth with MyGrowVest - a secure and transparent investment platform offering multiple investment plans with guaranteed returns.',
  keywords: ['investment', 'wealth', 'growth', 'financial', 'returns', 'crypto', 'trading'],
  authors: [{ name: 'MyGrowVest Team' }],
  creator: 'MyGrowVest',
  publisher: 'MyGrowVest',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://mygrowvest-frontend.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'MyGrowVest - Smart Investment Platform',
    description: 'Grow your wealth with MyGrowVest - a secure and transparent investment platform offering multiple investment plans with guaranteed returns.',
    siteName: 'MyGrowVest',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'MyGrowVest - Smart Investment Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MyGrowVest - Smart Investment Platform',
    description: 'Grow your wealth with MyGrowVest - a secure and transparent investment platform.',
    images: ['/og-image.jpg'],
  },
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
  verification: {
    google: 'your-google-site-verification',
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
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}