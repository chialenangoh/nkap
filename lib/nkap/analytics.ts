/**
 * Minimal GA4 helper. gtag only exists on the page when the layout loaded
 * Google Analytics, which happens ONLY when NEXT_PUBLIC_GA_ID is set in the
 * environment. Every call here is a safe no-op otherwise.
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    dataLayer?: unknown[]
  }
}

/** Fire a provider_click event when a visitor clicks through to a provider. */
export function trackProviderClick(provider: string, corridor: string): void {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', 'provider_click', { provider, corridor })
  }
}
