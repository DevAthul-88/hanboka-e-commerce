"use client"
import React from "react"
import Image1 from "../assets/shop_banner_character1.png"
import Image from "next/image"

function Banner({ name }: string) {
  return (
    <div>
      <section className="full-width_padding">
        <div className="full-width_border border-2" style={{ borderColor: "#eeeeee" }}>
          <div className="shop-banner position-relative ">
            <div className="background-img" style={{ backgroundColor: "#eeeeee" }}>
              <Image
                loading="lazy"
                src={Image1.src}
                width={1759}
                height={420}
                alt="Pattern"
                className="slideshow-bg__img object-fit-cover"
              />
            </div>
            <div className="shop-banner__content container position-absolute start-50 top-50 translate-middle">
              <h2 className="stroke-text h1 smooth-16 text-uppercase fw-bold mb-3 mb-xl-4 mb-xl-5">
                {name}
              </h2>
            </div>
            {/* /.shop-banner__content */}
          </div>
          {/* /.shop-banner position-relative */}
        </div>
        {/* /.full-width_border */}
      </section>
    </div>
  )
}

export default Banner
