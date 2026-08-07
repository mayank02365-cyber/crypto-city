import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from '../components/ui/Motion';
import { Lock, Mail, User, Eye, EyeOff, ShieldCheck, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsLoading(true);

    try {
      if (isSignUp) {
        await signUp(email);
        setSuccessMsg('Account created successfully! Redirecting...');
      } else {
        await signIn(email);
        setSuccessMsg('Signed in successfully! Redirecting...');
      }

      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
      {/* Background Radial Orbs */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />

      {/* Main Split Grid */}
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 glass-modal overflow-hidden shadow-elevated border border-border">
        {/* Left Side: Marketing & Animated Hero (7 cols) */}
        <div className="lg:col-span-6 p-8 md:p-12 bg-gradient-to-br from-bg-secondary via-bg-card to-bg-primary flex flex-col justify-between relative overflow-hidden border-b lg:border-b-0 lg:border-r border-border">
          {/* Brand Header */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center shadow-glow-accent">
              <Zap className="text-white w-5 h-5" fill="white" />
            </div>
            <span className="font-display font-bold text-xl text-text-primary">CryptoCity</span>
          </div>

          {/* Hero Content */}
          <div className="my-10 space-y-6 relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/15 text-accent text-xs font-bold font-mono">
              <ShieldCheck size={14} /> INSTITUTIONAL TRADING ENGINE
            </span>

            <h1 className="text-3xl md:text-4xl font-extrabold font-display leading-tight text-text-primary">
              Trade the Future of Wealth with <span className="text-accent">Zero Latency</span>
            </h1>

            <p className="text-xs text-text-secondary leading-relaxed max-w-md">
              Access real-time price feeds for 10,000+ cryptocurrencies, automated portfolio PnL analytics, and enterprise-grade security.
            </p>

            {/* Floating Features List */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-2.5 text-xs font-semibold text-text-primary">
                <CheckCircle2 size={16} className="text-positive" /> Live CoinGecko 30s Market Synchronization
              </div>
              <div className="flex items-center gap-2.5 text-xs font-semibold text-text-primary">
                <CheckCircle2 size={16} className="text-positive" /> Real-time Supabase Portfolio & Watchlist Syncing
              </div>
              <div className="flex items-center gap-2.5 text-xs font-semibold text-text-primary">
                <CheckCircle2 size={16} className="text-positive" /> 14 Full Analytics Pages & Interactive SVG Charts
              </div>
            </div>
          </div>

          {/* Footer Quote */}
          <div className="text-[11px] text-text-muted font-mono">
            © 2026 CryptoCity Inc. All rights reserved.
          </div>
        </div>

        {/* Right Side: Auth Card Form (6 cols) */}
        <div className="lg:col-span-6 p-8 md:p-12 flex flex-col justify-center space-y-6 bg-bg-card/40">
          <div>
            <h2 className="text-xl font-bold font-display text-text-primary">
              {isSignUp ? 'Create Your Account' : 'Welcome Back'}
            </h2>
            <p className="text-xs text-text-muted mt-1">
              {isSignUp ? 'Enter your details to open a new account' : 'Enter your credentials to access your dashboard'}
            </p>
          </div>

          {/* Toast Error / Success */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-negative/15 border border-negative/30 text-negative text-xs font-semibold">
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="p-3 rounded-xl bg-positive/15 border border-positive/30 text-positive text-xs font-semibold">
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-xs font-semibold text-text-muted mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 w-4 h-4 text-text-muted" />
                  <input
                    type="text"
                    placeholder="Alex Vance"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required={isSignUp}
                    className="w-full bg-bg-secondary border border-border rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-text-primary focus:outline-none focus:border-accent"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-text-muted mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-text-muted" />
                <input
                  type="email"
                  placeholder="trader@cryptocity.io"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-bg-secondary border border-border rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-text-primary focus:outline-none focus:border-accent"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-muted mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-text-muted" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-bg-secondary border border-border rounded-xl pl-10 pr-10 py-2.5 text-xs text-text-primary focus:outline-none focus:border-accent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-text-muted hover:text-text-primary"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            {!isSignUp && (
              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-text-muted">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 accent-accent rounded"
                  />
                  Remember me
                </label>
                <a href="#forgot" className="text-accent hover:underline font-semibold">
                  Forgot Password?
                </a>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary py-3 text-xs font-bold shadow-glow-accent gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-4 h-4 rounded-full border-2 border-bg-primary border-t-transparent animate-spin" />
              ) : (
                <>
                  {isSignUp ? 'Create CryptoCity Account' : 'Sign In to Dashboard'}
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>

          {/* Toggle Sign Up / Sign In */}
          <div className="text-center border-t border-border pt-4">
            <p className="text-xs text-text-muted">
              {isSignUp ? 'Already have an account?' : "Don't have an account yet?"}{' '}
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-accent font-bold hover:underline"
              >
                {isSignUp ? 'Sign In' : 'Create Free Account'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
