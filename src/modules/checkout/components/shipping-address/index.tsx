"use client"

import { HttpTypes } from "@medusajs/types"
import { Container } from "@medusajs/ui"
import { addCustomerAddress } from "@lib/data/customer"
import Checkbox from "@modules/common/components/checkbox"
import Input from "@modules/common/components/input"
import { mapKeys } from "lodash"
import React, { useEffect, useMemo, useState } from "react"
import { Button } from "@medusajs/ui"
import AddressSelect from "../address-select"
import CountrySelect from "../country-select"

const ShippingAddress = ({
  customer,
  cart,
}: {
  customer: HttpTypes.StoreCustomer | null
  cart: HttpTypes.StoreCart | null
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({
    // Shipping address fields
    "shipping_address.first_name": cart?.shipping_address?.first_name || "",
    "shipping_address.last_name": cart?.shipping_address?.last_name || "",
    "shipping_address.address_1": cart?.shipping_address?.address_1 || "",
    "shipping_address.company": cart?.shipping_address?.company || "",
    "shipping_address.postal_code": cart?.shipping_address?.postal_code || "",
    "shipping_address.city": cart?.shipping_address?.city || "",
    "shipping_address.country_code": cart?.shipping_address?.country_code || "",
    "shipping_address.province": cart?.shipping_address?.province || "",
    "shipping_address.phone": cart?.shipping_address?.phone || "",
    // Billing address fields (copy from shipping)
    "billing_address.first_name": cart?.shipping_address?.first_name || "",
    "billing_address.last_name": cart?.shipping_address?.last_name || "",
    "billing_address.address_1": cart?.shipping_address?.address_1 || "",
    "billing_address.company": cart?.shipping_address?.company || "",
    "billing_address.postal_code": cart?.shipping_address?.postal_code || "",
    "billing_address.city": cart?.shipping_address?.city || "",
    "billing_address.country_code": cart?.shipping_address?.country_code || "",
    "billing_address.province": cart?.shipping_address?.province || "",
    "billing_address.phone": cart?.shipping_address?.phone || "",
    email: cart?.email || "",
  })

  const countriesInRegion = useMemo(
    () => cart?.region?.countries?.map((c) => c.iso_2),
    [cart?.region]
  )

  // check if customer has saved addresses that are in the current region
  const addressesInRegion = useMemo(
    () =>
      customer?.addresses.filter(
        (a) => a.country_code && countriesInRegion?.includes(a.country_code)
      ),
    [customer?.addresses, countriesInRegion]
  )

  const setFormAddress = (
    address?: HttpTypes.StoreCartAddress,
    email?: string
  ) => {
    if (address) {
      const addressFields = {
        first_name: address.first_name || "",
        last_name: address.last_name || "",
        address_1: address.address_1 || "",
        company: address.company || "",
        postal_code: address.postal_code || "",
        city: address.city || "",
        country_code: address.country_code || "",
        province: address.province || "",
        phone: address.phone || "",
      };

      setFormData((prevState: Record<string, any>) => ({
        ...prevState,
        // Set shipping address fields
        ...Object.entries(addressFields).reduce((acc, [key, value]) => ({
          ...acc,
          [`shipping_address.${key}`]: value,
          [`billing_address.${key}`]: value, // Also set billing address fields
        }), {}),
        // Update email if provided
        ...(email ? { email } : {}),
      }));
    } else if (email) {
      setFormData((prevState: Record<string, any>) => ({
        ...prevState,
        email,
      }));
    }
  }

  useEffect(() => {
    // Ensure cart is not null and has a shipping_address before setting form data
    if (cart && cart.shipping_address) {
      setFormAddress(cart?.shipping_address, cart?.email)
    }

    if (cart && !cart.email && customer?.email) {
      setFormAddress(undefined, customer.email)
    }
  }, [cart]) // Add cart as a dependency

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLInputElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      // Create new form data with the changed shipping field
      const newData = {
        ...prev,
        [name]: value,
      };

      // If this is a shipping address field, also update the corresponding billing address field
      if (name.startsWith("shipping_address.")) {
        const billingField = name.replace("shipping_address.", "billing_address.");
        newData[billingField] = value;
      }

      return newData;
    });
  }

  return (
    <>
      {customer && (addressesInRegion?.length || 0) > 0 && (
        <Container className="mb-6 flex flex-col gap-y-4 p-5">
          <p className="text-small-regular">
            {`Hi ${customer.first_name}, do you want to use one of your saved addresses?`}
          </p>
          <AddressSelect
            addresses={customer.addresses}
            addressInput={
              mapKeys(formData, (_, key) =>
                key.replace("shipping_address.", "")
              ) as HttpTypes.StoreCartAddress
            }
            onSelect={setFormAddress}
          />
        </Container>
      )}
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="First name"
          name="shipping_address.first_name"
          autoComplete="given-name"
          value={formData["shipping_address.first_name"]}
          onChange={handleChange}
          required
          data-testid="shipping-first-name-input"
        />
        <Input
          label="Last name"
          name="shipping_address.last_name"
          autoComplete="family-name"
          value={formData["shipping_address.last_name"]}
          onChange={handleChange}
          required
          data-testid="shipping-last-name-input"
        />
        <Input
          label="Address"
          name="shipping_address.address_1"
          autoComplete="address-line1"
          value={formData["shipping_address.address_1"]}
          onChange={handleChange}
          required
          data-testid="shipping-address-input"
        />
        <Input
          label="Company"
          name="shipping_address.company"
          value={formData["shipping_address.company"]}
          onChange={handleChange}
          autoComplete="organization"
          data-testid="shipping-company-input"
        />
        <Input
          label="Postal code"
          name="shipping_address.postal_code"
          autoComplete="postal-code"
          value={formData["shipping_address.postal_code"]}
          onChange={handleChange}
          required
          data-testid="shipping-postal-code-input"
        />
        <Input
          label="City"
          name="shipping_address.city"
          autoComplete="address-level2"
          value={formData["shipping_address.city"]}
          onChange={handleChange}
          required
          data-testid="shipping-city-input"
        />
        <CountrySelect
          name="shipping_address.country_code"
          autoComplete="country"
          region={cart?.region}
          value={formData["shipping_address.country_code"]}
          onChange={handleChange}
          required
          data-testid="shipping-country-select"
        />
        <Input
          label="State / Province"
          name="shipping_address.province"
          autoComplete="address-level1"
          value={formData["shipping_address.province"]}
          onChange={handleChange}
          data-testid="shipping-province-input"
        />
      </div>
      <div className="flex flex-col gap-4 mb-4">
        <div className="grid grid-cols-2 gap-4">
        <Input
          label="Email"
          name="email"
          type="email"
          title="Enter a valid email address."
          autoComplete="email"
          value={formData.email}
          onChange={handleChange}
          required
          data-testid="shipping-email-input"
        />
        <Input
          label="Phone"
          name="shipping_address.phone"
          autoComplete="tel"
          value={formData["shipping_address.phone"]}
          onChange={handleChange}
          data-testid="shipping-phone-input"
        />
        </div>
        {customer && !addressesInRegion?.find(addr => 
          addr.address_1 === formData["shipping_address.address_1"] &&
          addr.city === formData["shipping_address.city"] &&
          addr.postal_code === formData["shipping_address.postal_code"]
        ) && (
          <div className="flex justify-end">
            <Button
              className="bg-[#0093D0] hover:bg-blue-700 text-white font-bold py-2 px-6 rounded text-sm transition-colors"
              onClick={async () => {
                const addressData = {
                  first_name: formData["shipping_address.first_name"],
                  last_name: formData["shipping_address.last_name"],
                  address_1: formData["shipping_address.address_1"],
                  company: formData["shipping_address.company"],
                  postal_code: formData["shipping_address.postal_code"],
                  city: formData["shipping_address.city"],
                  country_code: formData["shipping_address.country_code"],
                  province: formData["shipping_address.province"],
                  phone: formData["shipping_address.phone"]
                }

                const form = new FormData()
                Object.entries(addressData).forEach(([key, value]) => {
                  if (value) form.append(key, value)
                })

                const result = await addCustomerAddress({}, form)
                if (result.success) {
                  // You might want to show a success message here
                  console.log("Address saved successfully")
                } else {
                  console.error("Failed to save address:", result.error)
                }
              }}
            >
              Save Address for Future Use
            </Button>
          </div>
        )}
      </div>
    </>
  )
}

export default ShippingAddress
