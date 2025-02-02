"use client"
import { usePaginatedQuery } from "@blitzjs/rpc"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import getColors from "../queries/getColors"
import { Route } from "next"
import { ColorDataTable } from "./DataTable"
import { Button } from "@/src/app/components/ui/button"
import { useRefreshStore } from "@/state/useRefreshStore"
// Adjust the path based on your file structure

const ITEMS_PER_PAGE = 100

export const ColorsList = () => {
  const searchParams = useSearchParams()!
  const page = Number(searchParams.get("page")) || 0
  const router = useRouter()
  const pathname = usePathname()

  // Access Zustand store
  const { refreshTrigger } = useRefreshStore()

  // Refetch data whenever `refreshTrigger` changes
  const [{ colors, hasMore }, { refetch }] = usePaginatedQuery(getColors, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  const goToPreviousPage = () => {
    const params = new URLSearchParams(searchParams)
    params.set("page", (page - 1).toString())
    router.push((pathname + "?" + params.toString()) as Route)
  }

  const goToNextPage = () => {
    const params = new URLSearchParams(searchParams)
    params.set("page", (page + 1).toString())
    router.push((pathname + "?" + params.toString()) as Route)
  }

  return (
    <div>
      <ColorDataTable categories={colors} refreshData={refetch} />
      <div className="mt-2 flex gap-2">
        <Button disabled={page === 0} onClick={goToPreviousPage}>
          Previous
        </Button>
        <Button disabled={!hasMore} onClick={goToNextPage}>
          Next
        </Button>
      </div>
    </div>
  )
}
