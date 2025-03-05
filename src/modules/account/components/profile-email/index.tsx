"use client"

import React, { useEffect } from "react"
import { Mail } from "lucide-react"
import AccountInfo from "../account-info"
import { HttpTypes } from "@medusajs/types"
import { updateCustomer } from "@lib/data/customer"

type MyInformationProps = {
  customer: HttpTypes.StoreCustomer,
  editMode: boolean,
  toggleEdit: () => void
}

const ProfileEmail: React.FC<MyInformationProps> = ({ customer, editMode, toggleEdit }) => {
  const [successState, setSuccessState] = React.useState(false)
  const [errorState, setErrorState] = React.useState<string | null>(null)

  const handleSubmit = async (formData: FormData) => {
    const customerUpdate = {
      email: formData.get("email") as string || ""
    }

    try {
      const result = await updateCustomer(customerUpdate)
      if (result.success) {
        setSuccessState(true)
        setErrorState(null)
        toggleEdit()
      } else {
        setErrorState(result.error);
        setSuccessState(false);
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

  return (
    <AccountInfo
      label="Email Address"
      currentInfo={
        <div className="flex items-center gap-x-2">
          <Mail className="w-5 h-5 text-gray-400" />
          <span className="text-gray-900">{customer.email}</span>
        </div>
      }
      isSuccess={successState}
      isError={!!errorState}
      errorMessage={errorState || "An error occurred while updating your email"}
      clearState={clearState}
      data-testid="account-email-editor"
      editMode={editMode}
      onEdit={toggleEdit}
    >
      <form action={handleSubmit} className="w-full">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="email"
            className="text-gray-700 text-sm font-medium"
          >
            New Email Address
          </label>
          <div className="relative">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              defaultValue={customer.email || ""}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter your email address"
              data-testid="email-input"
            />
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
          <p className="text-sm text-gray-500 mt-1">
            We'll send a verification email to confirm this change
          </p>
        </div>
      </form>
    </AccountInfo>
  )
}

export default ProfileEmail
