import type { Metadata } from 'next'
import { SiteHeader } from '@/components/nkap/site-header'
import { SiteFooter } from '@/components/nkap/site-footer'
import { ConfirmedContent } from '@/components/nkap/confirmed-content'

export const metadata: Metadata = {
  title: 'Email verified | Nkap',
  description: 'Your Nkap email address has been verified.',
  alternates: { canonical: '/auth/confirmed' },
}

export default function ConfirmedPage() {
  return (
    <div className="min-h-svh bg-background">
      <SiteHeader />
      <main>
        <ConfirmedContent />
      </main>
      <SiteFooter />
    </div>
  )
}
