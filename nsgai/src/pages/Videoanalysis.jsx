import { Link } from 'react-router-dom';
import { useRef, useState, useEffect } from "react";

export default function VideoAnalysis() {
  const webcam1Ref = useRef(null);
  const webcam2Ref = useRef(null);
  const aiCamRef = useRef(null);

  const [devices, setDevices] = useState([]);
  const [status, setStatus] = useState("");

  // Fetch list of available cameras
  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((allDevices) => {
      const videoInputs = allDevices.filter((d) => d.kind === "videoinput");
      setDevices(videoInputs);
    });
  }, []);

  // Connect Webcam 1
  const connectWebcam1 = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: devices[0] ? { deviceId: devices[0].deviceId } : true,
        audio: false
      });
      webcam1Ref.current.srcObject = stream;
      setStatus("Webcam 1 Connected");
    } catch {
      setStatus("Error: Unable to connect Webcam 1");
    }
  };

  // Connect Webcam 2
  const connectWebcam2 = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: devices[1] ? { deviceId: devices[1].deviceId } : true,
        audio: false
      });
      webcam2Ref.current.srcObject = stream;
      setStatus("Webcam 2 Connected");
    } catch {
      setStatus("Error: Unable to connect Webcam 2");
    }
  };

  // Connect AI Camera (via IP stream)
  const connectAICam = () => {
    aiCamRef.current.src = "http://localhost:5000/ai-stream"; // change if needed
    setStatus("AI Camera Connected");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      
      {/* HEADER */}
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

      {/* MAIN CONTENT */}
      <main className="pt-28 px-8">

        {/* Intro */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4">Real-Time Video Analysis</h2>
          <p className="text-gray-300 mb-4">{status || "Connect a camera to begin."}</p>
          <p className="text-gray-300 mb-6">
            Upload or stream video feeds. AI/ML models detect suspicious activities, track movements, and identify threats.
          </p>
        </section>

        {/* Upload & Live Camera Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          
          {/* Upload Video */}
          <div className="p-6 bg-gray-800 rounded-2xl shadow-lg">
            <h3 className="text-2xl font-semibold mb-2">Upload Video</h3>
            <input
              type="file"
              accept="video/*"
              className="w-full p-3 rounded-lg bg-black border border-gray-700 text-white"
            />
          </div>

          {/* Live Camera Controls */}
          <div className="p-6 bg-gray-800 rounded-2xl shadow-lg">
            <h3 className="text-2xl font-semibold mb-4">Live Camera Feed</h3>

            <div className="flex flex-col gap-3">
              <button
                onClick={connectWebcam1}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold">
                Connect Webcam 1
              </button>

              <button
                onClick={connectWebcam2}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-xl font-semibold">
                Connect Webcam 2
              </button>

              <button
                onClick={connectAICam}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-xl font-semibold">
                Connect AI Camera
              </button>
            </div>
          </div>
        </section>

        {/* LIVE CAMERA OUTPUTS */}
        <section>
          <h2 className="text-3xl font-bold mb-6">Live Streams</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Webcam 1 */}
            <div className="bg-gray-800 p-4 rounded-2xl shadow-lg">
              <h3 className="text-xl font-semibold mb-2">Webcam 1</h3>
              <video ref={webcam1Ref} autoPlay muted className="w-full h-64 bg-black rounded-xl"></video>
            </div>

            {/* Webcam 2 */}
            <div className="bg-gray-800 p-4 rounded-2xl shadow-lg">
              <h3 className="text-xl font-semibold mb-2">Webcam 2</h3>
              <video ref={webcam2Ref} autoPlay muted className="w-full h-64 bg-black rounded-xl"></video>
            </div>

            {/* AI Camera */}
            <div className="bg-gray-800 p-4 rounded-2xl shadow-lg">
              <h3 className="text-xl font-semibold mb-2">AI Camera</h3>
              <video ref={aiCamRef} autoPlay controls className="w-full h-64 bg-black rounded-xl"></video>
            </div>

          </div>
        </section>

        {/* Analysis List */}
        <section className="mt-16 mb-12">
          <h2 className="text-3xl font-bold mb-4">Analysis Features</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            <div className="p-6 bg-gray-800 rounded-2xl shadow-lg">
              <h3 className="text-xl font-semibold mb-2">Threat Detection</h3>
              <p className="text-gray-300">Automatically identifies suspicious objects and behavior.</p>
            </div>

            <div className="p-6 bg-gray-800 rounded-2xl shadow-lg">
              <h3 className="text-xl font-semibold mb-2">Object Recognition</h3>
              <p className="text-gray-300">Detect weapons, explosives, and more.</p>
            </div>

            <div className="p-6 bg-gray-800 rounded-2xl shadow-lg">
              <h3 className="text-xl font-semibold mb-2">Facial Recognition</h3>
              <p className="text-gray-300">Identify persons of interest using watchlists.</p>
            </div>

            <div className="p-6 bg-gray-800 rounded-2xl shadow-lg">
              <h3 className="text-xl font-semibold mb-2">Behavior Analysis</h3>
              <p className="text-gray-300">Detect anomalies and abnormal movement patterns.</p>
            </div>

            <div className="p-6 bg-gray-800 rounded-2xl shadow-lg">
              <h3 className="text-xl font-semibold mb-2">Historical Review</h3>
              <p className="text-gray-300">Analyze past footage for investigation.</p>
            </div>

            <div className="p-6 bg-gray-800 rounded-2xl shadow-lg">
              <h3 className="text-xl font-semibold mb-2">Heatmaps</h3>
              <p className="text-gray-300">Highlight areas with high activity.</p>
            </div>

          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="py-6 text-center bg-gray-800 text-gray-400">
        © 2025 NSG Video Analysis • All Rights Reserved
      </footer>
    </div>
  );
}
