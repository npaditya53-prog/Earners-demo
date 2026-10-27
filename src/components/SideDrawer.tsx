import React from 'react';
import {
  Award,
  Bell,
  BookOpen,
  Bookmark,
  CheckSquare,
  Compass,
  FileText,
  Grid,
  HelpCircle,
  Home,
  Info,
  LogOut,
  Shield,
  ShieldCheck,
  User,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { RouteLocation, useNavigation } from '../context/NavigationContext';
import { PWAInstallButton } from './PWAInstallButton';

export const SideDrawer: React.FC = () => {
  const { isDrawerOpen, closeDrawer, navigate, location } = useNavigation();
  const { user, isAuthenticated, isAdmin, logout, toggleAdminRole } = useAuth();

  if (!isDrawerOpen) return null;

  const handleNav = (target: RouteLocation) => {
    navigate(target);
    closeDrawer();
  };

  const navItems = [
    { label: 'Home', icon: Home, target: { page: 'home' } as const },
    { label: 'Explore Courses', icon: Compass, target: { page: 'explore' } as const },
    { label: 'My Learning', icon: BookOpen, target: { page: 'my-learning' } as const },
    { label: 'Categories', icon: Grid, target: { page: 'categories' } as const },
    { label: 'Bookmarks', icon: Bookmark, target: { page: 'bookmarks' } as const },
    { label: 'Assignments', icon: FileText, target: { page: 'assignments' } as const },
    { label: 'Quizzes', icon: CheckSquare, target: { page: 'quizzes' } as const },
    { label: 'Certificates', icon: Award, target: { page: 'certificates' } as const },
    { label: 'Notifications', icon: Bell, target: { page: 'notifications' } as const },
  ];

  const secondaryItems = [
    { label: 'Help & Support', icon: HelpCircle, target: { page: 'help' } as const },
    { label: 'About EARNERS', icon: Info, target: { page: 'about' } as const },
    { label: 'Privacy Policy', icon: Shield, target: { page: 'privacy' } as const },
    { label: 'Terms & Conditions', icon: FileText, target: { page: 'terms' } as const },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeDrawer}
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-fade-in"
      />

      {/* Drawer Container */}
      <div className="absolute inset-y-0 left-0 max-w-full flex pr-10">
        <div className="w-screen max-w-xs bg-slate-900 border-r border-slate-800 text-white flex flex-col shadow-2xl animate-slide-right">
          
          {/* Drawer Header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center font-bold text-slate-950 text-base">
                E
              </div>
              <span className="font-extrabold text-lg tracking-tight text-white">
                EARNERS
              </span>
            </div>
            <button
              onClick={closeDrawer}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Profile Mini Bar */}
          <div className="p-4 bg-slate-800/60 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center text-amber-400 font-bold text-sm">
                {user?.displayName ? user.displayName.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-white truncate max-w-[130px]">
                  {user ? user.displayName : 'Guest User'}
                </span>
                <span className="text-[10px] text-amber-400 font-medium capitalize">
                  {user ? `${user.role} Account` : 'Sign in to sync'}
                </span>
              </div>
            </div>

            {/* Quick Admin Role Switch for testing */}
            <button
              onClick={toggleAdminRole}
              className="px-2 py-1 text-[10px] font-semibold bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 rounded-md transition-colors"
              title="Toggle Admin Mode for Testing"
            >
              {isAdmin ? 'Admin Mode ON' : 'Make Admin'}
            </button>
          </div>

          {/* Scrollable Navigation List */}
          <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
            
            {/* Primary Destinations */}
            <div>
              <div className="px-3 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Learning Hub
              </div>
              <ul className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.page === item.target.page;
                  return (
                    <li key={item.label}>
                      <button
                        onClick={() => handleNav(item.target)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                          isActive
                            ? 'bg-amber-500/15 text-amber-400 font-semibold'
                            : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                        <span>{item.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Admin Management Section */}
            {isAdmin && (
              <div>
                <div className="px-3 mb-2 text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Administration</span>
                </div>
                <button
                  onClick={() => handleNav({ page: 'admin' })}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-colors"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>Manage Courses & Content</span>
                </button>
              </div>
            )}

            {/* PWA App Installation Promo */}
            <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-800">
              <div className="text-xs font-semibold text-slate-200 mb-1">PWA Mobile Experience</div>
              <p className="text-[11px] text-slate-400 mb-2">Install EARNERS for fast offline learning access.</p>
              <PWAInstallButton className="w-full justify-center" />
            </div>

            {/* Support & Legal Links */}
            <div>
              <div className="px-3 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Support & Legal
              </div>
              <ul className="space-y-1">
                {secondaryItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.page === item.target.page;
                  return (
                    <li key={item.label}>
                      <button
                        onClick={() => handleNav(item.target)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                          isActive
                            ? 'bg-amber-500/15 text-amber-400 font-semibold'
                            : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                        }`}
                      >
                        <Icon className="w-4 h-4 text-slate-400" />
                        <span>{item.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

          </div>

          {/* Drawer Footer: Auth action */}
          <div className="p-4 border-t border-slate-800 bg-slate-900/90">
            {isAuthenticated ? (
              <button
                onClick={() => {
                  logout();
                  closeDrawer();
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              >
                <LogOut className="w-4 h-4 text-rose-400" />
                <span>Sign Out Account</span>
              </button>
            ) : (
              <button
                onClick={() => handleNav({ page: 'auth', mode: 'signin' })}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-amber-500 text-slate-950 hover:bg-amber-400 transition-colors shadow-sm"
              >
                <User className="w-4 h-4" />
                <span>Sign In or Register</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
