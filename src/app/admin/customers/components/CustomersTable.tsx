"use client"

import * as React from "react"
import { type ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useMutation } from "@blitzjs/rpc"
import { create } from "zustand"
import deleteUser from "../mutations/deleteUser"

interface Category {
  id: number
  name: string
  slug: string
  description: string
  imageUrl: string | null
  parentId: number | null
  isActive: boolean
  sortOrder: number
}

interface RefreshState {
  refreshTrigger: number
  triggerRefresh: () => void
}

export const useRefreshStore = create<RefreshState>((set) => ({
  refreshTrigger: 0,
  triggerRefresh: () => set((state) => ({ refreshTrigger: state.refreshTrigger + 1 })),
}))

export const CategoryActions = ({ category }: any) => {
  const router = useRouter()
  const [deleteCategoryMutation] = useMutation(deleteUser)
  const [isDeleting, setIsDeleting] = React.useState(false)
  const { triggerRefresh } = useRefreshStore()

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteCategoryMutation({ id: category.id })

      toast.success("Customer deleted successfully")
      router.refresh()
      triggerRefresh()
    } catch (error) {
      console.error("Failed to delete customer:", error)
      toast.error("Failed to delete customer")
      setIsDeleting(false)
    }
  }

  return (
    <div className="flex space-x-2">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline" size="icon">
            <Trash2 className="h-4 w-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the customer "
              {category?.name}" and remove its data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

const columns: ColumnDef<Category>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "totalOrders",
    header: "Total Orders",
    cell: ({ row }) => {
      const category = row.original

      return <Badge>{category?.totalOrders}</Badge>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const category = row.original

      return <CategoryActions category={category} />
    },
  },
]

export function CustomersTable({ categories, refreshData }: any) {
  const table = useReactTable({
    data: categories,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const { refreshTrigger } = useRefreshStore()

  React.useEffect(() => {
    refreshData()
  }, [refreshTrigger])

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
