"use client"

import { useState } from "react"
import Link from "next/link"
import { ShopDropdown } from "./shop-dropdown"

interface MobileNavProps {
  countryCode: string
  isOpen: boolean
  onClose: () => void
}

export default function MobileNav({ countryCode, isOpen, onClose }: MobileNavProps) {
  if (!isOpen) return null

  return (
    <div className="absolute top-16 left-0 right-0 bg-[#0093D0] z-50">
      <div className="flex flex-col p-4 space-y-4">
        <Link 
          href={`/${countryCode}/catalog`} 
          className="text-white hover:text-gray-200"
          onClick={onClose}
        >
          THE BRAND
        </Link>
        <Link 
          href={`/${countryCode}/points-of-sale`} 
          className="text-white hover:text-gray-200"
          onClick={onClose}
        >
          POINTS OF SALE
        </Link>
        <Link 
          href={`/${countryCode}/personalization`} 
          className="text-white hover:text-gray-200"
          onClick={onClose}
        >
          PERSONALIZATION
        </Link>
        <Link 
          href={`/${countryCode}/catalog`} 
          className="text-white hover:text-gray-200"
          onClick={onClose}
        >
          CATALOG
        </Link>

        <ShopDropdown isMobile={true} />

        <Link 
          href={`/${countryCode}/contact`} 
          className="text-white hover:text-gray-200"
          onClick={onClose}
        >
          CONTACT
        </Link>
      </div>
    </div>
  )
}
