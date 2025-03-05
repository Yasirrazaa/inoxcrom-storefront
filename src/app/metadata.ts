import { Metadata } from "next"
import { getBaseURL } from "@lib/util/env"

export const metadata: Metadata = {
  title: 'Inoxcrom Store',
  description: 'Premium pens and stationery from Inoxcrom',
  metadataBase: new URL(getBaseURL()),
}