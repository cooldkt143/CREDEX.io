import React from "react";
import { useNavigate } from "react-router-dom";
import platformCard from "../../assets/images/platform_score_card.png";

const PlatformSection = () => {
  const navigate = useNavigate();
  return (
    <section 
      id="platform-score-card"
      className="relative z-10 flex min-h-screen flex-col items-center 
      justify-center px-4 pt-0 pb-24 md:flex-row md:gap-20 md:pt-0"
    >

      {/* Left content */}
      <div className="max-w-xl text-center md:text-left">

        {/* Heading */}
        <h2 className="text-3xl font-bold text-gray-100 sm:text-4xl md:text-5xl">
          Platform{" "}
          <span className="text-teal-400 drop-shadow-[0_0_18px_rgba(45,212,191,0.5)]">
            Score Card
          </span>
        </h2>

        {/* Description */}
        <p className="mt-6 max-w-lg font-mono text-sm text-gray-400 sm:text-base">
          <span className="text-teal-400">$</span> A single score cannot reflect real skill.
          Credex evaluates your work across multiple coding and professional platforms
          to show how you actually build, solve, and contribute over time.
        </p>

        <p className="mt-3 max-w-lg font-mono text-sm text-gray-400 sm:text-base">
          The Platform Score Card highlights your strengths on GitHub, HackerRank,
          GeeksforGeeks, Unstop, and LinkedIn, while clearly exposing gaps that limit
          growth. This helps developers focus on meaningful improvement and gives
          recruiters a reliable, platform-wise view of real capability.
        </p>

        <div className="mt-8">
          <button
            onClick={() => navigate("/platform-analyze")}
            className="group relative inline-flex items-center gap-2 rounded-md
              border border-teal-400/30 bg-black/60 px-5 py-2
              font-mono text-sm text-teal-400
              hover:bg-teal-400/10 hover:border-teal-400
              transition"
          >
            <span className="text-teal-400">$</span>
            <span className="text-lg">platform_score.analyze()</span>
          </button>
        </div>

        {/* Tech tags */}
        <div className="mt-6 flex flex-wrap items-center gap-4 font-mono text-xs text-gray-500 ">
          <span className="text-teal-400">$</span>
          <span>github</span>
          <span>hackerrank</span>
          <span>geeksforgeeks</span>
          <span>unstop</span>
          <span>linkedin</span>
        </div>
      </div>

      {/* Right image */}
      <div className="mt-12 flex justify-center md:mt-0">
        <img
          src={platformCard}
          alt="Platform Score Card"
          className="max-w-sm rounded-lg pl-5 pr-5 sm:pl-0 sm:pr-0"
        />
      </div>

    </section>
  );
};

export default PlatformSection;
