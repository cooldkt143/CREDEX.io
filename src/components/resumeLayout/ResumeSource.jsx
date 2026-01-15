import React from "react";
import { Upload, FilePlus } from "lucide-react";
import axios from "axios";

const ResumeSource = ({ onCreate, onResumeParsed }) => {
  // Handle file upload
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/resume-builder/upload",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const { resume_json, id } = res.data;

      // STEP 3 verification
      console.log("Parsed contacts:", resume_json.contacts);

      if (onResumeParsed) {
        onResumeParsed(resume_json, id);
      }
    } catch (err) {
      console.error("Resume upload failed:", err);
      alert("Failed to upload resume. Please try again.");
    }
  };

  return (
    <div className="space-y-6 p-5 sm:p-10">
      {/* Heading */}
      <div className="text-center mb-8 px-4 sm:px-10">
        <h1 className="text-teal-400 font-mono text-lg mb-2">
          resume_source
        </h1>
        <p className="text-slate-400 font-mono text-sm leading-relaxed">
          Choose how you want to build your resume. You can start fresh or upload
          an existing resume to auto-extract details.
        </p>
      </div>

      {/* Options */}
      <div className="grid sm:grid-cols-2 gap-4 mt-6">
        {/* Create from scratch */}
        <button
          onClick={onCreate}
          className="group relative rounded-xl border border-slate-800 bg-black/60 p-6 text-left
                     hover:border-teal-500 transition"
        >
          <div className="flex items-center gap-3 mb-3">
            <FilePlus className="text-teal-400" size={20} />
            <h3 className="font-mono text-sm text-teal-400">
              Create from scratch
            </h3>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed">
            Manually enter your personal details, experience, skills, and
            projects step by step.
          </p>
        </button>

        {/* Upload resume */}
        <label
          className="group relative cursor-pointer rounded-xl border border-slate-800 bg-black/60 p-6 text-left
                     hover:border-teal-500 transition"
        >
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            className="hidden"
            onChange={handleUpload}
          />
          <div className="flex items-center gap-3 mb-3">
            <Upload className="text-teal-400" size={20} />
            <h3 className="font-mono text-sm text-teal-400">
              Upload existing resume
            </h3>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed">
            Upload a PDF or DOC file. We’ll extract your information and prefill
            the resume for you.
          </p>
        </label>
      </div>

      {/* Hint */}
      <p className="text-slate-500 font-mono text-xs mt-2">
        supported_formats: pdf, doc, docx
      </p>
    </div>
  );
};

export default ResumeSource;
