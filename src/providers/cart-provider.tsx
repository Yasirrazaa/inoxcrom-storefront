"use client" // include with Next.js 13+

import { 
  createContext, 
  useContext, 
  useEffect, 
  useState,
} from "react"
import { HttpTypes } from "@medusajs/types"
import { useRegion } from "./region"

type CartContextType = {
  cart?: HttpTypes.StoreCart
  setCart: React.Dispatch<
    React.SetStateAction<HttpTypes.StoreCart | undefined>
  >
  refreshCart: () => void
  deleteCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | null>(null)

type CartProviderProps = {
  children: React.ReactNode
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cart, setCart] = useState<
    HttpTypes.StoreCart
  >()
  const { region } = useRegion()

  useEffect(() => {
    if (cart || !region) {
      return
    }

    const cartId = localStorage.getItem("cart_id")
    if (!cartId) {
      // create a cart
      fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/carts`, {
        method: "POST",
        credentials: "include",
        headers: {
          "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "temp",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          region_id: region.id,
        }),
      })
      .then((res) => res.json())
      .then(({ cart: dataCart }) => {
        localStorage.setItem("cart_id", dataCart.id)
        setCart(dataCart)
      })
    } else {
      // retrieve cart
      fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/carts/${cartId}`, {
        credentials: "include",
        headers: {
          "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "temp",
        },
      })
      .then((res) => res.json())
      .then(({ cart: dataCart }) => {
        setCart(dataCart)
      })
    }
  }, [cart, region])

  const deleteCart = async () => {
    const cartId = localStorage.getItem("cart_id")
    if (cartId) {
      try {
        // Clear front-end cart data first
        localStorage.removeItem("cart_id")
        setCart(undefined)
        
        // Then attempt to clean up on the server
        await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/carts/${cartId}/complete`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "temp",
          }
        }).catch(err => {
          // Just log the error, as we've already cleared the frontend state
          console.warn("Failed to complete cart on server:", err)
        })
      } catch (error) {
        console.warn("Error during cart cleanup:", error)
      }
    }
  }

  const refreshCart = () => {
    deleteCart()
  }

  return (
    <CartContext.Provider value={{
      cart,
      setCart,
      refreshCart,
      deleteCart,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }

  return context
}
