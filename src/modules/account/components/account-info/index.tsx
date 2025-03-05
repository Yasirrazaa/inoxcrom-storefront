"use client"

import { Button } from "@medusajs/ui"
import { Pencil, Check, X } from "lucide-react"
import { useFormStatus } from "react-dom"

type AccountInfoProps = {
  label: string
  currentInfo: string | React.ReactNode
  isSuccess?: boolean
  isError?: boolean
  errorMessage?: string
  clearState: () => void
  children?: React.ReactNode
  'data-testid'?: string
  editMode: boolean
  onEdit?: () => void
}

const AccountInfo = ({
  label,
  currentInfo,
  isSuccess,
  isError,
  clearState,
  errorMessage = "An error occurred, please try again",
  children,
  'data-testid': dataTestid,
  editMode,
  onEdit
}: AccountInfoProps) => {
  const { pending } = useFormStatus()

  const handleSubmit = () => {
    // Find and submit the form
    const form = document.getElementById('address-form') as HTMLFormElement
    if (form) {
      form.requestSubmit()
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6" data-testid={dataTestid}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex flex-col">
          <span className="text-sm text-gray-500 mb-1">{label}</span>
          <div className="flex items-center gap-x-4">
            {typeof currentInfo === "string" ? (
              <span className="text-lg font-medium text-gray-900">
                {currentInfo}
              </span>
            ) : (
              currentInfo
            )}
          </div>
        </div>
        <Button
          variant="secondary"
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            editMode
              ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
              : "bg-gray-50 text-gray-600 hover:bg-gray-100"
          }`}
          type={editMode ? "reset" : "button"}
          onClick={onEdit}
          data-testid={`${dataTestid}-edit-button`}
          data-active={editMode}
        >
          {editMode ? (
            <>
              <X className="w-4 h-4" />
              <span>Cancel</span>
            </>
          ) : (
            <>
              <Pencil className="w-4 h-4" />
              <span>Edit</span>
            </>
          )}
        </Button>
      </div>

      {/* Success message */}
      {isSuccess && (
        <div className="flex items-center gap-2 p-3 bg-green-50 text-green-700 rounded-lg mb-4" data-testid="success-message">
          <Check className="w-5 h-5" />
          <span>{label} updated successfully</span>
        </div>
      )}

      {/* Error message */}
      {isError && (
        <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg mb-4" data-testid="error-message">
          <X className="w-5 h-5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Edit Form */}
      {editMode && (
        <div className="space-y-4 pt-4 border-t border-gray-100">
          {children}
          <div className="flex justify-end">
            <Button
              className="bg-[#0093D0] text-white hover:bg-blue-600 px-6 py-2 rounded-lg transition-colors"
              isLoading={pending}
              onClick={handleSubmit}
              type="button"
              data-testid="save-button"
            >
              Save changes
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AccountInfo
