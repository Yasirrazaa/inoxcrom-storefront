"use client"

import React, { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useParams } from "next/navigation"
import { Search, User, ShoppingCart, Home, Menu, X } from "lucide-react"
import { ShopDropdown } from "../../../../components/shop-dropdown"
import SearchModal from "../../../../components/search-modal"
import MobileNav from "../../../../components/mobile-nav"
import { useCart } from "../../../../providers/cart-provider"
import { retrieveCart } from "@lib/data/cart"

export default function NavClient() {
  const params = useParams()
  const countryCode = params?.countryCode as string || "au"
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [cartItemsCount, setCartItemsCount] = useState(0)
  const mobileMenuRef = useRef<HTMLDivElement>(null)

  // Get cart items count
  useEffect(() => {
    const getCartCount = async () => {
      const cart = await retrieveCart()
      const count = cart?.items?.reduce(
        (total, item) => total + (item.quantity || 0),
        0
      ) || 0
      setCartItemsCount(count)
    }
    getCartCount()
  }, [])

  // Refresh cart count periodically
  useEffect(() => {
    const getCartCount = async () => {
      const cart = await retrieveCart()
      const count = cart?.items?.reduce(
        (total, item) => total + (item.quantity || 0),
        0
      ) || 0
      setCartItemsCount(count)
    }

    // Initial fetch
    getCartCount()

    // Set up interval to refresh every 5 seconds
    const interval = setInterval(getCartCount, 5000)

    // Cleanup on unmount
    return () => clearInterval(interval)
  }, [])

  // Handle clicks outside the mobile menu
  const handleMobileMenuClickOutside = (event: MouseEvent) => {
    if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
      setIsMobileMenuOpen(false)
    }
  }

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleMobileMenuClickOutside)
      return () => document.removeEventListener('mousedown', handleMobileMenuClickOutside)
    }
  }, [isMobileMenuOpen])

  return (
    <>
      <nav className="bg-[#0093D0] text-white relative z-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between h-16 px-4">
            <div className="flex items-center space-x-8">
              <Link href={`/${countryCode}`} className="hover:text-gray-200">
                <Home className="h-5 w-5" />
              </Link>
              <Link href={`/${countryCode}`} className="flex-shrink-0">
                <Image
                  src="/images/logo/inoxcrom-logo.jpg"
                  alt="INOXCROM"
                  width={120}
                  height={40}
                  className="h-10 w-auto"
                  priority
                />
              </Link>
            </div>

            <div className="hidden md:flex items-center justify-center space-x-8 flex-1">
              <Link href={`/${countryCode}/catalog`} className="hover:text-gray-200">
                THE BRAND
              </Link>
              <Link href={`/${countryCode}/points-of-sale`} className="hover:text-gray-200">
                POINTS OF SALE
              </Link>
              <Link href={`/${countryCode}/personalization`} className="hover:text-gray-200">
                PERSONALIZATION
              </Link>
              <Link href={`/${countryCode}/catalog`} className="hover:text-gray-200">
                CATALOG
              </Link>

              <ShopDropdown />

              <Link href={`/${countryCode}/contact`} className="hover:text-gray-200">
                CONTACT
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <button
                className="md:hidden hover:text-gray-200 transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
              <button 
                className="hover:text-gray-200 transition-colors"
                onClick={() => setIsSearchOpen(true)}
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>
              <Link href={`/${countryCode}/account`} className="hover:text-gray-200">
                <User className="h-5 w-5" />
              </Link>
              <div className="relative">
                <Link href={`/${countryCode}/cart`} className="hover:text-gray-200 inline-flex items-center">
                  <ShoppingCart className="h-5 w-5" />
                </Link>
                {/* Always show badge for debugging */}
                <span className="absolute -top-2 -right-2 min-w-[20px] h-5 flex items-center justify-center bg-white text-[#0093D0] text-xs font-bold rounded-full shadow-lg border-2 border-[#0093D0] z-[999] px-1">
                  {cartItemsCount}
                </span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="block md:hidden" ref={mobileMenuRef}>
        <MobileNav 
          countryCode={countryCode} 
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />
      </div>

      <SearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />
    </>
  )
}
