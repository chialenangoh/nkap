import type { Metadata } from 'next'
import { SiteHeader } from '@/components/nkap/site-header'
import { SiteFooter } from '@/components/nkap/site-footer'
import { AuthFormShell, SignInForm } from '@/components/nkap/auth-forms'

export const metadata: Metadata = {
  title: 'Sign in | Nkap',
  description: 'Sign in to your Nkap account.',
  alternates: { canonical: '/sign-in' },
}

export default function SignInPage() {
  return (
    <div className="min-h-svh bg-background">
      <SiteHeader />
      <main>
        <AuthFormShell
          title="Welcome back"
          intro="Sign in to your Nkap account."
        >
          <SignInForm />
        </AuthFormShell>
      </main>
      <SiteFooter />
    </div>
  )
}
