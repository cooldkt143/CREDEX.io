import React from "react";
import { useNavigate } from "react-router-dom";

const HomeHero = () => {
  const navigate = useNavigate();
  return (
    <section className="relative z-10 flex flex-col items-center justify-center px-4 pt-40 text-center">

      {/* Terminal badge */}
      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-black/50 px-4 py-1 font-mono text-sm text-teal-400">
        <span className="h-2 w-2 animate-pulse rounded-full bg-teal-400" />
        ~/credex/verify-skills
      </div>

      {/* Brand */}
      <h1 className="text-4xl font-bold text-gray-100 sm:text-5xl md:text-6xl">
        <span className="text-teal-400 drop-shadow-[0_0_18px_rgba(45,212,191,0.5)]">
          CREDEX
        </span>
        <span className="text-gray-400">.io</span>
      </h1>

      <h2 className="mt-3 text-xl font-semibold text-gray-300 sm:text-2xl md:text-3xl">
        Measure what{" "}
        <span className="text-teal-400">you can build</span>
      </h2>

      {/* Description */}
      <p className="mt-6 max-w-xl font-mono text-sm text-gray-400 sm:text-base">
        <span className="text-teal-400">$</span> Skills are easy to claim. Proof is scattered.
        Recruiters struggle to see real ability.
      </p>

      <p className="mt-3 max-w-xl font-mono text-sm text-gray-400 sm:text-base">
        CREDEX analyzes real builds and problem solving to generate a credibility
        score and a clear next step roadmap.
      </p>

      {/* Execute button */}
      <div className="mt-8">
        <button
          className="group relative inline-flex items-center gap-2 rounded-md
          border border-teal-400/30 bg-black/60 px-5 py-2
          font-mono text-sm text-teal-400
          hover:bg-teal-400/10 hover:border-teal-400
          transition"
        >
          <span className="text-teal-400">$</span>
          <span  
            className="text-lg" 
            onClick={() => navigate("/analyze")}
          >your_credex.analyze()</span>
          <span className="absolute -right-2 -top-2 h-2 w-2 rounded-full bg-teal-400 opacity-0 transition" />
        </button>
      </div>

      {/* Tech footer */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-5 font-mono text-xs text-gray-500">
        <span className="text-teal-400">$</span>
        <span>github</span>
        <span>hackerrank</span>
        <span>geeksforgeeks</span>
        <span>unstop</span>
        <span>linkedin</span>
      </div>

    </section>
  );
};

export default HomeHero;