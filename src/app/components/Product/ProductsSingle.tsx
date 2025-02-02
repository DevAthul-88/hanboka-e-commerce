"use client"

import React, { useState } from "react"
import { useQuery } from "@blitzjs/rpc"
import Image from "next/image"
import { Star, Heart, Share2, ShoppingCart, Plus, Minus } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import getProductBySlug from "../../admin/products/queries/getProductBySlug"
import Banner from "../Banner"
import AddToCartButtonTwo from "../AddToCartButtonTwo"
import ProductReviews from "./Reviews"
import ShareButtonModal from "./share-button-modal"

const ProductSingle = ({ slug }: string) => {
  const [selectedSize, setSelectedSize] = useState(null)
  const [selectedColor, setSelectedColor] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)

  const [product] = useQuery(getProductBySlug, { slug })

  if (!product) {
    return (
      <Alert>
        <AlertDescription>Product not found</AlertDescription>
      </Alert>
    )
  }

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      alert("Please select size and color")
      return
    }
    // Add to cart logic here
  }

  const calculateAverageRating = () => {
    if (!product.reviews?.length) return 0
    const sum = product.reviews.reduce((acc, review) => acc + review.rating, 0)
    return (sum / product.reviews.length).toFixed(1)
  }

  return (
    <>
      <Banner name={product?.name} />

      <div className="container mx-auto px-4 py-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-6">
            <Card className="border-0 shadow-none">
              <CardContent className="p-0">
                <div className="relative aspect-square overflow-hidden rounded-lg">
                  <Image
                    src={product.images[selectedImage].url}
                    alt={product.name}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                <div className="grid grid-cols-4 gap-4 mt-6">
                  {product.images.map((image, idx) => (
                    <TooltipProvider key={image.id}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => setSelectedImage(idx)}
                            className={`relative aspect-square overflow-hidden rounded-md transition-all ${
                              selectedImage === idx
                                ? "ring-2 ring-primary ring-offset-2"
                                : "hover:opacity-80"
                            }`}
                          >
                            <Image
                              src={image.url}
                              alt={`${product.name} - View ${idx + 1}`}
                              fill
                              className="object-cover"
                            />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>View {idx + 1}</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Product Details */}
          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="secondary" className="text-xs text-white">
                  {product.category.name}
                </Badge>
                {product.stock >= 1 ? (
                  <Badge variant="success" className="text-xs">
                    In Stock
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="text-xs">
                    Out of Stock
                  </Badge>
                )}
              </div>
              <h1 className="text-4xl font-bold tracking-tight">{product.name}</h1>

              <div className="flex items-center mt-4 space-x-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(calculateAverageRating())
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-200"
                      }`}
                    />
                  ))}
                </div>
                <Separator orientation="vertical" className="h-4" />
                <Sheet>
                  <SheetTrigger className="text-sm text-muted-foreground hover:underline">
                    {product.reviews.length} reviews
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Customer Reviews</SheetTitle>
                    </SheetHeader>
                    {/* Add reviews content here */}
                  </SheetContent>
                </Sheet>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-baseline gap-4">
                <span className="text-3xl font-bold">${product.salePrice || product.price}</span>
                {product.salePrice && (
                  <span className="text-lg text-muted-foreground line-through">
                    ${product.price}
                  </span>
                )}
              </div>
              <Separator />
              <div className="prose prose-sm">
                <p dangerouslySetInnerHTML={{ __html: product.description }}></p>
              </div>
            </div>

            <Tabs defaultValue="options" className="w-full">
              <TabsList>
                <TabsTrigger value="options">Options</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
              </TabsList>

              <TabsContent value="options" className="space-y-6">
                {/* Color Selection */}
                {product.color && (
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Color</label>
                    <div className="flex space-x-3">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => setSelectedColor(product.color)}
                              className={`w-8 h-8 rounded-full transition-all ${
                                selectedColor?.id === product.color.id
                                  ? "ring-2 ring-primary ring-offset-2"
                                  : "hover:scale-110"
                              }`}
                              style={{ backgroundColor: product.color.hexCode }}
                            />
                          </TooltipTrigger>
                          <TooltipContent>{product.color.name}</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                )}

                {/* Size Selection */}
                {product.ProductSize && (
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Size</label>
                    <div className="flex flex-wrap gap-2">
                      {product.ProductSize.map(({ size }) => (
                        <Button
                          key={size.id}
                          variant={selectedSize?.id === size.id ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedSize(size)}
                        >
                          {size.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">Quantity</label>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                      className="w-16 h-9 text-center border rounded-md"
                    />
                    <Button variant="outline" size="icon" onClick={() => setQuantity(quantity + 1)}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4 pt-4">
                  <AddToCartButtonTwo
                    productSlug={product.slug}
                    stock={product.stock}
                    quantity={quantity} // Pass the dynamic quantity here
                    size={selectedSize?.name || "M"}
                  />
                  <ShareButtonModal />
                </div>
              </TabsContent>

              <TabsContent value="details">
                <Card>
                  <CardContent className="space-y-4 p-6">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">SKU</span>
                      <span className="font-medium">{product.sku}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Category</span>
                      <span className="font-medium">{product.category.name}</span>
                    </div>
                    {product.tags && (
                      <>
                        <Separator />
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Tags</span>
                          <div className="flex flex-wrap gap-1 justify-end">
                            {product.tags.split(",").map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag.trim()}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      <ProductReviews productId={product?.id} />
      <div className="mb-5 pb-xl-5"></div>
    </>
  )
}

export default ProductSingle
