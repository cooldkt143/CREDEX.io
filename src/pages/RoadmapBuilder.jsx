import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../components/Header";
import { API_URL } from "../config";

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 }
  }
};

const item = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { ease: "easeOut", duration: 0.4 } }
};

const RoadmapBuilder = () => {
  const [skills, setSkills] = useState("");
  const [target, setTarget] = useState("");
  const [time, setTime] = useState("");

  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState("Analyzing inputs...");
  const [progress, setProgress] = useState(0);
  const [roadmapData, setRoadmapData] = useState(null);
  const [error, setError] = useState("");
  const [activeMonthTab, setActiveMonthTab] = useState(0);

  const stages = [
    "Parsing current skillset...",
    "Benchmarking against target role...",
    "Identifying technical skill gaps...",
    "Designing monthly learning blocks...",
    "Curating weekly topics and tutorials...",
    "Crafting practical project exercises...",
    "Formatting final roadmap..."
  ];

  const handleGenerate = async () => {
    if (!skills || !target || !time) return;
    setLoading(true);
    setError("");
    setProgress(0);
    setRoadmapData(null);

    // Process skills into list
    const skillsList = skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      // Start progress simulation while waiting for API
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          return prev + 1.5;
        });
      }, 150);

      // Rotate loading stages
      let stageIndex = 0;
      setLoadingStage(stages[0]);
      const stageInterval = setInterval(() => {
        stageIndex = (stageIndex + 1) % stages.length;
        setLoadingStage(stages[stageIndex]);
      }, 2500);

      const response = await fetch(`${API_URL}/api/roadmap/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          current_skills: skillsList,
          target_role: target,
          time_limit: time,
        }),
      });

      clearInterval(progressInterval);
      clearInterval(stageInterval);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to generate roadmap");
      }

      const data = await response.json();
      setProgress(100);
      setTimeout(() => {
        setRoadmapData(data);
        setLoading(false);
        setActiveMonthTab(0); // Select first month
      }, 500);

    } catch (err) {
      console.error(err);
      setError(err.message || "An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen overflow-x-hidden bg-black text-white
      bg-[radial-gradient(circle_at_top,_rgba(20,184,166,0.15),_transparent_80%)]
      before:absolute before:inset-0
      before:bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)]
      before:bg-[size:40px_40px] before:opacity-20 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent"
    >
      <Header />

      <motion.main
        variants={container}
        initial="hidden"
        animate="visible"
        className="relative z-10 pt-28 px-4 pb-20"
      >
        <div className="mx-auto max-w-5xl">

          {/* Terminal Badge */}
          <motion.div variants={item}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-black/50 px-4 py-1 font-mono text-sm text-teal-400">
            <span className="h-2 w-2 animate-pulse rounded-full bg-teal-400" />
            ~/credex/roadmap-builder
          </motion.div>

          <motion.h1 variants={item}
            className="text-3xl sm:text-4xl font-bold mb-3">
            Personalized AI Learning Roadmap
          </motion.h1>

          <motion.p variants={item}
            className="max-w-2xl font-mono text-sm text-gray-400 mb-10">
            <span className="text-teal-400">$</span> Let artificial intelligence design a targeted path to your goal.
          </motion.p>

          {/* Input Panel */}
          <motion.div
            variants={item}
            className="rounded-xl border border-teal-400/20 bg-black/40 p-6 font-mono space-y-6 shadow-2xl backdrop-blur-md"
          >
            <div>
              <label className="block mb-2 text-sm text-teal-400 font-semibold">
                Current Skills
              </label>
              <textarea
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="Enter your skills, separated by commas (e.g. HTML, CSS, JavaScript, Basic Python)"
                rows={3}
                className="w-full rounded-md border border-teal-400/20 bg-black/60 p-3 text-sm text-gray-200 focus:border-teal-400 focus:outline-none transition-all duration-300"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 text-sm text-teal-400 font-semibold">
                  Target Role
                </label>
                <input
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  placeholder="e.g. Generative AI Developer"
                  className="w-full rounded-md border border-teal-400/20 bg-black/60 p-3 text-sm text-gray-200 focus:border-teal-400 focus:outline-none transition-all duration-300"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm text-teal-400 font-semibold">
                  Time Limit
                </label>
                <input
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  placeholder="e.g. 2 months, 6 weeks"
                  className="w-full rounded-md border border-teal-400/20 bg-black/60 p-3 text-sm text-gray-200 focus:border-teal-400 focus:outline-none transition-all duration-300"
                />
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading || !skills || !target || !time}
              className={`inline-flex items-center gap-2 rounded-md border
              px-6 py-2.5 font-mono text-sm transition-all duration-300
              ${loading || !skills || !target || !time
                  ? "border-gray-800 text-gray-600 bg-black/40 cursor-not-allowed"
                  : "border-teal-400/30 bg-black/60 text-teal-400 hover:border-teal-400 hover:bg-teal-400/10 hover:shadow-[0_0_15px_rgba(20,184,166,0.2)]"
                }`}
            >
              <span>$</span> {loading ? "generating..." : "roadmap.analyze()"}
            </button>
          </motion.div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 border border-red-500/30 bg-red-950/20 p-4 rounded-lg text-red-400 font-mono text-sm"
            >
              <p>Error: {error}</p>
            </motion.div>
          )}

          {/* Progress / Loading */}
          <AnimatePresence>
            {loading && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-10 rounded-xl border border-teal-400/20 bg-black/40 p-6 font-mono shadow-xl"
              >
                <div className="flex justify-between items-center mb-3">
                  <p className="text-sm text-teal-400 animate-pulse font-semibold">
                    {loadingStage}
                  </p>
                  <p className="text-xs text-gray-400">
                    {Math.round(progress)}%
                  </p>
                </div>

                <div className="h-2 w-full rounded bg-black/60 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-teal-500 to-emerald-400"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ ease: "easeOut", duration: 0.3 }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Generated Roadmap Data */}
          <AnimatePresence>
            {roadmapData && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mt-14 space-y-10"
              >
                {/* Meta Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="rounded-xl border border-teal-400/10 bg-zinc-950/60 p-5 backdrop-blur-sm">
                    <p className="text-xs text-gray-400 uppercase tracking-widest font-mono">Target Role</p>
                    <h3 className="text-lg font-semibold text-teal-400 mt-1 font-mono">{roadmapData.target_role}</h3>
                  </div>
                  <div className="rounded-xl border border-teal-400/10 bg-zinc-950/60 p-5 backdrop-blur-sm">
                    <p className="text-xs text-gray-400 uppercase tracking-widest font-mono">Duration</p>
                    <h3 className="text-lg font-semibold text-teal-400 mt-1 font-mono">{roadmapData.time_limit}</h3>
                  </div>
                  <div className="rounded-xl border border-teal-400/10 bg-zinc-950/60 p-5 backdrop-blur-sm">
                    <p className="text-xs text-gray-400 uppercase tracking-widest font-mono">Study Intensity</p>
                    <h3 className="text-lg font-semibold text-teal-400 mt-1 font-mono">{roadmapData.weekly_hours_recommended} hrs/week</h3>
                  </div>
                </div>

                {/* Skill mapping lists */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-sm">
                  <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/10 p-5">
                    <h4 className="text-emerald-400 font-bold mb-3 flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-400" />
                      Recognized Current Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {roadmapData.current_skills_recognized.length > 0 ? (
                        roadmapData.current_skills_recognized.map((skill, i) => (
                          <span key={i} className="px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-500 italic">None detected</span>
                      )}
                    </div>
                  </div>

                  <div className="rounded-xl border border-rose-500/20 bg-rose-950/10 p-5">
                    <h4 className="text-rose-400 font-bold mb-3 flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-rose-400" />
                      Identified Skill Gaps
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {roadmapData.skill_gaps.length > 0 ? (
                        roadmapData.skill_gaps.map((gap, i) => (
                          <span key={i} className="px-2 py-1 rounded bg-rose-500/10 border border-rose-500/30 text-rose-300">
                            {gap}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-500 italic">None detected</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Monthly Roadmap tabs */}
                <div className="space-y-6">
                  <div className="flex border-b border-zinc-800 pb-2 overflow-x-auto gap-2">
                    {roadmapData.roadmap_months.map((month, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveMonthTab(idx)}
                        className={`px-5 py-2.5 font-mono text-sm rounded-t-md transition-all whitespace-nowrap
                        ${activeMonthTab === idx
                            ? "border-b-2 border-teal-400 text-teal-400 bg-teal-400/5 font-semibold"
                            : "text-gray-400 hover:text-white"
                          }`}
                      >
                        Month {month.month_number}: {month.month_title}
                      </button>
                    ))}
                  </div>

                  {/* Weeks breakdown for active month */}
                  <div className="space-y-8 mt-6">
                    {roadmapData.roadmap_months[activeMonthTab]?.weeks.map((week, wIdx) => (
                      <motion.div
                        key={week.week_number}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: wIdx * 0.1 }}
                        className="relative pl-6 md:pl-10 border-l-2 border-teal-400/30 group"
                      >
                        {/* Weekly Timeline Node */}
                        <div className="absolute -left-[9px] top-1.5 h-4 w-4 rounded-full bg-black border-2 border-teal-400 transition-all duration-300 group-hover:bg-teal-400 group-hover:scale-110 shadow-[0_0_8px_rgba(20,184,166,0.5)]" />

                        <div className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-6 space-y-6 backdrop-blur-sm transition-all hover:border-teal-400/25">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                            <h3 className="text-lg font-semibold text-teal-400 font-mono">
                              Week {week.week_number}: {week.week_title}
                            </h3>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Topics list */}
                            <div className="space-y-2">
                              <h4 className="text-xs text-gray-400 uppercase tracking-widest font-mono">Topics to Master</h4>
                              <ul className="space-y-1.5 text-sm text-gray-300">
                                {week.topics.map((topic, tIdx) => (
                                  <li key={tIdx} className="flex items-start gap-2">
                                    <span className="text-teal-400 font-mono mt-0.5">•</span>
                                    <span>{topic}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Libraries to Learn */}
                            <div className="space-y-2">
                              <h4 className="text-xs text-gray-400 uppercase tracking-widest font-mono">Tools & Libraries</h4>
                              <div className="flex flex-wrap gap-1.5">
                                {week.learn.map((tool, lIdx) => (
                                  <span key={lIdx} className="px-2.5 py-1 rounded-md text-xs font-mono bg-teal-950/10 border border-teal-400/20 text-teal-300">
                                    {tool}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Practice project */}
                          <div className="rounded-lg border border-teal-500/10 bg-teal-950/5 p-4 space-y-2">
                            <h4 className="text-xs text-teal-400 font-bold uppercase tracking-wider font-mono flex items-center gap-2">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                              </svg>
                              Weekly Hands-On Project
                            </h4>
                            <p className="text-sm text-gray-200 font-mono leading-relaxed pl-6">
                              {week.project}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* General Strategy Tips */}
                {roadmapData.general_tips && roadmapData.general_tips.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="rounded-xl border border-zinc-800 bg-zinc-950/20 p-6 space-y-4"
                  >
                    <h3 className="text-teal-400 font-mono font-semibold text-base flex items-center gap-2">
                      <svg className="w-5 h-5 text-teal-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      Study Tips & Strategy
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-400 font-mono">
                      {roadmapData.general_tips.map((tip, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-teal-400">&gt;</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.main>
    </div>
  );
};

export default RoadmapBuilder;