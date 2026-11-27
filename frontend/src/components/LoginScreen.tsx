import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Lock, Mail, User, Building2, ArrowLeft } from 'lucide-react';

interface LoginScreenProps {
  onAuthenticated: () => void;
}

export function LoginScreen({ onAuthenticated }: LoginScreenProps) {
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [orgName, setOrgName] = useState('');
  const [resetSent, setResetSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'forgot') {
      setResetSent(true);
      return;
    }
    onAuthenticated();
  };

  return (
    <div className="min-h-dvh bg-[#0F172A] text-slate-100 flex flex-col justify-between px-4 py-4 sm:px-6 sm:py-5 relative overflow-y-auto overflow-x-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#0052cc26,transparent_55%)] pointer-events-none" />

      {/* Top Brand Bar */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between gap-3 z-10 shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm overflow-hidden shrink-0">
            <img src="/logo.jpeg" alt="TenderIQ" className="w-5 h-5 object-contain" />
          </div>
          <span className="text-base font-semibold tracking-tight text-white truncate">TenderIQ</span>
        </div>
      </header>

      {/* Centered Auth Card */}
      <main className="w-full max-w-[420px] mx-auto z-10 my-6 sm:my-4">
        <div className="bg-transparent border-0 p-0 sm:bg-slate-900/90 sm:border sm:border-slate-800 sm:rounded-2xl sm:p-6 sm:shadow-2xl sm:backdrop-blur-sm">
          {mode !== 'forgot' ? (
            <>
              <div className="mb-5 sm:mb-4">
                <h1 className="text-xl sm:text-xl font-semibold text-white tracking-tight">
                  {mode === 'signin' ? 'Sign in to TenderIQ' : 'Create your workspace'}
                </h1>
                <p className="text-xs sm:text-xs text-slate-400 mt-1 leading-relaxed">
                  {mode === 'signin'
                    ? 'Access your RFP analyzer, compliance matrix, and bid library.'
                    : 'Set up your team environment for AI-assisted tender responses.'}
                </p>
              </div>

              {/* Mode Switcher */}
              <div className="grid grid-cols-2 gap-1 p-1 bg-slate-950/90 border border-slate-800 rounded-xl sm:rounded-lg mb-4">
                <button
                  type="button"
                  onClick={() => setMode('signin')}
                  className={`min-h-[38px] sm:min-h-0 py-2 sm:py-1.5 text-xs font-medium rounded-lg sm:rounded-md transition ${
                    mode === 'signin'
                      ? 'bg-[#0052cc] text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className={`min-h-[38px] sm:min-h-0 py-2 sm:py-1.5 text-xs font-medium rounded-lg sm:rounded-md transition ${
                    mode === 'signup'
                      ? 'bg-[#0052cc] text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Create Account
                </button>
              </div>

              {/* Google OAuth Button */}
              <button
                type="button"
                onClick={onAuthenticated}
                className="w-full min-h-[44px] sm:min-h-[38px] bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-900 font-medium text-sm py-2.5 sm:py-2 px-4 rounded-xl sm:rounded-lg flex items-center justify-center gap-2.5 transition shadow-sm"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24Z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14Z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96Z"
                  />
                </svg>
                <span>{mode === 'signin' ? 'Sign in with Google' : 'Sign up with Google'}</span>
              </button>

              {/* Divider */}
              <div className="relative my-4 sm:my-3.5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-800" />
                </div>
                <div className="relative flex justify-center text-[11px]">
                  <span className="bg-[#0F172A] sm:bg-slate-900 px-2.5 text-slate-500">or continue with email</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-3">
                {mode === 'signup' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5 sm:mb-1">Full Name</label>
                      <div className="relative">
                        <User className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          autoComplete="name"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Zahid Ahmed"
                          className="w-full min-h-[44px] sm:min-h-[38px] bg-slate-950 border border-slate-800 focus:border-[#0052cc] rounded-xl sm:rounded-lg pl-9 pr-3 py-2.5 sm:py-2 text-base sm:text-sm text-white placeholder-slate-500 outline-none transition"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5 sm:mb-1">Organization</label>
                      <div className="relative">
                        <Building2 className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          autoComplete="organization"
                          value={orgName}
                          onChange={(e) => setOrgName(e.target.value)}
                          placeholder="Bid Operations"
                          className="w-full min-h-[44px] sm:min-h-[38px] bg-slate-950 border border-slate-800 focus:border-[#0052cc] rounded-xl sm:rounded-lg pl-9 pr-3 py-2.5 sm:py-2 text-base sm:text-sm text-white placeholder-slate-500 outline-none transition"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5 sm:mb-1">Work Email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      autoComplete="email"
                      inputMode="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="w-full min-h-[44px] sm:min-h-[38px] bg-slate-950 border border-slate-800 focus:border-[#0052cc] rounded-xl sm:rounded-lg pl-9 pr-3 py-2.5 sm:py-2 text-base sm:text-sm text-white placeholder-slate-500 outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5 sm:mb-1">
                    <label className="block text-xs font-medium text-slate-300">Password</label>
                    {mode === 'signin' && (
                      <button
                        type="button"
                        onClick={() => { setMode('forgot'); setResetSent(false); }}
                        className="text-xs text-blue-400 hover:text-blue-300 py-0.5 transition"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full min-h-[44px] sm:min-h-[38px] bg-slate-950 border border-slate-800 focus:border-[#0052cc] rounded-xl sm:rounded-lg pl-9 pr-3 py-2.5 sm:py-2 text-base sm:text-sm text-white placeholder-slate-500 outline-none transition"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full min-h-[44px] sm:min-h-[40px] mt-2 bg-[#0052cc] hover:bg-blue-600 active:bg-blue-700 text-white font-medium text-sm py-2.5 px-4 rounded-xl sm:rounded-lg flex items-center justify-center gap-2 transition shadow-lg shadow-blue-950/50"
                >
                  <span>{mode === 'signin' ? 'Continue to Workspace' : 'Create Workspace'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <div>
              <button
                type="button"
                onClick={() => { setMode('signin'); setResetSent(false); }}
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white py-1 mb-4 transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to Sign In
              </button>

              <h1 className="text-lg font-semibold text-white">Reset your password</h1>
              <p className="text-xs text-slate-400 mt-1 mb-5 leading-relaxed">
                Enter your work email and we will send you a password recovery link.
              </p>

              {resetSent ? (
                <div className="p-3.5 rounded-xl bg-emerald-950/50 border border-emerald-800/70 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="text-xs text-emerald-200 leading-relaxed">
                    Recovery link sent to <span className="font-semibold text-white">{email || 'your email'}</span>. Check your inbox to set a new password.
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5 sm:mb-1">Work Email</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        autoComplete="email"
                        inputMode="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@company.com"
                        className="w-full min-h-[44px] sm:min-h-[38px] bg-slate-950 border border-slate-800 focus:border-[#0052cc] rounded-xl sm:rounded-lg pl-9 pr-3 py-2.5 sm:py-2 text-base sm:text-sm text-white placeholder-slate-500 outline-none transition"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full min-h-[44px] sm:min-h-[40px] bg-[#0052cc] hover:bg-blue-600 text-white font-medium text-sm py-2.5 px-4 rounded-xl sm:rounded-lg transition"
                  >
                    Send Reset Link
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </main>

      <footer className="text-center text-[11px] text-slate-500 z-10 shrink-0">
        TenderIQ • AI-Powered RFP & Proposal Intelligence
      </footer>
    </div>
  );
}

