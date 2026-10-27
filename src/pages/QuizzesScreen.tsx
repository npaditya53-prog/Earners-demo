import React, { useEffect, useState } from 'react';
import { Award, CheckCircle2, HelpCircle, RefreshCw, XCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '../context/NavigationContext';
import { storage } from '../services/storage';
import { Course, Quiz, QuizAttempt } from '../types';

export const QuizzesScreen: React.FC<{ courseId?: string }> = ({ courseId }) => {
  const { navigate } = useNavigation();
  const { user } = useAuth();

  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | undefined>(undefined);
  const [quiz, setQuiz] = useState<Quiz | undefined>(undefined);

  // Active quiz state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number[]>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [lastAttempt, setLastAttempt] = useState<QuizAttempt | undefined>(undefined);

  useEffect(() => {
    const allCourses = storage.getCourses().filter((c) => c.quiz);
    setCourses(allCourses);

    const targetCourse = courseId
      ? allCourses.find((c) => c.id === courseId)
      : allCourses[0];

    if (targetCourse && targetCourse.quiz) {
      setSelectedCourse(targetCourse);
      setQuiz(targetCourse.quiz);

      // Check last attempt
      const attempts = storage.getQuizAttempts(targetCourse.id, user?.uid);
      if (attempts.length > 0) {
        setLastAttempt(attempts[0]);
      }
    }
  }, [courseId, user]);

  const handleCourseSelect = (c: Course) => {
    setSelectedCourse(c);
    setQuiz(c.quiz);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setIsSubmitted(false);

    const attempts = storage.getQuizAttempts(c.id, user?.uid);
    setLastAttempt(attempts.length > 0 ? attempts[0] : undefined);
  };

  if (!selectedCourse || !quiz) {
    return (
      <div className="min-h-screen bg-slate-50 pb-24 md:pb-16">
        <section className="bg-slate-900 text-white py-10 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Skill Quizzes</h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-300">Test your digital skill knowledge to earn verified course certificates.</p>
          </div>
        </section>
        <div className="max-w-md mx-auto my-12 text-center p-8 bg-white rounded-3xl border border-slate-200">
          <HelpCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="font-bold text-slate-900">No Quizzes Available</h3>
          <p className="text-xs text-slate-500 mt-1">Enroll in a course to take skill quizzes.</p>
        </div>
      </div>
    );
  }

  const currentQ = quiz.questions[currentQuestionIndex];

  const handleOptionToggle = (optIdx: number) => {
    if (isSubmitted) return;

    const qId = currentQ.id;
    const currentSelected = selectedAnswers[qId] || [];

    if (currentQ.isMultiSelect) {
      if (currentSelected.includes(optIdx)) {
        setSelectedAnswers({
          ...selectedAnswers,
          [qId]: currentSelected.filter((i) => i !== optIdx),
        });
      } else {
        setSelectedAnswers({
          ...selectedAnswers,
          [qId]: [...currentSelected, optIdx],
        });
      }
    } else {
      setSelectedAnswers({
        ...selectedAnswers,
        [qId]: [optIdx],
      });
    }
  };

  const handleQuizSubmit = () => {
    let totalCorrectCount = 0;

    quiz.questions.forEach((q) => {
      const userChoices = (selectedAnswers[q.id] || []).sort();
      const correctChoices = [...q.correctAnswers].sort();

      const isMatch =
        userChoices.length === correctChoices.length &&
        userChoices.every((val, index) => val === correctChoices[index]);

      if (isMatch) {
        totalCorrectCount++;
      }
    });

    const calculatedScore = Math.round((totalCorrectCount / quiz.questions.length) * 100);
    const passed = calculatedScore >= quiz.passingScore;

    const attempt = storage.submitQuizAttempt(
      selectedCourse.id,
      quiz.id,
      selectedAnswers,
      calculatedScore,
      passed,
      user?.uid
    );

    setLastAttempt(attempt);
    setIsSubmitted(true);
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
    setIsSubmitted(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24 md:pb-16 animate-fade-in">
      
      {/* Header */}
      <section className="bg-slate-900 text-white py-10 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Skill Assessments & Quizzes
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-300">
            Verify your comprehension and score at least {quiz.passingScore}% to complete the course.
          </p>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* Course Switcher Tabs */}
        <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-2">
          {courses.map((c) => (
            <button
              key={c.id}
              onClick={() => handleCourseSelect(c)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors shrink-0 ${
                selectedCourse.id === c.id
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {c.title}
            </button>
          ))}
        </div>

        {/* Main Quiz Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
                {selectedCourse.categoryName}
              </span>
              <h2 className="text-lg font-extrabold text-slate-900 mt-0.5">
                {quiz.title}
              </h2>
            </div>
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              Passing Mark: {quiz.passingScore}%
            </span>
          </div>

          {!isSubmitted ? (
            <div className="space-y-6">
              
              {/* Progress */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-600">
                  <span>Question {currentQuestionIndex + 1} of {quiz.questions.length}</span>
                  <span>{currentQ.isMultiSelect ? 'Select all that apply' : 'Select one option'}</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 transition-all duration-300"
                    style={{
                      width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* Question */}
              <div className="text-sm sm:text-base font-bold text-slate-900 pt-2">
                {currentQ.question}
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {currentQ.options.map((option, optIdx) => {
                  const isSelected = (selectedAnswers[currentQ.id] || []).includes(optIdx);
                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleOptionToggle(optIdx)}
                      className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition-all flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-amber-50 border-amber-400 text-amber-950 font-bold shadow-xs'
                          : 'bg-slate-50/80 border-slate-200 text-slate-800 hover:bg-slate-100/80'
                      }`}
                    >
                      <span>{option}</span>
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] shrink-0 ${
                          isSelected
                            ? 'border-amber-600 bg-amber-500 text-slate-950 font-bold'
                            : 'border-slate-300 text-slate-400'
                        }`}
                      >
                        {isSelected ? '✓' : optIdx + 1}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Controls */}
              <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                <button
                  disabled={currentQuestionIndex === 0}
                  onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-xs font-bold rounded-xl text-slate-700 transition-colors"
                >
                  Previous
                </button>

                {currentQuestionIndex < quiz.questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                    className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-amber-400 text-xs font-bold rounded-xl shadow-xs transition-colors"
                  >
                    Next Question
                  </button>
                ) : (
                  <button
                    onClick={handleQuizSubmit}
                    className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-sm transition-all"
                  >
                    Submit Quiz Answers
                  </button>
                )}
              </div>

            </div>
          ) : (
            /* Results Breakdown View */
            <div className="space-y-6 animate-fade-in">
              <div className={`p-6 rounded-2xl border text-center space-y-2 ${
                lastAttempt?.passed
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                  : 'bg-rose-50 border-rose-200 text-rose-950'
              }`}>
                <div className="w-12 h-12 rounded-full mx-auto flex items-center justify-center bg-white shadow-xs">
                  {lastAttempt?.passed ? (
                    <CheckCircle2 className="w-7 h-7 text-emerald-600" />
                  ) : (
                    <XCircle className="w-7 h-7 text-rose-600" />
                  )}
                </div>

                <h3 className="font-extrabold text-xl">
                  {lastAttempt?.passed ? 'Congratulations! Quiz Passed 🎉' : 'Assessment Score Low'}
                </h3>
                <p className="text-xs max-w-md mx-auto">
                  You scored <strong className="text-sm">{lastAttempt?.score}%</strong> (Passing threshold is {quiz.passingScore}%).
                </p>

                {lastAttempt?.passed && (
                  <button
                    onClick={() => navigate({ page: 'certificates' })}
                    className="mt-2 px-4 py-2 bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs hover:bg-emerald-800 inline-flex items-center gap-1.5"
                  >
                    <Award className="w-4 h-4" />
                    <span>View Completion Certificate</span>
                  </button>
                )}
              </div>

              {/* Answers Review */}
              <div className="space-y-4">
                <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                  Detailed Explanation Review
                </h4>
                {quiz.questions.map((q, qIdx) => {
                  const userChoices = (selectedAnswers[q.id] || []).sort();
                  const correctChoices = [...q.correctAnswers].sort();
                  const isCorrect =
                    userChoices.length === correctChoices.length &&
                    userChoices.every((val, index) => val === correctChoices[index]);

                  return (
                    <div key={q.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2 text-xs">
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-bold text-slate-900">
                          {qIdx + 1}. {q.question}
                        </span>
                        <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                          isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {isCorrect ? 'Correct ✓' : 'Incorrect ✗'}
                        </span>
                      </div>

                      <div className="text-slate-600 pt-1">
                        <strong>Explanation:</strong> {q.explanation}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 text-center">
                <button
                  onClick={handleRetake}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-xs rounded-xl inline-flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Retake Quiz</span>
                </button>
              </div>

            </div>
          )}

        </div>

      </main>
    </div>
  );
};
