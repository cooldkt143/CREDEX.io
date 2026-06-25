import React, { useState } from "react";
import Sidebar from "./edit-details/Sidebar";
import StepRenderer from "./edit-details/StepRenderer";

const emptyResume = {
  header: {
    firstName: "",
    lastName: "",
    city: "",
    country: "",
    pincode: "",
    role: ""
  },
  contacts: {
    email: "",
    phone: "",
    links: []
  },
  summary: "",
  education: [],
  skills: {
    skills: [],
    languages: []
  },
  experience: [],
  projects: [],
  achievements: []
};

const EditDetails = ({ resumeData, setResumeData }) => {
  const [activeStep, setActiveStep] = useState(1);

  return (
    <div className="flex bg-gray-950 border border-gray-800 rounded-xl p-5">
      <Sidebar activeStep={activeStep} setActiveStep={setActiveStep} />

      <div className="flex-1 p-6 overflow-y-auto">
        <StepRenderer
          activeStep={activeStep}
          resumeData={resumeData}
          setResumeData={setResumeData}
        />
      </div>
    </div>
  );
};

export default EditDetails;
