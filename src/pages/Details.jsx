import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import StepOne from "../components/detailsStep/StepOne";
import StepTwo from "../components/detailsStep/StepTwo";
import StepThree from "../components/detailsStep/StepThree";
import StepFour from "../components/detailsStep/StepFour";

const Details = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    description: "",
    role: [],
    github: "",
    linkedin: "",
    hackerrank: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => {
    if (step < 4) setStep(step + 1);
    else navigate("/home");
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="min-h-screen w-full flex bg-gradient-to-br from-[#020617] via-[#020617] to-teal-950 font-mono">
      <div className="w-full h-screen sm:h-[70vh] sm:max-w-4xl sm:mx-auto sm:my-auto border border-teal-400/40 bg-white/5 backdrop-blur-xl shadow-[0_0_60px_rgba(45,212,191,0.25)] flex flex-col overflow-hidden sm:rounded-xl">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
          <p className="text-teal-400 text-sm">// developer.setup</p>
          <p className="text-xs text-gray-400">step {step} / 4</p>
        </div>

        {/* Step Indicators */}
        <div className="flex justify-center gap-3 py-4 text-xs text-gray-400">
          {[1, 2, 3, 4].map((num) => (
            <span
              key={num}
              className={`px-3 py-1 rounded border ${
                step === num ? "border-teal-400 text-teal-400" : "border-gray-700"
              }`}
            >
              {num}
            </span>
          ))}
        </div>

        {/* Sliding Steps */}
        <div
          className="flex flex-1 transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${(step - 1) * 100}%)` }}
        >
          <StepOne formData={formData} handleChange={handleChange} />
          <StepTwo formData={formData} handleChange={handleChange} />
          <StepThree formData={formData} handleChange={handleChange} />
          <StepFour formData={formData} />
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center px-6 py-4 border-t border-gray-700">
          <button
            onClick={prevStep}
            disabled={step === 1}
            className="px-4 py-2 border border-teal-400/60 rounded text-gray-400 hover:text-teal-400 hover:border-teal-400 disabled:opacity-30 transition"
          >
            {"<- back"}
          </button>

          <button
            onClick={nextStep}
            className="px-6 py-2 rounded bg-teal-500 text-black font-semibold hover:bg-teal-400"
          >
            {step === 4 ? "continue()" : "next ->"}
          </button>
        </div>
      </div>

      {/* Input Styles */}
      <style>
        {`
          .input {
            width: 100%;
            background: rgba(0,0,0,0.55);
            border: 1px solid rgba(45,212,191,0.3);
            padding: 0.65rem;
            border-radius: 0.375rem;
            color: #5eead4;
            font-size: 0.875rem;
            outline: none;
          }
          .input::placeholder {
            color: #6b7280;
          }
          .input:focus {
            border-color: #2dd4bf;
          }
        `}
      </style>
    </div>
  );
};

export default Details;
