import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../config";
import { Loader2 } from "lucide-react";

const Preview = ({ resumeData, templateId }) => {
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

  return (
    <div className="p-5 sm:p-8 flex flex-col md:flex-row gap-8">
      <div className="flex-1">
        <h2 className="text-teal-400 font-mono text-lg mb-3 ">
          step_4.preview_download
        </h2>
        <p className="text-slate-300 font-mono text-sm leading-relaxed mb-4">
          You have selected the <span className="text-teal-400 font-semibold">{templateId}</span> template.
        </p>
        <p className="text-slate-300 font-mono text-sm leading-relaxed">
          Review your finalized resume preview on the right. If everything looks good, go ahead and export the PDF!
        </p>
      </div>

      <div className="flex-1 bg-slate-800/50 rounded-lg p-2 flex items-center justify-center min-h-[500px] border border-slate-700">
        {loading ? (
          <div className="text-teal-400 flex flex-col items-center gap-2">
            <Loader2 className="animate-spin" size={32} />
            <span className="font-mono text-sm">Rendering preview...</span>
          </div>
        ) : (
          <div className="w-full h-[600px] bg-white rounded shadow-lg overflow-hidden">
             <iframe srcDoc={html} className="w-full h-full border-0 bg-white" title={`Preview ${templateId}`} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Preview;