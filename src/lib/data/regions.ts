"use server"

import { sdk } from "@lib/config"
import medusaError from "@lib/util/medusa-error"
import { HttpTypes } from "@medusajs/types"
import { getCacheOptions } from "./cookies"

export const listRegions = async () => {
  const next = {
    ...(await getCacheOptions("regions")),
  }

    return sdk.client
    .fetch<{ regions: HttpTypes.StoreRegion[] }>(`/store/regions`, {
      method: "GET",
      next,
      cache: "no-store", // Disable cache to ensure fresh data
    })
    .then(({ regions }) => regions)
    .catch(medusaError)
}

export const retrieveRegion = async (id: string) => {
  const next = {
    ...(await getCacheOptions(["regions", id].join("-"))),
  }

    return sdk.client
    .fetch<{ region: HttpTypes.StoreRegion }>(`/store/regions/${id}`, {
      method: "GET",
      next,
      cache: "no-store", // Disable cache to ensure fresh data
    })
    .then(({ region }) => region)
    .catch(medusaError)
}

const regionMap = new Map<string, HttpTypes.StoreRegion>()

export const getRegion = async (countryCode: string): Promise<HttpTypes.StoreRegion | null> => {
  try {
    if (regionMap.has(countryCode)) {
      return regionMap.get(countryCode) || null
    }

    const regions = await listRegions()

    if (!regions || regions.length === 0) {
      console.error("No regions found or regions list empty")
      return null
    }

    regions.forEach((region) => {
      region.countries?.forEach((c) => {
        regionMap.set(c?.iso_2?.toLowerCase() ?? "", region)
      })
    })

    // Try to find region by country code (case insensitive)
    const normalizedCountryCode = countryCode?.toLowerCase()
    let region = normalizedCountryCode ? regionMap.get(normalizedCountryCode) : undefined

    console.log('Available regions:', regions.map(r => ({
      id: r.id,
      countries: r.countries?.map(c => c.iso_2)
    })))
    console.log('Looking for region with country code:', normalizedCountryCode)
    
    // Fallback to first available region if no match
    if (!region && regions.length > 0) {
      region = regions[0]
      console.log(`No region found for ${normalizedCountryCode}, falling back to first available region:`, region.id)
    }

    return region || null
  } catch (e: any) {
    console.error("Error fetching region:", e.message)
    return null
  }
}
