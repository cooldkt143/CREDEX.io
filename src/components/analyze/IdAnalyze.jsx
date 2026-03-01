import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PizzaPieChart = ({ platform, profile }) => {
  const size = 220;
  const radius = size / 2;
  const gapAngle = 4;
  const [active, setActive] = React.useState(null);

  if (!profile) return null;

  const normalizedPlatform = platform?.toLowerCase();

  let profileStrength = 0;
  let repositories = 0;
  let popularity = 0;
  let activity = 0;

  /* ================= GITHUB ================= */
  if (normalizedPlatform === "github") {

    profileStrength =
      Math.min((profile.followers || 0) * 3, 100) +
      Math.min((profile.follower_following_ratio || 0) * 20, 50) +
      Math.min((profile.profile_completeness_score || 0) * 10, 50);

    repositories =
      Math.min((profile.public_repos || 0) * 4, 120) +
      Math.min((profile.account_age_years || 0) * 8, 80);

    popularity =
      Math.min((profile.total_stars || 0) * 1.5, 180) +
      Math.min((profile.avg_stars_per_repo || 0) * 10, 60) +
      Math.min((profile.total_forks || 0) * 2, 60);

    activity =
      Math.min((profile.repos_with_readme || 0) * 8, 100) +
      Math.min((profile.repos_with_license || 0) * 8, 100) +
      Math.min((profile.primary_languages || []).length * 25, 75) +
      Math.min((profile.avg_forks_per_repo || 0) * 10, 25);
  }

  /* ================= HACKERRANK ================= */
  else if (normalizedPlatform === "hackerrank") {

    if (profile.profile_visible) profileStrength += 120;
    if (profile.username) profileStrength += 50;
    if (profile.profile_completed) profileStrength += 30;

    const badges = profile.badge_count_estimated || 0;
    if (badges >= 1) repositories += 80;
    if (badges >= 5) repositories += 100;
    if (badges >= 10) repositories += 120;

    const certs = profile.certification_count || 0;
    popularity += Math.min(certs * 120, 240);
    if (certs > 0 && profile.certifications_verified) popularity += 60;

    if (profile.recent_activity_30_days) activity += 100;
    if (profile.new_badge_recent) activity += 50;
    if (profile.first_certification_recent) activity += 50;
  }

  /* ================= GEEKSFORGEEKS ================= */
  else if (normalizedPlatform === "geeksforgeeks") {

    if (profile.profile_visible) profileStrength += 150;
    if (profile.username) profileStrength += 50;

    const problems = profile.problems_solved || 0;
    repositories += Math.min(problems * 4, 300);
    if (problems >= 100) repositories += 50;
    if (problems >= 300) repositories += 50;

    const articles = profile.articles_contributed || 0;
    popularity += Math.min(articles * 40, 200);

    if (profile.recent_activity_30_days) activity += 200;
  }

  /* ================= UNSTOP ================= */
  else if (normalizedPlatform === "unstop") {

    if (profile.profile_visible) profileStrength += 200;
    if (profile.username) profileStrength += 100;

    if (profile.has_activity) repositories += 150;
    const count = profile.participation_count_estimated || 0;
    repositories += Math.min(count * 80, 250);

    if (profile.resume_visible) popularity += 150;

    const types = profile.participation_types || {};
    if (types.hackathon) activity += 50;
    if (types.hiring_challenge) activity += 50;
  }

  /* ================= LINKEDIN ================= */
  else if (normalizedPlatform === "linkedin") {

    if (profile.profile_visible) profileStrength += 100;
    if (profile.data_quality) profileStrength += 50;
    if (profile.profile_photo_present) profileStrength += 50;
    if (profile.headline_present) profileStrength += 100;
    if (profile.summary_present) profileStrength += 150;

    const exp = profile.experience_count || 0;
    repositories += Math.min(exp * 60, 180);
    if (profile.education_present) repositories += 60;
    if (exp >= 2) repositories += 60;

    if (profile.project_links_present) popularity += 120;
    const skills = profile.skills_count || 0;
    popularity += Math.min(skills * 10, 80);

    if (profile.recent_activity_30_days) activity += 100;
  }

 let data = [];

/* ================= GITHUB ================= */
if (normalizedPlatform === "github") {
  data = [
    {
      label: "Followers & Profile",
      value: profileStrength,
      description:
        "Followers, follower ratio & profile completeness score.",
      color: "#0f766e",
    },
    {
      label: "Repositories & Age",
      value: repositories,
      description:
        "Public repositories count & account age contribution.",
      color: "#164e63",
    },
    {
      label: "Stars & Forks",
      value: popularity,
      description:
        "Total stars, forks & average repo engagement.",
      color: "#4c1d95",
    },
    {
      label: "Readme & Languages",
      value: activity,
      description:
        "Readme presence, license usage & language diversity.",
      color: "#9d174d",
    },
  ];
}

/* ================= HACKERRANK ================= */
else if (normalizedPlatform === "hackerrank") {
  data = [
    {
      label: "Profile Trust",
      value: profileStrength,
      description:
        "Profile visibility, username & completion status.",
      color: "#0f766e",
    },
    {
      label: "Badges",
      value: repositories,
      description:
        "Badge milestones (1+, 5+, 10+) achievements.",
      color: "#9d174d",
    },
    {
      label: "Certifications",
      value: popularity,
      description:
        "Certification count & verification proof.",
      color: "#4c1d95",
    },
    {
      label: "Recent Activity",
      value: activity,
      description:
        "Recent submissions & new achievements.",
      color: "#164e63",
    },
  ];
}

/* ================= GEEKSFORGEEKS ================= */
else if (normalizedPlatform === "geeksforgeeks") {

  let profileRaw = 0;
  if (profile.profile_visible) profileRaw += 150;
  if (profile.username) profileRaw += 50;

  let problemRaw = 0;
  const problems = profile.problems_solved || 0;
  problemRaw += Math.min(problems * 4, 300);
  if (problems >= 100) problemRaw += 50;
  if (problems >= 300) problemRaw += 50;

  let articleRaw = Math.min(
    (profile.articles_contributed || 0) * 40,
    200
  );

  let activityRaw = profile.recent_activity_30_days ? 200 : 0;

  // DO NOT convert to 100%
  // Keep real raw values like backend

  data = [
    {
      label: "Profile Presence",
      value: profileRaw,
      description: "Profile visibility & username authenticity.",
      color: "#0f766e",
    },
    {
      label: "Problems Solved",
      value: problemRaw,
      description: "Total problems solved & milestone bonuses.",
      color: "#164e63",
    },
    {
      label: "Articles",
      value: articleRaw,
      description: "Knowledge sharing through contributions.",
      color: "#4c1d95",
    },
    {
      label: "Consistency",
      value: activityRaw,
      description: "Recent coding activity.",
      color: "#9d174d",
    },
  ];
}
/* ================= UNSTOP ================= */
else if (normalizedPlatform === "unstop") {
  data = [
    {
      label: "Profile Visibility",
      value: profileStrength,
      description:
        "Profile presence & identity verification.",
      color: "#0f766e",
    },
    {
      label: "Participation",
      value: repositories,
      description:
        "Hackathon & challenge participation exposure.",
      color: "#164e63",
    },
    {
      label: "Resume Strength",
      value: popularity,
      description:
        "Resume visibility & career readiness.",
      color: "#4c1d95",
    },
    {
      label: "Event Types",
      value: activity,
      description:
        "Hackathons & hiring challenge involvement.",
      color: "#9d174d",
    },
  ];
}

/* ================= LINKEDIN ================= */
else if (normalizedPlatform === "linkedin") {
  data = [
    {
      label: "Profile Completeness",
      value: profileStrength,
      description:
        "Headline, summary, photo & data quality.",
      color: "#0f766e",
    },
    {
      label: "Experience Depth",
      value: repositories,
      description:
        "Experience count & education presence.",
      color: "#164e63",
    },
    {
      label: "Skills & Projects",
      value: popularity,
      description:
        "Project links & endorsed skills.",
      color: "#4c1d95",
    },
    {
      label: "Activity",
      value: activity,
      description:
        "Recent posting & professional engagement.",
      color: "#9d174d",
    },
  ];
}
  if (!data || data.length === 0) return null;

// 🔹 Minimum visible slice size for zero values
const MIN_VISIBLE = 5;

// Create visual-only values
const visualData = data.map((slice) => ({
  ...slice,
  visualValue: slice.value === 0 ? MIN_VISIBLE : slice.value,
}));

const total =
  visualData.reduce((sum, item) => sum + item.visualValue, 0) || 1;

const polarToCartesian = (cx, cy, r, angle) => {
  const rad = (angle - 90) * (Math.PI / 180);
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
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
      {visualData.map((slice, index) => {
        const sliceAngle =
          (slice.visualValue / total) *
          (360 - gapAngle * visualData.length);

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
            onMouseEnter={() => setActive(data[index])}
            onMouseLeave={() => setActive(null)}
            style={{ cursor: "pointer" }}
          >
            <path
              d={pathData}
              fill={slice.color}
              stroke="#0b0f14"
              strokeWidth="2"
            />

            {/* Show REAL value */}
            <text
              x={labelPos.x}
              y={labelPos.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="white"
              fontSize="12"
              fontWeight="bold"
            >
              {Math.round(data[index].value)}
            </text>
          </g>
        );
      })}
    </svg>

    {active && (
      <div className="mt-3 bg-[#0b0f14] border border-teal-400/30 rounded-md p-3 w-60 text-xs">
        <p className="text-teal-400 font-semibold mb-1">
          {active.label} — {Math.round(active.value)}
        </p>
        <p className="text-gray-300">{active.description}</p>
      </div>
    )}
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

    <div className="flex flex-col md:flex-row gap-8">

      {/* 🍕 Pizza Chart */}
      <div className="flex-shrink-0">
        <PizzaPieChart 
          platform={selectedPlatform}
          profile={result.profile}
        />
      </div>

      {/* 📋 Tips */}
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