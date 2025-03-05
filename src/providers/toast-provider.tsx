"use client"

import { Toaster } from 'react-hot-toast'

export function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 3000,
        style: {
          background: '#333',
          color: '#fff',
        },
        success: {
          duration: 3000,
          style: {
            background: '#48BB78',
          },
        },
        error: {
          duration: 4000,
          style: {
            background: '#F56565',
          },
        },
      }}
    />
  )
}
