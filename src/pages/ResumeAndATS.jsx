import React from "react";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

/* Animation variants */
const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const ResumeAndATS = () => {
  const navigate = useNavigate();

  return (
    <div
      className="relative min-h-screen overflow-x-hidden bg-black text-white
      bg-[radial-gradient(circle_at_top,_rgba(20,184,166,0.15),_transparent_90%)]
      before:absolute before:inset-0
      before:bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)]
      before:bg-[size:40px_40px] before:opacity-20"
    >
      {/* Header */}
      <Header />

      {/* Page container */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-auto flex max-w-6xl flex-col px-6 py-24"
      >
        {/* User summary */}
        <motion.div
          variants={item}
          className="rounded-xl border border-teal-400/20 bg-black/70 p-6 font-mono backdrop-blur"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl font-semibold text-teal-400">
                Deepak Kumar Tripathy
              </h1>
              <p className="text-sm text-gray-400">
                Full Stack Developer
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-left sm:text-right">
                <p className="text-xs uppercase tracking-wider text-gray-500">
                  Credex Score
                </p>
                <p className="text-xs text-teal-400">
                  Leaderboard Verified
                </p>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-teal-400/40 text-lg font-semibold text-teal-400">
                425
              </div>
            </div>
          </div>

          <div className="my-4 h-px w-full bg-gradient-to-r from-transparent via-teal-400/30 to-transparent" />

          <div className="grid grid-cols-2 gap-4 sm:gap-40 text-xs text-gray-400 sm:grid-cols-4 sm:pl-10">
            <span>$ github.synced</span>
            <span>$ problems.solved</span>
            <span>$ project.verified</span>
            <span>$ ats.ready</span>
          </div>
        </motion.div>

        {/* Value proposition */}
        <motion.div
          variants={item}
          className="mt-10 sm:mt-20 text-center"
        >
          <h2 className="text-3xl font-bold text-gray-100 sm:text-4xl md:text-5xl">
            Resume built on{" "}
            <span className="text-teal-400 drop-shadow-[0_0_18px_rgba(45,212,191,0.4)]">
              proof
            </span>
            , not claims
          </h2>

          <p className="mx-auto mt-4 max-w-2xl font-mono text-sm text-gray-400 sm:text-base leading-relaxed">
            <span className="text-teal-400">$</span> Generic resumes fail ATS scans,
            flatten real skill, and rely on vague claims recruiters ignore.
            Credex builds resumes from verified coding activity, real projects,
            problem-solving depth, and measurable platform performance.
          </p>
        </motion.div>

        {/* Features */}
        <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
          <motion.div
            variants={item}
            className="rounded-xl border border-teal-400/20 bg-black/60 p-6 font-mono"
          >
            <h3 className="mb-3 text-lg text-teal-400">
              resume.build()
            </h3>

            <p className="text-sm text-gray-400">
              Generates a recruiter-ready resume using your Credex score,
              GitHub projects, problem solving history, and platform achievements.
            </p>

            <ul className="mt-4 space-y-2 text-sm text-gray-400">
              <li>• Proof linked project and skill sections</li>
              <li>• Impact driven bullet points</li>
              <li>• Role specific resume versions</li>
            </ul>

            <button
              onClick={() => navigate("/resume-builder")}
              className="mt-6 inline-flex items-center gap-2 rounded-md border border-teal-400/30 px-4 py-2 text-sm text-teal-400 hover:bg-teal-400/10 transition"
            >
              <span>$</span> build_resume()
            </button>
          </motion.div>

          <motion.div
            variants={item}
            className="rounded-xl border border-teal-400/20 bg-black/60 p-6 font-mono"
          >
            <h3 className="mb-3 text-lg text-teal-400">
              ats.check()
            </h3>

            <p className="text-sm text-gray-400">
              Analyzes your resume against real ATS systems used by companies. 
              Identifies keyword gaps and structural issues. 
              Shows exactly where your score drops and what to fix.
            </p>

            <ul className="mt-4 space-y-2 text-sm text-gray-400">
              <li>• ATS compatibility score</li>
              <li>• Keyword and structure feedback</li>
              <li>• Credex score to ATS rank mapping</li>
            </ul>

            <button
              onClick={() => navigate("/ats-analyzer")}
              className="mt-6 inline-flex items-center gap-2 rounded-md border border-teal-400/30 px-4 py-2 text-sm text-teal-400 hover:bg-teal-400/10 transition"
            >
              <span>$</span> analyze_resume()
            </button>
          </motion.div>
        </div>

        {/* Footer note */}
        <motion.p
          variants={item}
          className="mx-auto mt-24 max-w-xl text-center font-mono text-xs text-gray-500"
        >
          Credex resumes evolve automatically as your skills and score improve.
          No manual edits. No inflated claims.
        </motion.p>
      </motion.div>
    </div>
  );
};

export default ResumeAndATS;