"use client"

import React from "react"

const MarqueeScroller = () => {
  const offers = [
    "Free Shipping on Orders Over $50! 🚚",
    "New Summer Collection Available Now! 🌞",
    "Get 20% Off Your First Purchase! 💰",
    "Limited Time Offer - Shop Now! ⏰",
    "Sign Up for Extra 10% Off! ✨",
  ]

  return (
    <div className="relative w-full bg-black text-white overflow-hidden">
      <div className="inline-flex whitespace-nowrap animate-scroll">
        <div className="flex space-x-8 px-4">
          {offers.map((offer, index) => (
            <p key={index} className="text-sm font-medium mb-0">
              {offer}
            </p>
          ))}
        </div>
        <div className="flex space-x-8 px-4">
          {offers.map((offer, index) => (
            <p key={`duplicate-${index}`} className="text-sm font-medium mb-0">
              {offer}
            </p>
          ))}
        </div>
      </div>

      <style jsx>{`
        .animate-scroll {
          animation: scroll 20s linear infinite;
        }

        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  )
}

export default MarqueeScroller
