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

  return (
    <div className="flex flex-col gap-y-3">
      <label className="text-sm font-medium text-gray-700">
        Select {title}
      </label>
      <div
        className="grid grid-cols-auto gap-2"
        data-testid={dataTestId}
      >
        {values.map((value) => {
          const isSelected = value.value === current

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
