import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  onAuthStateChanged
} from "firebase/auth";

import { auth, googleProvider, githubProvider, linkedinProvider } from "../firebase";

import googleIcon from "../assets/icon/google.png";
import githubIcon from "../assets/icon/github.png";
import linkedinIcon from "../assets/icon/linkedin.png";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) navigate("/home");
    });
    return () => unsub();
  }, [navigate]);

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/home");
    } catch (err) {
      alert(err.message);
    }
  };

  const socialLogin = async (provider) => {
    try {
      await signInWithPopup(auth, provider);
      navigate("/home");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="fixed min-h-screen flex items-center justify-center bg-[#05070c] relative overflow-hidden px-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(45,212,191,0.18),transparent_60%)]"></div>
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(transparent_95%,rgba(45,212,191,0.2)),linear-gradient(90deg,transparent_95%,rgba(45,212,191,0.2))] bg-[size:40px_40px] animate-[gridMove_20s_linear_infinite]"></div>

      <div className="relative w-full max-w-[450px] rounded-xl p-6 sm:p-8 backdrop-blur-2xl bg-white/5 border border-teal-400/40 shadow-[0_0_40px_rgba(45,212,191,0.25)] font-mono">
        <div className="flex items-center gap-2 mb-5">
          <span className="w-3 h-3 rounded-full bg-red-500"></span>
          <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
          <span className="w-3 h-3 rounded-full bg-green-500"></span>
          <span className="ml-3 text-xs text-gray-400">CREDEX.io</span>
        </div>

        <h2 className="text-teal-400 text-base sm:text-lg mb-5">// Log in to your developer account</h2>

        {/* Username */}
        <div className="mb-4 animate-[fadeIn_1.1s_ease-out]">
          <label className="text-gray-400 text-xs sm:text-sm block mb-1">username</label>
          <input
            type="text"
            placeholder="username"
            className="w-full bg-black/50 text-teal-300 px-3 py-2 rounded-md border border-teal-400/30 focus:outline-none focus:border-teal-400 placeholder:text-gray-600 text-sm transition"
          />
        </div>

        {/* Password */}
        <div className="mb-5 animate-[fadeIn_1.2s_ease-out]">
          <label className="text-gray-400 text-xs sm:text-sm block mb-1">password</label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full bg-black/50 text-teal-300 px-3 py-2 rounded-md border border-teal-400/30 focus:outline-none focus:border-teal-400 placeholder:text-gray-600 text-sm transition"
          />
        </div>

        <button
          onClick={handleLogin}
          className="w-full py-2 rounded-md bg-teal-500/90 text-black font-semibold mb-5 text-sm active:scale-95 transition shadow-[0_0_15px_rgba(45,212,191,0.6)]"
        >
          login()
        </button>

        {/* Social Buttons in single row */}
        <div className="flex gap-3 justify-center">
          <button 
            onClick={() => socialLogin(googleProvider)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-black/40 border border-gray-700 hover:border-teal-400 transition hover:translate-y-[-1px]">
            <img src={googleIcon} alt="Google" className="w-5 h-5" />
            <span className="text-sm text-gray-300">Google</span>
          </button>
          <button 
            onClick={() => socialLogin(linkedinProvider)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-black/40 border border-gray-700 hover:border-teal-400 transition hover:translate-y-[-1px]">
            <img src={linkedinIcon} alt="LinkedIn" className="w-5 h-5" />
            <span className="text-sm text-gray-300">LinkedIn</span>
          </button>
          <button 
            onClick={() => socialLogin(githubProvider)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-black/40 border border-gray-700 hover:border-teal-400 transition hover:translate-y-[-1px]">
            <img src={githubIcon} alt="GitHub" className="w-5 h-5" />
            <span className="text-sm text-gray-300">GitHub</span>
          </button>
        </div>

        <p className="mt-5 text-xs text-gray-500 text-center">
          // new here?{" "}
          <span onClick={() => navigate("/signup")} className="text-teal-400 cursor-pointer">
            create_account()
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
