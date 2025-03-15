import React from 'react';
import { HttpTypes } from "@medusajs/types";
import { Heading, Text } from "@medusajs/ui";

interface ProductOptionsProps {
  product: HttpTypes.AdminProduct;
  selectedOptions: Record<string, string>;
  onOptionChange: (optionId: string, value: string) => void;
  isOptionValueAvailable: (optionId: string, value: string) => boolean;
}

const ProductOptions: React.FC<ProductOptionsProps> = ({
  product,
  selectedOptions,
  onOptionChange,
  isOptionValueAvailable
}) => {
  if (!product.options || product.options.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {product.options.map(option => (
        <div key={option.id} className="option-container">
          <Text className="text-base font-medium mb-2">{option.title}</Text>
          
          <div className="flex flex-wrap gap-2">
            {option.values?.map(value => {
              const isSelected = selectedOptions[option.id] === value.value;
              const isAvailable = isOptionValueAvailable(option.id, value.value);
              
              // Handle different option types (color, size, etc.)
              if (option.title.toLowerCase() === 'color') {
                return (
                  <button
                    key={value.id}
                    className={`
                      h-10 w-10 rounded-full border-2 flex items-center justify-center
                      ${isSelected 
                        ? 'border-blue-600 ring-2 ring-blue-300' 
                        : isAvailable
                          ? 'border-gray-300 hover:border-gray-400'
                          : 'border-gray-200 opacity-40 cursor-not-allowed'
                      }
                    `}
                    onClick={() => isAvailable && onOptionChange(option.id, value.value)}
                    disabled={!isAvailable}
                    title={value.value}
                    aria-label={`Select color: ${value.value}`}
                    aria-pressed={isSelected}
                  >
                    <span 
                      className="block h-6 w-6 rounded-full" 
                      style={{
                        backgroundColor: getColorCode(value.value),
                        boxShadow: 'inset 0 2px 4px 0 rgba(0,0,0,0.1)'
                      }}
                    />
                  </button>
                )
              }
              
              // Default option layout (text buttons)
              return (
                <button
                  key={value.id}
                  className={`
                    py-2 px-3 border rounded-md transition-colors
                    ${isSelected 
                      ? 'border-blue-600 bg-blue-50 text-blue-600' 
                      : isAvailable
                        ? 'border-gray-300 hover:border-gray-400'
                        : 'border-gray-200 text-gray-400 cursor-not-allowed'
                    }
                  `}
                  onClick={() => isAvailable && onOptionChange(option.id, value.value)}
                  disabled={!isAvailable}
                  aria-pressed={isSelected}
                >
                  {value.value}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

// Helper function to convert color names to hex codes
const getColorCode = (colorName: string): string => {
  const colorMap: Record<string, string> = {
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
  };
  
  const normalizedColor = colorName.toLowerCase();
  return colorMap[normalizedColor] || '#888888'; // Default gray if color not found
};

export default ProductOptions;
