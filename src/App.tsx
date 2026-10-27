import React from 'react';
import { BottomNav } from './components/BottomNav';
import { Header } from './components/Header';
import { OfflineIndicator } from './components/OfflineIndicator';
import { SideDrawer } from './components/SideDrawer';
import { AuthProvider } from './context/AuthContext';
import { NavigationProvider, useNavigation } from './context/NavigationContext';

import { AdminScreen } from './pages/AdminScreen';
import { AssignmentsScreen } from './pages/AssignmentsScreen';
import { BookmarksScreen } from './pages/BookmarksScreen';
import { CategoriesScreen } from './pages/CategoriesScreen';
import { CertificatesScreen } from './pages/CertificatesScreen';
import { CourseDetailsScreen } from './pages/CourseDetailsScreen';
import { ExploreScreen } from './pages/ExploreScreen';
import { HomeScreen } from './pages/HomeScreen';
import { LessonPlayerScreen } from './pages/LessonPlayerScreen';
import { MyLearningScreen } from './pages/MyLearningScreen';
import { NotificationsScreen } from './pages/NotificationsScreen';
import { ProfileScreen } from './pages/ProfileScreen';
import { QuizzesScreen } from './pages/QuizzesScreen';
import {
  AboutScreen,
  AuthScreen,
  HelpScreen,
  PrivacyScreen,
  TermsScreen
} from './pages/StaticPages';

const AppContent: React.FC = () => {
  const { location } = useNavigation();

  // Full-screen views without global header/footer (e.g., Lesson Player)
  if (location.page === 'lesson-player') {
    return <LessonPlayerScreen courseId={location.courseId} lessonId={location.lessonId} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Header />
      <SideDrawer />
      
      <div className="flex-1">
        {location.page === 'home' && <HomeScreen />}
        {location.page === 'explore' && <ExploreScreen />}
        {location.page === 'course-details' && <CourseDetailsScreen courseId={location.courseId} />}
        {location.page === 'my-learning' && <MyLearningScreen />}
        {location.page === 'categories' && <CategoriesScreen />}
        {location.page === 'bookmarks' && <BookmarksScreen />}
        {location.page === 'assignments' && <AssignmentsScreen courseId={location.courseId} />}
        {location.page === 'quizzes' && <QuizzesScreen courseId={location.courseId} />}
        {location.page === 'certificates' && <CertificatesScreen certificateId={location.certificateId} />}
        {location.page === 'notifications' && <NotificationsScreen />}
        {location.page === 'profile' && <ProfileScreen />}
        {location.page === 'admin' && <AdminScreen />}
        {location.page === 'help' && <HelpScreen />}
        {location.page === 'about' && <AboutScreen />}
        {location.page === 'privacy' && <PrivacyScreen />}
        {location.page === 'terms' && <TermsScreen />}
        {location.page === 'auth' && <AuthScreen mode={location.mode} />}
      </div>

      <BottomNav />
      <OfflineIndicator />
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <NavigationProvider>
        <AppContent />
      </NavigationProvider>
    </AuthProvider>
  );
}

export default App;
