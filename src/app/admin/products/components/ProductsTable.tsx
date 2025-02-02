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
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react"
import Link from "next/link"
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
import deleteProduct from "../mutations/deleteProduct"
import { create } from "zustand"
import { TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip"
import { Tooltip, TooltipContent } from "@/src/app/components/ui/tooltip"

interface Product {
  id: number
  sku: string
  name: string
  nameKorean?: string
  price: number
  salePrice?: number
  gender: string
  style: string
  category: { name: string }
  color?: { name: string; hexCode: string }
  stock: number
  isActive: boolean
  isFeatured: boolean
}

interface RefreshState {
  refreshTrigger: number
  triggerRefresh: () => void
}

export const useRefreshStore = create<RefreshState>((set) => ({
  refreshTrigger: 0,
  triggerRefresh: () => set((state) => ({ refreshTrigger: state.refreshTrigger + 1 })),
}))

export const ProductActions = ({ product }) => {
  const { triggerRefresh } = useRefreshStore()
  const router = useRouter()
  const [deleteProductMutation] = useMutation(deleteProduct)
  const [isDeleting, setIsDeleting] = React.useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteProductMutation({ id: product.id })

      toast.success("Product deleted successfully")
      triggerRefresh()
      setIsDeleting(false)
    } catch (error) {
      console.error("Failed to delete product:", error)
      toast.error("Failed to delete product")
      setIsDeleting(false)
    }
  }

  return (
    <div className="flex space-x-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            {" "}
            <Button variant="outline" size="icon" asChild>
              <Link href={`/admin/products/${product?.id}/images`}>
                <Plus className="h-4 w-4" />
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Add Images</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Button variant="outline" size="icon" asChild>
        <Link href={`/admin/products/${product?.id}/edit`}>
          <Pencil className="h-4 w-4" />
        </Link>
      </Button>

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
              This action cannot be undone. This will permanently delete the product "
              {product?.name}" and remove its data from our servers.
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

const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <Link href={`/admin/products/${row.original.id}`}>{row.original.name}</Link>,
  },
  {
    accessorKey: "sku",
    header: "SKU",
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const product = row.original
      return (
        <div className="flex gap-2 items-center">
          ${product.salePrice.toFixed(2)}
          {product.price && (
            <Badge variant="secondary" className="line-through text-gray-500">
              ${product.price.toFixed(2)}
            </Badge>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => row.original.category.name,
  },
  {
    accessorKey: "color",
    header: "Color",
    cell: ({ row }) => {
      const product = row.original
      return product.color ? (
        <div className="flex gap-2 items-center">
          <div
            className="w-8 h-4 rounded-lg"
            style={{ backgroundColor: product.color.hexCode }}
          ></div>
          {product.color.name}
        </div>
      ) : (
        "N/A"
      )
    },
  },
  {
    accessorKey: "stock",
    header: "Stock",
    cell: ({ row }) => {
      const product = row.original
      return (
        <Badge
          variant={product.stock > 10 ? "default" : product.stock > 0 ? "secondary" : "destructive"}
        >
          {product.stock}
        </Badge>
      )
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const product = row.original
      return (
        <div className="flex gap-2">
          {product.isActive && <Badge>Active</Badge>}
          {product.isFeatured && <Badge variant="secondary">Featured</Badge>}
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const product = row.original

      return <ProductActions product={product} />
    },
  },
]

export function ProductDataTable({ products, refreshData }: any) {
  const table = useReactTable({
    data: products,
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
