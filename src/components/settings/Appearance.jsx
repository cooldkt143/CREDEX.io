import { useState } from "react";
import Card from "../card";

const fontMap = {
  Small: "text-sm",
  Medium: "text-base",
  Large: "text-lg",
};

export default function Appearance() {
  const [fontSize, setFontSize] = useState("Medium");
  const [appliedFont, setAppliedFont] = useState("Medium");

  return (
    <div className="space-y-5">
      {/* FONT SETTING CARD */}
      <Card title="Appearance">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold">Font Size</p>
            <p className="text-xs text-white/60">
              Controls how text is displayed across Credex
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={fontSize}
              onChange={(e) => setFontSize(e.target.value)}
              className="bg-black/40 border border-emerald-400/30 rounded px-3 py-2 font-mono"
            >
              <option>Small</option>
              <option>Medium</option>
              <option>Large</option>
            </select>

            {fontSize !== appliedFont && (
              <button
                onClick={() => setAppliedFont(fontSize)}
                className="btn-primary text-sm"
              >
                Select this font
              </button>
            )}
          </div>
        </div>
      </Card>

      {/* PREVIEW CARD */}
      <Card title="Preview">
        <div
          className={`space-y-4 font-mono ${fontMap[fontSize]}`}
        >
          <h3 className="text-xl font-bold">
            Credex.io
          </h3>

          <p className="font-semibold text-white/90">
            Developer credibility, measured clearly.
          </p>

          <p className="text-white/70 leading-relaxed">
            Credex.io helps developers understand their real world impact
            across platforms like GitHub, LeetCode, and HackerRank. Instead
            of vanity metrics, Credex focuses on consistency, skill depth,
            and growth over time.
          </p>

          <p className="text-white/60">
            Your Credex Score evolves as you learn, build, and contribute,
            giving recruiters and teams a transparent view of your progress.
          </p>
        </div>
      </Card>
    </div>
  );
}