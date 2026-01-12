import React from "react";
import { motion } from "framer-motion";
import {
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineLocationMarker,
  HiOutlineDocumentAdd,
  HiTrendingUp,
} from "react-icons/hi";
import {
  FaGithub,
  FaLinkedin,
  FaHackerrank,
  FaStar,
  FaTrophy,
  FaLightbulb,
} from "react-icons/fa";
import { SiLeetcode } from "react-icons/si";
import Header from "../components/Header";

/* Animations */
const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

/* Shared Card Style (HOME + PROFILE) */
const card =
  "bg-black/60 border border-teal-400/20 rounded-2xl backdrop-blur-md shadow-[0_0_20px_rgba(20,184,166,0.08)] hover:shadow-[0_0_32px_rgba(20,184,166,0.18)] transition";

/* Data */
const platforms = [
  { icon: <FaGithub />, name: "github", score: 720 },
  { icon: <FaHackerrank />, name: "hackerrank", score: 680 },
  { icon: <SiLeetcode />, name: "leetcode", score: 540 },
  { icon: <FaLinkedin />, name: "linkedin", score: 610 },
];

const skills = [
  "javascript",
  "react",
  "node",
  "html",
  "css",
  "tailwind",
];

const education = [
  {
    degree: "B.Tech Computer Science",
    institution: "XYZ University",
    year: "2022 – 2026",
  },
  {
    degree: "Higher Secondary",
    institution: "ABC School",
    year: "2020 – 2022",
  },
];

const Profile = () => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeUp}
      className="
        relative min-h-screen pt-20 px-5 sm:px-10 space-y-6
        bg-[#05080F] text-slate-200 overflow-hidden
        bg-[radial-gradient(circle_at_top,_rgba(20,184,166,0.14),_transparent_105%)]
        before:absolute before:inset-0
        before:bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)]
        before:bg-[size:36px_36px]
        before:opacity-20
        before:pointer-events-none
      "
    >
      <Header />

      {/* TOP GRID */}
      <motion.div
        variants={stagger}
        className="grid lg:grid-cols-3 gap-5 relative z-10 items-stretch"
      >

        {/* PROFILE CARD */}
        <motion.div
          variants={fadeUp}
          className={`${card} p-6 flex flex-col gap-1 h-full lg:col-span-2`}
        >

          {/* Top user info */}
          <div className="flex gap-4 items-center">
            <div className="w-14 h-14 rounded-full border border-teal-400 text-teal-400 flex items-center justify-center font-mono text-lg shadow-[0_0_12px_rgba(20,184,166,0.6)]">
              S
            </div>

            <div className="flex-1">
              <h2 className="text-lg font-semibold text-white font-mono">
                simran_patra
              </h2>
              <p className="text-sm text-slate-400 font-mono">
                @patra_simran_92
              </p>

              <div className="flex items-center gap-2 mt-2 text-sm text-slate-400 font-mono">
                <HiTrendingUp className="text-teal-400" />
                rank = 15
              </div>

              <div className="flex flex-wrap gap-2 mt-2">
                <Badge icon={<FaStar />} text="github_star" />
                <Badge icon={<FaTrophy />} text="hackerrank_expert" />
              </div>
            </div>

            {/* Complete Profile Section on the right */}
            <div className="flex flex-col items-end">
              <motion.div
                animate={{
                  boxShadow: [
                    "0 0 12px rgba(20,184,166,0.4)",
                    "0 0 26px rgba(20,184,166,0.7)",
                    "0 0 12px rgba(20,184,166,0.4)",
                  ],
                }}
                transition={{ duration: 2.4, repeat: Infinity }}
                className="w-20 h-20 rounded-full border border-teal-400 flex items-center justify-center text-teal-400 font-mono mt-2 text-xl"
              >
                0%
              </motion.div>

              <button className="mt-2 px-3 py-1 rounded-lg bg-teal-400 text-black font-mono hover:bg-teal-300 transition shadow-[0_0_12px_rgba(20,184,166,0.5)]">
                completeProfile()
              </button>

            </div>
          </div>
        </motion.div>

      </motion.div>

      {/* MAIN GRID */}
      <motion.div
        variants={stagger}
        className="grid lg:grid-cols-2 gap-5 relative z-10"
      >
        {/* LEFT */}
        <div className="space-y-5">
          <Card title="profile_details">
            {/* personal_info */}
            <h4 className="font-mono text-teal-400 mt-2">personal_info</h4>
            <InfoRow icon={<HiOutlineMail />} text="email_verified" />
            <InfoRow icon={<HiOutlinePhone />} text="phone = null" />
            <InfoRow icon={<HiOutlineLocationMarker />} text='location = "IN"' />

            {/* resume */}
            <hr className="my-3 border-teal-500/30" />
            <h4 className="font-mono text-teal-400">resume</h4>
            <p className="text-sm text-slate-400 font-mono">resume_not_found</p>
            <button className="mt-2 flex items-center gap-2 text-teal-400 font-mono">
              <HiOutlineDocumentAdd /> upload_resume()
            </button>

            {/* tech_stack */}
            <hr className="my-3 border-teal-500/30" />
            <h4 className="font-mono text-teal-400">tech_stack</h4>
            <div className="flex flex-wrap gap-2">
              {skills.map((s, i) => (
                <span key={i} className="skill-chip">
                  {s}
                </span>
              ))}
            </div>

          </Card>
        </div>


        {/* RIGHT */}
        <div className="space-y-5">
          <Card title="platform_scores">
            <div className="grid grid-cols-2 gap-4">
              {platforms.map((p, i) => (
                <div key={i} className="score-card">
                  <div className="text-2xl text-teal-400 mb-1">{p.icon}</div>
                  <p className="font-mono">{p.name}</p>
                  <p className="text-sm text-slate-400 font-mono">
                    score = {p.score}
                  </p>
                </div>
              ))}
            </div>

            <p className="mt-4 text-sm text-slate-400 font-mono flex items-center gap-2">
              <FaLightbulb className="text-teal-400" />
              hint: solve_more_problems()
            </p>
          </Card>
          <Card title="academic_profile">
            {/* certifications */}
            <h4 className="font-mono text-teal-400">certifications</h4>
            <p className="text-sm text-slate-400 font-mono">
              none_found →{" "}
              <span className="text-teal-400 cursor-pointer">
                start_certification()
              </span>
            </p>

            <hr className="my-4 border-teal-500/30" />

            {/* education */}
            <h4 className="font-mono text-teal-400">education</h4>
            {education.map((e, i) => (
              <div key={i} className="border-l border-teal-400/60 pl-3 mb-4">
                <p className="font-mono text-white">{e.degree}</p>
                <p className="text-sm text-slate-400 font-mono">
                  {e.institution}
                </p>
                <p className="text-xs text-slate-500 font-mono">{e.year}</p>
              </div>
            ))}
          </Card>

        </div>

      </motion.div>

      {/* LOCAL STYLES */}
      <style>{`
        .skill-chip {
          padding: 0.3rem 0.7rem;
          border-radius: 999px;
          background: rgba(20,184,166,0.15);
          color: #5eead4;
          font-size: 0.75rem;
          font-family: monospace;
        }
        .score-card {
          padding: 1rem;
          border-radius: 1rem;
          background: rgba(20,184,166,0.1);
          font-family: monospace;
        }
      `}</style>
    </motion.div>
  );
};

/* Reusable Components */
const Card = ({ title, children }) => (
  <motion.div variants={fadeUp} className={`${card} p-5`}>
    <h3 className="font-mono text-teal-400 mb-3">{title}</h3>
    {children}
  </motion.div>
);

const InfoRow = ({ icon, text }) => (
  <div className="flex items-center gap-3 text-sm text-slate-400 font-mono mt-2">
    <span className="text-teal-400">{icon}</span>
    {text}
    <span className="ml-auto text-teal-400 cursor-pointer">
      update()
    </span>
  </div>
);

const Badge = ({ icon, text }) => (
  <span className="text-xs px-2 py-1 rounded-full bg-teal-400/15 text-teal-400 font-mono flex items-center gap-1">
    {icon} {text}
  </span>
);

export default Profile;