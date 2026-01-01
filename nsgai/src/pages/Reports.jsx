import { useState } from "react";
import { Download, CalendarDays, Filter, FileText, BarChart3 } from "lucide-react";

export default function Reports() {
  const [filter, setFilter] = useState("daily");

  const heatmapCells = Array.from({ length: 42 }, (_, i) => ({
    id: i,
    intensity: Math.floor(Math.random() * 5) + 1,
  }));

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold tracking-wide flex items-center gap-3">
          <BarChart3 size={32} /> AI Reports & Analytics
        </h1>

        <button className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl flex items-center gap-2 font-semibold">
          <Download size={18} /> Export Full Report
        </button>
      </div>

      {/* Filters */}
      <div className="p-5 bg-gray-900 rounded-2xl mb-10 flex items-center justify-between">
        <div className="flex gap-5">
          <button
            onClick={() => setFilter("daily")}
            className={`px-5 py-2 rounded-lg ${
              filter === "daily" ? "bg-blue-600" : "bg-gray-800"
            }`}
          >
            Daily
          </button>
          <button
            onClick={() => setFilter("weekly")}
            className={`px-5 py-2 rounded-lg ${
              filter === "weekly" ? "bg-blue-600" : "bg-gray-800"
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setFilter("monthly")}
            className={`px-5 py-2 rounded-lg ${
              filter === "monthly" ? "bg-blue-600" : "bg-gray-800"
            }`}
          >
            Monthly
          </button>
        </div>

        <div className="flex items-center gap-3">
          <CalendarDays size={20} />
          <span className="text-gray-300">Jan 2025 – Dec 2025</span>
          <button className="px-5 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center gap-2">
            <Filter size={16} /> Filters
          </button>
        </div>
      </div>

      {/* AI Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="p-6 bg-gray-900 rounded-2xl shadow-xl">
          <h3 className="text-xl font-semibold mb-2">Total Detections</h3>
          <p className="text-4xl font-bold text-blue-500">1,248</p>
          <p className="text-gray-400 text-sm mt-2">Across all cameras</p>
        </div>

        <div className="p-6 bg-gray-900 rounded-2xl shadow-xl">
          <h3 className="text-xl font-semibold mb-2">Threat Alerts</h3>
          <p className="text-4xl font-bold text-red-500">62</p>
          <p className="text-gray-400 text-sm mt-2">Weapons, explosives, intrusions</p>
        </div>

        <div className="p-6 bg-gray-900 rounded-2xl shadow-xl">
          <h3 className="text-xl font-semibold mb-2">Processed Footage</h3>
          <p className="text-4xl font-bold text-green-500">417 hrs</p>
          <p className="text-gray-400 text-sm mt-2">AI-reviewed video duration</p>
        </div>
      </div>

      {/* Heatmap Section */}
      <h2 className="text-3xl font-bold mb-6">Threat Heatmap</h2>
      <div className="grid grid-cols-7 gap-2 bg-gray-900 p-6 rounded-2xl mb-14">
        {heatmapCells.map((cell) => (
          <div
            key={cell.id}
            className={`
              h-10 w-full rounded-lg transition-all 
              ${cell.intensity === 1 && "bg-green-700"} 
              ${cell.intensity === 2 && "bg-yellow-600"} 
              ${cell.intensity === 3 && "bg-orange-600"} 
              ${cell.intensity === 4 && "bg-red-600"} 
              ${cell.intensity === 5 && "bg-red-800"} 
            `}
          ></div>
        ))}
      </div>

      {/* Recent Logs */}
      <h2 className="text-3xl font-bold mb-6">Recent Detection Logs</h2>
      <div className="bg-gray-900 p-6 rounded-2xl">
        <table className="w-full text-left border-collapse">
          <thead className="text-gray-300 border-b border-gray-700">
            <tr>
              <th className="pb-3">Timestamp</th>
              <th className="pb-3">Camera</th>
              <th className="pb-3">Detected Activity</th>
              <th className="pb-3">Severity</th>
              <th className="pb-3">Report</th>
            </tr>
          </thead>

          <tbody>
            {[
              {
                time: "12:41 PM",
                cam: "Drone – Sector 3",
                act: "Suspicious Vehicle",
                sev: "High",
                color: "text-red-500",
              },
              {
                time: "10:22 AM",
                cam: "Gate Camera 1",
                act: "Loitering",
                sev: "Medium",
                color: "text-yellow-500",
              },
              {
                time: "09:12 AM",
                cam: "Parking Lot",
                act: "Object Left Behind",
                sev: "High",
                color: "text-red-400",
              },
            ].map((row, i) => (
              <tr key={i} className="border-b border-gray-800">
                <td className="py-4">{row.time}</td>
                <td>{row.cam}</td>
                <td>{row.act}</td>
                <td className={row.color}>{row.sev}</td>
                <td>
                  <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 text-sm rounded-lg flex items-center gap-2">
                    <FileText size={14} /> View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="text-center text-gray-500 mt-14 pb-6">
        © 2025 NSG Automated Surveillance — AI Powered Intelligence
      </div>
    </div>
  );
}
