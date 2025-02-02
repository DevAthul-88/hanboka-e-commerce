import { Metadata } from "next"
import Link from "next/link"
import { Suspense } from "react"

import { AdminLayout } from "../../Layout/AdminLayout"
import { Spinner } from "../../components/Loader"
import { OrdersList } from "./components/OrdersList"

export const metadata: Metadata = {
  title: "Orders",
  description: "List of orders",
}

export default function Page() {
  return (
    <AdminLayout>
      <div className="flex flex-wrap justify-between align-middle items-center">
        <div>
          <h2 className=" text-2xl font-bold">Orders</h2>
        </div>
      </div>

      <div className="mt-6">
        <Suspense
          fallback={
            <div className="mt-16">
              <Spinner />
            </div>
          }
        >
          <OrdersList />
        </Suspense>
      </div>
    </AdminLayout>
  )
}
