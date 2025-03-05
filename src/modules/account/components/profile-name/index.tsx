"use client"

import React, { useEffect } from "react"
import { User } from "lucide-react"
import AccountInfo from "../account-info"
import { HttpTypes } from "@medusajs/types"
import { updateCustomer } from "@lib/data/customer"

type MyInformationProps = {
  customer: HttpTypes.StoreCustomer,
  editMode: boolean,
  toggleEdit: () => void
}

const ProfileName: React.FC<MyInformationProps> = ({ customer, editMode, toggleEdit }) => {
  const [successState, setSuccessState] = React.useState(false)
  const [errorState, setErrorState] = React.useState<string | null>(null)

  const handleSubmit = async (formData: FormData) => {
    const customerUpdate = {
      first_name: formData.get("first_name") as string || "",
      last_name: formData.get("last_name") as string || ""
    }

    try {
      const result = await updateCustomer(customerUpdate)
      if (result.success) {
        setSuccessState(true)
        setErrorState(null)
        toggleEdit()
      } else {
        setErrorState(result.error)
        setSuccessState(false)
      }
      return result;
    } catch (error: any) {
      setErrorState(error.toString());
      setSuccessState(false);
      return { success: false, error: error.toString() };
    }
  };

  const clearState = () => {
    setSuccessState(false)
    setErrorState(null)
  }

  const fullName = `${customer.first_name || ""} ${customer.last_name || ""}`.trim()

  return (
    <AccountInfo
      label="Name"
      currentInfo={
        <div className="flex items-center gap-x-2">
          <User className="w-5 h-5 text-gray-400" />
          <span className="text-gray-900">{fullName || "Add your name"}</span>
        </div>
      }
      isSuccess={successState}
      isError={!!errorState}
      errorMessage={errorState || ""}
      clearState={clearState}
      data-testid="account-name-editor"
      editMode={editMode}
      onEdit={toggleEdit}
    >
      <form action={handleSubmit} className="w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="first_name"
              className="text-gray-700 text-sm font-medium"
            >
              First name
            </label>
            <input
              id="first_name"
              name="first_name"
              type="text"
              required
              defaultValue={customer.first_name || ""}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter your first name"
              data-testid="first-name-input"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="last_name"
              className="text-gray-700 text-sm font-medium"
            >
              Last name
            </label>
            <input
              id="last_name"
              name="last_name"
              type="text"
              required
              defaultValue={customer.last_name || ""}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter your last name"
              data-testid="last-name-input"
            />
          </div>
        </div>
      </form>
    </AccountInfo>
  )
}

export default ProfileName
