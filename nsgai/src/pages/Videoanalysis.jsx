import { Link } from 'react-router-dom';

export default function VideoAnalysis() {
  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <header className="w-full p-6 flex justify-between items-center bg-gray-800 fixed top-0 z-50">
        <h1 className="text-2xl font-bold tracking-wide">NSG Video Analysis</h1>
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
          <h2 className="text-3xl font-bold mb-4">Real-Time Video Analysis</h2>
          <p className="text-gray-300 mb-6">
            Upload or stream video feeds from surveillance cameras, drones, or body cams. Our AI/ML models will analyse the footage to detect suspicious activities, track movements, and identify potential threats.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="p-6 bg-gray-800 rounded-2xl shadow-lg">
            <h3 className="text-2xl font-semibold mb-2">Upload Video</h3>
            <input type="file" accept="video/*" className="w-full p-3 rounded-lg bg-black border border-gray-700 text-white" />
          </div>
          <div className="p-6 bg-gray-800 rounded-2xl shadow-lg">
            <h3 className="text-2xl font-semibold mb-2">Live Camera Feed</h3>
            <p className="text-gray-300 mb-4">Stream real-time video directly from connected surveillance devices.</p>
            <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold">Connect Camera</button>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4">Analysis Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-gray-800 rounded-2xl shadow-lg">
              <h3 className="text-xl font-semibold mb-2">Threat Detection</h3>
              <p className="text-gray-300">Automatically identifies suspicious objects, loitering behavior, and unusual activities.</p>
            </div>
            <div className="p-6 bg-gray-800 rounded-2xl shadow-lg">
              <h3 className="text-xl font-semibold mb-2">Object Recognition</h3>
              <p className="text-gray-300">Detect weapons, explosives, and other predefined items in the video frames.</p>
            </div>
            <div className="p-6 bg-gray-800 rounded-2xl shadow-lg">
              <h3 className="text-xl font-semibold mb-2">Facial Recognition</h3>
              <p className="text-gray-300">Track and identify persons of interest and compare them against watchlists.</p>
            </div>
            <div className="p-6 bg-gray-800 rounded-2xl shadow-lg">
              <h3 className="text-xl font-semibold mb-2">Behavior Analysis</h3>
              <p className="text-gray-300">Analyze crowd movements and detect anomalies in real-time.</p>
            </div>
            <div className="p-6 bg-gray-800 rounded-2xl shadow-lg">
              <h3 className="text-xl font-semibold mb-2">Historical Video Review</h3>
              <p className="text-gray-300">Analyze archived footage for post-event investigation and reporting.</p>
            </div>
            <div className="p-6 bg-gray-800 rounded-2xl shadow-lg">
              <h3 className="text-xl font-semibold mb-2">Heatmaps</h3>
              <p className="text-gray-300">Visualize high-activity areas and movement patterns in the surveillance zone.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-6 text-center bg-gray-800 text-gray-400">
        © 2025 NSG Video Analysis • All Rights Reserved
      </footer>
    </div>
  );
}