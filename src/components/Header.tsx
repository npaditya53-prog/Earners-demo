import React, { useEffect, useState } from 'react';
import { Bell, Bookmark, LayoutDashboard, Menu, Search, ShieldCheck, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '../context/NavigationContext';
import { storage } from '../services/storage';

export const Header: React.FC = () => {
  const { location, navigate, toggleDrawer } = useNavigation();
  const { user, isAdmin } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const notifs = storage.getNotifications();
    setUnreadCount(notifs.filter((n) => !n.read).length);
  }, [location]);

  const isActive = (pageName: string) => {
    return location.page === pageName;
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 md:gap-8">
        
        {/* Zone 1: Single-Line EARNERS Brand Wordmark & Emblem */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={toggleDrawer}
            className="p-2 -ml-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors md:hidden"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <button
            onClick={() => navigate({ page: 'home' })}
            className="flex items-center gap-2.5 text-left focus:outline-none group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center font-black text-slate-950 text-lg shadow-sm shadow-amber-500/20 group-hover:scale-105 transition-transform">
              E
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg tracking-tight text-white leading-none whitespace-nowrap">
                EARNERS
              </span>
              <span className="text-[10px] text-amber-400 font-medium tracking-wide uppercase leading-tight whitespace-nowrap hidden sm:inline-block">
                Learn Skills. Build Future.
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: 4-5 Concise Single-Line Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={() => navigate({ page: 'home' })}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white py-1 ${
              isActive('home') ? 'text-amber-400 font-semibold border-b-2 border-amber-400' : ''
            }`}
          >
            Home
          </button>
          <button
            onClick={() => navigate({ page: 'explore' })}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white py-1 ${
              isActive('explore') ? 'text-amber-400 font-semibold border-b-2 border-amber-400' : ''
            }`}
          >
            Explore Courses
          </button>
          <button
            onClick={() => navigate({ page: 'my-learning' })}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white py-1 ${
              isActive('my-learning') ? 'text-amber-400 font-semibold border-b-2 border-amber-400' : ''
            }`}
          >
            My Learning
          </button>
          <button
            onClick={() => navigate({ page: 'categories' })}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white py-1 ${
              isActive('categories') ? 'text-amber-400 font-semibold border-b-2 border-amber-400' : ''
            }`}
          >
            Categories
          </button>

          {isAdmin && (
            <button
              onClick={() => navigate({ page: 'admin' })}
              className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 hover:text-white py-1 text-amber-400 font-semibold ${
                isActive('admin') ? 'border-b-2 border-amber-400' : ''
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Admin Panel</span>
            </button>
          )}
        </nav>

        {/* Zone 3: Interactive Quick Actions & User Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Quick Search trigger button */}
          <button
            onClick={() => navigate({ page: 'explore' })}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-2 text-xs"
            title="Search Courses"
          >
            <Search className="w-4 h-4" />
            <span className="hidden lg:inline-block text-slate-400 font-normal">Search skills...</span>
          </button>

          {/* Bookmarks link */}
          <button
            onClick={() => navigate({ page: 'bookmarks' })}
            className={`p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors hidden sm:flex ${
              isActive('bookmarks') ? 'text-amber-400 bg-slate-800' : ''
            }`}
            title="Bookmarks"
          >
            <Bookmark className="w-4 h-4" />
          </button>

          {/* Notifications button with badge */}
          <button
            onClick={() => navigate({ page: 'notifications' })}
            className={`p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors relative ${
              isActive('notifications') ? 'text-amber-400 bg-slate-800' : ''
            }`}
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full ring-2 ring-slate-900" />
            )}
          </button>

          {/* User Profile Avatar / Sign in trigger */}
          <button
            onClick={() => navigate({ page: user ? 'profile' : 'auth' })}
            className="flex items-center gap-2 pl-2 border-l border-slate-800 focus:outline-none group"
            title={user ? user.displayName : 'Sign In'}
          >
            <div className="w-8 h-8 rounded-full bg-slate-800 ring-1 ring-slate-700 flex items-center justify-center text-xs font-semibold text-amber-400 group-hover:ring-amber-500 transition-all overflow-hidden">
              {user?.photoURL ? (
                <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" />
              ) : user ? (
                user.displayName.charAt(0).toUpperCase()
              ) : (
                <User className="w-4 h-4 text-slate-400" />
              )}
            </div>
            <span className="text-xs font-medium text-slate-200 hidden xl:inline-block max-w-[100px] truncate">
              {user ? user.displayName.split(' ')[0] : 'Sign In'}
            </span>
          </button>
        </div>

      </div>
    </header>
  );
};
