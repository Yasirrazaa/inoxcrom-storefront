"use client"

import { useEffect, useState } from "react"
import React from "react"

export function ClientWrapper({ children }: { children: React.ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  return (
    <html lang="en" className={isHydrated ? "hydrated" : ""}>
      <body>
        {children}
      </body>
    </html>
  )
}