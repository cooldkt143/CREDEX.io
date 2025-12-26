import React, { useState } from "react";

import githubData from "../../data/leaderboard-github.json";
import hackerrankData from "../../data/leaderboard-hackerrank.json";
import gfgData from "../../data/leaderboard-gfg.json";
import unstopData from "../../data/leaderboard-unstop.json";
import linkedinData from "../../data/leaderboard-linkedin.json";

const leaderboardMap = {
  github: githubData,
  hackerrank: hackerrankData,
  gfg: gfgData,
  unstop: unstopData,
  linkedin: linkedinData,
};

const tabs = [
  { key: "github", label: "GitHub" },
  { key: "hackerrank", label: "HackerRank" },
  { key: "gfg", label: "GeeksforGeeks" },
  { key: "unstop", label: "Unstop" },
  { key: "linkedin", label: "LinkedIn" },
];

const Leaderboard = () => {
  const [activeTab, setActiveTab] = useState("github");
  const leaderboard = leaderboardMap[activeTab];

  return (
    <section className="mx-auto mt-20 max-w-4xl rounded-xl border border-emerald-500/20 bg-gradient-to-b from-emerald-950/40 to-black/60 backdrop-blur">

      {/* Header */}
      <div className="flex items-center gap-3 border-b border-emerald-500/20 px-6 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-400">
          &gt;_
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Leaderboard</h3>
          <p className="text-xs text-emerald-400/70">
            Platform-wise credibility rankings
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 px-6 py-4 border-b border-emerald-500/10">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`rounded-md px-3 py-1 text-sm font-mono transition
              ${
                activeTab === tab.key
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "text-gray-400 hover:text-emerald-400"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-[60px_1fr_100px] px-6 py-3 text-xs text-emerald-400/70">
        <span>#</span>
        <span>USER</span>
        <span className="text-right">SCORE</span>
      </div>

      {/* Rows */}
      <div>
        {leaderboard.map((user) => (
          <div
            key={user.rank}
            className="grid grid-cols-[60px_1fr_100px] items-center px-6 py-4 border-t border-emerald-500/10 hover:bg-emerald-500/5 transition"
          >
            <div className="text-lg text-emerald-400">{user.rank}</div>

            <div>
              <p className="text-sm font-medium text-white">
                {user.username}
              </p>
              <p className="text-xs text-gray-400">
                {user.name}
              </p>
            </div>

            <div className="text-right font-mono text-sm text-emerald-400">
              {user.score}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-emerald-500/20 px-6 py-4 text-center text-xs text-emerald-400/70 hover:text-emerald-400 cursor-pointer">
        View All →
      </div>
    </section>
  );
};

export default Leaderboard;
