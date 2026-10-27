import React, { useEffect, useState } from 'react';
import { Bookmark } from 'lucide-react';
import { CourseCard } from '../components/CourseCard';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '../context/NavigationContext';
import { storage } from '../services/storage';
import { Course } from '../types';

export const BookmarksScreen: React.FC = () => {
  const { navigate } = useNavigation();
  const { user } = useAuth();
  const [bookmarkedCourses, setBookmarkedCourses] = useState<Course[]>([]);

  useEffect(() => {
    const bm = storage.getBookmarks(user?.uid).map((b) => b.courseId);
    const courses = storage.getCourses().filter((c) => bm.includes(c.id));
    setBookmarkedCourses(courses);
  }, [user]);

  const refreshList = () => {
    const bm = storage.getBookmarks(user?.uid).map((b) => b.courseId);
    const courses = storage.getCourses().filter((c) => bm.includes(c.id));
    setBookmarkedCourses(courses);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24 md:pb-16 animate-fade-in">
      <section className="bg-slate-900 text-white py-10 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Bookmarked Courses
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-300">
            Quick access to all courses you saved for later learning.
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {bookmarkedCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookmarkedCourses.map((course) => (
              <CourseCard key={course.id} course={course} onBookmarkChange={refreshList} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto my-8 space-y-3">
            <Bookmark className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="font-bold text-base text-slate-900">No Saved Bookmarks</h3>
            <p className="text-xs text-slate-500">
              Click the bookmark icon on any course card to add it to your personal list.
            </p>
            <button
              onClick={() => navigate({ page: 'explore' })}
              className="px-5 py-2.5 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-xs"
            >
              Explore Courses
            </button>
          </div>
        )}
      </main>
    </div>
  );
};
