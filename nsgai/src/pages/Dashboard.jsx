import { Link } from 'react-router-dom';

export default function DashboardHome() {
  return (
    <div className="min-h-screen w-full bg-gray-900 text-white font-sans">
      <header className="w-full p-6 flex justify-between items-center bg-gray-800 fixed top-0 z-50">
        <h1 className="text-2xl font-bold tracking-wide">NSG Surveillance Dashboard</h1>
        <nav className="flex gap-6 text-lg">
          <Link to="/" className="hover:text-blue-400">Home</Link>
          <Link to="/videoanalysis" className="hover:text-blue-400">Video Analysis</Link>
          <Link to="/alerts" className="hover:text-blue-400">Alerts</Link>
          <Link to="/reports" className="hover:text-blue-400">Reports</Link>
          <Link to="/settings" className="hover:text-blue-400">Settings</Link>
        </nav>
      </header>

      <main className="pt-28 px-8">
        <section className="mb-16">
          <h2 className="text-4xl font-bold mb-4">Welcome to NSG AI Surveillance Dashboard</h2>
          <p className="text-gray-300 mb-6">
            NSG operates multiple surveillance systems including drones, body cams, and mobile robots. Our AI-powered software analyses video feeds, identifies threats, and generates actionable insights.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
          <div className="p-6 bg-gray-800 rounded-2xl shadow-lg">
            <h3 className="text-2xl font-semibold mb-2">AI/ML-Powered Video Analysis</h3>
            <p className="text-gray-300">
              Automates extraction of insights from video feeds, detects unusual behaviors, identifies objects, and tracks movements with minimal human intervention.
            </p>
          </div>
          <div className="p-6 bg-gray-800 rounded-2xl shadow-lg">
            <h3 className="text-2xl font-semibold mb-2">Real-Time Threat Detection</h3>
            <p className="text-gray-300">
              Recognizes weapons, explosives, loitering, suspicious movements, and triggers instant alerts for actionable decisions.
            </p>
          </div>
          <div className="p-6 bg-gray-800 rounded-2xl shadow-lg">
            <h3 className="text-2xl font-semibold mb-2">Facial Recognition</h3>
            <p className="text-gray-300">
              Identifies individuals of interest, compares against watchlists, and tracks their movement to enhance security monitoring.
            </p>
          </div>
          <div className="p-6 bg-gray-800 rounded-2xl shadow-lg">
            <h3 className="text-2xl font-semibold mb-2">Legacy System Integration</h3>
            <p className="text-gray-300">
              Can receive video inputs from existing surveillance devices without the need for costly upgrades, ensuring maximum utilization.
            </p>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-4">System Capabilities</h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            <li>Video Input from cameras, body cams, and drones.</li>
            <li>Feature Extraction: objects, patterns, activities from video frames.</li>
            <li>Model Training with AI/ML on labeled datasets.</li>
            <li>Real-Time Analysis & Interpretation of video data.</li>
            <li>Outputs: Alerts, Reports, Heatmaps, Raw Data.</li>
          </ul>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-4">Impact Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-gray-800 rounded-2xl shadow-lg">
              <h3 className="text-xl font-semibold mb-2">Automated Threat Alerts</h3>
              <p className="text-gray-300">Immediate notifications for any detected suspicious activity.</p>
            </div>
            <div className="p-6 bg-gray-800 rounded-2xl shadow-lg">
              <h3 className="text-xl font-semibold mb-2">Advanced Analytics</h3>
              <p className="text-gray-300">Historical data visualization and predictive insights from video footage.</p>
            </div>
            <div className="p-6 bg-gray-800 rounded-2xl shadow-lg">
              <h3 className="text-xl font-semibold mb-2">Heatmaps & Monitoring</h3>
              <p className="text-gray-300">Visual representation of high-activity zones and crowd movements.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-6 text-center bg-gray-800 text-gray-400">
        © 2025 NSG AI Surveillance Dashboard • All Rights Reserved
      </footer>
    </div>
  );
}
