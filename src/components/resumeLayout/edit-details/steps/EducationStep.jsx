import React, { useState } from "react";
import { Plus, Check, GraduationCap, Pencil, Trash2 } from "lucide-react";

const EducationStep = ({ resumeData, setResumeData }) => {
  const educations = resumeData.education || [];

  const [showAdd, setShowAdd] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  
  const [degree, setDegree] = useState("");
  const [institute, setInstitute] = useState("");
  const [address, setAddress] = useState("");
  const [startYear, setStartYear] = useState("");
  const [endYear, setEndYear] = useState("");
  const [currentlyStudying, setCurrentlyStudying] = useState(false);

  const saveEducation = () => {
    if (!degree || !institute || !startYear) return;

    const entry = {
      degree,
      institute,
      address,
      startYear,
      endYear: currentlyStudying ? "Present" : endYear,
    };

    let updatedList;
    if (editingIndex !== null) {
      updatedList = educations.map((item, idx) => idx === editingIndex ? entry : item);
    } else {
      updatedList = [...educations, entry];
    }

    setResumeData({
      ...resumeData,
      education: updatedList,
    });

    // reset
    setDegree("");
    setInstitute("");
    setAddress("");
    setStartYear("");
    setEndYear("");
    setCurrentlyStudying(false);
    setEditingIndex(null);
    setShowAdd(false);
  };

  const startEdit = (index) => {
    const item = educations[index];
    setDegree(item.degree || "");
    setInstitute(item.institute || "");
    setAddress(item.address || "");
    setStartYear(item.startYear || "");
    if (item.endYear === "Present") {
      setCurrentlyStudying(true);
      setEndYear("");
    } else {
      setCurrentlyStudying(false);
      setEndYear(item.endYear || "");
    }
    setEditingIndex(index);
    setShowAdd(true);
  };

  const cancelEdit = () => {
    setDegree("");
    setInstitute("");
    setAddress("");
    setStartYear("");
    setEndYear("");
    setCurrentlyStudying(false);
    setEditingIndex(null);
    setShowAdd(false);
  };

  const deleteEducation = (index) => {
    const updatedList = educations.filter((_, idx) => idx !== index);
    setResumeData({
      ...resumeData,
      education: updatedList,
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
              onClick={() => { setShowAdd(true); setEditingIndex(null); }}
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
                onClick={saveEducation}
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
                  <div className="flex items-center gap-4">
                    <span className="text-teal-400 font-mono text-xs">
                      {edu.startYear} — {edu.endYear}
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
                        onClick={() => deleteEducation(index)}
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
