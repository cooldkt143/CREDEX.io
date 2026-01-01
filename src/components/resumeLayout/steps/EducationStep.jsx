import React, { useState } from "react";
import { Plus, Check, GraduationCap } from "lucide-react";

const EducationStep = () => {
  const [educations, setEducations] = useState([]);
  const [showAdd, setShowAdd] = useState(false);

  const [degree, setDegree] = useState("");
  const [institute, setInstitute] = useState("");
  const [address, setAddress] = useState("");
  const [startYear, setStartYear] = useState("");
  const [endYear, setEndYear] = useState("");
  const [currentlyStudying, setCurrentlyStudying] = useState(false);

  const addEducation = () => {
    if (!degree || !institute || !startYear) return;

    setEducations([
      ...educations,
      {
        degree,
        institute,
        address,
        startYear,
        endYear: currentlyStudying ? "Present" : endYear,
      },
    ]);

    setDegree("");
    setInstitute("");
    setAddress("");
    setStartYear("");
    setEndYear("");
    setCurrentlyStudying(false);
    setShowAdd(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-teal-400 font-mono text-lg mb-1">
          step_4.education
        </h2>
        <p className="text-slate-400 font-mono text-sm">
          Academic background and qualifications
        </p>
      </div>

      <div className="border border-slate-800 rounded-lg bg-slate-900/40 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="flex items-center gap-2 text-slate-300 font-mono text-sm">
            <GraduationCap size={14} />
            education_entries
          </h3>

          {!showAdd && (
            <button
              onClick={() => setShowAdd(true)}
              className="flex items-center gap-1 text-teal-400 text-xs font-mono hover:text-teal-300"
            >
              <Plus size={14} />
              add_education
            </button>
          )}
        </div>

        {showAdd && (
          <div className="space-y-4 mb-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                placeholder="Degree / Program"
                className="input"
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
              />
              <input
                placeholder="Institute / University"
                className="input"
                value={institute}
                onChange={(e) => setInstitute(e.target.value)}
              />
            </div>

            <input
              placeholder="Location / Address"
              className="input"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
              <input
                placeholder="Start year"
                className="input"
                value={startYear}
                onChange={(e) => setStartYear(e.target.value)}
              />

              {!currentlyStudying && (
                <input
                  placeholder="End year"
                  className="input"
                  value={endYear}
                  onChange={(e) => setEndYear(e.target.value)}
                />
              )}

              <label className="flex items-center gap-2 text-slate-300 font-mono text-sm">
                <input
                  type="checkbox"
                  checked={currentlyStudying}
                  onChange={(e) => setCurrentlyStudying(e.target.checked)}
                  className="accent-teal-400"
                />
                is_studying
              </label>
            </div>

            <button
              onClick={addEducation}
              className="w-full h-8 flex items-center justify-center gap-1 rounded-md
              border border-teal-500/30 bg-teal-500/10
              text-teal-400 text-sm font-mono hover:bg-teal-500/20"
            >
              <Check size={14} />
              save_entry
            </button>
          </div>
        )}

        {educations.length > 0 && (
          <div className="space-y-2">
            {educations.map((edu, index) => (
              <div
                key={index}
                className="rounded-md border border-slate-800 bg-slate-950 p-3"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-slate-200 font-mono text-sm">
                      {edu.degree}
                    </p>
                    <p className="text-slate-400 font-mono text-xs">
                      {edu.institute}
                      {edu.address && ` • ${edu.address}`}
                    </p>
                  </div>
                  <span className="text-teal-400 font-mono text-xs">
                    {edu.startYear} — {edu.endYear}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {educations.length === 0 && !showAdd && (
          <p className="text-slate-500 font-mono text-xs">
            no_education_added
          </p>
        )}
      </div>
    </div>
  );
};

export default EducationStep;