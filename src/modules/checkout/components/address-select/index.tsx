import { Listbox, Transition } from "@headlessui/react"
import { ChevronUpDown } from "@medusajs/icons"
import { clx } from "@medusajs/ui"
import { Fragment, useMemo } from "react"

import Radio from "@modules/common/components/radio"
import compareAddresses from "@lib/util/compare-addresses"
import { HttpTypes } from "@medusajs/types"

type AddressSelectProps = {
  addresses: HttpTypes.StoreCustomerAddress[]
  addressInput: HttpTypes.StoreCartAddress | null
  onSelect: (
    address: HttpTypes.StoreCartAddress | undefined,
    email?: string
  ) => void
}

const AddressSelect = ({
  addresses,
  addressInput,
  onSelect,
}: AddressSelectProps) => {
  const handleSelect = (id: string) => {
    const savedAddress = addresses.find((a) => a.id === id)
    if (savedAddress) {
      onSelect(savedAddress as HttpTypes.StoreCartAddress)
    }
  }

  const selectedAddress = useMemo(() => {
    return addresses.find((a) => compareAddresses(a, addressInput))
  }, [addresses, addressInput])

  return (
    <Listbox onChange={handleSelect} value={selectedAddress?.id}>
      <div className="relative space-y-4">
        <div className="text-sm font-medium text-gray-700">Saved Addresses</div>
        <Listbox.Button
          className={clx(
            "relative w-full flex justify-between items-center px-4 py-3 text-left bg-white",
            "border rounded-lg shadow-sm cursor-pointer hover:border-blue-500 transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          )}
          data-testid="shipping-address-select"
        >
          {({ open }) => (
            <>
              <div>
                {selectedAddress ? (
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {selectedAddress.first_name} {selectedAddress.last_name}
                    </span>
                    <span className="text-sm text-gray-500">
                      {selectedAddress.address_1}, {selectedAddress.city}
                    </span>
                  </div>
                ) : (
                  <span className="text-gray-500">Select a saved address</span>
                )}
              </div>
              <ChevronUpDown
                className={clx(
                  "w-5 h-5 text-gray-400 transition-transform duration-200",
                  { "transform rotate-180": open }
                )}
              />
            </>
          )}
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options
            className={clx(
              "absolute z-20 w-full mt-1 overflow-auto bg-white rounded-lg shadow-lg",
              "max-h-60 focus:outline-none divide-y divide-gray-100"
            )}
            data-testid="shipping-address-options"
          >
            {addresses.map((address) => {
              const isSelected = selectedAddress?.id === address.id;
              return (
                <Listbox.Option
                  key={address.id}
                  value={address.id}
                  className={({ active }) => clx(
                    "cursor-pointer select-none relative py-4 px-6",
                    active ? "bg-blue-50" : "",
                    isSelected ? "bg-blue-50" : ""
                  )}
                  data-testid="shipping-address-option"
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="mt-1">
                        <Radio
                          checked={isSelected}
                          data-testid="shipping-address-radio"
                        />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between">
                        <p className="text-sm font-medium text-gray-900">
                          {address.first_name} {address.last_name}
                        </p>
                        {isSelected && (
                          <span className="text-blue-600">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </span>
                        )}
                      </div>
                      {address.company && (
                        <p className="text-sm text-gray-500 mt-1">
                          {address.company}
                        </p>
                      )}
                      <div className="mt-2 text-sm text-gray-500 space-y-1">
                        <p>
                          {address.address_1}
                          {address.address_2 && (
                            <span>, {address.address_2}</span>
                          )}
                        </p>
                        <p>
                          {address.city}, {address.postal_code}
                        </p>
                        <p>
                          {address.province && `${address.province}, `}
                          {address.country_code?.toUpperCase()}
                        </p>
                        {address.phone && (
                          <p className="text-gray-400">
                            ☎️ {address.phone}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </Listbox.Option>
              )
            })}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  )
}

export default AddressSelect
