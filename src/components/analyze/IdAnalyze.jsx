import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const platforms = [
  "-Select-",
  "GitHub",
  "HackerRank",
  "GeeksForGeeks",
  "Unstop",
  "LinkedIn",
];

const steps = [
  "Fetching User Data",
  "Analyzing your profile",
  "Contribution Analysis",
  "Reading datasets",
  "Calculating Developer Score",
  "Generating Insights",
];

const ANALYZE_DURATION = 2400;

const IdAnalyze = () => {
  const [platformId, setPlatformId] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("-Select-");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [progress, setProgress] = useState(0);
  const [activeStep, setActiveStep] = useState(0);

  const isValidPlatform = selectedPlatform !== "-Select-";
  const canAnalyze =
    isValidPlatform && platformId.trim().length > 0 && !isAnalyzing;

  useEffect(() => {
    setPlatformId("");
    setAnalyzed(false);
  }, [selectedPlatform]);

  useEffect(() => {
    if (!isAnalyzing) return;

    let index = -1;
    const text = `Analyzing ${platformId} on ${selectedPlatform}...`;
    setTypedText("");

    const interval = setInterval(() => {
      setTypedText((prev) => prev + text[index]);
      index++;
      if (index === text.length) clearInterval(interval);
    }, 60);

    return () => clearInterval(interval);
  }, [isAnalyzing, platformId, selectedPlatform]);

  useEffect(() => {
    if (!isAnalyzing) return;

    setProgress(0);
    setActiveStep(0);

    const progressStepTime = ANALYZE_DURATION / 100;
    const stepTime = ANALYZE_DURATION / steps.length;

    const progressInterval = setInterval(() => {
      setProgress((p) => (p < 100 ? p + 1 : 100));
    }, progressStepTime);

    const stepInterval = setInterval(() => {
      setActiveStep((s) =>
        s < steps.length - 1 ? s + 1 : s
      );
    }, stepTime);

    return () => {
      clearInterval(progressInterval);
      clearInterval(stepInterval);
    };
  }, [isAnalyzing]);

  const handleAnalyze = () => {
    if (!canAnalyze) return;

    setIsAnalyzing(true);
    setAnalyzed(false);

    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalyzed(true);
    }, ANALYZE_DURATION);
  };

  return (
    <>
      {/* FORM */}
      {!isAnalyzing && (
        <div className="w-full mt-8 px-4">
          <div className="rounded-lg border border-teal-400/30 bg-black/80 p-6 font-mono text-gray-300">
            <p className="mb-4 text-gray-400">
              <span className="text-teal-400">$</span>{" "}
              {isValidPlatform
                ? `Enter your ${selectedPlatform} ID and analyze`
                : "Select a platform to begin"}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <select
                className="sm:w-44 rounded-md bg-black border border-teal-400/40 px-3 py-2 text-teal-400"
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
              >
                {platforms.map((p, i) => (
                  <option key={i} value={p} className="bg-black">
                    {p}
                  </option>
                ))}
              </select>

              <input
                type="text"
                disabled={!isValidPlatform}
                placeholder={
                  isValidPlatform
                    ? `Enter ${selectedPlatform} ID...`
                    : "Select platform first..."
                }
                className={`flex-1 rounded-md bg-black border px-3 py-2 ${
                  isValidPlatform
                    ? "border-teal-400/40 text-teal-400"
                    : "border-gray-600 text-gray-500"
                }`}
                value={platformId}
                onChange={(e) => setPlatformId(e.target.value)}
              />

              <button
                onClick={handleAnalyze}
                disabled={!canAnalyze}
                className={`px-5 py-2 rounded-md font-semibold transition ${
                  canAnalyze
                    ? "bg-gradient-to-r from-teal-400 to-cyan-400 text-black"
                    : "bg-gray-700 text-gray-400 cursor-not-allowed"
                }`}
              >
                Analyze
              </button>
            </div>

            {analyzed && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 text-teal-400"
              >
                ✅ Analysis complete for {platformId} on {selectedPlatform}
              </motion.p>
            )}
          </div>
        </div>
      )}

      {/* CENTERED ANALYZING OVERLAY */}
      <AnimatePresence>
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          >
            <div className="max-w-3xl w-full px-6 font-mono text-gray-300">
              <p className="text-teal-400 text-center mb-8">
                {typedText}
                <span className="ml-1 animate-pulse">█</span>
              </p>

              <div className="flex flex-col md:flex-row items-center justify-center gap-12">
                {/* Progress */}
                <div className="relative w-40 h-40">
                  <svg className="w-full h-full rotate-[-90deg]">
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="rgba(20,184,166,0.2)"
                      strokeWidth="10"
                      fill="none"
                    />
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="#2dd4bf"
                      strokeWidth="10"
                      fill="none"
                      strokeDasharray={440}
                      strokeDashoffset={440 - (440 * progress) / 100}
                      strokeLinecap="round"
                    />
                  </svg>

                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl text-white">{progress}%</span>
                    <span className="text-sm text-gray-400">Processing</span>
                  </div>
                </div>

                {/* Steps */}
                <div className="space-y-4">
                  {steps.map((step, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span
                        className={`w-3 h-3 rounded-full ${
                          i <= activeStep
                            ? "bg-teal-400"
                            : "bg-teal-400/30"
                        }`}
                      />
                      <span
                        className={
                          i === activeStep
                            ? "text-teal-400"
                            : "text-gray-400"
                        }
                      >
                        {step}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default IdAnalyze;