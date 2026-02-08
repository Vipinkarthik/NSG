import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Video, 
  Maximize2, 
  Minimize2,
  Activity, 
  Target, 
  Scan, 
  ShieldAlert, 
  Settings, 
  Grid,
  ChevronRight,
  Crosshair,
  Loader,
  X,
  AlertTriangle
} from 'lucide-react';

export default function BSG_VideoAnalysis() {
  // Camera 1 state
  const [camera1Active, setCamera1Active] = useState(false);
  const [camera1Loading, setCamera1Loading] = useState(false);
  const [detection1, setDetection1] = useState({
    suspect: null,
    bags: 0,
    weapons: 0,
    timestamp: null
  });

  // Camera 2 state
  const [camera2Active, setCamera2Active] = useState(false);
  const [camera2Loading, setCamera2Loading] = useState(false);
  const [detection2, setDetection2] = useState({
    suspect: null,
    bags: 0,
    weapons: 0,
    timestamp: null
  });

  // Fullscreen state
  const [fullscreenCam, setFullscreenCam] = useState(null);

  // Refs
  const canvas1Ref = useRef(null);
  const canvas2Ref = useRef(null);
  const eventSource1Ref = useRef(null);
  const eventSource2Ref = useRef(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (eventSource1Ref.current) eventSource1Ref.current.close();
      if (eventSource2Ref.current) eventSource2Ref.current.close();
    };
  }, []);

  // Helper to start camera
  const startCamera = async (cameraId, isCamera1 = true) => {
    try {
      const setLoading = isCamera1 ? setCamera1Loading : setCamera2Loading;
      const setActive = isCamera1 ? setCamera1Active : setCamera2Active;
      const canvasRef = isCamera1 ? canvas1Ref : canvas2Ref;
      const eventSourceRef = isCamera1 ? eventSource1Ref : eventSource2Ref;
      const setDetection = isCamera1 ? setDetection1 : setDetection2;

      setLoading(true);
      console.log(`🎬 Starting camera ${cameraId}...`);

      // Tell backend to enable camera
      const enableRes = await fetch(`http://localhost:5001/api/camera/enable?camera_id=${cameraId}`, {
        method: 'POST'
      });
      const enableData = await enableRes.json();
      console.log(`✅ Camera ${cameraId} enable response:`, enableData);

      if (enableData.status !== 'enabled') {
        throw new Error(`Failed to enable camera ${cameraId}`);
      }

      setActive(true);
      console.log(`📹 Camera ${cameraId} activated, connecting to stream...`);

      // Close existing connection
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }

      // Connect to AI service EventSource for stream with retry logic
      setTimeout(() => {
        try {
          const streamUrl = `http://localhost:8000/api/camera/stream?camera_id=${cameraId}`;
          console.log(`🔗 Connecting EventSource to: ${streamUrl}`);
          
          eventSourceRef.current = new EventSource(streamUrl);

          eventSourceRef.current.onmessage = (event) => {
            try {
              // Skip keepalive messages
              if (event.data.startsWith(':')) {
                return;
              }

              const data = JSON.parse(event.data);

              // Skip error messages
              if (data.error) {
                console.log(`⚠️ Camera ${cameraId} error: ${data.error}`);
                return;
              }

              // Render frame to canvas - CRITICAL SECTION
              if (data.frame && canvasRef.current) {
                const canvas = canvasRef.current;
                const ctx = canvas.getContext('2d');

                // Fix canvas size
                canvas.width = 1280;
                canvas.height = 720;

                // Create image and draw synchronously
                const img = new Image();
                
                img.onload = () => {
                  try {
                    // Clear and redraw
                    ctx.fillStyle = '#000000';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                  } catch (e) {
                    console.error(`Draw error cam ${cameraId}:`, e.message);
                  }
                };

                img.onerror = () => {
                  console.error(`Frame load error cam ${cameraId}`);
                };

                // Trigger load
                img.src = `data:image/jpeg;base64,${data.frame}`;
              }

              // Update detection data
              setDetection({
                suspect: data.suspect,
                bags: data.bags_count || 0,
                weapons: data.weapons_count || 0,
                timestamp: new Date().toLocaleTimeString(),
                weapons_details: data.weapons_details || [],
                bags_details: data.bags_details || []
              });

              if (data.suspect || data.weapons_count > 0 || data.bags_count > 0) {
                console.log(`🎯 Detection cam ${cameraId}:`, {
                  suspect: data.suspect?.name,
                  weapons: data.weapons_count,
                  bags: data.bags_count
                });
              }
            } catch (err) {
              console.error(`Parse error cam ${cameraId}:`, err.message);
            }
          };

          eventSourceRef.current.onerror = (err) => {
            console.error(`EventSource error cam ${cameraId}:`, err);
            // Auto-reconnect
            setTimeout(() => {
              if (eventSourceRef.current) {
                eventSourceRef.current.close();
              }
            }, 1000);
          };

          console.log(`✅ EventSource connected cam ${cameraId}`);
        } catch (err) {
          console.error(`Stream setup error cam ${cameraId}:`, err);
        }
      }, 500);

      setLoading(false);
    } catch (err) {
      console.error(`❌ Camera ${cameraId} start error:`, err);
      setLoading(false);
      if (isCamera1) setCamera1Active(false);
      else setCamera2Active(false);
      alert(`Failed to start camera ${cameraId}: ${err.message}`);
    }
  };

  // Helper to stop camera
  const stopCamera = async (cameraId, isCamera1 = true) => {
    try {
      console.log(`⛔ Stopping camera ${cameraId}...`);

      const disableRes = await fetch(`http://localhost:5001/api/camera/disable?camera_id=${cameraId}`, {
        method: 'POST'
      });
      const disableData = await disableRes.json();
      console.log(`✅ Camera ${cameraId} disabled:`, disableData);
    } catch (err) {
      console.error(`Error disabling camera ${cameraId}:`, err);
    }

    const eventSourceRef = isCamera1 ? eventSource1Ref : eventSource2Ref;
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      console.log(`EventSource for camera ${cameraId} closed`);
    }

    if (isCamera1) {
      setCamera1Active(false);
      setDetection1({ suspect: null, bags: 0, weapons: 0, timestamp: null });
    } else {
      setCamera2Active(false);
      setDetection2({ suspect: null, bags: 0, weapons: 0, timestamp: null });
    }
  };

  // Camera feed component
  const CameraFeed = ({ cameraId, isCamera1 }) => {
    const active = isCamera1 ? camera1Active : camera2Active;
    const loading = isCamera1 ? camera1Loading : camera2Loading;
    const detection = isCamera1 ? detection1 : detection2;
    const canvasRef = isCamera1 ? canvas1Ref : canvas2Ref;
    const isFullscreen = fullscreenCam === cameraId;

    const containerClass = isFullscreen 
      ? "fixed inset-0 z-50 flex flex-col"
      : "relative aspect-video";

    return (
      <div className={`${containerClass} bg-black border border-white/10 overflow-hidden rounded-sm group`}>
        {/* OSD Header */}
        <div className="absolute top-0 left-0 w-full p-3 flex justify-between items-start z-20 bg-gradient-to-b from-black/80 to-transparent">
          <div className="text-[10px] space-y-1">
            <p className="font-bold">CAM-{cameraId === 1 ? '01' : '02'} — {cameraId === 1 ? 'LOCAL CAMERA' : 'IP CAMERA'}</p>
            <p className="text-gray-400">FPS: {active ? '30' : '0'} // BITRATE: {active ? '2.8' : '0'} Mbps</p>
          </div>
          <div className={`px-2 py-0.5 text-[9px] font-bold rounded flex items-center gap-2 ${
            active && (detection.suspect || detection.weapons > 0)
              ? 'bg-red-600 animate-pulse'
              : active
              ? 'bg-green-600/20 text-green-500 border border-green-500/30'
              : 'bg-gray-600/20 text-gray-400'
          }`}>
            {active && <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />}
            {active ? (detection.suspect || detection.weapons > 0 ? 'ALERT' : 'SECURE') : 'OFFLINE'}
          </div>
        </div>

        {/* Suspect Detection Overlay */}
        {active && detection.suspect && (
          <div className="absolute inset-0 z-10 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ repeat: Infinity, duration: 0.8, repeatType: 'reverse' }}
              className="absolute top-[20%] left-[30%] w-20 h-24 border-2 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.6)]"
            >
              <span className="absolute -top-6 left-0 bg-red-600 text-[7px] px-2 py-0.5 font-bold">SUSPECT</span>
            </motion.div>
          </div>
        )}

        {/* Weapon Detection Overlay */}
        {active && detection.weapons > 0 && (
          <div className="absolute inset-0 z-10 pointer-events-none">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ repeat: Infinity, duration: 0.6, repeatType: 'reverse' }}
              className="absolute top-[55%] left-[55%] w-16 h-20 border-2 border-orange-500 shadow-[0_0_20px_rgba(234,88,12,0.8)]"
            >
              <span className="absolute -top-5 left-0 bg-orange-600 text-[7px] px-1.5 py-0.5 font-bold">WEAPON</span>
            </motion.div>
          </div>
        )}

        {/* Bags Indicator */}
        {active && detection.bags > 0 && (
          <div className="absolute top-16 right-2 z-10 bg-yellow-900/40 border border-yellow-600/60 rounded px-2 py-1">
            <p className="text-[8px] font-bold text-yellow-400">BAGS: {detection.bags}</p>
          </div>
        )}

        {/* Canvas or Placeholder */}
        {active ? (
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full bg-black"
            style={{
              display: 'block',
              width: '100%',
              height: '100%',
              position: 'absolute',
              top: 0,
              left: 0,
              backgroundColor: '#000000'
            }}
          />
        ) : (
          <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-black z-0">
            <Video size={48} className="text-gray-700 mb-4" />
            <p className="text-gray-600 text-[12px] mb-4 font-bold">{cameraId === 1 ? 'LOCAL CAMERA' : 'IP CAMERA (MJPEG)'}</p>
            <button
              onClick={() => startCamera(cameraId, isCamera1)}
              disabled={loading}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-[11px] font-bold rounded-sm disabled:opacity-50 flex items-center gap-2 transition-all"
            >
              {loading && <Loader size={14} className="animate-spin" />}
              {loading ? 'Initializing...' : '▶ Start Stream'}
            </button>
          </div>
        )}

        {/* Control Buttons */}
        {active && (
          <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-30">
            <button
              onClick={() => setFullscreenCam(isFullscreen ? null : cameraId)}
              className="p-1 bg-black/60 border border-white/20 hover:bg-white/20 text-white"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
            </button>
            <button
              onClick={() => stopCamera(cameraId, isCamera1)}
              className="p-1 bg-red-900/60 border border-red-500/20 hover:bg-red-800/60 text-red-400"
              title="Stop Camera"
            >
              <X size={12} />
            </button>
          </div>
        )}

        {/* Fullscreen Close Button */}
        {isFullscreen && (
          <button
            onClick={() => setFullscreenCam(null)}
            className="absolute top-4 right-4 p-2 bg-black/60 border border-white/20 hover:bg-white/20 z-50"
          >
            <X size={16} className="text-white" />
          </button>
        )}
      </div>
    );
  };

  // Detection Card Component
  const DetectionCard = ({ title, content, severity, isCamera1 }) => {
    const colors = {
      HIGH: "border-red-500/50 bg-red-500/5",
      MED: "border-orange-500/50 bg-orange-500/5",
      LOW: "border-blue-500/50 bg-blue-500/5",
      INFO: "border-gray-500/30 bg-gray-500/5"
    };

    return (
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className={`p-3 border rounded-sm ${colors[severity]} space-y-2`}
      >
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase">
          <span>{title}</span>
          <span className="ml-auto text-[8px] font-mono text-gray-500">
            CAM-{isCamera1 ? '01' : '02'}
          </span>
        </div>
        <div className="text-[10px] ml-0">
          {content}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-[#020408] text-white font-mono selection:bg-red-500/30 overflow-hidden flex flex-col">
      
      {/* HEADER */}
      <header className="w-full p-4 flex justify-between items-center bg-[#0A0C10] border-b border-white/10 z-40">
        <div className="flex items-center gap-4">
          <div className="bg-red-600 p-1 rounded shadow-[0_0_10px_rgba(220,38,38,0.5)]">
            <ShieldAlert size={18} />
          </div>
          <div>
            <h1 className="text-xs font-black tracking-[0.3em] uppercase">Multi-Camera Surveillance</h1>
            <p className="text-[10px] text-gray-500">BHARAT SURVEILLANCE GRID // REAL-TIME ANALYTICS</p>
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

      {/* Fullscreen Camera View */}
      {fullscreenCam && (
        <div className="fixed inset-0 z-50 bg-black p-4">
          <CameraFeed cameraId={fullscreenCam} isCamera1={fullscreenCam === 1} />
        </div>
      )}

      {/* MAIN LAYOUT */}
      <main className="flex-grow flex overflow-hidden gap-4 p-4">
        
        {/* CAMERA FEEDS (2-COLUMN) */}
        <div className="flex-grow flex flex-col gap-4 overflow-auto">
          <div className="grid grid-cols-2 gap-4 h-full">
            {/* Camera 1 */}
            <CameraFeed cameraId={1} isCamera1={true} />
            
            {/* Camera 2 */}
            <CameraFeed cameraId={2} isCamera1={false} />
          </div>
        </div>

        {/* RIGHT SIDEBAR: LIVE ANALYTICS */}
        <aside className="w-96 bg-[#05070A] border border-white/10 flex flex-col rounded-sm">
          <div className="p-4 border-b border-white/10 bg-white/5">
            <h3 className="text-[11px] font-bold tracking-widest flex items-center gap-2">
              <Scan size={14} className="text-blue-500" /> MULTI-CAM DETECTION DATA
            </h3>
          </div>
          
          <div className="flex-grow overflow-y-auto p-4 space-y-4">
            {/* CAM 1 DETECTIONS */}
            <div className="border-l-2 border-blue-500 pl-3">
              <h4 className="text-[10px] font-bold text-blue-400 mb-2">📷 CAMERA 1 (LOCAL)</h4>
              
              {camera1Active ? (
                <div className="space-y-2">
                  {detection1.suspect ? (
                    <DetectionCard
                      title="SUSPECT"
                      content={
                        <>
                          <p className="font-bold text-red-400">{detection1.suspect.name}</p>
                          <p className="text-[8px] text-gray-400">DOB: {detection1.suspect.dob}</p>
                          <p className="text-[8px] text-gray-400">Case: {detection1.suspect.case}</p>
                          <p className="text-[8px] text-yellow-600 font-mono">{detection1.timestamp}</p>
                        </>
                      }
                      severity="HIGH"
                      isCamera1={true}
                    />
                  ) : (
                    <div className="p-2 bg-gray-900/40 border border-gray-700/40 rounded text-center">
                      <p className="text-[9px] text-gray-500">No suspects detected</p>
                    </div>
                  )}

                  {detection1.weapons > 0 ? (
                    <DetectionCard
                      title="WEAPONS"
                      content={
                        <>
                          <p className="font-bold text-orange-400">{detection1.weapons} WEAPON(S)</p>
                          <p className="text-[8px] text-yellow-600 font-mono">{detection1.timestamp}</p>
                        </>
                      }
                      severity="HIGH"
                      isCamera1={true}
                    />
                  ) : (
                    <div className="p-2 bg-gray-900/40 border border-gray-700/40 rounded text-center">
                      <p className="text-[9px] text-gray-500">No weapons detected</p>
                    </div>
                  )}

                  {detection1.bags > 0 ? (
                    <DetectionCard
                      title="BAGGAGE"
                      content={<p className="font-bold text-yellow-400">{detection1.bags} BAG(S)</p>}
                      severity="LOW"
                      isCamera1={true}
                    />
                  ) : (
                    <div className="p-2 bg-gray-900/40 border border-gray-700/40 rounded text-center">
                      <p className="text-[9px] text-gray-500">No bags detected</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-3 bg-gray-900/40 border border-gray-700/40 rounded">
                  <p className="text-[9px] text-gray-500">Camera offline</p>
                </div>
              )}
            </div>

            {/* CAM 2 DETECTIONS */}
            <div className="border-l-2 border-purple-500 pl-3">
              <h4 className="text-[10px] font-bold text-purple-400 mb-2">📷 CAMERA 2 (IP CAMERA)</h4>
              
              {camera2Active ? (
                <div className="space-y-2">
                  {detection2.suspect ? (
                    <DetectionCard
                      title="SUSPECT"
                      content={
                        <>
                          <p className="font-bold text-red-400">{detection2.suspect.name}</p>
                          <p className="text-[8px] text-gray-400">DOB: {detection2.suspect.dob}</p>
                          <p className="text-[8px] text-gray-400">Case: {detection2.suspect.case}</p>
                          <p className="text-[8px] text-yellow-600 font-mono">{detection2.timestamp}</p>
                        </>
                      }
                      severity="HIGH"
                      isCamera1={false}
                    />
                  ) : (
                    <div className="p-2 bg-gray-900/40 border border-gray-700/40 rounded text-center">
                      <p className="text-[9px] text-gray-500">No suspects detected</p>
                    </div>
                  )}

                  {detection2.weapons > 0 ? (
                    <DetectionCard
                      title="WEAPONS"
                      content={
                        <>
                          <p className="font-bold text-orange-400">{detection2.weapons} WEAPON(S)</p>
                          <p className="text-[8px] text-yellow-600 font-mono">{detection2.timestamp}</p>
                        </>
                      }
                      severity="HIGH"
                      isCamera1={false}
                    />
                  ) : (
                    <div className="p-2 bg-gray-900/40 border border-gray-700/40 rounded text-center">
                      <p className="text-[9px] text-gray-500">No weapons detected</p>
                    </div>
                  )}

                  {detection2.bags > 0 ? (
                    <DetectionCard
                      title="BAGGAGE"
                      content={<p className="font-bold text-yellow-400">{detection2.bags} BAG(S)</p>}
                      severity="LOW"
                      isCamera1={false}
                    />
                  ) : (
                    <div className="p-2 bg-gray-900/40 border border-gray-700/40 rounded text-center">
                      <p className="text-[9px] text-gray-500">No bags detected</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-3 bg-gray-900/40 border border-gray-700/40 rounded">
                  <p className="text-[9px] text-gray-500">Camera offline</p>
                </div>
              )}
            </div>
          </div>

          <div className="p-4 bg-red-900/10 border-t border-red-900/30">
            <button className="w-full py-3 bg-red-600 text-white text-[11px] font-black uppercase tracking-widest hover:bg-red-700 transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(220,38,38,0.3)]">
              <ShieldAlert size={14}/> Initiate Lockdown
            </button>
          </div>
        </aside>
      </main>

      {/* FOOTER */}
      <footer className="bg-[#0A0C10] border-t border-white/10 px-4 py-2 flex justify-between items-center text-[9px] text-gray-500 font-bold uppercase tracking-[0.2em]">
        <div className="flex gap-6">
          <span>CAM-1: {camera1Active ? '🟢 ACTIVE' : '⚫ OFFLINE'}</span>
          <span>CAM-2: {camera2Active ? '🟢 ACTIVE' : '⚫ OFFLINE'}</span>
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
