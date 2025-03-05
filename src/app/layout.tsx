import "@/styles/globals.css"
import React from "react"
import { ClientWrapper } from "@/components/client-wrapper"
import { metadata } from "./metadata"
import { Inter } from "next/font/google"
import { ToastProvider } from "../providers/toast-provider"
import { CartProvider } from "../providers/cart-provider"
import { RegionProvider } from "../providers/region"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  preload: true,
})

export { metadata }

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-mode="light">
      <body className={inter.variable}>
        <RegionProvider>
          <CartProvider>
            {children}
            <ToastProvider />
          </CartProvider>
        </RegionProvider>
      </body>
    </html>
  )
}
