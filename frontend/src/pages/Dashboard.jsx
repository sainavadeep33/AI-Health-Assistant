import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';

export default function Dashboard() {
  const { currentUser } = useAuth();
  
  // Demo Seed Data
  const isDemo = localStorage.getItem('demo_mode') === 'true';
  const initialData = isDemo ? { water: 2200, sleep: 7.5, steps: 6500, height: 170, weight: 60 } : { water: 0, sleep: 0, steps: 0, height: 0, weight: 0 };
  
  const [metrics, setMetrics] = useState(initialData);
  const [tip, setTip] = useState("Loading your personalized tip...");
  const [bmi, setBmi] = useState(null);
  const [bmiCategory, setBmiCategory] = useState("");

  const weeklyData = [
    { day: 'Mon', water: 1500, sleep: 6, steps: 4000 },
    { day: 'Tue', water: 1800, sleep: 6.5, steps: 5500 },
    { day: 'Wed', water: 2000, sleep: 7, steps: 6000 },
    { day: 'Thu', water: 2200, sleep: 7.5, steps: 6500 },
    { day: 'Fri', water: 2500, sleep: 8, steps: 7000 },
    { day: 'Sat', water: 2100, sleep: 7, steps: 8000 },
    { day: 'Sun', water: metrics.water, sleep: metrics.sleep, steps: metrics.steps },
  ];

  useEffect(() => {
    // Calculate BMI
    if (metrics.height > 0 && metrics.weight > 0) {
      const heightInMeters = metrics.height / 100;
      const calcBmi = (metrics.weight / (heightInMeters * heightInMeters)).toFixed(1);
      setBmi(calcBmi);
      
      if (calcBmi < 18.5) setBmiCategory("Underweight");
      else if (calcBmi < 25) setBmiCategory("Normal");
      else if (calcBmi < 30) setBmiCategory("Overweight");
      else setBmiCategory("Obese");
    }

    // Fetch Tip
    const fetchTip = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/health-tips', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ water: metrics.water, sleep: metrics.sleep, steps: metrics.steps })
        });
        const data = await res.json();
        setTip(data.tip || "Drink water regularly and stay active.");
      } catch (err) {
        setTip("Stay hydrated and maintain a regular sleep schedule for optimal health.");
      }
    };
    fetchTip();
  }, [metrics.height, metrics.weight, metrics.water, metrics.sleep, metrics.steps]);

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold mb-8">Hello, {isDemo ? "Guest" : "User"} 👋</h1>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card p-6 border-l-4 border-blue-500">
          <h3 className="text-slate-500 dark:text-slate-400 text-sm font-semibold mb-1">Daily Water</h3>
          <p className="text-3xl font-bold">{metrics.water} ml</p>
        </div>
        <div className="glass-card p-6 border-l-4 border-indigo-500">
          <h3 className="text-slate-500 dark:text-slate-400 text-sm font-semibold mb-1">Sleep</h3>
          <p className="text-3xl font-bold">{metrics.sleep} hrs</p>
        </div>
        <div className="glass-card p-6 border-l-4 border-green-500">
          <h3 className="text-slate-500 dark:text-slate-400 text-sm font-semibold mb-1">Steps</h3>
          <p className="text-3xl font-bold">{metrics.steps}</p>
        </div>
        <div className="glass-card p-6 border-l-4 border-purple-500">
          <h3 className="text-slate-500 dark:text-slate-400 text-sm font-semibold mb-1">Current BMI</h3>
          <p className="text-3xl font-bold">{bmi || '--'} <span className="text-sm font-normal text-slate-500">({bmiCategory || 'Need data'})</span></p>
        </div>
      </div>

      {/* Tip & BMI Update */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 glass-card p-6 bg-gradient-to-br from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20">
          <h3 className="font-bold text-lg mb-2 flex items-center gap-2">✨ AI Wellness Tip</h3>
          <p className="text-slate-700 dark:text-slate-300 italic">"{tip}"</p>
        </div>
        
        <div className="glass-card p-6">
          <h3 className="font-bold mb-4">Update Vitals</h3>
          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="text-xs text-slate-500">Height (cm)</label>
                <input type="number" value={metrics.height} onChange={e => setMetrics({...metrics, height: e.target.value})} className="w-full border rounded p-1 dark:bg-slate-800 dark:border-slate-700" />
             </div>
             <div>
                <label className="text-xs text-slate-500">Weight (kg)</label>
                <input type="number" value={metrics.weight} onChange={e => setMetrics({...metrics, weight: e.target.value})} className="w-full border rounded p-1 dark:bg-slate-800 dark:border-slate-700" />
             </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8">
        <div className="glass-card p-6 h-80">
           <h3 className="font-bold mb-4">Weekly Steps Activity</h3>
           <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                 <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                 <XAxis dataKey="day" />
                 <YAxis />
                 <Tooltip contentStyle={{ borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.9)' }} />
                 <Bar dataKey="steps" fill="#14b8a6" radius={[4, 4, 0, 0]} />
              </BarChart>
           </ResponsiveContainer>
        </div>
        <div className="glass-card p-6 h-80">
           <h3 className="font-bold mb-4">Water Intake Trend</h3>
           <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyData}>
                 <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                 <XAxis dataKey="day" />
                 <YAxis />
                 <Tooltip contentStyle={{ borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.9)' }} />
                 <Line type="monotone" dataKey="water" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
              </LineChart>
           </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
