import type { Metadata } from 'next'
import { CorridorPage } from '@/components/nkap/corridor-page'
import { getCorridor } from '@/lib/nkap/rates'

const corridor = getCorridor('nigeria')

export const metadata: Metadata = {
  title: `Cheapest way to send money to Nigeria — compare NGN received | Nkap`,
  description: `Compare Remitly, Wise, Xe, Sendwave, WorldRemit and Western Union on sending money from the US to Nigeria — ranked by how many NGN your family actually receives, fee and exchange rate included. From Money in America.`,
  alternates: { canonical: '/send-money-to-nigeria' },
}

export default function Page() {
  return <CorridorPage corridor={corridor} />
}
