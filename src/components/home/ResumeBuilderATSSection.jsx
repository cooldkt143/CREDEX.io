import React from "react";
import { useNavigate } from "react-router-dom";

const ResumeBuilderATSSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative z-10 flex min-h-screen flex-col items-center justify-start px-4 text-center">
      {/* Heading */}
      <h2 className="text-3xl font-bold text-gray-100 sm:text-4xl md:text-5xl">
        Resume built on{" "}
        <span className="text-teal-400 drop-shadow-[0_0_18px_rgba(45,212,191,0.4)]">
          proof
        </span>
        , not claims
      </h2>

      <p className="mt-4 max-w-2xl font-mono text-sm text-gray-400 sm:text-base">
        <span className="text-teal-400">$</span> Generic resumes fail ATS scans and
        hide real skill. Credex builds resumes directly from verified coding
        activity, projects, and platform performance.
      </p>

      {/* Feature cards */}
      <div className="mt-16 grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2">

        {/* Resume Builder */}
        <div className="rounded-xl border border-teal-400/20 bg-black/60 p-6 text-left">
          <h3 className="mb-3 font-mono text-lg text-teal-400">
            resume.build()
          </h3>

          <p className="font-mono text-sm text-gray-400">
            Automatically generates a recruiter-ready resume using your Credex
            score, GitHub projects, problem solving history, and platform
            achievements.
          </p>

          <ul className="mt-4 space-y-2 font-mono text-sm text-gray-400">
            <li>• Proof linked project and skill sections</li>
            <li>• Impact driven bullet points</li>
            <li>• Role specific resume versions</li>
          </ul>

          <button
            onClick={() => navigate("/resume-builder")}
            className="mt-6 inline-flex items-center gap-2 rounded-md border border-teal-400/30 bg-black px-4 py-2 font-mono text-sm text-teal-400 hover:bg-teal-400/10 transition"
          >
            <span>$</span> build_resume()
          </button>
        </div>

        {/* ATS Checker */}
        <div className="rounded-xl border border-teal-400/20 bg-black/60 p-6 text-left">
          <h3 className="mb-3 font-mono text-lg text-teal-400">
            ats.check()
          </h3>

            <p className="font-mono text-sm text-gray-400">
            Analyzes your resume against real ATS systems used by companies.
            Identifies keyword gaps and structural issues.
            Shows exactly where your score drops and what to fix.
            </p>

          <ul className="mt-4 space-y-2 font-mono text-sm text-gray-400">
            <li>• ATS compatibility score</li>
            <li>• Keyword and structure feedback</li>
            <li>• Direct link between Credex score and ATS rank</li>
          </ul>

          <button
            onClick={() => navigate("/ats-checker")}
            className="mt-6 inline-flex items-center gap-2 rounded-md border border-teal-400/30 bg-black px-4 py-2 font-mono text-sm text-teal-400 hover:bg-teal-400/10 transition"
          >
            <span>$</span> analyze_resume()
          </button>
        </div>

      </div>

      {/* Footer note */}
      <p className="mt-16 max-w-xl font-mono text-xs text-gray-500">
        Credex resumes evolve automatically as your skills and score improve.
        No manual edits. No inflated claims.
      </p>

    </section>
  );
};

export default ResumeBuilderATSSection;