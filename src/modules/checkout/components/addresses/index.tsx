"use client";

import { setAddresses } from "@lib/data/cart";
import compareAddresses from "@lib/util/compare-addresses";
import { CheckCircleSolid } from "@medusajs/icons";
import { HttpTypes } from "@medusajs/types";
import { Heading, Text, useToggleState, Button } from "@medusajs/ui";
import Divider from "@modules/common/components/divider";
import Spinner from "@modules/common/icons/spinner";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useActionState } from "react";
import BillingAddress from "../billing_address";
import ErrorMessage from "../error-message";
import ShippingAddress from "../shipping-address";
import { SubmitButton } from "../submit-button";
import React, { useState, useEffect, useMemo } from "react";
import AddressSelect from "../address-select";
import { mapKeys } from "lodash";

const Addresses = ({
  cart,
  customer,
  countryCode,
}: {
  cart: HttpTypes.StoreCart | null;
  customer: HttpTypes.StoreCustomer | null;
  countryCode: string;
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const isOpen = searchParams.get("step") === "address";

  const [message, formAction] = useActionState(setAddresses, null);

  const handleEdit = () => {
    router.push(pathname + "?step=address");
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-md">
      <div className="flex flex-row items-center justify-between mb-6">
        <Heading
          level="h2"
          className="flex flex-row text-xl font-medium gap-x-2 items-center"
        >
          Shipping Address
          {!isOpen && <CheckCircleSolid className="text-green-500" />}
        </Heading>
      </div>
      {isOpen ? (
        <form action={formAction}>
          <div className="space-y-6">
            <ShippingAddress
              customer={customer}
              cart={cart}
            />
            <input type="hidden" name="email" value={cart?.email || ""} />
            {/* Copy shipping address fields to billing address */}
            <input type="hidden" name="billing_address.first_name" value={cart?.shipping_address?.first_name || ""} />
            <input type="hidden" name="billing_address.last_name" value={cart?.shipping_address?.last_name || ""} />
            <input type="hidden" name="billing_address.address_1" value={cart?.shipping_address?.address_1 || ""} />
            <input type="hidden" name="billing_address.address_2" value={cart?.shipping_address?.address_2 || ""} />
            <input type="hidden" name="billing_address.company" value={cart?.shipping_address?.company || ""} />
            <input type="hidden" name="billing_address.postal_code" value={cart?.shipping_address?.postal_code || ""} />
            <input type="hidden" name="billing_address.city" value={cart?.shipping_address?.city || ""} />
            <input type="hidden" name="billing_address.country_code" value={cart?.shipping_address?.country_code || ""} />
            <input type="hidden" name="billing_address.province" value={cart?.shipping_address?.province || ""} />
            <input type="hidden" name="billing_address.phone" value={cart?.shipping_address?.phone || ""} />
            <SubmitButton
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-medium transition-colors mt-4"
              data-testid="submit-address-button"
            >
              Continue to delivery
            </SubmitButton>
            <ErrorMessage error={message} data-testid="address-error-message" />
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          {customer?.addresses?.length ? (
            <AddressDropdown
              addresses={customer.addresses}
              cart={cart}
            />
          ) : (
            <Text>No saved addresses found.</Text>
          )}
          <Button
            onClick={handleEdit}
            className="w-full border border-blue-600 text-blue-600 py-3 rounded-md font-medium transition-colors hover:bg-blue-50"
          >
            Add New Address
          </Button>
        </div>
      )}
    </div>
  );
};

export default Addresses;

const AddressDropdown = ({ addresses, cart }: { addresses: any; cart: any }) => {
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [message, formAction] = useActionState(setAddresses, null);

  useEffect(() => {
    if (addresses.length > 0) {
      setSelectedAddress(addresses[0].id);
    }
  }, [addresses]);

  const handleChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const addressId = event.target.value;
    setSelectedAddress(addressId);

    const selected = addresses.find((addr: any) => addr.id === addressId);

    if (selected) {
      const addressData = {
        first_name: selected.first_name || "",
        last_name: selected.last_name || "",
        company: selected.company || "",
        address_1: selected.address_1 || "",
        address_2: selected.address_2 || "",
        city: selected.city || "",
        country_code: selected.country_code || "",
        province: selected.province || "",
        postal_code: selected.postal_code || "",
        phone: selected.phone || ""
      };

      const formData = new FormData();
      
      // Add email
      formData.append("email", cart?.email || "");
      
      // Add shipping address fields
      Object.entries(addressData).forEach(([key, value]) => {
        formData.append(`shipping_address.${key}`, value);
        // Also set same for billing address
        formData.append(`billing_address.${key}`, value);
      });
      
      formAction(formData);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        {addresses.map((address: any) => (
          <label
            key={address.id}
            className={`relative flex items-start p-4 cursor-pointer rounded-lg border ${
              selectedAddress === address.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-200'
            }`}
          >
            <div className="flex items-center h-5">
              <input
                type="radio"
                name="address"
                value={address.id}
                checked={selectedAddress === address.id}
                onChange={(e) => handleChange(e as any)}
                className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
            </div>
            <div className="ml-3 flex-grow">
              <div className="text-sm font-medium text-gray-900">
                {address.first_name} {address.last_name}
              </div>
              <div className="text-sm text-gray-500">
                {address.address_1}
                {address.address_2 && `, ${address.address_2}`}
              </div>
              <div className="text-sm text-gray-500">
                {address.city}, {address.province && `${address.province}, `}
                {address.postal_code}
              </div>
              <div className="text-sm text-gray-500">
                {address.country_code.toUpperCase()}
              </div>
              {address.phone && (
                <div className="text-sm text-gray-500">
                  Phone: {address.phone}
                </div>
              )}
            </div>
            {selectedAddress === address.id && (
              <div className="absolute top-4 right-4">
                <CheckCircleSolid className="h-5 w-5 text-blue-500" />
              </div>
            )}
          </label>
        ))}
      </div>
    </div>
  );
};
