import React, { useEffect, useState } from 'react';
import { Award, BookOpen, Bookmark, CheckCircle2, Compass, Play } from 'lucide-react';
import { CourseCard } from '../components/CourseCard';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '../context/NavigationContext';
import { storage } from '../services/storage';
import { Course, Enrollment } from '../types';

export const MyLearningScreen: React.FC = () => {
  const { navigate } = useNavigation();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<'enrolled' | 'in-progress' | 'completed' | 'bookmarks'>('enrolled');
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  useEffect(() => {
    const allCourses = storage.getCourses();
    setCourses(allCourses);

    const userEnr = storage.getEnrollments(user?.uid);
    setEnrollments(userEnr);

    const userBm = storage.getBookmarks(user?.uid).map((b) => b.courseId);
    setBookmarks(userBm);
  }, [user, activeTab]);

  const enrolledCourseIds = new Set(enrollments.map((e) => e.courseId));
  const enrolledCoursesList = courses
    .filter((c) => enrolledCourseIds.has(c.id))
    .map((c) => ({
      course: c,
      enrollment: enrollments.find((e) => e.courseId === c.id)!,
    }));

  const inProgressList = enrolledCoursesList.filter((item) => !item.enrollment.isCompleted);
  const completedList = enrolledCoursesList.filter((item) => item.enrollment.isCompleted);
  const bookmarkedCourses = courses.filter((c) => bookmarks.includes(c.id));

  return (
    <div className="min-h-screen bg-slate-50 pb-24 md:pb-16 animate-fade-in">
      
      {/* Header */}
      <section className="bg-slate-900 text-white py-10 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              My Learning Library
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-300">
              Track your enrolled courses, lesson progress, and earned skill certificates.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-800/90 px-4 py-2.5 rounded-2xl border border-slate-700 text-xs shrink-0">
            <div>
              <span className="text-slate-400">Total Progress:</span>{' '}
              <span className="font-bold text-amber-400">{enrolledCoursesList.length} Courses</span>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* Filter Segmented Control Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 border-b border-slate-200">
          <button
            onClick={() => setActiveTab('enrolled')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'enrolled'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            All Enrolled ({enrolledCoursesList.length})
          </button>

          <button
            onClick={() => setActiveTab('in-progress')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'in-progress'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            In Progress ({inProgressList.length})
          </button>

          <button
            onClick={() => setActiveTab('completed')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'completed'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Completed ({completedList.length})
          </button>

          <button
            onClick={() => setActiveTab('bookmarks')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'bookmarks'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Bookmarks ({bookmarkedCourses.length})
          </button>
        </div>

        {/* List Content */}
        {activeTab === 'enrolled' && (
          enrolledCoursesList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCoursesList.map(({ course, enrollment }) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  isEnrolled={true}
                  progressPercent={enrollment.progressPercent}
                />
              ))}
            </div>
          ) : (
            <EmptyState title="No enrolled courses" message="Explore our catalog and enroll in your first skill course!" />
          )
        )}

        {activeTab === 'in-progress' && (
          inProgressList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {inProgressList.map(({ course, enrollment }) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  isEnrolled={true}
                  progressPercent={enrollment.progressPercent}
                />
              ))}
            </div>
          ) : (
            <EmptyState title="No courses in progress" message="Start a new course to see active progress here." />
          )
        )}

        {activeTab === 'completed' && (
          completedList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedList.map(({ course, enrollment }) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  isEnrolled={true}
                  progressPercent={100}
                />
              ))}
            </div>
          ) : (
            <EmptyState title="No completed courses yet" message="Complete all lessons in a course to earn your verified certificate!" />
          )
        )}

        {activeTab === 'bookmarks' && (
          bookmarkedCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookmarkedCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  isEnrolled={enrolledCourseIds.has(course.id)}
                  onBookmarkChange={() => {
                    setBookmarks(storage.getBookmarks(user?.uid).map((b) => b.courseId));
                  }}
                />
              ))}
            </div>
          ) : (
            <EmptyState title="No saved bookmarks" message="Click the bookmark icon on any course card to save it for later." />
          )
        )}

      </main>
    </div>
  );
};

const EmptyState: React.FC<{ title: string; message: string }> = ({ title, message }) => {
  const { navigate } = useNavigation();
  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto my-8 space-y-4">
      <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
        <BookOpen className="w-6 h-6" />
      </div>
      <div>
        <h3 className="font-bold text-base text-slate-900">{title}</h3>
        <p className="text-xs text-slate-500 mt-1">{message}</p>
      </div>
      <button
        onClick={() => navigate({ page: 'explore' })}
        className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-colors"
      >
        Explore Courses
      </button>
    </div>
  );
};
