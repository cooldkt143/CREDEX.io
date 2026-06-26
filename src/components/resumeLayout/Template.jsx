import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import axios from "axios";
import { API_URL } from "../../config";

const TemplatePreview = ({ templateId, resumeData }) => {
  const [html, setHtml] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHtml = async () => {
      try {
        const res = await axios.post(`${API_URL}/resume-builder/preview-html`, {
          template_id: templateId,
          resume_data: resumeData || {}
        });
        setHtml(res.data);
      } catch (err) {
        console.error("Failed to fetch preview:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHtml();
  }, [templateId, resumeData]);

  if (loading) {
    return <div className="w-full h-full flex items-center justify-center text-teal-400"><Loader2 className="animate-spin" /></div>;
  }

  return (
    <div className="w-[800px] h-[1131px]" style={{ transform: "scale(0.2)", transformOrigin: "top left" }}>
       <iframe srcDoc={html} className="w-full h-full border-0 bg-white pointer-events-none" title={`Preview ${templateId}`} />
    </div>
  );
};

const TemplatePage = ({ resumeData, onChooseTemplate }) => {
  const scrollRef = useRef(null);

  const scrollLeft = () => scrollRef.current.scrollBy({ left: -220, behavior: "smooth" });
  const scrollRight = () => scrollRef.current.scrollBy({ left: 220, behavior: "smooth" });

  const templates = [
    { id: "modern", name: "Modern Template" },
    { id: "classic", name: "Classic Template" },
    { id: "minimalist", name: "Minimalist Template" },
    { id: "creative", name: "Creative Template" },
    { id: "executive", name: "Executive Template" }
  ];

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
            {templates.map((template) => (
              <div
                key={template.id}
                className="group relative min-w-[160px] sm:min-w-[180px] bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden hover:border-teal-400 transition flex flex-col"
              >
                {/* Hover glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-[radial-gradient(circle_at_center,_rgba(20,184,166,0.25),_transparent_70%)] pointer-events-none" />

                <div className="relative p-3 flex-1 flex flex-col">
                  <div className="h-[226px] bg-slate-800 rounded-md overflow-hidden relative shadow-inner">
                    <TemplatePreview templateId={template.id} resumeData={resumeData} />
                  </div>

                  <button
                    onClick={() => onChooseTemplate(template.id)}
                    className="mt-3 w-full py-2 rounded-lg text-[10px] sm:text-sm font-mono bg-[linear-gradient(to_right,_rgba(20,184,166,0.18),_transparent_80%)] hover:bg-[linear-gradient(to_left,_rgba(20,184,166,0.18),_transparent_80%)] transition"
                  >
                    <span className="font-sans">choose_</span>
                    <span className="font-mono text-teal-400">template('{template.id}')</span>
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