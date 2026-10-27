import React, { createContext, useContext, useEffect, useState } from 'react';

export type RouteLocation =
  | { page: 'home' }
  | { page: 'explore'; categoryId?: string; searchQuery?: string }
  | { page: 'course-details'; courseId: string }
  | { page: 'lesson-player'; courseId: string; lessonId: string }
  | { page: 'my-learning'; tab?: 'enrolled' | 'completed' | 'bookmarks' }
  | { page: 'categories' }
  | { page: 'bookmarks' }
  | { page: 'assignments'; courseId?: string }
  | { page: 'quizzes'; courseId?: string }
  | { page: 'certificates'; certificateId?: string }
  | { page: 'notifications' }
  | { page: 'profile' }
  | { page: 'admin' }
  | { page: 'help' }
  | { page: 'about' }
  | { page: 'privacy' }
  | { page: 'terms' }
  | { page: 'auth'; mode?: 'signin' | 'signup' };

interface NavigationContextType {
  location: RouteLocation;
  navigate: (target: RouteLocation) => void;
  goBack: () => void;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [location, setLocation] = useState<RouteLocation>({ page: 'home' });
  const [historyStack, setHistoryStack] = useState<RouteLocation[]>([{ page: 'home' }]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Sync with browser hash router
  useEffect(() => {
    const parseHash = () => {
      const hash = window.location.hash.replace(/^#\/?/, '');
      if (!hash) {
        setLocation({ page: 'home' });
        return;
      }

      const parts = hash.split('/');
      const pageName = parts[0];

      if (pageName === 'explore') {
        const cat = parts[1];
        setLocation({ page: 'explore', categoryId: cat });
      } else if (pageName === 'course' && parts[1]) {
        setLocation({ page: 'course-details', courseId: parts[1] });
      } else if (pageName === 'learn' && parts[1] && parts[2]) {
        setLocation({ page: 'lesson-player', courseId: parts[1], lessonId: parts[2] });
      } else if (pageName === 'my-learning') {
        setLocation({ page: 'my-learning' });
      } else if (pageName === 'categories') {
        setLocation({ page: 'categories' });
      } else if (pageName === 'bookmarks') {
        setLocation({ page: 'bookmarks' });
      } else if (pageName === 'assignments') {
        setLocation({ page: 'assignments', courseId: parts[1] });
      } else if (pageName === 'quizzes') {
        setLocation({ page: 'quizzes', courseId: parts[1] });
      } else if (pageName === 'certificates') {
        setLocation({ page: 'certificates', certificateId: parts[1] });
      } else if (pageName === 'notifications') {
        setLocation({ page: 'notifications' });
      } else if (pageName === 'profile') {
        setLocation({ page: 'profile' });
      } else if (pageName === 'admin') {
        setLocation({ page: 'admin' });
      } else if (pageName === 'help') {
        setLocation({ page: 'help' });
      } else if (pageName === 'about') {
        setLocation({ page: 'about' });
      } else if (pageName === 'privacy') {
        setLocation({ page: 'privacy' });
      } else if (pageName === 'terms') {
        setLocation({ page: 'terms' });
      } else if (pageName === 'auth') {
        setLocation({ page: 'auth', mode: (parts[1] as 'signin' | 'signup') || 'signin' });
      } else {
        setLocation({ page: 'home' });
      }
    };

    parseHash();
    window.addEventListener('hashchange', parseHash);
    return () => window.removeEventListener('hashchange', parseHash);
  }, []);

  const navigate = (target: RouteLocation) => {
    setIsDrawerOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Build URL Hash
    let hash = '#/';
    if (target.page === 'home') hash = '#/';
    else if (target.page === 'explore') hash = target.categoryId ? `#/explore/${target.categoryId}` : '#/explore';
    else if (target.page === 'course-details') hash = `#/course/${target.courseId}`;
    else if (target.page === 'lesson-player') hash = `#/learn/${target.courseId}/${target.lessonId}`;
    else if (target.page === 'my-learning') hash = '#/my-learning';
    else if (target.page === 'categories') hash = '#/categories';
    else if (target.page === 'bookmarks') hash = '#/bookmarks';
    else if (target.page === 'assignments') hash = target.courseId ? `#/assignments/${target.courseId}` : '#/assignments';
    else if (target.page === 'quizzes') hash = target.courseId ? `#/quizzes/${target.courseId}` : '#/quizzes';
    else if (target.page === 'certificates') hash = target.certificateId ? `#/certificates/${target.certificateId}` : '#/certificates';
    else if (target.page === 'notifications') hash = '#/notifications';
    else if (target.page === 'profile') hash = '#/profile';
    else if (target.page === 'admin') hash = '#/admin';
    else if (target.page === 'help') hash = '#/help';
    else if (target.page === 'about') hash = '#/about';
    else if (target.page === 'privacy') hash = '#/privacy';
    else if (target.page === 'terms') hash = '#/terms';
    else if (target.page === 'auth') hash = `#/auth/${target.mode || 'signin'}`;

    window.history.pushState(null, '', hash);
    setHistoryStack((prev) => [...prev, target]);
    setLocation(target);
  };

  const goBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigate({ page: 'home' });
    }
  };

  // Keyboard shortcut: Escape closes drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDrawerOpen) {
        setIsDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDrawerOpen]);

  return (
    <NavigationContext.Provider
      value={{
        location,
        navigate,
        goBack,
        isDrawerOpen,
        openDrawer: () => setIsDrawerOpen(true),
        closeDrawer: () => setIsDrawerOpen(false),
        toggleDrawer: () => setIsDrawerOpen((prev) => !prev),
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};
