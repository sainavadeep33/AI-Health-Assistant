import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaSave } from 'react-icons/fa';

export default function Profile() {
  const { currentUser } = useAuth();
  const isDemo = localStorage.getItem('demo_mode') === 'true';

  const [profile, setProfile] = useState({
    name: isDemo ? "Demo User" : (currentUser?.displayName || ""),
    age: isDemo ? "30" : "",
    gender: isDemo ? "Male" : "",
    allergies: isDemo ? "Peanuts" : "",
    conditions: isDemo ? "Asthma" : ""
  });

  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    // Simulate saving to Firestore
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
        <FaUser className="text-primary" /> My Profile
      </h1>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="glass-card p-6">
          <h2 className="text-xl font-bold mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">Basic Information</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Full Name</label>
              <input type="text" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} className="w-full px-4 py-2 rounded-xl border dark:border-slate-700 dark:bg-slate-800 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Age</label>
              <input type="number" value={profile.age} onChange={e => setProfile({...profile, age: e.target.value})} className="w-full px-4 py-2 rounded-xl border dark:border-slate-700 dark:bg-slate-800 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Gender</label>
              <select value={profile.gender} onChange={e => setProfile({...profile, gender: e.target.value})} className="w-full px-4 py-2 rounded-xl border dark:border-slate-700 dark:bg-slate-800 outline-none">
                <option value="">Select...</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <h2 className="text-xl font-bold mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">Health Context</h2>
          <p className="text-sm text-slate-500 mb-4">This information helps the AI provide more personalized and safe guidance.</p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Known Allergies</label>
              <input type="text" value={profile.allergies} onChange={e => setProfile({...profile, allergies: e.target.value})} placeholder="e.g. Peanuts, Penicillin" className="w-full px-4 py-2 rounded-xl border dark:border-slate-700 dark:bg-slate-800 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Existing Conditions</label>
              <input type="text" value={profile.conditions} onChange={e => setProfile({...profile, conditions: e.target.value})} placeholder="e.g. Asthma, Hypertension" className="w-full px-4 py-2 rounded-xl border dark:border-slate-700 dark:bg-slate-800 outline-none" />
            </div>
          </div>
        </div>

        <div className="flex justify-end items-center gap-4">
          {saved && <span className="text-green-500 font-medium animate-pulse">Profile saved successfully!</span>}
          <button type="submit" className="btn-primary flex items-center gap-2 px-8">
            <FaSave /> Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
