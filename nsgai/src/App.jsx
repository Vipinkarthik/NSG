import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './components/Landingpage';
import LoginPage from './components/Loginpage';
import DashboardHome from './pages/Dashboard';
import VideoAnalysis from './pages/Videoanalysis';
import Alerts from './pages/Alert';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Login Page */}
        <Route path="/login" element={<LoginPage />} />

        {/* Dashboard Pages */}
        <Route path="/dashboard" element={<DashboardHome />} />
        <Route path="/dashboard/Videoanalysis" element={<VideoAnalysis />} />
        <Route path="/dashboard/alerts" element={<Alerts />} />
        <Route path="/dashboard/reports" element={<Reports />} />
        <Route path="/dashboard/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  );
}