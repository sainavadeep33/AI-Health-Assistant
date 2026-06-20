import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaHeartbeat, FaStethoscope, FaChartLine, FaPills, FaLanguage, FaMoon, FaSun } from 'react-icons/fa';

export default function LandingPage() {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'te' : 'en';
    i18n.changeLanguage(newLang);
  };

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 text-primary font-bold text-2xl">
          <FaHeartbeat className="text-3xl" /> AI Health
        </div>
        <div className="flex gap-4 items-center">
          <button onClick={toggleLanguage} className="btn-secondary flex items-center gap-2 rounded-full p-2" title="Toggle Language">
            <FaLanguage className="text-xl" />
          </button>
          <button onClick={toggleDarkMode} className="btn-secondary rounded-full p-2" title="Toggle Dark Mode">
             <span className="hidden dark:block"><FaSun className="text-xl" /></span>
             <span className="block dark:hidden"><FaMoon className="text-xl" /></span>
          </button>
          <Link to="/login" className="btn-primary">Sign In / Demo</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 pt-20 pb-16 text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white mb-6">
          Your AI-powered <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">health companion</span>
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-300 mb-10 max-w-2xl mx-auto">
          Symptom guidance, wellness tracking, and healthy habits — all powered by advanced AI. Get started in seconds.
        </p>
        <Link to="/login" className="btn-primary text-lg px-8 py-4 rounded-full">
          Try the Demo Now
        </Link>
      </main>

      {/* Features Section */}
      <section className="bg-white dark:bg-slate-800 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Everything you need</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-card p-8 text-center hover:-translate-y-2 transition-transform">
              <div className="bg-blue-100 dark:bg-blue-900 w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4 text-primary text-2xl">
                <FaStethoscope />
              </div>
              <h3 className="text-xl font-bold mb-2">AI Symptom Checker</h3>
              <p className="text-slate-600 dark:text-slate-400">Describe how you feel and get instant educational guidance.</p>
            </div>
            <div className="glass-card p-8 text-center hover:-translate-y-2 transition-transform">
              <div className="bg-teal-100 dark:bg-teal-900 w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4 text-secondary text-2xl">
                <FaChartLine />
              </div>
              <h3 className="text-xl font-bold mb-2">Health Dashboard</h3>
              <p className="text-slate-600 dark:text-slate-400">Track your daily water intake, sleep, and steps visually.</p>
            </div>
            <div className="glass-card p-8 text-center hover:-translate-y-2 transition-transform">
              <div className="bg-purple-100 dark:bg-purple-900 w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4 text-purple-500 text-2xl">
                <FaPills />
              </div>
              <h3 className="text-xl font-bold mb-2">Medication Reminders</h3>
              <p className="text-slate-600 dark:text-slate-400">Never miss a dose with simple, reliable push notifications.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer / Disclaimer */}
      <footer className="bg-slate-100 dark:bg-slate-900 py-10 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-slate-500 dark:text-slate-400">
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 rounded-xl max-w-3xl mx-auto mb-6">
            <strong>Medical Disclaimer:</strong> This application provides educational information only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
          </div>
          <p>&copy; {new Date().getFullYear()} AI Health Assistant. Demo built for Google Build with AI.</p>
        </div>
      </footer>
    </div>
  );
}
