import React, { useState } from 'react';
import { Lightbulb, Power, Wifi, Cpu } from 'lucide-react';
import Swal from 'sweetalert2';

export default function App() {
  const [isLightOn, setIsLightOn] = useState(false);
  const [isConnected, setIsConnected] = useState(true);

  // Toggle Function with SweetAlert2 Notification
  const handleToggleLight = () => {
    const nextState = !isLightOn;
    setIsLightOn(nextState);

    Swal.fire({
      title: nextState ? 'Light Turned ON! 💡' : 'Light Turned OFF! 🔌',
      text: `Command sent successfully to ESP32.`,
      icon: nextState ? 'success' : 'info',
      timer: 1500,
      showConfirmButton: false,
      toast: true,
      position: 'top-end',
      background: '#1f2937',
      color: '#fff'
    });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-slate-800 rounded-3xl p-6 shadow-2xl border border-slate-700">
        
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-600/20 rounded-2xl text-blue-400">
              <Cpu size={28} />
            </div>
            <div>
              <h1 className="text-xl font-bold">ESP32 Automation</h1>
              <p className="text-xs text-slate-400">Home Smart Control Hub</p>
            </div>
          </div>

          {/* Connection Status Badge */}
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${
            isConnected ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400'
          }`}>
            <Wifi size={14} className={isConnected ? 'animate-pulse' : ''} />
            {isConnected ? 'Online' : 'Offline'}
          </div>
        </div>

        {/* Device Control Card */}
        <div className="bg-slate-900/80 rounded-2xl p-6 border border-slate-700/50 flex flex-col items-center">
          
          {/* Light Indicator Icon */}
          <div className={`p-8 rounded-full mb-6 transition-all duration-500 ${
            isLightOn 
              ? 'bg-amber-400/20 text-amber-400 shadow-[0_0_50px_rgba(251,191,36,0.3)] scale-105' 
              : 'bg-slate-800 text-slate-600'
          }`}>
            <Lightbulb size={64} className={isLightOn ? 'drop-shadow-[0_0_12px_rgba(251,191,36,0.8)]' : ''} />
          </div>

          <div className="text-center mb-8">
            <h2 className="text-lg font-semibold text-slate-200">Main Light / Relay</h2>
            <p className="text-sm text-slate-400 mt-1">
              Current Status: <span className={`font-bold ${isLightOn ? 'text-amber-400' : 'text-slate-500'}`}>
                {isLightOn ? 'ON' : 'OFF'}
              </span>
            </p>
          </div>

          {/* Switch Button */}
          <button
            onClick={handleToggleLight}
            className={`w-full py-4 px-6 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all duration-300 transform active:scale-95 shadow-lg ${
              isLightOn
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 shadow-amber-500/25'
                : 'bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 text-slate-300 shadow-slate-900/50'
            }`}
          >
            <Power size={22} />
            {isLightOn ? 'Turn Off Light' : 'Turn On Light'}
          </button>
        </div>

        {/* Footer Info */}
        <div className="mt-6 text-center text-xs text-slate-500">
          Syncs with ESP32 Physical Switch Push Button
        </div>

      </div>
    </div>
  );
}