import React, { useState } from "react";
import { Plus, Check, FolderGit2, Trophy } from "lucide-react";

const ProjectsStep = () => {
  const [projects, setProjects] = useState([]);
  const [achievements, setAchievements] = useState([]);

  const [showProjectAdd, setShowProjectAdd] = useState(false);
  const [showAchievementAdd, setShowAchievementAdd] = useState(false);

  const [projectTitle, setProjectTitle] = useState("");
  const [publicLink, setPublicLink] = useState("");
  const [githubLink, setGithubLink] = useState("");
  const [projectDesc, setProjectDesc] = useState("");

  const [achievementDesc, setAchievementDesc] = useState("");
  const [achMonth, setAchMonth] = useState("");
  const [achYear, setAchYear] = useState("");

  const addProject = () => {
    if (!projectTitle) return;

    setProjects([
      ...projects,
      {
        title: projectTitle,
        publicLink,
        githubLink,
        description: projectDesc,
      },
    ]);

    setProjectTitle("");
    setPublicLink("");
    setGithubLink("");
    setProjectDesc("");
    setShowProjectAdd(false);
  };

  const addAchievement = () => {
    if (!achievementDesc || !achYear) return;

    setAchievements([
      ...achievements,
      {
        description: achievementDesc,
        timeline: achMonth
          ? `${achMonth} ${achYear}`
          : achYear,
      },
    ]);

    setAchievementDesc("");
    setAchMonth("");
    setAchYear("");
    setShowAchievementAdd(false);
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
              onClick={() => setShowProjectAdd(true)}
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

            <button
              onClick={addProject}
              className="w-full h-8 flex items-center justify-center gap-1 rounded-md
              border border-teal-500/30 bg-teal-500/10
              text-teal-400 text-sm font-mono hover:bg-teal-500/20"
            >
              <Check size={14} />
              save_project
            </button>
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
                  <div className="space-y-1">
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
              onClick={() => setShowAchievementAdd(true)}
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

            <button
              onClick={addAchievement}
              className="w-full h-8 flex items-center justify-center gap-1 rounded-md
              border border-teal-500/30 bg-teal-500/10
              text-teal-400 text-sm font-mono hover:bg-teal-500/20"
            >
              <Check size={14} />
              save_achievement
            </button>
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
                  <p className="text-slate-200 font-mono text-sm">
                    {ach.description}
                  </p>
                  <span className="text-teal-400 font-mono text-xs">
                    {ach.timeline}
                  </span>
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