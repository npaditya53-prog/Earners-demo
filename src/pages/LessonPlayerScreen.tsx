import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  Award,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  HelpCircle,
  ListVideo,
  Maximize,
  Menu,
  Play,
  PlayCircle,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '../context/NavigationContext';
import { storage } from '../services/storage';
import { Course, Enrollment, Lesson, Module } from '../types';

interface LessonPlayerProps {
  courseId: string;
  lessonId: string;
}

export const LessonPlayerScreen: React.FC<LessonPlayerProps> = ({ courseId, lessonId }) => {
  const { navigate, goBack } = useNavigation();
  const { user } = useAuth();

  const [course, setCourse] = useState<Course | undefined>(undefined);
  const [enrollment, setEnrollment] = useState<Enrollment | undefined>(undefined);
  const [currentLesson, setCurrentLesson] = useState<Lesson | undefined>(undefined);
  const [currentModule, setCurrentModule] = useState<Module | undefined>(undefined);
  const [isCurriculumOpen, setIsCurriculumOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'resources' | 'announcements'>('content');

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const c = storage.getCourseById(courseId);
    setCourse(c);

    if (c) {
      let foundLes: Lesson | undefined = undefined;
      let foundMod: Module | undefined = undefined;

      for (const mod of c.modules) {
        const target = mod.lessons.find((l) => l.id === lessonId);
        if (target) {
          foundLes = target;
          foundMod = mod;
          break;
        }
      }

      // Default to first lesson if specified ID not found
      if (!foundLes && c.modules[0]?.lessons[0]) {
        foundLes = c.modules[0].lessons[0];
        foundMod = c.modules[0];
      }

      setCurrentLesson(foundLes);
      setCurrentModule(foundMod);

      // Get or create enrollment
      let enr = storage.getEnrollmentByCourse(c.id, user?.uid);
      if (!enr) {
        enr = storage.enrollInCourse(c.id, user?.uid);
      }
      setEnrollment(enr);
    }
  }, [courseId, lessonId, user]);

  // Handle saved playback position resume
  useEffect(() => {
    if (videoRef.current && enrollment?.lastPlaybackTime && currentLesson?.type === 'video') {
      videoRef.current.currentTime = enrollment.lastPlaybackTime;
    }
  }, [currentLesson, enrollment]);

  if (!course || !currentLesson) {
    return (
      <div className="min-h-screen bg-slate-900 text-white p-8 text-center">
        <h2 className="text-xl font-bold mb-2">Lesson Loading...</h2>
        <button onClick={goBack} className="text-xs text-amber-400 underline">
          Return to course
        </button>
      </div>
    );
  }

  // Find all lessons flattened for prev/next
  const allLessons: { lesson: Lesson; module: Module }[] = [];
  course.modules.forEach((mod) => {
    mod.lessons.forEach((les) => {
      allLessons.push({ lesson: les, module: mod });
    });
  });

  const currentIndex = allLessons.findIndex((item) => item.lesson.id === currentLesson.id);
  const prevItem = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextItem = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  const isCompleted = enrollment?.completedLessonIds.includes(currentLesson.id);

  const handleMarkComplete = () => {
    const { enrollment: updatedEnr, isCourseNewlyCompleted } = storage.markLessonComplete(
      course.id,
      currentLesson.id,
      user?.uid
    );
    setEnrollment(updatedEnr);

    // Auto navigate to next lesson if available
    if (nextItem && !isCourseNewlyCompleted) {
      navigate({
        page: 'lesson-player',
        courseId: course.id,
        lessonId: nextItem.lesson.id,
      });
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      storage.updateLessonPlaybackTime(
        course.id,
        currentLesson.id,
        videoRef.current.currentTime,
        user?.uid
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      
      {/* Top Player Header */}
      <header className="h-14 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between shrink-0 z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate({ page: 'course-details', courseId: course.id })}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Back to Course Details"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex flex-col">
            <h1 className="text-xs sm:text-sm font-bold text-white truncate max-w-[200px] sm:max-w-md">
              {course.title}
            </h1>
            <span className="text-[10px] text-amber-400 font-medium">
              {currentModule?.title} · Lesson {currentIndex + 1} of {allLessons.length}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Drawer Toggle */}
          <button
            onClick={() => setIsCurriculumOpen(!isCurriculumOpen)}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <ListVideo className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline-block">Curriculum Sidebar</span>
          </button>
        </div>
      </header>

      {/* Main Viewport Split */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        
        {/* Left / Top: Video Player & Main Article Area */}
        <div className="flex-1 overflow-y-auto flex flex-col bg-slate-950">
          
          {/* Video or Lesson Viewport */}
          <div className="w-full bg-black aspect-video max-h-[60vh] relative flex items-center justify-center shrink-0">
            {currentLesson.type === 'video' && currentLesson.videoUrl ? (
              <video
                ref={videoRef}
                src={currentLesson.videoUrl}
                controls
                onTimeUpdate={handleTimeUpdate}
                className="w-full h-full object-contain"
                poster="/pwa-512x512.png"
              />
            ) : (
              <div className="p-8 text-center space-y-3">
                <FileText className="w-12 h-12 text-amber-500 mx-auto opacity-80" />
                <h3 className="font-bold text-lg text-white">Text & Concept Lesson</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Read through the detailed guide and resources below to complete this module.
                </p>
              </div>
            )}
          </div>

          {/* Lesson Action Controls Bar */}
          <div className="p-4 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2">
              <button
                disabled={!prevItem}
                onClick={() =>
                  prevItem &&
                  navigate({
                    page: 'lesson-player',
                    courseId: course.id,
                    lessonId: prevItem.lesson.id,
                  })
                }
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs font-semibold rounded-xl flex items-center gap-1 text-slate-200 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <button
                disabled={!nextItem}
                onClick={() =>
                  nextItem &&
                  navigate({
                    page: 'lesson-player',
                    courseId: course.id,
                    lessonId: nextItem.lesson.id,
                  })
                }
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs font-semibold rounded-xl flex items-center gap-1 text-slate-200 transition-colors"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={handleMarkComplete}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all active:scale-95 ${
                isCompleted
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isCompleted ? 'Completed ✓' : 'Mark Lesson Complete'}</span>
            </button>
          </div>

          {/* Lesson Tabs & Text Content */}
          <div className="p-4 sm:p-6 max-w-4xl space-y-6">
            
            {/* Tab Header */}
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <button
                onClick={() => setActiveTab('content')}
                className={`text-xs font-bold pb-1 transition-colors ${
                  activeTab === 'content'
                    ? 'text-amber-400 border-b-2 border-amber-400'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Lesson Notes & Overview
              </button>
              {currentLesson.resources && currentLesson.resources.length > 0 && (
                <button
                  onClick={() => setActiveTab('resources')}
                  className={`text-xs font-bold pb-1 transition-colors ${
                    activeTab === 'resources'
                      ? 'text-amber-400 border-b-2 border-amber-400'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Resources ({currentLesson.resources.length})
                </button>
              )}
            </div>

            {/* Content Tab Body */}
            {activeTab === 'content' && (
              <div className="prose prose-invert max-w-none text-xs sm:text-sm text-slate-300 leading-relaxed space-y-4">
                <h2 className="text-lg font-bold text-white mb-2">{currentLesson.title}</h2>
                <div className="whitespace-pre-line bg-slate-900/80 p-5 rounded-2xl border border-slate-800 font-sans">
                  {currentLesson.content || 'Watch the video lesson above to master this concept.'}
                </div>
              </div>
            )}

            {/* Resources Tab Body */}
            {activeTab === 'resources' && currentLesson.resources && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Downloadable Attachments
                </h3>
                {currentLesson.resources.map((res, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <Download className="w-4 h-4 text-amber-400 shrink-0" />
                      <div>
                        <div className="font-semibold text-white">{res.title}</div>
                        <div className="text-[10px] text-slate-500">{res.type} · {res.size}</div>
                      </div>
                    </div>
                    <a
                      href={res.url}
                      download
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold text-[11px] rounded-lg transition-colors"
                    >
                      Download
                    </a>
                  </div>
                ))}
              </div>
            )}

            {/* Quiz & Assignment Jump Banners if configured */}
            {course.quiz && (
              <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 flex items-center justify-between gap-3 mt-8">
                <div>
                  <h4 className="font-bold text-xs text-white">Course Assessment Quiz</h4>
                  <p className="text-[11px] text-slate-400">Test your mastery to earn your completion certificate.</p>
                </div>
                <button
                  onClick={() => navigate({ page: 'quizzes', courseId: course.id })}
                  className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-xs shrink-0"
                >
                  Take Quiz
                </button>
              </div>
            )}

          </div>

        </div>

        {/* Right Collapsible Curriculum Drawer Sidebar */}
        <aside
          className={`w-full lg:w-80 bg-slate-900 border-l border-slate-800 flex flex-col shrink-0 transition-all ${
            isCurriculumOpen ? 'block' : 'hidden lg:flex'
          }`}
        >
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Course Modules
            </h3>
            <span className="text-[11px] text-amber-400 font-semibold">
              {enrollment?.progressPercent || 0}% Completed
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-4">
            {course.modules.map((mod, modIdx) => (
              <div key={mod.id} className="space-y-1.5">
                <div className="px-2 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Mod {modIdx + 1}: {mod.title}
                </div>
                {mod.lessons.map((les) => {
                  const isCurrent = les.id === currentLesson.id;
                  const isLesDone = enrollment?.completedLessonIds.includes(les.id);
                  return (
                    <button
                      key={les.id}
                      onClick={() =>
                        navigate({
                          page: 'lesson-player',
                          courseId: course.id,
                          lessonId: les.id,
                        })
                      }
                      className={`w-full p-2.5 rounded-xl text-left flex items-center justify-between gap-2 text-xs transition-colors ${
                        isCurrent
                          ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                          : 'hover:bg-slate-800/80 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {isLesDone ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <PlayCircle className="w-4 h-4 text-slate-500 shrink-0" />
                        )}
                        <span className="truncate">{les.title}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono shrink-0">
                        {les.durationMinutes}m
                      </span>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </aside>

      </div>
    </div>
  );
};
