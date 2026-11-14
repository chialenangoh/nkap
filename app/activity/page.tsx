import type { Metadata } from 'next'
import { SiteHeader } from '@/components/nkap/site-header'
import { SiteFooter } from '@/components/nkap/site-footer'
import { ActivityList } from '@/components/nkap/activity-list'

export const metadata: Metadata = {
  title: 'My activity | Nkap',
  description:
    'Your Nkap comparison history on this device — the checks you ran and the providers you visited.',
  alternates: { canonical: '/activity' },
}

export default function ActivityPage() {
  return (
    <div className="min-h-svh bg-background">
      <SiteHeader />
      <main className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-6">
        <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground">
          Activity
        </h1>
        <p className="mb-6 mt-2 text-sm leading-relaxed text-muted-foreground">
          Your comparisons and provider visits, kept only on this device.
          Nkap doesn’t process transfers — your actual sends happen in the
          provider apps, so they won’t appear here.
        </p>
        <ActivityList />
      </main>
      <SiteFooter />
    </div>
  )
}
