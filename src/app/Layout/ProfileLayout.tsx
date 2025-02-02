"use client"

import React, { useEffect, useState } from "react"
import MainLayout from "./MainLayout"
import Banner from "../components/Banner"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Toaster } from "@/components/ui/sonner"
import { invoke } from "@blitzjs/rpc"
import getCurrentUser from "../admin/customers/queries/getCurrentUser"
import { Spinner } from "../components/Loader"

function ProfileLayout({ children, name }: any) {
  const pathname = usePathname()
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  const isActive = (link: string) => (pathname === link ? "menu-link_active" : "")

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true)
      try {
        const user = await invoke(getCurrentUser, null)
        if (user !== null) {
          return
        } else {
          router.push("/login")
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

  return (
    <MainLayout>
      <Toaster />
      <>
        <Banner name={name} />
        <main>
          <div className="mb-4 pb-4" />
          <section className="my-account container">
            <h2 className="page-title">{name}</h2>
            <div className="row">
              <div className="col-lg-3">
                <ul className="account-nav">
                  <li>
                    <Link
                      href="/user/profile"
                      className={`menu-link menu-link_us-s ${isActive("/user/profile")}`}
                      scroll={false}
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/user/orders"
                      className={`menu-link menu-link_us-s ${isActive("/user/orders")}`}
                      scroll={false}
                    >
                      Orders
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/user/addresses"
                      className={`menu-link menu-link_us-s ${isActive("/user/addresses")}`}
                      scroll={false}
                    >
                      Addresses
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/user/details"
                      className={`menu-link menu-link_us-s ${isActive("/user/details")}`}
                      scroll={false}
                    >
                      Account Details
                    </Link>
                  </li>

                  <li>
                    <Link
                      href="/user/danger-zone"
                      className={`menu-link menu-link_us-s ${isActive("/user/danger-zone")}`}
                      scroll={false}
                    >
                      Danger Zone
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="col-lg-9">
                <div className="page-content my-account__dashboard">{children}</div>
              </div>
            </div>
          </section>
        </main>
        <div className="mb-5 pb-xl-5" />
      </>
    </MainLayout>
  )
}

export default ProfileLayout
