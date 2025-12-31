import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Details from "./pages/Details.jsx";
import Home from "./pages/Home.jsx";
import PlatformAnalyze from "./pages/PlatformAnalyze.jsx";
import ResumeAndATS from "./pages/ResumeAndATS.jsx";
import Profile from "./pages/Profile.jsx";
import LeaderBoard from "./pages/LeaderBoard.jsx";
import Settings from "./pages/Settings.jsx";
import CredexAnalyze from "./pages/CredexAnalyze.jsx";

function App() {
  return (
    <Router>
      <Routes>
        {/* Root / Landing Page */}
        <Route path="/" element={<Landing />} />

        {/* Login Page */}
        <Route path="/login" element={<Login />} />

        {/* Signup & Details Page */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/details" element={<Details />} />

        {/* Home Page after setup */}
        <Route path="/home" element={<Home />} />

        {/* Menu Page */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/leaderboard" element={<LeaderBoard />} />
        <Route path="/resume" element={<ResumeAndATS />} />
        <Route path="/settings" element={<Settings />} />

        {/* Credex Analyze Page */}
        <Route path="/credex-analyze" element={<CredexAnalyze />} />

        {/* Platform Analyze Page */}
        <Route path="/platform-analyze" element={<PlatformAnalyze />} />

        {/* Catch-all for invalid URLs (optional) */}
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;