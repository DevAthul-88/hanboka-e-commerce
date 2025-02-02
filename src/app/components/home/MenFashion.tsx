"use client"

import React, { useState } from "react"
import ProductCard from "./ProductCard"
import { usePaginatedQuery, useQuery } from "@blitzjs/rpc"
import getMensProduct from "../../admin/products/queries/getMensProduct"
import Link from "next/link"

function MenFashion() {
  const [page, setPage] = useState(0)
  const pageSize = 4

  const [{ products, hasMore }] = useQuery(getMensProduct, {
    orderBy: { id: "asc" },
    skip: pageSize * page,
    take: pageSize,
  })

  return (
    <div>
      <section className="products-grid container">
        <h2 className="section-title text-uppercase mb-1 mb-md-3 pb-xl-2 mb-xl-4">
          Men <strong>Fashion</strong>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
          {products.map((product, index) => (
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
          {/* /.row */}
        </div>
        <div className=" pt-10 text-center">
          <Link
            className="btn-link btn-link_lg default-underline text-uppercase fw-medium"
            href={"/products?gender=men"}
          >
            See All Products
          </Link>
        </div>
      </section>
    </div>
  )
}

export default MenFashion
