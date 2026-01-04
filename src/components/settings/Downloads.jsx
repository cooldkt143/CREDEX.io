import Card from "../card";
import { Eye, Download } from "lucide-react";

const downloads = [
  { name: "Frontend_Resume.pdf", date: "12 Jan" },
  { name: "Internship_Resume.pdf", date: "08 Jan" },
  { name: "ATS_Optimized_Resume.pdf", date: "02 Jan" },
  { name: "Backend_Resume.pdf", date: "22 Dec" },
  { name: "Fullstack_Resume.pdf", date: "18 Dec" },
  { name: "Data_Science_Resume.pdf", date: "15 Dec" },
  { name: "DevOps_Resume.pdf", date: "10 Dec" },
  { name: "UI_UX_Resume.pdf", date: "05 Dec" },
];

export default function Downloads() {
  return (
    <Card title="Resume Downloads">
      <div className="space-y-4 font-mono">
        {downloads.map((d) => (
          <div
            key={d.name}
            className="flex items-center justify-between p-4 bg-black/20 border border-emerald-400/30 rounded-lg hover:shadow-md transition-shadow"
          >
            {/* Resume Name */}
            <div className="flex flex-col">
              <span className="font-semibold text-white/90">{d.name}</span>
              <span className="text-xs text-emerald-400">{d.date}</span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button className="flex items-center gap-1 px-3 py-1 bg-black/40 border border-emerald-400/30 rounded text-sm text-emerald-400 hover:bg-emerald-400/10 transition">
                <Eye size={16} /> Preview
              </button>
              <button className="flex items-center gap-1 px-3 py-1 bg-black/40 border border-emerald-400/30 rounded text-sm text-emerald-400 hover:bg-emerald-400/10 transition">
                <Download size={16} /> Download
              </button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}