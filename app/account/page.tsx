import type { Metadata } from 'next'
import { SiteHeader } from '@/components/nkap/site-header'
import { SiteFooter } from '@/components/nkap/site-footer'
import { AccountPageContent } from '@/components/nkap/account-page-content'

export const metadata: Metadata = {
  title: 'My account | Nkap',
  description: 'Your Nkap account — email verification, password and sign-in.',
  alternates: { canonical: '/account' },
}

export default function AccountPage() {
  return (
    <div className="min-h-svh bg-background">
      <SiteHeader />
      <main className="mx-auto w-full max-w-2xl px-4 py-12 sm:px-6">
        <h1 className="mb-6 font-heading text-3xl font-bold tracking-tight text-foreground">
          Settings
        </h1>
        <AccountPageContent />
      </main>
      <SiteFooter />
    </div>
  )
}
