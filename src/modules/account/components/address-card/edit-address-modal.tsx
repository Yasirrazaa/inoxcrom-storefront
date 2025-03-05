"use client"

import { Button } from "@medusajs/ui"
import { Fragment, useState } from "react"
import { MapPin, Pencil, Trash2 } from "lucide-react"
import { HttpTypes } from "@medusajs/types"
import Input from "@modules/common/components/input"

type EditAddressProps = {
  address: HttpTypes.StoreCustomerAddress
  regions: HttpTypes.StoreRegion[]
}

const EditAddressModal: React.FC<EditAddressProps> = ({ address, regions }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    // TODO: Implement address deletion
    console.log("Deleting address:", address.id)
    setIsDeleting(false)
  }

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    // TODO: Implement address update
    console.log("Updating address:", address.id)
    setIsSubmitting(false)
    setIsEditing(false)
  }

  // If not editing, show address card
  if (!isEditing) {
    return (
      <div className="bg-white p-6 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-[#0093D0]" />
            <div>
              <h3 className="font-medium text-gray-900">
                {address.first_name} {address.last_name}
              </h3>
              {address.company && (
                <p className="text-gray-500 text-sm">{address.company}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 text-gray-500 hover:text-[#0093D0] rounded-full hover:bg-gray-50 transition-colors"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-gray-50 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="space-y-1 text-sm text-gray-500">
          <p>{address.address_1}</p>
          {address.address_2 && <p>{address.address_2}</p>}
          <p>
            {address.city}
            {address.province && `, ${address.province}`} {address.postal_code}
          </p>
          <p>{regions.flatMap(region => region.countries || []).find(c => c?.iso_2 === address.country_code)?.display_name}</p>
          {address.phone && (
            <p className="pt-2 text-gray-600">{address.phone}</p>
          )}
        </div>

        {address.is_default_billing && (
          <span className="inline-flex items-center px-2.5 py-0.5 mt-4 rounded-full text-xs font-medium bg-blue-50 text-blue-800">
            Default Billing Address
          </span>
        )}
      </div>
    )
  }

  // Edit form
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6 sticky top-0 bg-white pb-4 border-b">
          <div className="flex items-center gap-4">
            <MapPin className="w-8 h-8 text-[#0093D0]" />
            <div>
              <h2 className="text-xl font-bold">Edit Address</h2>
              <p className="text-sm text-gray-500">Update your shipping information</p>
            </div>
          </div>
          <button
            onClick={() => setIsEditing(false)}
            className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <span className="sr-only">Close</span>
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleEdit} className="space-y-6">
          {/* Name Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="First Name"
              name="first_name"
              defaultValue={address.first_name || ""}
              required
            />
            <Input
              label="Last Name"
              name="last_name"
              defaultValue={address.last_name || ""}
              required
            />
          </div>

          {/* Company Field */}
          <Input
            label="Company (Optional)"
            name="company"
            defaultValue={address.company || ""}
          />

          {/* Address Fields */}
          <Input
            label="Address Line 1"
            name="address_1"
            defaultValue={address.address_1 || ""}
            required
          />
          <Input
            label="Address Line 2 (Optional)"
            name="address_2"
            defaultValue={address.address_2 || ""}
          />

          {/* City, Province, Postal Code */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="City"
              name="city"
              defaultValue={address.city || ""}
              required
            />
            <Input
              label="State/Province"
              name="province"
              defaultValue={address.province || ""}
            />
            <Input
              label="Postal Code"
              name="postal_code"
              defaultValue={address.postal_code || ""}
              required
            />
          </div>

          {/* Country and Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country
              </label>
              <select
                name="country_code"
                defaultValue={address.country_code || ""}
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {regions.flatMap(region => region.countries || []).map((country) => (
                  country && (
                    <option key={country.iso_2} value={country.iso_2}>
                      {country.display_name}
                    </option>
                  )
                ))}
              </select>
            </div>
            <Input
              label="Phone Number"
              name="phone"
              type="tel"
              defaultValue={address.phone || ""}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t mt-8">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-6 py-2 text-gray-600 hover:text-gray-800 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <Button
              type="submit"
              isLoading={isSubmitting}
              className="bg-[#0093D0] text-white hover:bg-[#007bb3] px-6 py-2 rounded-lg transition-colors"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditAddressModal
