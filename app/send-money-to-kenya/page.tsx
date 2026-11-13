import type { Metadata } from 'next'
import { CorridorPage } from '@/components/nkap/corridor-page'
import { getCorridor } from '@/lib/nkap/rates'

const corridor = getCorridor('kenya')

export const metadata: Metadata = {
  title: `Cheapest way to send money to Kenya — compare KES received | Nkap`,
  description: `Compare Remitly, Wise, Xe, Sendwave, WorldRemit and Western Union on sending money from the US to Kenya — ranked by how many KES your family actually receives, fee and exchange rate included. From Money in America.`,
  alternates: { canonical: '/send-money-to-kenya' },
}

export default function Page() {
  return <CorridorPage corridor={corridor} />
}
