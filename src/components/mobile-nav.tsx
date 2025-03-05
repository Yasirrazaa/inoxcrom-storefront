"use client"

import { useState } from "react"
import Link from "next/link"
import { ShopDropdown } from "./shop-dropdown"

interface MobileNavProps {
  countryCode: string
  isOpen: boolean
}

export default function MobileNav({ countryCode, isOpen }: MobileNavProps) {
  if (!isOpen) return null

  return (
    <div className="absolute top-16 left-0 right-0 bg-[#0093D0] z-50">
      <div className="flex flex-col p-4 space-y-4">
        <Link href={`/${countryCode}/catalog`} className="text-white hover:text-gray-200">
          THE BRAND
        </Link>
        <Link href={`/${countryCode}/points-of-sale`} className="text-white hover:text-gray-200">
          POINTS OF SALE
        </Link>
        <Link href={`/${countryCode}/personalization`} className="text-white hover:text-gray-200">
          PERSONALIZATION
        </Link>
        <Link href={`/${countryCode}/catalog`} className="text-white hover:text-gray-200">
          CATALOG
        </Link>

        <ShopDropdown isMobile={true} />

        <Link href={`/${countryCode}/contact`} className="text-white hover:text-gray-200">
          CONTACT
        </Link>
      </div>
    </div>
  )
}