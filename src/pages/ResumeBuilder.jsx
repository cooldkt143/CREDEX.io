import React, { useState, useEffect } from "react";
import { Download, Cpu, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import Header from "../components/Header";
import Template from "../components/resumeLayout/Template";
import ResumeSource from "../components/resumeLayout/ResumeSource";
import EditDetails from "../components/resumeLayout/EditDetails";
import Preview from "../components/resumeLayout/Preview";
import axios from "axios";
import { API_URL } from "../config";

const steps = [
  { id: 1, title: "Resume_Source", hint: "Create your resume from scratch or upload an existing one to extract details" },
  { id: 2, title: "Edit_Details", hint: "Review and refine personal info, experience, skills, and projects" },
  { id: 3, title: "Template_Selection", hint: "Choose a resume template to define layout and style" },
  { id: 4, title: "Preview_Export", hint: "Preview the final resume and download it in your preferred format" }
];

const containerVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1, duration: 0.6 } }
};

const fadeUpVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const emptyResume = {
  header: { firstName: "", lastName: "", city: "", country: "", pincode: "", role: "" },
  contacts: { email: "", phone: "", links: [] },
  summary: "",
  education: [],
  skills: { skills: [], languages: [] },
  experience: [],
  projects: [],
  achievements: []
};

const ScanningLoader = () => {
  const [logs, setLogs] = useState([]);
  
  useEffect(() => {
    const messages = [
      "Initializing extraction engine...",
      "Uploading PDF binary buffer...",
      "Reading document lines & pages...",
      "Parsing document structure...",
      "Calling OpenRouter AI agent (gpt-4o-mini)...",
      "Analyzing contact info & identity...",
      "Extracting professional summary...",
      "Compiling educational history...",
      "Extracting work experience timelines...",
      "Mapping technical skills & expertise...",
      "Formatting parsed data into JSON schema...",
      "Finalizing extraction pipeline..."
    ];
    
    let currentIdx = 0;
    setLogs(["$ ready --source=file.pdf"]);
    
    const interval = setInterval(() => {
      if (currentIdx < messages.length) {
        setLogs(prev => [...prev, `[info] ${messages[currentIdx]}`]);
        currentIdx++;
      } else {
        clearInterval(interval);
      }
    }, 850);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-6 text-center">
      {/* Laser Scanning Graphic */}
      <div className="relative w-44 h-56 bg-slate-950 border border-teal-500/20 rounded-xl overflow-hidden shadow-[0_0_30px_rgba(20,184,166,0.1)] flex flex-col justify-between p-4">
        {/* Glow laser line */}
        <motion.div
          className="absolute left-0 right-0 h-[2px] bg-teal-400 shadow-[0_0_10px_#2dd4bf,0_0_20px_#2dd4bf]"
          animate={{ top: ["5%", "95%", "5%"] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Document lines */}
        <div className="space-y-2 mt-4">
          <div className="h-3 bg-slate-900 rounded w-1/2" />
          <div className="h-1.5 bg-slate-900 rounded w-5/6" />
          <div className="h-1.5 bg-slate-900 rounded w-full" />
          <div className="h-1.5 bg-slate-900 rounded w-4/5" />
          <div className="h-3 bg-slate-900 rounded w-1/3 mt-4" />
          <div className="h-1.5 bg-slate-900 rounded w-full" />
          <div className="h-1.5 bg-slate-900 rounded w-2/3" />
        </div>

        {/* Processing badge */}
        <div className="flex items-center justify-center gap-1.5 bg-teal-950/40 border border-teal-500/30 py-1.5 px-2.5 rounded-lg text-teal-400 font-mono text-[10px]">
          <Cpu className="animate-spin text-teal-400" size={12} />
          <span className="tracking-wider">EXTRACTING_DATA</span>
        </div>
      </div>

      {/* Text message */}
      <div>
        <h2 className="text-teal-400 font-mono text-sm sm:text-base mb-1 flex items-center justify-center gap-2">
          <Sparkles className="animate-pulse text-teal-300" size={16} />
          extracting_resume_intelligence
        </h2>
        <p className="text-slate-400 font-mono text-[11px]">
          Our AI parser is extracting details and building your editable profile...
        </p>
      </div>

      {/* Terminal log window */}
      <div className="w-full max-w-sm h-28 bg-black border border-slate-900 rounded-lg p-3 text-left overflow-y-auto no-scrollbar font-mono text-[10px] text-teal-300/80 space-y-1 shadow-inner">
        {logs.map((log, index) => (
          <div key={index} className={log.startsWith("$") ? "text-teal-400" : ""}>
            {log}
          </div>
        ))}
      </div>
    </div>
  );
};

const ResumeBuilder = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [resumeData, setResumeData] = useState(null);
  const [resumeId, setResumeId] = useState(null);
  const [templateId, setTemplateId] = useState("modern");
  const [isExporting, setIsExporting] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);

  const nextStep = () => currentStep < steps.length && setCurrentStep(p => p + 1);
  const prevStep = () => currentStep > 1 && setCurrentStep(p => p - 1);

  // Handle create from scratch
  const handleCreate = () => {
    setResumeData(emptyResume);
    setResumeId(null);
    setCurrentStep(2); // move to EditDetails
  };

  const handleUploadStart = () => {
    setIsExtracting(true);
  };

  const handleUploadComplete = (parsedJson, id) => {
    setResumeData(parsedJson);
    setResumeId(id);
    // Slight delay to keep the premium extraction loader visible briefly
    setTimeout(() => {
      setIsExtracting(false);
      setCurrentStep(2);
    }, 1500);
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const res = await axios.post(`${API_URL}/resume-builder/generate-pdf`, {
        template_id: templateId,
        resume_data: resumeData
      }, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'resume.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Export failed:", err);
      alert("Failed to export resume. Ensure your backend is running and the template exists.");
    } finally {
      setIsExporting(false);
    }
  };


  const renderStep = () => {
    if (isExtracting) {
      return <ScanningLoader />;
    }
    switch (currentStep) {
      case 1:
        return (
          <ResumeSource
            onCreate={handleCreate}
            onUploadStart={handleUploadStart}
            onUploadComplete={handleUploadComplete}
            onUploadError={() => setIsExtracting(false)}
          />
        );
      case 2:
        return <EditDetails resumeData={resumeData} setResumeData={setResumeData} />;
      case 3:
        return <Template resumeData={resumeData} onChooseTemplate={(id) => { setTemplateId(id); setCurrentStep(4); }} />;
      case 4:
        return <Preview resumeData={resumeData} templateId={templateId} />;
      default:
        return null;
    }
  };

  const activeStep = steps[currentStep - 1];

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-black text-white
      bg-[radial-gradient(circle_at_top,_rgba(20,184,166,0.18),_transparent_80%)]
      before:absolute before:inset-0
      before:bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)]
      before:bg-[size:40px_40px] before:opacity-20"
    >
      <Header />

      <div className="pt-20 pb-12 px-4 sm:px-6">
        {/* Title */}
        <motion.div className="relative z-10 text-center mt-6 sm:mt-10" variants={containerVariant} initial="hidden" animate="visible">
          <motion.p variants={fadeUpVariant} className="text-slate-400 font-mono text-xs sm:text-sm">
            $ build.resume --interactive
          </motion.p>
          <motion.h1 variants={fadeUpVariant} className="mt-2 text-2xl sm:text-3xl font-mono font-semibold text-teal-400">
            Resume Builder
          </motion.h1>
        </motion.div>

        {/* Step Indicator */}
        <motion.div className="relative z-10 mt-8 flex flex-wrap justify-center items-center gap-4 sm:gap-0" variants={fadeUpVariant}>
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className={`w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-full font-mono text-sm
                ${currentStep >= step.id ? "bg-teal-500 text-black shadow-[0_0_18px_rgba(20,184,166,0.6)]" : "bg-slate-800 text-slate-400"}`}>
                {step.id}
              </div>
              {index !== steps.length - 1 && <div className="hidden sm:block w-20 md:w-28 h-[2px] mx-3 bg-gradient-to-r from-slate-700 to-slate-600" />}
            </React.Fragment>
          ))}
        </motion.div>

        {/* Step Context */}
        <motion.div className="relative z-10 mt-6 text-center px-2" variants={fadeUpVariant}>
          <p className="text-teal-400 font-mono text-xs sm:text-sm">
            step_{activeStep.id}.{activeStep.title.replace(/\s+/g, "_").toLowerCase()}
          </p>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">{activeStep.hint}</p>
        </motion.div>

        {/* Content */}
        <motion.div className="relative z-10 mt-10 sm:mt-4 max-w-3xl mx-auto" variants={fadeUpVariant}>
          <div className="relative bg-black/70 border border-slate-800 rounded-xl backdrop-blur-sm overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={isExtracting ? "extracting" : currentStep}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Navigation */}
        <motion.div className="relative z-10 mt-10 flex justify-between items-center max-w-3xl mx-auto pb-6 font-mono gap-4" variants={fadeUpVariant}>
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`w-1/2 sm:w-auto px-5 py-2 rounded-md border text-sm
              ${currentStep === 1 ? "border-slate-700 text-slate-600 cursor-not-allowed" : "border-slate-500 text-slate-300 hover:bg-slate-900"}`}
          >
            back()
          </button>

          <button
            onClick={currentStep === steps.length ? handleExport : nextStep}
            disabled={currentStep === 1 || isExporting}
            className="w-1/2 sm:w-auto px-5 py-2 rounded-md text-sm flex items-center justify-center gap-2
              bg-teal-500 text-black hover:bg-teal-400 shadow-[0_0_18px_rgba(20,184,166,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentStep === steps.length ? <>
              <Download size={16} /> {isExporting ? "exporting..." : "export.resume()"}
            </> : "continue()"}
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
