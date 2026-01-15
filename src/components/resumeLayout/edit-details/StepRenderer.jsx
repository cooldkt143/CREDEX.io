import React from "react";
import HeaderStep from "./steps/HeaderStep";
import ContactsStep from "./steps/ContactsStep";
import DescriptionStep from "./steps/DescriptionStep";
import EducationStep from "./steps/EducationStep";
import SkillsStep from "./steps/SkillsStep";
import ExperienceStep from "./steps/ExperienceStep";
import ProjectsStep from "./steps/ProjectsStep";

const StepRenderer = ({ activeStep, resumeData, setResumeData }) => {
  switch (activeStep) {
    case 1:
      return <HeaderStep resumeData={resumeData} setResumeData={setResumeData} />;
    case 2:
      return <ContactsStep resumeData={resumeData} setResumeData={setResumeData} />;
    case 3:
      return <DescriptionStep resumeData={resumeData} setResumeData={setResumeData} />;
    case 4:
      return <EducationStep resumeData={resumeData} setResumeData={setResumeData} />;
    case 5:
      return <SkillsStep resumeData={resumeData} setResumeData={setResumeData} />;
    case 6:
      return <ExperienceStep resumeData={resumeData} setResumeData={setResumeData} />;
    case 7:
      return <ProjectsStep resumeData={resumeData} setResumeData={setResumeData} />;
    default:
      return null;
  }
};


export default StepRenderer;