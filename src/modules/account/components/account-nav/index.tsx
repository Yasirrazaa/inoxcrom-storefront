"use client"

import { useParams, usePathname } from "next/navigation"
import { ArrowRightOnRectangle } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { signout } from "@lib/data/customer"
import { Layers, User, MapPin, Package, Home } from "lucide-react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

interface AccountNavProps {
  customer: HttpTypes.StoreCustomer | null
}

const AccountNav: React.FC<AccountNavProps> = ({
  customer,
}) => {
  const route = usePathname()
  const { countryCode } = useParams() as { countryCode: string }

  const handleLogout = async () => {
    await signout(countryCode)
  }

  const navItems = [
    {
      href: "/account",
      label: "Overview",
      icon: Home,
      description: "Account dashboard and summary"
    },
    {
      href: "/account/profile",
      label: "Profile",
      icon: User,
      description: "Manage your personal information"
    },
    {
      href: "/account/orders",
      label: "Orders",
      icon: Package,
      description: "View and track your orders"
    },
  ]

  return (
    <div className="w-full">
      {/* Mobile Navigation */}
      <div className="md:hidden" data-testid="mobile-account-nav">
        <div className="bg-white rounded-lg">
          {route !== "/account" ? (
            <LocalizedClientLink
              href="/account"
              className="flex items-center gap-2 p-4 text-gray-600 hover:text-[#0093D0] transition-colors"
            >
              <Layers className="w-5 h-5" />
              <span>Back to Account</span>
            </LocalizedClientLink>
          ) : (
            <div className="divide-y divide-gray-100">
              {navItems.map((item) => (
                <MobileNavLink
                  key={item.href}
                  href={item.href}
                  icon={item.icon}
                  route={route}
                  description={item.description}
                >
                  {item.label}
                </MobileNavLink>
              ))}
              <button
                onClick={handleLogout}
                className="flex items-center w-full p-4 text-gray-600 hover:text-red-600 transition-colors"
              >
                <ArrowRightOnRectangle className="w-5 h-5 mr-3" />
                <div>
                  <span className="font-medium">Log out</span>
                  <p className="text-sm text-gray-500">Sign out of your account</p>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:block" data-testid="desktop-account-nav">
        <nav className="space-y-1">
          {navItems.map((item) => (
            <DesktopNavLink
              key={item.href}
              href={item.href}
              icon={item.icon}
              route={route}
              description={item.description}
            >
              {item.label}
            </DesktopNavLink>
          ))}
          <button
            onClick={handleLogout}
            className="flex items-center w-full p-3 mt-4 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all duration-200"
          >
            <ArrowRightOnRectangle className="w-5 h-5 mr-3" />
            <div className="text-left">
              <span className="font-medium">Log out</span>
              <p className="text-sm text-gray-500">Sign out of your account</p>
            </div>
          </button>
        </nav>
      </div>
    </div>
  )
}

interface NavLinkProps {
  href: string
  route: string
  icon: React.ElementType
  children: React.ReactNode
  description: string
}

const MobileNavLink = ({ href, route, icon: Icon, children, description }: NavLinkProps) => {
  const active = route.includes(href)

  return (
    <LocalizedClientLink
      href={href}
      className={`block p-4 transition-colors ${
        active 
          ? "text-[#0093D0] bg-blue-50" 
          : "text-gray-600 hover:bg-gray-50 hover:text-[#0093D0]"
      }`}
    >
      <div className="flex items-center">
        <Icon className="w-5 h-5 mr-3" />
        <div>
          <span className="font-medium">{children}</span>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
    </LocalizedClientLink>
  )
}

const DesktopNavLink = ({ href, route, icon: Icon, children, description }: NavLinkProps) => {
  const active = route.includes(href)

  return (
    <LocalizedClientLink
      href={href}
      className={`flex items-center p-3 rounded-lg transition-all duration-200 ${
        active
          ? "text-[#0093D0] bg-blue-50"
          : "text-gray-600 hover:bg-gray-50 hover:text-[#0093D0]"
      }`}
    >
      <Icon className={`w-5 h-5 mr-3 flex-shrink-0 ${active ? "text-[#0093D0]" : "text-gray-400"}`} />
      <div>
        <span className="font-medium">{children}</span>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </LocalizedClientLink>
  )
}

export default AccountNav
