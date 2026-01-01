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

export default function LandingPage() {
  const navigate = useNavigate();

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
          </div>
        </div>
      </section>

      {/* Solutions (Apple-style Large Cards) */}
      <section id="solutions" className="py-32 px-6 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-4xl font-bold text-center mb-20 tracking-tight">Scalable Solutions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <SolutionCard title="Airports" icon={<MapPin size={40}/>} img="https://images.unsplash.com/photo-1530521954074-e64f6810b32d?auto=format&fit=crop&w=800&q=80" />
            <SolutionCard title="Malls" icon={<Building2 size={40}/>} img="https://images.unsplash.com/photo-1567449303078-57ad995bd17a?auto=format&fit=crop&w=800&q=80" />
            <SolutionCard title="Defense" icon={<ShieldCheck size={40}/>} img="https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80" />
          </div>
        </div>
      </section>

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
      </footer>
    </div>
  );
}

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