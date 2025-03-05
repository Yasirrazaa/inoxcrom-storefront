"use server"

import { updateCustomerAddress, addCustomerAddress, retrieveCustomer } from "@lib/data/customer"
import { Address } from "../../../../../src/types/address"
import { revalidateTag } from "next/cache"
import { HttpTypes } from "@medusajs/types"

type UpdateAddressData = {
  first_name: string
  last_name: string
  address_1: string
  city: string
  country_code: string
  postal_code: string
  company: string
  address_2: string
  province: string
  phone: string
  is_default_billing: boolean
}

async function unsetDefaultBillingFlag(addressId: string, address: Address) {
  await updateCustomerAddress(addressId, {
    is_default_billing: false,
    first_name: address.first_name || "",
    last_name: address.last_name || "",
    address_1: address.address_1 || "",
    city: address.city || "",
    postal_code: address.postal_code || "",
    country_code: address.country_code || "",
    company: address.company || "",
    address_2: address.address_2 || "",
    province: address.province || "",
    phone: address.phone || ""
  })
}

export async function handleSubmit(formData: FormData, billingAddress: Address | null | undefined) {
  console.log("Form submission started")
  try {
    const customer = await retrieveCustomer()
    if (!customer) {
      throw new Error("Customer not found")
    }

    // Extract and validate form data with empty strings as defaults
    const addressData: UpdateAddressData = {
      first_name: formData.get("first_name") as string,
      last_name: formData.get("last_name") as string,
      address_1: formData.get("address_1") as string,
      city: formData.get("city") as string,
      country_code: formData.get("country_code") as string,
      postal_code: formData.get("postal_code") as string,
      // Optional fields with empty string defaults
      company: (formData.get("company") as string) || "",
      address_2: (formData.get("address_2") as string) || "",
      province: (formData.get("province") as string) || "",
      phone: (formData.get("phone") as string) || "",
      is_default_billing: true
    }

    // Validate required fields
    const requiredFields = ['first_name', 'last_name', 'address_1', 'city', 'country_code', 'postal_code'] as const
    for (const field of requiredFields) {
      if (!addressData[field]) {
        throw new Error(`${field.replace('_', ' ')} is required`)
      }
    }

    console.log("Processing address with data:", addressData)

    let result;
    if (billingAddress?.id) {
      // Update existing address
      console.log("Updating existing address:", billingAddress.id)
      
      // First, remove default billing flag from other addresses
      for (const addr of customer.addresses || []) {
        if (addr.id && addr.is_default_billing && addr.id !== billingAddress.id) {
          await unsetDefaultBillingFlag(addr.id, addr)
        }
      }
      
      result = await updateCustomerAddress(billingAddress.id, addressData)
    } else {
      // Create new address
      console.log("Creating new address")
      
      // First, remove default billing flag from any existing addresses
      for (const addr of customer.addresses || []) {
        if (addr.id && addr.is_default_billing) {
          await unsetDefaultBillingFlag(addr.id, addr)
        }
      }

      // Create new FormData with all fields (empty strings for optional fields)
      const newFormData = new FormData()
      Object.entries(addressData).forEach(([key, value]) => {
        newFormData.append(key, value.toString())
      })

      result = await addCustomerAddress({ isDefaultBilling: true }, newFormData)
    }

    if (!result?.success) {
      throw new Error(result?.error || "Failed to save address")
    }

    // Revalidate all relevant data
    revalidateTag('customer')
    revalidateTag('addresses')
    revalidateTag('profile')

    return { success: true }
  } catch (e: any) {
    console.error("Error saving address:", e)
    return { success: false, error: e.message || "Failed to save address" }
  }
}
