import React, { useEffect, useState } from 'react';
import { Bell, Check, CheckCheck, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '../context/NavigationContext';
import { storage } from '../services/storage';
import { AppNotification } from '../types';

export const NotificationsScreen: React.FC = () => {
  const { navigate } = useNavigation();
  const { user } = useAuth();

  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    setNotifications(storage.getNotifications(user?.uid));
  }, [user]);

  const handleMarkRead = (id: string) => {
    storage.markNotificationRead(id);
    setNotifications(storage.getNotifications(user?.uid));
  };

  const handleMarkAllRead = () => {
    storage.markAllNotificationsRead(user?.uid);
    setNotifications(storage.getNotifications(user?.uid));
  };

  const filtered = notifications.filter((n) => (filter === 'unread' ? !n.read : true));

  return (
    <div className="min-h-screen bg-slate-50 pb-24 md:pb-16 animate-fade-in">
      
      {/* Header */}
      <section className="bg-slate-900 text-white py-10 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Notification Center
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-300">
              Stay updated on course announcements, assignment results, and certificate releases.
            </p>
          </div>

          <button
            onClick={handleMarkAllRead}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5 shrink-0"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Mark All as Read</span>
          </button>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* Filter Tabs */}
        <div className="flex items-center gap-2 mb-6 pb-2 border-b border-slate-200">
          <button
            onClick={() => setFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              filter === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              filter === 'unread'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Unread ({notifications.filter((n) => !n.read).length})
          </button>
        </div>

        {/* Notifications List */}
        {filtered.length > 0 ? (
          <div className="space-y-3">
            {filtered.map((notif) => (
              <div
                key={notif.id}
                onClick={() => {
                  handleMarkRead(notif.id);
                  if (notif.link) {
                    if (notif.link === 'certificates') navigate({ page: 'certificates' });
                    else if (notif.link.startsWith('course-')) navigate({ page: 'course-details', courseId: notif.link });
                  }
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                  notif.read
                    ? 'bg-white border-slate-200 text-slate-700 opacity-80'
                    : 'bg-amber-500/5 border-amber-300 text-slate-900 shadow-xs font-medium'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-xl shrink-0 ${
                    notif.read ? 'bg-slate-100 text-slate-400' : 'bg-amber-100 text-amber-800'
                  }`}>
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-xs sm:text-sm text-slate-900">{notif.title}</h3>
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{notif.message}</p>
                    <div className="text-[10px] text-slate-400 mt-2 font-mono">
                      {new Date(notif.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {!notif.read && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMarkRead(notif.id);
                    }}
                    className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
                    title="Mark as read"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto my-8">
            <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-base text-slate-900">No Notifications</h3>
            <p className="text-xs text-slate-500 mt-1">You are all caught up!</p>
          </div>
        )}

      </main>
    </div>
  );
};
