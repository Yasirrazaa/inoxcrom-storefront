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
    'default': '#333333',
    'black': '#000000',
    'white': '#ffffff',
    'silver': '#c0c0c0',
    'gray': '#808080',
    'red': '#ff0000',
    'blue': '#0000ff',
    'green': '#008000',
    'yellow': '#ffff00',
    'orange': '#ffa500',
    'purple': '#800080',
    'pink': '#ffc0cb',
    'brown': '#a52a2a',
    'gold': '#ffd700',
    'copper': '#b87333',
    'titanium': '#878681',
    'standard': '#666666',
  };
  
  const normalizedColor = colorName.toLowerCase();
  return colorMap[normalizedColor] || '#888888'; // Default gray if color not found
};

export default ProductOptions;
