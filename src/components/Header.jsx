import React, { useState, useRef, useEffect } from "react";
import logo from "../assets/images/credex.io_logo.png";

const Header = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50
        w-full pl-1 pr-1 sm:pl-10 sm:pr-10
        backdrop-blur-md bg-black/40
        border-b border-teal-400/40"
      >
        <div className="w-full px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          
          {/* Left */}
          <div className="flex items-center gap-2 sm:gap-3">
            <img
              src={logo}
              alt="Credex Logo"
              className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
            />
            <span className="text-teal-400 pl-2 font-mono text-lg sm:text-xl font-semibold tracking-wide">
              CREDEX<span className="text-gray-300">.io</span>
            </span>
          </div>

          {/* Right */}
          <div className="flex items-center gap-3 sm:gap-4">
            <span className="hidden sm:block text-base sm:text-lg font-mono font-medium text-gray-300">
              welcome, Back <span className="text-teal-400">Coder!!</span>
            </span>

            <div className="hidden sm:block h-4 w-px bg-teal-400/70" />

            {/* Profile */}
            <button
              onClick={() => setOpen((prev) => !prev)}
              className="relative focus:outline-none"
            >
              <img
                src="#"
                alt="Profile"
                className="w-9 h-9 sm:w-11 sm:h-11 rounded-full
                border border-teal-400
                shadow-[0_0_12px_rgba(45,212,191,0.7)]"
              />
              <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-teal-400 rounded-full border border-black" />
            </button>
          </div>
        </div>
      </header>

      {/* Dropdown container */}
      {open && (
        <div
          ref={dropdownRef}
          className="fixed top-[4.5rem] sm:top-[5.5rem] right-4 sm:right-10
          z-40 w-48 rounded-lg
          border border-teal-400/30
          bg-black/80 backdrop-blur-md
          shadow-lg font-mono text-sm text-gray-300"
        >
          <button className="w-full px-4 py-3 text-left hover:bg-teal-400/10 hover:text-teal-400 transition">
            Profile
          </button>
          <button className="w-full px-4 py-3 text-left hover:bg-teal-400/10 hover:text-teal-400 transition">
            Leaderboard
          </button>
          <button className="w-full px-4 py-3 text-left hover:bg-teal-400/10 hover:text-teal-400 transition">
            Settings
          </button>

          <div className="h-px bg-teal-400/20 my-1" />

          <button className="w-full px-4 py-3 text-left text-red-400 hover:bg-red-400/10 transition">
            Logout
          </button>
        </div>
      )}
    </>
  );
};

export default Header;
