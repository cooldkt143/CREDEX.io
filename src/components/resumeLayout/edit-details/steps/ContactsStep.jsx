import React, { useState, useEffect } from "react";
import { Plus, Check, Link2 } from "lucide-react";

const ContactsStep = ({ resumeData, setResumeData }) => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [links, setLinks] = useState([]);

  const [showAdd, setShowAdd] = useState(false);
  const [linkName, setLinkName] = useState("");
  const [linkUrl, setLinkUrl] = useState("");

  // 🔑 STEP 4: sync extracted data → local state
  useEffect(() => {
    if (!resumeData?.contacts) return;

    setEmail(resumeData.contacts.email || "");
    setPhone(resumeData.contacts.phone || "");
    setLinks(resumeData.contacts.links || []);
  }, [resumeData]);

  // 🔄 Sync local state → resumeData
  const syncContacts = (updated) => {
    setResumeData({
      ...resumeData,
      contacts: {
        email,
        phone,
        links,
        ...updated
      }
    });
  };

  const addLink = () => {
    if (!linkName || !linkUrl) return;

    const newLinks = [...links, { name: linkName, url: linkUrl }];
    setLinks(newLinks);
    syncContacts({ links: newLinks });

    setLinkName("");
    setLinkUrl("");
    setShowAdd(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-teal-400 font-mono text-lg mb-1">step_2.contacts</h2>
        <p className="text-slate-400 font-mono text-sm">
          Communication channels and profile links
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          placeholder="Email address"
          className="input"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            syncContacts({ email: e.target.value });
          }}
        />
        <input
          placeholder="Phone number"
          className="input"
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value);
            syncContacts({ phone: e.target.value });
          }}
        />
      </div>

      {/* Links UI unchanged */}
    </div>
  );
};

export default ContactsStep;
