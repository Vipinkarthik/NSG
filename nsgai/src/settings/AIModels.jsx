import { Eye } from "lucide-react";

export default function AIModels() {
  return (
    <Section title="AI Models" icon={<Eye />}>
      <ul className="space-y-4 text-sm text-gray-400">
        <li>• Weapon Detection Model — ACTIVE</li>
        <li>• Face Recognition — ACTIVE</li>
        <li>• Crowd Analysis — ACTIVE</li>
        <li>• Behavior Anomaly Detection — STANDBY</li>
      </ul>
    </Section>
  );
}

function Section({ title, icon, children }) {
  return (
    <div className="bg-[#0A0C12] border border-white/5 p-8 rounded-3xl">
      <div className="flex items-center gap-3 mb-6">
        {icon}
        <h2 className="font-black uppercase text-sm tracking-widest">
          {title}
        </h2>
      </div>
      {children}
    </div>
  );
}
