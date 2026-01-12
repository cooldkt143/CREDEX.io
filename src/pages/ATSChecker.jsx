import React, { useState, useRef } from "react";
import Header from "../components/Header";
import { UploadCloud, CheckCircle } from "lucide-react";

const ATSChecker = () => {
  const [file, setFile] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [jobType, setJobType] = useState("");
  const [showCustomJD, setShowCustomJD] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);

  const inputRef = useRef(null);

  const handleFile = (selectedFile) => {
    if (!selectedFile) return;
    if (selectedFile.type !== "application/pdf") {
      alert("Please upload a PDF file");
      return;
    }
    setFile(selectedFile);
  };

  const handleFileChange = (e) => {
    handleFile(e.target.files[0]);
    e.target.value = "";
  };

  const analyzeFile = async () => {
    if (!file || (!jobType && !jobDescription)) {
      alert("Please upload resume and select a job preference");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("job_description", showCustomJD ? jobDescription : jobType);

    try {
      setLoading(true);
      const response = await fetch("http://localhost:8000/api/resume/check", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      setAnalysisResult({
        score: data.data.ats_score,
        keywords: data.data.matched_keywords,
        suggestions: data.data.missing_keywords.slice(0, 5),
      });
    } catch (error) {
      alert("Failed to connect to backend");
    } finally {
      setLoading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  return (
    <div
      className="relative min-h-screen flex flex-col justify-between bg-black text-white
      bg-[radial-gradient(circle_at_top,_rgba(20,184,166,0.15),_transparent_80%)]
      before:absolute
      before:bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),
      linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)]
      before:bg-[size:40px_40px] before:opacity-20"
    >
      <Header />

      <div className="max-w-4xl mx-auto px-6 py-20 pt-40 space-y-8 flex-1">
        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-teal-400 font-mono text-3xl">
            ATS Resume Checker
          </h1>
          <p className="text-slate-400 font-mono text-sm">
            Upload your resume and check ATS compatibility using real backend
            analysis.
          </p>
        </div>

        {/* Upload */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border rounded-lg p-6 bg-slate-900/40 flex flex-col
          items-center justify-center gap-4 transition
          ${isDragging
            ? "border-teal-400 bg-slate-900/70"
            : "border-slate-800"
          }`}
        >
          <UploadCloud size={40} className="text-teal-400" />
          <p className="text-slate-300 font-mono text-sm">
            Drag and drop your PDF here or click below
          </p>

          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="hidden"
            id="uploadPdf"
          />

          <label
            htmlFor="uploadPdf"
            className="cursor-pointer px-3 py-1.5 rounded-md
            border border-teal-500/30 bg-teal-500/10
            text-teal-400 font-mono text-xs hover:bg-teal-500/20"
          >
            Choose File
          </label>

          {file && (
            <div className="mt-4 flex items-center gap-3 bg-slate-950
            px-4 py-2 rounded-md border border-slate-800 w-full justify-between">
              <span className="text-slate-200 font-mono text-sm">
                {file.name}
              </span>
              <span className="text-teal-400 font-mono text-sm">
                Uploaded
              </span>
            </div>
          )}
        </div>

        {/* Job Toggle */}
<div className="flex gap-2 bg-slate-800 rounded-md p-1 border border-slate-700">
  {["Predefined Roles", "Custom Job Description"].map((tab) => (
    <button
      key={tab}
      onClick={() => {
        const isCustom = tab === "Custom Job Description";
        setShowCustomJD(isCustom);
        setJobType(isCustom ? "Custom Job Description" : "");
      }}
      className={`flex-1 text-center text-xs font-mono py-2 rounded-md transition
        ${
          (tab === "Custom Job Description" && showCustomJD) ||
          (tab === "Predefined Roles" && !showCustomJD)
            ? "bg-teal-500/20 text-teal-400"
            : "text-slate-400 hover:bg-slate-700"
        }`}
    >
      {tab}
    </button>
  ))}
</div>

{/* Predefined Roles */}
{!showCustomJD && (
  <div className="flex flex-wrap gap-3 mt-3">
    {["Full Stack Developer", "Data Analyst", "Software Developer"].map((job) => (
      <button
        key={job}
        onClick={() => setJobType(job)}
        className={`px-4 py-2 rounded-md text-xs font-mono border transition
          ${
            jobType === job
              ? "border-teal-400 bg-teal-500/20 text-teal-400"
              : "border-slate-700 bg-slate-950 text-slate-400 hover:bg-slate-800"
          }`}
      >
        {job}
      </button>
    ))}
  </div>
)}

{/* Custom Textarea */}
{showCustomJD && (
  <textarea
    rows="6"
    value={jobDescription}
    onChange={(e) => setJobDescription(e.target.value)}
    className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-md p-3 font-mono text-sm focus:outline-none mt-3"
    placeholder="Paste job description here..."
  />
)}


        {/* Analyze */}
        <button
          onClick={analyzeFile}
          disabled={loading}
          className="px-6 py-3 rounded-md border border-teal-500/30
          bg-teal-500/10 text-teal-400 font-mono text-sm
          hover:bg-teal-500/20 disabled:opacity-50"
        >
          {loading ? "Analyzing..." : "Check ATS Score"}
        </button>

        {/* Results */}
        {analysisResult && (
          <div className="border border-slate-800 rounded-lg p-6 bg-slate-900/40 space-y-4">
            <h2 className="text-teal-400 font-mono text-lg flex items-center gap-2">
              <CheckCircle size={16} />
              Analysis Results
            </h2>

            <p className="text-slate-300 font-mono text-sm">
              Your resume scored{" "}
              <span className="text-teal-400 font-bold">
                {analysisResult.score}%
              </span>{" "}
              for ATS compatibility.
            </p>

            <div>
              <p className="text-slate-400 font-mono text-xs mb-1">
                Keywords matched
              </p>
              <div className="flex flex-wrap gap-2">
                {analysisResult.keywords.map((kw, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 text-teal-400 text-xs font-mono
                    rounded-md border border-slate-700 bg-slate-950"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="text-slate-400 font-mono text-xs mb-1">
                Missing Keywords
              </p>
              <ul className="list-disc list-inside text-slate-300 font-mono text-sm space-y-1">
                {analysisResult.suggestions.map((s, idx) => (
                  <li key={idx}>{s}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      <footer className="fixed bottom-0 left-0 right-0 border-t bg-black border-slate-800 p-4 text-center text-slate-500 text-xs font-mono">
        © 2026 ATS Checker • Built with React & FastAPI
      </footer>
    </div>
  );
};

export default ATSChecker;
