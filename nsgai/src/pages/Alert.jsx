import { Link } from 'react-router-dom';

export default function Alerts() {
  const sampleAlerts = [
    { id: 1, type: 'Suspicious Movement', location: 'Zone A', time: '2025-12-06 10:15' },
    { id: 2, type: 'Weapon Detected', location: 'Entrance Gate', time: '2025-12-06 10:25' },
    { id: 3, type: 'Unauthorized Access', location: 'Restricted Area', time: '2025-12-06 10:35' },
    { id: 4, type: 'Crowd Surge', location: 'Lobby', time: '2025-12-06 10:50' },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <header className="w-full p-6 flex justify-between items-center bg-gray-800 fixed top-0 z-50">
        <h1 className="text-2xl font-bold tracking-wide">NSG Alerts Dashboard</h1>
        <nav className="flex gap-6 text-lg">
          <Link to="/dashboard" className="hover:text-blue-400">Home</Link>
          <Link to="/dashboard/video-analysis" className="hover:text-blue-400">Video Analysis</Link>
          <Link to="/dashboard/alerts" className="hover:text-blue-400">Alerts</Link>
          <Link to="/dashboard/reports" className="hover:text-blue-400">Reports</Link>
          <Link to="/dashboard/settings" className="hover:text-blue-400">Settings</Link>
        </nav>
      </header>

      <main className="pt-28 px-8">
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4">Recent Alerts</h2>
          <p className="text-gray-300 mb-6">
            NSG system automatically triggers alerts when suspicious activities or threats are detected.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleAlerts.map(alert => (
            <div key={alert.id} className="p-6 bg-gray-800 rounded-2xl shadow-lg">
              <h3 className="text-xl font-semibold mb-2">{alert.type}</h3>
              <p className="text-gray-300">Location: {alert.location}</p>
              <p className="text-gray-400 text-sm">Time: {alert.time}</p>
              <button className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-xl font-semibold">View Details</button>
            </div>
          ))}
        </section>
      </main>

      <footer className="py-6 text-center bg-gray-800 text-gray-400">
        © 2025 NSG Alerts • All Rights Reserved
      </footer>
    </div>
  );
}
