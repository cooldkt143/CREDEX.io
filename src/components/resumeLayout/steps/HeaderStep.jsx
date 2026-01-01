import React from "react";

const HeaderStep = () => {
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

      {/* Name Section */}
      <div className="space-y-3">
        <p className="text-slate-500 font-mono text-xs uppercase tracking-wide">
          Identity
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            className="input"
            placeholder="First Name"
          />
          <input
            className="input"
            placeholder="Surname"
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
          />
          <input
            className="input"
            placeholder="Country"
          />
          <input
            className="input"
            placeholder="Pincode"
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
        />
      </div>
    </div>
  );
};

export default HeaderStep;