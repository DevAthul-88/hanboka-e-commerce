"use client"
import React from "react"

const Loader3D = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white">
      {/* Minimal container */}
      <div className="relative w-48 h-48">
        {/* Rotating circle */}
        <div className="absolute inset-0 animate-[rotate_4s_linear_infinite]">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#f3f4f6" strokeWidth="2" />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#000"
              strokeWidth="2"
              strokeDasharray="30 283"
              className="animate-[dash_2s_ease-in-out_infinite]"
            />
          </svg>
        </div>

        {/* Centered H logo */}
        <div className="absolute inset-0 flex items-center justify-center animate-[float_3s_ease-in-out_infinite]">
          <div className="relative w-16 h-16">
            <div className="absolute left-0 top-0 w-px h-full bg-black" />
            <div className="absolute right-0 top-0 w-px h-full bg-black" />
            <div className="absolute left-0 right-0 top-1/2 h-px bg-black transform -translate-y-1/2" />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes dash {
          0% {
            stroke-dasharray: 30 283;
            stroke-dashoffset: 0;
          }
          50% {
            stroke-dasharray: 120 283;
            stroke-dashoffset: -142;
          }
          100% {
            stroke-dasharray: 30 283;
            stroke-dashoffset: -283;
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-6px);
          }
        }
      `}</style>
    </div>
  )
}

export default Loader3D
