"use client"

import { useState, useEffect } from "react"
import { Package, DollarSign, Tag, Loader2 } from "lucide-react"
import { format } from "date-fns"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"

interface Color {
  id: number
  name: string
  nameKorean: string | null
  hexCode: string
}

interface Category {
  id: number
  name: string
  nameKorean: string | null
  slug: string
  description: string
  imageUrl: string | null
  parentId: number | null
  isActive: boolean
  sortOrder: number
}

interface ProductDetails {
  id: number
  sku: string
  name: string
  slug: string
  description: string
  price: number
  salePrice: number
  gender: string
  style: string
  colorId: number
  categoryId: number
  stock: number
  isActive: boolean
  isFeatured: boolean
  weight: number
  dimensions: string
  material: string
  careInstructions: string
  tags: string
  createdAt: string
  updatedAt: string
  images: string[]
  sizes: string[]
  color: Color
  category: Category
}

export default function ProductDetails({ productData }: any) {
  const [product, setProduct] = useState<ProductDetails | null>(productData)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulating an API call
    const fetchProduct = async () => {
      setLoading(true)
      try {
        // Replace this with your actual API call
        const response = await fetch("/api/product/1")
        if (!response.ok) throw new Error("Failed to fetch product")
        const data = await response.json()
        setProduct(data)
      } catch (error) {
        console.error("Error fetching product:", error)
        // You might want to set an error state here
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [])

  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto space-y-8 pt-4">
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="w-full max-w-6xl mx-auto space-y-8 pt-4">
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Product not found or an error occurred.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 pt-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span className="text-3xl font-bold">{product.name}</span>
            <div className="flex gap-2">
              <Badge variant={product.isActive ? "default" : "secondary"} className="text-sm">
                {product.isActive ? "Active" : "Inactive"}
              </Badge>
              {product.isFeatured && (
                <Badge variant="outline" className="text-sm">
                  Featured
                </Badge>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-muted-foreground" />
                <span className="font-semibold">SKU:</span> {product.sku || "N/A"}
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-muted-foreground" />
                <span className="font-semibold">Price:</span> ${product.price?.toFixed(2) || "N/A"}
              </div>
              <div className="flex items-center gap-2">
                <Tag className="h-5 w-5 text-muted-foreground" />
                <span className="font-semibold">Category:</span> {product.category?.name || "N/A"}
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  <div
                    className="w-5 h-5 rounded-full border mr-2"
                    style={{ backgroundColor: product.color?.hexCode || "#CCCCCC" }}
                  />
                  <span className="font-semibold">Color:</span>
                </div>
                {product.color?.name || "N/A"}
              </div>
            </div>
            <div>
              <span className="font-semibold">Images:</span>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {product.images && product.images.length > 0 ? (
                  product.images.map((image, index) => (
                    <img
                      key={index}
                      src={image?.url || "/placeholder.svg"}
                      alt={`Product image ${index + 1}`}
                      className="w-full h-32 object-cover rounded-md"
                    />
                  ))
                ) : (
                  <div className="col-span-2 flex items-center justify-center h-32 bg-muted rounded-md">
                    <p className="text-muted-foreground">No images available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Product Description</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{
              __html: product.description || "<p>No description available</p>",
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Product Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Gender</TableCell>
                <TableCell>{product.gender || "N/A"}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Style</TableCell>
                <TableCell>{product.style || "N/A"}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Material</TableCell>
                <TableCell>{product.material || "N/A"}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Weight</TableCell>
                <TableCell>{product.weight ? `${product.weight} kg` : "N/A"}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Dimensions</TableCell>
                <TableCell>{product.dimensions || "N/A"}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Care Instructions</TableCell>
                <TableCell>{product.careInstructions || "N/A"}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Tags</TableCell>
                <TableCell>{product.tags || "N/A"}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Product Sizes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableBody>
              {product?.ProductSize.map((e, index) => {
                return (
                  <TableRow>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>{e?.size?.name || "N/A"}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <span className="text-lg">Current Stock:</span>
            <Badge variant="outline" className="text-lg">
              {product.stock || "0"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Additional Information</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Created At</TableCell>
                <TableCell>
                  {product.createdAt ? format(new Date(product.createdAt), "PPpp") : "N/A"}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Last Updated</TableCell>
                <TableCell>
                  {product.updatedAt ? format(new Date(product.updatedAt), "PPpp") : "N/A"}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
