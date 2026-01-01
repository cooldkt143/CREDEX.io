import React from "react";
import HeaderStep from "./steps/HeaderStep";
import ContactsStep from "./steps/ContactsStep";
import DescriptionStep from "./steps/DescriptionStep";
import EducationStep from "./steps/EducationStep";
import SkillsStep from "./steps/SkillsStep";
import ExperienceStep from "./steps/ExperienceStep";
import ProjectsStep from "./steps/ProjectsStep";

const StepRenderer = ({ activeStep }) => {
  switch (activeStep) {
    case 1:
      return <HeaderStep />;
    case 2:
      return <ContactsStep />;
    case 3:
      return <DescriptionStep />;
    case 4:
      return <EducationStep />;
    case 5:
      return <SkillsStep />;
    case 6:
      return <ExperienceStep />;
    case 7:
      return <ProjectsStep />;
    default:
      return null;
  }
};

export default StepRenderer;