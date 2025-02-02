import React from "react"
import MainLayout from "../Layout/MainLayout"
import { Metadata } from "next"
import Image1 from "../assets/TS_MODULES_Westchester.jpg"
import Image2 from "../assets/naomi+selects12.jpg"
import Image from "next/image"

export const metadata: Metadata = {
  title: "About",
  description: "About page",
}

function page() {
  return (
    <MainLayout>
      <main style={{ paddingTop: 60 }}>
        <div className="mb-4 pb-4" />
        <section className="about-us container">
          <div className="mw-930">
            <h2 className="page-title">ABOUT HANBOKA</h2>
          </div>
          <div className="about-us__content pb-5 mb-5">
            <p className="mb-5">
              <Image
                loading="lazy"
                className="w-100 h-auto d-block"
                src={Image1.src}
                width={1410}
                height={550}
                alt="About Hanboka"
              />
            </p>
            <div className="mw-930">
              <h3 className="mb-4">OUR STORY</h3>
              <p className="fs-6 fw-medium mb-4">
                Hanboka was born out of a deep appreciation for the elegance and timelessness of
                traditional Korean attire. We aim to blend the heritage of Korea with modern
                aesthetics, offering a curated collection of hanbok-inspired dresses for men and
                women.
              </p>
              <p className="mb-4">
                From traditional designs to contemporary adaptations, Hanboka celebrates the art,
                culture, and craftsmanship of Korean fashion. Every piece in our collection tells a
                story of grace and sophistication, designed to make you feel connected to a rich
                cultural heritage while embracing modern trends.
              </p>
              <div className="row mb-3">
                <div className="col-md-6">
                  <h5 className="mb-3">Our Mission</h5>
                  <p className="mb-3">
                    To bring the beauty of traditional Korean fashion to the world, blending culture
                    and style for everyone to cherish.
                  </p>
                </div>
                <div className="col-md-6">
                  <h5 className="mb-3">Our Vision</h5>
                  <p className="mb-3">
                    To become the global destination for Korean-inspired fashion, fostering a love
                    for Korean culture and style.
                  </p>
                </div>
              </div>
            </div>
            <div className="mw-930 d-lg-flex align-items-lg-center">
              <div className="image-wrapper col-lg-6">
                <Image
                  className="h-auto"
                  loading="lazy"
                  src={Image2.src}
                  width={450}
                  height={500}
                  alt="The Hanboka Company"
                />
              </div>
              <div className="content-wrapper col-lg-6 px-lg-4">
                <h5 className="mb-3">The Company</h5>
                <p>
                  At Hanboka, we strive to redefine traditional Korean clothing for modern
                  lifestyles. Our designs combine comfort, quality, and authenticity, ensuring that
                  every customer experiences the elegance of hanbok in a fresh and contemporary way.
                  Whether you're celebrating a special occasion or looking to add a unique touch to
                  your wardrobe, Hanboka is here to inspire and elevate your style.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </MainLayout>
  )
}

export default page
