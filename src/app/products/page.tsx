import React from "react"
import MainLayout from "../Layout/MainLayout"
import { Metadata } from "next"
import Banner from "../components/Banner"
import ProductAll from "../components/ProductDetails"

export const metadata: Metadata = {
  title: "Products",
  description: "Products page",
}

function page() {
  return (
    <MainLayout>
      <>
        <Banner name="Products" />
        <div className=" mb-20">
          <ProductAll />
        </div>
      </>
    </MainLayout>
  )
}

export default page
