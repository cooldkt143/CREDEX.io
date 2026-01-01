import React from 'react'
import Header from '../components/Header'

const ATSChecker = () => {
  return (
    <div
        className="relative min-h-screen overflow-x-hidden bg-black text-white
      bg-[radial-gradient(circle_at_top,_rgba(20,184,166,0.15),_transparent_80%)]
      before:absolute before:inset-0
      before:bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)]
      before:bg-[size:40px_40px] before:opacity-20"
    >
        <Header />
    </div>
  )
}

export default ATSChecker