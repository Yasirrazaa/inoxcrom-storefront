"use client"

import { normalizeString } from "@lib/util/generate-handle"
import Link from "next/link"

const categories = [
  {
    title: "Office",
    image: "/images/catalogue/office-bg.jpg",
    description: "Professional writing instruments for your workplace"
  },
  {
    title: "Casual",
    image: "/images/catalogue/casual-bg.jpg",
    description: "Everyday writing essentials"
  },
  {
    title: "Premium",
    image: "/images/catalogue/premium-bg.jpg",
    description: "Luxury writing instruments"
  }
]

export default function Catalogue() {
  return (
    <div className="py-16 bg-white">
      <div className="max-w-[1440px] mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Collections</h2>
          <p className="text-lg text-gray-600">Discover our range of exceptional writing instruments</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link
              key={category.title}
              href={`/au/catalog?filter=${normalizeString(category.title)}`}
              className="group relative block h-[400px] overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <img
                  src={category.image}
                  alt={category.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20"></div>
              </div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">{category.title}</h3>
                <p className="text-sm text-gray-200 mb-4">{category.description}</p>
                <span className="inline-flex items-center text-sm font-medium text-white">
                  Explore Collection
                  <svg
                    className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
