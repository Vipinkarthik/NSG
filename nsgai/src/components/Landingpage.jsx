<<<<<<< HEAD
import { useNavigate } from 'react-router-dom';
=======
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ShieldAlert, 
  Users, 
  Car, 
  BellRing, 
  LayoutDashboard, 
  Zap, 
  ChevronRight,
  ShieldCheck,
  MapPin,
  Building2
} from 'lucide-react';
>>>>>>> origin/VK

export default function LandingPage() {
  const navigate = useNavigate();

<<<<<<< HEAD
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
=======
  // Animation Variants
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: { transition: { staggerChildren: 0.1 } }
  };

  return (
    <div className="min-h-screen w-full bg-[#030303] text-white font-sans selection:bg-blue-500/30">
      
      {/* macOS Style Glass Header */}
      <header className="fixed top-0 w-full z-50 px-6 py-4">
        <nav className="max-w-7xl mx-auto flex justify-between items-center px-6 py-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <ShieldCheck size={20} />
            </div>
            <h1 className="text-xl font-semibold tracking-tight">NSG <span className="text-blue-500">AI</span></h1>
          </div>
          
          <div className="hidden md:flex gap-8 text-sm font-medium text-gray-400">
            {['Features', 'Solutions', 'About', 'Contact'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-white transition-colors">
                {item}
              </a>
            ))}
          </div>

          <button 
            onClick={() => navigate('/login')}
            className="px-5 py-2 text-sm font-medium bg-white text-black rounded-full hover:bg-gray-200 transition-all active:scale-95"
          >
            Login
          </button>
        </nav>
      </header>

      {/* Hero Section with Mesh Gradient */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full"></div>

        <motion.div 
          initial="initial"
          animate="animate"
          variants={staggerContainer}
          className="relative z-10 text-center max-w-4xl px-6"
        >
          <motion.span 
            variants={fadeInUp}
            className="px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-widest mb-6 inline-block"
          >
            Next-Gen Security
          </motion.span>
          
          <motion.h2 
            variants={fadeInUp}
            className="text-6xl md:text-7xl font-bold mb-8 tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400"
          >
            Surveillance <br /> redefined by AI.
          </motion.h2>

          <motion.p 
            variants={fadeInUp}
            className="text-lg md:text-xl mb-10 text-gray-400 max-w-2xl mx-auto leading-relaxed"
          >
            Automated threat detection for bombs, weapons, and abnormal behavior. 
            Real-time intelligence for a safer tomorrow.
          </motion.p>

          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate('/login')}
              className="px-8 py-4 rounded-2xl text-lg font-semibold bg-blue-600 hover:bg-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all flex items-center justify-center gap-2 group"
            >
              Get Started <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-8 py-4 rounded-2xl text-lg font-semibold bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
              Watch Demo
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20">
            <h3 className="text-4xl font-bold mb-4">Powerful Features</h3>
            <p className="text-gray-400">Everything you need to secure large scale environments.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard 
              icon={<ShieldAlert className="text-blue-500" />} 
              title="Threat Detection" 
              desc="Real-time identification of weapons, bombs, and suspicious objects." 
            />
            <FeatureCard 
              icon={<Users className="text-purple-500" />} 
              title="Crowd Monitoring" 
              desc="Behavioral analysis to detect surges or abnormal crowd movements." 
            />
            <FeatureCard 
              icon={<Car className="text-emerald-500" />} 
              title="Vehicle Tracking" 
              desc="ANPR and suspicious parking alerts integrated with live logs." 
            />
            <FeatureCard 
              icon={<BellRing className="text-orange-500" />} 
              title="Instant Alerts" 
              desc="Zero-latency notifications sent directly to response teams." 
            />
            <FeatureCard 
              icon={<LayoutDashboard className="text-pink-500" />} 
              title="Smart Dashboard" 
              desc="Mac-style intuitive interface for monitoring and analytics." 
            />
            <FeatureCard 
              icon={<Zap className="text-yellow-500" />} 
              title="Low Latency" 
              desc="High-performance edge computing for sub-second response times." 
            />
>>>>>>> origin/VK
          </div>
        </div>
      </section>

<<<<<<< HEAD
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
=======
      {/* Solutions (Apple-style Large Cards) */}
      <section id="solutions" className="py-32 px-6 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-4xl font-bold text-center mb-20 tracking-tight">Scalable Solutions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <SolutionCard title="Airports" icon={<MapPin size={40}/>} img="https://images.unsplash.com/photo-1530521954074-e64f6810b32d?auto=format&fit=crop&w=800&q=80" />
            <SolutionCard title="Malls" icon={<Building2 size={40}/>} img="https://images.unsplash.com/photo-1567449303078-57ad995bd17a?auto=format&fit=crop&w=800&q=80" />
            <SolutionCard title="Defense" icon={<ShieldCheck size={40}/>} img="https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80" />
>>>>>>> origin/VK
          </div>
        </div>
      </section>

<<<<<<< HEAD
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
=======
      {/* Contact Section */}
      <section id="contact" className="py-32 px-6">
        <div className="max-w-xl mx-auto p-10 bg-gradient-to-b from-gray-900 to-black rounded-[2.5rem] border border-white/10 shadow-2xl">
          <h3 className="text-3xl font-bold text-center mb-8">Secure your perimeter</h3>
          <div className="space-y-4">
            <input type="text" placeholder="Full Name" className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 focus:border-blue-500 outline-none transition-all" />
            <input type="email" placeholder="Work Email" className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 focus:border-blue-500 outline-none transition-all" />
            <textarea placeholder="Tell us about your needs..." className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 focus:border-blue-500 outline-none h-32 transition-all"></textarea>
            <button className="w-full py-4 bg-white text-black hover:bg-gray-200 rounded-2xl font-bold transition-all active:scale-[0.98]">
              Send Inquiry
            </button>
          </div>
        </div>
      </section>

      <footer className="py-12 text-center text-gray-500 text-sm border-t border-white/5">
        © 2026 NSG Automated Surveillance • Privacy Policy • Terms
>>>>>>> origin/VK
      </footer>
    </div>
  );
}
<<<<<<< HEAD
=======

// Sub-components for cleaner code
function FeatureCard({ icon, title, desc }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="p-8 bg-white/5 border border-white/10 rounded-[2rem] hover:bg-white/[0.08] transition-all group"
    >
      <div className="mb-6 p-3 bg-white/5 w-fit rounded-2xl group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h4 className="text-xl font-semibold mb-3">{title}</h4>
      <p className="text-gray-400 leading-relaxed text-sm">{desc}</p>
    </motion.div>
  );
}

function SolutionCard({ title, img, icon }) {
  return (
    <div className="relative h-[400px] rounded-[2.5rem] overflow-hidden group">
      <img src={img} alt={title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
      <div className="absolute bottom-8 left-8">
        <div className="text-blue-400 mb-2">{icon}</div>
        <h4 className="text-2xl font-bold">{title}</h4>
      </div>
    </div>
  );
}
>>>>>>> origin/VK
