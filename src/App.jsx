import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Details from "./pages/Details.jsx";
import Home from "./pages/Home.jsx";
import Analyze from "./pages/Analyze.jsx";

function App() {
  return (
    <Router>
      <Routes>
        {/* Root / Landing Page */}
        <Route path="/" element={<Landing />} />

        {/* Login Page */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Details Page */}
        <Route path="/details" element={<Details />} />

        {/* Home Page after setup */}
        <Route path="/home" element={<Home />} />

        {/* Analyze Page */}
        <Route path="/analyze" element={<Analyze />} />

        {/* Catch-all for invalid URLs (optional) */}
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
