import React from "react";
import { useNavigate } from "react-router-dom";

import googleIcon from "../assets/icon/google.png";
import githubIcon from "../assets/icon/github.png";
import linkedinIcon from "../assets/icon/linkedin.png";

const Login = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed min-h-screen flex items-center justify-center bg-[#05070c] relative overflow-hidden px-4">

      {/* Animated background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(45,212,191,0.18),transparent_60%)]"></div>

      {/* Floating grid lines */}
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(transparent_95%,rgba(45,212,191,0.2)),linear-gradient(90deg,transparent_95%,rgba(45,212,191,0.2))] bg-[size:40px_40px] animate-[gridMove_20s_linear_infinite]"></div>

      {/* Login Card */}
      <div className="relative w-full max-w-[420px] rounded-xl p-6 sm:p-8 backdrop-blur-2xl bg-white/5 border border-teal-400/40 shadow-[0_0_40px_rgba(45,212,191,0.25)] font-mono
        animate-[fadeInUp_0.9s_ease-out]">

        {/* Fake editor header */}
        <div className="flex items-center gap-2 mb-5">
          <span className="w-3 h-3 rounded-full bg-red-500"></span>
          <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
          <span className="w-3 h-3 rounded-full bg-green-500"></span>
          <span className="ml-3 text-xs text-gray-400 animate-[blink_1.2s_infinite]">
            CREDEX.io
          </span>
        </div>

        {/* Animated heading */}
        <h2 className="text-teal-400 text-base sm:text-lg mb-5">
          {"// Log in to your developer account"}
          <span className="ml-1 animate-pulse">_</span>
        </h2>

        {/* Username */}
        <div className="mb-4 animate-[fadeIn_1.1s_ease-out]">
          <label className="text-gray-400 text-xs sm:text-sm block mb-1">
            username
          </label>
          <input
            type="text"
            placeholder="username"
            className="w-full bg-black/50 text-teal-300 px-3 py-2 rounded-md border border-teal-400/30 focus:outline-none focus:border-teal-400 placeholder:text-gray-600 text-sm transition"
          />
        </div>

        {/* Password */}
        <div className="mb-5 animate-[fadeIn_1.2s_ease-out]">
          <label className="text-gray-400 text-xs sm:text-sm block mb-1">
            password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full bg-black/50 text-teal-300 px-3 py-2 rounded-md border border-teal-400/30 focus:outline-none focus:border-teal-400 placeholder:text-gray-600 text-sm transition"
          />
        </div>

        {/* Login Button */}
        <button
          onClick={() => navigate("/home")}
          className="w-full py-2 rounded-md bg-teal-500/90 hover:bg-teal-400 text-black font-semibold transition shadow-[0_0_15px_rgba(45,212,191,0.6)] text-sm
          hover:scale-[1.02] active:scale-95"
        >
          login()
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5 text-gray-500 text-xs">
          <div className="flex-1 h-px bg-gray-700"></div>
          <span>or connect via</span>
          <div className="flex-1 h-px bg-gray-700"></div>
        </div>

        {/* Social Buttons */}
        <div className="flex flex-col gap-3">
          <button className="flex items-center gap-3 px-4 py-2 rounded-md bg-black/40 border border-gray-700 hover:border-teal-400 transition hover:translate-x-1">
            <img src={googleIcon} alt="Google" className="w-5 h-5" />
            <span className="text-sm text-gray-300">Continue with Google</span>
          </button>

          <button className="flex items-center gap-3 px-4 py-2 rounded-md bg-black/40 border border-gray-700 hover:border-teal-400 transition hover:translate-x-1">
            <img src={linkedinIcon} alt="LinkedIn" className="w-5 h-5" />
            <span className="text-sm text-gray-300">Continue with LinkedIn</span>
          </button>

          <button className="flex items-center gap-3 px-4 py-2 rounded-md bg-black/40 border border-gray-700 hover:border-teal-400 transition hover:translate-x-1">
            <img src={githubIcon} alt="GitHub" className="w-5 h-5" />
            <span className="text-sm text-gray-300">Continue with GitHub</span>
          </button>
        </div>

        {/* Sign up option */}
        <p className="mt-5 text-xs text-gray-500 text-center">
          {"// new here? "}
          <span
            className="text-teal-400 cursor-pointer hover:underline"
            onClick={() => navigate("/signup")}
          >
            create_account()
          </span>
        </p>
      </div>

      {/* Custom animations */}
      <style>
        {`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes blink {
            0%, 50%, 100% { opacity: 1; }
            25%, 75% { opacity: 0.9; }
          }
          @keyframes gridMove {
            from { background-position: 0 0; }
            to { background-position: 80px 80px; }
          }
        `}
      </style>
    </div>
  );
};

export default Login;