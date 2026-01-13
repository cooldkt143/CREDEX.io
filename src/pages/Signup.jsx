import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  onAuthStateChanged
} from "firebase/auth";

import { auth, googleProvider, githubProvider, linkedinProvider } from "../firebase";

import googleIcon from "../assets/icon/google.png";
import githubIcon from "../assets/icon/github.png";
import linkedinIcon from "../assets/icon/linkedin.png";

const Signup = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) navigate("/home");
    });
    return () => unsub();
  }, [navigate]);

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/home");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSocialSignup = async (provider) => {
    try {
      await signInWithPopup(auth, provider);
      navigate("/home");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#05070c] relative overflow-hidden px-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(45,212,191,0.18),transparent_60%)]"></div>
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(transparent_95%,rgba(45,212,191,0.25)),linear-gradient(90deg,transparent_95%,rgba(45,212,191,0.25))] bg-[size:42px_42px] animate-[gridMove_22s_linear_infinite]"></div>

      <div className="relative w-full max-w-[440px] rounded-xl p-6 sm:p-8 backdrop-blur-2xl bg-white/5 border border-teal-400/40 shadow-[0_0_45px_rgba(45,212,191,0.25)] font-mono animate-[fadeInUp_0.9s_ease-out]">
        <div className="flex items-center gap-2 mb-5">
          <span className="w-3 h-3 rounded-full bg-red-500"></span>
          <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
          <span className="w-3 h-3 rounded-full bg-green-500"></span>
          <span className="ml-3 text-xs text-gray-400 animate-[blink_1.3s_infinite]">
            CREDEX.io
          </span>
        </div>

        {/* Heading */}
        <h2 className="text-teal-400 text-base sm:text-lg mb-5">// create your developer account <span className="ml-1 animate-pulse">_</span></h2>

        {/* Name */}
        <div className="mb-4 animate-[fadeIn_1.1s_ease-out]">
          <label className="text-gray-400 text-xs sm:text-sm block mb-1">name</label>
          <input
            type="text"
            placeholder="your_name"
            className="w-full bg-black/50 text-teal-300 px-3 py-2 rounded-md border border-teal-400/30 focus:outline-none focus:border-teal-400 placeholder:text-gray-600 text-sm transition"
          />
        </div>

        {/* Email */}
        <div className="mb-4 animate-[fadeIn_1.2s_ease-out]">
          <label className="text-gray-400 text-xs sm:text-sm block mb-1">email</label>
          <input
            type="email"
            placeholder="dev@email.com"
            className="w-full bg-black/50 text-teal-300 px-3 py-2 rounded-md border border-teal-400/30 focus:outline-none focus:border-teal-400 placeholder:text-gray-600 text-sm transition"
          />
        </div>

        {/* Password */}
        <div className="mb-4 animate-[fadeIn_1.3s_ease-out]">
          <label className="text-gray-400 text-xs sm:text-sm block mb-1">password</label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full bg-black/50 text-teal-300 px-3 py-2 rounded-md border border-teal-400/30 focus:outline-none focus:border-teal-400 placeholder:text-gray-600 text-sm transition"
          />
        </div>

        {/* Confirm Password */}
        <div className="mb-5 animate-[fadeIn_1.4s_ease-out]">
          <label className="text-gray-400 text-xs sm:text-sm block mb-1">confirm_password</label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full bg-black/50 text-teal-300 px-3 py-2 rounded-md border border-teal-400/30 focus:outline-none focus:border-teal-400 placeholder:text-gray-600 text-sm transition"
          />
        </div>

        <button
          onClick={handleSignup}
          className="w-full py-2 rounded-md bg-teal-500/90 hover:bg-teal-400 text-black font-semibold transition shadow-[0_0_18px_rgba(45,212,191,0.6)] text-sm hover:scale-[1.02] active:scale-95 mb-5"
        >
          create_account()
        </button>

        <div className="flex gap-3 justify-center">
          <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-black/40 border border-gray-700 hover:border-teal-400 transition hover:translate-y-[-1px]">
            <img src={googleIcon} alt="Google" className="w-5 h-5" />
            <span className="text-sm text-gray-300">Google</span>
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-black/40 border border-gray-700 hover:border-teal-400 transition hover:translate-y-[-1px]">
            <img src={linkedinIcon} alt="LinkedIn" className="w-5 h-5" />
            <span className="text-sm text-gray-300">LinkedIn</span>
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-black/40 border border-gray-700 hover:border-teal-400 transition hover:translate-y-[-1px]">
            <img src={githubIcon} alt="GitHub" className="w-5 h-5" />
            <span className="text-sm text-gray-300">GitHub</span>
          </button>
        </div>

        <p className="mt-5 text-xs text-gray-500 text-center">
          // already have an account?{" "}
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