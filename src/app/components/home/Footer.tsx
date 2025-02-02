"use client"

import { FacebookIcon, InstagramIcon, TwitterIcon, YoutubeIcon } from "lucide-react"
import Link from "next/link"
import React from "react"
import Logo from "../../assets/logo_white.png"
import Image from "next/image"

import getCategoriesSub from "../../admin/categories/queries/getCategoriesSub"
import { useQuery } from "@blitzjs/rpc"

function Footer() {
  const [{ categories }] = useQuery(getCategoriesSub, {})

  const topCategoriesWithoutChildren =
    categories
      ?.filter(
        (cat) =>
          !cat.parentId &&
          (!cat.children || cat.children.length === 0) &&
          !categories.some((child) => child.parentId === cat.id)
      )
      .slice(0, 5) || []

  return (
    <footer className="footer footer_type_2 dark">
      {/* /.footer-top container */}
      <div className="footer-middle container">
        <div className="row row-cols-lg-5 row-cols-2">
          <div className="footer-column footer-store-info col-12 mb-4 mb-lg-0">
            <div className="logo">
              <Link href="/">
                <Image src={Logo.src} width={100} height={140} />
              </Link>
            </div>
            {/* /.logo */}
            <p className="footer-address">
              1418 River Drive, Suite 35 Cottonhall, CA 9622 United States
            </p>
            <p className="m-0">
              <strong className="fw-medium">devathulvinod@gmail.com</strong>
            </p>
            <ul className="social-links list-unstyled d-flex flex-wrap mb-0 mt-2">
              <li>
                <a href="https://www.facebook.com" className="footer__social-link d-block">
                  <FacebookIcon />
                </a>
              </li>
              <li>
                <a href="https://www.twitter.com" className="footer__social-link d-block">
                  <TwitterIcon />
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com" className="footer__social-link d-block">
                  <InstagramIcon />
                </a>
              </li>
              <li>
                <a href="https://www.youtube.com" className="footer__social-link d-block">
                  <YoutubeIcon />
                </a>
              </li>
            </ul>
          </div>
          {/* /.footer-column */}
          <div className="footer-column footer-menu mb-4 mb-lg-0">
            <h6 className="sub-menu__title text-uppercase">Company</h6>
            <ul className="sub-menu__list list-unstyled">
              <li className="sub-menu__item">
                <Link href="/about" className="menu-link menu-link_us-s">
                  About Us
                </Link>
              </li>

              <li className="sub-menu__item">
                <Link href="/terms-service" className="menu-link menu-link_us-s">
                  Terms of Service
                </Link>
              </li>

              <li className="sub-menu__item">
                <Link href="/privacy-policy" className="menu-link menu-link_us-s">
                  Privacy Policy
                </Link>
              </li>

              <li className="sub-menu__item">
                <Link href="/contact-us" className="menu-link menu-link_us-s">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          {/* /.footer-column */}
          <div className="footer-column footer-menu mb-4 mb-lg-0">
            <h6 className="sub-menu__title text-uppercase">Shop</h6>
            <ul className="sub-menu__list list-unstyled">
              <li className="sub-menu__item">
                <Link href="/products?sort=latest" className="menu-link menu-link_us-s">
                  New Arrivals
                </Link>
              </li>
              <li className="sub-menu__item">
                <Link href="/products?sort=featured" className="menu-link menu-link_us-s">
                  Featured
                </Link>
              </li>
              <li className="sub-menu__item">
                <Link href="/products?gender=men" className="menu-link menu-link_us-s">
                  Men
                </Link>
              </li>
              <li className="sub-menu__item">
                <Link href="/products?gender=women" className="menu-link menu-link_us-s">
                  Women
                </Link>
              </li>
              <li className="sub-menu__item">
                <Link href="/products" className="menu-link menu-link_us-s">
                  Shop All
                </Link>
              </li>
            </ul>
          </div>
          {/* /.footer-column */}
          <div className="footer-column footer-menu mb-4 mb-lg-0">
            <h6 className="sub-menu__title text-uppercase">Categories</h6>
            <ul className="sub-menu__list list-unstyled">
              {topCategoriesWithoutChildren?.map((e, index) => {
                return (
                  <li className="sub-menu__item" key={index + 1}>
                    <Link href={`/categories/${e.slug}`} className="menu-link menu-link_us-s">
                      {e.name}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
          {/* /.footer-column */}
          <div className="footer-column mb-4 mb-lg-0">
            <h6 className="sub-menu__title text-uppercase">Opening Time</h6>
            <ul className="list-unstyled">
              <li>
                <span className="menu-link">Mon - Fri: 8AM - 9PM</span>
              </li>
              <li>
                <span className="menu-link">Sat: 9AM - 8PM</span>
              </li>
              <li>
                <span className="menu-link">Sun: Closed</span>
              </li>
            </ul>
          </div>
          {/* /.footer-column */}
        </div>
        {/* /.row-cols-5 */}
      </div>
      {/* /.footer-middle container */}
      <div className="footer-bottom">
        <div className="container d-md-flex align-items-center justify-center">
          <span className="footer-copyright">©2024 Hanboka</span>
          {/* /.footer-settings */}
        </div>
        {/* /.container d-flex align-items-center */}
      </div>
      {/* /.footer-bottom container */}
    </footer>
  )
}

export default Footer
