import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-black text-white font-sans">
      <header className="w-full p-6 flex justify-between items-center bg-opacity-30 bg-gray-900 backdrop-blur-xl fixed top-0 z-50">
        <h1 className="text-3xl font-bold tracking-wide">NSG Automated Surveillance</h1>
        <nav className="flex gap-8 text-lg">
          <a href="#features" className="hover:text-gray-300 transition">Features</a>
          <a href="#solutions" className="hover:text-gray-300 transition">Solutions</a>
          <a href="#about" className="hover:text-gray-300 transition">About</a>
          <a href="#contact" className="hover:text-gray-300 transition">Contact</a>
          <a href="/login" className="hover:text-gray-300 transition">Login</a>
        </nav>
      </header>

      <section className="h-screen flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1535223289827-42f1e9919769?auto=format&fit=crop&w=1500&q=80')] bg-cover bg-center relative">
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div className="relative z-10 text-center max-w-3xl p-6">
          <h2 className="text-5xl font-bold mb-6 leading-tight">Real-Time AI Surveillance for Maximum Security</h2>
          <p className="text-xl mb-8 text-gray-300">Automated threat detection including bombs, weapons, suspicious activities, and abnormal crowd behaviour — powered by next-gen AI.</p>
          <button onClick={() => navigate('/login')} className="px-8 py-4 rounded-2xl text-lg font-semibold bg-blue-600 hover:bg-blue-700 transition">Get Started</button>
        </div>
      </section>

      <section id="features" className="py-20 px-6 bg-gray-950">
        <h3 className="text-4xl font-bold text-center mb-16">Key Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          <div className="p-8 bg-gray-900 rounded-2xl shadow-xl">
            <h4 className="text-2xl font-semibold mb-4">Threat Detection</h4>
            <p className="text-gray-400">Detect weapons, bombs, unusual objects, or suspicious movements in real time using intelligent video analytics.</p>
          </div>
          <div className="p-8 bg-gray-900 rounded-2xl shadow-xl">
            <h4 className="text-2xl font-semibold mb-4">Crowd Monitoring</h4>
            <p className="text-gray-400">Track crowd density, sudden gatherings, or abnormal patterns instantly with AI-powered behavioural analysis.</p>
          </div>
          <div className="p-8 bg-gray-900 rounded-2xl shadow-xl">
            <h4 className="text-2xl font-semibold mb-4">Vehicle Surveillance</h4>
            <p className="text-gray-400">Identify suspicious parking, detect hidden objects inside vehicles, and track license plates.</p>
          </div>
          <div className="p-8 bg-gray-900 rounded-2xl shadow-xl">
            <h4 className="text-2xl font-semibold mb-4">Live Alerts</h4>
            <p className="text-gray-400">Immediate alert notifications to authorities for any detected threat or abnormal activity.</p>
          </div>
          <div className="p-8 bg-gray-900 rounded-2xl shadow-xl">
            <h4 className="text-2xl font-semibold mb-4">Smart Dashboard</h4>
            <p className="text-gray-400">Interactive monitoring dashboard with analytics, past event logs, and detailed camera insights.</p>
          </div>
          <div className="p-8 bg-gray-900 rounded-2xl shadow-xl">
            <h4 className="text-2xl font-semibold mb-4">High Accuracy Models</h4>
            <p className="text-gray-400">Models trained on massive datasets for precise detection and reduced false alarms.</p>
          </div>
        </div>
      </section>

      <section id="solutions" className="py-20 px-6 bg-black">
        <h3 className="text-4xl font-bold text-center mb-16">Where It Can Be Used</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          <div className="p-8 bg-gray-900 rounded-2xl shadow-xl">
            <h4 className="text-2xl font-semibold mb-4">Airports</h4>
            <p className="text-gray-400">Monitor passengers, baggage, and restricted zones with precision.</p>
          </div>
          <div className="p-8 bg-gray-900 rounded-2xl shadow-xl">
            <h4 className="text-2xl font-semibold mb-4">Malls & Public Spaces</h4>
            <p className="text-gray-400">Detect crowd surges, theft, or unusual actions instantly.</p>
          </div>
          <div className="p-8 bg-gray-900 rounded-2xl shadow-xl">
            <h4 className="text-2xl font-semibold mb-4">Defense & Military</h4>
            <p className="text-gray-400">Track unauthorized entries, suspicious vehicles, and perimeter breaches.</p>
          </div>
        </div>
      </section>

      <section id="about" className="py-20 px-6 bg-gray-950">
        <h3 className="text-4xl font-bold text-center mb-10">About NSG Surveillance</h3>
        <p className="max-w-4xl mx-auto text-center text-gray-400 text-lg leading-relaxed">
          NSG Automated Surveillance System is a fully AI-powered security platform designed to analyze CCTV footage in real time. Using deep learning, pattern recognition, and event-based monitoring, it identifies threats with high accuracy. It serves as a reliable solution for large campuses, airports, defence zones, malls, and smart cities.
        </p>
      </section>

      <section id="contact" className="py-20 px-6 bg-black">
        <h3 className="text-4xl font-bold text-center mb-10">Contact Us</h3>
        <div className="max-w-lg mx-auto p-8 bg-gray-900 rounded-2xl shadow-xl">
          <input type="text" placeholder="Your Name" className="w-full mb-5 p-3 rounded-lg bg-black border border-gray-700" />
          <input type="email" placeholder="Your Email" className="w-full mb-5 p-3 rounded-lg bg-black border border-gray-700" />
          <textarea placeholder="Message" className="w-full mb-5 p-3 rounded-lg bg-black border border-gray-700 h-32"></textarea>
          <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold">Submit</button>
        </div>
      </section>

      <footer className="py-6 text-center bg-gray-900 text-gray-400">
        © 2025 NSG Automated Surveillance • All Rights Reserved
      </footer>
    </div>
  );
}
