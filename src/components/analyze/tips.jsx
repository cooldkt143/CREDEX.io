import React from "react";
import { motion } from "framer-motion";
import Image1 from "../../assets/images/select-1st.png";
import Image2 from "../../assets/images/platform-2nd.png";
import Image3 from "../../assets/images/enter-3rd.png";
import Image4 from "../../assets/images/analyse-4th.png";
import Image5 from "../../assets/images/analyzing-5th.png";
import Image6 from "../../assets/images/result-6th.png";

const steps = [
  {
    id: 1,
    title: "Select Platform",
    text: "Start by selecting the platform you want to analyze. This tells the system which data sources and metrics to use for your profile evaluation.",
    image: Image1,
    layout: "center",
  },
  {
    id: 2,
    title: "Choose Platform Type",
    text: "Pick the platform where you are most active, such as GitHub, HackerRank, or GeeksForGeeks. Each platform is analyzed using its own contribution and performance signals.",
    image: Image2,
    layout: "left",
  },
  {
    id: 3,
    title: "Enter Profile ID",
    text: "Enter your public username or profile ID. Make sure it is correct so we can fetch your repositories, activity history, and contribution data accurately.",
    image: Image3,
    layout: "center",
  },
  {
    id: 4,
    title: "Analyze Profile",
    text: "Once you click analyze, the system scans your profile, evaluates consistency, impact, and overall activity, and prepares a detailed assessment.",
    image: Image4,
    layout: "center",
  },
  {
    id: 5,
    title: "Analyzing Progress",
    text: "You will see real-time progress as different analysis stages run. This includes data fetching, contribution checks, and score calculation.",
    image: Image5,
    layout: "right",
  },
  {
    id: 6,
    title: "Get Results",
    text: "View your final developer score along with clear improvement insights. These tips help you understand what to focus on next to strengthen your profile.",
    image: Image6,
    layout: "center",
  },
];

const tips = () => {
  return (
    <div className="w-full bg-black py-20 px-4 font-mono text-gray-300">
      <h1 className="text-center text-3xl font-semibold text-teal-400 mb-3">
        Platform Guide
      </h1>
      <p className="text-center text-gray-400 max-w-2xl mx-auto mb-16">
        Follow these steps to understand how your profile is analyzed, how the score is calculated,
        and what you can improve to build a stronger developer presence.
      </p>
      <div className="max-w-6xl mx-auto space-y-24">
        {steps.map((step) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {/* CENTER LAYOUT */}
            {step.layout === "center" && (
              <div className="flex flex-col items-center text-center">
                <h3 className="text-teal-400 text-xl mb-6">
                  {step.id}. {step.title}
                </h3>
                <img
                  src={step.image}
                  alt={step.title}
                  className="rounded-lg border border-teal-400/30 mb-6 max-w-6xl w-full"
                />
                <p className="text-gray-400 max-w-xl">{step.text}</p>
                <div className="w-full flex justify-center mt-10">
                  <div className="h-px w-3/4 bg-teal-400/30" />
                </div>
              </div>
            )}

            {/* LEFT IMAGE */}
            {step.layout === "left" && (
              <div className="text-center"> 
                <div className="flex flex-col md:flex-row items-center sm:text-left gap-10">
                  <img
                    src={step.image}
                    alt={step.title}
                    className="rounded-lg border border-teal-400/30 max-w-lg w-full "
                  />
                  <div>
                    <h3 className="text-teal-400 text-xl mb-2">
                      {step.id}. {step.title}
                    </h3>
                    <p className="text-gray-400">{step.text}</p>
                  </div>
                </div>
                <div className="w-full flex justify-center mt-10">
                  <div className="h-px w-3/4 bg-teal-400/30" />
                </div>
              </div>
            )}

            {/* RIGHT IMAGE */}
            {step.layout === "right" && (
              <div className="text-center">
                <div className="flex flex-col md:flex-row-reverse items-center sm:text-left gap-10">
                  <img
                    src={step.image}
                    alt={step.title}
                    className="rounded-lg border border-teal-400/30 max-w-xl w-full"
                  />
                  <div>
                    <h3 className="text-teal-400 text-xl mb-2">
                      {step.id}. {step.title}
                    </h3>
                    <p className="text-gray-400">{step.text}</p>
                  </div>
                </div>
                <div className="w-full flex justify-center mt-10">
                  <div className="h-px w-3/4 bg-teal-400/30" />
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default tips;
