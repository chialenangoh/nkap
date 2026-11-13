import type { Metadata } from 'next'
import { CorridorPage } from '@/components/nkap/corridor-page'
import { getCorridor } from '@/lib/nkap/rates'

const corridor = getCorridor('ghana')

export const metadata: Metadata = {
  title: `Cheapest way to send money to Ghana — compare GHS received | Nkap`,
  description: `Compare Remitly, Wise, Xe, Sendwave, WorldRemit and Western Union on sending money from the US to Ghana — ranked by how many GHS your family actually receives, fee and exchange rate included. From Money in America.`,
}

export default function Page() {
  return <CorridorPage corridor={corridor} />
}
