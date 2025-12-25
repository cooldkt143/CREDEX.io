import React from "react";
import { useNavigate } from "react-router-dom";

import googleIcon from "../assets/icon/google.png";
import githubIcon from "../assets/icon/github.png";
import linkedinIcon from "../assets/icon/linkedin.png";

const Signup = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#05070c] relative overflow-hidden px-4">
      
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(45,212,191,0.15),transparent_60%)]"></div>

      {/* Signup Card */}
      <div className="relative w-full max-w-[440px] rounded-xl p-6 sm:p-8 backdrop-blur-2xl bg-white/5 border border-teal-400/40 shadow-[0_0_45px_rgba(45,212,191,0.25)] font-mono">
        
        {/* Fake editor header */}
        <div className="flex items-center gap-2 mb-5">
          <span className="w-3 h-3 rounded-full bg-red-500"></span>
          <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
          <span className="w-3 h-3 rounded-full bg-green-500"></span>
          <span className="ml-3 text-xs text-gray-400">CREDEX.io</span>
        </div>

        <h2 className="text-teal-400 text-base sm:text-lg mb-5">
          {"// create your developer account"}
        </h2>

        {/* Name */}
        <div className="mb-4">
          <label className="text-gray-400 text-xs sm:text-sm block mb-1">
            name
          </label>
          <input
            type="text"
            placeholder="your_name"
            className="w-full bg-black/50 text-teal-300 px-3 py-2 rounded-md border border-teal-400/30 focus:outline-none focus:border-teal-400 placeholder:text-gray-600 text-sm"
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="text-gray-400 text-xs sm:text-sm block mb-1">
            email
          </label>
          <input
            type="email"
            placeholder="dev@email.com"
            className="w-full bg-black/50 text-teal-300 px-3 py-2 rounded-md border border-teal-400/30 focus:outline-none focus:border-teal-400 placeholder:text-gray-600 text-sm"
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="text-gray-400 text-xs sm:text-sm block mb-1">
            password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full bg-black/50 text-teal-300 px-3 py-2 rounded-md border border-teal-400/30 focus:outline-none focus:border-teal-400 placeholder:text-gray-600 text-sm"
          />
        </div>

        {/* Confirm Password */}
        <div className="mb-5">
          <label className="text-gray-400 text-xs sm:text-sm block mb-1">
            confirm_password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full bg-black/50 text-teal-300 px-3 py-2 rounded-md border border-teal-400/30 focus:outline-none focus:border-teal-400 placeholder:text-gray-600 text-sm"
          />
        </div>

        {/* Signup Button */}
        <button className="w-full py-2 rounded-md bg-teal-500/90 hover:bg-teal-400 text-black font-semibold transition shadow-[0_0_18px_rgba(45,212,191,0.55)] text-sm"
          onClick={() => navigate("/details")}
        >
          create_account()
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5 text-gray-500 text-xs">
          <div className="flex-1 h-px bg-gray-700"></div>
          <span>or sign up with</span>
          <div className="flex-1 h-px bg-gray-700"></div>
        </div>

        {/* Social Signup */}
        <div className="flex flex-col gap-3">
          <button className="flex items-center gap-3 px-4 py-2 rounded-md bg-black/40 border border-gray-700 hover:border-teal-400 transition">
            <img src={googleIcon} alt="Google" className="w-5 h-5" />
            <span className="text-sm text-gray-300">Sign up with Google</span>
          </button>

          <button className="flex items-center gap-3 px-4 py-2 rounded-md bg-black/40 border border-gray-700 hover:border-teal-400 transition">
            <img src={linkedinIcon} alt="LinkedIn" className="w-5 h-5" />
            <span className="text-sm text-gray-300">Sign up with LinkedIn</span>
          </button>

          <button className="flex items-center gap-3 px-4 py-2 rounded-md bg-black/40 border border-gray-700 hover:border-teal-400 transition">
            <img src={githubIcon} alt="GitHub" className="w-5 h-5" />
            <span className="text-sm text-gray-300">Sign up with GitHub</span>
          </button>
        </div>

        {/* Back to login */}
        <p className="mt-5 text-xs text-gray-500 text-center">
          {"// already have an account? "}
          <span
            className="text-teal-400 cursor-pointer hover:underline"
            onClick={() => navigate("/login")}
          >
            login()
          </span>
        </p>
      </div>
    </div>
  );
};

export default Signup;