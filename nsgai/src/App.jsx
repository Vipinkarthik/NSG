import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "./components/Landingpage";
import LoginPage from "./components/Loginpage";

// Dashboard Pages
import DashboardHome from "./pages/Dashboard";
import VideoAnalysis from "./pages/Videoanalysis";
import Alerts from "./pages/Alert";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Login Page */}
        <Route path="/login" element={<LoginPage />} />

        {/* Dashboard Home */}
        <Route path="/dashboard" element={<DashboardHome />} />

        {/* Video Analysis */}
        <Route path="/dashboard/videoanalysis" element={<VideoAnalysis />} />

        {/* Alerts */}
        <Route path="/dashboard/alerts" element={<Alerts />} />

        {/* Reports */}
        <Route path="/dashboard/reports" element={<Reports />} />

        {/* Settings */}
        <Route path="/dashboard/settings" element={<Settings />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
