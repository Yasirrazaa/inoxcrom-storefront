import Medusa from "@medusajs/js-sdk"

// Defaults to standard port for Medusa server
export const MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

if (!publishableKey) {
  console.error("Missing NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY")
}

if (!MEDUSA_BACKEND_URL) {
  console.error("Missing NEXT_PUBLIC_MEDUSA_BACKEND_URL")
}

console.log('Initializing Medusa SDK with:', {
  baseUrl: MEDUSA_BACKEND_URL,
  publishableKey: publishableKey ? "present" : "missing"
})

export const sdk = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
  debug: true,
  publishableKey: publishableKey
})

// Verify the SDK instance
console.log('SDK instance created:', Boolean(sdk))
