import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/images/credex.io_logo.png";

import githubIcon from "../assets/icon/github.png";
import hackerrankIcon from "../assets/icon/hackerrank.png";
import gfgIcon from "../assets/icon/gfg.png";
import unstopIcon from "../assets/icon/unstop.png";
import linkedinIcon from "../assets/icon/linkedin.png";

import { ArrowRight } from "lucide-react";

const platforms = [
  { name: "GitHub", icon: githubIcon },
  { name: "HackerRank", icon: hackerrankIcon },
  { name: "GeeksForGeeks", icon: gfgIcon },
  { name: "Unstop", icon: unstopIcon },
  { name: "LinkedIn", icon: linkedinIcon },
];

/* ---------- Typing Effect ---------- */
const TypingText = ({ text }) => {
  const [displayed, setDisplayed] = React.useState("");

  React.useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i === text.length) clearInterval(interval);
    }, 45);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <p className="mt-4 font-mono text-sm sm:text-base text-gray-400">
      <span className="text-gray-500">//</span> {displayed}
      <span className="animate-pulse text-teal-400">_</span>
    </p>
  );
};

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-black text-white
      bg-[radial-gradient(circle_at_top,_rgba(20,184,166,0.15),_transparent_80%)]
      before:absolute before:inset-0
      before:bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)]
      before:bg-[size:40px_40px] before:opacity-20"
    >
      {/* Scanline pulse */}
      <div
        className="pointer-events-none absolute inset-0
        bg-[linear-gradient(to_bottom,transparent_95%,rgba(20,184,166,0.15)_100%)]
        animate-[scanPulse_4s_ease-in-out_infinite]"
      />

      {/* Content */}
      <div
        className="relative z-10 mx-auto flex max-w-6xl flex-col items-center
        px-6 pt-24 sm:pt-28 md:pt-32 text-center
        animate-[fadeUp_1s_ease-out]"
      >
        {/* Logo */}
        <img
          src={logo}
          alt="Credex Logo"
          className="mb-8 h-28 w-28 sm:h-32 sm:w-32
          animate-[float_6s_ease-in-out_infinite]"
        />

        {/* Title */}
        <h1 className="font-mono text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold tracking-wide text-teal-400">
          CREDEX.IO<span className="ml-1 animate-pulse">_</span>
        </h1>

        {/* Subtitle */}
        <TypingText text="Measure what you can build" />

        {/* Description */}
        <p
          className="mt-8 max-w-3xl text-sm sm:text-base md:text-lg
          leading-relaxed text-gray-400
          animate-[fadeUp_1.2s_ease-out]"
        >
          Skills are often claimed, but rarely proven.{" "}
          <span className="font-semibold text-teal-300">CREDEX</span> measures what
          you can actually build by analyzing real work across platforms. It
          converts verified effort into a credibility score, practical insights,
          and a proof-first resume that reflects real ability.
        </p>

        {/* CTA */}
        <button
          onClick={() => navigate("/login")}
          className="mt-10 font-mono inline-flex items-center gap-2
          rounded-md border border-teal-400 bg-black px-6 py-3
          text-teal-300 hover:bg-teal-400/10 hover:text-teal-200
          transition focus:outline-none focus:ring-2 focus:ring-teal-400
          animate-[fadeUp_1.4s_ease-out]"
        >
          $ get-started
          <ArrowRight size={14} />
        </button>

        {/* Platforms */}
        <div className="mt-16 animate-[fadeUp_1.6s_ease-out]">
          <p className="mb-4 font-mono text-xs text-gray-500">
            // Supported integrations
          </p>

          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 opacity-90">
            {platforms.map((platform) => (
              <div
                key={platform.name}
                className="flex items-center gap-2 rounded-md border border-gray-800
                bg-black/40 px-3 py-2 text-gray-300
                hover:border-teal-400 hover:text-teal-400 transition"
                title={platform.name}
              >
                <img
                  src={platform.icon}
                  alt={platform.name}
                  className="h-8 w-8 object-contain"
                />
                <span className="hidden sm:inline text-sm font-mono">
                  {platform.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Animations */}
      <style>
        {`
          @keyframes fadeUp {
            from {
              opacity: 0;
              transform: translateY(16px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes scanPulse {
            0%, 100% {
              opacity: 0.15;
            }
            50% {
              opacity: 0.3;
            }
          }

          @keyframes float {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-12px);
            }
          }
        `}
      </style>
    </div>
  );
};

export default LandingPage;