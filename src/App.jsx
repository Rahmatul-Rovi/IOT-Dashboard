import React, { useState, useEffect } from 'react';
import { Lightbulb, Power, Wifi, Cpu, ShieldAlert, Thermometer, Droplets, UserCheck, AlertTriangle, Flame, Waves, Volume2 } from 'lucide-react';
import { db } from './firebase';
import { ref, onValue, set } from 'firebase/database';

export default function App() {
  const [isLightOn, setIsLightOn] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [motionDetected, setMotionDetected] = useState(false);
  const [temperature, setTemperature] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [fireAlert, setFireAlert] = useState(false);
  const [pumpActive, setPumpActive] = useState(false);
  const [pumpState, setPumpState] = useState(false);

  useEffect(() => {
    const sensorRef = ref(db, 'sensorData');
    const unsubscribe = onValue(sensorRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setIsLightOn(data.lightState || false);
        setMotionDetected(data.motion || false);
        setTemperature(data.temperature || 0);
        setHumidity(data.humidity || 0);
        setFireAlert(data.fireAlert || false);
        setPumpActive(data.pumpActive || false);
        setPumpState(data.pumpState || false);
        setIsConnected(true);
      } else {
        setIsConnected(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleToggleLight = () => {
    set(ref(db, 'sensorData/lightState'), !isLightOn);
  };

  const handleTogglePump = () => {
    set(ref(db, 'sensorData/pumpState'), !pumpState);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4 md:p-8 flex flex-col items-center">
      
      {/* Header */}
      <div className="max-w-5xl w-full flex items-center justify-between mb-8 bg-slate-800 p-5 rounded-3xl border border-slate-700 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-600/20 rounded-2xl text-blue-400">
            <Cpu size={32} />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold">Smart Home & Fire Safety Hub</h1>
            <p className="text-xs text-slate-400">ESP Automation & Security Control System</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Live Indicator Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20 text-xs font-semibold">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            LIVE
          </div>

          {/* Sync Indicator */}
          <div className={`hidden sm:flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold ${
            isConnected ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
          }`}>
            <Wifi size={16} className={isConnected ? 'animate-pulse' : ''} />
            {isConnected ? 'Firebase Synced' : 'Offline'}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* Fire Hazard & Buzzer Alert */}
        <div className={`p-6 rounded-3xl border transition-all duration-300 ${
          fireAlert 
            ? 'bg-red-900/80 border-red-500 shadow-[0_0_40px_rgba(239,68,68,0.5)] animate-pulse' 
            : 'bg-slate-800/80 border-slate-700'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2 text-slate-200">
              <Flame className={fireAlert ? 'text-red-400 animate-bounce' : 'text-slate-400'} size={24} />
              Fire Hazard & Alarm
            </h2>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              fireAlert ? 'bg-red-500 text-white animate-ping' : 'bg-slate-700 text-slate-300'
            }`}>
              {fireAlert ? 'FIRE DETECTED' : 'SAFE'}
            </span>
          </div>

          <div className="flex flex-col items-center justify-center py-4">
            <div className={`p-5 rounded-full mb-3 ${
              fireAlert ? 'bg-red-500 text-white' : 'bg-slate-700/50 text-slate-400'
            }`}>
              {fireAlert ? <Volume2 size={48} className="animate-bounce" /> : <Flame size={48} />}
            </div>
            <p className="text-sm font-bold text-center text-slate-200">
              {fireAlert ? 'ALARM ACTIVE: FIRE DETECTED!' : 'No Fire Detected'}
            </p>
          </div>
        </div>

        {/* Water Pump */}
        <div className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-bold flex items-center gap-2 text-slate-200">
              <Waves className={pumpActive ? 'text-cyan-400' : 'text-slate-400'} size={22} />
              Water Pump
            </h2>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              pumpActive ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-400/30' : 'bg-slate-700 text-slate-400'
            }`}>
              {pumpActive ? 'PUMPING' : 'IDLE'}
            </span>
          </div>

          <div className="flex flex-col items-center py-2">
            <div className={`p-5 rounded-full mb-2 transition-all duration-300 ${
              pumpActive ? 'bg-cyan-500/20 text-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.4)] animate-pulse' : 'bg-slate-900 text-slate-600'
            }`}>
              <Waves size={48} />
            </div>
          </div>

          <button
            onClick={handleTogglePump}
            disabled={fireAlert}
            className={`w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
              fireAlert 
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700' 
                : pumpState 
                ? 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-lg shadow-cyan-500/20' 
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            <Power size={16} />
            {fireAlert ? 'Auto Controlled (Fire Mode)' : pumpState ? 'Stop Pump' : 'Start Pump'}
          </button>
        </div>

        {/* Outdoor Motion Detection */}
        <div className={`p-6 rounded-3xl border transition-all duration-300 ${
          motionDetected ? 'bg-red-950/40 border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.2)]' : 'bg-slate-800/80 border-slate-700'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2 text-slate-200">
              <ShieldAlert className={motionDetected ? 'text-red-500 animate-bounce' : 'text-slate-400'} size={22} />
              Outdoor Motion
            </h2>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              motionDetected ? 'bg-red-500 text-white' : 'bg-slate-700 text-slate-300'
            }`}>
              {motionDetected ? 'DETECTED' : 'CLEAR'}
            </span>
          </div>

          <div className="flex flex-col items-center justify-center py-2">
            <div className={`p-5 rounded-full mb-3 ${
              motionDetected ? 'bg-red-500/20 text-red-400' : 'bg-slate-700/50 text-slate-400'
            }`}>
              {motionDetected ? <AlertTriangle size={48} /> : <UserCheck size={48} />}
            </div>
            <p className="text-sm font-medium text-center text-slate-300">
              {motionDetected ? 'Someone Detected Outside!' : 'No Movement Outside'}
            </p>
          </div>
        </div>

        {/* Light Relay */}
        <div className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-bold flex items-center gap-2 text-slate-200">
              <Lightbulb className={isLightOn ? 'text-amber-400' : 'text-slate-400'} size={22} />
              Home Light
            </h2>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              isLightOn ? 'bg-amber-400/20 text-amber-400' : 'bg-slate-700 text-slate-400'
            }`}>
              {isLightOn ? 'ON' : 'OFF'}
            </span>
          </div>

          <div className="flex flex-col items-center py-2">
            <div className={`p-5 rounded-full mb-2 ${
              isLightOn ? 'bg-amber-400/20 text-amber-400 shadow-[0_0_30px_rgba(251,191,36,0.3)]' : 'bg-slate-900 text-slate-600'
            }`}>
              <Lightbulb size={48} />
            </div>
          </div>

          <button
            onClick={handleToggleLight}
            className={`w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
              isLightOn ? 'bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-lg shadow-amber-500/20' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            <Power size={16} />
            {isLightOn ? 'Turn Off Light' : 'Turn On Light'}
          </button>
        </div>

        {/* Temperature Card */}
        <div className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700 flex items-center justify-between shadow-lg hover:border-amber-500/40 transition-all duration-300">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-amber-500/10 text-amber-500 rounded-2xl border border-amber-500/20 flex items-center justify-center">
              <Thermometer size={32} />
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-xs font-medium">Temperature</span>
                <span className="bg-amber-500/10 text-amber-500 text-[10px] px-2 py-0.5 rounded-full font-bold border border-amber-500/20">
                  Sensor Active
                </span>
              </div>
              <h3 className="text-2xl font-extrabold text-slate-100">{temperature} °C</h3>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20 text-xs font-semibold self-start sm:self-center">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            LIVE
          </div>
        </div>

        {/* Humidity Card */}
        <div className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700 flex items-center justify-between shadow-lg hover:border-cyan-500/40 transition-all duration-300">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-cyan-500/10 text-cyan-400 rounded-2xl border border-cyan-500/20 flex items-center justify-center">
              <Droplets size={32} />
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-xs font-medium">Humidity</span>
                <span className="bg-cyan-500/10 text-cyan-400 text-[10px] px-2 py-0.5 rounded-full font-bold border border-cyan-500/20">
                  Sensor Active
                </span>
              </div>
              <h3 className="text-2xl font-extrabold text-slate-100">{humidity} %</h3>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20 text-xs font-semibold self-start sm:self-center">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            LIVE
          </div>
        </div>

      </div>
    </div>
  );
}