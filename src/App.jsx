import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Details from "./pages/Details.jsx";
import Home from "./pages/Home.jsx";
import Analyze from "./pages/Analyze.jsx";
import Resume from "./pages/Resume.jsx";
import Profile from "./pages/Profile.jsx";
import LeaderBoard from "./pages/LeaderBoard.jsx";
import Settings from "./pages/Settings.jsx";

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
        <Route path="/resume" element={<Resume />} />
        <Route path="/settings" element={<Settings />} />

        {/* Analyze Page */}
        <Route path="/analyze" element={<Analyze />} />

        {/* Catch-all for invalid URLs (optional) */}
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;