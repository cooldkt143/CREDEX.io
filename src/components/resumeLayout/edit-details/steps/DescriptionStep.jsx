import React from "react";

const DescriptionStep = ({ resumeData, setResumeData }) => {
  const summary = resumeData.summary || "";
  const maxChars = 1000;

  const updateText = (value) => {
    setResumeData({
      ...resumeData,
      summary: value
    });
  };

  return (
    <>
      <h2 className="text-teal-400 font-mono text-lg mb-1">
        step_3.description
      </h2>

      <p className="text-slate-400 font-mono text-xs mb-4">
        Write a short professional summary. Focus on impact, role, and strengths.
      </p>

      <div className="relative border border-slate-800 rounded-lg bg-slate-900/40 p-4">
        {/* Editor header */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-slate-500 font-mono text-xs">
            summary.md
          </span>
          <span
            className={`font-mono text-xs ${
              summary.length > maxChars
                ? "text-red-400"
                : "text-slate-500"
            }`}
          >
            {summary.length}/{maxChars}
          </span>
        </div>

        {/* Textarea */}
        <textarea
          rows="6"
          value={summary}
          onChange={(e) => updateText(e.target.value)}
          placeholder={`For example :- Frontend developer with experience in React, Tailwind, and building scalable UI systems...`}
          className="w-full resize-none bg-transparent text-slate-200 font-mono text-sm
          focus:outline-none leading-relaxed"
        />

        {/* Footer hint */}
        <div className="mt-3 flex items-center justify-between text-xs font-mono text-slate-500">
          <span>// Keep it concise and ATS friendly</span>
          <span>{summary.length > maxChars && "limit exceeded"}</span>
        </div>
      </div>
    </>
  );
};

export default DescriptionStep;
