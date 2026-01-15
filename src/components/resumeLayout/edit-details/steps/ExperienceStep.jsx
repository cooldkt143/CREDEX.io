import React, { useState } from "react";
import { Plus, Check, Briefcase } from "lucide-react";

const ExperienceStep = ({ resumeData, setResumeData }) => {
  const experiences = resumeData.experiences || [];

  const [showAdd, setShowAdd] = useState(false);

  const [jobTitle, setJobTitle] = useState("");
  const [employer, setEmployer] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");

  const [startMonth, setStartMonth] = useState("");
  const [startYear, setStartYear] = useState("");
  const [endMonth, setEndMonth] = useState("");
  const [endYear, setEndYear] = useState("");
  const [currentlyWorking, setCurrentlyWorking] = useState(false);

  const addExperience = () => {
    if (!jobTitle || !employer || !startMonth || !startYear) return;

    const newExp = {
      jobTitle,
      employer,
      city,
      country,
      start: `${startMonth} ${startYear}`,
      end: currentlyWorking
        ? "Present"
        : `${endMonth} ${endYear}`,
    };

    setResumeData({
      ...resumeData,
      experiences: [...experiences, newExp],
    });

    setJobTitle("");
    setEmployer("");
    setCity("");
    setCountry("");
    setStartMonth("");
    setStartYear("");
    setEndMonth("");
    setEndYear("");
    setCurrentlyWorking(false);
    setShowAdd(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-teal-400 font-mono text-lg mb-1">
          step_6.experience
        </h2>
        <p className="text-slate-400 font-mono text-sm">
          Professional roles and responsibilities
        </p>
      </div>

      <div className="border border-slate-800 rounded-lg bg-slate-900/40 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="flex items-center gap-2 text-slate-300 font-mono text-sm">
            <Briefcase size={14} />
            experience_entries
          </h3>

          {!showAdd && (
            <button
              onClick={() => setShowAdd(true)}
              className="flex items-center gap-1 text-teal-400 text-xs font-mono hover:text-teal-300"
            >
              <Plus size={14} />
              add_experience
            </button>
          )}
        </div>

        {showAdd && (
          <div className="space-y-4 mb-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                placeholder="Job title"
                className="input"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
              />
              <input
                placeholder="Employer / Company"
                className="input"
                value={employer}
                onChange={(e) => setEmployer(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                placeholder="City"
                className="input"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
              <input
                placeholder="Country"
                className="input"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
              <input
                placeholder="Start month"
                className="input"
                value={startMonth}
                onChange={(e) => setStartMonth(e.target.value)}
              />
              <input
                placeholder="Start year"
                className="input"
                value={startYear}
                onChange={(e) => setStartYear(e.target.value)}
              />

              {!currentlyWorking && (
                <>
                  <input
                    placeholder="End month"
                    className="input"
                    value={endMonth}
                    onChange={(e) => setEndMonth(e.target.value)}
                  />
                  <input
                    placeholder="End year"
                    className="input"
                    value={endYear}
                    onChange={(e) => setEndYear(e.target.value)}
                  />
                </>
              )}

              <label className="flex items-center gap-2 text-slate-300 font-mono text-sm sm:col-span-2">
                <input
                  type="checkbox"
                  checked={currentlyWorking}
                  onChange={(e) => setCurrentlyWorking(e.target.checked)}
                  className="accent-teal-400"
                />
                currently_working
              </label>
            </div>

            <button
              onClick={addExperience}
              className="w-full h-8 flex items-center justify-center gap-1 rounded-md
              border border-teal-500/30 bg-teal-500/10
              text-teal-400 text-sm font-mono hover:bg-teal-500/20"
            >
              <Check size={14} />
              save_entry
            </button>
          </div>
        )}

        {experiences.length > 0 && (
          <div className="space-y-2">
            {experiences.map((exp, index) => (
              <div
                key={index}
                className="rounded-md border border-slate-800 bg-slate-950 p-3"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-slate-200 font-mono text-sm">
                      {exp.jobTitle}
                    </p>
                    <p className="text-slate-400 font-mono text-xs">
                      {exp.employer}
                      {(exp.city || exp.country) &&
                        ` • ${exp.city}${exp.country ? ", " + exp.country : ""}`}
                    </p>
                  </div>
                  <span className="text-teal-400 font-mono text-xs">
                    {exp.start} — {exp.end}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {experiences.length === 0 && !showAdd && (
          <p className="text-slate-500 font-mono text-xs">
            no_experience_added
          </p>
        )}
      </div>
    </div>
  );
};

export default ExperienceStep;
