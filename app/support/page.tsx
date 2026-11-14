import type { Metadata } from 'next'
import { SiteHeader } from '@/components/nkap/site-header'
import { SiteFooter } from '@/components/nkap/site-footer'
import { SupportContent } from '@/components/nkap/support-content'

export const metadata: Metadata = {
  title: 'Help and Support | Nkap',
  description:
    'Get help with Nkap — contact us by email, read the FAQ, and learn how the comparison works.',
  alternates: { canonical: '/support' },
}

export default function SupportPage() {
  return (
    <div className="min-h-svh bg-background">
      <SiteHeader />
      <main className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-6">
        <SupportContent />
      </main>
      <SiteFooter />
    </div>
  )
}
