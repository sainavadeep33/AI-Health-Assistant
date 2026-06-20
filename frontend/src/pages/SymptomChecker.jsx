import React, { useState } from 'react';
import { FaStethoscope, FaSpinner } from 'react-icons/fa';

export default function SymptomChecker() {
  const [formData, setFormData] = useState({
    symptoms: [],
    duration: 'Less than 1 day',
    severity: 'Mild',
    age: '',
    notes: ''
  });
  const [symptomInput, setSymptomInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const addSymptom = (e) => {
    e.preventDefault();
    if (symptomInput.trim() && !formData.symptoms.includes(symptomInput.trim())) {
      setFormData(prev => ({ ...prev, symptoms: [...prev.symptoms, symptomInput.trim()] }));
      setSymptomInput('');
    }
  };

  const removeSymptom = (symp) => {
    setFormData(prev => ({ ...prev, symptoms: prev.symptoms.filter(s => s !== symp) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.symptoms.length === 0) return alert("Please enter at least one symptom.");
    
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/_/backend/api/symptom-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      setResult(data.response);
    } catch (err) {
      setResult("Error generating response. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
        <FaStethoscope className="text-primary" /> Symptom Checker
      </h1>
      <p className="text-slate-500 mb-8">Enter your symptoms for AI-powered educational guidance.</p>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Form */}
        <form onSubmit={handleSubmit} className="glass-card p-6 space-y-5 h-fit">
          <div>
            <label className="block text-sm font-semibold mb-2">Symptoms</label>
            <div className="flex gap-2 mb-2">
              <input type="text" value={symptomInput} onChange={e => setSymptomInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addSymptom(e)} placeholder="e.g. Headache" className="flex-1 px-4 py-2 rounded-xl border dark:border-slate-700 dark:bg-slate-800 outline-none" />
              <button type="button" onClick={addSymptom} className="btn-secondary">Add</button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
               {formData.symptoms.map(s => (
                 <span key={s} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center gap-2">
                   {s} <button type="button" onClick={() => removeSymptom(s)} className="hover:text-red-500">&times;</button>
                 </span>
               ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Duration</label>
            <select value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} className="w-full px-4 py-2 rounded-xl border dark:border-slate-700 dark:bg-slate-800 outline-none">
              <option>Less than 1 day</option>
              <option>1-3 days</option>
              <option>4-7 days</option>
              <option>More than 1 week</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-semibold mb-2">Severity</label>
                <select value={formData.severity} onChange={e => setFormData({...formData, severity: e.target.value})} className="w-full px-4 py-2 rounded-xl border dark:border-slate-700 dark:bg-slate-800 outline-none">
                  <option>Mild</option>
                  <option>Moderate</option>
                  <option>Severe</option>
                </select>
             </div>
             <div>
                <label className="block text-sm font-semibold mb-2">Age</label>
                <input type="number" required value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} className="w-full px-4 py-2 rounded-xl border dark:border-slate-700 dark:bg-slate-800 outline-none" />
             </div>
          </div>

          <div>
             <label className="block text-sm font-semibold mb-2">Additional Notes</label>
             <textarea rows="3" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className="w-full px-4 py-2 rounded-xl border dark:border-slate-700 dark:bg-slate-800 outline-none"></textarea>
          </div>

          <button type="submit" disabled={loading} className="w-full btn-primary flex justify-center items-center gap-2">
             {loading ? <><FaSpinner className="animate-spin" /> Analyzing...</> : 'Analyze Symptoms'}
          </button>
        </form>

        {/* Results */}
        <div className="h-full">
          {result ? (
            <div className="glass-card p-6 h-full border-t-4 border-primary">
              <h2 className="text-xl font-bold mb-4">Analysis Result</h2>
              <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap text-sm leading-relaxed">
                 {result}
              </div>
            </div>
          ) : (
            <div className="glass-card p-6 h-full flex flex-col items-center justify-center text-center text-slate-500 border-dashed border-2 border-slate-200 dark:border-slate-700">
               <FaStethoscope className="text-4xl mb-4 opacity-50" />
               <p>Fill out the form and click Analyze to see AI-generated insights and questions to ask your doctor.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
