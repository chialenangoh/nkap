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
        <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground">
          My account
        </h1>
        <p className="mb-8 mt-2 text-sm leading-relaxed text-muted-foreground">
          Your sign-in details and account actions, all in one place.
        </p>
        <AccountPageContent />
      </main>
      <SiteFooter />
    </div>
  )
}
