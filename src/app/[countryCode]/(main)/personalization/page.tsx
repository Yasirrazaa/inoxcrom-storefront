"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import HeroSliderB2B from "../../../../components/hero-slider-b2b";

const sliderData = [
  {
    image: "https://inoxcrom.es/modules/revsliderprestashop/uploads/slider_B2B/slider_Inoxcrom_B2B_00.jpg",
    title: "360º Láser engraving",
    description: "Endless customization possibilities across the entire surface.",
    position: "right" as const
  },
  {
    image: "https://inoxcrom.es/modules/revsliderprestashop/uploads/slider_B2B/slider_Inoxcrom_B2B_02.jpg",
    title: "Premium line",
    description: "Laser customization for unprecedented image and durability.",
    position: "left" as const
  },
  {
    image: "https://inoxcrom.es/modules/revsliderprestashop/uploads/slider_B2B/slider_Inoxcrom_B2B_03.jpg",
    title: "Versatility",
    description: "Diversity of options for the same message.",
    position: "right" as const
  },
  {
    image: "https://inoxcrom.es/modules/revsliderprestashop/uploads/slider_B2B/slider_Inoxcrom_B2B_04.jpg",
    title: "The best image",
    description: "Personalization even in the injection color, for a precise application of your brand image.",
    position: "left" as const
  },
  {
    image: "https://inoxcrom.es/modules/revsliderprestashop/uploads/slider_B2B/slider_Inoxcrom_B2B_05.jpg",
    title: "Display",
    description: "Custom premium case solutions.",
    position: "left" as const
  }
];

export default function Personalization() {
  const params = useParams();
  
  return (
    <div className="bg-white">
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto py-4 px-4 md:px-6">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href={`/${params.countryCode}`} className="text-gray-600 hover:text-gray-900">
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <Link href={`/${params.countryCode}/personalization`} className="text-gray-900">
              Personalization
            </Link>
          </nav>
        </div>
      </div>

      {/* Page Title */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto py-6 px-4 md:px-6">
          <h1 className="text-2xl md:text-3xl font-spock-bold text-brand-text">
            Personalization
          </h1>
        </div>
      </div>

      {/* Hero Slider */}
      <HeroSliderB2B slides={sliderData} />

      <div className="container mx-auto py-8 md:py-16 px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          <div className="md:col-span-1">
            <h2 className="font-spock-bold text-3xl md:text-4xl mb-4">Custom pens with logo.</h2>
            <h3 className="text-xl md:text-2xl text-brand-gray">Made in Spain</h3>
          </div>
          <div className="md:col-span-2">
            <article className="max-w-none">
              <h2 className="font-spock-bold text-2xl md:text-3xl text-brand-text mb-6">
                The Inoxcrom® difference
              </h2>
              <div className="space-y-6 text-lg text-brand-gray">
                <p className="font-spock-light">Design, writing quality and durability are the hallmarks of our advertising pens.</p>
                <p className="font-spock-light">
                  A <span className="font-spock-bold">promotional pen</span> with a logo is a good way to spread the brand at trade fairs, events and meetings. 
                  In addition, is a useful gift that guarantees the visibility of the brand in the hands of the recipient.
                </p>
                <p className="font-spock-light">
                  From Barcelona we personalize a whole range of <span className="font-spock-bold">ballpens with logo</span>, with matching pencils and pens. 
                  From recycled and antibacterial plastic models, to high-quality stainless steel or lacquered pens and fountain pens.
                </p>
                <p className="font-spock-light">
                  360º laser engraving allows multiple possibilities of personalization and application of your brand on the entire surface. 
                  The level of detail and precision is far superior to previous marking techniques.
                </p>
                <p className="font-spock-light">
                  The silkscreen and pad printed pens allow you to faithfully reproduce your corporate colors on various surfaces, 
                  while the 360º film achieves full-color enveloping designs with high advertising impact.
                </p>
                <p className="font-spock-light">
                  The customization of each piece, which can include the color of the injection in plastic models, 
                  guarantees a faithful application of your brand image.
                </p>
              </div>
              
              <h3 className="font-spock-bold text-2xl text-brand-text mt-12 mb-6">Tired of disposable things?</h3>
              <div className="space-y-6 text-lg text-brand-gray">
                <p className="font-spock-light">
                  The heart of each of our writing instruments is the high capacity refill. Designed and manufactured with our recognized quality, 
                  it makes each Inoxcrom® a sustainable and durable tool. <span className="font-spock-bold">Personalized refillable pens</span> write so well and 
                  for so long that they are the best marketing investment for your business.
                </p>
                <p className="font-spock-light">
                  The presentation, in personalized premium quality cases, facilitates the first impact of your gift, 
                  and a perception of quality associated with your brand.
                </p>
                <p className="font-spock-light">
                  Quality control throughout the production process ensures that each pen arrives in the best condition and 
                  supports your brand for a long time, making your investment more profitable.
                </p>
                <p className="font-spock-bold">This is the Inoxcrom® difference.</p>
              </div>
            </article>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 py-8 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
            <div className="space-y-6 md:space-y-12">
              <div className="bg-white p-4 md:p-8 rounded-lg shadow-sm transform transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                <div className="relative overflow-hidden rounded-lg">
                  <Image 
                    src="https://inoxcrom.es/img/cms/b2b/B2B_Inoxcrom_laser360_VERA.jpg"
                    alt="360º Laser engraving"
                    width={600}
                    height={400}
                    className="w-full transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <h3 className="font-spock-bold text-xl md:text-2xl text-brand-text mt-6 mb-4">360º Laser engraving</h3>
                <p className="font-spock-light text-brand-gray text-sm md:text-base">
                  360º laser engraving, guarantees the reproduction of even the smallest detail and without distortions of your image. 
                  At the same time it achieves spectacular and long-lasting forms of wraparound design customization. An exclusive from Inoxcrom®
                </p>
              </div>

              <div className="bg-white p-4 md:p-8 rounded-lg shadow-sm transform transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                <div className="relative overflow-hidden rounded-lg">
                  <Image 
                    src="https://inoxcrom.es/img/cms/b2b/B2B_Inoxcrom_colores_ROCKER.jpg"
                    alt="Your best image"
                    width={600}
                    height={400}
                    className="w-full transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <h3 className="font-spock-bold text-xl md:text-2xl text-brand-text mt-6 mb-4">Your best image</h3>
                <p className="font-spock-light text-brand-gray text-sm md:text-base">
                  Personalization of all the details, including the body and terminals injection color, 
                  for a precise application of your corporate image.
                </p>
              </div>
            </div>

            <div className="space-y-6 md:space-y-12">
              <div className="bg-white p-4 md:p-8 rounded-lg shadow-sm transform transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                <div className="relative overflow-hidden rounded-lg">
                  <Image 
                    src="https://inoxcrom.es/img/cms/b2b/B2B_Inoxcrom_laser360_ARC_2.jpg"
                    alt="Premium line"
                    width={600}
                    height={400}
                    className="w-full transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <h3 className="font-spock-bold text-xl md:text-2xl text-brand-text mt-6 mb-4">Premium line</h3>
                <p className="font-spock-light text-brand-gray text-sm md:text-base">
                  Our Premium range, laser customized for flawless effect and durability.
                </p>
              </div>

              <div className="bg-white p-4 md:p-8 rounded-lg shadow-sm transform transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                <div className="relative overflow-hidden rounded-lg">
                  <Image 
                    src="https://inoxcrom.es/img/cms/b2b/B2B_Inoxcrom_Presentacion_VISTA.jpg"
                    alt="Display"
                    width={600}
                    height={400}
                    className="w-full transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <h3 className="font-spock-bold text-xl md:text-2xl text-brand-text mt-6 mb-4">Display</h3>
                <p className="font-spock-light text-brand-gray text-sm md:text-base">
                  Custom premium case solutions that ensure your image is displayed from the very first moment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 py-8 md:py-16 border-t border-gray-200">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="font-spock-bold text-2xl md:text-3xl mb-4">Customization department:</h2>
          <p className="font-spock-light text-brand-gray mb-8">For inquiries and quotations.</p>
          <Link 
            href="/au/contact" 
            className="btn-primary"
          >
            Contact
          </Link>
        </div>
      </div>
    </div>
  );
}