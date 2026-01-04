import { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/settings/Sidebar";

import Personal from "../components/settings/Personal";
import Subscription from "../components/settings/Subscription";
import Activity from "../components/settings/Activity";
import Downloads from "../components/settings/Downloads";
import Appearance from "../components/settings/Appearance";

export default function Settings() {
  const [active, setActive] = useState("personal");

  return (
    <div
      className="relative min-h-screen overflow-x-hidden bg-black text-white
      bg-[radial-gradient(circle_at_top,_rgba(20,184,166,0.15),_transparent_150%)]
      before:absolute before:inset-0
      before:bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)]
      before:bg-[size:40px_40px] before:opacity-20"
    >
      <Header />

      {/* Layout */}
      <div className="flex h-screen pt-16 sm:pt-20 relative z-10">
        {/* Sidebar (fixed width) */}
        <div className="w-64 shrink-0">
          <Sidebar active={active} setActive={setActive} />
        </div>

        {/* Active Content (takes remaining width) */}
        <main className="flex-1 min-w-0 p-5  overflow-y-auto">
          {active === "personal" && <Personal />}
          {active === "subscription" && <Subscription />}
          {active === "activity" && <Activity />}
          {active === "downloads" && <Downloads />}
          {active === "appearance" && <Appearance />}
        </main>
      </div>
    </div>
  );
}
