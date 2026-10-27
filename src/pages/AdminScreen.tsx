import React, { useEffect, useState } from 'react';
import {
  Award,
  BookOpen,
  CheckCircle2,
  Edit,
  Eye,
  EyeOff,
  Plus,
  PlusCircle,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  Users
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '../context/NavigationContext';
import { storage } from '../services/storage';
import { AssignmentSubmission, Course, Lesson, Module } from '../types';

export const AdminScreen: React.FC = () => {
  const { navigate } = useNavigation();
  const { user, isAdmin, toggleAdminRole } = useAuth();

  const [courses, setCourses] = useState<Course[]>([]);
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>([]);
  const [activeTab, setActiveTab] = useState<'courses' | 'submissions' | 'stats'>('courses');

  // New Course Modal / Form state
  const [isCreatingCourse, setIsCreatingCourse] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newCategory, setNewCategory] = useState('ai-automation');
  const [newCategoryName, setNewCategoryName] = useState('AI & Automation');
  const [newLevel, setNewLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [newDuration, setNewDuration] = useState('2h 30m');
  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [newVideoUrl, setNewVideoUrl] = useState('');

  useEffect(() => {
    setCourses(storage.getCourses());
    setSubmissions(storage.getAssignmentSubmissions());
  }, []);

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 px-4 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-3xl border border-slate-200 space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Protected Administration Area</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            You must be logged in with administrator privileges to access course management and submission grading.
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={toggleAdminRole}
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl shadow-xs"
            >
              Enable Admin Mode for Testing
            </button>
            <button
              onClick={() => navigate({ page: 'home' })}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
            >
              Return Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handlePublishToggle = (courseId: string) => {
    const course = courses.find((c) => c.id === courseId);
    if (!course) return;

    const updated = { ...course, isPublished: !course.isPublished };
    storage.saveCourse(updated);
    setCourses(storage.getCourses());
  };

  const handleDeleteCourse = (courseId: string) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      storage.deleteCourse(courseId);
      setCourses(storage.getCourses());
    }
  };

  const handleCreateCourseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newCourse: Course = {
      id: `course-custom-${Date.now()}`,
      title: newTitle,
      subtitle: newSubtitle || 'Master this skill through step-by-step practical modules.',
      slug: newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      categoryId: newCategory,
      categoryName: newCategoryName,
      instructor: {
        id: user?.uid || 'inst-admin',
        name: user?.displayName || 'EARNERS Admin',
        title: 'Lead Curriculum Author',
        avatar: '',
        bio: 'Senior domain instructor at EARNERS platform.',
        rating: 5.0,
        studentsCount: 1500,
      },
      level: newLevel,
      language: 'English',
      totalDuration: newDuration,
      badgeTag: 'New',
      gradientTheme: 'from-slate-900 via-amber-950 to-neutral-900',
      iconName: 'Cpu',
      isPublished: true,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      learningOutcomes: [
        'Practical execution of foundational skill concepts',
        'Real-world portfolio asset creation and workflows',
      ],
      prerequisites: ['Basic internet access'],
      modules: [
        {
          id: `mod-${Date.now()}`,
          title: 'Module 1: Foundations & Execution',
          description: 'Initial practical lesson guide',
          lessons: [
            {
              id: `les-${Date.now()}`,
              title: newLessonTitle || 'Lesson 1: Introduction & Overview',
              durationMinutes: 15,
              type: 'video',
              videoUrl: newVideoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
              content: 'Welcome to this custom admin course module.',
            },
          ],
        },
      ],
    };

    storage.saveCourse(newCourse);
    setCourses(storage.getCourses());
    setIsCreatingCourse(false);

    // Reset inputs
    setNewTitle('');
    setNewSubtitle('');
    setNewLessonTitle('');
    setNewVideoUrl('');
  };

  const totalEnrollments = storage.getEnrollments().length;
  const totalCertificates = storage.getCertificates().length;

  return (
    <div className="min-h-screen bg-slate-50 pb-24 md:pb-16 animate-fade-in">
      
      {/* Header */}
      <section className="bg-slate-900 text-white py-10 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Admin & Content Management System</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              EARNERS Course Administration
            </h1>
          </div>

          <button
            onClick={() => setIsCreatingCourse(true)}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold rounded-xl shadow-xs transition-all flex items-center gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Course</span>
          </button>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <button
            onClick={() => setActiveTab('courses')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'courses'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            Courses Catalog ({courses.length})
          </button>
          <button
            onClick={() => setActiveTab('submissions')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'submissions'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            Assignment Submissions ({submissions.length})
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'stats'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            Platform Analytics
          </button>
        </div>

        {/* Modal: Create New Course Form */}
        {isCreatingCourse && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h2 className="text-base font-extrabold text-slate-900">Author New Course</h2>
              <button
                onClick={() => setIsCreatingCourse(false)}
                className="text-xs text-slate-400 hover:text-slate-600"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleCreateCourseSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Course Title *</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Advanced CapCut Desktop Motion Graphics"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => {
                      setNewCategory(e.target.value);
                      const nameMap: Record<string, string> = {
                        'ai-automation': 'AI & Automation',
                        'video-editing': 'Video Editing & Reels',
                        'design-uiux': 'Design & UI/UX',
                        'freelancing-biz': 'Freelancing & Business',
                      };
                      setNewCategoryName(nameMap[e.target.value] || 'Digital Skill');
                    }}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  >
                    <option value="ai-automation">AI & Automation</option>
                    <option value="video-editing">Video Editing & Reels</option>
                    <option value="design-uiux">Design & UI/UX</option>
                    <option value="freelancing-biz">Freelancing & Business</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Course Subtitle</label>
                <textarea
                  rows={2}
                  value={newSubtitle}
                  onChange={(e) => setNewSubtitle(e.target.value)}
                  placeholder="Concise 1-sentence value proposition for learners..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">First Lesson Title</label>
                  <input
                    type="text"
                    value={newLessonTitle}
                    onChange={(e) => setNewLessonTitle(e.target.value)}
                    placeholder="e.g. Lesson 1: Orientation & Tools"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Sample MP4 / Video URL</label>
                  <input
                    type="text"
                    value={newVideoUrl}
                    onChange={(e) => setNewVideoUrl(e.target.value)}
                    placeholder="https://...mp4"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px]"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-xs"
                >
                  Publish & Save Course
                </button>
                <button
                  type="button"
                  onClick={() => setIsCreatingCourse(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 1: Course Management Table */}
        {activeTab === 'courses' && (
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-slate-200 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-4">Course Title</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Level</th>
                    <th className="p-4">Lessons</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                  {courses.map((c) => {
                    const totalLes = c.modules.reduce((acc, m) => acc + m.lessons.length, 0);
                    return (
                      <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4 font-bold text-slate-900">{c.title}</td>
                        <td className="p-4">{c.categoryName}</td>
                        <td className="p-4">{c.level}</td>
                        <td className="p-4">{totalLes} lessons</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                            c.isPublished
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            {c.isPublished ? 'Published' : 'Draft'}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => handlePublishToggle(c.id)}
                            className="p-1.5 text-slate-600 hover:text-amber-600 rounded-lg hover:bg-slate-100"
                            title={c.isPublished ? 'Unpublish' : 'Publish'}
                          >
                            {c.isPublished ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => handleDeleteCourse(c.id)}
                            className="p-1.5 text-rose-500 hover:text-rose-700 rounded-lg hover:bg-rose-50"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Assignment Submissions */}
        {activeTab === 'submissions' && (
          <div className="space-y-4">
            {submissions.length > 0 ? (
              submissions.map((sub) => (
                <div key={sub.id} className="bg-white p-5 rounded-2xl border border-slate-200 text-xs space-y-2">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <span className="font-bold text-slate-900">Submission #{sub.id}</span>
                    <span className="text-[10px] text-slate-500">{sub.submittedAt}</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl font-mono text-[11px] text-slate-800">
                    {sub.responseText}
                  </div>
                  {sub.fileUrl && (
                    <a
                      href={sub.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-amber-600 underline font-semibold block"
                    >
                      Attachment: {sub.fileUrl}
                    </a>
                  )}
                </div>
              ))
            ) : (
              <div className="bg-white p-8 rounded-2xl border text-center text-xs text-slate-500">
                No assignment submissions queued for review yet.
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Analytics */}
        {activeTab === 'stats' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs text-center space-y-1">
              <BookOpen className="w-8 h-8 text-amber-500 mx-auto mb-2" />
              <div className="text-2xl font-black text-slate-900">{courses.length}</div>
              <div className="text-xs font-medium text-slate-500">Active Courses</div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs text-center space-y-1">
              <Users className="w-8 h-8 text-sky-500 mx-auto mb-2" />
              <div className="text-2xl font-black text-slate-900">{totalEnrollments}</div>
              <div className="text-xs font-medium text-slate-500">Total Learner Enrollments</div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs text-center space-y-1">
              <Award className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <div className="text-2xl font-black text-slate-900">{totalCertificates}</div>
              <div className="text-xs font-medium text-slate-500">Issued Skill Certificates</div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};
