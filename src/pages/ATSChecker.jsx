import React, { useState, useRef } from "react";
import Header from "../components/Header";
import { UploadCloud, CheckCircle } from "lucide-react";

const ATSChecker = () => {
  const [file, setFile] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [jobType, setJobType] = useState("");
  const [isOther, setIsOther] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [selectedJob, setSelectedJob] = useState("");
  const [mode, setMode] = useState("resume"); // "resume" or "job"

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
    if (!file) {
      alert("Please upload your resume");
      return;
    }
    if (mode === "job" && !jobType && !jobDescription.trim()) {
      alert("Please select a role or add a job description");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("job_role", mode === "job" ? jobType : "");
    formData.append("job_description", mode === "job" ? jobDescription : "");
    formData.append("mode", mode);

    try {
      setLoading(true);
      const response = await fetch(
        "http://localhost:8000/api/ats/check",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Analysis failed");
      }

      setAnalysisResult({
        score: data.data.ats_score,
        keywords: data.data.matched_keywords || [],
        suggestions: data.data.suggestions || [],
        details: data.data.details || null,
        semanticScore: data.data.semantic_score || 0,
        skillScore: data.data.skill_score || 0,
        experienceScore: data.data.experience_score || 0,
        missingKeywords: data.data.missing_keywords || [],
      });
    } catch (error) {
      alert(error.message || "Failed to connect to backend");
    } finally {
      setLoading(false);

      // Only clear selection after submit
      setJobType("");
      setIsOther(false);
      setJobDescription("");
      setSelectedJob("");
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
      bg-[radial-gradient(circle_at_top,_rgba(20,184,166,0.15),_transparent_80%)] before:absolute
      before:bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),
      linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)]
      before:bg-[size:40px_40px] before:opacity-20"
    >
      <Header />

      <div className={`mx-auto px-6 py-20 flex-1 w-full transition-all duration-500 ${
        analysisResult 
          ? "max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-40" 
          : "max-w-4xl flex flex-col justify-center space-y-6 pt-10"
      }`}>
        
        {/* Left Section (Controls) */}
        <div className={analysisResult ? "lg:col-span-5 space-y-4" : "space-y-6"}>
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
            ${isDragging ? "border-teal-400 bg-slate-900/70" : "border-slate-800"}`}
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
              <div
                className="mt-4 flex items-center gap-3 bg-slate-950
                px-4 py-2 rounded-md border border-slate-800
                w-full justify-between"
              >
                <span className="text-slate-200 font-mono text-sm">
                  {file.name}
                </span>
                <span className="text-teal-400 font-mono text-sm">
                  Uploaded
                </span>
              </div>
            )}
          </div>

          {/* Slider Toggle */}
          <div className="flex justify-center my-4">
            <div className="relative p-1 bg-slate-900/80 border border-slate-800 rounded-full flex w-full max-w-sm">
              <div
                className="absolute top-1 bottom-1 rounded-full bg-gradient-to-r from-teal-500/20 to-teal-400/20 border border-teal-500/30 transition-all duration-300 ease-out"
                style={{
                  left: mode === "resume" ? "4px" : "calc(50% + 4px)",
                  width: "calc(50% - 8px)",
                }}
              />
              <button
                type="button"
                onClick={() => setMode("resume")}
                className={`relative z-10 w-1/2 py-2 text-xs font-mono font-medium rounded-full transition-colors duration-300 ${
                  mode === "resume" ? "text-teal-400" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Resume Quality
              </button>
              <button
                type="button"
                onClick={() => setMode("job")}
                className={`relative z-10 w-1/2 py-2 text-xs font-mono font-medium rounded-full transition-colors duration-300 ${
                  mode === "job" ? "text-teal-400" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Job Fit Score
              </button>
            </div>
          </div>

          {/* Job Preference (Collapsible) */}
          <div
            className={`transition-all duration-500 ease-in-out overflow-hidden ${
              mode === "job"
                ? "max-h-[500px] opacity-100 pointer-events-auto mt-4"
                : "max-h-0 opacity-0 pointer-events-none mt-0"
            }`}
          >
            <div className="space-y-6 pt-2 pb-4">
              {/* Role Selection */}
              <div>
                <p className="text-slate-400 font-mono text-xs uppercase tracking-wide mb-2">
                  Select Job Role
                </p>

                <div className="flex flex-wrap gap-3">
                  {[
                    "Full Stack Developer",
                    "Data Analyst",
                    "Software Developer",
                    "Other",
                  ].map((job) => (
                    <button
                      key={job}
                      type="button"
                      onClick={() => {
                        setSelectedJob(job);
                        setIsOther(job === "Other");
                        setJobType(job === "Other" ? "" : job);
                      }}
                      className={`
              px-5 py-2 text-sm font-mono rounded-lg transition-all duration-200 border
              ${selectedJob === job
                          ? "bg-teal-500/10 text-teal-400 border-teal-500 shadow-md"
                          : "bg-transparent text-slate-300 border-teal-500/30 hover:bg-teal-500/10 hover:text-teal-400"
                        }
            `}
                    >
                      {job}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Role Input */}
              {isOther && (
                <div className="space-y-2">
                  <label className="text-slate-400 font-mono text-xs uppercase tracking-wide">
                    Custom Role
                  </label>
                  <input
                    type="text"
                    value={jobType}
                    onChange={(e) => setJobType(e.target.value)}
                    className="w-full bg-slate-900 text-slate-200 border border-slate-700 rounded-md px-4 py-2 text-sm font-mono transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    placeholder="Type job role..."
                  />
                </div>
              )}

              {/* Job Description */}
              <div className="space-y-2">
                <label className="text-slate-400 font-mono text-xs uppercase tracking-wide">
                  Job Description (optional)
                </label>

                <textarea
                  rows={jobDescription ? 4 : 2}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="w-full bg-slate-900 text-slate-200 border border-slate-700 rounded-md px-4 py-2 text-sm font-mono resize-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  placeholder="Paste job description here (optional)..."
                />
              </div>
            </div>
          </div>

          {/* Analyze */}
          <button
            onClick={analyzeFile}
            disabled={loading}
            className="w-full px-6 py-3 rounded-md border border-teal-500/30
            bg-teal-500/10 text-teal-400 font-mono text-sm
            hover:bg-teal-500/20 disabled:opacity-50 transition shadow-lg shadow-teal-500/5"
          >
            {loading ? "Analyzing..." : mode === "resume" ? "Analyze Resume Quality" : "Check Job Fit ATS Score"}
          </button>
        </div>

        {/* Right Section (Results) */}
        {analysisResult && (
          <div className="lg:col-span-7 border border-slate-800 rounded-lg p-6 bg-slate-900/40 space-y-6">
            <h2 className="text-teal-400 font-mono text-lg flex items-center gap-2">
              <CheckCircle size={16} />
              Analysis Results
            </h2>

            <div className="flex items-center gap-6 bg-slate-950/40 p-4 border border-slate-800/60 rounded-lg">
              <div className="text-5xl font-extrabold text-teal-400 drop-shadow-[0_0_15px_rgba(20,184,166,0.4)]">
                {analysisResult.score}
              </div>
              <div>
                <p className="text-slate-200 font-mono text-sm font-semibold">
                  {analysisResult.details ? (mode === "resume" ? "Resume Quality Score" : "Overall ATS Match Score") : "ATS Score"}
                </p>
                <p className="text-slate-400 font-mono text-xs">
                  {mode === "resume"
                    ? "An assessment of structural integrity, impact verbs, metrics, contact info completeness and general formatting."
                    : "A combined measurement of how well your resume matches the target role requirements (scale 0-100)."}
                </p>
              </div>
            </div>

            {/* Score Breakdown (Always show structure breakdowns) */}
            {analysisResult.details && (
              <div className="space-y-4 border-t border-slate-850 pt-4">
                <h3 className="text-slate-300 font-mono text-xs uppercase tracking-wider">
                  Resume Quality Indicators
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Structure */}
                  <div className="space-y-1 bg-slate-950/20 p-3 rounded-lg border border-slate-850">
                    <div className="flex justify-between text-xs font-mono mb-1">
                      <span className="text-slate-400 text-[11px]">Sections Detected</span>
                      <span className="text-teal-400 font-bold">{analysisResult.details.structure_score}/30</span>
                    </div>
                    <div className="w-full bg-slate-950 rounded-full h-1.5 border border-slate-800">
                      <div 
                        className="bg-gradient-to-r from-teal-600 to-teal-400 h-1.5 rounded-full transition-all duration-700" 
                        style={{ width: `${(analysisResult.details.structure_score / 30) * 100}%` }}
                      />
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {["experience", "education", "skills", "projects", "summary"].map((sec) => {
                        const detected = analysisResult.details.details?.sections_found?.includes(sec);
                        return (
                          <span 
                            key={sec} 
                            className={`text-[8px] px-1.5 py-0.5 rounded font-mono border ${
                              detected 
                                ? "bg-teal-500/10 text-teal-400 border-teal-500/20" 
                                : "bg-red-500/5 text-red-400/60 border-red-500/10"
                            }`}
                          >
                            {sec.toUpperCase()}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Impact & Verbs */}
                  <div className="space-y-1 bg-slate-950/20 p-3 rounded-lg border border-slate-850">
                    <div className="flex justify-between text-xs font-mono mb-1">
                      <span className="text-slate-400 text-[11px]">Action Verbs & Impact</span>
                      <span className="text-teal-400 font-bold">{analysisResult.details.impact_score}/25</span>
                    </div>
                    <div className="w-full bg-slate-950 rounded-full h-1.5 border border-slate-800">
                      <div 
                        className="bg-gradient-to-r from-teal-600 to-teal-400 h-1.5 rounded-full transition-all duration-700" 
                        style={{ width: `${(analysisResult.details.impact_score / 25) * 100}%` }}
                      />
                    </div>
                    <p className="text-[9px] text-slate-500 font-mono mt-1 leading-none">
                      Found {analysisResult.details.details?.verb_count || 0} strong action/impact words.
                    </p>
                  </div>

                  {/* Metrics */}
                  <div className="space-y-1 bg-slate-950/20 p-3 rounded-lg border border-slate-850">
                    <div className="flex justify-between text-xs font-mono mb-1">
                      <span className="text-slate-400 text-[11px]">Quantifiable Metrics</span>
                      <span className="text-teal-400 font-bold">{analysisResult.details.metrics_score}/25</span>
                    </div>
                    <div className="w-full bg-slate-950 rounded-full h-1.5 border border-slate-800">
                      <div 
                        className="bg-gradient-to-r from-teal-600 to-teal-400 h-1.5 rounded-full transition-all duration-700" 
                        style={{ width: `${(analysisResult.details.metrics_score / 25) * 100}%` }}
                      />
                    </div>
                    <p className="text-[9px] text-slate-500 font-mono mt-1 leading-none">
                      Detected {analysisResult.details.details?.metric_count || 0} metrics or quantified items.
                    </p>
                  </div>

                  {/* Contact Info & Links */}
                  <div className="space-y-1 bg-slate-950/20 p-3 rounded-lg border border-slate-850">
                    <div className="flex justify-between text-xs font-mono mb-1">
                      <span className="text-slate-400 text-[11px]">Contact & Profiles</span>
                      <span className="text-teal-400 font-bold">{analysisResult.details.contact_score}/10</span>
                    </div>
                    <div className="w-full bg-slate-950 rounded-full h-1.5 border border-slate-800">
                      <div 
                        className="bg-gradient-to-r from-teal-600 to-teal-400 h-1.5 rounded-full transition-all duration-700" 
                        style={{ width: `${(analysisResult.details.contact_score / 10) * 100}%` }}
                      />
                    </div>
                    <div className="flex gap-2 mt-1">
                      <span className={`text-[8px] font-mono ${analysisResult.details.details?.has_email ? "text-teal-400 font-semibold" : "text-slate-600"}`}>✉ EMAIL</span>
                      <span className={`text-[8px] font-mono ${analysisResult.details.details?.has_phone ? "text-teal-400 font-semibold" : "text-slate-600"}`}>📞 PHONE</span>
                      <span className={`text-[8px] font-mono ${analysisResult.details.details?.has_links ? "text-teal-400 font-semibold" : "text-slate-600"}`}>🔗 LINKS</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Job Match Breakdown (Show in job mode) */}
            {analysisResult.details && mode === "job" && (
              <div className="space-y-4 border-t border-slate-850 pt-4">
                <h3 className="text-slate-300 font-mono text-xs uppercase tracking-wider">
                  Job Match Performance
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Semantic Similarity */}
                  <div className="space-y-1 bg-slate-950/40 p-3 rounded-lg border border-slate-850 flex flex-col justify-between">
                    <div>
                      <p className="text-slate-400 font-mono text-[9px] uppercase tracking-wider">Semantic Fit</p>
                      <p className="text-slate-500 font-mono text-[10px] leading-tight">TF-IDF Context Similarity</p>
                    </div>
                    <p className="text-2xl font-bold text-teal-400 mt-2 font-mono">{analysisResult.semanticScore}%</p>
                  </div>

                  {/* Skills Match */}
                  <div className="space-y-1 bg-slate-950/40 p-3 rounded-lg border border-slate-850 flex flex-col justify-between">
                    <div>
                      <p className="text-slate-400 font-mono text-[9px] uppercase tracking-wider">Skills Match</p>
                      <p className="text-slate-500 font-mono text-[10px] leading-tight">Required keyword coverage</p>
                    </div>
                    <p className="text-2xl font-bold text-teal-400 mt-2 font-mono">{analysisResult.skillScore}%</p>
                  </div>

                  {/* Experience Match */}
                  <div className="space-y-1 bg-slate-950/40 p-3 rounded-lg border border-slate-850 flex flex-col justify-between">
                    <div>
                      <p className="text-slate-400 font-mono text-[9px] uppercase tracking-wider">Experience Fit</p>
                      <p className="text-slate-500 font-mono text-[10px] leading-tight">Years of experience match</p>
                    </div>
                    <p className="text-2xl font-bold text-teal-400 mt-2 font-mono">{analysisResult.experienceScore}%</p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <p className="text-slate-400 font-mono text-xs uppercase tracking-wider mb-2">
                  {mode === "job" ? "Keywords Matched" : "Extracted Skills & Keywords"}
                </p>
                <div className="flex flex-wrap gap-2">
                  {analysisResult.keywords?.length ? (
                    analysisResult.keywords.map((kw, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 text-teal-400 text-xs
                        font-mono rounded-md border border-teal-500/20
                        bg-slate-950 shadow-sm"
                      >
                        {kw}
                      </span>
                    ))
                  ) : (
                    <p className="text-slate-500 text-sm font-mono italic">
                      No matched keywords found in this resume.
                    </p>
                  )}
                </div>
              </div>

              {/* Show Missing Keywords only in Job Mode */}
              {mode === "job" && (
                <div>
                  <p className="text-slate-400 font-mono text-xs uppercase tracking-wider mb-2">
                    Missing Keywords
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.missingKeywords?.length ? (
                      analysisResult.missingKeywords.map((kw, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 text-red-400 text-xs
                          font-mono rounded-md border border-red-500/20
                          bg-slate-950 shadow-sm"
                        >
                          {kw}
                        </span>
                      ))
                    ) : (
                      <p className="text-teal-400 text-xs font-mono italic bg-teal-500/5 border border-teal-500/20 rounded-md p-2 w-full">
                        Excellent! Your resume contains all the essential keywords required for this role.
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div>
                <p className="text-slate-400 font-mono text-xs uppercase tracking-wider mb-2">
                  ATS Improvement Recommendations
                </p>
                {analysisResult.suggestions?.length ? (
                  <div className="space-y-3">
                    {analysisResult.suggestions.map((s, idx) => (
                      <div key={idx} className="bg-slate-950/60 border border-slate-800 rounded-lg p-3.5 flex items-start gap-3">
                        <span className="text-teal-400 font-mono text-sm font-bold mt-0.5">
                          💡
                        </span>
                        <p className="text-slate-300 font-mono text-sm leading-relaxed">
                          {s}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-teal-400 text-sm font-mono italic bg-teal-500/5 border border-teal-500/20 rounded-md p-3">
                    Excellent! Your resume follows all structural, layout, and content recommendations.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <footer className="fixed bottom-0 left-0 right-0 border-t
      bg-black border-slate-800 p-4 text-center
      text-slate-500 text-xs font-mono">
        © 2026 ATS Checker • Built with React & FastAPI
      </footer>
    </div>
  );
};

export default ATSChecker;
