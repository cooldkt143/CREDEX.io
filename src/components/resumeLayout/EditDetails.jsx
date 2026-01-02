import React, { useState } from "react";
import Sidebar from "./edit-details/Sidebar";
import StepRenderer from "./edit-details/StepRenderer";

const EditDetails = () => {
  const [activeStep, setActiveStep] = useState(1);
  return (
    <div className="flex bg-gray-950 border border-gray-800 rounded-xl overflow-hidden p-5 sm:p-8">
      <Sidebar activeStep={activeStep} setActiveStep={setActiveStep} />

      <div className="flex-1 h-full p-6 overflow-y-auto">
        <StepRenderer activeStep={activeStep} />
      </div>
    </div>
  );
};

export default EditDetails;