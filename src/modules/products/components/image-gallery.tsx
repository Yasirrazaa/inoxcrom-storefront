"use client"

import React, { useState, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react"
import { Image } from "@modules/products/types"

type ImageGalleryProps = {
  images: Image[]
  isZoomed?: boolean
  onZoom?: (isZoomed: boolean) => void
  zoomLevel?: number
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ 
  images,
  isZoomed = false,
  onZoom = () => {},
  zoomLevel = 2
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [displayImages, setDisplayImages] = useState<Image[]>([])
  const [dragStart, setDragStart] = useState<number | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  
  const sliderRef = useRef<HTMLDivElement>(null)
  const mainImageRef = useRef<HTMLImageElement>(null)
  
  // When images change, update the displayed images
  useEffect(() => {
    if (!images || images.length === 0) {
      setDisplayImages([{
        url: 'https://via.placeholder.com/600x600?text=No+Image+Available',
        id: 'placeholder',
        alt: 'No image available'
      }]);
      return;
    }
    
    // Remove duplicates (sometimes thumbnail is also in images array)
    const uniqueImages = images.filter((image, index, self) => 
      index === self.findIndex((i) => i.url === image.url)
    )
    
    setDisplayImages(uniqueImages)
    setSelectedImageIndex(0) // Reset to first image when images change
  }, [images])

  const nextImage = () => {
    setSelectedImageIndex((prev) => 
      prev === displayImages.length - 1 ? 0 : prev + 1
    )
  }

  const prevImage = () => {
    setSelectedImageIndex((prev) => 
      prev === 0 ? displayImages.length - 1 : prev - 1
    )
  }
  
  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        nextImage();
      } else if (e.key === 'ArrowLeft') {
        prevImage();
      } else if (e.key === 'Escape' && isZoomed) {
        onZoom(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [displayImages.length, isZoomed]);
  
  // Touch and mouse handling for slider
  const handleTouchStart = (e: React.TouchEvent) => {
    setDragStart(e.touches[0].clientX);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    if (dragStart === null) return;
    
    const xDiff = dragStart - e.touches[0].clientX;
    
    // If drag distance is significant, change image
    if (Math.abs(xDiff) > 50) {
      if (xDiff > 0) {
        nextImage();
      } else {
        prevImage();
      }
      setDragStart(null);
    }
  };
  
  const handleTouchEnd = () => {
    setDragStart(null);
  };
  
  const handleMouseDown = (e: React.MouseEvent) => {
    setDragStart(e.clientX);
    setIsDragging(true);
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isZoomed) {
      // For zoom pan functionality
      setMousePosition({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });
      
      // Update transform origin for panning
      if (mainImageRef.current) {
        const xOrigin = e.nativeEvent.offsetX / mainImageRef.current.offsetWidth * 100;
        const yOrigin = e.nativeEvent.offsetY / mainImageRef.current.offsetHeight * 100;
        
        mainImageRef.current.style.transformOrigin = `${xOrigin}% ${yOrigin}%`;
      }
      
      return;
    }
    
    if (!isDragging || dragStart === null) return;
    
    const xDiff = dragStart - e.clientX;
    
    // If drag distance is significant, change image
    if (Math.abs(xDiff) > 50) {
      if (xDiff > 0) {
        nextImage();
      } else {
        prevImage();
      }
      setDragStart(null);
      setIsDragging(false);
    }
  };
  
  const handleMouseUp = () => {
    setDragStart(null);
    setIsDragging(false);
  };

  const toggleZoom = () => {
    onZoom(!isZoomed);
  };
  
  // Calculate zoom styles
  const zoomStyles = isZoomed && mainImageRef.current ? {
    cursor: 'zoom-out',
    transform: `scale(${zoomLevel})`,
    transformOrigin: `${mousePosition.x / mainImageRef.current.offsetWidth * 100}% ${mousePosition.y / mainImageRef.current.offsetHeight * 100}%`,
    transition: isDragging ? 'none' : 'transform 0.1s ease-out'
  } : { cursor: 'zoom-in' };
  
  // If no images, show placeholder
  if (displayImages.length === 0) {
    return (
      <div className="w-full h-96 bg-gray-200 flex items-center justify-center rounded-lg">
        <p className="text-gray-500">No images available</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      {/* Main image slider */}
      <div className="relative w-full mb-4 overflow-hidden rounded-lg">
        <div
          ref={sliderRef}
          className={`w-full h-full bg-gray-100 rounded-lg overflow-hidden relative ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <img
            ref={mainImageRef}
            src={displayImages[selectedImageIndex].url}
            alt={displayImages[selectedImageIndex].alt || "Product image"}
            className="w-full h-full object-contain transition-all"
            style={zoomStyles}
            onDoubleClick={toggleZoom}
            draggable={false}
          />

          {/* Navigation arrows (only show if more than one image and not zoomed) */}
          {displayImages.length > 1 && !isZoomed && (
            <>
              <button 
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white/90 w-8 h-8 rounded-full flex items-center justify-center shadow-md"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white/90 w-8 h-8 rounded-full flex items-center justify-center shadow-md"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
          
          {/* Zoom toggle button */}
          <button 
            onClick={toggleZoom}
            className="absolute top-2 right-2 bg-white/70 hover:bg-white/90 w-8 h-8 rounded-full flex items-center justify-center shadow-md"
            aria-label={isZoomed ? "Zoom out" : "Zoom in"}
          >
            {isZoomed ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
          </button>
          
          {/* Image counter */}
          {displayImages.length > 1 && (
            <div className="absolute bottom-2 right-2 bg-black/60 text-white px-2 py-1 rounded-full text-xs">
              {selectedImageIndex + 1} / {displayImages.length}
            </div>
          )}
          
          {/* Dots indicator for mobile */}
          {displayImages.length > 1 && !isZoomed && (
            <div className="absolute bottom-3 left-0 right-0 flex justify-center space-x-2">
              {displayImages.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full ${selectedImageIndex === index ? 'bg-blue-600' : 'bg-gray-300'}`}
                  onClick={() => setSelectedImageIndex(index)}
                  aria-label={`View image ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Thumbnail gallery */}
      {displayImages.length > 1 && (
        <div className="relative mt-4">
          <div className="overflow-x-auto hide-scrollbar">
            <div className="flex gap-2 px-2 pb-2" style={{ minWidth: 'min-content' }}>
              {displayImages.map((image, index) => (
                <button
                  key={`${image.id || image.url}-${index}`}
                  className={`
                    aspect-square w-24 md:w-20 flex-shrink-0 rounded-md overflow-hidden border-2 transition-all
                    ${selectedImageIndex === index ? 'border-blue-600 scale-105' : 'border-transparent hover:border-gray-300'}
                  `}
                  onClick={() => setSelectedImageIndex(index)}
                  aria-label={`View image ${index + 1}`}
                  aria-current={selectedImageIndex === index}
                >
                  <img
                    src={image.url}
                    alt={image.alt || `Product thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                </button>
              ))}
            </div>
          </div>
          
          {/* Thumbnail navigation arrows */}
          {displayImages.length > 5 && (
            <>
              <button
                onClick={() => {
                  const container = document.querySelector('.overflow-x-auto')
                  if (container) container.scrollBy({ left: -80, behavior: 'smooth' })
                }}
                className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white/90 w-6 h-6 rounded-full flex items-center justify-center shadow-md"
                aria-label="Scroll thumbnails left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  const container = document.querySelector('.overflow-x-auto')
                  if (container) container.scrollBy({ left: 80, behavior: 'smooth' })
                }}
                className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white/90 w-6 h-6 rounded-full flex items-center justify-center shadow-md"
                aria-label="Scroll thumbnails right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default ImageGallery
