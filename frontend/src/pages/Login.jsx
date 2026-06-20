import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaGoogle, FaEnvelope, FaUserSecret } from 'react-icons/fa';

export default function Login() {
  const { loginWithGoogle, loginAsGuest, loginWithEmail, registerWithEmail } = useAuth();
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleDemo = async () => {
    try {
      await loginAsGuest();
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to login as guest.');
    }
  };

  const handleGoogle = async () => {
    try {
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to login with Google.');
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isRegistering) {
        await registerWithEmail(email, password);
      } else {
        await loginWithEmail(email, password);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900 p-4">
      <div className="glass-card w-full max-w-md p-8">
        <h2 className="text-3xl font-bold text-center text-primary mb-6">
          {isRegistering ? 'Create Account' : 'Welcome Back'}
        </h2>
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}
        
        <form onSubmit={handleEmailAuth} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                   className="w-full px-4 py-2 rounded-xl border dark:border-slate-700 dark:bg-slate-800 focus:ring-2 focus:ring-primary outline-none transition" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
                   className="w-full px-4 py-2 rounded-xl border dark:border-slate-700 dark:bg-slate-800 focus:ring-2 focus:ring-primary outline-none transition" />
          </div>
          <button type="submit" className="w-full btn-primary">
            {isRegistering ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button onClick={() => setIsRegistering(!isRegistering)} className="text-sm text-primary hover:underline">
            {isRegistering ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </button>
        </div>

        <div className="my-6 flex items-center">
          <div className="flex-grow border-t border-slate-300 dark:border-slate-700"></div>
          <span className="mx-4 text-sm text-slate-500">OR</span>
          <div className="flex-grow border-t border-slate-300 dark:border-slate-700"></div>
        </div>

        <div className="space-y-3">
          <button onClick={handleGoogle} className="w-full flex items-center justify-center gap-2 btn-secondary">
            <FaGoogle className="text-red-500" /> Continue with Google
          </button>
          <button onClick={handleDemo} className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold py-2 px-4 rounded-xl shadow-lg transition-all">
            <FaUserSecret /> Try Guest Demo
          </button>
        </div>
      </div>
    </div>
  );
}
