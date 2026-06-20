import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaHome, FaRobot, FaStethoscope, FaPills, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: FaHome },
  { path: '/chat', label: 'AI Chat', icon: FaRobot },
  { path: '/symptom-checker', label: 'Symptom Checker', icon: FaStethoscope },
  { path: '/medications', label: 'Medications', icon: FaPills },
  { path: '/profile', label: 'Profile', icon: FaUser },
];

export default function Layout({ children }) {
  const location = useLocation();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 p-4 shadow-sm z-10">
        <div className="font-bold text-2xl text-primary mb-10 px-2 flex items-center gap-2">
           <FaStethoscope /> AI Health
        </div>
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link key={item.path} to={item.path} 
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-primary text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
                <Icon className="text-xl" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all">
          <FaSignOutAlt className="text-xl" />
          <span className="font-medium">Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative pb-16 md:pb-0">
        <header className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center md:hidden bg-white dark:bg-slate-800 shadow-sm z-10">
            <div className="font-bold text-xl text-primary flex items-center gap-2">
               <FaStethoscope /> AI Health
            </div>
            <button onClick={handleLogout} className="p-2 text-slate-500 hover:text-red-500">
                <FaSignOutAlt className="text-xl" />
            </button>
        </header>
        <div className="flex-1 overflow-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto h-full">
            {children}
          </div>
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 w-full bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex justify-around p-2 shadow-lg z-20">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link key={item.path} to={item.path} 
                  className={`flex flex-col items-center p-2 rounded-lg ${isActive ? 'text-primary' : 'text-slate-500'}`}>
              <Icon className="text-2xl mb-1" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
