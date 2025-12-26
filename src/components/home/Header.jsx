import React from "react";
import logo from "../../assets/images/credex.io_logo.png";

const Header = () => {
  return (
    <header className="w-full pl-1 pr-1 sm:pl-10 sm:pr-10 backdrop-blur-md bg-black/40 border-b border-teal-400/40">
      <div className="w-full px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
        
        {/* Left: Logo + Project Name */}
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

        {/* Right: Welcome text + Profile */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Hide welcome text on very small screens */}
          <span className="hidden sm:block text-base sm:text-lg font-mono font-medium text-gray-300">
            welcome, Back <span className="text-teal-400">Coder!!</span>
          </span>

          <div className="hidden sm:block h-4 w-px bg-teal-400/70 " />

          <div className="relative ">
            <img
              src="#"
              alt="Profile"
              className="w-9 h-9 sm:w-11 sm:h-11 rounded-full border border-teal-400 shadow-[0_0_12px_rgba(45,212,191,0.7)]"
            />
            <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-teal-400 rounded-full border border-black" />
          </div>
        </div>

      </div>
    </header>
  );
};

export default Header;