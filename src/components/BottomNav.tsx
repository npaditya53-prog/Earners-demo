import React from 'react';
import { BookOpen, Compass, Home, User } from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';

export const BottomNav: React.FC = () => {
  const { location, navigate } = useNavigation();

  const navItems = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      target: { page: 'home' } as const,
      isActive: location.page === 'home',
    },
    {
      id: 'my-learning',
      label: 'My Learning',
      icon: BookOpen,
      target: { page: 'my-learning' } as const,
      isActive: location.page === 'my-learning',
    },
    {
      id: 'explore',
      label: 'Explore',
      icon: Compass,
      target: { page: 'explore' } as const,
      isActive: location.page === 'explore' || location.page === 'categories',
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
      target: { page: 'profile' } as const,
      isActive: location.page === 'profile' || location.page === 'auth',
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/98 backdrop-blur-lg border-t border-slate-800 md:hidden safe-area-pb">
      <div className="flex items-center justify-around h-16 px-2 max-w-md mx-auto">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.target)}
              className={`flex flex-col items-center justify-center w-full h-full min-h-[44px] px-1 transition-colors active:scale-95 ${
                item.isActive ? 'text-amber-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <IconComponent className={`w-5 h-5 ${item.isActive ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
                {item.isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-amber-400 rounded-full" />
                )}
              </div>
              <span className="text-[11px] mt-1 tracking-tight leading-none whitespace-nowrap">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
