import React, { useState, useContext } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Mail, Lock, ArrowRight, AlertTriangle, User } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import Button from '../components/ui/Button';

function Register() {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      setError('Please fill out all fields.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await register(formData);
      if (res.success) {
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 shadow-glow-sm shadow-brand-500/20 mb-4">
            <Sparkles className="h-6 w-6 text-brand-400" />
          </div>
          <h1 className="text-3xl font-bold text-white font-display mb-2">Create an account</h1>
          <p className="text-slate-400 text-sm">Join ScholarAssist to start synthesizing research.</p>
        </div>

        <div className="glass-card p-8 rounded-2xl border border-slate-800/60 shadow-2xl">
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0, mb: 0 }}
                animate={{ opacity: 1, height: 'auto', mb: 24 }}
                exit={{ opacity: 0, height: 0, mb: 0 }}
                className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-3 flex items-start gap-3"
              >
                <AlertTriangle className="h-5 w-5 text-rose-400 shrink-0" />
                <p className="text-sm text-rose-300">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-slate-500" />
                </div>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="input-field !pl-10"
                  placeholder="e.g. researcher_01"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-slate-500" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field !pl-10"
                  placeholder="you@university.edu"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-slate-500" />
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input-field !pl-10"
                  placeholder="••••••••"
                />
              </div>
              <p className="text-[10px] text-slate-500 mt-1.5">Must be at least 6 characters long.</p>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                loading={loading}
                icon={ArrowRight}
                size="lg"
                className="w-full flex-row-reverse"
              >
                Create Account
              </Button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-800 text-center">
            <p className="text-sm text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="text-brand-400 hover:text-brand-300 font-semibold transition-colors">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Register;
