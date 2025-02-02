"use client"

import React, { ReactNode, useEffect, useState } from "react"
import { invoke } from "@blitzjs/rpc"
import { Routes } from "@blitzjs/next"
import { useRouter } from "next/navigation"
import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { Toaster } from "@/components/ui/sonner"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Spinner } from "../components/Loader"
import { usePathname } from "next/navigation"
import getCurrentUser from "../admin/customers/queries/getCurrentUser"

interface AdminLayoutProps {
  children: ReactNode
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [loading, setLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const router = useRouter()
  const [currentUser, setCurrentUser] = React.useState(null)
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean)

  const breadcrumbItems = [
    ...segments.map((segment, index) => ({
      label: segment.replace(/-/g, " ").toUpperCase(), // Format segment
      href: `/${segments.slice(0, index + 1).join("/")}`, // Construct the path up to the current segment
    })),
  ]

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true)
      try {
        const user = await invoke(getCurrentUser, null)
        setCurrentUser(user)

        // Check user authorization
        if (user?.role !== "ADMIN") {
          router.push("/") // Redirect non-admins to the home page
          setIsAuthorized(false)
        } else {
          setIsAuthorized(true)
        }
      } catch (error) {
        router.push("/login") // Redirect unauthenticated users to the login page
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [router])

  // While loading, show loading message
  if (loading) {
    return (
      <div className="mt-16">
        <Spinner />
      </div>
    )
  }

  // If not authorized, return null to prevent rendering
  if (!isAuthorized) {
    return null
  }

  return (
    <div>
      <SidebarProvider>
        <AppSidebar currentUser={currentUser} />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  {breadcrumbItems.map((item, index) => (
                    <React.Fragment key={index}>
                      <BreadcrumbItem className={index === 0 ? "hidden md:block" : ""}>
                        {item.href ? (
                          <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
                        ) : (
                          <BreadcrumbPage>{item.label}</BreadcrumbPage>
                        )}
                      </BreadcrumbItem>
                      {index < breadcrumbItems.length - 1 && (
                        <BreadcrumbSeparator className={index === 0 ? "hidden md:block" : ""} />
                      )}
                    </React.Fragment>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          <div className="p-4 pt-0">{children}</div>
        </SidebarInset>
      </SidebarProvider>
      <Toaster />
    </div>
  )
}
