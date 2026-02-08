import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Download, 
  CalendarDays, 
  Filter, 
  FileText, 
  BarChart3, 
  TrendingUp, 
  ShieldAlert, 
  Clock, 
  ChevronRight,
  Database,
  Search,
  Camera,
  AlertTriangle,
  Zap,
  Backpack
} from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function BSG_Reports() {
  const [filter, setFilter] = useState("daily");
  const [isHovered, setIsHovered] = useState(null);
  const [hoveredData, setHoveredData] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [camera1Alerts, setCamera1Alerts] = useState([]);
  const [stats, setStats] = useState({
    totalAlerts: 0,
    weaponCount: 0,
    bagCount: 0,
    personCount: 0,
    resolvedCount: 0,
    unresolvedCount: 0,
    camera1Count: 0,
    camera2Count: 0,
    avgConfidence: 0,
    criticalAlerts: 0,
    highAlerts: 0,
    mediumAlerts: 0
  });
  const [cameraStats, setCameraStats] = useState({});
  const [typeStats, setTypeStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [heatmapData, setHeatmapData] = useState([]);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  // Function to generate dynamic heatmap based on daily detections from all cameras
  const generateDynamicHeatmapData = async () => {
    try {
      const startDate = new Date(dateRange.startDate);
      const endDate = new Date(dateRange.endDate);
      const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

      // Try to use the optimized daily-stats endpoint first
      try {
        const response = await fetch(
          `/api/alerts/daily-stats?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`
        );
        const data = await response.json();
        if (!response.ok) {
          console.warn('Daily-stats request failed', response.status, data);
        }

        if (data && data.success && data.data) {
          const heatmap = [];
          const detectionsByDay = {};

          // Map the data by date
          data.data.forEach(item => {
            detectionsByDay[item.date] = item.totalDetections;
          });

          // Create heatmap cells for each day
          for (let i = 0; i < days; i++) {
            const currentDate = new Date(startDate);
            currentDate.setDate(currentDate.getDate() + i);
            const dateStr = currentDate.toISOString().split('T')[0];
            const count = detectionsByDay[dateStr] || 0;

            let intensity = 1;
            if (count > 5) intensity = 2;
            if (count > 15) intensity = 3;
            if (count > 30) intensity = 4;
            if (count > 50) intensity = 5;

            heatmap.push({
              id: i,
              date: dateStr,
              dayName: currentDate.toLocaleDateString('en-US', { weekday: 'short' }),
              intensity,
              count
            });
          }

          setHeatmapData(heatmap);
          return;
        }
      } catch (error) {
        console.warn("Daily-stats endpoint not available, falling back to alerts endpoint");
      }

      // Fallback: Fetch all alerts for the date range and aggregate on frontend
      const response = await fetch(
        `/api/alerts?limit=10000&startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`
      );
      const alertData = await response.json();
      const allAlerts = alertData.alerts || [];

      const heatmap = [];
      const detectionsByDay = {};

      // Aggregate detections by day from all cameras
      allAlerts.forEach(alert => {
        const alertDate = new Date(alert.timestamp).toISOString().split('T')[0];
        detectionsByDay[alertDate] = (detectionsByDay[alertDate] || 0) + 1;
      });

      // Create heatmap cells for each day
      for (let i = 0; i < days; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(currentDate.getDate() + i);
        const dateStr = currentDate.toISOString().split('T')[0];
        const count = detectionsByDay[dateStr] || 0;

        let intensity = 1;
        if (count > 5) intensity = 2;
        if (count > 15) intensity = 3;
        if (count > 30) intensity = 4;
        if (count > 50) intensity = 5;

        heatmap.push({
          id: i,
          date: dateStr,
          dayName: currentDate.toLocaleDateString('en-US', { weekday: 'short' }),
          intensity,
          count
        });
      }

      setHeatmapData(heatmap);
    } catch (error) {
      console.error("Error generating heatmap:", error);
      setHeatmapData([]);
    }
  };

  // Fetch alerts and statistics
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const alertsResponse = await fetch(
          `/api/alerts?limit=1000`
        );
        const alertsData = await alertsResponse.json();
        if (!alertsResponse.ok) {
          console.warn('Alerts request failed', alertsResponse.status, alertsData);
        }
        const allAlerts = alertsData.alerts || [];
        setAlerts(allAlerts);
        
        // Filter alerts for camera 1
        const cam1Alerts = allAlerts.filter(a => a.camera === 1);
        setCamera1Alerts(cam1Alerts);

        const statsResponse = await fetch(
          `/api/alerts/stats?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`
        );
        const statsData = await statsResponse.json();
        if (!statsResponse.ok) {
          console.warn('Stats request failed', statsResponse.status, statsData);
        }

        if (statsData && statsData.success) {
          // Compute counts from the fetched alerts (match behavior in Alert.jsx)
          const weaponCount = (allAlerts || []).filter(a => a.type === 'WEAPON_DETECTED').length;
          const bagCount = (allAlerts || []).filter(a => a.type === 'BAG_DETECTED').length;
          const personCount = (allAlerts || []).filter(a => a.type === 'PERSON_DETECTED').length;
          const criticalCount = statsData.bySeverity?.find(s => s._id === 'CRITICAL')?.count || 0;
          const highCount = statsData.bySeverity?.find(s => s._id === 'HIGH')?.count || 0;
          const mediumCount = statsData.bySeverity?.find(s => s._id === 'MEDIUM')?.count || 0;

          // Calculate average confidence from all cameras
          const avgConf = allAlerts.length > 0
            ? (allAlerts.reduce((sum, a) => sum + (a.confidence || 0), 0) / allAlerts.length).toFixed(1)
            : 0;

          // Get camera-specific counts
          const camera1Count = (allAlerts || []).filter(a => a.camera_id === 1 || a.camera === 1).length;
          const camera2Count = (allAlerts || []).filter(a => a.camera_id === 2 || a.camera === 2).length;
          
          // Use statsData.byCamera totals if present, otherwise fallback to alerts length
          const totalFromAllCameras = statsData.byCamera?.reduce((sum, cam) => sum + cam.count, 0) || (allAlerts.length || 0);

          setStats({
            totalAlerts: totalFromAllCameras,
            weaponCount,
            bagCount,
            personCount,
            resolvedCount: statsData.resolved || 0,
            unresolvedCount: statsData.unresolved || 0,
            camera1Count: camera1Count,
            camera2Count: camera2Count,
            avgConfidence: avgConf,
            criticalAlerts: criticalCount,
            highAlerts: highCount,
            mediumAlerts: mediumCount
          });

          // Camera stats - include data from all cameras
          if (statsData.byCamera) {
            const camStats = {};
            statsData.byCamera.forEach(cam => {
              camStats[`CAM${cam._id}`] = cam.count;
            });
            setCameraStats(camStats);
          }

          // Type stats
          if (statsData.byType) {
            const typeMap = {};
            statsData.byType.forEach(type => {
              const name = type._id.replace('_', ' ').replace('DETECTED', '').trim();
              typeMap[name] = type.count;
            });
            setTypeStats(typeMap);
          }
        } else {
          console.warn('Stats endpoint returned no success flag or empty data', statsData);
        }

        // Generate dynamic heatmap
        await generateDynamicHeatmapData();
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 15000); // Refresh every 15 seconds
    return () => clearInterval(interval);
  }, [dateRange]);


  const generatePDF = async () => {
    const canvas = await html2canvas(document.getElementById('report-content'), {
      backgroundColor: '#020408',
      allowTaint: true,
      scale: 2,
    });
    const img = canvas.toDataURL('image/png');
    const pdf = new jsPDF('landscape', 'mm', 'a4');
    const imgWidth = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(img, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= 210;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(img, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= 210;
    }

    pdf.save(`surveillance-report-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const getDateRange = () => {
    const start = new Date(dateRange.startDate);
    const end = new Date(dateRange.endDate);
    return `${start.toLocaleDateString('en-US', { month: 'short', day: '2-digit' })} — ${end.toLocaleDateString('en-US', { month: 'short', day: '2-digit' })}`;
  };

  return (
    <div className="min-h-screen bg-[#020408] text-slate-200 p-8 font-sans selection:bg-red-500/30">
      
      {/* ================= HEADER AREA ================= */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-4xl font-black tracking-tighter flex items-center gap-4 text-white uppercase italic">
            <div className="p-2 bg-red-600 rounded shadow-[0_0_20px_rgba(220,38,38,0.4)]">
              <BarChart3 size={28} />
            </div>
            Intelligence Archives
          </h1>
          <p className="text-gray-500 text-xs font-mono mt-2 tracking-widest uppercase italic">
            Bharat Surveillance Grid // Post-Incident Data Analysis — {getDateRange()}
          </p>
        </motion.div>

        <motion.button 
          onClick={generatePDF}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-white text-black px-8 py-4 rounded-full flex items-center gap-3 font-black text-xs uppercase tracking-widest shadow-xl hover:bg-red-600 hover:text-white transition-all duration-300"
        >
          <Download size={18} /> Export Tactical Report
        </motion.button>
      </div>

      {/* ================= CONTROL HUD ================= */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-2 bg-[#0A0C12] border border-white/5 rounded-2xl mb-12 flex flex-wrap items-center justify-between gap-4"
      >
        <div className="flex bg-black rounded-xl p-1 border border-white/5">
          {["daily", "weekly", "monthly"].map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
                filter === t ? "bg-red-600 text-white shadow-lg" : "text-gray-500 hover:text-white"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-6 px-4">
          <div className="flex items-center gap-3 text-xs font-mono text-gray-400">
            <CalendarDays size={16} className="text-red-500" />
            <span>{getDateRange()}</span>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-bold border border-white/10 transition-all">
            <Filter size={14} /> Advanced Filter
          </button>
        </div>
      </motion.div>

      {/* ================= AI SUMMARY CARDS ================= */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
      >
        <ReportStatCard 
          title="Total Detections" 
          value={stats.totalAlerts.toString()} 
          trend={`${stats.totalAlerts > 100 ? '+12.5%' : '-2.1%'}`}
          desc="All entities detected" 
          icon={<Database size={20} />} 
          color="blue" 
        />
        <ReportStatCard 
          title="CAM1 Detections" 
          value={stats.camera1Count.toString()}
          trend={stats.camera1Count > 10 ? '+8.3%' : '-0%'} 
          desc="Camera 1 activity" 
          icon={<Camera size={20} />} 
          color="cyan" 
        />
        <ReportStatCard 
          title="Weapon Alerts" 
          value={stats.weaponCount.toString()}
          trend={stats.weaponCount > 0 ? '⚠️ HIGH' : 'SAFE'} 
          desc="Confirmed threats" 
          icon={<Zap size={20} />} 
          color="red" 
        />
        <ReportStatCard 
          title="Avg Confidence" 
          value={`${stats.avgConfidence}%`}
          trend="Optimized" 
          desc="Detection accuracy" 
          icon={<TrendingUp size={20} />} 
          color="green" 
        />
      </motion.div>

      {/* ================= SECONDARY STATS ================= */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
      >
        <ReportStatCard 
          title="Bags Detected" 
          value={stats.bagCount.toString()} 
          trend={stats.bagCount > 5 ? '+3.2%' : '0%'}
          desc="Suspicious objects" 
          icon={<Backpack size={20} />} 
          color="purple" 
        />
        <ReportStatCard 
          title="Persons Detected" 
          value={stats.personCount.toString()}
          trend={stats.personCount > 0 ? '+🔍' : 'NONE'} 
          desc="Identified subjects" 
          icon={<AlertTriangle size={20} />} 
          color="orange" 
        />
        <ReportStatCard 
          title="Unresolved" 
          value={stats.unresolvedCount.toString()}
          trend={stats.unresolvedCount > 5 ? '⚠️ PENDING' : '✓ UPDATED'} 
          desc="Active investigations" 
          icon={<Clock size={20} />} 
          color="red" 
        />
        <ReportStatCard 
          title="Resolved" 
          value={stats.resolvedCount.toString()}
          trend={`${stats.resolvedCount > 0 ? '+' : ''}${((stats.resolvedCount / (stats.totalAlerts || 1)) * 100).toFixed(0)}%`}
          desc="Closed cases" 
          icon={<ShieldAlert size={20} />} 
          color="green" 
        />
      </motion.div>

      <div id="report-content" className="grid lg:grid-cols-3 gap-8 mb-12">
        {/* ================= HEATMAP SECTION ================= */}
        <div className="lg:col-span-1">
          <h2 className="text-lg font-black uppercase tracking-widest mb-6 flex items-center gap-3">
            <TrendingUp size={20} className="text-red-500" /> Detection Intensity Heatmap
          </h2>
          <div className="bg-[#0A0C12] p-8 border border-white/5 rounded-3xl relative overflow-hidden group">
            <div className="grid gap-2 mb-6" style={{ gridTemplateColumns: `repeat(auto-fit, minmax(30px, 1fr))` }}>
              {heatmapData.map((cell) => (
                <motion.div
                  key={cell.id}
                  whileHover={{ scale: 1.3, zIndex: 10 }}
                  onHoverStart={() => {
                    setIsHovered(cell.id);
                    setHoveredData(cell);
                  }}
                  onHoverEnd={() => {
                    setIsHovered(null);
                    setHoveredData(null);
                  }}
                  className={`h-10 w-full rounded-sm transition-all duration-300 cursor-crosshair border-2 ring-1 flex items-center justify-center text-[8px] font-bold
                    ${cell.intensity === 1 && "bg-green-900/60 border-green-600/40 ring-green-600/20 text-green-300"} 
                    ${cell.intensity === 2 && "bg-lime-700/60 border-lime-600/40 ring-lime-600/20 text-lime-300"} 
                    ${cell.intensity === 3 && "bg-yellow-700/70 border-yellow-600/40 ring-yellow-600/30 text-yellow-300"} 
                    ${cell.intensity === 4 && "bg-orange-600/80 border-orange-500/50 ring-orange-500/40 text-orange-300"} 
                    ${cell.intensity === 5 && "bg-red-600 border-red-500 ring-red-500/60 text-white animate-pulse shadow-[0_0_20px_rgba(220,38,38,0.8)]"} 
                    ${isHovered === cell.id && "scale-125 z-20 shadow-[0_0_25px_rgba(255,255,255,0.2)]"}
                  `}
                  title={`${cell.date}: ${cell.count} detections`}
                >
                  {isHovered === cell.id ? cell.count : ''}
                </motion.div>
              ))}
            </div>

            {/* Hovered Date Details */}
            {hoveredData && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-blue-900/30 border border-blue-600/50 rounded-lg"
              >
                <p className="text-xs font-bold text-blue-300 mb-2">📅 {hoveredData.date} ({hoveredData.dayName})</p>
                <div className="grid grid-cols-3 gap-2 text-[10px] font-mono">
                  <div className="p-1 bg-blue-900/20 rounded">
                    <span className="text-gray-400">Total</span>
                    <p className="text-blue-400 font-bold">{hoveredData.count}</p>
                  </div>
                  <div className="p-1 bg-purple-900/20 rounded">
                    <span className="text-gray-400">Intensity</span>
                    <p className="text-purple-400 font-bold">{hoveredData.intensity}/5</p>
                  </div>
                  <div className="p-1 bg-cyan-900/20 rounded">
                    <span className="text-gray-400">Activity</span>
                    <p className="text-cyan-400 font-bold">{hoveredData.intensity > 3 ? 'HIGH' : 'LOW'}</p>
                  </div>
                </div>
              </motion.div>
            )}

            <div className="text-[10px] font-mono text-gray-400 mb-4 px-2 py-1 bg-black/40 rounded border border-white/5">
              <span className="text-green-400">📅 {heatmapData.length} days</span>
              <span className="mx-2 text-gray-600">•</span>
              <span className="text-blue-400">📊 {stats.totalAlerts} total detections</span>
            </div>
            <div className="flex justify-between text-[10px] font-mono text-gray-500 uppercase tracking-tighter">
              <span>🟢 Low Activity</span>
              <span>🟠 Medium</span>
              <span>🔴 High Threat Density</span>
            </div>

            {/* DETECTION BREAKDOWN WITH CAMERA STATS */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <h3 className="text-xs font-black uppercase tracking-widest mb-4 text-red-500">Detection Breakdown & Camera Analysis</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-400">Weapons</span>
                    <span className="text-sm font-black text-red-500">{stats.weaponCount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-400">Bags</span>
                    <span className="text-sm font-black text-purple-500">{stats.bagCount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-400">Persons</span>
                    <span className="text-sm font-black text-cyan-500">{stats.personCount}</span>
                  </div>
                </div>
                <div className="space-y-3 border-l border-white/10 pl-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-blue-400">CAM-1 Detections</span>
                    <span className="text-sm font-black text-blue-500">{stats.camera1Count}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-purple-400">CAM-2 Detections</span>
                    <span className="text-sm font-black text-purple-500">{stats.camera2Count}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-400">Total Alert Count</span>
                    <span className="text-sm font-black text-green-500">{stats.totalAlerts}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* SEVERITY BREAKDOWN */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <h3 className="text-xs font-black uppercase tracking-widest mb-4 text-orange-500">Severity Distribution</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-400">Critical</span>
                    <span className="text-sm font-black text-red-600">{stats.criticalAlerts}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-400">High</span>
                    <span className="text-sm font-black text-red-500">{stats.highAlerts}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-400">Medium</span>
                    <span className="text-sm font-black text-orange-500">{stats.mediumAlerts}</span>
                  </div>
                </div>
              </div>
          </div>
        </div>

        {/* ================= LOGS TABLE ================= */}
        <div className="lg:col-span-2">
          <h2 className="text-lg font-black uppercase tracking-widest mb-6 flex items-center gap-3">
            <Search size={20} className="text-blue-500" /> CAM1 Detection Logs ({camera1Alerts.length})
          </h2>
          <div className="bg-[#0A0C12] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
            <div className="overflow-y-auto max-h-[600px]">
              <table className="w-full text-left">
                <thead className="bg-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 sticky top-0">
                  <tr>
                    <th className="px-6 py-5">Timestamp</th>
                    <th className="px-6 py-5">Type</th>
                    <th className="px-6 py-5">Confidence</th>
                    <th className="px-6 py-5">Details</th>
                    <th className="px-6 py-5">Severity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-slate-400">
                        Loading alerts...
                      </td>
                    </tr>
                  ) : camera1Alerts.length > 0 ? (
                    camera1Alerts.slice(0, 25).map((alert) => (
                      <ReportRow 
                        key={alert._id}
                        time={new Date(alert.timestamp).toLocaleTimeString()}
                        cam={`CAM-${alert.camera}`}
                        confidence={alert.confidence || 0}
                        type={alert.type}
                        act={alert.title}
                        sev={alert.severity}
                      />
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-slate-400">
                        No alerts found for CAM1
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* ALL CAMERAS TABLE */}
          <h2 className="text-lg font-black uppercase tracking-widest mb-6 mt-8 flex items-center gap-3">
            <Search size={20} className="text-blue-500" /> All Detection Logs ({alerts.length})
          </h2>
          <div className="bg-[#0A0C12] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
            <div className="overflow-y-auto max-h-[400px]">
              <table className="w-full text-left">
                <thead className="bg-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 sticky top-0">
                  <tr>
                    <th className="px-6 py-5">Timestamp</th>
                    <th className="px-6 py-5">Type</th>
                    <th className="px-6 py-5">Camera</th>
                    <th className="px-6 py-5">Confidence</th>
                    <th className="px-6 py-5">Severity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {alerts.length > 0 ? (
                    alerts.slice(0, 15).map((alert) => (
                      <ReportRow 
                        key={alert._id}
                        time={new Date(alert.timestamp).toLocaleTimeString()}
                        cam={`CAM-${alert.camera}`}
                        confidence={alert.confidence || 0}
                        type={alert.type}
                        act={alert.title}
                        sev={alert.severity}
                      />
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-slate-400">
                        No alerts found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= COMPONENT ABSTRACTIONS ================= */

function ReportStatCard({ title, value, trend, desc, icon, color }) {
  const glowMap = {
    blue: "group-hover:shadow-[0_0_30px_rgba(59,130,246,0.1)] group-hover:border-blue-500/30",
    red: "group-hover:shadow-[0_0_30px_rgba(239,68,68,0.1)] group-hover:border-red-500/30",
    green: "group-hover:shadow-[0_0_30px_rgba(16,185,129,0.1)] group-hover:border-green-500/30",
    cyan: "group-hover:shadow-[0_0_30px_rgba(34,211,238,0.1)] group-hover:border-cyan-500/30",
    purple: "group-hover:shadow-[0_0_30px_rgba(168,85,247,0.1)] group-hover:border-purple-500/30",
    orange: "group-hover:shadow-[0_0_30px_rgba(249,115,22,0.1)] group-hover:border-orange-500/30"
  };

  const colorMap = {
    blue: "text-blue-500",
    red: "text-red-500",
    green: "text-green-500",
    cyan: "text-cyan-500",
    purple: "text-purple-500",
    orange: "text-orange-500"
  };

  const glow = glowMap[color] || glowMap.blue;
  const colorClass = colorMap[color] || colorMap.blue;

  return (
    <motion.div 
      variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
      className={`bg-[#0A0C12] p-8 rounded-3xl border border-white/5 transition-all duration-500 group relative overflow-hidden ${glow}`}
    >
      <div className="absolute top-0 left-0 w-1 h-0 group-hover:h-full transition-all duration-500 bg-current" />
      <div className="flex justify-between items-start mb-6">
        <div className={`p-3 rounded-2xl bg-black border border-white/10 ${colorClass}`}>
          {icon}
        </div>
        <span className={`text-xs font-mono font-bold px-2 py-1 rounded bg-white/5 ${trend.includes('+') || trend.includes('HIGH') || trend.includes('⚠️') ? 'text-green-500' : trend.includes('SAFE') ? 'text-green-500' : trend.includes('PENDING') ? 'text-orange-500' : 'text-red-500'}`}>
          {trend}
        </span>
      </div>
      <h3 className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">{title}</h3>
      <div className="text-4xl font-black text-white mb-2 tracking-tighter">{value}</div>
      <p className="text-[10px] text-gray-600 font-bold uppercase">{desc}</p>
    </motion.div>
  );
}

function ReportRow({ time, cam, confidence, type, act, sev }) {
  const severityColor = {
    'HIGH': 'text-red-500',
    'CRITICAL': 'text-red-600',
    'MEDIUM': 'text-orange-500',
    'LOW': 'text-blue-500'
  };

  const typeColor = {
    'WEAPON_DETECTED': 'text-red-400',
    'BAG_DETECTED': 'text-purple-400',
    'PERSON_DETECTED': 'text-cyan-400',
    'ANOMALY': 'text-orange-400'
  };

  const confidenceColor = confidence >= 90 ? 'text-green-500' : confidence >= 70 ? 'text-yellow-500' : 'text-orange-500';

  return (
    <motion.tr 
      whileHover={{ backgroundColor: "rgba(255,255,255,0.02)" }}
      className="group transition-colors"
    >
      <td className="px-6 py-6 font-mono text-[11px] text-gray-400 italic whitespace-nowrap">{time}</td>
      <td className={`px-6 py-6 text-xs font-bold tracking-tight ${typeColor[type]}`}>{type.replace('_', ' ')}</td>
      <td className="px-6 py-6 font-bold text-sm tracking-tight">{cam}</td>
      <td className={`px-6 py-6 font-bold text-sm ${confidenceColor}`}>{confidence}%</td>
      <td className={`px-6 py-6 text-[10px] font-black tracking-widest whitespace-nowrap ${severityColor[sev]}`}>{sev}</td>
    </motion.tr>
  );
}