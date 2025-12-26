import React from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/home/Header'
import HomeHero from '../components/home/HomeHero'
import Leaderboard from "../components/home/Leaderboard";

const Home = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white
      bg-[radial-gradient(circle_at_top,_rgba(20,184,166,0.15),_transparent_80%)]
      before:absolute before:inset-0
      before:bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)]
      before:bg-[size:40px_40px] before:opacity-20">
      <Header />
      <div className="pt-6 sm:pt-10">
        <HomeHero />
      </div>
      <div className="mb-20 px-4 pt-4 sm:pt-10">
        <Leaderboard />
      </div>

    </div>
  )
}

export default Home