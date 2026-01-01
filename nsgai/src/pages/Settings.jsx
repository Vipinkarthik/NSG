import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Settings() {
  const [systemMode, setSystemMode] = useState("standard");
  const [notifications, setNotifications] = useState(true);
  const [autoUpdates, setAutoUpdates] = useState(false);

  return (
    <div className="min-h-screen bg-gray-950 text-white flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 p-6 flex flex-col gap-6 border-r border-gray-800">
        <h2 className="text-2xl font-bold">NSG Dashboard</h2>
        <nav className="flex flex-col gap-4 text-lg">
          <Link to="/dashboard/home" className="hover:text-gray-300">Home</Link>
          <Link to="/dashboard/video-analysis" className="hover:text-gray-300">Video Analysis</Link>
          <Link to="/dashboard/alerts" className="hover:text-gray-300">Alerts</Link>
          <Link to="/dashboard/reports" className="hover:text-gray-300">Reports</Link>
          <Link to="/dashboard/settings" className="text-blue-500 font-semibold">Settings</Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">
        <h1 className="text-4xl font-bold mb-10">Settings & Configuration</h1>

        {/* System Mode */}
        <div className="bg-gray-900 p-8 rounded-2xl mb-8 border border-gray-800">
          <h2 className="text-2xl font-semibold mb-4">System Mode</h2>
          <p className="text-gray-400 mb-4">Choose how the AI system behaves for surveillance operations.</p>
          <div className="flex gap-6">
            <label className="flex items-center gap-3">
              <input
                type="radio"
                checked={systemMode === "standard"}
                onChange={() => setSystemMode("standard")}
              />
              Standard Mode
            </label>
            <label className="flex items-center gap-3">
              <input
                type="radio"
                checked={systemMode === "high-security"}
                onChange={() => setSystemMode("high-security")}
              />
              High Security Mode
            </label>
            <label className="flex items-center gap-3">
              <input
                type="radio"
                checked={systemMode === "training"}
                onChange={() => setSystemMode("training")}
              />
              Training Mode
            </label>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-gray-900 p-8 rounded-2xl mb-8 border border-gray-800">
          <h2 className="text-2xl font-semibold mb-4">Notifications</h2>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-3 text-lg">
              <input
                type="checkbox"
                checked={notifications}
                onChange={() => setNotifications(!notifications)}
              />
              Enable Real-Time Alerts
            </label>
          </div>
        </div>

        {/* Auto Updates */}
        <div className="bg-gray-900 p-8 rounded-2xl mb-8 border border-gray-800">
          <h2 className="text-2xl font-semibold mb-4">System Updates</h2>
          <div className="flex items-center gap-4 text-lg">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={autoUpdates}
                onChange={() => setAutoUpdates(!autoUpdates)}
              />
              Enable Automatic Model Updates
            </label>
          </div>
        </div>

        {/* Account Settings */}
        <div className="bg-gray-900 p-8 rounded-2xl mb-8 border border-gray-800">
          <h2 className="text-2xl font-semibold mb-4">Account</h2>
          <div className="flex flex-col gap-4 max-w-md">
            <input
              type="text"
              placeholder="Update Username"
              className="p-3 rounded-lg bg-black border border-gray-700"
            />
            <input
              type="password"
              placeholder="Update Password"
              className="p-3 rounded-lg bg-black border border-gray-700"
            />
            <button className="bg-blue-600 hover:bg-blue-700 p-3 rounded-lg font-semibold">
              Save Changes
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-900 bg-opacity-20 p-8 rounded-2xl border border-red-700">
          <h2 className="text-2xl font-semibold mb-4 text-red-400">Danger Zone</h2>
          <p className="text-gray-400 mb-4">Reset system configuration. This action cannot be undone.</p>
          <button className="bg-red-600 hover:bg-red-700 p-3 rounded-lg font-semibold">
            Reset System
          </button>
        </div>
      </main>
    </div>
  );
}
