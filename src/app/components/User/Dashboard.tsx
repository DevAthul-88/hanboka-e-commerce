"use client"

import { useQuery } from "@blitzjs/rpc"
import React from "react"
import getCurrentUser from "../../admin/customers/queries/getCurrentUser"
import { LogoutButton } from "../../(auth)/components/LogoutButton"

function Dashboard() {
  const [user] = useQuery(getCurrentUser, {})
  return (
    <div>
      <p>
        Hello <strong>{user?.name}</strong> (not <strong>{user?.name}?</strong> <LogoutButton />)
      </p>
      <p>
        From your account dashboard you can view your{" "}
        <a className="unerline-link" href="/user/orders">
          recent orders
        </a>
        , manage your{" "}
        <a className="unerline-link" href="/user/addresses">
          shipping and billing addresses
        </a>
        , and{" "}
        <a className="unerline-link" href="/user/settings">
          edit your password and account details.
        </a>
      </p>
    </div>
  )
}

export default Dashboard
