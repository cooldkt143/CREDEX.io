import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const TemplatePage = ({ onChooseTemplate }) => {
  const scrollRef = useRef(null);

  const scrollLeft = () => scrollRef.current.scrollBy({ left: -220, behavior: "smooth" });
  const scrollRight = () => scrollRef.current.scrollBy({ left: 220, behavior: "smooth" });

  return (
    <div className="relative bg-black text-white pb-10 overflow-hidden p-5 sm:p-10 rounded-xl border border-slate-800">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-teal-400 font-mono text-lg mb-2">
            template_selection
          </h1>
          <p className="mt-2 text-slate-400 text-sm font-mono">
            You can always change your <span className="text-teal-400">template</span> later
          </p>
        </div>

        {/* Scroll area with arrows */}
        <div className="relative">
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-slate-900/80 border border-slate-700 rounded-full p-2 hover:border-teal-400 hover:text-teal-400 transition hidden sm:block"
          >
            <ChevronLeft size={18} />
          </button>

          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-slate-900/80 border border-slate-700 rounded-full p-2 hover:border-teal-400 hover:text-teal-400 transition hidden sm:block"
          >
            <ChevronRight size={18} />
          </button>

          <div
            ref={scrollRef}
            className="flex gap-4 px-1 overflow-x-auto overflow-y-hidden scroll-smooth no-scrollbar w-full sm:w-[85%] mx-auto"
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="group relative min-w-[160px] sm:min-w-[180px] bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden hover:border-teal-400 transition"
              >
                {/* Hover glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-[radial-gradient(circle_at_center,_rgba(20,184,166,0.25),_transparent_70%)]" />

                <div className="relative p-3">
                  <div className="h-[120px] sm:h-40 bg-white rounded-md overflow-hidden">
                    <img
                      src="/template-preview.png"
                      alt="Resume template"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <button
                    onClick={onChooseTemplate}
                    className="mt-3 w-full py-2 rounded-lg text-[10px] sm:text-sm font-mono bg-[linear-gradient(to_right,_rgba(20,184,166,0.18),_transparent_80%)] hover:bg-[linear-gradient(to_left,_rgba(20,184,166,0.18),_transparent_80%)] transition"
                  >
                    <span className="font-sans">choose_</span>
                    <span className="font-mono text-teal-400">template()</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplatePage;