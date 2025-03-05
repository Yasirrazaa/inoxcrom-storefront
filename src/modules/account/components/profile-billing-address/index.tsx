"use client"

import React, { useEffect, useMemo, useTransition } from "react"
import { useRouter } from "next/navigation"
import Input from "@modules/common/components/input"
import NativeSelect from "@modules/common/components/native-select"
import AccountInfo from "../account-info"
import { HttpTypes } from "@medusajs/types"
import { handleSubmit } from "./actions"

type MyInformationProps = {
  customer: HttpTypes.StoreCustomer
  regions: HttpTypes.StoreRegion[]
}

const ProfileBillingAddress: React.FC<MyInformationProps> = ({
  customer,
  regions,
}) => {
  const router = useRouter()
  const [editMode, setEditMode] = React.useState(false)
  const [successState, setSuccessState] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [selectedCountry, setSelectedCountry] = React.useState<string>("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const billingAddress = useMemo(() => {
    return customer.addresses?.find((addr) => addr.is_default_billing)
  }, [customer.addresses])

  useEffect(() => {
    if (billingAddress?.country_code) {
      setSelectedCountry(billingAddress.country_code)
    }
  }, [billingAddress])

  const toggleEdit = () => {
    setEditMode(prev => !prev)
    setError(null)
    setSuccessState(false)
    setSelectedCountry(billingAddress?.country_code || "")
  }

  const regionOptions = useMemo(() => {
    const defaultCountries = [
      { value: "US", label: "United States" },
      { value: "GB", label: "United Kingdom" },
      { value: "CA", label: "Canada" },
      { value: "AU", label: "Australia" },
      { value: "DE", label: "Germany" },
      { value: "FR", label: "France" },
      { value: "IT", label: "Italy" },
      { value: "ES", label: "Spain" },
      { value: "PK", label: "Pakistan" },
      { value: "IN", label: "India" }
    ]

    const regionsCountries = regions
      ?.map((region) => {
        return region.countries?.map((country) => ({
          value: country.iso_2,
          label: country.display_name,
        }))
      })
      .flat() || []

    return regionsCountries.length > 0 ? regionsCountries : defaultCountries
  }, [regions])

  const clearState = () => {
    setSuccessState(false)
    setError(null)
  }

  const currentInfo = useMemo(() => {
    if (!billingAddress) {
      return "No billing address"
    }

    const country =
      regionOptions?.find(
        (country) => country?.value === billingAddress.country_code
      )?.label || billingAddress.country_code?.toUpperCase()

    return (
      <div className="flex flex-col font-semibold">
        <span>
          {billingAddress.first_name} {billingAddress.last_name}
        </span>
        {billingAddress.company && <span>{billingAddress.company}</span>}
        <span>
          {billingAddress.address_1}
          {billingAddress.address_2 ? `, ${billingAddress.address_2}` : ""}
        </span>
        <span>
          {billingAddress.postal_code}, {billingAddress.city}
        </span>
        <span>{country}</span>
        {billingAddress.phone && <span>{billingAddress.phone}</span>}
      </div>
    )
  }, [billingAddress, regionOptions])

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (isSubmitting) return

    if (!selectedCountry) {
      setError("Please select a country")
      return
    }

    setIsSubmitting(true)
    try {
      setError(null)
      setSuccessState(false)
      
      const form = e.currentTarget
      const formData = new FormData(form)

      // Remove empty optional fields
      const optionalFields = ['company', 'address_2', 'province', 'phone']
      for (const field of optionalFields) {
        const value = formData.get(field)
        if (!value || value.toString().trim() === '') {
          formData.delete(field)
        }
      }

      console.log("Submitting form with data:", Object.fromEntries(formData))
      const result = await handleSubmit(formData, billingAddress)
      
      if (result.success) {
        setSuccessState(true)
        setError(null)
        setEditMode(false)
        
        // Show success message before refreshing
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Use router.refresh() to update the page data
        router.refresh()
      } else {
        setSuccessState(false)
        setError(result.error || "Failed to save address")
      }
    } catch (err) {
      console.error("Error submitting form:", err)
      setError("Failed to save address")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AccountInfo
      label="Billing address"
      currentInfo={currentInfo}
      isSuccess={successState}
      isError={!!error}
      errorMessage={error || undefined}
      clearState={clearState}
      editMode={editMode}
      onEdit={toggleEdit}
    >
      <form 
        id="address-form"
        onSubmit={handleFormSubmit}
        className="w-full"
      >
        <input type="hidden" name="is_default_billing" value="true" />
        <div className="grid grid-cols-1 gap-y-2">
          <div className="grid grid-cols-2 gap-x-2">
            <Input
              label="First Name *"
              name="first_name"
              defaultValue={billingAddress?.first_name || ""}
              required
            />
            <Input
              label="Last Name *"
              name="last_name"
              defaultValue={billingAddress?.last_name || ""}
              required
            />
          </div>
          <Input
            label="Street Address *"
            name="address_1"
            defaultValue={billingAddress?.address_1 || ""}
            required
          />
          <Input
            label="Company (optional)"
            name="company"
            defaultValue={billingAddress?.company || ""}
          />
          <Input
            label="Apartment, suite, etc. (optional)"
            name="address_2"
            defaultValue={billingAddress?.address_2 || ""}
          />
          <div className="grid grid-cols-[144px_1fr] gap-x-2">
            <Input
              label="Postal Code *"
              name="postal_code"
              defaultValue={billingAddress?.postal_code || ""}
              required
            />
            <Input
              label="City *"
              name="city"
              defaultValue={billingAddress?.city || ""}
              required
            />
          </div>
          <Input
            label="Province/State (optional)"
            name="province"
            defaultValue={billingAddress?.province || ""}
          />
          <div className="relative">
            <label className="text-sm text-gray-700 mb-1 block">Country *</label>
            <select
              name="country_code"
              value={selectedCountry}
              onChange={(e) => {
                console.log('Selected country code:', e.target.value)
                setSelectedCountry(e.target.value)
              }}
              className="w-full p-2 border border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
              required
            >
              <option value="">Select a country</option>
              {regionOptions.map((option, i) => (
                <option key={i} value={option?.value || ""}>
                  {option?.label || option?.value || ""}
                </option>
              ))}
            </select>
          </div>
          <Input
            label="Phone Number (optional)"
            name="phone"
            type="tel"
            defaultValue={billingAddress?.phone || ""}
          />
          <div className="text-sm text-gray-500 mt-2">
            * Required fields
          </div>
        </div>
      </form>
    </AccountInfo>
  )
}

export default ProfileBillingAddress
