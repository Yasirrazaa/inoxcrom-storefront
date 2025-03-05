"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Search, User, ShoppingCart, Home} from "lucide-react";

export default function Header() {
  const params = useParams();
  const countryCode = params?.countryCode as string || "es";

  return (
    <header className="bg-white">
      <div className="bg-[#f0f0f0] py-2 text-gray-600 text-sm">
        <div className="container mx-auto flex justify-end space-x-4">
          <Link href="/terms-and-conditions">Terms and conditions</Link>
          <Link href="/contact">Contact us</Link>
        </div>
      </div>

      <div className="container mx-auto py-4 flex items-center justify-between">
        <Link href={`/${countryCode}`} className="flex-shrink-0">
          <img
            src="/images/logo/inoxcrom-logo.jpg"
            alt="INOXCROM"
            className="h-12"
          />
        </Link>

        <div className="flex items-center space-x-6">
          <Link href={`/${countryCode}/store`} className="text-gray-800 hover:text-gray-600">
            Shop
          </Link>
          <div className="relative group">
            <button className="flex items-center space-x-1">
              <span>English GB</span>
            </button>
            {/* Add dropdown menu here */}
          </div>

          <div className="flex items-center gap-x-6">
            <Link
              href={`/${countryCode}/cart`}
              className="relative flex items-center justify-center text-gray-800 hover:text-gray-600">
              <ShoppingCart className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
