"use client"

import * as React from "react"
import Link from "next/link"
import { Menu, Search, X, Heart, ShoppingBag, ChevronDown } from "lucide-react"

import { MobileNav } from "./mobile-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"
import { invoke, usePaginatedQuery, useQuery } from "@blitzjs/rpc"
import getCategoriesSub from "../../admin/categories/queries/getCategoriesSub"
import { usePathname } from "next/navigation"
import MarqueeScroller from "./MarqueeScroller"
import Logo from "../../assets/logo.png"
import Image from "next/image"
import getCurrentUser from "../../admin/customers/queries/getCurrentUser"
import { UserProfileDropdown } from "../UserProfileDropdown"
import { Skeleton } from "../ui/skeleton"
import { useCartContext } from "../CartContext"
import { ProductSearch } from "../autocomplete-search"

const topNavItems = [
  { title: "Offers", href: "#" },
  { title: "Fanbook", href: "#" },
  { title: "Download App", href: "#" },
  { title: "Find a store near me", href: "#" },
]

const UserDropdownSkeleton = () => {
  return (
    <div className="flex items-center gap-2">
      <Skeleton className="h-8 w-8 rounded-full" />
      <div className="flex flex-col gap-1">
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  )
}

const categoryNavItems = [
  { title: "HOME", href: "/" },
  { title: "ABOUT US", href: "/about" },
  { title: "PRODUCTS", href: "/products" },
  { title: "SIZE CHART", href: "/size-chart" },
  { title: "CONTACT US", href: "/contact-us" },
]

const UserSection = () => {
  const [user] = useQuery(getCurrentUser, {})

  if (!user) {
    return (
      <Button variant="outline" size="sm" className="hidden md:inline-flex">
        <Link href={"/login"}>LOGIN</Link>
      </Button>
    )
  }

  return <UserProfileDropdown user={user} />
}

export function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = React.useState(false)
  const [activeCategory, setActiveCategory] = React.useState<string | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
  const currentPath = usePathname()
  const [user] = useQuery(getCurrentUser, {})
  const [{ categories }] = useQuery(getCategoriesSub, {})
  const { isOpen, openCart, closeCart, isLoading, cartCount } = useCartContext()

  // Filter out categories with parentId to get top-level categories
  const topLevelCategories = categories?.filter((cat) => !cat.parentId) || []

  // Function to get child categories for a parent
  const getChildCategories = (parentId) => {
    return categories?.filter((cat) => cat.parentId === parentId) || []
  }

  const handleOpenCart = () => {
    openCart()
  }

  return (
    <header className="w-full border-b">
      {/* Top Navigation */}
      <MarqueeScroller />

      {/* Main Navigation */}
      <div className="relative">
        <div className="flex items-center justify-between  py-2 max-w-7xl mx-auto">
          <div className="flex items-center">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="mr-2 lg:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full sm:w-[380px] p-0">
                <SheetHeader className="p-4 border-b">
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <MobileNav items={categories} />
              </SheetContent>
            </Sheet>
            <Link href="/" className="mr-6 text-xl font-bold">
              <Image src={Logo.src} width={100} height={140} />
            </Link>
            <NavigationMenu className="hidden lg:flex">
              <NavigationMenuList>
                {topLevelCategories.map((item) => (
                  <NavigationMenuItem key={item.id}>
                    {item.children?.length > 0 ? (
                      <>
                        <NavigationMenuTrigger className="h-10 text-sm font-medium">
                          {item.name}
                        </NavigationMenuTrigger>

                        <NavigationMenuContent>
                          <div className="w-[800px] p-6">
                            <div className="grid grid-cols-4 gap-4">
                              <div className="col-span-3 grid grid-cols-3 gap-6">
                                {item.children.map((category) => (
                                  <div key={category.id}>
                                    <div className="font-medium text-sm mb-2">
                                      <Link
                                        href={`/categories/${category.slug}`}
                                        className="text-sm text-gray-600 hover:text-primary"
                                      >
                                        {category.name}
                                      </Link>
                                    </div>

                                    <ul className="space-y-2">
                                      {getChildCategories(category.id).map((subItem) => (
                                        <li key={subItem.id}>
                                          <Link
                                            href={`/categories/${subItem.slug}`}
                                            className="text-sm text-gray-600 hover:text-primary"
                                          >
                                            {subItem.name}
                                          </Link>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                ))}
                              </div>

                              <div className="col-span-1">
                                {item.description && (
                                  <div className="text-sm text-gray-600">{item.description}</div>
                                )}
                              </div>
                            </div>
                          </div>
                        </NavigationMenuContent>
                      </>
                    ) : (
                      <NavigationMenuLink asChild>
                        <Link
                          href={`/categories/${item.slug}`}
                          className={cn(
                            "h-10 text-sm font-medium inline-flex items-center px-4 py-2 hover:bg-accent hover:text-accent-foreground rounded-md"
                          )}
                        >
                          {item.name}
                        </Link>
                      </NavigationMenuLink>
                    )}
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          <div className="flex items-center space-x-4">
            <ProductSearch />
            <Button variant="ghost" size="icon" className="hover:bg-gray-100">
              <Heart className="h-5 w-5" />
              <span className="sr-only">Wishlist</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="relative hover:bg-gray-100"
              onClick={handleOpenCart}
            >
              <ShoppingBag className="h-10 w-10" /> {/* Increased size */}
              {cartCount >= 0 && (
                <span className="absolute top-0 right-0 flex items-center justify-center h-5 w-5 text-xs font-semibold text-white bg-red-500 rounded-full">
                  {cartCount}
                </span>
              )}
              <span className="sr-only">Cart</span>
            </Button>

            <React.Suspense fallback={<UserDropdownSkeleton />}>
              <UserSection />
            </React.Suspense>
          </div>
        </div>

        {/* Full-width Search Bar */}
        <div
          className={cn(
            "absolute left-0 top-full w-full bg-white shadow-md transition-all duration-300 ease-in-out z-50",
            isSearchOpen ? "opacity-100 visible" : "opacity-0 invisible"
          )}
        >
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search by product, category or collection"
                className="w-full pl-10 pr-4 py-2 border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="hidden lg:block bg-black">
        <div className="max-w-7xl mx-auto">
          <nav className="flex justify-start">
            {categoryNavItems.map((item) => {
              const isActive = currentPath === item.href

              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className={cn(
                    "px-6 py-3 text-sm font-medium text-white transition-colors relative bottom_nav",
                    "hover:bg-white hover:text-black",
                    isActive && "bg-white text-black border border-black",
                    "first:pl-4 last:pr-4"
                  )}
                >
                  {item.title}
                </Link>
              )
            })}

            {user !== null ? (
              <>
                <Link
                  href={"/user/profile"}
                  className={cn(
                    "px-6 py-3 text-sm font-medium text-white transition-colors relative bottom_nav",
                    "hover:bg-white hover:text-black",
                    currentPath === "/login" && "bg-white text-black border border-black",
                    "first:pl-4 last:pr-4"
                  )}
                >
                  PROFILE
                </Link>
                {user?.role == "ADMIN" && (
                  <Link
                    href={"/admin"}
                    className={cn(
                      "px-6 py-3 text-sm font-medium text-white transition-colors relative bottom_nav",
                      "hover:bg-white hover:text-black",
                      currentPath === "/login" && "bg-white text-black border border-black",
                      "first:pl-4 last:pr-4"
                    )}
                  >
                    DASHBOARD
                  </Link>
                )}
              </>
            ) : (
              <Link
                href={"/login"}
                className={cn(
                  "px-6 py-3 text-sm font-medium text-white transition-colors relative bottom_nav",
                  "hover:bg-white hover:text-black",
                  currentPath === "/login" && "bg-white text-black border border-black",
                  "first:pl-4 last:pr-4"
                )}
              >
                LOGIN / REGISTER
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
