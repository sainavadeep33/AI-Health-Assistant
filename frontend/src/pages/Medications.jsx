import React, { useState, useEffect } from 'react';
import { FaPills, FaTrash, FaPlus, FaBell } from 'react-icons/fa';

export default function Medications() {
  const isDemo = localStorage.getItem('demo_mode') === 'true';
  const initialMeds = isDemo ? [
    { id: 1, name: "Paracetamol 500mg", dosage: "1 Tablet", time: "08:00", notes: "After food" },
    { id: 2, name: "Vitamin C", dosage: "1 Tablet", time: "09:00", notes: "Daily supplement" }
  ] : [];

  const [medications, setMedications] = useState(initialMeds);
  const [form, setForm] = useState({ name: '', dosage: '', time: '', notes: '' });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    // Request notification permission
    if ("Notification" in window) {
      Notification.requestPermission();
    }
  }, []);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.name || !form.time) return;
    setMedications([...medications, { ...form, id: Date.now() }]);
    setForm({ name: '', dosage: '', time: '', notes: '' });
    setShowForm(false);
  };

  const handleDelete = (id) => {
    setMedications(medications.filter(m => m.id !== id));
  };

  return (
    <div className="animate-fade-in max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <FaPills className="text-purple-500" /> Medications
        </h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2">
          <FaPlus /> Add Reminder
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="glass-card p-6 mb-8 animate-fade-in border-l-4 border-purple-500">
          <h2 className="font-bold mb-4">New Medication</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Medicine Name</label>
              <input required type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-3 py-2 rounded-lg border dark:border-slate-700 dark:bg-slate-800 outline-none" />
            </div>
            <div>
              <label className="block text-sm mb-1">Dosage</label>
              <input type="text" value={form.dosage} onChange={e => setForm({...form, dosage: e.target.value})} className="w-full px-3 py-2 rounded-lg border dark:border-slate-700 dark:bg-slate-800 outline-none" />
            </div>
            <div>
              <label className="block text-sm mb-1">Time</label>
              <input required type="time" value={form.time} onChange={e => setForm({...form, time: e.target.value})} className="w-full px-3 py-2 rounded-lg border dark:border-slate-700 dark:bg-slate-800 outline-none" />
            </div>
            <div>
              <label className="block text-sm mb-1">Notes</label>
              <input type="text" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} className="w-full px-3 py-2 rounded-lg border dark:border-slate-700 dark:bg-slate-800 outline-none" />
            </div>
          </div>
          <div className="mt-4 flex gap-2 justify-end">
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Save</button>
          </div>
        </form>
      )}

      {medications.length === 0 ? (
        <div className="glass-card p-12 text-center text-slate-500 border-dashed border-2">
          <FaBell className="text-5xl mx-auto mb-4 text-slate-300 dark:text-slate-600" />
          <p className="text-lg">No medications added. Add your first reminder.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {medications.map(med => (
            <div key={med.id} className="glass-card p-5 flex justify-between items-center hover:-translate-y-1 transition-transform border-l-4 border-blue-500">
              <div className="flex items-center gap-4">
                <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-xl text-purple-600 dark:text-purple-300">
                  <FaPills className="text-xl" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{med.name}</h3>
                  <p className="text-sm text-slate-500 flex gap-2">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{med.time}</span> • {med.dosage}
                  </p>
                  {med.notes && <p className="text-xs text-slate-400 mt-1">{med.notes}</p>}
                </div>
              </div>
              <button onClick={() => handleDelete(med.id)} className="text-red-400 hover:text-red-600 p-2 bg-red-50 dark:bg-red-900/20 rounded-lg transition-colors">
                <FaTrash />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
