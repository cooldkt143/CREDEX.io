import React, { useState } from "react";
import { Download } from "lucide-react";
import { motion } from "framer-motion";

import Header from "../components/Header";
import Template from "../components/resumeLayout/Template";
import ResumeSource from "../components/resumeLayout/ResumeSource";
import EditDetails from "../components/resumeLayout/EditDetails";
import Preview from "../components/resumeLayout/Preview";

// Updated Step Order
const steps = [
  {
    id: 1,
    title: "Resume_Source",
    hint: "Create your resume from scratch or upload an existing one to extract details"
  },
  {
    id: 2,
    title: "Template_Selection",
    hint: "Choose a resume template to define layout and style"
  },
  {
    id: 3,
    title: "Edit_Details",
    hint: "Review and refine personal info, experience, skills, and projects"
  },
  {
    id: 4,
    title: "Preview_Export",
    hint: "Preview the final resume and download it in your preferred format"
  }
];

// Framer Motion Variants
const containerVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1, duration: 0.6 } }
};

const fadeUpVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const ResumeBuilder = () => {
  const [currentStep, setCurrentStep] = useState(1);

  const nextStep = () => currentStep < steps.length && setCurrentStep(p => p + 1);
  const prevStep = () => currentStep > 1 && setCurrentStep(p => p - 1);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <ResumeSource />;
      case 2:
        return <Template onChooseTemplate={() => setCurrentStep(4)} />;
      case 3:
        return <EditDetails />;
      case 4:
        return <Preview />;
      default:
        return null;
    }
  };

  const activeStep = steps[currentStep - 1];

  return (
    <div
      className="relative min-h-screen overflow-x-hidden bg-black text-white
        bg-[radial-gradient(circle_at_top,_rgba(20,184,166,0.18),_transparent_80%)]
        before:absolute before:inset-0
        before:bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)]
        before:bg-[size:40px_40px] before:opacity-20"
    >
      <Header />

      <div className="pt-20 pb-12 px-4 sm:px-6">

        {/* Title */}
        <motion.div
          className="relative z-10 text-center mt-6 sm:mt-10"
          variants={containerVariant}
          initial="hidden"
          animate="visible"
        >
          <motion.p variants={fadeUpVariant} className="text-slate-400 font-mono text-xs sm:text-sm">
            $ build.resume --interactive
          </motion.p>
          <motion.h1 variants={fadeUpVariant} className="mt-2 text-2xl sm:text-3xl font-mono font-semibold text-teal-400">
            Resume Builder
          </motion.h1>
        </motion.div>

        {/* Step Indicator */}
        <motion.div
          className="relative z-10 mt-8 flex flex-wrap justify-center items-center gap-4 sm:gap-0"
          variants={fadeUpVariant}
        >
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className={`w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-full font-mono text-sm
                ${currentStep >= step.id
                  ? "bg-teal-500 text-black shadow-[0_0_18px_rgba(20,184,166,0.6)]"
                  : "bg-slate-800 text-slate-400"}`}>
                {step.id}
              </div>
              {index !== steps.length - 1 && (
                <div className="hidden sm:block w-20 md:w-28 h-[2px] mx-3 bg-gradient-to-r from-slate-700 to-slate-600" />
              )}
            </React.Fragment>
          ))}
        </motion.div>

        {/* Step Context */}
        <motion.div
          className="relative z-10 mt-6 text-center px-2"
          variants={fadeUpVariant}
        >
          <p className="text-teal-400 font-mono text-xs sm:text-sm">
            step_{activeStep.id}.{activeStep.title.replace(/\s+/g, "_").toLowerCase()}
          </p>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            {activeStep.hint}
          </p>
        </motion.div>

        {/* Content */}
        <motion.div
          className="relative z-10 mt-10 sm:mt-4 max-w-3xl mx-auto"
          variants={fadeUpVariant}
        >
          <div className="relative bg-black/70 border border-slate-800 rounded-xl backdrop-blur-sm">
            {renderStep()}
          </div>
        </motion.div>

        {/* Navigation (VISIBLE ON STEP 1 TOO) */}
        <motion.div
          className="relative z-10 mt-10 flex justify-between items-center max-w-3xl mx-auto pb-6 font-mono gap-4"
          variants={fadeUpVariant}
        >
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`w-1/2 sm:w-auto px-5 py-2 rounded-md border text-sm
              ${currentStep === 1
                ? "border-slate-700 text-slate-600 cursor-not-allowed"
                : "border-slate-500 text-slate-300 hover:bg-slate-900"}`}
          >
            back()
          </button>

          <button
            onClick={currentStep === steps.length ? undefined : nextStep}
            className="w-1/2 sm:w-auto px-5 py-2 rounded-md text-sm flex items-center justify-center gap-2
              bg-teal-500 text-black hover:bg-teal-400 shadow-[0_0_18px_rgba(20,184,166,0.5)]"
          >
            {currentStep === steps.length ? (
              <>
                <Download size={16} />
                export.resume()
              </>
            ) : (
              "continue()"
            )}
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
