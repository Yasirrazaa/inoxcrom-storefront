"use client"

import React, { useEffect, useActionState, useState } from "react"
import { Lock, Eye, EyeOff } from "lucide-react"
import AccountInfo from "../account-info"
import { HttpTypes } from "@medusajs/types"
import { toast } from "@medusajs/ui"

type MyInformationProps = {
  customer: HttpTypes.StoreCustomer
}

const PasswordInput = ({ 
  label, 
  name, 
  "data-testid": dataTestId 
}: { 
  label: string
  name: string
  "data-testid"?: string
}) => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="flex flex-col gap-2">
      <label 
        htmlFor={name}
        className="text-gray-700 text-sm font-medium"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={name}
          name={name}
          type={showPassword ? "text" : "password"}
          required
          className="w-full pl-10 pr-12 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          data-testid={dataTestId}
        />
        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          {showPassword ? (
            <EyeOff className="w-5 h-5" />
          ) : (
            <Eye className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  )
}

const ProfilePassword: React.FC<MyInformationProps> = ({ customer }) => {
  const [successState, setSuccessState] = React.useState(false)

  // TODO: Add support for password updates
  const updatePassword = async () => {
    toast.info("Password update functionality is coming soon", {
      duration: 3000,
    })
  }

  const clearState = () => {
    setSuccessState(false)
  }

  return (
    <form
      action={updatePassword}
      onReset={() => clearState()}
      className="w-full"
    >
      <AccountInfo
        label="Password"
        currentInfo={
          <div className="flex items-center gap-x-2">
            <Lock className="w-5 h-5 text-gray-400" />
            <span className="text-gray-500 text-sm">
              ••••••••
            </span>
          </div>
        }
        isSuccess={successState}
        isError={false}
        errorMessage={undefined}
        clearState={clearState}
        data-testid="account-password-editor"
      >
        <div className="space-y-6">
          <PasswordInput
            label="Current Password"
            name="old_password"
            data-testid="old-password-input"
          />

          <hr className="border-gray-100" />

          <div className="space-y-4">
            <PasswordInput
              label="New Password"
              name="new_password"
              data-testid="new-password-input"
            />

            <PasswordInput
              label="Confirm New Password"
              name="confirm_password"
              data-testid="confirm-password-input"
            />

            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-800 mb-2">
                Password Requirements:
              </h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• At least 8 characters long</li>
                <li>• Contains at least one uppercase letter</li>
                <li>• Contains at least one number</li>
                <li>• Contains at least one special character</li>
              </ul>
            </div>
          </div>
        </div>
      </AccountInfo>
    </form>
  )
}

export default ProfilePassword
