import React, { useState } from 'react';
import { Eye, EyeOff, Heart, LockKeyhole } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const LoginGate = () => {
  const { login } = useAuth();
  const [role, setRole] = useState('bride');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (login(role, password)) return;
    setError('That password does not match this account. Please try again.');
    setPassword('');
  };

  return (
    <main className="min-h-screen px-5 py-10 flex items-center justify-center bg-[#FAF7F2] text-slate-800">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto mb-5 w-14 h-14 rounded-2xl gold-gradient-bg flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Heart className="w-7 h-7 text-white fill-white" />
          </div>
          <p className="text-xs font-bold tracking-[0.24em] uppercase text-amber-700">Wedding planner</p>
          <h1 className="mt-2 font-serif-heading text-4xl font-bold text-slate-900">Welcome back</h1>
          <p className="mt-2 text-sm text-slate-500">Sign in to manage your celebration together.</p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card rounded-3xl p-6 sm:p-8 shadow-xl shadow-stone-900/5">
          <fieldset>
            <legend className="text-sm font-semibold text-slate-700 mb-3">Who is signing in?</legend>
            <div className="grid grid-cols-2 gap-3">
              {['bride', 'groom'].map((account) => (
                <button
                  key={account}
                  type="button"
                  onClick={() => { setRole(account); setError(''); }}
                  className={`rounded-2xl border px-4 py-3 text-sm font-bold capitalize transition-all ${role === account ? 'border-amber-500 bg-amber-50 text-amber-800 ring-2 ring-amber-200' : 'border-slate-200 bg-white text-slate-500 hover:border-amber-300'}`}
                >
                  {account}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="mt-6">
            <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
            <div className="relative">
              <LockKeyhole className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => { setPassword(event.target.value); setError(''); }}
                autoComplete="current-password"
                required
                autoFocus
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-11 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                placeholder={`Enter the ${role}'s password`}
              />
              <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-2.5 p-0.5 text-slate-400 hover:text-slate-700" aria-label={showPassword ? 'Hide password' : 'Show password'}>
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {error && <p className="mt-2 text-xs font-medium text-rose-600" role="alert">{error}</p>}
          </div>

          <button type="submit" className="mt-6 w-full rounded-xl gold-gradient-bg py-3 text-sm font-bold text-white shadow-md shadow-amber-500/25 transition hover:brightness-105">
            Sign in as {role === 'bride' ? 'Bride' : 'Groom'}
          </button>
        </form>
        <p className="mt-5 text-center text-xs leading-5 text-slate-400">This static-site login is a convenience gate, not secure password protection.</p>
      </div>
    </main>
  );
};
