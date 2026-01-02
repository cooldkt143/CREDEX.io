import React, { useState } from "react";
import { Plus, Check, Link2 } from "lucide-react";

const ContactsStep = () => {
  const [links, setLinks] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [linkName, setLinkName] = useState("");
  const [linkUrl, setLinkUrl] = useState("");

  const addLink = () => {
    if (!linkName || !linkUrl) return;

    setLinks([...links, { name: linkName, url: linkUrl }]);
    setLinkName("");
    setLinkUrl("");
    setShowAdd(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-teal-400 font-mono text-lg mb-1">
          step_2.contacts
        </h2>
        <p className="text-slate-400 font-mono text-sm">
          Communication channels and profile links
        </p>
      </div>

      {/* Basic contacts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input placeholder="Email address" className="input" />
        <input placeholder="Phone number" className="input" />
      </div>

      {/* Links section */}
      <div className="border border-slate-800 rounded-lg p-4 bg-slate-900/40">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-slate-300 font-mono text-sm flex items-center gap-2">
            <Link2 size={14} />
            external_links
          </h3>

          {!showAdd && (
            <button
              onClick={() => setShowAdd(true)}
              className="flex items-center gap-1 text-teal-400 text-xs font-mono hover:text-teal-300"
            >
              <Plus size={14} />
              add_link
            </button>
          )}
        </div>

        {/* Add link form */}
        {showAdd && (
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 mb-4">
            <input
              placeholder="Label (GitHub, LinkedIn)"
              className="input sm:col-span-2"
              value={linkName}
              onChange={(e) => setLinkName(e.target.value)}
            />
            <input
              placeholder="https://"
              className="input sm:col-span-2"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
            />
            <button
              onClick={addLink}
              className="flex items-center justify-center gap-1 rounded-md border border-teal-500/30
              bg-teal-500/10 text-teal-400 text-sm font-mono hover:bg-teal-500/20"
            >
              <Check size={14} />
              done
            </button>
          </div>
        )}

        {/* Saved links */}
        {links.length > 0 && (
          <div className="space-y-2">
            {links.map((link, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-md border
                border-slate-800 bg-slate-950 px-3 py-2"
              >
                <span className="text-slate-300 font-mono text-sm">
                  {link.name}
                </span>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-teal-400 font-mono text-sm hover:underline"
                >
                  {link.url}
                </a>
              </div>
            ))}
          </div>
        )}

        {links.length === 0 && !showAdd && (
          <p className="text-slate-500 font-mono text-xs">
            no_links_added
          </p>
        )}
      </div>
    </div>
  );
};

export default ContactsStep;