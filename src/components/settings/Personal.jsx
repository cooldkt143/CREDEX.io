import { useState } from "react";
import Card from "../card";

export default function Personal() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="h-full w-full">
      <Card title="Personal Details" className="mb-5">
        <div className="font-mono space-y-10">

          {/* TOP: Avatar + Security */}
          <div className="flex items-start gap-8">
            {/* Avatar */}
            <div className="flex flex-col items-center gap-3">
              <div className="w-28 h-28 rounded-full border border-emerald-400/40 bg-emerald-400/10 flex items-center justify-center text-2xl font-bold">
                DK
              </div>
            </div>

            {/* Security */}
            <div className="flex-1 max-w-sm border border-emerald-400/30 rounded-lg p-4 bg-black/30">
              <h4 className="text-sm font-semibold text-emerald-400 mb-2">
                Security
              </h4>

              {!showPassword ? (
                <button
                  onClick={() => setShowPassword(true)}
                  className="text-sm text-emerald-400 hover:underline"
                >
                  Change Password
                </button>
              ) : (
                <div className="space-y-3 mt-3">
                  <ReadRow label="Current password" value="••••••••" />
                  <ReadRow label="New password" value="••••••••" />
                  <ReadRow label="Confirm password" value="••••••••" />

                  <div className="flex gap-2 pt-2">
                    <button className="btn-primary text-sm">
                      Update
                    </button>
                    <button
                      onClick={() => setShowPassword(false)}
                      className="px-3 py-2 text-sm border border-emerald-400/30 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* BOTTOM: Profile Details */}
          <div className="space-y-5 text-sm">
            <ProfileRow label="Name" value="Deepak Kumar" />
            <ProfileRow label="Email" value="deepak@email.com" />
            <ProfileRow label="Phone" value="+91 9XXXXXXXXX" />
            <ProfileRow label="Role" value="Frontend Engineer" />

            <ProfileRow
              label="GitHub"
              value="github.com/username"
              link="https://github.com/username"
            />
            <ProfileRow
              label="LinkedIn"
              value="linkedin.com/in/username"
              link="https://linkedin.com/in/username"
            />
            <ProfileRow
              label="HackerRank"
              value="hackerrank.com/username"
              link="https://hackerrank.com/username"
            />

            <div className="pt-2">
              <p className="text-xs text-emerald-400 font-semibold tracking-wide mb-1">
                Description
              </p>
              <p className="leading-relaxed text-white/80 max-w-3xl">
                Frontend engineer focused on clean UI, performance, and scalable
                design systems. Enjoys building developer first products.
              </p>
            </div>
          </div>

        </div>

        {/* FOOTER */}
        <div className="mt-10 flex justify-end">
          <button className="btn-primary">
            Edit Profile
          </button>
        </div>
      </Card>
    </div>
  );
}

/* ---------- DISPLAY ROWS ---------- */

const ProfileRow = ({ label, value, link }) => (
  <div className="flex gap-6">
    <span className="w-32 text-xs text-emerald-400 font-semibold tracking-wide">
      {label}
    </span>
    {link ? (
      <a
        href={link}
        target="_blank"
        rel="noreferrer"
        className="text-emerald-400 hover:underline"
      >
        {value}
      </a>
    ) : (
      <span className="text-white/90">{value}</span>
    )}
  </div>
);

const ReadRow = ({ label, value }) => (
  <div className="flex justify-between text-xs">
    <span className="text-emerald-400">{label}</span>
    <span>{value}</span>
  </div>
);