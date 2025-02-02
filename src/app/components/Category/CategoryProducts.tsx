"use client"
import React, { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useQuery } from "@blitzjs/rpc"
import Link from "next/link"
import getProductsByCategory from "../../admin/products/queries/getProductsByCategory"
import Banner from "../Banner"
import ProductCard from "../home/ProductCard"
import { NoProductsFound } from "../../no-products-found"

// Define types
type SortOption =
  | "default"
  | "featured"
  | "latest"
  | "bestselling"
  | "nameAsc"
  | "nameDesc"
  | "priceLow"
  | "priceHigh"
  | "dateOld"
  | "dateNew"

type Gender = "men" | "women"

interface CategoryProductsProps {
  slug: string
}

const CategoryProducts: React.FC<CategoryProductsProps> = ({ slug }) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  // State management
  const [sortBy, setSortBy] = useState<SortOption>("default")
  const [currentPage, setCurrentPage] = useState(1)

  // Parse URL parameters on mount and when they change
  useEffect(() => {
    const gender = searchParams.get("gender") as Gender | null
    const sort = searchParams.get("sort")
    const page = searchParams.get("page")

    // Update sort state based on URL parameters
    if (gender === "men" || gender === "women") {
      setSortBy(gender)
    } else if (sort === "featured" || sort === "latest") {
      setSortBy(sort === "latest" ? "dateNew" : sort)
    } else if (gender == null && sort == null) {
      setSortBy("default")
    }

    // Update page number from URL
    if (page) {
      const pageNum = parseInt(page, 10)
      if (!isNaN(pageNum) && pageNum > 0) {
        setCurrentPage(pageNum)
      }
    }
  }, [searchParams])

  // Fetch products with query
  const [{ products, pagination }] = useQuery(getProductsByCategory, {
    slug,
    page: currentPage,
    sortBy: sortBy === "default" ? undefined : sortBy,
    gender: sortBy === "men" || sortBy === "women" ? sortBy : undefined,
  })

  // Handle sort change
  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value as SortOption
    setSortBy(value)
    setCurrentPage(1)

    const params = new URLSearchParams(searchParams.toString())

    if (value === "men" || value === "women") {
      params.set("gender", value)
      params.delete("sort")
    } else if (value !== "default") {
      params.set("sort", value)
      params.delete("gender")
    } else {
      params.delete("sort")
      params.delete("gender")
    }

    params.delete("page") // Reset page when sorting changes
    router.push(`?${params.toString()}`, { scroll: false })
  }

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", page.toString())

    window.scrollTo({ top: 0, behavior: "smooth" })
    router.push(`?${params.toString()}`, { scroll: false })
  }

  // Early return for no products
  if (!products || products.length === 0) {
    return <NoProductsFound />
  }

  return (
    <div>
      <Banner name={sortBy === "men" ? "Men" : sortBy === "women" ? "Women" : "Products"} />

      <div className="pb-14">
        <section className="shop-main d-flex justify-center pt-14">
          <div className="shop-list flex-grow-1">
            {/* Breadcrumb and Sorting */}
            <div className="d-flex justify-content-between mb-4">
              <div className="breadcrumb mb-0 d-none d-md-block flex-grow-1">
                <Link href="/" className="menu-link menu-link_us-s text-uppercase fw-medium">
                  Home
                </Link>
                <span className="breadcrumb-separator menu-link fw-medium ps-1 pe-1">/</span>
                <Link
                  href="/products"
                  className="menu-link menu-link_us-s text-uppercase fw-medium"
                >
                  Products
                </Link>
              </div>

              <div className="shop-acs d-flex align-items-center">
                <select
                  className="shop-acs__select form-select w-auto border-0 py-0"
                  value={sortBy}
                  onChange={handleSortChange}
                >
                  <option value="default">Default Sorting</option>
                  <option value="featured">Featured</option>
                  <option value="men">Men</option>
                  <option value="women">Women</option>
                  <option value="latest">Latest</option>
                  <option value="bestselling">Best selling</option>
                  <option value="nameAsc">Alphabetically, A-Z</option>
                  <option value="nameDesc">Alphabetically, Z-A</option>
                  <option value="priceLow">Price, low to high</option>
                  <option value="priceHigh">Price, high to low</option>
                  <option value="dateOld">Date, old to new</option>
                  <option value="dateNew">Date, new to old</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            <div className="products-grid row row-cols-2 row-cols-md-3 gap-y-5">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  name={product.name}
                  price={product.price}
                  salePrice={product.salePrice}
                  images={product.images}
                  color={product.color}
                  slug={product?.slug}
                  reviews={product?.reviews}
                  stock={product?.stock}
                />
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <nav className="shop-pages d-flex justify-content-between mt-14">
                <button
                  className="btn-link d-inline-flex align-items-center"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <span className="fw-medium">PREV</span>
                </button>

                <ul className="pagination mb-0">
                  {Array.from({ length: pagination.totalPages }, (_, i) => (
                    <li key={i} className="page-item">
                      <button
                        className={`btn-link px-1 mx-2 ${
                          currentPage === i + 1 ? "btn-link_active" : ""
                        }`}
                        onClick={() => handlePageChange(i + 1)}
                      >
                        {i + 1}
                      </button>
                    </li>
                  ))}
                </ul>

                <button
                  className="btn-link d-inline-flex align-items-center"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === pagination.totalPages}
                >
                  <span className="fw-medium">NEXT</span>
                </button>
              </nav>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

export default CategoryProducts
