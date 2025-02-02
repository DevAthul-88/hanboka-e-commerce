"use client"

import React, { useEffect } from "react"
import "../styles/theme.css"
import { Navbar } from "../components/home/Navbar"
import Footer from "../components/home/Footer"
import { ToastContainer } from "react-toastify"
import CartSheet from "../components/CartSheet"
import { CartProvider } from "../components/CartContext"

function MainLayout({ children }: any) {
  useEffect(() => {
    window.history.scrollRestoration = "manual"
  }, [])

  return (
    <div>
      <CartProvider>
        <Navbar />
        <CartSheet />
        {children}
        <ToastContainer />
        <Footer />
      </CartProvider>
    </div>
  )
}

export default MainLayout
