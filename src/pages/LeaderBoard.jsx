import React, { useState } from "react";
import { motion } from "framer-motion";

const platforms = ["GitHub", "HackerRank", "GeeksForGeeks", "Unstop", "LinkedIn"];

const leaderboardData = {
  GitHub: [
    { id: 1, name: "Chanh Dai", handle: "@cndai", score: 694 },
    { id: 2, name: "Dan Abramov", handle: "@gaearon", score: 632 },
    { id: 3, name: "Traefik Labs", handle: "@traefik", score: 619 },
    { id: 4, name: "Arghya Das", handle: "@alfaorghya", score: 606 },
    { id: 5, name: "Twice", handle: "@pragmaTwice", score: 601 },
    { id: 6, name: "Sundar Pichai", handle: "@sundarpichai", score: 590 },
  ],
  HackerRank: [
    { id: 1, name: "Rahul Verma", handle: "@rahulv", score: 812 },
    { id: 2, name: "Ankit Singh", handle: "@ankit", score: 790 },
    { id: 3, name: "Neha Jain", handle: "@nehaj", score: 765 },
    { id: 4, name: "Saurabh Rao", handle: "@saurabh", score: 742 },
  ],
  GeeksForGeeks: [
    { id: 1, name: "Sneha Patel", handle: "@sneha", score: 755 },
    { id: 2, name: "Aman Gupta", handle: "@aman", score: 732 },
    { id: 3, name: "Ritu Sharma", handle: "@ritu", score: 701 },
    { id: 4, name: "Vikram Joshi", handle: "@vikram", score: 689 },
  ],
  Unstop: [
    { id: 1, name: "Kunal Mehta", handle: "@kunal", score: 680 },
    { id: 2, name: "Pooja Verma", handle: "@pooja", score: 662 },
    { id: 3, name: "Harsh Malhotra", handle: "@harsh", score: 640 },
    { id: 4, name: "Divya Singh", handle: "@divya", score: 625 },
  ],
  LinkedIn: [
    { id: 1, name: "Aditi Sharma", handle: "@aditisharma", score: 720 },
    { id: 2, name: "Mohit Bansal", handle: "@mohit", score: 702 },
    { id: 3, name: "Rohit Mehra", handle: "@rohit", score: 685 },
    { id: 4, name: "Sakshi Gupta", handle: "@sakshi", score: 670 },
  ],
};

const LeaderBoard = () => {
  const [activePlatform, setActivePlatform] = useState("GitHub");
  const [search, setSearch] = useState("");

  const data = leaderboardData[activePlatform]
    .filter(u => u.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => b.score - a.score);

  const topThree = data.slice(0, 3);
  const rest = data.slice(3);

  return (
    <div
      className="relative min-h-screen overflow-x-auto sm:overflow-visible bg-black text-white px-4 py-12 sm:py-20
      bg-[radial-gradient(circle_at_top,_rgba(20,184,166,0.15),_transparent_80%)]
      before:absolute before:inset-0
      before:bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)]
      before:bg-[size:40px_40px] before:opacity-20"
    >
      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-teal-400 font-mono">
            $ leaderboard
          </h1>
          <p className="mt-2 text-sm text-gray-400 font-mono">
            unified developer rankings
          </p>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-10">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="grep developer"
            className="w-full bg-black/70 border border-teal-400/30 rounded-md px-4 py-2 text-sm font-mono focus:outline-none focus:border-teal-400"
          />
        </div>

        {/* Tabs */}
        <div className="mb-14 px-1 flex gap-3 overflow-x-auto sm:overflow-visible justify-center no-scrollbar">
          {platforms.map(p => (
            <button
              key={p}
              onClick={() => setActivePlatform(p)}
              className={`whitespace-nowrap px-6 py-2 rounded-md text-xs font-mono border transition
                ${
                  activePlatform === p
                    ? "bg-teal-400 text-black border-teal-400"
                    : "border-teal-400/30 text-teal-300 hover:bg-teal-400/10"
                }`}
            >
              --{p.toLowerCase()}
            </button>
          ))}
        </div>

        {/* Top 3 Podium */}
        <div className="relative flex justify-center items-end gap-6 mb-16">
          {topThree.map((u, i) => {
            // Determine height and vertical offset
            let height = i === 0 ? "h-40 sm:h-40" : "h-30";
            let translateY = i === 0 ? "translate-y-0" : "translate-y-0";

            // Arrange #2 and #3 on sides, #1 in middle
            let orderClass = i === 0 ? "order-2" : i === 1 ? "order-1" : "order-3";

            return (
              <motion.div
                key={u.id}
                whileHover={{ y: -6 }}
                className={`relative ${orderClass} ${translateY} ${height} w-44 sm:w-52 bg-black/70 backdrop-blur border rounded-xl p-4 sm:p-5
                  ${i === 0 ? "border-teal-400 shadow-[0_0_28px_rgba(20,184,166,0.35)]" : "border-teal-400/30"}`}
              >
                <div className="absolute -top-3 -right-3 text-xs font-mono bg-black border border-teal-400/40 px-2 py-1 rounded">
                  #{i + 1}
                </div>

                <div className="text-lg font-semibold">{u.name}</div>
                <div className="text-xs text-gray-400 font-mono">{u.handle}</div>
                <div className="mt-4 sm:mt-6 text-3xl font-bold text-teal-400">{u.score}</div>
              </motion.div>
            );
          })}
        </div>

        {/* Remaining */}
        <div className="max-w-3xl mx-auto space-y-3">
          {rest.map((u, i) => (
            <motion.div
              key={u.id}
              whileHover={{ x: 8 }}
              className="flex items-center justify-between px-5 py-3 bg-black/60 border border-teal-400/20 rounded-lg"
            >
              <div className="flex items-center gap-4">
                <span className="text-gray-400 font-mono text-sm">
                  #{i + 4}
                </span>
                <div>
                  <div className="font-medium">{u.name}</div>
                  <div className="text-xs text-gray-400 font-mono">
                    {u.handle}
                  </div>
                </div>
              </div>

              <div className="font-bold text-teal-400">
                {u.score}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeaderBoard;
