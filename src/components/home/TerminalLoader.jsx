import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const lines = [
  "booting core modules...",
  "loading skill graph...",
  "verifying proofs...",
  "system ready",
];

const TerminalLoader = () => {
  const [currentLine, setCurrentLine] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (currentLine >= lines.length) {
      setDone(true);
      return;
    }

    const fullText = lines[currentLine];
    let charIndex = 0;

    const typingInterval = setInterval(() => {
      setTypedText((prev) => prev + fullText[charIndex]);
      charIndex++;

      if (charIndex === fullText.length) {
        clearInterval(typingInterval);
        setTimeout(() => {
          setCurrentLine((prev) => prev + 1);
          setTypedText("");
        }, 400);
      }
    }, 20);

    return () => clearInterval(typingInterval);
  }, [currentLine]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: done ? 0 : 1 }}
      transition={{ duration: 0.4, delay: done ? 0.6 : 0 }}
      className="fixed inset-0 z-40 flex items-center justify-center"
    >
      <div className="w-[90%] max-w-md rounded-md border border-teal-400/30 bg-black/80 backdrop-blur-sm px-4 py-3 font-mono text-sm text-teal-400 shadow-xl">
        {lines.slice(0, currentLine).map((line, i) => (
          <p key={i} className="mb-1">
            <span className="text-teal-500">$</span> {line}
          </p>
        ))}

        {!done && (
          <p className="mb-1">
            <span className="text-teal-500">$</span> {typedText}
            <motion.span
              animate={{ opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 0.1 }}
              className="ml-1"
            >
              █
            </motion.span>
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default TerminalLoader;