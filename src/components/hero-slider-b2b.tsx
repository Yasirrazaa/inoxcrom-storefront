"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";

interface Slide {
  image: string;
  title: string;
  description: string;
  position: "left" | "right";
}

interface HeroSliderB2BProps {
  slides: Slide[];
}

export default function HeroSliderB2B({ slides }: HeroSliderB2BProps) {
  const [mounted, setMounted] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSlideChange = useCallback((index: number) => {
    if (!isTransitioning && index !== currentSlide) {
      setIsTransitioning(true);
      setCurrentSlide(index);
      setTimeout(() => setIsTransitioning(false), 1000);
    }
  }, [currentSlide, isTransitioning]);

  useEffect(() => {
    if (!mounted) return;

    const timer = setInterval(() => {
      handleSlideChange((currentSlide + 1) % slides.length);
    }, 7000);

    return () => clearInterval(timer);
  }, [currentSlide, handleSlideChange, mounted, slides.length]);

  // Server-side rendering and initial client load
  if (!mounted) {
    return (
      <div className="relative h-[300px] sm:h-[400px] md:h-[504px] bg-gray-50">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-gray-400">Loading...</div>
        </div>
      </div>
    );
  }

  const nextSlide = () => handleSlideChange((currentSlide + 1) % slides.length);
  const prevSlide = () => handleSlideChange((currentSlide - 1 + slides.length) % slides.length);

  return (
    <div className="relative h-[300px] sm:h-[400px] md:h-[504px] overflow-hidden bg-gray-50">
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 ${
              currentSlide === index 
                ? "opacity-100 z-10 translate-x-0" 
                : "opacity-0 z-0 translate-x-full"
            }`}
          >
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              priority={index === 0}
              className="object-contain"
              style={{ 
                objectPosition: `${slide.position} center`
              }}
            />
            <div 
              className={`absolute ${
                slide.position === "left" 
                  ? "left-4 sm:left-12 md:left-24" 
                  : "right-4 sm:right-12 md:right-24"
              } bottom-8 sm:bottom-16 md:bottom-32 max-w-[280px] sm:max-w-[320px] md:max-w-md p-4 md:p-0`}
            >
              <h2 className="font-spock-bold text-2xl sm:text-3xl md:text-[40px] leading-tight text-brand-text mb-2 sm:mb-4 md:mb-6">
                {slide.title}
              </h2>
              <p className="font-spock-light text-sm sm:text-base md:text-lg text-brand-gray">
                {slide.description}
              </p>
            </div>
          </div>
        ))}

        {/* Navigation Controls */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="container mx-auto h-full relative">
            <div className="absolute inset-0 flex items-center justify-between pointer-events-auto">
              <button
                onClick={prevSlide}
                className="bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors transform hover:scale-105"
                aria-label="Previous slide"
              >
                <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextSlide}
                className="bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors transform hover:scale-105"
                aria-label="Next slide"
              >
                <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Dots Navigation */}
        <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => handleSlideChange(index)}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-colors ${
                currentSlide === index 
                  ? "bg-gray-700" 
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}