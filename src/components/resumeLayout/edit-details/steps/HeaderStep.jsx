import React from "react";

const HeaderStep = ({ resumeData, setResumeData }) => {
  const header = resumeData.header || {};

  const update = (key, value) => {
    setResumeData({
      ...resumeData,
      header: {
        ...header,
        [key]: value,
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-teal-400 font-mono text-lg">
          step_1.header
        </h2>
        <p className="text-slate-400 font-mono text-sm">
          Basic identity and role information.
        </p>
      </div>

      {/* Identity Section */}
      <div className="space-y-3">
        <p className="text-slate-500 font-mono text-xs uppercase tracking-wide">
          Identity
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            className="input"
            placeholder="First Name"
            value={header.firstName || ""}
            onChange={(e) => update("firstName", e.target.value)}
          />

          <input
            className="input"
            placeholder="Surname"
            value={header.lastName || ""}
            onChange={(e) => update("lastName", e.target.value)}
          />
        </div>
      </div>

      {/* Location Section */}
      <div className="space-y-3">
        <p className="text-slate-500 font-mono text-xs uppercase tracking-wide">
          Location
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            className="input"
            placeholder="City"
            value={header.city || ""}
            onChange={(e) => update("city", e.target.value)}
          />

          <input
            className="input"
            placeholder="Country"
            value={header.country || ""}
            onChange={(e) => update("country", e.target.value)}
          />

          <input
            className="input"
            placeholder="Pincode"
            value={header.pincode || ""}
            onChange={(e) => update("pincode", e.target.value)}
          />
        </div>
      </div>

      {/* Role Section */}
      <div className="space-y-3">
        <p className="text-slate-500 font-mono text-xs uppercase tracking-wide">
          Role
        </p>

        <input
          className="input"
          placeholder="Job Role or Professional Title"
          value={header.role || ""}
          onChange={(e) => update("role", e.target.value)}
        />
      </div>
    </div>
  );
};

export default HeaderStep;
