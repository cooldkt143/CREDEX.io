import React from "react";
import { useNavigate } from "react-router-dom";

const Roadmap = () => {
  const navigate = useNavigate();

  return (
    <section
      id="roadmap"
      className="relative z-10 flex flex-col items-center justify-center px-4 py-32 text-center"
    >
      {/* Terminal badge */}
      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-black/50 px-4 py-1 font-mono text-sm text-teal-400">
        <span className="h-2 w-2 animate-pulse rounded-full bg-teal-400" />
        ~/credex/roadmap-engine
      </div>

      {/* Heading */}
      <h2 className="text-3xl font-bold text-gray-100 sm:text-4xl md:text-5xl">
        Build with a{" "}
        <span className="text-teal-400 drop-shadow-[0_0_16px_rgba(45,212,191,0.45)]">
          clear roadmap
        </span>
      </h2>

      {/* Subheading */}
      <p className="mt-4 max-w-2xl font-mono text-sm text-gray-400 sm:text-base">
        <span className="text-teal-400">$</span> Random learning wastes time.
        Strong developers follow structured paths backed by real outcomes.
      </p>

      {/* Description box */}
      <div className="mt-8 max-w-3xl rounded-xl border border-teal-400/20 bg-black/40 p-6 text-left font-mono text-sm text-gray-300">
        <p className="mb-3">
          CREDEX Roadmap Planner generates a personalized learning path based on
          your current skill level, target role, and available time.
        </p>
        <p className="mb-3">
          Each milestone is connected to measurable improvement in your Credex
          Score, ensuring every hour you invest moves you closer to industry
          readiness.
        </p>
        <p className="text-gray-400">
          No guesswork. No generic tutorials. Just a focused execution plan.
        </p>
      </div>

      {/* CTA Button */}
      <div className="mt-10">
        <button
          onClick={() => navigate("/roadmap-builder")}
          className="group relative inline-flex items-center gap-2 rounded-md
          border border-teal-400/30 bg-black/60 px-6 py-3
          font-mono text-sm text-teal-400
          hover:bg-teal-400/10 hover:border-teal-400
          transition"
        >
          <span className="text-teal-400">$</span>
          <span className="text-base">
            roadmap.generate()
          </span>
        </button>
      </div>

      {/* Footer hints */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-5 font-mono text-xs text-gray-500">
        <span className="text-teal-400">$</span>
        <span>role_based</span>
        <span>time_bound</span>
        <span>score_linked</span>
        <span>adaptive</span>
      </div>
    </section>
  );
};

export default Roadmap;