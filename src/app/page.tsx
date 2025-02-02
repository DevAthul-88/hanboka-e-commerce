import Link from "next/link"
import { invoke } from "./blitz-server"
import { LogoutButton } from "./(auth)/components/LogoutButton"
import getCurrentUser from "./admin/customers/queries/getCurrentUser"
import { Metadata } from "next"
import MainLayout from "./Layout/MainLayout"
import Image1 from "./assets/Collection_tile__-_women_tile._4_FcuudYC.jpg"
import Image2 from "./assets/Collection_tile_copy_kw0zGN0.jpg"
import Image3 from "./assets/recently_ppOi7wY.jpg"
import Image4 from "./assets/image_banner_bg.jpg"
import Image from "next/image"
import MenFashion from "./components/home/MenFashion"
import WomensFashion from "./components/home/WomenFashion"
import { FastForward, PiggyBank, User, Users } from "lucide-react"

export const metadata: Metadata = {
  title: "Hanboka | Korean Online Fashion Store | Korean Fashion India - Hanboka",
  description: "Home page",
}

export default async function Home() {
  return (
    <MainLayout>
      <div className="relative">
        <div className="grid md:grid-cols-3">
          <div className="relative overflow-hidden group">
            <Link href="/products?gender=women" className="text-center">
              <Image src={Image1} className="group-hover:scale-110 duration-500" alt="" />
              <span className="bg-white dark:bg-slate-900 group-hover:text-gray-500 py-2 px-6 rounded-full shadow dark:shadow-gray-800 absolute bottom-4 mx-4 text-lg font-medium">
                Ladies Wear
              </span>
            </Link>
          </div>
          {/*end content*/}
          <div className="relative overflow-hidden group">
            <Link href="/products?gender=men" className="text-center">
              <Image src={Image2} className="group-hover:scale-110 duration-500" alt="" />
              <span className="bg-white dark:bg-slate-900 group-hover:text-gray-500 py-2 px-6 rounded-full shadow dark:shadow-gray-800 absolute bottom-4 mx-4 text-lg font-medium">
                Mens Wear
              </span>
            </Link>
          </div>
          {/*end content*/}
          <div className="relative overflow-hidden group">
            <Link href="/products?sort=latest" className="text-center">
              <Image src={Image3} className="group-hover:scale-110 duration-500" alt="" />
              <span className="bg-white dark:bg-slate-900 group-hover:text-gray-500 py-2 px-6 rounded-full shadow dark:shadow-gray-800 absolute bottom-4 mx-4 text-lg font-medium">
                Recently Stocked
              </span>
            </Link>
          </div>
          {/*end content*/}
        </div>
        {/*end grid*/}
      </div>

      <div className=" pt-20">
        <MenFashion />
      </div>

      <div className="mt-16">
        <section className="image-banner">
          <div
            className="background-img"
            style={{
              backgroundImage: `url(${Image4.src})`,
              backgroundPosition: "20% center",
            }}
          />
          <div className="image-banner__content container py-3">
            <h2 className="text-white fw-bold">New Season</h2>
            <p className="text-white mb-4">New Collection Release</p>
            <Link
              href="/products"
              className="btn btn-outline-primary border-0 fs-base text-uppercase fw-medium btn-55 d-inline-flex align-items-center"
            >
              <span className="text_dash_half">Shop Now</span>
            </Link>
          </div>
        </section>
      </div>

      <div className=" pt-20">
        <WomensFashion />
      </div>

      <section className="service-promotion horizontal border-top-1 mt-20">
        <div className="container-fluid">
          <div className="mb-3 pb-3 mb-xl-4 pt-1" />
          <div className="row">
            <div className="col-md-4 mb-5 mb-md-0 d-flex align-items-center justify-content-md-center gap-3">
              <div className="service-promotion__icon">
                <div>
                  <FastForward style={{ width: "52px", height: "52px" }} />
                </div>
              </div>
              <div className="service-promotion__content-wrap">
                <h3 className="service-promotion__title h6 text-uppercase mb-1">
                  Fast And Free Delivery
                </h3>
                <p className="service-promotion__content text-secondary mb-0">
                  Free delivery for all orders over $140
                </p>
              </div>
            </div>
            {/* /.col-md-4 text-center*/}
            <div className="col-md-4 mb-5 mb-md-0 d-flex align-items-center justify-content-md-center gap-3">
              <div className="service-promotion__icon">
                <Users style={{ width: "52px", height: "52px" }} />
              </div>
              <div className="service-promotion__content-wrap">
                <h3 className="service-promotion__title h6 text-uppercase mb-1">
                  24/7 Customer Support
                </h3>
                <p className="service-promotion__content text-secondary mb-0">
                  Friendly 24/7 customer support
                </p>
              </div>
            </div>
            {/* /.col-md-4 text-center*/}
            <div className="col-md-4 mb-5 mb-md-0 d-flex align-items-center justify-content-md-center gap-3">
              <div className="service-promotion__icon">
                <PiggyBank style={{ width: "52px", height: "52px" }} />
              </div>
              <div className="service-promotion__content-wrap">
                <h3 className="service-promotion__title h6 text-uppercase mb-1">
                  Money Back Guarantee
                </h3>
                <p className="service-promotion__content text-secondary mb-0">
                  We return money within 30 days
                </p>
              </div>
            </div>
            {/* /.col-md-4 text-center*/}
          </div>
          {/* /.row */}
          <div className="mb-3 pb-3 mb-xl-4 pt-1" />
        </div>
      </section>
    </MainLayout>
  )
}
