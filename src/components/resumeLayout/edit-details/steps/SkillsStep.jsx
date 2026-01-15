import React, { useState } from "react";
import { Plus, X, Code, Languages } from "lucide-react";

const proficiencyLevels = ["select_level", "Basic", "Intermediate", "Fluent", "Native"];

const SkillsStep = ({ resumeData, setResumeData }) => {
  const skills = resumeData.skills || [];
  const languages = resumeData.languages || [];

  const [skillInput, setSkillInput] = useState("");

  const [langName, setLangName] = useState("");
  const [langLevel, setLangLevel] = useState("select_level");

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (!trimmed) return;
    if (skills.includes(trimmed)) return;

    setResumeData({
      ...resumeData,
      skills: [...skills, trimmed],
    });

    setSkillInput("");
  };

  const removeSkill = (skill) => {
    setResumeData({
      ...resumeData,
      skills: skills.filter((s) => s !== skill),
    });
  };

  const addLanguage = () => {
    const nameTrimmed = langName.trim();
    if (!nameTrimmed) return;

    setResumeData({
      ...resumeData,
      languages: [
        ...languages,
        { name: nameTrimmed, level: langLevel },
      ],
    });

    setLangName("");
    setLangLevel("select_level");
  };

  const removeLanguage = (name) => {
    setResumeData({
      ...resumeData,
      languages: languages.filter((l) => l.name !== name),
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-teal-400 font-mono text-lg mb-1">
          step_5.skills
        </h2>
        <p className="text-slate-400 font-mono text-sm">
          Technical strengths and spoken languages
        </p>
      </div>

      {/* Skills Section */}
      <div className="border border-slate-800 rounded-lg bg-slate-900/40 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="flex items-center gap-2 text-slate-300 font-mono text-sm">
            <Code size={14} />
            skills
          </h3>
        </div>

        <div className="flex gap-2 mb-4">
          <input
            placeholder="Add a skill"
            className="input flex-1"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addSkill()}
          />
          <button
            onClick={addSkill}
            className="flex items-center gap-1 px-3 rounded-md border
            border-teal-500/30 bg-teal-500/10
            text-teal-400 text-sm font-mono hover:bg-teal-500/20"
          >
            <Plus size={14} />
            add
          </button>
        </div>

        {skills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <div
                key={skill}
                className="flex items-center gap-2 rounded-md
                border border-slate-700 bg-slate-950 px-2 py-1"
              >
                <span className="text-slate-200 font-mono text-xs">
                  {skill}
                </span>
                <button
                  onClick={() => removeSkill(skill)}
                  className="text-slate-400 hover:text-red-400"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-500 font-mono text-xs">
            no_skills_added
          </p>
        )}
      </div>

      {/* Languages Section */}
      <div className="border border-slate-800 rounded-lg bg-slate-900/40 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="flex items-center gap-2 text-slate-300 font-mono text-sm">
            <Languages size={14} />
            languages
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
          <input
            placeholder="Language"
            className="input"
            value={langName}
            onChange={(e) => setLangName(e.target.value)}
          />

          <select
            className="input bg-slate-900"
            value={langLevel}
            onChange={(e) => setLangLevel(e.target.value)}
          >
            {proficiencyLevels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>

          <button
            onClick={addLanguage}
            className="flex items-center justify-center gap-1 rounded-md
            border border-teal-500/30 bg-teal-500/10
            text-teal-400 text-sm font-mono hover:bg-teal-500/20"
          >
            <Plus size={14} />
            add
          </button>
        </div>

        {languages.length > 0 ? (
          <div className="space-y-2">
            {languages.map((lang) => (
              <div
                key={lang.name}
                className="flex items-center justify-between rounded-md
                border border-slate-800 bg-slate-950 px-3 py-2"
              >
                <span className="text-slate-200 font-mono text-sm">
                  {lang.name}
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-teal-400 font-mono text-xs">
                    {lang.level}
                  </span>
                  <button
                    onClick={() => removeLanguage(lang.name)}
                    className="text-slate-400 hover:text-red-400"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-500 font-mono text-xs">
            no_languages_added
          </p>
        )}
      </div>
    </div>
  );
};

export default SkillsStep;
