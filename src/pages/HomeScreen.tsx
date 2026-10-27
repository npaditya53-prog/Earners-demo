import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Compass,
  Cpu,
  Flame,
  GraduationCap,
  Play,
  Search,
  Sparkles,
  TrendingUp,
  Video
} from 'lucide-react';
import { CourseCard } from '../components/CourseCard';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '../context/NavigationContext';
import { storage } from '../services/storage';
import { Course, Enrollment } from '../types';

export const HomeScreen: React.FC = () => {
  const { navigate, setSearchQuery } = useNavigation();
  const { user } = useAuth();

  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    const allCourses = storage.getCourses().filter((c) => c.isPublished);
    setCourses(allCourses);
    setEnrollments(storage.getEnrollments(user?.uid));
  }, [user]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchQuery(searchInput);
      navigate({ page: 'explore' });
    }
  };

  // Find enrolled courses
  const enrolledCourseIds = new Set(enrollments.map((e) => e.courseId));
  const enrolledCoursesList = courses
    .filter((c) => enrolledCourseIds.has(c.id))
    .map((c) => ({
      course: c,
      enrollment: enrollments.find((e) => e.courseId === c.id)!,
    }));

  const inProgressList = enrolledCoursesList.filter((item) => !item.enrollment.isCompleted);
  const featuredCourses = courses.filter((c) => c.isFeatured);
  const categories = storage.getCourses().reduce<Record<string, { count: number; name: string }>>((acc, c) => {
    if (!acc[c.categoryId]) {
      acc[c.categoryId] = { count: 0, name: c.categoryName };
    }
    acc[c.categoryId].count++;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-slate-50 pb-24 md:pb-16 animate-fade-in">
      
      {/* Hero Welcome Banner */}
      <section className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white pt-8 pb-14 px-4 sm:px-6 lg:px-8 relative overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-widest mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Learn Digital Skills. Build Your Future.</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
                Welcome back, {user ? user.displayName.split(' ')[0] : 'Learner'} 👋
              </h1>
              <p className="mt-2 text-sm text-slate-300 max-w-2xl leading-relaxed">
                Master AI automation, video editing, UI/UX design, and freelancing with practical, career-ready courses.
              </p>
            </div>

            {/* Quick Stats Pill Bar */}
            <div className="flex items-center gap-4 bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700/80 shrink-0">
              <div className="text-center px-3 border-r border-slate-700">
                <div className="text-lg font-bold text-amber-400">{enrolledCoursesList.length}</div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider">Enrolled</div>
              </div>
              <div className="text-center px-3 border-r border-slate-700">
                <div className="text-lg font-bold text-emerald-400">
                  {enrolledCoursesList.filter((e) => e.enrollment.isCompleted).length}
                </div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider">Completed</div>
              </div>
              <div className="text-center px-3">
                <div className="text-lg font-bold text-sky-400">
                  {storage.getCertificates(user?.uid).length}
                </div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider">Certificates</div>
              </div>
            </div>
          </div>

          {/* Search Input Box */}
          <form onSubmit={handleSearchSubmit} className="max-w-xl relative">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search skill (e.g., AI prompting, Reels, Figma, Upwork)..."
              className="w-full pl-11 pr-28 py-3.5 bg-slate-800/90 border border-slate-700/90 focus:border-amber-500 rounded-2xl text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all shadow-lg"
            />
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl transition-all shadow-sm active:scale-95"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-12">
        
        {/* Continue Learning Section (if active enrollments exist) */}
        {inProgressList.length > 0 ? (
          <section>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-500" />
                <h2 className="text-lg font-bold text-slate-900">Continue Learning</h2>
              </div>
              <button
                onClick={() => navigate({ page: 'my-learning' })}
                className="text-xs font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1"
              >
                View Library
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {inProgressList.map(({ course, enrollment }) => (
                <div
                  key={course.id}
                  onClick={() => navigate({ page: 'course-details', courseId: course.id })}
                  className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <span className="text-xs font-semibold text-amber-600">
                        {course.categoryName}
                      </span>
                      <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full">
                        {enrollment.progressPercent}% Complete
                      </span>
                    </div>

                    <h3 className="font-bold text-base text-slate-900 line-clamp-1 mb-1">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-1 mb-4">
                      {course.subtitle}
                    </p>
                  </div>

                  {/* Progress Bar & Resume Action */}
                  <div className="space-y-3">
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 transition-all duration-300"
                        style={{ width: `${enrollment.progressPercent}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs text-slate-500">
                        Instructor: {course.instructor.name}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const firstLessonId = course.modules[0]?.lessons[0]?.id || 'les-1-1';
                          navigate({
                            page: 'lesson-player',
                            courseId: course.id,
                            lessonId: enrollment.lastLessonId || firstLessonId,
                          });
                        }}
                        className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-amber-400 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition-colors"
                      >
                        <Play className="w-3.5 h-3.5 fill-amber-400" />
                        <span>Resume Lesson</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : (
          /* Empty state for brand new user */
          <section className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-slate-100 rounded-2xl p-6 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="font-bold text-slate-900 text-base">Ready to start learning?</h3>
              <p className="text-xs text-slate-600">
                Explore our top-rated courses in AI, Video Editing, UI Design, and Freelancing.
              </p>
            </div>
            <button
              onClick={() => navigate({ page: 'explore' })}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-sm transition-all whitespace-nowrap"
            >
              Explore All Courses
            </button>
          </section>
        )}

        {/* Popular Skill Categories */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900">Skill Categories</h2>
            <button
              onClick={() => navigate({ page: 'categories' })}
              className="text-xs font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1"
            >
              All Categories
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {Object.entries(categories).map(([catId, info]) => (
              <button
                key={catId}
                onClick={() => navigate({ page: 'explore', categoryId: catId })}
                className="bg-white p-4 rounded-2xl border border-slate-200/80 hover:border-amber-400/80 hover:shadow-sm text-left transition-all group"
              >
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  {catId.includes('ai') ? (
                    <Cpu className="w-5 h-5" />
                  ) : catId.includes('video') ? (
                    <Video className="w-5 h-5" />
                  ) : catId.includes('design') ? (
                    <GraduationCap className="w-5 h-5" />
                  ) : (
                    <Compass className="w-5 h-5" />
                  )}
                </div>
                <h3 className="font-bold text-xs text-slate-900 group-hover:text-amber-600 transition-colors line-clamp-1">
                  {info.name}
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">{info.count} Courses</p>
              </button>
            ))}
          </div>
        </section>

        {/* Featured Recommended Courses */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Recommended Courses</h2>
              <p className="text-xs text-slate-500">Hand-picked digital skill courses for immediate growth</p>
            </div>
            <button
              onClick={() => navigate({ page: 'explore' })}
              className="text-xs font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1"
            >
              View All
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCourses.slice(0, 6).map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                isEnrolled={enrolledCourseIds.has(course.id)}
                progressPercent={
                  enrollments.find((e) => e.courseId === course.id)?.progressPercent
                }
              />
            ))}
          </div>
        </section>

        {/* Popular Learning Paths Banner */}
        <section className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 relative overflow-hidden">
          <div className="max-w-2xl">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Structured Career Paths
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1 mb-2">
              Go From Beginner to High-Income Digital Creator
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mb-6 leading-relaxed">
              Follow curated step-by-step learning roadmaps combining video editing, AI automation, and client acquisition skills.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              <div className="flex items-start gap-2.5 bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                <CheckCircle2 className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                <div className="text-xs">
                  <div className="font-bold text-white">Short-Form Creator Path</div>
                  <div className="text-slate-400 text-[11px]">Reels + CapCut + Video Scriptwriting</div>
                </div>
              </div>
              <div className="flex items-start gap-2.5 bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                <CheckCircle2 className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                <div className="text-xs">
                  <div className="font-bold text-white">AI Automation Consultant</div>
                  <div className="text-slate-400 text-[11px]">LLM Prompts + Make + Python Basics</div>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate({ page: 'explore' })}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-sm flex items-center gap-2 transition-all active:scale-95"
            >
              <span>Explore Learning Paths</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>

      </main>
    </div>
  );
};
