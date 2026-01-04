import { useState } from "react";
import Card from "../card";

export default function Subscription() {
  const [plan, setPlan] = useState("Free");
  const [changeMode, setChangeMode] = useState(false);

  return (
    <div className="w-full h-full">
      <Card title="Subscription" className="mb-5">
        {/* ACTIVE PLAN */}
        <div className="mb-6 font-mono flex items-center justify-between">
          <div>
            <span className="text-xs text-emerald-400 font-semibold tracking-wide">
              Active Plan
            </span>
            <p className="text-lg font-bold text-white mt-1">
              {plan}
            </p>
          </div>

          {!changeMode && (
            <button
              onClick={() => setChangeMode(true)}
              className="text-sm text-emerald-400 hover:underline"
            >
              Change Plan
            </button>
          )}
        </div>

        {/* PLANS */}
        <div className="grid grid-cols-3 gap-6 h-[55vh]">
          <PlanBox
            title="Free"
            price="₹0"
            active={plan === "Free"}
            selectable={changeMode}
            onSelect={() => setPlan("Free")}
            features={[
              "Basic profile access",
              "Limited AI queries per month",
              "Standard resume builder",
              "Community access",
              "Public profile visibility",
              "Manual data entry",
              "Email notifications",
              "Basic analytics",
            ]}
          />

          <PlanBox
            title="Monthly"
            price="₹299 / month"
            active={plan === "Monthly"}
            selectable={changeMode}
            onSelect={() => setPlan("Monthly")}
            features={[
              "Unlimited AI usage",
              "Advanced resume & ATS scan",
              "Private profile mode",
              "Priority email support",
              "Skill gap insights",
              "Auto profile optimization",
              "Credibility score tracking",
              "Export reports",
              "Faster processing",
            ]}
          />

          <PlanBox
            title="Yearly"
            price="₹2999 / year"
            active={plan === "Yearly"}
            selectable={changeMode}
            onSelect={() => setPlan("Yearly")}
            features={[
              "All Monthly features",
              "AI career roadmap",
              "Early feature access",
              "Advanced analytics dashboard",
              "Personalized recommendations",
              "Premium templates",
              "Dedicated support",
              "Account priority",
              "Best value savings",
            ]}
          />
        </div>

        {/* FOOTER */}
        {changeMode && (
          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={() => setChangeMode(false)}
              className="px-4 py-2 text-sm border border-emerald-400/30 rounded"
            >
              Cancel
            </button>
            <button
              onClick={() => setChangeMode(false)}
              className="btn-primary"
            >
              Confirm Plan
            </button>
          </div>
        )}
      </Card>
    </div>
  );
}

/* ---------- PLAN BOX ---------- */

const PlanBox = ({
  title,
  price,
  features,
  active,
  selectable,
  onSelect,
}) => (
  <div
    onClick={selectable ? onSelect : undefined}
    className={`h-full rounded-xl border p-6 font-mono transition flex flex-col justify-between ${
      active
        ? "border-emerald-400 bg-emerald-400/10"
        : "border-emerald-400/20"
    } ${selectable ? "cursor-pointer hover:border-emerald-400/60" : ""}`}
  >
    {/* HEADER */}
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-2xl font-bold text-white">{title}</h3>

        {selectable && (
          <input
            type="checkbox"
            checked={active}
            readOnly
            className="accent-emerald-400 w-4 h-4"
          />
        )}
      </div>

      <p className="text-emerald-400 font-semibold mb-4">
        {price}
      </p>

      <ul className="space-y-2 text-sm text-white/80">
        {features.map((f, i) => (
          <li key={i} className="flex gap-2">
            <span className="text-emerald-400">✓</span>
            <span>{f}</span>
          </li>
        ))}
      </ul>
    </div>

    {/* STATUS */}
    {active && !selectable && (
      <div className="text-xs text-emerald-400 font-semibold tracking-wide">
        CURRENT PLAN
      </div>
    )}
  </div>
);