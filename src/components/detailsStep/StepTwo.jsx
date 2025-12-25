import { useState } from "react";

const roles = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Mobile App Developer",
  "Machine Learning Engineer",
  "Data Scientist",
  "Web3 Developer",
  "DevOps Engineer",
];

const StepTwo = ({ formData, handleChange }) => {
  const [customRole, setCustomRole] = useState("");

  const updateRoles = (updatedRoles) => {
    handleChange({
      target: {
        name: "role",
        value: updatedRoles,
      },
    });
  };

  const handleRoleToggle = (role) => {
    const updatedRoles = formData.role.includes(role)
      ? formData.role.filter((r) => r !== role)
      : [...formData.role, role];

    updateRoles(updatedRoles);
  };

  const addCustomRole = () => {
    const trimmedRole = customRole.trim();
    if (!trimmedRole) return;
    if (formData.role.includes(trimmedRole)) {
      setCustomRole("");
      return;
    }

    updateRoles([...formData.role, trimmedRole]);
    setCustomRole("");
  };

  const customRoles = formData.role.filter(
    (role) => !roles.includes(role)
  );

  return (
    <div className="min-w-full px-6 sm:px-8 pb-8 overflow-y-auto">
      <p className="text-teal-400 mb-4">// developer.role</p>

      {/* Preset roles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-6">
        {roles.map((role) => (
          <label
            key={role}
            className={`flex items-center gap-3 px-4 py-2 rounded border cursor-pointer transition
              ${
                formData.role.includes(role)
                  ? "border-teal-400 text-teal-400 bg-teal-400/10"
                  : "border-gray-700 text-gray-400 hover:border-teal-400/60"
              }
            `}
          >
            <input
              type="checkbox"
              checked={formData.role.includes(role)}
              onChange={() => handleRoleToggle(role)}
              className="hidden"
            />
            <span>{role}</span>
          </label>
        ))}
      </div>

      {/* Other role input */}
      <div className="space-y-3">
        <p className="text-xs text-gray-400">// other.role</p>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="type your role and press add"
            value={customRole}
            onChange={(e) => setCustomRole(e.target.value)}
            className="input"
            onKeyDown={(e) => {
              if (e.key === "Enter") addCustomRole();
            }}
          />

          <button
            type="button"
            onClick={addCustomRole}
            className="px-4 rounded border border-teal-400/60 text-teal-400 hover:bg-teal-400/10 transition"
          >
            add
          </button>
        </div>

        {/* Display added custom roles */}
        {customRoles.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {customRoles.map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => handleRoleToggle(role)}
                className="px-3 py-1 text-xs rounded border border-teal-400 text-teal-400 bg-teal-400/10 hover:bg-red-500/10 hover:border-red-400 hover:text-red-400 transition"
              >
                {role} ✕
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StepTwo;
