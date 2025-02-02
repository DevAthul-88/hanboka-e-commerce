"use client"

import React, { useState } from "react"
import { usePaginatedQuery } from "@blitzjs/rpc"
import { useRouter } from "next/navigation"
import { useSearchParams, usePathname } from "next/navigation"
import { Route } from "next"
import { useSession } from "@blitzjs/auth"
import getAddresses from "../queries/getAddresses"
import setDefaultAddress from "../mutations/setDefaultAddress"
import deleteAddress from "../mutations/deleteAddress"
import { Star, StarOff, Edit, Trash2, MapPin, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const ITEMS_PER_PAGE = 100

export const AddressesList = () => {
  const session = useSession()
  const searchParams = useSearchParams()!
  const page = Number(searchParams.get("page")) || 0
  const [{ addresses, hasMore }, { refetch }] = usePaginatedQuery(getAddresses, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
    userId: session?.userId,
  })
  const router = useRouter()
  const pathname = usePathname()
  const [loadingAddressId, setLoadingAddressId] = useState<number | null>(null)
  const [addressToDelete, setAddressToDelete] = useState<number | null>(null)
  const [AddressDelete, setAddressDelete] = useState<boolean | null>(false)

  const goToPreviousPage = () => {
    const params = new URLSearchParams(searchParams)
    params.set("page", (page - 1).toString())
    router.push((pathname + "?" + params.toString()) as Route, { scroll: false })
  }

  const goToNextPage = () => {
    const params = new URLSearchParams(searchParams)
    params.set("page", (page + 1).toString())
    router.push((pathname + "?" + params.toString()) as Route, { scroll: false })
  }

  const handleSetDefault = async (addressId: number) => {
    setLoadingAddressId(addressId)
    try {
      await setDefaultAddress({ addressId })
      toast.success("Default address updated successfully!")
      setLoadingAddressId(null)
      refetch()
    } catch (error) {
      toast.error("Failed to update default address. Please try again.")
    }
  }

  const handleDelete = async () => {
    if (!addressToDelete) return
    setAddressDelete(true)

    setLoadingAddressId(addressToDelete)
    try {
      await deleteAddress({ id: addressToDelete })
      toast.success("Address deleted successfully!")
      refetch()
      setAddressDelete(false)
    } catch (error) {
      toast.error("Failed to delete address. Please try again.")
      setAddressDelete(false)
    } finally {
      setLoadingAddressId(null)
      setAddressToDelete(null)
    }
  }

  return (
    <>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {addresses.map((address) => (
            <Card key={address.id} className="shadow-md hover:shadow-lg transition-all">
              <CardHeader className="flex flex-row justify-between items-center">
                <CardTitle className="text-lg font-semibold">{address.street}</CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleSetDefault(address.id)}
                    title={address.isDefault ? "Default Address" : "Set as Default"}
                    disabled={loadingAddressId === address.id || address.isDefault}
                  >
                    {loadingAddressId === address.id ? (
                      <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                    ) : address.isDefault ? (
                      <Star className="w-5 h-5 text-yellow-500" />
                    ) : (
                      <StarOff className="w-5 h-5 text-gray-400" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.push(`/user/addresses/${address.id}/edit`)}
                  >
                    <Edit className="w-5 h-5 text-gray-600" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setAddressToDelete(address.id)}
                    disabled={address.isDefault}
                    title={address.isDefault ? "Cannot delete default address" : "Delete address"}
                  >
                    <Trash2 className="w-5 h-5 text-red-500" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="text-sm text-gray-600 space-y-2">
                <div className="flex items-start gap-2">
                  <div>
                    <MapPin className="w-4 h-4 mt-0.5 text-gray-500" />
                  </div>
                  <div>
                    <p>
                      {address.city}, {address.state}
                    </p>
                    <p>{address.postalCode}</p>
                    <p>{address.country}</p>
                  </div>
                </div>
                {address.text && address.text !== "N/A" && (
                  <p className="mt-2 text-gray-500 italic">{address.text}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-between items-center mt-6">
          <button
            onClick={goToPreviousPage}
            disabled={page === 0}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            onClick={goToNextPage}
            disabled={!hasMore}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>

      <div>
        <AlertDialog open={!!addressToDelete} onOpenChange={() => setAddressToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure you want to delete this address?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This address will be permanently deleted from your
                account.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-600 mt-2"
              >
                {AddressDelete ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  )
}

export default AddressesList
