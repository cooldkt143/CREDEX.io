import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ============================== */
/* 🍕 Pizza Pie Component */
/* ============================== */

const PizzaPieChart = () => {
  const size = 220;
  const radius = size / 2;
  const gapAngle = 4;

  const data = [
    {
      label: "Profile Strength",
      value: 90,
      description: "Measures how complete your profile is.",
      color: "#0f766e",
    },
    {
      label: "Repositories",
      value: 100,
      description: "Represents quality and number of repositories.",
      color: "#164e63",
    },
    {
      label: "Popularity",
      value: 79,
      description: "Shows followers, stars and engagement.",
      color: "#4c1d95",
    },
    {
      label: "Activity & Growth",
      value: 50,
      description: "Tracks contribution consistency.",
      color: "#9d174d",
    },
  ];

  const total = data.reduce((sum, item) => sum + item.value, 0);
  const [active, setActive] = useState(null);

  const polarToCartesian = (cx, cy, r, angle) => {
    const rad = (angle - 90) * (Math.PI / 180);
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad),
    };
  };

  const describeSlice = (startAngle, endAngle) => {
    const start = polarToCartesian(radius, radius, radius, endAngle);
    const end = polarToCartesian(radius, radius, radius, startAngle);
    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

    return `
      M ${radius} ${radius}
      L ${start.x} ${start.y}
      A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}
      Z
    `;
  };

  let currentAngle = 0;

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size}>
        {data.map((slice, index) => {
          const sliceAngle =
            (slice.value / total) * (360 - gapAngle * data.length);

          const startAngle = currentAngle;
          const endAngle = currentAngle + sliceAngle;

          const pathData = describeSlice(startAngle, endAngle);

          const midAngle = startAngle + sliceAngle / 2;
          const labelPos = polarToCartesian(
            radius,
            radius,
            radius * 0.6,
            midAngle
          );

          currentAngle = endAngle + gapAngle;

          return (
            <g
              key={index}
              onMouseEnter={() => setActive(slice)}
              onMouseLeave={() => setActive(null)}
              style={{ cursor: "pointer" }}
            >
              <path
                d={pathData}
                fill={slice.color}
                stroke="#0b0f14"
                strokeWidth="2"
              />

              <text
                x={labelPos.x}
                y={labelPos.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="white"
                fontSize="13"
                fontWeight="bold"
              >
                {slice.value}
              </text>
            </g>
          );
        })}
      </svg>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-3 bg-[#0b0f14] border border-teal-400/30 rounded-md p-3 w-56 text-xs"
          >
            <p className="text-teal-400 font-semibold mb-1">
              {active.label} — {active.value}
            </p>
            <p className="text-gray-300">{active.description}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

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
const API_URL = "http://localhost:8000/idanalyze/analyze";

const IdAnalyze = () => {
  const [platformId, setPlatformId] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("-Select-");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [progress, setProgress] = useState(0);
  const [activeStep, setActiveStep] = useState(0);

  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const isValidPlatform = selectedPlatform !== "-Select-";
  const canAnalyze =
    isValidPlatform && platformId.trim().length > 0 && !isAnalyzing;

  useEffect(() => {
    setPlatformId("");
    setResult(null);
    setError(null);
  }, [selectedPlatform]);

  /* Typing animation */
  useEffect(() => {
    if (!isAnalyzing) return;

    let index = 0;
    const text = ` Analyzing ${platformId} on ${selectedPlatform}...`;
    setTypedText("");

    const interval = setInterval(() => {
      setTypedText((prev) => prev + text[index]);
      index++;
      if (index >= text.length) clearInterval(interval);
    }, 60);

    return () => clearInterval(interval);
  }, [isAnalyzing, platformId, selectedPlatform]);

  /* Progress + steps */
  useEffect(() => {
    if (!isAnalyzing) return;

    setProgress(0);
    setActiveStep(0);

    const progressInterval = setInterval(() => {
      setProgress((p) => (p < 100 ? p + 1 : 100));
    }, ANALYZE_DURATION / 100);

    const stepInterval = setInterval(() => {
      setActiveStep((s) =>
        s < steps.length - 1 ? s + 1 : s
      );
    }, ANALYZE_DURATION / steps.length);

    return () => {
      clearInterval(progressInterval);
      clearInterval(stepInterval);
    };
  }, [isAnalyzing]);

  /* API call */
  const handleAnalyze = async () => {
    if (!canAnalyze) return;

    setIsAnalyzing(true);
    setResult(null);
    setError(null);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform: selectedPlatform,
          profile_id: platformId,
        }),
      });

      if (!response.ok) {
        throw new Error("Analysis failed");
      }

      const data = await response.json();

      setTimeout(() => {
        setIsAnalyzing(false);
        setResult(data);
      }, ANALYZE_DURATION);
    } catch (err) {
      setIsAnalyzing(false);
      setError("Unable to analyze this profile right now. Please Check Your Profile ID Again!!!");
    }
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
                onKeyDown={(e) => {
                  if (e.key === "Enter" && canAnalyze) {
                    handleAnalyze();
                  }
                }}
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

            {/* RESULT */}
  {result && (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="mt-6 border-t border-teal-400/20 pt-4"
  >
    <p className="text-teal-400 mb-4 text-lg">
      Developer Score:{" "}
      <span className="text-white font-bold">{result.score}</span>
    </p>

    {/* Side-by-side layout */}
    <div className="flex flex-col md:flex-row gap-8">

      {/* 🍕 Pizza Chart (Left Side) */}
      <div className="flex-shrink-0">
        <PizzaPieChart />
      </div>

      {/* 📋 Tips (Right Side) */}
      <div className="flex-1">
        <p className="text-gray-400 mb-2">Improvement Tips</p>
        <ul className="list-disc list-inside text-gray-300 space-y-1">
          {result.insights.map((tip, i) => (
            <li key={i}>{tip}</li>
          ))}
        </ul>
      </div>

    </div>
  </motion.div>
)}


            {error && (
              <p className="text-red-400 mt-4">{error}</p>
            )}
          </div>
        </div>
      )}

      {/* ANALYZING OVERLAY */}
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