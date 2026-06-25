import React, { useState } from "react";
import { Plus, Check, FolderGit2, Trophy, Pencil, Trash2 } from "lucide-react";

const ProjectsStep = ({ resumeData, setResumeData }) => {
  const projects = resumeData.projects || [];
  const achievements = resumeData.achievements || [];

  const [showProjectAdd, setShowProjectAdd] = useState(false);
  const [showAchievementAdd, setShowAchievementAdd] = useState(false);
  
  const [editingProjectIndex, setEditingProjectIndex] = useState(null);
  const [editingAchievementIndex, setEditingAchievementIndex] = useState(null);

  const [projectTitle, setProjectTitle] = useState("");
  const [publicLink, setPublicLink] = useState("");
  const [githubLink, setGithubLink] = useState("");
  const [projectDesc, setProjectDesc] = useState("");

  const [achievementDesc, setAchievementDesc] = useState("");
  const [achMonth, setAchMonth] = useState("");
  const [achYear, setAchYear] = useState("");

  const saveProject = () => {
    if (!projectTitle) return;

    const entry = {
      title: projectTitle,
      publicLink,
      githubLink,
      description: projectDesc,
    };

    let updatedList;
    if (editingProjectIndex !== null) {
      updatedList = projects.map((item, idx) => idx === editingProjectIndex ? entry : item);
    } else {
      updatedList = [...projects, entry];
    }

    setResumeData({
      ...resumeData,
      projects: updatedList,
    });

    setProjectTitle("");
    setPublicLink("");
    setGithubLink("");
    setProjectDesc("");
    setEditingProjectIndex(null);
    setShowProjectAdd(false);
  };

  const startEditProject = (index) => {
    const item = projects[index];
    setProjectTitle(item.title || "");
    setPublicLink(item.publicLink || "");
    setGithubLink(item.githubLink || "");
    setProjectDesc(item.description || "");
    setEditingProjectIndex(index);
    setShowProjectAdd(true);
  };

  const cancelEditProject = () => {
    setProjectTitle("");
    setPublicLink("");
    setGithubLink("");
    setProjectDesc("");
    setEditingProjectIndex(null);
    setShowProjectAdd(false);
  };

  const deleteProject = (index) => {
    const updatedList = projects.filter((_, idx) => idx !== index);
    setResumeData({
      ...resumeData,
      projects: updatedList,
    });
    if (editingProjectIndex === index) {
      cancelEditProject();
    } else if (editingProjectIndex !== null && editingProjectIndex > index) {
      setEditingProjectIndex(editingProjectIndex - 1);
    }
  };

  const saveAchievement = () => {
    if (!achievementDesc || !achYear) return;

    const entry = {
      description: achievementDesc,
      timeline: achMonth
        ? `${achMonth} ${achYear}`.trim()
        : achYear,
    };

    let updatedList;
    if (editingAchievementIndex !== null) {
      updatedList = achievements.map((item, idx) => idx === editingAchievementIndex ? entry : item);
    } else {
      updatedList = [...achievements, entry];
    }

    setResumeData({
      ...resumeData,
      achievements: updatedList,
    });

    setAchievementDesc("");
    setAchMonth("");
    setAchYear("");
    setEditingAchievementIndex(null);
    setShowAchievementAdd(false);
  };

  const startEditAchievement = (index) => {
    const item = achievements[index];
    setAchievementDesc(item.description || "");
    const parts = item.timeline ? item.timeline.split(" ") : [];
    if (parts.length > 1) {
      setAchMonth(parts[0]);
      setAchYear(parts.slice(1).join(" "));
    } else {
      setAchMonth("");
      setAchYear(item.timeline || "");
    }
    setEditingAchievementIndex(index);
    setShowAchievementAdd(true);
  };

  const cancelEditAchievement = () => {
    setAchievementDesc("");
    setAchMonth("");
    setAchYear("");
    setEditingAchievementIndex(null);
    setShowAchievementAdd(false);
  };

  const deleteAchievement = (index) => {
    const updatedList = achievements.filter((_, idx) => idx !== index);
    setResumeData({
      ...resumeData,
      achievements: updatedList,
    });
    if (editingAchievementIndex === index) {
      cancelEditAchievement();
    } else if (editingAchievementIndex !== null && editingAchievementIndex > index) {
      setEditingAchievementIndex(editingAchievementIndex - 1);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-teal-400 font-mono text-lg mb-1">
          step_7.projects_achievements
        </h2>
        <p className="text-slate-400 font-mono text-sm">
          Work highlights, recognitions, and certifications
        </p>
      </div>

      {/* Projects Section */}
      <div className="border border-slate-800 rounded-lg bg-slate-900/40 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="flex items-center gap-2 text-slate-300 font-mono text-sm">
            <FolderGit2 size={14} />
            projects
          </h3>

          {!showProjectAdd && (
            <button
              onClick={() => { setShowProjectAdd(true); setEditingProjectIndex(null); }}
              className="flex items-center gap-1 text-teal-400 text-xs font-mono hover:text-teal-300"
            >
              <Plus size={14} />
              add_project
            </button>
          )}
        </div>

        {showProjectAdd && (
          <div className="space-y-3 mb-4">
            <input
              placeholder="Project title"
              className="input"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                placeholder="Public link (demo / site)"
                className="input"
                value={publicLink}
                onChange={(e) => setPublicLink(e.target.value)}
              />
              <input
                placeholder="GitHub repository"
                className="input"
                value={githubLink}
                onChange={(e) => setGithubLink(e.target.value)}
              />
            </div>

            <textarea
              rows="3"
              placeholder="Short project description"
              className="input resize-none"
              value={projectDesc}
              onChange={(e) => setProjectDesc(e.target.value)}
            />

            <div className="flex gap-2">
              {editingProjectIndex !== null && (
                <button
                  onClick={cancelEditProject}
                  className="w-1/2 h-8 flex items-center justify-center gap-1 rounded-md
                  border border-slate-700 bg-slate-800/50
                  text-slate-300 text-sm font-mono hover:bg-slate-800"
                >
                  cancel
                </button>
              )}
              <button
                onClick={saveProject}
                className={`h-8 flex items-center justify-center gap-1 rounded-md border text-sm font-mono
                  ${editingProjectIndex !== null ? "w-1/2 border-teal-500/30 bg-teal-500/10 text-teal-400 hover:bg-teal-500/20" 
                                                 : "w-full border-teal-500/30 bg-teal-500/10 text-teal-400 hover:bg-teal-500/20"}`}
              >
                <Check size={14} />
                {editingProjectIndex !== null ? "update_project" : "save_project"}
              </button>
            </div>
          </div>
        )}

        {projects.length > 0 && (
          <div className="space-y-2">
            {projects.map((project, index) => (
              <div
                key={index}
                className="rounded-md border border-slate-800 bg-slate-950 p-3"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-1 flex-1">
                    <p className="text-slate-200 font-mono text-sm">
                      {project.title}
                    </p>
                    <p className="text-slate-400 font-mono text-xs">
                      {project.description}
                    </p>
                    <div className="flex gap-3 text-xs font-mono">
                      {project.publicLink && (
                        <a
                          href={project.publicLink}
                          target="_blank"
                          rel="noreferrer"
                          className="text-teal-400 hover:underline"
                        >
                          live
                        </a>
                      )}
                      {project.githubLink && (
                        <a
                          href={project.githubLink}
                          target="_blank"
                          rel="noreferrer"
                          className="text-teal-400 hover:underline"
                        >
                          github
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => startEditProject(index)}
                      className="text-slate-400 hover:text-teal-400 transition"
                      title="Edit"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => deleteProject(index)}
                      className="text-slate-400 hover:text-red-400 transition"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {projects.length === 0 && !showProjectAdd && (
          <p className="text-slate-500 font-mono text-xs">
            no_projects_added
          </p>
        )}
      </div>

      {/* Achievements Section */}
      <div className="border border-slate-800 rounded-lg bg-slate-900/40 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="flex items-center gap-2 text-slate-300 font-mono text-sm">
            <Trophy size={14} />
            achievements
          </h3>

          {!showAchievementAdd && (
            <button
              onClick={() => { setShowAchievementAdd(true); setEditingAchievementIndex(null); }}
              className="flex items-center gap-1 text-teal-400 text-xs font-mono hover:text-teal-300"
            >
              <Plus size={14} />
              add_achievement
            </button>
          )}
        </div>

        {showAchievementAdd && (
          <div className="space-y-3 mb-4">
            <textarea
              rows="3"
              placeholder="Achievement or certification"
              className="input resize-none"
              value={achievementDesc}
              onChange={(e) => setAchievementDesc(e.target.value)}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                placeholder="Month"
                className="input"
                value={achMonth}
                onChange={(e) => setAchMonth(e.target.value)}
              />
              <input
                placeholder="Year"
                className="input"
                value={achYear}
                onChange={(e) => setAchYear(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              {editingAchievementIndex !== null && (
                <button
                  onClick={cancelEditAchievement}
                  className="w-1/2 h-8 flex items-center justify-center gap-1 rounded-md
                  border border-slate-700 bg-slate-800/50
                  text-slate-300 text-sm font-mono hover:bg-slate-800"
                >
                  cancel
                </button>
              )}
              <button
                onClick={saveAchievement}
                className={`h-8 flex items-center justify-center gap-1 rounded-md border text-sm font-mono
                  ${editingAchievementIndex !== null ? "w-1/2 border-teal-500/30 bg-teal-500/10 text-teal-400 hover:bg-teal-500/20" 
                                                     : "w-full border-teal-500/30 bg-teal-500/10 text-teal-400 hover:bg-teal-500/20"}`}
              >
                <Check size={14} />
                {editingAchievementIndex !== null ? "update_achievement" : "save_achievement"}
              </button>
            </div>
          </div>
        )}

        {achievements.length > 0 && (
          <div className="space-y-2">
            {achievements.map((ach, index) => (
              <div
                key={index}
                className="rounded-md border border-slate-800 bg-slate-950 p-3"
              >
                <div className="flex justify-between items-start">
                  <p className="text-slate-200 font-mono text-sm flex-1">
                    {ach.description}
                  </p>
                  <div className="flex items-center gap-4 ml-4">
                    <span className="text-teal-400 font-mono text-xs">
                      {ach.timeline}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEditAchievement(index)}
                        className="text-slate-400 hover:text-teal-400 transition"
                        title="Edit"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => deleteAchievement(index)}
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

        {achievements.length === 0 && !showAchievementAdd && (
          <p className="text-slate-500 font-mono text-xs">
            no_achievements_added
          </p>
        )}
      </div>
    </div>
  );
};

export default ProjectsStep;
