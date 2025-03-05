"use client"

import { useState, useEffect } from "react"
import { Button, Heading } from "@medusajs/ui"
import { ChevronLeft, ChevronRight } from "@medusajs/icons"
import { normalizeString } from "@lib/util/generate-handle"

const slides = [
  {
    image: "/images/hero-images/INK.jpg",
    title: "New Colors",
    subtitle: "FOUNTAIN PEN INK",
    description: "Discover our new range of vibrant fountain pen inks",
    buttonText: "Shop Now",
    filterType: "category",
    filterValue: "Fountain pen refills",
  },
  {
    image: "/images/hero-images/FANTASY.jpg",
    title: "Fantasy",
    subtitle: "COLLECTION",
    description: "Elegant designs with distinctive silver accents",
    buttonText: "Explore",
    filterType: "collection",
    filterValue: "Fantasy",
  },
  {
    image: "/images/hero-images/HISTORY.jpg",
    title: "History",
    subtitle: "COLLECTION",
    description: "A tribute to our heritage of craftsmanship",
    buttonText: "View Collection",
    filterType: "collection",
    filterValue: "History",
  },
  {
    image: "/images/hero-images/ARC.jpg",
    title: "Arc",
    subtitle: "MODEL",
    description: "Contemporary design meets classic functionality",
    buttonText: "Discover",
    filterType: "collection",
    filterValue: "Arc",
  },
  {
    image: "/images/hero-images/ETNIA.jpg",
    title: "Etnia",
    subtitle: "COLLECTION",
    description: "Inspired by cultural diversity",
    buttonText: "Learn More",
    filterType: "collection",
    filterValue: "Etnia",
  },
  {
    image: "/images/hero-images/VISTA.jpg",
    title: "Vista",
    subtitle: "MODEL",
    description: "Clear vision of modern writing",
    buttonText: "Shop Now",
    filterType: "collection",
    filterValue: "Vista",
  },
]

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  return (
    <div className="h-[75vh] w-full border-b border-ui-border-base relative bg-ui-bg-subtle">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            currentSlide === index ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="relative h-full w-full">
            <img src={slide.image || "/placeholder.svg"} alt={slide.title} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-black/30">
              <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center small:p-32 gap-6">
                <span>
                  <Heading level="h1" className="text-4xl md:text-5xl leading-10 text-white font-bold mb-2">
                    {slide.title}
                  </Heading>
                  <Heading level="h2" className="text-2xl md:text-3xl leading-10 text-white/90 font-normal">
                    {slide.subtitle}
                  </Heading>
                </span>
                <p className="text-lg text-white/80 max-w-md">{slide.description}</p>
                <a href={`/au/catalog?filter=${normalizeString(slide.filterValue)}`}>
                  <Button
                    variant="secondary"
                    className="group relative border-2 border-white hover:bg-white hover:text-black transition-colors"
                  >
                    {slide.buttonText}
                    <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight />
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${currentSlide === index ? "bg-white" : "bg-white/50"}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

export default Hero
