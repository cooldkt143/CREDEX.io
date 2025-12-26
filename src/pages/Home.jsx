import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Header from "../components/Header";
import HomeHero from "../components/home/HomeHero";
import Leaderboard from "../components/home/Leaderboard";
import TerminalLoader from "../components/home/TerminalLoader";

const Home = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="relative min-h-screen overflow-x-hidden bg-black text-white
      bg-[radial-gradient(circle_at_top,_rgba(20,184,166,0.15),_transparent_80%)]
      before:absolute before:inset-0
      before:bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)]
      before:bg-[size:40px_40px] before:opacity-20"
    >
      {loading && <TerminalLoader />}

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: loading ? 0 : 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Header />

        <div className="pt-6 sm:pt-10">
          <HomeHero />
        </div>

        <div className="mb-20 px-4 pt-4 sm:pt-10">
          <Leaderboard />
        </div>
      </motion.div>
    </div>
  );
};

export default Home;
