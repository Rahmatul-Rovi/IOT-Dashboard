import React, { useState, useEffect } from 'react';
import { Lightbulb, Power, Wifi, Cpu, ShieldAlert, Thermometer, Droplets, UserCheck, AlertTriangle } from 'lucide-react';
import Swal from 'sweetalert2';
import { db } from './firebase';
import { ref, onValue, set } from 'firebase/database';

export default function App() {
  const [isLightOn, setIsLightOn] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [motionDetected, setMotionDetected] = useState(false);
  const [temperature, setTemperature] = useState(0);
  const [humidity, setHumidity] = useState(0);

  // Firebase Realtime Listener
  useEffect(() => {
    const sensorRef = ref(db, 'sensorData');
    
    // Realtime Database Update
    const unsubscribe = onValue(sensorRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setIsLightOn(data.lightState || false);
        setMotionDetected(data.motion || false);
        setTemperature(data.temperature || 0);
        setHumidity(data.humidity || 0);
      }
    });

    return () => unsubscribe();
  }, []);

  // Light Toggle Handler (Web to Firebase)
  const handleToggleLight = () => {
    const nextState = !isLightOn;
    set(ref(db, 'sensorData/lightState'), nextState);

    Swal.fire({
      title: nextState ? 'Light Turned ON! 💡' : 'Light Turned OFF! 🔌',
      text: `Command sent to Firebase Database`,
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
    <div className="min-h-screen bg-slate-900 text-white p-4 md:p-8 flex flex-col items-center">
      
      {/* Top Header */}
      <div className="max-w-4xl w-full flex items-center justify-between mb-8 bg-slate-800 p-5 rounded-3xl border border-slate-700 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-600/20 rounded-2xl text-blue-400">
            <Cpu size={32} />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold">Smart Home Automation</h1>
            <p className="text-xs text-slate-400">ESP32 Gate Security & Environment Hub (Firebase Live)</p>
          </div>
        </div>

        <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold ${
          isConnected ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400'
        }`}>
          <Wifi size={16} className={isConnected ? 'animate-pulse' : ''} />
          {isConnected ? 'Firebase Synced' : 'Offline'}
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Security Status */}
        <div className={`p-6 rounded-3xl border transition-all duration-300 ${
          motionDetected 
            ? 'bg-red-950/40 border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.2)]' 
            : 'bg-slate-800/80 border-slate-700'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2 text-slate-200">
              <ShieldAlert className={motionDetected ? 'text-red-500 animate-bounce' : 'text-slate-400'} size={22} />
              Gate Security Status
            </h2>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              motionDetected ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-700 text-slate-300'
            }`}>
              {motionDetected ? 'ALERT' : 'CLEAR'}
            </span>
          </div>

          <div className="flex flex-col items-center justify-center py-6">
            <div className={`p-6 rounded-full mb-4 ${
              motionDetected ? 'bg-red-500/20 text-red-400' : 'bg-slate-700/50 text-slate-400'
            }`}>
              {motionDetected ? <AlertTriangle size={56} /> : <UserCheck size={56} />}
            </div>
            
            <p className="text-sm font-medium text-center text-slate-300 mb-1">
              {motionDetected ? 'Human Motion Detected Near Gate!' : 'No Movement Detected Nearby'}
            </p>
            <p className="text-xs text-slate-500">PIR Motion Sensor (HC-SR501)</p>
          </div>
        </div>

        {/* Light Control */}
        <div className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2 text-slate-200">
              <Lightbulb className={isLightOn ? 'text-amber-400' : 'text-slate-400'} size={22} />
              Home Relay Control
            </h2>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              isLightOn ? 'bg-amber-400/20 text-amber-400 border border-amber-400/30' : 'bg-slate-700 text-slate-400'
            }`}>
              {isLightOn ? 'ON' : 'OFF'}
            </span>
          </div>

          <div className="flex flex-col items-center py-4">
            <div className={`p-6 rounded-full mb-4 transition-all duration-300 ${
              isLightOn ? 'bg-amber-400/20 text-amber-400 shadow-[0_0_40px_rgba(251,191,36,0.3)]' : 'bg-slate-900 text-slate-600'
            }`}>
              <Lightbulb size={56} />
            </div>
            <p className="text-sm text-slate-400 mb-4">Control main entrance switch</p>
          </div>

          <button
            onClick={handleToggleLight}
            className={`w-full py-3.5 px-6 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all duration-300 active:scale-95 shadow-lg ${
              isLightOn
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 text-slate-950 shadow-amber-500/20'
                : 'bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 text-slate-300'
            }`}
          >
            <Power size={20} />
            {isLightOn ? 'Turn Off Light' : 'Turn On Light'}
          </button>
        </div>

        {/* Temperature Sensor */}
        <div className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-orange-500/10 text-orange-400 rounded-2xl border border-orange-500/20">
              <Thermometer size={36} />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Temperature</p>
              <h3 className="text-2xl font-extrabold text-slate-100">{temperature} °C</h3>
              <p className="text-[10px] text-slate-500">DHT11 Environment Sensor</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-full font-semibold border border-emerald-500/20">
              Live
            </span>
          </div>
        </div>

        {/* Humidity Sensor */}
        <div className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-cyan-500/10 text-cyan-400 rounded-2xl border border-cyan-500/20">
              <Droplets size={36} />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Humidity</p>
              <h3 className="text-2xl font-extrabold text-slate-100">{humidity} %</h3>
              <p className="text-[10px] text-slate-500">Relative Room Humidity</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs bg-cyan-500/10 text-cyan-400 px-2.5 py-1 rounded-full font-semibold border border-cyan-500/20">
              Live
            </span>
          </div>
        </div>

      </div>

      <div className="mt-8 text-center text-xs text-slate-500">
        ESP32 Realtime Automation Hub &bull; Connected via Firebase DB
      </div>
    </div>
  );
}