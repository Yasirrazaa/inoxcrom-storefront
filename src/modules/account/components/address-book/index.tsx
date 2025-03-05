"use client"
import React, { useState } from "react"
import { Plus, MapPin } from "lucide-react"
import AddAddress from "../address-card/add-address"
import EditAddress from "../address-card/edit-address-modal"
import { Address } from "../../../../types/address"

const AddressBook = ({ customer, regions }: { customer: { addresses: Address[] }, regions: any[] }) => {
  const [addAddressOpen, setAddAddressOpen] = useState(false)
  const [editAddressOpen, setEditAddressOpen] = useState(false)
  const [addressToEdit, setAddressToEdit] = useState<Address | null>(null)

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center gap-4 mb-6">
        <MapPin className="w-8 h-8 text-[#0093D0]" />
        <div>
          <h3 className="text-lg font-bold">Shipping Addresses</h3>
          <p className="text-sm text-gray-500">Manage your delivery locations</p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-3xl font-bold text-gray-900">{customer.addresses.length}</span>
          <span className="text-sm text-gray-500 ml-2">
            {customer.addresses.length === 1 ? 'Address' : 'Addresses'} saved
          </span>
        </div>
        <button
          onClick={() => setAddAddressOpen(true)}
          className="inline-flex items-center px-6 py-2 bg-[#0093D0] text-white rounded-lg hover:bg-[#007bb3] transition-colors duration-200 text-sm font-medium"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Address
        </button>
      </div>

      {customer.addresses.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {customer.addresses.map((address) => (
            <div
              key={address.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-[#0093D0] transition-colors duration-200"
            >
              <div className="mb-4 sm:mb-0">
                <h3 className="text-base font-bold mb-1">{address.first_name} {address.last_name}</h3>
                <p className="text-sm text-gray-600">
                  {address.address_1}
                  {address.address_2 && <span>, {address.address_2}</span>}
                </p>
                <p className="text-sm text-gray-600">
                  {address.city}, {address.province} {address.postal_code}
                </p>
                <p className="text-sm text-gray-600">{address.country_code}</p>
              </div>
              <button
                onClick={() => {
                  setAddressToEdit({...address, is_default_shipping: false, is_default_billing: false})
                  setEditAddressOpen(true)
                }}
                className="inline-flex items-center px-4 py-2 border border-[#0093D0] text-[#0093D0] rounded-lg hover:bg-blue-50 transition-colors duration-200 text-sm font-medium"
              >
                <MapPin className="h-4 w-4 mr-2" />
                Edit Address
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 border border-dashed border-gray-200 rounded-lg">
          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 mb-2">No addresses saved yet</p>
          <p className="text-sm text-gray-400">Add your first shipping address to speed up checkout</p>
        </div>
      )}
      {addAddressOpen && (
        <AddAddress
          regions={regions}
          addresses={customer.addresses.map(address => ({...address, is_default_shipping: false, is_default_billing: false}))}
        />
      )}
      {editAddressOpen && addressToEdit && (
        <EditAddress
          address={addressToEdit}
          regions={regions}
        />
      )}
    </div>
  )
}

export default AddressBook
