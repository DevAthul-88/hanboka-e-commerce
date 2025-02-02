"use client"

import React, { useEffect, useState } from "react"
import { useQuery } from "@blitzjs/rpc"
import Link from "next/link"
import getCategoriesSub from "../admin/categories/queries/getCategoriesSub"
import getColors from "../admin/colors/queries/getColors"
import getSizes from "../admin/products/queries/getSizes"
import getProductsWithFilter from "../admin/products/queries/getProductsWithFilter"
import ShopFilterSidebar from "./ShopFilterSidebar"
import ProductCard from "./home/ProductCard"
import { useRouter } from "next/navigation"
import { useSearchParams } from "next/navigation"
import { NoProductsFound } from "../no-products-found"

function ProductAll() {
  const router = useRouter()

  const [selectedCategories, setSelectedCategories] = useState<number[]>([])
  const [selectedColors, setSelectedColors] = useState<number[]>([])
  const [selectedSizes, setSelectedSizes] = useState<number[]>([])
  const [sortBy, setSortBy] = useState("default")
  const [currentPage, setCurrentPage] = useState(1)
  const searchParams = useSearchParams()

  useEffect(() => {
    const gender = searchParams.get("gender")
    const sort = searchParams.get("sort")
    if (gender === "men" || gender === "women") {
      setSortBy(gender)
    }
    if (sort === "featured") {
      setSortBy("featured")
    }
    if (sort === "latest") {
      setSortBy("dateNew")
    }
    if (gender == null && sort == null) {
      setSortBy("default")
    }
  }, [searchParams])

  const [{ categories }] = useQuery(getCategoriesSub, {})
  const [{ colors }] = useQuery(getColors, {})
  const [{ products: sizes }] = useQuery(getSizes, {})
  const [{ FilteredProducts, pagination }] = useQuery(getProductsWithFilter, {
    categoryIds: selectedCategories,
    colorIds: selectedColors,
    sizeIds: selectedSizes,
    page: currentPage,
    sortBy,
    gender: sortBy === "men" || sortBy === "women" ? sortBy : undefined,
  })

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value
    setSortBy(value)
    setCurrentPage(1)

    const params = new URLSearchParams(searchParams)
    if (value === "men" || value === "women") {
      params.set("gender", value)
    } else {
      params.delete("gender")
    }

    router.push(`?${params.toString()}`, {
      scroll: false,
    })
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    const params = new URLSearchParams(searchParams)
    params.set("page", page.toString())
    window.scrollTo({ top: 0, behavior: "smooth" })

    router.push(`?${params.toString()}`, {
      scroll: false,
    })
  }

  const handleFilterChange = {
    categories: (ids: number[]) => {
      setSelectedCategories(ids)
      setCurrentPage(1)
      const params = new URLSearchParams(searchParams)
      params.set("categories", ids.join(","))

      router.push(`?${params.toString()}`, {
        scroll: false,
      })
    },
    colors: (ids: number[]) => {
      setSelectedColors(ids)
      setCurrentPage(1)
      const params = new URLSearchParams(searchParams)
      params.set("categories", ids.join(","))

      router.push(`?${params.toString()}`, {
        scroll: false,
      })
    },
    sizes: (ids: number[]) => {
      setSelectedSizes(ids)
      setCurrentPage(1)
      const params = new URLSearchParams(searchParams)
      params.set("categories", ids.join(","))

      router.push(`?${params.toString()}`, {
        scroll: false,
      })
    },
  }

  return (
    <div>
      <section className="shop-main container d-flex pt-14">
        <div className="shop-sidebar side-sticky bg-body" id="shopFilter">
          <ShopFilterSidebar
            categories={categories}
            colors={colors}
            products={sizes}
            selectedCategories={selectedCategories}
            selectedColors={selectedColors}
            selectedSizes={selectedSizes}
            onCategoryChange={handleFilterChange.categories}
            onColorChange={handleFilterChange.colors}
            onSizeChange={handleFilterChange.sizes}
          />
        </div>

        <div className="shop-list flex-grow-1">
          <div className="d-flex justify-content-between mb-4">
            {/* Breadcrumb */}
            <div className="breadcrumb mb-0 d-none d-md-block flex-grow-1">
              <Link href="/" className="menu-link menu-link_us-s text-uppercase fw-medium">
                Home
              </Link>
              <span className="breadcrumb-separator menu-link fw-medium ps-1 pe-1">/</span>
              <Link href="/products" className="menu-link menu-link_us-s text-uppercase fw-medium">
                Products
              </Link>
            </div>

            {/* Sorting */}
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

          {FilteredProducts?.length <= 0 ? (
            <NoProductsFound />
          ) : (
            <>
              <div className="products-grid row row-cols-2 row-cols-md-3 gap-y-5">
                {FilteredProducts.map((product) => (
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
            </>
          )}

          {/* Pagination */}
          <nav className="shop-pages d-flex justify-content-between mt-14">
            <button
              className="btn-link d-inline-flex align-items-center"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <span className="fw-medium">PREV</span>
            </button>

            <ul className="pagination mb-0">
              {Array.from({ length: pagination.pageCount }, (_, i) => (
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
              disabled={currentPage === pagination.pageCount}
            >
              <span className="fw-medium">NEXT</span>
            </button>
          </nav>
        </div>
      </section>
    </div>
  )
}

export default ProductAll
