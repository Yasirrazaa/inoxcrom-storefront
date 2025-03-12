"use client"
import { HttpTypes } from "@medusajs/types"
import React from "react"

type OptionSelectProps = {
  option: HttpTypes.StoreProductOption
  current: string | undefined
  updateOption: (title: string, value: string) => void
  title: string
  disabled: boolean
  "data-testid"?: string
}

const OptionSelect: React.FC<OptionSelectProps> = ({
  option,
  current,
  updateOption,
  title,
  "data-testid": dataTestId,
  disabled,
}) => {
  const values = option.values ?? []

  const isColorOption = title.toLowerCase() === 'color'

  return (
    <div className="flex flex-col gap-y-3">
      <label className="text-sm font-medium text-gray-700">
        Select {title}
      </label>
      <div
        className={`grid ${isColorOption ? 'grid-cols-6' : 'grid-cols-auto'} gap-2`}
        data-testid={dataTestId}
      >
        {values.map((value) => {
          const isSelected = value.value === current

          if (isColorOption) {
            // Convert color names to CSS-friendly values
            const colorMap: { [key: string]: string } = {
              // Basic Colors
              'black': '#000000',
              'white': '#FFFFFF',
              'red': '#FF0000',
              'green': '#008000',
              'blue': '#0000FF',
              'yellow': '#FFFF00',
              'purple': '#800080',
              'orange': '#FFA500',
              'brown': '#A52A2A',
              'pink': '#FFC0CB',
              'gray': '#808080',
              'maroon': '#800000',
              'navy': '#000080',
              'teal': '#008080',
              'olive': '#808000',
              'aqua': '#00FFFF',
              'lime': '#00FF00',
              'cyan': '#00FFFF',
              'magenta': '#FF00FF',
              'indigo': '#4B0082',
              
              // Metallic Colors
              'silver': '#C0C0C0',
              'gold': '#FFD700',
              'bronze': '#CD7F32',
              'copper': '#B87333',
              'metal green': '#4E6C4E',
              'metal silver': '#C0C0C0',
              'metallic black': '#2C2C2C',
              'titanium': '#C0C0C0',
              'chrome': '#DBE4EB',
              'brass': '#B5A642',
              
              // Special Colors
              'anthracite': '#383838',
              'apple green': '#8DB600',
              'beige': '#F5F5DC',
              'burgundy': '#800020',
              'chili': '#C41E3A',
              'cocoa': '#D2691E',
              'crimson': '#DC143C',
              'curry': '#C39953',
              'ginger': '#B06500',
              'graphite': '#1C1C1C',
              'lavender': '#E6E6FA',
              'pear yellow': '#EFD334',
              'pearl grey': '#C4AEAD',
              'pink salt': '#FFC0CB',
              'royal blue': '#4169E1',
              'sienna': '#A0522D',
              'tangerine': '#F28500',
              'turquoise': '#40E0D0',
              'violet': '#8F00FF',
              'wasabi': '#788F32'
            }
            const colorValue = colorMap[value.value.toLowerCase()] || value.value

            return (
              <button
                onClick={() => updateOption(option.id, value.value)}
                key={value.id}
                className={`
                  w-10 h-10 rounded-full transition-all duration-150 relative
                  ${isSelected 
                    ? 'ring-2 ring-offset-2 ring-[#0093D0]' 
                    : 'hover:ring-2 hover:ring-offset-1 hover:ring-[#0093D0]'
                  }
                  ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
                style={{ backgroundColor: colorValue }}
                disabled={disabled}
                data-testid="option-button"
                title={value.value}
              >
                {isSelected && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <svg className={`w-4 h-4 ${value.value.toLowerCase() === 'white' ? 'text-black' : 'text-white'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                )}
              </button>
            )
          }

          return (
            <button
              onClick={() => updateOption(option.id, value.value)}
              key={value.id}
              className={`
                py-3 px-4 border rounded-lg transition-all duration-150
                ${isSelected 
                  ? 'border-[#0093D0] bg-blue-50 text-[#0093D0]' 
                  : 'border-gray-200 hover:border-[#0093D0] text-gray-900'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
              disabled={disabled}
              data-testid="option-button"
            >
              <span className="font-medium">
                {value.value}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default OptionSelect
