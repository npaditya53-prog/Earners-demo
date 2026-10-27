import React, { useEffect, useState } from 'react';
import {
  Award,
  Bookmark,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Copy,
  FileText,
  Globe,
  HelpCircle,
  Play,
  PlayCircle,
  Share2,
  ShieldCheck,
  Star,
  User
} from 'lucide-react';
import { CourseCard } from '../components/CourseCard';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '../context/NavigationContext';
import { storage } from '../services/storage';
import { Course, Enrollment } from '../types';

interface CourseDetailsProps {
  courseId: string;
}

export const CourseDetailsScreen: React.FC<CourseDetailsProps> = ({ courseId }) => {
  const { navigate } = useNavigation();
  const { user } = useAuth();

  const [course, setCourse] = useState<Course | undefined>(undefined);
  const [enrollment, setEnrollment] = useState<Enrollment | undefined>(undefined);
  const [bookmarked, setBookmarked] = useState<boolean>(false);
  const [openModules, setOpenModules] = useState<Record<string, boolean>>({});
  const [copyToast, setCopyToast] = useState<boolean>(false);
  const [relatedCourses, setRelatedCourses] = useState<Course[]>([]);

  useEffect(() => {
    const c = storage.getCourseById(courseId);
    setCourse(c);
    if (c) {
      setEnrollment(storage.getEnrollmentByCourse(c.id, user?.uid));
      setBookmarked(storage.isBookmarked(c.id, user?.uid));
      
      // Default open first module
      if (c.modules.length > 0) {
        setOpenModules({ [c.modules[0].id]: true });
      }

      // Related courses in same category
      const related = storage
        .getCourses()
        .filter((item) => item.id !== c.id && item.categoryId === c.categoryId);
      setRelatedCourses(related);
    }
  }, [courseId, user]);

  if (!course) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 px-4 text-center">
        <h2 className="text-xl font-bold text-slate-900 mb-2">Course Not Found</h2>
        <p className="text-xs text-slate-500 mb-6">The course you are looking for does not exist or was archived.</p>
        <button
          onClick={() => navigate({ page: 'explore' })}
          className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-xl"
        >
          Browse Courses
        </button>
      </div>
    );
  }

  const toggleModule = (modId: string) => {
    setOpenModules((prev) => ({ ...prev, [modId]: !prev[modId] }));
  };

  const handleEnrollClick = () => {
    const enr = storage.enrollInCourse(course.id, user?.uid);
    setEnrollment(enr);

    // Open first lesson
    const firstLessonId = course.modules[0]?.lessons[0]?.id || 'les-1-1';
    navigate({
      page: 'lesson-player',
      courseId: course.id,
      lessonId: enr.lastLessonId || firstLessonId,
    });
  };

  const handleBookmarkClick = () => {
    const newState = storage.toggleBookmark(course.id, user?.uid);
    setBookmarked(newState);
  };

  const handleShareClick = async () => {
    const shareData = {
      title: course.title,
      text: course.subtitle,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // Fallback to copy link
        navigator.clipboard.writeText(window.location.href);
        setCopyToast(true);
        setTimeout(() => setCopyToast(false), 2500);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopyToast(true);
      setTimeout(() => setCopyToast(false), 2500);
    }
  };

  const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);

  return (
    <div className="min-h-screen bg-slate-50 pb-24 md:pb-16 animate-fade-in">
      
      {/* Toast alert for copy link */}
      {copyToast && (
        <div className="fixed top-20 right-4 z-50 bg-slate-900 text-amber-400 px-4 py-2.5 rounded-xl text-xs font-bold shadow-xl border border-slate-800 animate-slide-down">
          Course link copied to clipboard!
        </div>
      )}

      {/* Top Banner & Header */}
      <section className={`bg-gradient-to-b ${course.gradientTheme} text-white pt-10 pb-16 px-4 sm:px-6 lg:px-8 relative`}>
        <div className="max-w-7xl mx-auto">
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-amber-400/90 font-medium mb-4">
            <button onClick={() => navigate({ page: 'explore' })} className="hover:underline">Explore</button>
            <span>/</span>
            <span>{course.categoryName}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Left 2 Cols: Title & Outcomes */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-900 bg-amber-400 px-2.5 py-0.5 rounded-md font-bold">
                  {course.level}
                </span>
                <span className="text-xs text-slate-300 flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-amber-400" />
                  {course.language}
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-snug">
                {course.title}
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                {course.subtitle}
              </p>

              {/* Instructor Mini Badge */}
              <div className="flex items-center gap-3 pt-2">
                <div className="w-10 h-10 rounded-full bg-slate-800 overflow-hidden ring-2 ring-amber-500/30 shrink-0">
                  {course.instructor.avatar ? (
                    <img src={course.instructor.avatar} alt={course.instructor.name} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-5 h-5 text-slate-400 m-auto mt-2" />
                  )}
                </div>
                <div>
                  <div className="text-xs font-bold text-white">{course.instructor.name}</div>
                  <div className="text-[11px] text-slate-400">{course.instructor.title}</div>
                </div>
                <div className="ml-auto flex items-center gap-1 text-xs font-bold text-amber-400 bg-slate-900/60 px-3 py-1 rounded-xl border border-slate-800">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{course.instructor.rating} Instructor Rating</span>
                </div>
              </div>
            </div>

            {/* Right 1 Col: Floating Action Card */}
            <div className="bg-white text-slate-900 rounded-3xl p-6 border border-slate-200 shadow-xl space-y-5 lg:-mb-24 relative z-20">
              
              {/* Preview Banner */}
              <div className={`h-40 rounded-2xl bg-gradient-to-br ${course.gradientTheme} p-4 flex flex-col justify-between relative overflow-hidden`}>
                <div className="flex justify-between items-center text-xs font-semibold text-amber-300">
                  <span>Preview Course</span>
                  <PlayCircle className="w-6 h-6 text-white" />
                </div>
                <div className="text-xs text-slate-200 font-medium">
                  {course.modules.length} Modules · {totalLessons} Lessons
                </div>
              </div>

              {/* Course Meta Highlights */}
              <div className="space-y-2.5 text-xs text-slate-700 font-medium border-b border-slate-100 pb-4">
                <div className="flex justify-between">
                  <span className="text-slate-500 flex items-center gap-1.5"><Clock className="w-4 h-4 text-slate-400" /> Total Duration</span>
                  <span className="font-bold text-slate-900">{course.totalDuration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 flex items-center gap-1.5"><FileText className="w-4 h-4 text-slate-400" /> Total Modules</span>
                  <span className="font-bold text-slate-900">{course.modules.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 flex items-center gap-1.5"><Award className="w-4 h-4 text-slate-400" /> Certificate</span>
                  <span className="font-bold text-emerald-600">Included on completion</span>
                </div>
              </div>

              {/* Enrollment / Resume Button */}
              {enrollment ? (
                <div className="space-y-2">
                  <button
                    onClick={handleEnrollClick}
                    className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-amber-400 font-extrabold text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <Play className="w-4 h-4 fill-amber-400" />
                    <span>Resume Learning ({enrollment.progressPercent}%)</span>
                  </button>
                  <p className="text-[11px] text-emerald-600 text-center font-semibold">
                    ✓ You are currently enrolled in this course
                  </p>
                </div>
              ) : (
                <button
                  onClick={handleEnrollClick}
                  className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-98"
                >
                  <CheckCircle2 className="w-5 h-5 text-slate-950" />
                  <span>Enroll Now — Free Access</span>
                </button>
              )}

              {/* Bookmark & Share Actions */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={handleBookmarkClick}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-colors ${
                    bookmarked
                      ? 'bg-amber-50 border-amber-300 text-amber-800'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-amber-600' : ''}`} />
                  <span>{bookmarked ? 'Saved' : 'Bookmark'}</span>
                </button>

                <button
                  onClick={handleShareClick}
                  className="py-2 px-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 lg:mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main 2 Cols */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* What You Will Learn */}
            <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-500" />
                <span>What You Will Learn</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {course.learningOutcomes.map((outcome, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                    <span>{outcome}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Course Curriculum Accordions */}
            <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Course Curriculum</h2>
                  <p className="text-xs text-slate-500">{course.modules.length} Modules · {totalLessons} Lessons</p>
                </div>
              </div>

              <div className="space-y-3">
                {course.modules.map((mod, modIdx) => {
                  const isOpen = !!openModules[mod.id];
                  return (
                    <div key={mod.id} className="border border-slate-200 rounded-2xl overflow-hidden transition-colors">
                      <button
                        onClick={() => toggleModule(mod.id)}
                        className="w-full p-4 bg-slate-50 hover:bg-slate-100/80 text-left flex items-center justify-between gap-3 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-lg bg-amber-100 text-amber-800 text-xs font-bold flex items-center justify-center shrink-0">
                            {modIdx + 1}
                          </span>
                          <div>
                            <h3 className="font-bold text-xs sm:text-sm text-slate-900">{mod.title}</h3>
                            <p className="text-[11px] text-slate-500 line-clamp-1">{mod.description}</p>
                          </div>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {isOpen && (
                        <div className="p-4 bg-white border-t border-slate-100 space-y-2">
                          {mod.lessons.map((les) => (
                            <div
                              key={les.id}
                              onClick={() => {
                                handleEnrollClick();
                              }}
                              className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer text-xs"
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <PlayCircle className="w-4 h-4 text-amber-500 shrink-0" />
                                <span className="font-medium text-slate-800 truncate">{les.title}</span>
                                {les.isFreePreview && (
                                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md shrink-0">
                                    Free Preview
                                  </span>
                                )}
                              </div>
                              <span className="text-[11px] text-slate-400 font-mono shrink-0 ml-2">
                                {les.durationMinutes}m
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Prerequisites */}
            {course.prerequisites.length > 0 && (
              <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
                <h2 className="text-base font-bold text-slate-900 mb-3">Prerequisites</h2>
                <ul className="list-disc list-inside space-y-1 text-xs text-slate-600">
                  {course.prerequisites.map((req, idx) => (
                    <li key={idx}>{req}</li>
                  ))}
                </ul>
              </section>
            )}

            {/* Instructor Bio */}
            <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
              <h2 className="text-base font-bold text-slate-900 mb-4">About the Instructor</h2>
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-200 overflow-hidden shrink-0">
                  {course.instructor.avatar ? (
                    <img src={course.instructor.avatar} alt={course.instructor.name} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-8 h-8 text-slate-400 m-auto mt-4" />
                  )}
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-sm text-slate-900">{course.instructor.name}</h3>
                  <p className="text-xs text-amber-700 font-medium">{course.instructor.title}</p>
                  <p className="text-xs text-slate-600 leading-relaxed pt-1">{course.instructor.bio}</p>
                </div>
              </div>
            </section>

          </div>

          {/* Right Sidebar: Related Courses */}
          <div className="space-y-6">
            <h2 className="text-base font-bold text-slate-900">Related Courses</h2>
            {relatedCourses.length > 0 ? (
              <div className="space-y-4">
                {relatedCourses.map((rel) => (
                  <CourseCard key={rel.id} course={rel} />
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500">No other courses in this category yet.</p>
            )}
          </div>

        </div>
      </main>
    </div>
  );
};
