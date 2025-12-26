import React from "react";
import Header from "../components/Header";
import IdAnalyze from "../components/analyze/IdAnalyze";
import { motion } from "framer-motion";

const Analyze = () => {
  return (
    <div
      className="relative min-h-screen overflow-x-hidden bg-black text-white
      bg-[radial-gradient(circle_at_center,_rgba(20,184,166,0.15),_transparent_100%)]
      before:absolute before:inset-0
      before:pointer-events-none
      before:bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),
                 linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)]
      before:bg-[size:40px_40px] before:opacity-20"
    >
      {/* Header must be above overlay */}
      <div className="relative z-20">
        <Header />
      </div>

      {/* Main content */}
      <div className="relative z-10 pt-24 px-4 sm:px-6 md:px-10">
        {/* Page title */}
        <h1 className="text-center text-3xl sm:text-4xl font-bold text-gray-300 font-mono drop-shadow-[0_0_18px_rgba(45,212,191,0.4)]">
          Platform ID Analyzer
        </h1>

        {/* Coding-style description */}
        <motion.p
          className="mt-4 text-center text-teal-400 font-mono text-sm sm:text-base max-w-2xl mx-auto pl-6 pr-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span className="text-gray-400">$</span> Enter your platform ID from GitHub,
          HackerRank, LinkedIn, or other supported platforms to generate a credibility
          report. CREDEX analyzes your activity, problem-solving skills, and
          contributions to give you a clear skill snapshot.
        </motion.p>

        <IdAnalyze />
      </div>
    </div>
  );
};

export default Analyze;