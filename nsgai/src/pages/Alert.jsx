import React, { useState, useEffect } from 'react';
import { Target, Activity, Radio, ScanFace, AlertTriangle, Backpack, Zap, Clock } from "lucide-react";

const PriorityAlertFixed = ({ alert }) => {
  const getSeverityColor = (severity) => {
    switch(severity) {
      case "CRITICAL":
      case "HIGH":
        return "bg-red-600";
      case "MEDIUM":
        return "bg-orange-500";
      default:
        return "bg-yellow-500";
    }
  };

  const getAlertIcon = (type) => {
    switch(type) {
      case "WEAPON_DETECTED":
        return <Zap size={16} />;
      case "BAG_DETECTED":
        return <Backpack size={16} />;
      case "PERSON_DETECTED":
        return <ScanFace size={16} />;
      default:
        return <AlertTriangle size={16} />;
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className="relative border border-slate-800 bg-black flex-shrink-0 h-[20vh] mb-1.5 shadow-lg">
      <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${getSeverityColor(alert.severity)}`} />
      <div className="px-4 py-3 h-full flex flex-col justify-between">
        <div className="flex justify-between text-xs font-mono font-bold tracking-tight">
          <span className="text-red-500 flex items-center gap-1">
            {getAlertIcon(alert.type)}
            CAM {alert.camera} | {alert.confidence || 'N/A'}%
          </span>
          <span className="text-slate-500 flex items-center gap-1">
            <Clock size={12} /> {formatTime(alert.timestamp)}
          </span>
        </div>
        <div>
          <h4 className="text-2xl font-black text-white uppercase italic leading-none">{alert.title}</h4>
          <p className="text-sm font-mono text-cyan-400 font-bold uppercase mt-1 tracking-tight">{alert.description}</p>
          {alert.personName && <p className="text-xs text-orange-400 mt-1">Person: {alert.personName}</p>}
          {alert.weaponType && <p className="text-xs text-red-400 mt-1">Weapon: {alert.weaponType.toUpperCase()}</p>}
          {alert.bagType && <p className="text-xs text-purple-400 mt-1">Bag: {alert.bagType}</p>}
        </div>
        <div className="flex gap-2">
          <button className="px-5 py-1.5 bg-red-600 text-white text-[11px] font-black uppercase tracking-wider hover:bg-red-700">DEPLOY UNIT</button>
          <button className="px-5 py-1.5 bg-slate-800 text-white text-[11px] font-black uppercase tracking-wider border border-slate-700 hover:bg-slate-700">INTEL</button>
        </div>
      </div>
    </div>
  );
};

export default function BharatSurveillanceGrid() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCamera, setSelectedCamera] = useState('all'); // 'all', '1', '2'
  const [stats, setStats] = useState({ 
    weaponCount: 0, 
    bagCount: 0, 
    personCount: 0, 
    totalAlerts: 0,
    cam1Count: 0,
    cam2Count: 0
  });
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Fetch alerts with optional camera filter
    const fetchAlerts = async () => {
      try {
        let url = '/api/alerts?limit=20';
        if (selectedCamera !== 'all') {
          url += `&camera_id=${selectedCamera}`;
        }
        
        const response = await fetch(url);
        const data = await response.json();
        const allAlerts = data.alerts || [];
        
        // Filter alerts based on selected camera
        const filteredAlerts = selectedCamera === 'all' 
          ? allAlerts 
          : allAlerts.filter(a => a.camera_id === parseInt(selectedCamera));
        
        setAlerts(filteredAlerts);
        
        // Calculate stats from all alerts
        const weaponCount = allAlerts.filter(a => a.type === 'WEAPON_DETECTED').length;
        const bagCount = allAlerts.filter(a => a.type === 'BAG_DETECTED').length;
        const personCount = allAlerts.filter(a => a.type === 'PERSON_DETECTED').length;
        const cam1Count = allAlerts.filter(a => a.camera_id === 1).length;
        const cam2Count = allAlerts.filter(a => a.camera_id === 2).length;
        
        setStats({
          weaponCount,
          bagCount,
          personCount,
          totalAlerts: data.total || 0,
          cam1Count,
          cam2Count
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching alerts:', error);
        setLoading(false);
      }
    };

    fetchAlerts();
    const interval = setInterval(fetchAlerts, 5000); // Refresh every 5 seconds
    
    return () => clearInterval(interval);
  }, []);

  // Update current time
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimeString = (date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className="h-screen w-full bg-black text-slate-300 p-3 flex flex-col overflow-hidden">
      <header className="flex justify-between items-center h-[9vh] border-b border-slate-900 mb-2 flex-shrink-0">
        <div className="flex items-center gap-4">
          <Target size={32} className="text-red-600" />
          <div>
            <h1 className="text-xl font-black text-white uppercase italic leading-none">BHARAT SURVEILLANCE GRID <span className="text-red-600">V4.2</span></h1>
            <p className="text-[9px] text-green-500 font-black tracking-[0.2em] uppercase mt-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> SECURE CHANNEL ACTIVE
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-2 border border-slate-700 rounded-lg p-1 bg-slate-950">
            <button
              onClick={() => setSelectedCamera('all')}
              className={`px-4 py-2 rounded text-xs font-black uppercase tracking-wider transition-all ${
                selectedCamera === 'all' 
                  ? 'bg-red-600 text-white' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Cameras
            </button>
            <button
              onClick={() => setSelectedCamera('1')}
              className={`px-4 py-2 rounded text-xs font-black uppercase tracking-wider transition-all ${
                selectedCamera === '1' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              CAM-1
            </button>
            <button
              onClick={() => setSelectedCamera('2')}
              className={`px-4 py-2 rounded text-xs font-black uppercase tracking-wider transition-all ${
                selectedCamera === '2' 
                  ? 'bg-purple-600 text-white' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              CAM-2
            </button>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest">OPERATOR: NSG_01</div>
            <div className="text-2xl font-black text-white italic">{formatTimeString(currentTime)} IST</div>
          </div>
        </div>
      </header>

      <div className="flex flex-grow gap-3 overflow-hidden">
        <div className="w-[40%] flex flex-col">
          <h2 className="text-xs font-black text-white uppercase mb-2 flex items-center gap-2 italic">
            <Activity className="text-red-600" size={16} /> PRIORITY ALERTS ({stats.totalAlerts})
          </h2>
          <div className="flex flex-col flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900">
            {loading ? (
              <div className="text-slate-500 flex items-center justify-center h-full">
                <span>Loading alerts...</span>
              </div>
            ) : alerts.length > 0 ? (
              alerts.map((alert, idx) => <PriorityAlertFixed key={alert._id || idx} alert={alert} />)
            ) : (
              <div className="text-slate-500 flex items-center justify-center h-full">
                <span>No alerts at this time</span>
              </div>
            )}
          </div>
        </div>

        <div className="w-[35%] flex flex-col border border-slate-800 bg-[#010204] rounded-lg overflow-hidden relative">
          <div className="p-3 text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">DETECTION_STATISTICS</div>
          <div className="flex-grow flex flex-col items-center justify-center gap-6">
            <div className="w-full grid grid-cols-2 gap-4 px-4">
              <div className="text-center">
                <div className="text-sm font-black text-slate-400 uppercase mb-2">CAM-1</div>
                <div className="text-2xl font-black text-blue-500">{stats.cam1Count}</div>
                <div className="text-[8px] font-black text-slate-400 uppercase mt-1">Alerts</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-black text-slate-400 uppercase mb-2">CAM-2</div>
                <div className="text-2xl font-black text-purple-500">{stats.cam2Count}</div>
                <div className="text-[8px] font-black text-slate-400 uppercase mt-1">Alerts</div>
              </div>
            </div>
            <div className="w-full border-t border-slate-700 pt-4">
              <div className="text-center">
                <div className="text-3xl font-black text-red-500">{stats.weaponCount}</div>
                <div className="text-xs font-black text-slate-400 uppercase mt-1">Weapons</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 w-full">
              <div className="text-center">
                <div className="text-2xl font-black text-purple-500">{stats.bagCount}</div>
                <div className="text-xs font-black text-slate-400 uppercase mt-1">Bags</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black text-cyan-500">{stats.personCount}</div>
                <div className="text-xs font-black text-slate-400 uppercase mt-1">Persons</div>
              </div>
            </div>
          </div>
          <div className="h-10 bg-slate-950 flex items-center px-4 justify-between border-t border-slate-800 font-mono text-[9px] font-black text-slate-500">
             <span>STATUS: ACTIVE</span>
             <span className="text-green-500 animate-pulse uppercase">ALL SYSTEMS ONLINE</span>
          </div>
        </div>

        <div className="w-[25%] flex flex-col">
          <h2 className="text-lg font-black text-white uppercase mb-2 italic tracking-widest">ALERT TYPES</h2>
          <div className="grid grid-cols-2 gap-2 h-[45%] flex-shrink-0">
            <div className="relative border border-slate-800 bg-slate-950 flex flex-col group overflow-hidden">
              <div className="flex-grow flex items-center justify-center p-2">
                <Zap size={40} className="text-red-500" />
              </div>
              <div className="bg-black py-2 border-t border-slate-800">
                <p className="text-lg font-black text-center text-red-500 uppercase tracking-tighter">
                  WEAPONS
                </p>
              </div>
            </div>
            
            <div className="relative border border-slate-800 bg-slate-950 flex flex-col group overflow-hidden">
              <div className="flex-grow flex items-center justify-center p-2">
                <Backpack size={40} className="text-purple-500" />
              </div>
              <div className="bg-black py-2 border-t border-slate-800">
                <p className="text-lg font-black text-center text-purple-500 uppercase tracking-tighter">
                  BAGS
                </p>
              </div>
            </div>
            
            <div className="relative border border-slate-800 bg-slate-950 flex flex-col group overflow-hidden">
              <div className="flex-grow flex items-center justify-center p-2">
                <ScanFace size={40} className="text-cyan-500" />
              </div>
              <div className="bg-black py-2 border-t border-slate-800">
                <p className="text-base font-black text-center text-cyan-500 uppercase tracking-tighter">
                  PERSONS
                </p>
              </div>
            </div>
            
            <div className="relative border border-slate-800 bg-slate-950 flex flex-col group overflow-hidden">
              <div className="flex-grow flex items-center justify-center p-2">
                <AlertTriangle size={40} className="text-orange-500" />
              </div>
              <div className="bg-black py-2 border-t border-slate-800">
                <p className="text-lg font-black text-center text-orange-500 uppercase tracking-tighter">
                  ANOMALY
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-3 bg-slate-950/80 border border-slate-800 p-4 font-mono text-xs flex-grow overflow-hidden leading-relaxed">
            <p className="text-cyan-800 font-black">{formatTimeString(currentTime)} - System Monitoring Active</p>
            <p className="text-slate-500 font-black mt-1">AI Detection Running on all cameras</p>
            {stats.totalAlerts > 0 && (
              <p className="text-red-700 font-[1000] uppercase animate-pulse mt-2">
                {formatTimeString(currentTime)} - ALERTS IN QUEUE: {stats.totalAlerts}
              </p>
            )}
            <p className="text-slate-600 mt-2 italic font-black">Encrypting Evidence Stream...</p>
          </div>
        </div>
      </div>
    </div>
  );
}