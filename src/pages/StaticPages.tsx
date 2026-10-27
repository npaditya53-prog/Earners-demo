import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, HelpCircle, Info, Lock, Mail, Shield, ShieldCheck, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '../context/NavigationContext';

export const HelpScreen: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 pb-24 md:pb-16 animate-fade-in">
      <section className="bg-slate-900 text-white py-10 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Help & Learner Support</h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-300">Frequently asked questions and support contacts for EARNERS platform.</p>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-6">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="font-bold text-base text-slate-900 border-b border-slate-100 pb-3">Frequently Asked Questions</h2>
          
          <div className="space-y-4 text-xs">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">How do I access my course certificates?</h3>
              <p className="text-slate-600 mt-1">Once you complete 100% of the lessons in a course, your verified certificate is automatically issued under the Certificates tab.</p>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Do courses require upfront payments?</h3>
              <p className="text-slate-600 mt-1">No. All courses in the current EARNERS learning catalog offer free enrollment and open access.</p>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Is my learning progress saved across devices?</h3>
              <p className="text-slate-600 mt-1">Yes, when signed into your EARNERS account, your lesson progress and saved playback timestamps are continuously synced.</p>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 rounded-3xl p-6 border border-amber-200 text-amber-950 text-xs space-y-2">
          <h3 className="font-bold text-sm">Need Direct Support?</h3>
          <p>Email our learner support team at <strong className="underline">support@earners.app</strong> for assistance with your account or course access.</p>
        </div>
      </main>
    </div>
  );
};

export const AboutScreen: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 pb-24 md:pb-16 animate-fade-in">
      <section className="bg-slate-900 text-white py-10 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">About EARNERS</h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-300">Learn Skills. Build Your Future.</p>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-6">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4 text-xs text-slate-700 leading-relaxed">
          <h2 className="text-lg font-extrabold text-slate-900">Empowering Modern Creators & Digital Professionals</h2>
          <p>
            EARNERS is a premier Indian skill-learning platform designed to bridge the gap between traditional education and high-demand digital skills.
          </p>
          <p>
            Our practical, project-based courses cover AI prompt engineering, smartphone video editing, Figma UI/UX design, content creation, and freelance client acquisition.
          </p>
        </div>
      </main>
    </div>
  );
};

export const PrivacyScreen: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 pb-24 md:pb-16 animate-fade-in">
      <section className="bg-slate-900 text-white py-10 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Privacy Policy</h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-300">How we protect your learner data.</p>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4 text-xs text-slate-700 leading-relaxed">
          <p>At EARNERS, we prioritize your data security and privacy. We strictly collect only essential profile information required to maintain your course progress, quiz records, and certificate issuance.</p>
          <p>We do not sell personal information or share learner credentials with third-party advertisers.</p>
        </div>
      </main>
    </div>
  );
};

export const TermsScreen: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 pb-24 md:pb-16 animate-fade-in">
      <section className="bg-slate-900 text-white py-10 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Terms & Conditions</h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-300">Rules governing platform use.</p>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4 text-xs text-slate-700 leading-relaxed">
          <p>By accessing EARNERS, learners agree to use course resources and materials for personal skill development and career advancement.</p>
          <p>Unauthorized redistribution or scraping of course content is prohibited.</p>
        </div>
      </main>
    </div>
  );
};

export const AuthScreen: React.FC<{ mode?: 'signin' | 'signup' }> = ({ mode = 'signin' }) => {
  const { navigate } = useNavigation();
  const { login, signUp } = useAuth();

  const [isSignUp, setIsSignUp] = useState(mode === 'signup');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    if (isSignUp) {
      await signUp(email, name || 'Learner');
    } else {
      await login(email, name);
    }
    setIsLoading(false);
    navigate({ page: 'home' });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-950 p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center font-black text-slate-950 text-2xl mx-auto shadow-md">
            E
          </div>
          <h2 className="text-2xl font-black tracking-tight">
            {isSignUp ? 'Join EARNERS Today' : 'Welcome Back'}
          </h2>
          <p className="text-xs text-slate-400">
            {isSignUp ? 'Create an account to track skill progress and earn certificates.' : 'Sign in to access your learning library.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {isSignUp && (
            <div>
              <label className="block font-bold text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Aditya Kumar"
                className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                required
              />
            </div>
          )}

          <div>
            <label className="block font-bold text-slate-300 mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="learner@earners.app"
              className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-md transition-all active:scale-98 disabled:opacity-50"
          >
            {isLoading ? 'Processing...' : isSignUp ? 'Create EARNERS Account' : 'Sign In'}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-900 text-xs text-slate-400">
          {isSignUp ? 'Already have an account?' : "Don't have an account yet?"}{' '}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-amber-400 font-bold hover:underline"
          >
            {isSignUp ? 'Sign In' : 'Register Now'}
          </button>
        </div>

      </div>
    </div>
  );
};
