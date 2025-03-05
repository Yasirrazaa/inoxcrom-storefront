"use client"

import { useState, useCallback } from "react"
import { HttpTypes } from "@medusajs/types"
import ProfileName from "../profile-name"
import ProfileEmail from "../profile-email"
import ProfilePassword from "../profile-password"
import ProfilePhone from "../profile-phone"
import ProfileBillingAddress from "../profile-billing-address"

type ProfileContentProps = {
  customer: HttpTypes.StoreCustomer
  regions: HttpTypes.StoreRegion[]
}

const ProfileContent = ({ customer, regions }: ProfileContentProps) => {
  const [editStates, setEditStates] = useState({
    name: false,
    email: false,
    phone: false
  })

  const toggleEdit = useCallback((field: keyof typeof editStates) => {
    setEditStates(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }, [])

  const handleSuccess = useCallback((field: keyof typeof editStates) => {
    setEditStates(prev => ({
      ...prev,
      [field]: false
    }))
  }, [])

  return (
    <div className="w-full">
      <div className="mb-8 flex flex-col gap-y-4">
        <h1 className="text-2xl-semi">Profile</h1>
        <p className="text-base-regular">
          View and update your profile information, including your name, email, and password.
        </p>
      </div>
      <div className="flex flex-col gap-y-8">
        <ProfileName
          customer={customer}
          editMode={editStates.name}
          toggleEdit={() => toggleEdit('name')}
        />
        <ProfileEmail
          customer={customer}
          editMode={editStates.email}
          toggleEdit={() => toggleEdit('email')}
        />
        <ProfilePassword customer={customer} />
        <ProfilePhone
          customer={customer}
          editMode={editStates.phone}
          toggleEdit={() => toggleEdit('phone')}
        />
        <ProfileBillingAddress regions={regions} customer={customer} />
      </div>
    </div>
  )
}

export default ProfileContent