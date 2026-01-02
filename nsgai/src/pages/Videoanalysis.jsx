import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Video, 
  Maximize2, 
  Activity, 
  Target, 
  Scan, 
  ShieldAlert, 
  Settings, 
  Grid,
  ChevronRight,
  Crosshair
} from 'lucide-react';

export default function BSG_VideoAnalysis() {
  const [activeFeeds, setActiveFeeds] = useState([
    { id: 'CAM-01', zone: 'NORTH GATE', status: 'ALERT', img: 'https://images.unsplash.com/photo-1541888946425-d81bb19480c5?auto=format&fit=crop&w=600&q=80' },
    { id: 'CAM-02', zone: 'PERIMETER FENCE', status: 'SECURE', img: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80' },
    { id: 'CAM-03', zone: 'MAIN TERMINAL', status: 'SECURE', img: 'https://images.unsplash.com/photo-1517404215738-15263e9f9178?auto=format&fit=crop&w=600&q=80' },
    { id: 'CAM-04', zone: 'LOBBY EAST', status: 'WARNING', img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80' },
  ]);

  return (
    <div className="min-h-screen bg-[#020408] text-white font-mono selection:bg-red-500/30 overflow-hidden flex flex-col">
      
      {/* ================= TACTICAL HEADER ================= */}
      <header className="w-full p-4 flex justify-between items-center bg-[#0A0C10] border-b border-white/10 z-50">
        <div className="flex items-center gap-4">
          <div className="bg-red-600 p-1 rounded shadow-[0_0_10px_rgba(220,38,38,0.5)]">
            <ShieldAlert size={18} />
          </div>
          <div>
            <h1 className="text-xs font-black tracking-[0.3em] uppercase">Tactical Multiview</h1>
            <p className="text-[10px] text-gray-500">BHARAT SURVEILLANCE GRID // ANALYTICS ENGINE</p>
          </div>
        </div>
        
        <nav className="flex gap-8 text-[11px] font-bold uppercase tracking-widest text-gray-400">
          <Link to="/dashboard" className="hover:text-white flex items-center gap-2"><Grid size={14}/> Dashboard</Link>
          <Link to="/videoanalysis" className="text-red-500 flex items-center gap-2"><Video size={14}/> Live Analysis</Link>
          <Link to="/alerts" className="hover:text-white">Alerts</Link>
        </nav>

        <div className="flex items-center gap-4 text-[11px] bg-black/40 px-3 py-1 border border-white/5">
           <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
           GPS: 28.6139° N, 77.2090° E
        </div>
      </header>

      {/* ================= CONTROL ROOM LAYOUT ================= */}
      <main className="flex-grow flex overflow-hidden">
        
        {/* LEFT SIDE: MULTI-FEED GRID */}
        <div className="flex-grow p-4 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
            {activeFeeds.map((feed) => (
              <div key={feed.id} className="relative group bg-black border border-white/10 overflow-hidden aspect-video rounded-sm">
                
                {/* OSD (On Screen Display) */}
                <div className="absolute top-0 left-0 w-full p-3 flex justify-between items-start z-10 bg-gradient-to-b from-black/80 to-transparent">
                  <div className="text-[10px] space-y-1">
                    <p className="font-bold">{feed.id} — {feed.zone}</p>
                    <p className="text-gray-400">FPS: 60 // BITRATE: 4.2 Mbps</p>
                  </div>
                  <div className={`px-2 py-0.5 text-[9px] font-bold rounded ${feed.status === 'ALERT' ? 'bg-red-600 animate-pulse' : 'bg-green-600/20 text-green-500 border border-green-500/30'}`}>
                    {feed.status}
                  </div>
                </div>

                {/* AI TARGETING OVERLAY (Realistic Bounding Box) */}
                {feed.status === 'ALERT' && (
                  <div className="absolute inset-0 z-10 pointer-events-none">
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ repeat: Infinity, duration: 1, repeatType: 'reverse' }}
                      className="absolute top-[30%] left-[40%] w-24 h-32 border-2 border-red-500"
                    >
                      <span className="absolute -top-5 left-0 bg-red-600 text-[8px] px-1 font-bold">SUSPECT // WEAPON?</span>
                    </motion.div>
                  </div>
                )}

                <img 
                  src={feed.img} 
                  alt={feed.zone} 
                  className={`w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-500 ${feed.status === 'ALERT' ? 'sepia-[.2] contrast-125' : 'grayscale group-hover:grayscale-0'}`} 
                />

                {/* VIEW CONTROLS */}
                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                  <button className="p-1.5 bg-black/60 border border-white/20 hover:bg-white/20"><Maximize2 size={14}/></button>
                  <button className="p-1.5 bg-black/60 border border-white/20 hover:bg-white/20"><Settings size={14}/></button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE: LIVE ANALYSIS LOG */}
        <aside className="w-80 bg-[#05070A] border-l border-white/10 flex flex-col">
          <div className="p-4 border-b border-white/10 bg-white/5">
            <h3 className="text-[11px] font-bold tracking-widest flex items-center gap-2">
              <Scan size={14} className="text-blue-500" /> LIVE META-DATA
            </h3>
          </div>
          
          <div className="flex-grow overflow-y-auto p-4 space-y-6">
            <DetectionLog time="12:04:12" type="FACE" desc="ID #4492 matched: Watchlist A" severity="HIGH" />
            <DetectionLog time="12:04:09" type="OBJECT" desc="Metallic Tool detected (CAM-01)" severity="LOW" />
            <DetectionLog time="12:03:55" type="CROWD" desc="Bottleneck formation: Gate 4" severity="MED" />
            <DetectionLog time="12:03:30" type="VEHICLE" desc="DL-4C-XX-0000 Entry logged" severity="INFO" />
          </div>

          <div className="p-4 bg-red-900/10 border-t border-red-900/30">
            <button className="w-full py-3 bg-red-600 text-white text-[11px] font-black uppercase tracking-widest hover:bg-red-700 transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(220,38,38,0.3)]">
              <ShieldAlert size={14}/> Initiate Lockdown
            </button>
          </div>
        </aside>
      </main>

      {/* FOOTER: SYSTEM STATUS */}
      <footer className="bg-[#0A0C10] border-t border-white/10 px-4 py-2 flex justify-between items-center text-[9px] text-gray-500 font-bold uppercase tracking-[0.2em]">
        <div className="flex gap-6">
          <span>CORES: 32 ACTIVE</span>
          <span>GPU LOAD: 78%</span>
          <span>LATENCY: 14MS</span>
        </div>
        <div className="flex gap-4">
          <span className="text-blue-500">ENCRYPTION: AES-256</span>
          <span className="text-red-600">PROTOCOL: BSG-V4</span>
        </div>
      </footer>
    </div>
  );
}

function DetectionLog({ time, type, desc, severity }) {
  const colors = {
    HIGH: "text-red-500 border-red-500/30 bg-red-500/5",
    MED: "text-orange-500 border-orange-500/30 bg-orange-500/5",
    LOW: "text-blue-500 border-blue-500/30 bg-blue-500/5",
    INFO: "text-gray-500 border-white/5 bg-white/5"
  };

  return (
    <div className={`p-3 border-l-2 rounded-r ${colors[severity]} space-y-1 animate-in fade-in slide-in-from-right-2 duration-500`}>
      <div className="flex justify-between items-center">
        <span className="text-[9px] font-black">{type}</span>
        <span className="text-[8px] opacity-60 font-mono">{time}</span>
      </div>
      <p className="text-[10px] font-medium leading-tight">{desc}</p>
    </div>
  );
}