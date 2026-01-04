import Card from "../card";

const activities = [
  {
    title: "Visited Resume Builder",
    details: [
      "Opened Resume Builder page",
      "Viewed available templates",
      "Edited personal information",
      "Previewed generated resume",
    ],
  },
  {
    title: "Checked ATS Score",
    details: [
      "Resume analyzed for ATS compliance",
      "ATS Score: 450",
      "Keywords matched: 12",
      "Sections optimized: 5",
    ],
  },
  {
    title: "Generated Resume",
    details: [
      "Generated Frontend Developer resume",
      "Template used: Modern Pro",
      "PDF downloaded: 12 Jan",
      "AI suggestions applied: 3",
    ],
  },
  {
    title: "Updated Profile",
    details: [
      "Profile picture updated",
      "Phone number updated",
      "GitHub & LinkedIn links added",
      "Skills section revised",
    ],
  },
];

export default function Activity() {
  return (
    <Card title="Your Activity">
      <div className="space-y-6 font-mono">
        {activities.map((a) => (
          <div
            key={a.title}
            className="bg-black/20 border border-emerald-400/30 rounded-lg p-4 hover:shadow-lg transition-shadow"
          >
            {/* Activity Title */}
            <h4 className="text-base sm:text-lg font-bold text-emerald-400 mb-2">
              {a.title}
            </h4>

            {/* Activity Details */}
            <ul className="space-y-1 pl-5">
              {a.details.map((d, i) => (
                <li
                  key={i}
                  className="text-white/90 text-sm sm:text-base flex items-start gap-2"
                >
                  <span className="text-emerald-400 font-semibold">•</span>
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Card>
  );
}