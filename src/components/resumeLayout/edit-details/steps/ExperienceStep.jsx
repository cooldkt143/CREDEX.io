import React, { useState } from "react";
import { Plus, Check, Briefcase, Pencil, Trash2 } from "lucide-react";

const ExperienceStep = ({ resumeData, setResumeData }) => {
  const experiences = resumeData.experience || [];

  const [showAdd, setShowAdd] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  const [jobTitle, setJobTitle] = useState("");
  const [employer, setEmployer] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");

  const [startMonth, setStartMonth] = useState("");
  const [startYear, setStartYear] = useState("");
  const [endMonth, setEndMonth] = useState("");
  const [endYear, setEndYear] = useState("");
  const [currentlyWorking, setCurrentlyWorking] = useState(false);

  const saveExperience = () => {
    if (!jobTitle || !employer || !startMonth || !startYear) return;

    const entry = {
      jobTitle,
      employer,
      city,
      country,
      start: `${startMonth} ${startYear}`.trim(),
      end: currentlyWorking
        ? "Present"
        : `${endMonth} ${endYear}`.trim(),
    };

    let updatedList;
    if (editingIndex !== null) {
      updatedList = experiences.map((item, idx) => idx === editingIndex ? entry : item);
    } else {
      updatedList = [...experiences, entry];
    }

    setResumeData({
      ...resumeData,
      experience: updatedList,
    });

    // reset
    setJobTitle("");
    setEmployer("");
    setCity("");
    setCountry("");
    setStartMonth("");
    setStartYear("");
    setEndMonth("");
    setEndYear("");
    setCurrentlyWorking(false);
    setEditingIndex(null);
    setShowAdd(false);
  };

  const startEdit = (index) => {
    const item = experiences[index];
    setJobTitle(item.jobTitle || "");
    setEmployer(item.employer || "");
    setCity(item.city || "");
    setCountry(item.country || "");

    const startParts = item.start ? item.start.split(" ") : [];
    if (startParts.length > 1) {
      setStartMonth(startParts[0]);
      setStartYear(startParts.slice(1).join(" "));
    } else {
      setStartMonth("");
      setStartYear(item.start || "");
    }

    if (item.end === "Present") {
      setCurrentlyWorking(true);
      setEndMonth("");
      setEndYear("");
    } else {
      setCurrentlyWorking(false);
      const endParts = item.end ? item.end.split(" ") : [];
      if (endParts.length > 1) {
        setEndMonth(endParts[0]);
        setEndYear(endParts.slice(1).join(" "));
      } else {
        setEndMonth("");
        setEndYear(item.end || "");
      }
    }

    setEditingIndex(index);
    setShowAdd(true);
  };

  const cancelEdit = () => {
    setJobTitle("");
    setEmployer("");
    setCity("");
    setCountry("");
    setStartMonth("");
    setStartYear("");
    setEndMonth("");
    setEndYear("");
    setCurrentlyWorking(false);
    setEditingIndex(null);
    setShowAdd(false);
  };

  const deleteExperience = (index) => {
    const updatedList = experiences.filter((_, idx) => idx !== index);
    setResumeData({
      ...resumeData,
      experience: updatedList,
    });
    if (editingIndex === index) {
      cancelEdit();
    } else if (editingIndex !== null && editingIndex > index) {
      setEditingIndex(editingIndex - 1);
    }
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
              onClick={() => { setShowAdd(true); setEditingIndex(null); }}
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

            <div className="flex gap-2">
              {editingIndex !== null && (
                <button
                  onClick={cancelEdit}
                  className="w-1/2 h-8 flex items-center justify-center gap-1 rounded-md
                  border border-slate-700 bg-slate-800/50
                  text-slate-300 text-sm font-mono hover:bg-slate-800"
                >
                  cancel
                </button>
              )}
              <button
                onClick={saveExperience}
                className={`h-8 flex items-center justify-center gap-1 rounded-md border text-sm font-mono
                  ${editingIndex !== null ? "w-1/2 border-teal-500/30 bg-teal-500/10 text-teal-400 hover:bg-teal-500/20" 
                                           : "w-full border-teal-500/30 bg-teal-500/10 text-teal-400 hover:bg-teal-500/20"}`}
              >
                <Check size={14} />
                {editingIndex !== null ? "update_entry" : "save_entry"}
              </button>
            </div>
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
                  <div className="flex items-center gap-4">
                    <span className="text-teal-400 font-mono text-xs">
                      {exp.start} — {exp.end}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(index)}
                        className="text-slate-400 hover:text-teal-400 transition"
                        title="Edit"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => deleteExperience(index)}
                        className="text-slate-400 hover:text-red-400 transition"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
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
