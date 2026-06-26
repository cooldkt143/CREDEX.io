import React from "react";
import { motion } from "framer-motion";
import {
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineLocationMarker,
  HiOutlineDocumentAdd,
  HiTrendingUp,
} from "react-icons/hi";
import {
  FaGithub,
  FaLinkedin,
  FaHackerrank,
  FaStar,
  FaTrophy,
  FaLightbulb,
} from "react-icons/fa";
import Header from "../components/Header";
import gfgIcon from "../assets/icon/gfg.png";
import { auth } from "../firebase";
import { API_URL } from "../config";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState, useRef } from "react";

/* Animations */
const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

/* Shared Card Style */
const card =
  "bg-black/60 border border-teal-400/20 rounded-2xl backdrop-blur-md shadow-[0_0_20px_rgba(20,184,166,0.08)] hover:shadow-[0_0_32px_rgba(20,184,166,0.18)] transition";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [dbProfile, setDbProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modal Editing States
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editSkills, setEditSkills] = useState("");
  const [editEducation, setEditEducation] = useState([]);
  const [editDescription, setEditDescription] = useState("");

  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/api/auth/profile/${user.uid}`);
        if (res.ok) {
          const data = await res.json();
          setDbProfile(data);
        } else {
          // Initialize profile in DB
          await fetch(`${API_URL}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              uid: user.uid,
              email: user.email || "",
              displayName: user.displayName || "",
              photoURL: user.photoURL || ""
            })
          });
          const retryRes = await fetch(`${API_URL}/api/auth/profile/${user.uid}`);
          if (retryRes.ok) {
            const data = await retryRes.json();
            setDbProfile(data);
          }
        }
      } catch (err) {
        console.error("Failed to load MongoDB profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const openEditModal = () => {
    setEditName(dbProfile?.displayName || user?.displayName || "");
    setEditPhone(dbProfile?.phone || "");
    setEditLocation(dbProfile?.location || "IN");
    setEditSkills(dbProfile?.skills?.join(", ") || "");
    setEditEducation(dbProfile?.education || []);
    setEditDescription(dbProfile?.description || "");
    setIsEditing(true);
  };

  const handleSaveProfile = async () => {
    try {
      const skillsArray = editSkills.split(",")
        .map(s => s.trim())
        .filter(s => s.length > 0);
        
      const res = await fetch(`${API_URL}/api/auth/profile/${user.uid}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName: editName,
          phone: editPhone,
          location: editLocation,
          skills: skillsArray,
          education: editEducation,
          description: editDescription
        })
      });
      if (res.ok) {
        const updatedRes = await fetch(`${API_URL}/api/auth/profile/${user.uid}`);
        if (updatedRes.ok) {
          const data = await updatedRes.json();
          setDbProfile(data);
        }
        setIsEditing(false);
      } else {
        alert("Failed to update profile");
      }
    } catch (err) {
      alert("Error saving profile details: " + err.message);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setIsUploading(true);
      const res = await fetch(`${API_URL}/api/auth/profile/${user.uid}/upload-resume`, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setDbProfile(prev => ({
          ...prev,
          resume: data.resume,
          profileCompletion: data.profileCompletion
        }));
      } else {
        alert("Failed to upload resume");
      }
    } catch (err) {
      alert("Error uploading resume: " + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current.click();
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeUp}
      className="
        fixed inset-0 pt-20 px-5 sm:px-10 space-y-6
        bg-[#05080F] text-slate-200 overflow-y-auto custom-scrollbar
        bg-[radial-gradient(circle_at_top,_rgba(20,184,166,0.14),_transparent_105%)]
        before:absolute before:inset-0
        before:bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)]
        before:bg-[size:36px_36px]
        before:opacity-20
        before:pointer-events-none
      "
    >
      <Header />

      {loading ? (
        <div className="flex h-[60vh] items-center justify-center font-mono text-teal-400">
          <span className="animate-pulse">// loading_profile_data_from_mongodb ...</span>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto w-full space-y-6 pb-12 z-10 relative">
          
          {/* ================= HERO HEADER CARD ================= */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full bg-gradient-to-br from-slate-950/80 to-slate-900/60 border border-teal-400/20 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-[0_0_30px_rgba(20,184,166,0.08)] flex flex-col md:flex-row gap-6 items-center justify-between"
          >
            <div className="flex flex-col md:flex-row gap-6 items-center text-center md:text-left flex-1 w-full">
              {/* Animated pulses around profile avatar */}
              <div className="relative">
                <motion.div
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 rounded-full border border-teal-400/30 blur-sm pointer-events-none"
                />
                <div className="w-20 h-20 rounded-full border-2 border-teal-400 overflow-hidden flex items-center justify-center shadow-[0_0_20px_rgba(20,184,166,0.5)] bg-slate-950">
                  {user?.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-teal-400 font-mono text-3xl font-bold">
                      {(dbProfile?.displayName || user?.displayName)?.charAt(0).toUpperCase() || "U"}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex-1 space-y-2">
                <div className="space-y-1">
                  <h1 className="text-2xl sm:text-3xl font-extrabold font-mono bg-gradient-to-r from-teal-300 via-teal-400 to-emerald-400 bg-clip-text text-transparent">
                    {dbProfile?.displayName || user?.displayName || "Anonymous User"}
                  </h1>
                  <p className="text-sm text-teal-400/80 font-mono tracking-wider">
                    {dbProfile?.username || generateHandle(user)}
                  </p>
                </div>

                {/* Bio / Description display */}
                <div className="bg-black/40 border border-slate-800/80 rounded-lg p-3 max-w-2xl font-mono text-xs sm:text-sm text-slate-300/90 leading-relaxed shadow-inner">
                  <span className="text-teal-400 mr-2">$ cat bio.txt</span>
                  {dbProfile?.description ? (
                    <p className="mt-1 font-sans text-slate-300">{dbProfile.description}</p>
                  ) : (
                    <span className="text-slate-600">// No description added. Click "edit_profile" to write a bio.</span>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Completion indicator and edit button */}
            <div className="flex flex-col items-center sm:items-end justify-center gap-3">
              <div className="text-right font-mono text-xs text-slate-400">
                completion_score: <span className="text-teal-400 font-bold">{dbProfile?.profileCompletion || 0}%</span>
              </div>
              <button
                onClick={openEditModal}
                className="px-5 py-2.5 rounded-lg bg-teal-400 text-black font-mono font-bold hover:bg-teal-300 active:scale-95 transition shadow-[0_0_15px_rgba(45,212,191,0.4)] text-xs"
              >
                edit_profile()
              </button>
            </div>
          </motion.div>

          {/* ================= MAIN COLUMN DETAILS GRID ================= */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="grid md:grid-cols-2 gap-6"
          >
            {/* ====== LEFT COLUMN ====== */}
            <div className="space-y-6">
              
              {/* PERSONAL DETAILS CARD */}
              <Card title="profile_details">
                <h4 className="font-mono text-teal-400 mt-2 mb-2 text-xs">// contact_information</h4>
                
                <InfoRow icon={<HiOutlineMail />} text={`email = "${dbProfile?.email || user?.email || ""}"`} />
                <InfoRow
                  icon={<HiOutlinePhone />}
                  text={`phone = ${dbProfile?.phone ? `"${dbProfile.phone}"` : "null"}`}
                  onUpdate={openEditModal}
                />
                <InfoRow
                  icon={<HiOutlineLocationMarker />}
                  text={`location = "${dbProfile?.location || "IN"}"`}
                  onUpdate={openEditModal}
                />
              </Card>

              {/* ACTIVE RESUME UPLOAD CARD */}
              <Card title="resume_vault">
                <h4 className="font-mono text-teal-400 mt-2 mb-2 text-xs">// credentials_file</h4>
                
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeUpload}
                  className="hidden"
                />

                {dbProfile?.resume ? (
                  <div className="bg-black/30 border border-teal-400/20 rounded-xl p-4 flex items-center justify-between gap-4 mt-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2 bg-teal-400/10 border border-teal-400/20 rounded-lg text-teal-400">
                        <HiOutlineDocumentAdd size={24} className="animate-pulse" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-white font-mono truncate">{dbProfile.resume.filename}</p>
                        <p className="text-[10px] text-slate-500 font-mono">// status: active</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <a
                        href={`${API_URL}/${dbProfile.resume.file_path}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-teal-400 hover:border-teal-400 transition"
                      >
                        view()
                      </a>
                      <button
                        onClick={triggerFileUpload}
                        disabled={isUploading}
                        className="px-2.5 py-1.5 rounded bg-teal-400 text-black text-[10px] font-mono hover:bg-teal-300 transition"
                      >
                        {isUploading ? "uploading..." : "replace()"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={triggerFileUpload}
                    className="border-2 border-dashed border-slate-800 hover:border-teal-400/40 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition bg-black/10 hover:bg-teal-400/5 mt-2"
                  >
                    <HiOutlineDocumentAdd size={32} className="text-slate-600 mb-2 group-hover:text-teal-400" />
                    <p className="text-xs text-slate-300 font-mono text-center">
                      {isUploading ? "uploading_file_to_vault..." : "click_to_upload_resume()"}
                    </p>
                    <p className="text-[10px] text-slate-600 font-mono mt-1">PDF, DOC, DOCX up to 5MB</p>
                  </div>
                )}
              </Card>
            </div>

            {/* ====== RIGHT COLUMN ====== */}
            <div className="space-y-6">
              
              {/* TECH STACK CARD */}
              <Card title="verified_tech_stack">
                <h4 className="font-mono text-teal-400 mt-2 mb-2 text-xs flex justify-between items-center">
                  <span>// programming_languages_&_frameworks</span>
                  <span onClick={openEditModal} className="text-xs text-teal-400 cursor-pointer hover:underline">edit()</span>
                </h4>
                <div className="flex flex-wrap gap-2.5 mt-2">
                  {dbProfile?.skills && dbProfile.skills.length > 0 ? (
                    dbProfile.skills.map((s, i) => (
                      <span key={i} className="skill-chip">
                        {s}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-600 font-mono text-xs">// no_skills_loaded. Add skills using edit_profile.</span>
                  )}
                </div>
              </Card>

              {/* ACADEMIC PROFILE CARD */}
              <Card title="academic_milestones">
                <h4 className="font-mono text-teal-400 mt-2 mb-2 text-xs flex justify-between items-center">
                  <span>// education_timeline</span>
                  <span onClick={openEditModal} className="text-xs text-teal-400 cursor-pointer hover:underline">edit()</span>
                </h4>
                {dbProfile?.education && dbProfile.education.length > 0 ? (
                  <div className="space-y-4 mt-3">
                    {dbProfile.education.map((e, i) => (
                      <div key={i} className="relative pl-6 border-l border-teal-400/20">
                        {/* Glowing timeline node */}
                        <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-teal-400 shadow-[0_0_8px_rgba(20,184,166,0.8)]" />
                        <p className="font-mono text-white text-sm font-semibold">{e.degree}</p>
                        <p className="text-xs text-slate-400 font-mono">{e.institution}</p>
                        <p className="text-[10px] text-slate-500 font-mono mt-0.5">{e.year}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-600 font-mono mt-2">// no_education_added</p>
                )}
              </Card>
            </div>
          </motion.div>
        </div>
      )}

      {/* EDIT MODAL */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-2xl bg-[#090D16] border border-teal-400/30 rounded-2xl p-6 font-mono max-h-[85vh] overflow-y-auto custom-scrollbar"
          >
            <h3 className="text-teal-400 text-base mb-5 flex items-center justify-between border-b border-teal-400/20 pb-3">
              <span>// edit_profile_details</span>
              <button
                onClick={() => setIsEditing(false)}
                className="text-slate-400 hover:text-teal-400 font-sans text-xl"
              >
                &times;
              </button>
            </h3>

            <div className="space-y-4 text-left">
              <div>
                <label className="text-slate-400 text-xs block mb-1">display_name</label>
                <input
                  type="text"
                  className="w-full bg-black/40 border border-teal-400/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-teal-400 text-sm font-sans"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
              </div>

              <div>
                <label className="text-slate-400 text-xs block mb-1">short_bio / description</label>
                <textarea
                  rows={3}
                  className="w-full bg-black/40 border border-teal-400/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-teal-400 text-sm font-sans resize-none font-sans"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="e.g. Gen AI developer building full stack apps..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 text-xs block mb-1">phone_number</label>
                  <input
                    type="text"
                    className="w-full bg-black/40 border border-teal-400/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-teal-400 text-sm font-sans"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    placeholder="e.g. +91 9876543210"
                  />
                </div>
                <div>
                  <label className="text-slate-400 text-xs block mb-1">location_code</label>
                  <input
                    type="text"
                    className="w-full bg-black/40 border border-teal-400/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-teal-400 text-sm font-sans"
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    placeholder="e.g. IN, US"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 text-xs block mb-1">tech_stack (comma separated)</label>
                <input
                  type="text"
                  className="w-full bg-black/40 border border-teal-400/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-teal-400 text-sm font-sans"
                  value={editSkills}
                  onChange={(e) => setEditSkills(e.target.value)}
                  placeholder="javascript, react, python, mongodb"
                />
              </div>

              <div>
                <label className="text-slate-400 text-xs block mb-1 flex justify-between items-center">
                  <span>education_history</span>
                  <button
                    onClick={() => setEditEducation([...editEducation, { degree: "", institution: "", year: "" }])}
                    className="text-[10px] text-teal-400 hover:underline"
                  >
                    + add_degree()
                  </button>
                </label>

                <div className="space-y-3 mt-1">
                  {editEducation.map((edu, idx) => (
                    <div key={idx} className="flex gap-2 items-center bg-black/20 p-3 rounded-lg border border-slate-900">
                      <div className="flex-1 space-y-2">
                        <input
                          type="text"
                          placeholder="Degree Name"
                          className="w-full bg-black/40 border border-teal-400/10 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-teal-400 font-sans"
                          value={edu.degree}
                          onChange={(e) => {
                            const updated = [...editEducation];
                            updated[idx].degree = e.target.value;
                            setEditEducation(updated);
                          }}
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="Institution"
                            className="w-full bg-black/40 border border-teal-400/10 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-teal-400 font-sans"
                            value={edu.institution}
                            onChange={(e) => {
                              const updated = [...editEducation];
                              updated[idx].institution = e.target.value;
                              setEditEducation(updated);
                            }}
                          />
                          <input
                            type="text"
                            placeholder="Year (e.g. 2022 - 2026)"
                            className="w-full bg-black/40 border border-teal-400/10 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-teal-400 font-sans"
                            value={edu.year}
                            onChange={(e) => {
                              const updated = [...editEducation];
                              updated[idx].year = e.target.value;
                              setEditEducation(updated);
                            }}
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => setEditEducation(editEducation.filter((_, i) => i !== idx))}
                        className="text-red-400 hover:text-red-500 text-xs px-2 font-sans"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-6 border-t border-teal-400/20 pt-4">
              <button
                onClick={handleSaveProfile}
                className="flex-1 py-2 bg-teal-400 text-black font-semibold rounded-lg hover:bg-teal-300 transition text-sm text-center"
              >
                save_profile()
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-slate-700 text-slate-400 rounded-lg hover:border-slate-500 transition text-sm"
              >
                cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

const generateHandle = (user) => {
  if (!user) return "@user";

  if (user.email) {
    const nameFromEmail = user.email.split("@")[0];
    return `@${nameFromEmail.toLowerCase()}`;
  }

  const base =
    user.displayName?.replace(/\s+/g, "").toLowerCase() || "user";
  const random = Math.floor(100 + Math.random() * 900); // 3-digit
  return `@${base}${random}`;
};

/* Components */
const Card = ({ title, children }) => (
  <motion.div variants={fadeUp} className={`${card} p-5 w-full`}>
    <h3 className="font-mono text-teal-400 mb-3">{title}</h3>
    {children}
  </motion.div>
);

const InfoRow = ({ icon, text, onUpdate }) => (
  <div className="flex items-center gap-3 text-sm text-slate-400 font-mono mt-2">
    <span className="text-teal-400">{icon}</span>
    {text}
    {onUpdate && (
      <span onClick={onUpdate} className="ml-auto text-teal-400 cursor-pointer hover:underline">
        update()
      </span>
    )}
  </div>
);

const Badge = ({ icon, text }) => (
  <span className="text-xs px-2 py-1 rounded-full bg-teal-400/15 text-teal-400 font-mono flex items-center gap-1">
    {icon} {text}
  </span>
);

export default Profile;