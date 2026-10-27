import React, { useState } from 'react';
import {
  Award,
  BookOpen,
  Bookmark,
  CheckCircle2,
  LogOut,
  Mail,
  ShieldCheck,
  User,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '../context/NavigationContext';
import { storage } from '../services/storage';

export const ProfileScreen: React.FC = () => {
  const { navigate } = useNavigation();
  const { user, isAuthenticated, isAdmin, logout, updateProfile, toggleAdminRole } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState(user?.displayName || '');
  const [bioInput, setBioInput] = useState(user?.bio || '');

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Guest Account</h2>
        <p className="text-xs text-slate-500 mb-6 max-w-sm mx-auto">
          Sign in or create an EARNERS account to sync your course progress and certificates across devices.
        </p>
        <button
          onClick={() => navigate({ page: 'auth', mode: 'signin' })}
          className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl shadow-xs"
        >
          Sign In / Create Account
        </button>
      </div>
    );
  }

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      displayName: nameInput,
      bio: bioInput,
    });
    setIsEditing(false);
  };

  const enrollments = storage.getEnrollments(user.uid);
  const completedCount = enrollments.filter((e) => e.isCompleted).length;
  const certificates = storage.getCertificates(user.uid);

  return (
    <div className="min-h-screen bg-slate-50 pb-24 md:pb-16 animate-fade-in">
      
      {/* Header */}
      <section className="bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
          
          <div className="w-20 h-20 rounded-full bg-slate-800 ring-4 ring-amber-500/30 flex items-center justify-center text-amber-400 font-extrabold text-2xl shrink-0 overflow-hidden">
            {user.photoURL ? (
              <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" />
            ) : (
              user.displayName.charAt(0).toUpperCase()
            )}
          </div>

          <div className="space-y-1 flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl font-black text-white">{user.displayName}</h1>
              <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-400 border border-amber-500/30">
                {user.role}
              </span>
            </div>
            <p className="text-xs text-slate-300 flex items-center justify-center sm:justify-start gap-1">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              {user.email}
            </p>
            {user.bio && <p className="text-xs text-slate-400 pt-1 max-w-xl">{user.bio}</p>}
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-colors shrink-0"
          >
            {isEditing ? 'Cancel Edit' : 'Edit Profile'}
          </button>

        </div>
      </section>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        
        {/* Edit Profile Form */}
        {isEditing && (
          <form onSubmit={handleSaveProfile} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
              Update Account Profile
            </h3>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Display Name</label>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-amber-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Short Bio</label>
              <textarea
                rows={3}
                value={bioInput}
                onChange={(e) => setBioInput(e.target.value)}
                placeholder="Tell instructors and fellow learners about your digital skill goals..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-amber-500"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2 bg-slate-900 text-amber-400 font-bold text-xs rounded-xl hover:bg-slate-800"
            >
              Save Changes
            </button>
          </form>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs text-center">
            <BookOpen className="w-6 h-6 text-amber-500 mx-auto mb-2" />
            <div className="text-xl font-black text-slate-900">{enrollments.length}</div>
            <div className="text-xs text-slate-500 font-medium">Enrolled Courses</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs text-center">
            <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
            <div className="text-xl font-black text-slate-900">{completedCount}</div>
            <div className="text-xs text-slate-500 font-medium">Completed Courses</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs text-center">
            <Award className="w-6 h-6 text-sky-500 mx-auto mb-2" />
            <div className="text-xl font-black text-slate-900">{certificates.length}</div>
            <div className="text-xs text-slate-500 font-medium">Verified Certificates</div>
          </div>
        </div>

        {/* Account Quick Links */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-100 font-bold text-xs text-slate-900 uppercase tracking-wider">
            Quick Navigation & Settings
          </div>
          <div className="divide-y divide-slate-100">
            <button
              onClick={() => navigate({ page: 'my-learning' })}
              className="w-full p-4 hover:bg-slate-50 flex items-center justify-between text-xs font-semibold text-slate-800 transition-colors"
            >
              <div className="flex items-center gap-3">
                <BookOpen className="w-4 h-4 text-amber-500" />
                <span>My Learning Library</span>
              </div>
              <span className="text-slate-400">→</span>
            </button>

            <button
              onClick={() => navigate({ page: 'certificates' })}
              className="w-full p-4 hover:bg-slate-50 flex items-center justify-between text-xs font-semibold text-slate-800 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Award className="w-4 h-4 text-sky-500" />
                <span>View Skill Certificates</span>
              </div>
              <span className="text-slate-400">→</span>
            </button>

            <button
              onClick={() => navigate({ page: 'bookmarks' })}
              className="w-full p-4 hover:bg-slate-50 flex items-center justify-between text-xs font-semibold text-slate-800 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Bookmark className="w-4 h-4 text-amber-600" />
                <span>Bookmarked Courses</span>
              </div>
              <span className="text-slate-400">→</span>
            </button>

            {/* Admin Toggle Option for testing */}
            <div className="p-4 flex items-center justify-between text-xs font-semibold text-slate-800 bg-amber-50/50">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>Admin Privileges</span>
              </div>
              <button
                onClick={toggleAdminRole}
                className={`px-3 py-1 text-[11px] font-bold rounded-lg border transition-colors ${
                  isAdmin
                    ? 'bg-amber-500 text-slate-950 border-amber-600'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                {isAdmin ? 'Admin Mode ACTIVE' : 'Enable Admin Mode'}
              </button>
            </div>
          </div>
        </div>

        {/* Sign Out Button */}
        <div className="pt-2 text-center">
          <button
            onClick={logout}
            className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-rose-400 font-bold text-xs rounded-xl inline-flex items-center gap-2 shadow-xs transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out of Account</span>
          </button>
        </div>

      </main>
    </div>
  );
};
