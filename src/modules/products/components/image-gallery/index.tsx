"use client"
import { useState, useEffect, useCallback } from "react"
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react"
import { type Image } from "@modules/products/types"

type ImageGalleryProps = {
  images: Image[]
}

const ImageGallery = ({ images }: ImageGalleryProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 })

  if (!images?.length) {
    return null
  }

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isZoomed) return

      const bounds = e.currentTarget.getBoundingClientRect()
      const x = Math.max(0, Math.min(100, ((e.clientX - bounds.left) / bounds.width) * 100))
      const y = Math.max(0, Math.min(100, ((e.clientY - bounds.top) / bounds.height) * 100))

      requestAnimationFrame(() => {
        setZoomPosition({ x, y })
      })
    },
    [isZoomed]
  )

  const handleThumbnailClick = useCallback((index: number) => {
    if (selectedImageIndex !== index) {
      setSelectedImageIndex(index)
      // Reset zoom state when changing images
      setIsZoomed(false)
      setZoomPosition({ x: 50, y: 50 })
    }
  }, [selectedImageIndex])


  const handlePrevious = () => {
    setSelectedImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
    setIsZoomed(false)
  }

  const handleNext = () => {
    setSelectedImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
    setIsZoomed(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      handlePrevious()
    }
    if (e.key === "ArrowRight") {
      handleNext()
    }
    if (e.key === "Escape") {
      setIsZoomed(false)
    }
  }

  const toggleZoom = () => {
    setIsZoomed((prev) => !prev)
  }

  return (
    <div 
      className="flex flex-col gap-4" 
      onKeyDown={handleKeyDown} 
      tabIndex={0}
    >
      {/* Main Image Container */}
      <div className="relative aspect-square w-full bg-white rounded-xl shadow-sm">
        {/* Main Product Image */}
        <div
          className={`relative h-full overflow-hidden rounded-xl ${
            isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'
          }`}
          onClick={toggleZoom}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => {
            if (isZoomed) {
              setIsZoomed(false)
              setZoomPosition({ x: 50, y: 50 })
            }
          }}
        >
          <img
            src={images[selectedImageIndex].url}
            alt={`Product image ${selectedImageIndex + 1}`}
            className="w-full h-full transition-all duration-200 ease-out"
            style={{
              objectFit: 'contain',
              transform: isZoomed ? 'scale(2.5)' : 'scale(1)',
              transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`
            }}
          />
        </div>

        {/* Zoom Button */}
        <button
          onClick={toggleZoom}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
          aria-label={isZoomed ? "Zoom out" : "Zoom in"}
        >
          {isZoomed ? (
            <ZoomOut className="w-4 h-4 text-gray-700" />
          ) : (
            <ZoomIn className="w-4 h-4 text-gray-700" />
          )}
        </button>

        {/* Navigation Arrows */}
        {images.length > 1 && !isZoomed && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>
          </>
        )}

        {/* Image Counter */}
        {images.length > 1 && !isZoomed && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/80 px-3 py-1.5 rounded-full text-xs font-medium">
            {selectedImageIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail Navigation */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
          {images.map((image: Image, index: number) => (
            <button
              key={`thumbnail-${index}`}
              onClick={() => handleThumbnailClick(index)}
              className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all
                ${selectedImageIndex === index 
                  ? 'border-[#0093D0]' 
                  : 'border-gray-200 hover:border-[#0093D0]'
                }`}
            >
              <img
                src={image.url}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
                loading={index <= 2 ? "eager" : "lazy"}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default ImageGallery
