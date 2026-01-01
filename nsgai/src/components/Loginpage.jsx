import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/dashboard");
  };

  return (
    <div className="w-screen h-screen flex overflow-hidden bg-black">
      <div className="w-1/2 h-full">
        <img
          src="https://images.unsplash.com/photo-1503264116251-35a269479413"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="w-1/2 h-full bg-[#0f0f0f] flex items-center justify-center p-10 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent backdrop-blur-2xl"></div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 w-full max-w-md p-10 rounded-2xl shadow-2xl backdrop-blur-xl bg-white/5 border border-white/20"
        >
          <h1 className="text-4xl font-semibold text-center text-white mb-10">
            Login
          </h1>

          <div className="flex flex-col gap-6">
            <motion.input
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              type="text"
              placeholder="Username"
              className="w-full p-4 rounded-xl bg-white/10 text-white outline-none border border-white/20 focus:border-white/40 transition"
            />

            <motion.input
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              type="password"
              placeholder="Password"
              className="w-full p-4 rounded-xl bg-white/10 text-white outline-none border border-white/20 focus:border-white/40 transition"
            />

            <motion.button
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
              onClick={handleLogin}
              className="w-full p-4 mt-2 rounded-xl bg-white text-black font-semibold hover:scale-[1.02] transition"
            >
              Login
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
