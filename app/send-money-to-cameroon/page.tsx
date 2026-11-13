import type { Metadata } from 'next'
import { CorridorPage } from '@/components/nkap/corridor-page'
import { getCorridor } from '@/lib/nkap/rates'

const corridor = getCorridor('cameroon')

export const metadata: Metadata = {
  title: `Cheapest way to send money to Cameroon — compare XAF received | Nkap`,
  description: `Compare Remitly, Wise, Xe, Sendwave, WorldRemit and Western Union on sending money from the US to Cameroon — ranked by how many XAF your family actually receives, fee and exchange rate included. From Money in America.`,
}

export default function Page() {
  return <CorridorPage corridor={corridor} />
}
