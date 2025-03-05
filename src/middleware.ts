import { HttpTypes } from "@medusajs/types"
import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.MEDUSA_BACKEND_URL
const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
const DEFAULT_REGION = "reg_01JN72BDPDGWSTHAPMVN58J0MV"

export function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl

  // If the request is for a static asset, don't redirect
  if (pathname.includes(".") || pathname.startsWith("/_next")) {
    return NextResponse.next()
  }

  let regionId = request.cookies.get("regionId")?.value

  const response = NextResponse.next()

  if (!regionId) {
    response.cookies.set("regionId", DEFAULT_REGION)
  }

  if (pathname === "/") {
    return NextResponse.redirect(`${origin}/catalog`)
  }

  if (pathname.startsWith("/products")) {
    return NextResponse.redirect(`${origin}/catalog`)
  }

  return response
}
