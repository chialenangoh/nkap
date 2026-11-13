import type { Metadata, Viewport } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import { SITE } from '@/lib/nkap/site'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Nkap — Compare what your family actually receives',
  description: SITE.description,
  manifest: '/manifest.json',
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  colorScheme: 'dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fafafa' },
    { media: '(prefers-color-scheme: dark)', color: '#101613' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`dark bg-background ${inter.variable} ${spaceGrotesk.variable}`}
    >
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
