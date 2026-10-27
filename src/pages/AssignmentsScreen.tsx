import React, { useEffect, useState } from 'react';
import { CheckCircle2, Clock, FileText, Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '../context/NavigationContext';
import { storage } from '../services/storage';
import { Assignment, AssignmentSubmission, Course } from '../types';

export const AssignmentsScreen: React.FC<{ courseId?: string }> = ({ courseId }) => {
  const { navigate } = useNavigation();
  const { user } = useAuth();

  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | undefined>(undefined);
  const [submission, setSubmission] = useState<AssignmentSubmission | undefined>(undefined);

  const [responseText, setResponseText] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState(false);

  useEffect(() => {
    const allCourses = storage.getCourses().filter((c) => c.assignment);
    setCourses(allCourses);

    const targetCourse = courseId
      ? allCourses.find((c) => c.id === courseId)
      : allCourses[0];

    setSelectedCourse(targetCourse);

    if (targetCourse && targetCourse.assignment) {
      const sub = storage.getAssignmentSubmission(targetCourse.id, targetCourse.assignment.id, user?.uid);
      setSubmission(sub);
      if (sub) {
        setResponseText(sub.responseText);
        setFileUrl(sub.fileUrl || '');
      } else {
        setResponseText('');
        setFileUrl('');
      }
    }
  }, [courseId, user]);

  const handleCourseChange = (c: Course) => {
    setSelectedCourse(c);
    if (c.assignment) {
      const sub = storage.getAssignmentSubmission(c.id, c.assignment.id, user?.uid);
      setSubmission(sub);
      if (sub) {
        setResponseText(sub.responseText);
        setFileUrl(sub.fileUrl || '');
      } else {
        setResponseText('');
        setFileUrl('');
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse || !selectedCourse.assignment || !responseText.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const sub = storage.submitAssignment(
        selectedCourse.id,
        selectedCourse.assignment!.id,
        responseText,
        fileUrl.trim() ? fileUrl : undefined,
        user?.uid
      );
      setSubmission(sub);
      setIsSubmitting(false);
      setSuccessToast(true);
      setTimeout(() => setSuccessToast(false), 3000);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24 md:pb-16 animate-fade-in">
      
      {/* Header */}
      <section className="bg-slate-900 text-white py-10 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Course Assignments
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-300">
            Submit practical project work for instructor feedback and grading.
          </p>
        </div>
      </section>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {courses.length > 0 && (
          <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-2">
            <span className="text-xs font-semibold text-slate-500 whitespace-nowrap shrink-0">
              Select Course:
            </span>
            {courses.map((c) => (
              <button
                key={c.id}
                onClick={() => handleCourseChange(c)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors shrink-0 ${
                  selectedCourse?.id === c.id
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {c.title}
              </button>
            ))}
          </div>
        )}

        {selectedCourse && selectedCourse.assignment ? (
          <div className="space-y-6">
            
            {/* Assignment Details Box */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
              <div className="flex justify-between items-start gap-4 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
                    {selectedCourse.categoryName}
                  </span>
                  <h2 className="text-xl font-extrabold text-slate-900 mt-0.5">
                    {selectedCourse.assignment.title}
                  </h2>
                </div>
                {selectedCourse.assignment.dueDate && (
                  <div className="flex items-center gap-1.5 text-xs text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-xl font-semibold shrink-0">
                    <Clock className="w-4 h-4 text-amber-600" />
                    <span>Due: {selectedCourse.assignment.dueDate}</span>
                  </div>
                )}
              </div>

              <div className="prose max-w-none text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-2xl border border-slate-100">
                {selectedCourse.assignment.instructions}
              </div>

              {/* Submission Requirements */}
              {selectedCourse.assignment.submissionRequirements && (
                <div className="space-y-1.5 pt-2">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Submission Criteria
                  </h4>
                  <ul className="list-disc list-inside text-xs text-slate-600 space-y-1">
                    {selectedCourse.assignment.submissionRequirements.map((req, idx) => (
                      <li key={idx}>{req}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Submission Form or Existing Submission View */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="font-bold text-base text-slate-900">Your Submission</h3>
                {submission && (
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Status: {submission.status.toUpperCase()}
                  </span>
                )}
              </div>

              {successToast && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Assignment submitted successfully! Feedback will be updated here.</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Assignment Response / Write-Up <span className="text-amber-600">*</span>
                  </label>
                  <textarea
                    rows={6}
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    placeholder="Enter your completed project notes, prompt frameworks, or script text here..."
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    External Project Link or Drive File (Optional)
                  </label>
                  <input
                    type="url"
                    value={fileUrl}
                    onChange={(e) => setFileUrl(e.target.value)}
                    placeholder="https://drive.google.com/file/d/... or https://figma.com/file/..."
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !responseText.trim()}
                  className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-amber-400 font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{submission ? 'Update Submission' : 'Submit Assignment'}</span>
                </button>
              </form>

              {submission && submission.feedback && (
                <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs space-y-1">
                  <div className="font-bold text-amber-900">Instructor Feedback & Grade ({submission.grade}):</div>
                  <p className="text-amber-800">{submission.feedback}</p>
                </div>
              )}
            </div>

          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto my-8">
            <FileText className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="font-bold text-base text-slate-900">No Assignments Available</h3>
            <p className="text-xs text-slate-500 mt-1">Select another course to check for assignments.</p>
          </div>
        )}

      </main>
    </div>
  );
};
