import React from 'react'
import Header from "../components/Header";

const Analyze = () => {
  return (
    <div
      className="relative min-h-screen overflow-x-hidden bg-black text-white
      bg-[radial-gradient(circle_at_center,_rgba(20,184,166,0.15),_transparent_100%)]
      before:absolute before:inset-0
      before:bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)]
      before:bg-[size:40px_40px] before:opacity-20"
    >
      <Header />
      <div className="pt-24 text-center">
        Analyze Page
      </div>
    </div>
  )
}

export default Analyze