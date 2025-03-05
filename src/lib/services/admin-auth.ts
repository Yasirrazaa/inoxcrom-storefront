"use server"

import { MEDUSA_BACKEND_URL } from "@lib/config"

interface AdminAuthResponse {
  token: string
}

let jwtToken: string | undefined = undefined
let tokenExpiryTime: number | undefined = undefined

const TOKEN_REFRESH_INTERVAL = 14 * 60 * 1000 // 14 minutes in milliseconds
const TOKEN_REFRESH_BUFFER = 60 * 1000 // 1 minute buffer before expiry

export const getAdminAuthToken = async (): Promise<string> => {
  const currentTime = Date.now()

  // If we have a valid token that's not close to expiring, return it
  if (jwtToken && tokenExpiryTime && currentTime < tokenExpiryTime - TOKEN_REFRESH_BUFFER) {
    return jwtToken
  }

  const email = process.env.NEXT_PUBLIC_ADMIN_EMAIL
  const password = process.env.NEXT_PUBLIC_ADMIN_PASSWORD

  if (!email || !password) {
    throw new Error("Admin email or password not configured in environment variables")
  }

  try {
    const response = await fetch(`${MEDUSA_BACKEND_URL}/auth/user/emailpass`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })

    if (!response.ok) {
      throw new Error(`Admin auth failed: ${response.statusText}`)
    }

    const data = (await response.json()) as AdminAuthResponse

    if (!data.token) {
      throw new Error("No token received from auth endpoint")
    }

    jwtToken = data.token
    // Set token expiry to now + 24 hours (typical JWT expiry)
    tokenExpiryTime = currentTime + (24 * 60 * 60 * 1000)

    return jwtToken
  } catch (error) {
    console.error("Error obtaining admin auth token:", error)
    throw error
  }
}

// Initialize token refresh mechanism if we're on the client side
if (typeof window !== "undefined") {
  let refreshInterval: NodeJS.Timeout

  const startTokenRefresh = () => {
    if (refreshInterval) {
      clearInterval(refreshInterval)
    }

    refreshInterval = setInterval(async () => {
      try {
        await getAdminAuthToken()
        console.log("Admin auth token refreshed successfully")
      } catch (error) {
        console.error("Failed to refresh admin auth token:", error)
      }
    }, TOKEN_REFRESH_INTERVAL)
  }

  // Start the refresh cycle
  startTokenRefresh()
}
