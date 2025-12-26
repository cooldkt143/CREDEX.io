import { motion } from "framer-motion";

const columns = Array.from({ length: 12 });

const LandingAnimation = () => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ delay: 3, duration: 0.6 }}
      className="fixed inset-0 z-50 bg-black overflow-hidden flex items-center justify-center"
    >
      {/* glow pulse */}
      <motion.div
        initial={{ scale: 0, opacity: 0.4 }}
        animate={{ scale: 6, opacity: 0 }}
        transition={{ duration: 2.2, ease: "easeOut" }}
        className="absolute w-32 h-32 rounded-full bg-teal-400/20 blur-3xl"
      />

      {/* flowing code columns */}
      <div className="absolute inset-0 flex justify-center gap-6">
        {columns.map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: "100%" }}
            animate={{ y: "-120%" }}
            transition={{
              duration: 2 + Math.random(),
              delay: i * 0.15,
              ease: "linear",
            }}
            className="w-[2px] h-[140%] bg-gradient-to-t from-transparent via-teal-400/60 to-transparent"
          />
        ))}
      </div>

      {/* center glitch text */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6 }}
        className="relative z-10 font-mono text-teal-400 tracking-wide"
      >
        <motion.p
          animate={{ x: [0, -2, 2, 0] }}
          transition={{ repeat: 3, duration: 0.15 }}
          className="text-lg sm:text-xl"
        >
          compiling skill graph
        </motion.p>

        <p className="mt-2 text-xs text-teal-400/60 text-center">
          validating proofs
        </p>
      </motion.div>
    </motion.div>
  );
};

export default LandingAnimation;
