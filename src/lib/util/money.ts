import { isEmpty } from "./isEmpty"

/**
 * Converts a decimal amount to a localized currency string
 */
export const convertToLocale = ({
  amount,
  currency_code = "AUD",
  minimumFractionDigits = 2,
  maximumFractionDigits = 2,
  isShipping = false,
}: {
  amount: number
  currency_code?: string
  minimumFractionDigits?: number
  maximumFractionDigits?: number
  isShipping?: boolean
}): string => {
  // Only divide non-shipping amounts by 100
  const normalizedAmount = isShipping ? amount : amount;
  
  return new Intl.NumberFormat("en-ES", {
    style: "currency",
    currency: currency_code.toUpperCase(),
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(normalizedAmount)
}
