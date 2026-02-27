import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaGithub,
  FaLinkedin,
  FaPlus,
  FaDownload,
  FaRocket,
  FaFilePdf,
} from "react-icons/fa";
import html2canvas from "html2canvas";
import Header from "../components/Header";

import CredexBg from "../assets/images/credexCard-bg.png"; // background for score card
import CredexLogo from "../assets/images/credex.io_logo.png";  // logo

const API_URL = "http://localhost:8000/credex/analyze";

const CredexAnalyze = () => {
  const [projects, setProjects] = useState([{ name: "", repo: "", live: "" }]);
  const [otherPlatforms, setOtherPlatforms] = useState([
    { platform: "", username: "", link: "" },
  ]);

  const [form, setForm] = useState({
    fullName: "",
    experience: "",
    github: { username: "", link: "" },
    linkedin: { username: "", link: "" },
    resume: null,
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handlePlatformChange = (platform, field, value) => {
    setForm({
      ...form,
      [platform]: { ...form[platform], [field]: value },
    });
  };

  const handleResumeUpload = (e) =>
    setForm({ ...form, resume: e.target.files[0] });

  const handleProjectChange = (i, field, value) => {
    const updated = [...projects];
    updated[i][field] = value;
    setProjects(updated);
  };

  const addProject = () =>
    setProjects([...projects, { name: "", repo: "", live: "" }]);

  const handleOtherPlatformChange = (i, field, value) => {
    const updated = [...otherPlatforms];
    updated[i][field] = value;
    setOtherPlatforms(updated);
  };

  const addOtherPlatform = () =>
    setOtherPlatforms([
      ...otherPlatforms,
      { platform: "", username: "", link: "" },
    ]);

  const runAnalysis = async () => {
    setLoading(true);
    setShowCertificate(false);

    const payload = {
      fullName: form.fullName,
      experience: form.experience,
      github: form.github,
      linkedin: form.linkedin,
      projects,
      otherPlatforms,
      resume_text: form.resume ? form.resume.name : null,
    };

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setResult(data);
      setShowCertificate(true);
    } catch (err) {
      console.error("Credex analyze failed", err);
    } finally {
      setLoading(false);
    }
  };

  // Validation: Check required fields
  const isValid =
    form.fullName.trim() &&
    form.experience &&
    form.github.link.trim() &&
    form.linkedin.link.trim();

  return (
    <div
      className="relative min-h-screen overflow-x-hidden bg-black text-white
      bg-[radial-gradient(circle_at_top,_rgba(20,184,166,0.15),_transparent_80%)]
      before:absolute px-6 py-12
      before:bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)]
      before:bg-[size:40px_40px] before:opacity-20"
    >
      <Header />

      <div className="pt-24 max-w-6xl mx-auto space-y-12">
        {/* PAGE HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-black/50 px-4 py-1 font-mono text-sm text-teal-400">
            <span className="h-2 w-2 animate-pulse rounded-full bg-teal-400" />
            ~/credex/analyze
          </div>
          <h1 className="text-4xl font-bold text-[#2AF2D0]">
            Credex Score Calculator
          </h1>
          <p className="text-gray-400 mt-3 max-w-xl mx-auto">
            Analyze real developer signals across platforms and projects.
          </p>
        </motion.div>

        {/* CAREER CONTEXT */}
        <Section title="Career Context">
          <Input
            label="Full Name"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
          />
          <Select
            label="Experience Level"
            name="experience"
            value={form.experience}
            onChange={handleChange}
            options={["Student", "Fresher", "1–3 Years", "3+ Years"]}
          />
          <ResumeUpload file={form.resume} onUpload={handleResumeUpload} />
        </Section>

        {/* PLATFORM PROFILES */}
        <Section title="Platform Profiles">
          <PlatformInput
            icon={<FaGithub />}
            platform="GitHub"
            platformData={form.github}
            handlePlatformChange={handlePlatformChange}
          />
          <PlatformInput
            icon={<FaLinkedin />}
            platform="LinkedIn"
            platformData={form.linkedin}
            handlePlatformChange={handlePlatformChange}
          />
        </Section>

        {/* PROJECTS */}
        <Section title="Deployed Projects">
          {projects.map((p, i) => (
            <div
              key={i}
              className="border border-[#2AF2D0]/30 rounded-xl p-4 space-y-3"
            >
              <Input
                label="Project Name"
                value={p.name}
                onChange={(e) =>
                  handleProjectChange(i, "name", e.target.value)
                }
              />
              <Input
                label="GitHub Repository URL"
                value={p.repo}
                onChange={(e) =>
                  handleProjectChange(i, "repo", e.target.value)
                }
              />
              <Input
                label="Live / Deployed URL"
                value={p.live}
                onChange={(e) =>
                  handleProjectChange(i, "live", e.target.value)
                }
              />
            </div>
          ))}
          <button
            onClick={addProject}
            className="flex items-center gap-2 text-[#2AF2D0] text-sm mt-2 hover:underline"
          >
            <FaPlus /> Add another project
          </button>
        </Section>

        {/* RUN ANALYSIS */}
        <div className="text-center mt-12">
          <button
            onClick={runAnalysis}
            disabled={!isValid || loading}
            className={`px-10 py-3 border rounded-xl
              transition shadow-[0_0_25px_rgba(42,242,208,0.1)]
              flex items-center justify-center gap-2
              ${isValid
                ? "border-[#2AF2D0] text-[#2AF2D0] hover:bg-[#2AF2D0] hover:text-black"
                : "border-gray-600 text-gray-600 cursor-not-allowed hover:bg-transparent hover:text-gray-600"
              }`}
          >
            <FaRocket className="inline mr-2" />
            {loading ? "Analyzing..." : "Run Credex Analysis"}
          </button>
        </div>

        {/* RESULT INSIGHTS */}
        {result && (
          <div className="border border-[#2AF2D0]/30 rounded-xl p-6 space-y-6">
            <div>
              <h3 className="text-xl text-[#2AF2D0] font-semibold">
                {result.level}
              </h3>
              <p className="text-gray-400 mt-2">{result.description}</p>
            </div>

            {result.strengths?.length > 0 && (
              <div>
                <h4 className="text-lg text-[#2AF2D0] font-medium mb-2">
                  Strengths
                </h4>
                <ul className="list-disc ml-5 text-sm text-gray-300 space-y-1">
                  {result.strengths.map((strength, i) => (
                    <li key={i}>{strength}</li>
                  ))}
                </ul>
              </div>
            )}

            {result.improvement_tips?.length > 0 && (
              <div>
                <h4 className="text-lg text-[#2AF2D0] font-medium mb-2">
                  Areas to Improve
                </h4>
                <ul className="list-disc ml-5 text-sm text-gray-300 space-y-1">
                  {result.improvement_tips.map((tip, i) => (
                    <li key={i}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* CREDEX SCORE CARD */}
        {showCertificate && result && (
          <CredexCard
            name={form.fullName}
            score={result.credex_score}
            level={result.level}
          />
        )}
      </div>
    </div>
  );
};

/* ---------- PLATFORM INPUT ---------- */
const PlatformInput = ({ icon, platform, platformData, handlePlatformChange }) => (
  <div className="space-y-2">
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-full bg-gradient-to-tr from-[#81d0c3] to-[#5bb2ac] shadow-[0_0_12px_rgba(42,242,208,0.6)] text-black">
        {icon}
      </div>
      <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#2AF2D0] to-[#00fff0]">
        {platform}
      </span>
    </div>
    <Input
      label={`${platform} Profile Link`}
      value={platformData.link}
      onChange={(e) =>
        handlePlatformChange(platform.toLowerCase(), "link", e.target.value)
      }
    />
  </div>
);

/* ---------- CREDEX SCORE CARD ---------- */
const CredexCard = ({ name, score }) => {
  const downloadCard = async () => {
    const element = document.getElementById("credex-card-wrapper");
    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: "rgba(0,0,0,0)",
      useCORS: true,
    });

    const safeName = (name || "Anonymous-Developer")
      .trim()
      .replace(/\s+/g, "-");

    const link = document.createElement("a");
    link.download = `${safeName}-Credex-Score-Card.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="mt-12 flex flex-col items-center">

      {/* CARD WRAPPER */}
      <div
        id="credex-card-wrapper"
        className="rounded-[24px] overflow-hidden border border-[#2AF2D0]/40 shadow-[0_0_80px_rgba(42,242,208,0.3)]"
      >

        {/* CARD CONTENT */}
        <div
          id="credex-card"
          className="relative w-[640px] h-[360px] flex flex-col justify-between p-8 bg-black"
          style={{
            backgroundImage: `url(${CredexBg})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
        >

          {/* HEADER SECTION */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <img
                src={CredexLogo}
                className="w-12 h-12 rounded-full border border-[#2AF2D0]/50"
                alt="Credex Logo"
              />
              <span className="font-mono text-sm tracking-widest text-[#2AF2D0]">
                {"<CREDEX.IO/>"}
              </span>
            </div>

            {/* OPTIONAL RIGHT BADGE ICON / BALANCER */}
            <div className="text-[#2AF2D0] text-sm font-mono">
              {/* could add a small subtle icon here */}
            </div>
          </div>

          {/* MAIN INFO – LEFT ALIGNED */}
          <div className="flex flex-col items-start space-y-2">
            <h1 className="text-3xl font-bold text-left text-[#2AF2D0]">
              {name || "Anonymous Developer"}
            </h1>
            <p className="text-2xl font-semibold text-left text-[#2AF2D0]">
              Credex Score: <span className="font-bold">{score || 0}</span>
            </p>
          </div>

          {/* CERTIFIED TAG */}
          <div className="absolute right-8 top-1/3 px-6 py-2 border border-[#2AF2D0] rounded-lg text-sm font-mono text-[#2AF2D0]
            shadow-[0_0_8px_rgba(42,242,208,0.7),0_0_16px_rgba(42,242,208,0.4)]
            backdrop-blur-md bg-black/30">
            <span className="block text-center">&lt;CREDEX CERTIFIED</span>
            <span className="block text-center">DEVELOPER/&gt;</span>
          </div>

          {/* FOOTER */}
          <div className="flex justify-between text-xs text-gray-300">
            <span>Verified by CREDEX.io</span>
            <span>Issued Date: 2024-10-26</span>
          </div>

        </div>
      </div>

      {/* DOWNLOAD BUTTON */}
      <button
        onClick={downloadCard}
        className="mt-8 px-8 py-3 border border-[#2AF2D0] text-[#2AF2D0] rounded-xl 
          hover:bg-[#2AF2D0] hover:text-black transition font-medium"
      >
        Download Score Card
      </button>
    </div>
  );
};

/* ---------- REUSABLE COMPONENTS ---------- */
const Section = ({ title, children }) => (
  <div className="mt-12 space-y-4">
    <h2 className="text-xl text-[#2AF2D0] font-semibold">{title}</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{children}</div>
  </div>
);

const Input = ({ label, ...props }) => (
  <div className="border border-[#2AF2D0]/30 rounded-xl px-4 py-3">
    <input
      {...props}
      placeholder={label}
      className="bg-transparent outline-none w-full text-sm placeholder-gray-500"
    />
  </div>
);

const Select = ({ label, options, ...props }) => (
  <div className="border border-[#2AF2D0]/30 rounded-xl px-4 py-3">
    <select
      {...props}
      className="bg-transparent outline-none w-full text-sm text-gray-300"
    >
      <option value="">{label}</option>
      {options.map((o, i) => (
        <option key={i} value={o} className="bg-[#020d0c]">
          {o}
        </option>
      ))}
    </select>
  </div>
);

const ResumeUpload = ({ file, onUpload }) => (
  <div className="border border-[#2AF2D0]/30 rounded-xl px-4 py-3 flex items-center gap-3">
    <FaFilePdf className="text-[#2AF2D0]" />
    <input
      type="file"
      accept=".pdf,.doc,.docx"
      onChange={onUpload}
      id="resumeUpload"
      className="hidden"
    />
    <label
      htmlFor="resumeUpload"
      className="cursor-pointer w-full text-sm text-[#2AF2D0] bg-black/20 px-3 py-2 rounded-xl flex justify-between items-center"
    >
      {file ? file.name : "Upload Resume"}
      <span className="text-xs">Browse</span>
    </label>
  </div>
);

export default CredexAnalyze;