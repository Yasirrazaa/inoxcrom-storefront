"use client"

import React, { useEffect } from "react"
import { Phone } from "lucide-react"
import AccountInfo from "../account-info"
import { HttpTypes } from "@medusajs/types"
import { updateCustomer } from "@lib/data/customer"
import Input from "@modules/common/components/input"

type MyInformationProps = {
  customer: HttpTypes.StoreCustomer,
  editMode: boolean,
  toggleEdit: () => void
}

const ProfilePhone: React.FC<MyInformationProps> = ({ customer, editMode, toggleEdit }) => {
  const [successState, setSuccessState] = React.useState(false)
  const [errorState, setErrorState] = React.useState<string | null>(null)

  const handleSubmit = async (formData: FormData) => {
    const customerUpdate = {
      phone: formData.get("phone") as string || ""
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
      label="Phone"
      currentInfo={
        <div className="flex items-center gap-x-2">
          <Phone className="w-5 h-5 text-gray-400" />
          <span className="text-gray-900">{customer.phone || "Add your phone number"}</span>
        </div>
      }
      isSuccess={successState}
      isError={!!errorState}
      errorMessage={errorState || "An error occurred while updating your phone number"}
      clearState={clearState}
      data-testid="account-phone-editor"
      editMode={editMode}
      onEdit={toggleEdit}
    >
      <form action={handleSubmit} className="w-full">
        <div className="grid grid-cols-1 gap-y-2">
          <Input
            label="Phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            required
            defaultValue={customer.phone || ""}
            data-testid="phone-input"
          />
        </div>
      </form>
    </AccountInfo>
  )
}

export default ProfilePhone
