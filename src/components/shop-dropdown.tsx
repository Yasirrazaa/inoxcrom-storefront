"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { ChevronDown } from "lucide-react"
import { useState } from "react"

const normalize = (str: string) => str?.toLowerCase().trim().replace(/\s+/g, '-') || ""
import { normalizeString } from "@lib/util/generate-handle"

const writingInstruments = {
  writing_type: [
    "Fountain pens",
    "Ballpoint pens", 
    "Mechanical pencils",
    "Rollerball pens",
    "Sets"
  ],
  refills: [
    "Fountain pen refills",
    "Ball pen refills",
    "Pencil refills",
    "Roller refills"
  ],
  range: [
    "Office",
    "Casual", 
    "Premium"
  ],
  models: [
    "Ictíneo",
    "Arc",
    "Vista",
    "Round",
    "Beat",
    "Prime",
    "Canvas",
    "Touch",
    "Inox70",
    "Slim",
    "Soul",
    "Spin",
    "Vera",
    "Wave",
    "Rocker",
    "Terra",
    "Curvy"
  ],
  collections: [
    "Ictíneo",
    "Arcade",
    "Arts",
    "Books",
    "Beat is Back",
    "Carbone",
    "Etnia",
    "Fantasy",
    "History",
    "Inox",
    "Mava",
    "Royale",
    "Spices",
    "Vintage"
  ]
}

interface ShopDropdownProps {
  isMobile?: boolean
}

export function ShopDropdown({ isMobile = false }: ShopDropdownProps) {
  const params = useParams()
  const countryCode = params?.countryCode as string || "es"
  const [isOpen, setIsOpen] = useState(false)

  if (isMobile) {
    return (
      <div className="w-full">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center text-white hover:text-gray-200 w-full"
        >
          SHOP
          <ChevronDown className={`ml-1 h-4 w-4 transform transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>
        {isOpen && (
          <div className="mt-2 bg-[#0093D0] rounded-md p-4">
            <div className="flex flex-col space-y-4">
              {/* Writing Type Section */}
              <div>
                <h3 className="text-white font-bold mb-2">Writing Type</h3>
                {writingInstruments.writing_type.map((item) => (
                  <Link
                    key={item}
                    href={`/${countryCode}/catalog?filter=${normalize(item)}`}
                    className="block text-white hover:text-gray-200 text-sm py-1 pl-4"
                  >
                    <span className="text-white mr-2">&gt;</span>
                    {item}
                  </Link>
                ))}
              </div>

              {/* Refills Section */}
              <div>
                <h3 className="text-white font-bold mb-2">Refills</h3>
                {writingInstruments.refills.map((item) => (
                  <Link 
                    key={item}
                    href={`/${countryCode}/catalog?filter=${normalize(item)}`}
                    className="block text-white hover:text-gray-200 text-sm py-1 pl-4"
                  >
                    <span className="text-white mr-2">&gt;</span>
                    {item}
                  </Link>
                ))}
              </div>

              {/* Range Section */}
              <div>
                <h3 className="text-white font-bold mb-2">Range</h3>
                {writingInstruments.range.map((item) => (
                  <Link 
                    key={item}
                    href={`/${countryCode}/catalog?filter=${normalize(item)}`}
                    className="block text-white hover:text-gray-200 text-sm py-1 pl-4"
                  >
                    <span className="text-white mr-2">&gt;</span>
                    {item}
                  </Link>
                ))}
              </div>

              {/* Models Section */}
              <div>
                <h3 className="text-white font-bold mb-2">Models</h3>
                {writingInstruments.models.map((item) => (
                  <Link 
                    key={item}
                    href={`/${countryCode}/catalog?filter=${normalize(item)}`}
                    className="block text-white hover:text-gray-200 text-sm py-1 pl-4"
                  >
                    <span className="text-white mr-2">&gt;</span>
                    {item}
                  </Link>
                ))}
              </div>

              {/* Collections Section */}
              <div>
                <h3 className="text-white font-bold mb-2">Collections</h3>
                {writingInstruments.collections.map((item) => (
                  <Link 
                    key={item}
                    href={`/${countryCode}/catalog?filter=${normalize(item)}`}
                    className="block text-white hover:text-gray-200 text-sm py-1 pl-4"
                  >
                    <span className="text-white mr-2">&gt;</span>
                    {item}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center hover:text-gray-200"
      >
        SHOP
        <ChevronDown className={`ml-1 h-4 w-4 transform transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      <div className={`${isOpen ? "flex" : "hidden"} absolute left-0 mt-2 w-[900px] -translate-x-1/2 bg-white shadow-lg rounded-md p-6`}>
        <div className="flex gap-16 w-full">
          {/* Writing Type Column */}
          <div className="flex flex-col space-y-1">
            <h3 className="text-gray-900 font-bold mb-3">Writing Type</h3>
            {writingInstruments.writing_type.map((item) => (
              <Link
                key={item}
                href={`/${countryCode}/catalog?filter=${normalize(item)}`}
                className="text-gray-600 hover:text-gray-900 text-sm pl-4"
              >
                <span className="text-[#0093D0] mr-2">&gt;</span>
                {item}
              </Link>
            ))}
          </div>

          {/* Refills Column */}
          <div className="flex flex-col space-y-1">
            <h3 className="text-gray-900 font-bold mb-3">Refills</h3>
            {writingInstruments.refills.map((item) => (
              <Link 
                key={item}
                href={`/${countryCode}/catalog?filter=${normalize(item)}`}
                className="text-gray-600 hover:text-gray-900 text-sm pl-4"
              >
                <span className="text-[#0093D0] mr-2">&gt;</span>
                {item}
              </Link>
            ))}
          </div>

          {/* Range Column */}
          <div className="flex flex-col space-y-1">
            <h3 className="text-gray-900 font-bold mb-3">Range</h3>
            {writingInstruments.range.map((item) => (
              <Link 
                key={item}
                href={`/${countryCode}/catalog?filter=${normalize(item)}`}
                className="text-gray-600 hover:text-gray-900 text-sm pl-4"
              >
                <span className="text-[#0093D0] mr-2">&gt;</span>
                {item}
              </Link>
            ))}
          </div>

          {/* Models Column */}
          <div className="flex flex-col space-y-1">
            <h3 className="text-gray-900 font-bold mb-3">Models</h3>
            {writingInstruments.models.map((item) => (
              <Link 
                key={item}
                href={`/${countryCode}/catalog?filter=${normalize(item)}`}
                className="text-gray-600 hover:text-gray-900 text-sm pl-4 whitespace-nowrap"
              >
                <span className="text-[#0093D0] mr-2">&gt;</span>
                {item}
              </Link>
            ))}
          </div>

          {/* Collections Column */}
          <div className="flex flex-col space-y-1">
            <h3 className="text-gray-900 font-bold mb-3">Collections</h3>
            {writingInstruments.collections.map((item) => (
              <Link 
                key={item}
                href={`/${countryCode}/catalog?filter=${normalize(item)}`}
                className="text-gray-600 hover:text-gray-900 text-sm pl-4 whitespace-nowrap"
              >
                <span className="text-[#0093D0] mr-2">&gt;</span>
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}