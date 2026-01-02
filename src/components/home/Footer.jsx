import React from "react";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="relative border-t border-teal-400/20 bg-black/80 backdrop-blur">
      {/* Neon glow background */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_bottom,_rgba(20,184,166,0.15),_transparent_100%)]" />

      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-12 md:grid-cols-3">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-semibold tracking-wide text-teal-400 drop-shadow-[0_0_12px_rgba(20,184,166,0.6)]">
              CREDEX.io
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-white/70">
              CREDEX helps developers understand and improve their professional
              impact across platforms like GitHub, HackerRank, LinkedIn, and more
              through transparent analysis and scoring.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="mb-5 text-sm font-semibold uppercase tracking-wider text-teal-300">
              Quick Links
            </h4>
            <ul className="space-y-3 text-sm text-white/70">
              {[
                { label: "Home", id: "home" },
                { label: "Credex Analyze", id: "home" },
                { label: "Platforms Score Card", id: "platform-score-card" },
                { label: "Resume builder and ATS Checker", id: "resume-builder-ats" },
                { label: "Roadmap Builder", id: "roadmap" },
              ].map((item) => (
                <li
                  key={item.id}
                  onClick={() => {
                    const section = document.getElementById(item.id);
                    section?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="cursor-pointer transition-all
                  hover:text-teal-400 hover:translate-x-1
                  hover:drop-shadow-[0_0_8px_rgba(20,184,166,0.6)]"
                >
                  {item.label}
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="mb-5 text-sm font-semibold uppercase tracking-wider text-teal-300">
              Connect
            </h4>
            <div className="flex items-center gap-5 text-xl text-white/70">
              {[FaGithub, FaLinkedin, FaTwitter].map((Icon, i) => (
                <Icon
                  key={i}
                  className="cursor-pointer transition-all hover:text-teal-400 hover:scale-110 hover:drop-shadow-[0_0_10px_rgba(20,184,166,0.8)]"
                />
              ))}
            </div>
            <p className="mt-5 text-sm text-white/60">
              Built for developers who care about measurable growth.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 border-t border-teal-400/20 pt-6 text-center text-sm text-white/50">
          <span className="text-teal-400 drop-shadow-[0_0_8px_rgba(20,184,166,0.6)]">
            © {new Date().getFullYear()} Credex.io
          </span>{" "}
          · All rights reserved
        </div>
      </div>
    </footer>
  );
};

export default Footer;