import React from "react";

const steps = [
  { id: 1, title: "Header" },
  { id: 2, title: "Contacts" },
  { id: 3, title: "Description" },
  { id: 4, title: "Education" },
  { id: 5, title: "Skills" },
  { id: 6, title: "Experience" },
  { id: 7, title: "Projects & Achievements" },
];

const Sidebar = ({ activeStep, setActiveStep }) => {
  return (
    <div className="w-48 border-r border-gray-800/10 bg-teal-900/10 p-4 rounded-lg">
      <h3 className="text-teal-400 font-mono text-sm mb-4">
        edit_details.steps
      </h3>

      <ul className="space-y-2">
        {steps.map((step) => (
          <li
            key={step.id}
            onClick={() => setActiveStep(step.id)}
            className={`cursor-pointer rounded-md px-3 py-2 text-sm font-mono transition
              ${
                activeStep === step.id
                  ? "bg-teal-500/10 text-teal-400 border border-teal-500/30"
                  : "text-slate-400 hover:bg-slate-800"
              }`}
          >
            {step.id}. {step.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;