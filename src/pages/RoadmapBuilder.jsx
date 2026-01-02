import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../components/Header";

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
  const [progress, setProgress] = useState(0);
  const [showRoadmap, setShowRoadmap] = useState(false);

  const handleGenerate = () => {
    if (!skills || !target || !time) return;
    setLoading(true);
    setProgress(0);
    setShowRoadmap(false);
  };

  useEffect(() => {
    if (!loading) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setLoading(false);
          setShowRoadmap(true);
          return 100;
        }
        return prev + 10;
      });
    }, 280);

    return () => clearInterval(interval);
  }, [loading]);

  return (
    <div
      className="relative min-h-screen overflow-x-hidden bg-black text-white
      bg-[radial-gradient(circle_at_top,_rgba(20,184,166,0.15),_transparent_80%)]
      before:absolute before:inset-0
      before:bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)]
      before:bg-[size:40px_40px] before:opacity-20"
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
            Personalized Learning Roadmap
          </motion.h1>

          <motion.p variants={item}
            className="max-w-2xl font-mono text-sm text-gray-400 mb-10">
            <span className="text-teal-400">$</span> Structured growth beats random learning.
          </motion.p>

          {/* Input Panel */}
          <motion.div
            variants={item}
            className="rounded-xl border border-teal-400/20 bg-black/40 p-6 font-mono space-y-6"
          >
            <div>
              <label className="block mb-2 text-sm text-gray-300">
                Current Skills
              </label>
              <textarea
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="Enter your skills like :- HTML, CSS, JavaScript, React basics"
                rows={3}
                className="w-full rounded-md border border-teal-400/20 bg-black/60 p-3 text-sm text-gray-200 focus:border-teal-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm text-gray-300">
                Target Role
              </label>
              <input
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                placeholder="Enter your target like :- Full Stack Developer"
                className="w-full rounded-md border border-teal-400/20 bg-black/60 p-3 text-sm text-gray-200 focus:border-teal-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm text-gray-300">
                Time Limit
              </label>
              <input
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="Enter time limit like :- 6 months"
                className="w-full rounded-md border border-teal-400/20 bg-black/60 p-3 text-sm text-gray-200 focus:border-teal-400 focus:outline-none"
              />
            </div>

            <button
              onClick={handleGenerate}
              className="inline-flex items-center gap-2 rounded-md border
              border-teal-400/30 bg-black/60 px-6 py-2
              font-mono text-sm text-teal-400
              hover:border-teal-400 hover:bg-teal-400/10 transition"
            >
              <span>$</span> roadmap.analyze()
            </button>
          </motion.div>

          {/* Progress */}
          <AnimatePresence>
            {loading && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-10 rounded-xl border border-teal-400/20 bg-black/40 p-6 font-mono"
              >
                <p className="text-sm text-gray-300 mb-3">
                  Analyzing skills and target role...
                </p>

                <div className="h-2 w-full rounded bg-black/60 overflow-hidden">
                  <motion.div
                    className="h-full bg-teal-400"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ ease: "easeOut", duration: 0.3 }}
                  />
                </div>

                <p className="mt-3 text-xs text-gray-400">
                  processing modules... {progress}%
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Roadmap Flow */}
          <AnimatePresence>
            {showRoadmap && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-14 font-mono"
              >
                <h2 className="text-xl text-teal-400 mb-8">
                  Generated Roadmap Flow
                </h2>

                <div className="relative border-l border-teal-400/30 pl-8 space-y-10">
                  {[
                    "Strengthen fundamentals and close skill gaps",
                    "Master core technologies for target role",
                    "Build real-world projects with increasing complexity",
                    "Improve problem solving and system thinking",
                    "Finalize interview readiness and Credex score optimization",
                  ].map((step, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.15 }}
                      className="relative"
                    >
                      <span className="absolute -left-[10px] top-1 h-4 w-4 rounded-full bg-teal-400" />
                      <div className="rounded-lg border border-teal-400/20 bg-black/50 p-4 text-sm text-gray-300">
                        <span className="text-teal-400">
                          Phase {index + 1}
                        </span>
                        <p className="mt-1">{step}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.main>
    </div>
  );
};

export default RoadmapBuilder;