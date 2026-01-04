import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaGithub, FaLinkedin, FaPlus, FaRocket, FaFilePdf } from "react-icons/fa";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Header from "../components/Header";

const CredexAnalyze = () => {
  const [projects, setProjects] = useState([{ name: "", repo: "", live: "" }]);
  const [otherPlatforms, setOtherPlatforms] = useState([{ platform: "", username: "", link: "" }]);
  const [form, setForm] = useState({
    fullName: "",
    experience: "",
    github: { username: "", link: "" },
    linkedin: { username: "", link: "" },
    resume: null,
  });
  const [score, setScore] = useState(null);
  const [showCertificate, setShowCertificate] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handlePlatformChange = (platform, field, value) => {
    setForm({ ...form, [platform]: { ...form[platform], [field]: value } });
  };
  const handleResumeUpload = (e) => setForm({ ...form, resume: e.target.files[0] });
  const handleProjectChange = (i, field, value) => {
    const updated = [...projects];
    updated[i][field] = value;
    setProjects(updated);
  };
  const addProject = () => setProjects([...projects, { name: "", repo: "", live: "" }]);
  const handleOtherPlatformChange = (i, field, value) => {
    const updated = [...otherPlatforms];
    updated[i][field] = value;
    setOtherPlatforms(updated);
  };
  const addOtherPlatform = () => setOtherPlatforms([...otherPlatforms, { platform: "", username: "", link: "" }]);
  const runAnalysis = () => {
    const generatedScore = Math.floor(Math.random() * 41) + 60; // 60-100
    setScore(generatedScore);
    setShowCertificate(true);
  };

  return (
    <div
      className="relative min-h-screen overflow-x-hidden bg-black text-white
      bg-[radial-gradient(circle_at_top,_rgba(20,184,166,0.15),_transparent_80%)]
      before:absolute px-6 py-12
      before:bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)]
      before:bg-[size:40px_40px] before:opacity-20"
    >
      {/* Header */}
      <Header />

      <div className="pt-24 max-w-6xl mx-auto space-y-12">
        {/* PAGE HEADER */}
        <motion.div initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-black/50 px-4 py-1 font-mono text-sm text-teal-400">
            <span className="h-2 w-2 animate-pulse rounded-full bg-teal-400" />
            ~/credex/analyze
          </div>
          <h1 className="text-4xl font-bold text-[#2AF2D0]">Credex Score Calculator</h1>
          <p className="text-gray-400 mt-3 max-w-xl mx-auto">
            Analyze real developer signals across platforms and projects.
          </p>
        </motion.div>

        {/* CAREER CONTEXT */}
        <Section title="Career Context">
          <Input label="Full Name" name="fullName" value={form.fullName} onChange={handleChange} />
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

        {/* OTHER PLATFORMS */}
        <Section title="Other Platforms">
          {otherPlatforms.map((p, i) => (
            <div key={i} className="border border-[#2AF2D0]/30 rounded-xl p-4 space-y-3">
              <Input
                label="Platform Name"
                value={p.platform}
                onChange={(e) => handleOtherPlatformChange(i, "platform", e.target.value)}
              />
              <Input
                label="Profile Link"
                value={p.link}
                onChange={(e) => handleOtherPlatformChange(i, "link", e.target.value)}
              />
            </div>
          ))}
          <button
            onClick={addOtherPlatform}
            className="flex items-center gap-2 text-[#2AF2D0] text-sm mt-2 hover:underline"
          >
            <FaPlus /> Add Another Platform
          </button>
        </Section>

        {/* PROJECTS */}
        <Section title="Deployed Projects">
          {projects.map((p, i) => (
            <div key={i} className="border border-[#2AF2D0]/30 rounded-xl p-4 space-y-3">
              <Input label="Project Name" value={p.name} onChange={(e) => handleProjectChange(i, "name", e.target.value)} />
              <Input label="GitHub Repository URL" value={p.repo} onChange={(e) => handleProjectChange(i, "repo", e.target.value)} />
              <Input label="Live / Deployed URL" value={p.live} onChange={(e) => handleProjectChange(i, "live", e.target.value)} />
            </div>
          ))}
          <button
            onClick={addProject}
            className="flex items-center gap-2 text-[#2AF2D0] text-sm mt-2 hover:underline"
          >
            <FaPlus /> Add another project
          </button>
        </Section>

        {/* RUN ANALYSIS BUTTON */}
        <div className="text-center mt-12">
          <button
            onClick={runAnalysis}
            className="px-10 py-3 border border-[#2AF2D0] text-[#2AF2D0] rounded-xl
            hover:bg-[#2AF2D0] hover:text-black transition
            shadow-[0_0_25px_rgba(42,242,208,0.5)]"
          >
            <FaRocket className="inline mr-2" /> Run Credex Analysis
          </button>
        </div>

        {/* CERTIFICATE */}
        {showCertificate && <Certificate name={form.fullName} score={score} />}
      </div>
    </div>
  );
};

/* ---------- PLATFORM INPUT ---------- */
const PlatformInput = ({ icon, platform, platformData, handlePlatformChange }) => (
  <div className="space-y-2">
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-full bg-gradient-to-tr from-[#81d0c3] to-[#5bb2ac] 
                  shadow-[0_0_12px_rgba(42,242,208,0.6)] text-black">{icon}</div>
      <span className="text-lg font-bold text-transparent bg-clip-text 
                   bg-gradient-to-r from-[#2AF2D0] to-[#00fff0]">{platform}</span>
    </div>
    <Input
      label={`${platform} Profile Link`}
      value={platformData.link}
      onChange={(e) => handlePlatformChange(platform.toLowerCase(), "link", e.target.value)}
    />
  </div>
);

/* ---------- CERTIFICATE ---------- */
const Certificate = ({ name, score }) => {
  const downloadCertificate = async () => {
    const element = document.getElementById("credex-certificate");
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("landscape", "pt", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("Credex-Certificate.pdf");
  };

  return (
    <div className="mt-12 text-center">
      <div
        id="credex-certificate"
        className="max-w-3xl mx-auto p-12 relative text-center text-white"
        style={{
          backgroundImage: `url(/certificate-template.png)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderRadius: "20px",
        }}
      >
        <h1 className="text-4xl font-bold text-[#2AF2D0] mb-6">Credex Score Certificate</h1>
        <p className="text-xl mb-4">This is to certify that</p>
        <p className="text-2xl font-semibold mb-4">{name || "Anonymous Developer"}</p>
        <p className="text-xl mb-6">has achieved a Credex Score of</p>
        <p className="text-5xl font-bold text-[#2AF2D0]">{score}</p>
      </div>
      <button
        onClick={downloadCertificate}
        className="mt-6 px-8 py-3 border border-[#2AF2D0] text-[#2AF2D0] rounded-xl
        hover:bg-[#2AF2D0] hover:text-black transition shadow-[0_0_25px_rgba(42,242,208,0.5)]"
      >
        Download Certificate
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

const Input = ({ icon, label, ...props }) => (
  <div className="border border-[#2AF2D0]/30 rounded-xl px-4 py-3 flex items-center gap-3">
    {icon && <span className="text-[#2AF2D0]">{icon}</span>}
    <input
      {...props}
      placeholder={label}
      className="bg-transparent outline-none w-full text-sm placeholder-gray-500"
    />
  </div>
);

const Select = ({ label, options, ...props }) => (
  <div className="border border-[#2AF2D0]/30 rounded-xl px-4 py-3">
    <select {...props} className="bg-transparent outline-none w-full text-sm text-gray-300">
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
    <input type="file" accept=".pdf,.doc,.docx" onChange={onUpload} id="resumeUpload" className="hidden" />
    <label
      htmlFor="resumeUpload"
      className="cursor-pointer w-full text-sm text-[#2AF2D0] bg-black/20 backdrop-blur-sm px-3 py-2 rounded-xl flex justify-between items-center hover:bg-[#2AF2D0]/10 transition-colors duration-200"
    >
      {file ? file.name : "Upload Resume"}
      <span className="text-[#2AF2D0]/80 text-xs">Browse</span>
    </label>
  </div>
);

export default CredexAnalyze;
