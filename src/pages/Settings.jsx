import { useState } from "react";
import logo from "../assets/images/credex.io_logo.png";
import Header from "../components/Header";

export default function Settings() {
  const [active, setActive] = useState("personal");
  const [showSub, setShowSub] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#041b17] to-[#020b0a] text-[#d8fff5] pt-20">
      {/* HEADER */}
      <Header logo={logo} />

      {/* MAIN LAYOUT */}
      <div className="flex h-[calc(100vh-64px)]">
        {/* SIDEBAR */}
        <aside className="w-64 p-6 border-r border-emerald-400/30 space-y-2">
          <SidebarItem label="Personal Details" id="personal" active={active} setActive={setActive} />
          <SidebarItem label="Subscription" id="subscription" active={active} setActive={setActive} />
          <SidebarItem label="Your Activity" id="activity" active={active} setActive={setActive} />
          <SidebarItem label="Resume Downloads" id="downloads" active={active} setActive={setActive} />
          <SidebarItem label="Appearance" id="appearance" active={active} setActive={setActive} />

          <div
            onClick={() => alert("Logged out successfully")}
            className="mt-6 p-3 rounded-lg cursor-pointer text-red-400 border border-red-400/40"
          >
            Logout
          </div>
        </aside>

        {/* CONTENT */}
        <section className="flex-1 p-10 relative">
          {active === "personal" && (
            <Card title="Personal Details">
              <Input placeholder="Full Name" defaultValue="Mahesh Raulo" />
              <Input placeholder="Email" defaultValue="mahesh@email.com" />
              <Input placeholder="Phone Number" />
              <Input placeholder="Change Password" type="password" />
              <button className="px-5 py-2 bg-emerald-400 text-black font-bold rounded">
                Save
              </button>
            </Card>
          )}

          {active === "subscription" && (
            <Card title="Subscription">
              <p className="text-sm mb-4">
                View and manage your subscription plans
              </p>
              <button
                onClick={() => setShowSub(true)}
                className="px-5 py-2 bg-emerald-400 text-black font-bold rounded"
              >
                View Plans
              </button>
            </Card>
          )}

          {active === "activity" && (
            <Card title="Your Activity">
              <List
                items={[
                  "Visited Resume Builder",
                  "Checked ATS Score",
                  "Generated Resume",
                  "Updated Profile",
                ]}
              />
            </Card>
          )}

          {active === "downloads" && (
            <Card title="Resume Download History">
              <List
                items={[
                  "Frontend_Resume.pdf – 12 Jan",
                  "Internship_Resume.pdf – 08 Jan",
                  "ATS_Optimized_Resume.pdf – 02 Jan",
                ]}
              />
            </Card>
          )}

          {active === "appearance" && (
            <Card title="Appearance">
              <div className="flex justify-between items-center">
                <span>Font Size</span>
                <select className="bg-black/40 border border-emerald-400/30 rounded px-3 py-2">
                  <option>Small</option>
                  <option selected>Medium</option>
                  <option>Large</option>
                </select>
              </div>
            </Card>
          )}
        </section>
      </div>

      {/* SUBSCRIPTION MODAL */}
      {showSub && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className="bg-[#041b17] p-8 rounded-xl w-[700px] border border-emerald-400/30">
            <h3 className="text-lg mb-6 text-emerald-400">
              Choose a Subscription Plan
            </h3>

            <div className="grid grid-cols-3 gap-4">
              <Plan
                title="Free Trial"
                price="₹0"
                features={[
                  "Basic Resume Builder",
                  "Limited ATS Check",
                ]}
                selected={selectedPlan === "free"}
                onClick={() => setSelectedPlan("free")}
              />
              <Plan
                title="Monthly"
                price="₹299 / month"
                features={[
                  "Unlimited Resume Builds",
                  "Advanced ATS Analysis",
                  "AI Suggestions",
                ]}
                selected={selectedPlan === "monthly"}
                onClick={() => setSelectedPlan("monthly")}
              />
              <Plan
                title="Yearly"
                price="₹2000 / year"
                features={[
                  "All Monthly Features",
                  "Priority AI Optimization",
                  "Premium Resume Templates",
                ]}
                selected={selectedPlan === "yearly"}
                onClick={() => setSelectedPlan("yearly")}
              />
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setShowSub(false)}
                className="px-4 py-2 border border-emerald-400 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!selectedPlan) return alert("Please select a plan");
                  alert(`Selected Plan: ${selectedPlan}`);
                  setShowSub(false);
                }}
                className="px-4 py-2 bg-emerald-400 text-black font-bold rounded"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- COMPONENTS ---------- */

const SidebarItem = ({ label, id, active, setActive }) => (
  <div
    onClick={() => setActive(id)}
    className={`p-3 rounded-lg cursor-pointer ${
      active === id
        ? "border border-emerald-400 shadow-lg"
        : "bg-emerald-400/5"
    }`}
  >
    {label}
  </div>
);

const Card = ({ title, children }) => (
  <div className="max-w-xl p-8 rounded-xl border border-emerald-400/30 bg-emerald-400/5 animate-slide">
    <h3 className="text-lg mb-4 text-emerald-400">{title}</h3>
    <div className="space-y-4">{children}</div>
  </div>
);

const Input = ({ type = "text", ...props }) => (
  <input
    type={type}
    {...props}
    className="w-full p-3 bg-black/40 border border-emerald-400/30 rounded"
  />
);

const List = ({ items }) => (
  <ul className="space-y-2">
    {items.map((i) => (
      <li key={i} className="p-3 rounded bg-emerald-400/10">
        {i}
      </li>
    ))}
  </ul>
);

const Plan = ({ title, price, features, selected, onClick }) => (
  <div
    onClick={onClick}
    className={`p-5 rounded-xl cursor-pointer border transition ${
      selected
        ? "border-emerald-400 shadow-lg shadow-emerald-400/40"
        : "border-emerald-400/20"
    }`}
  >
    <h4 className="text-emerald-400">{title}</h4>
    <p className="text-lg my-2">{price}</p>
    <ul className="text-sm space-y-1">
      {features.map((f) => (
        <li key={f}>• {f}</li>
      ))}
    </ul>
  </div>
);
