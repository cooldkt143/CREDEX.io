import { useNavigate } from "react-router-dom";

const items = [
  { id: "personal", label: "Personal Details" },
  { id: "subscription", label: "Subscription" },
  { id: "activity", label: "Your Activity" },
  { id: "downloads", label: "Resume Downloads" },
  { id: "appearance", label: "Appearance" },
];

export default function Sidebar({ active, setActive }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // clear auth data if you have any
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <aside className="w-64 h-full border-r border-emerald-400/30 flex flex-col bg-black/40 backdrop-blur font-mono">
      <div className="p-6 space-y-2 flex-1">
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => setActive(item.id)}
            className={`p-3 rounded-lg cursor-pointer transition text-sm tracking-wide ${
              active === item.id
                ? "border border-emerald-400 bg-emerald-400/10 shadow-lg"
                : "hover:bg-emerald-400/5"
            }`}
          >
            {item.label}
          </div>
        ))}
      </div>

      <div className="p-6 border-t border-emerald-400/20">
        <button
          onClick={handleLogout}
          className="w-full p-3 rounded-lg text-red-400 border border-red-400/40 hover:bg-red-400/10 text-sm tracking-wide"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}