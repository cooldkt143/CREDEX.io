import React from "react";

const DescriptionStep = () => {
  return (
    <>
      <h2 className="text-teal-400 font-mono text-lg mb-2">
        step_3.description
      </h2>

      <textarea
        rows="5"
        placeholder="Short professional summary"
        className="input resize-none"
      />
    </>
  );
};

export default DescriptionStep;