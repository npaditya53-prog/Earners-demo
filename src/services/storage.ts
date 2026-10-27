import { SEED_ANNOUNCEMENTS, SEED_COURSES } from '../data/seedCourses';
import {
  AppNotification,
  AssignmentSubmission,
  Bookmark,
  Certificate,
  Course,
  Enrollment,
  QuizAttempt,
  UserProfile,
} from '../types';

const STORAGE_KEYS = {
  COURSES: 'earners_courses_v1',
  ENROLLMENTS: 'earners_enrollments_v1',
  BOOKMARKS: 'earners_bookmarks_v1',
  NOTIFICATIONS: 'earners_notifications_v1',
  QUIZ_ATTEMPTS: 'earners_quiz_attempts_v1',
  ASSIGNMENT_SUBMISSIONS: 'earners_assignment_submissions_v1',
  CERTIFICATES: 'earners_certificates_v1',
  USER_PROFILE: 'earners_user_profile_v1',
};

// Initial default user for Guest/Demo state
const DEFAULT_USER: UserProfile = {
  uid: 'user-demo-101',
  displayName: 'Aditya Kumar',
  email: 'learner@earners.app',
  role: 'learner',
  bio: 'Passionate learner exploring AI prompt engineering and video editing.',
  joinedAt: '2026-01-01',
  completedCoursesCount: 0,
  enrolledCoursesCount: 1,
};

// Initial sample notification
const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-welcome',
    userId: 'user-demo-101',
    title: 'Welcome to EARNERS!',
    message: 'Start exploring high-demand digital skills in AI, Video Editing, and UI/UX Design.',
    type: 'announcement',
    read: false,
    createdAt: '2026-03-01T10:00:00Z',
  },
  {
    id: 'notif-course-update',
    userId: 'user-demo-101',
    title: 'New AI Course Published',
    message: 'Check out the new AI Prompt Engineering & Automation Masterclass.',
    type: 'course_update',
    link: 'course-ai-prompting',
    read: false,
    createdAt: '2026-03-10T14:30:00Z',
  },
];

// Seed initial demo enrollment for immediate playability
const INITIAL_ENROLLMENTS: Enrollment[] = [
  {
    id: 'enr-ai-demo',
    userId: 'user-demo-101',
    courseId: 'course-ai-prompting',
    enrolledAt: '2026-03-05T09:00:00Z',
    lastAccessedAt: '2026-03-15T16:20:00Z',
    completedLessonIds: ['les-1-1'],
    lastLessonId: 'les-1-2',
    lastPlaybackTime: 45,
    progressPercent: 20,
    isCompleted: false,
  },
];

class StorageService {
  private get<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.warn(`LocalStorage read error for key ${key}:`, e);
      return defaultValue;
    }
  }

  private set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn(`LocalStorage write error for key ${key}:`, e);
    }
  }

  // --- COURSES ---
  public getCourses(): Course[] {
    const saved = this.get<Course[]>(STORAGE_KEYS.COURSES, []);
    if (!saved || saved.length === 0) {
      this.set(STORAGE_KEYS.COURSES, SEED_COURSES);
      return SEED_COURSES;
    }
    return saved;
  }

  public getCourseById(id: string): Course | undefined {
    const courses = this.getCourses();
    return courses.find((c) => c.id === id);
  }

  public saveCourse(course: Course): Course {
    const courses = this.getCourses();
    const index = courses.findIndex((c) => c.id === course.id);
    if (index >= 0) {
      courses[index] = { ...course, updatedAt: new Date().toISOString().split('T')[0] };
    } else {
      courses.unshift({
        ...course,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
      });
    }
    this.set(STORAGE_KEYS.COURSES, courses);
    return course;
  }

  public deleteCourse(id: string): void {
    const courses = this.getCourses().filter((c) => c.id !== id);
    this.set(STORAGE_KEYS.COURSES, courses);
  }

  // --- USER PROFILE ---
  public getUserProfile(): UserProfile {
    return this.get<UserProfile>(STORAGE_KEYS.USER_PROFILE, DEFAULT_USER);
  }

  public updateUserProfile(updates: Partial<UserProfile>): UserProfile {
    const current = this.getUserProfile();
    const updated = { ...current, ...updates };
    this.set(STORAGE_KEYS.USER_PROFILE, updated);
    return updated;
  }

  // --- ENROLLMENTS & LESSON PROGRESS ---
  public getEnrollments(userId?: string): Enrollment[] {
    const enrollments = this.get<Enrollment[]>(STORAGE_KEYS.ENROLLMENTS, INITIAL_ENROLLMENTS);
    if (userId) {
      return enrollments.filter((e) => e.userId === userId);
    }
    return enrollments;
  }

  public getEnrollmentByCourse(courseId: string, userId = 'user-demo-101'): Enrollment | undefined {
    const enrollments = this.getEnrollments(userId);
    return enrollments.find((e) => e.courseId === courseId);
  }

  public enrollInCourse(courseId: string, userId = 'user-demo-101'): Enrollment {
    const enrollments = this.get<Enrollment[]>(STORAGE_KEYS.ENROLLMENTS, INITIAL_ENROLLMENTS);
    const existing = enrollments.find((e) => e.courseId === courseId && e.userId === userId);
    
    if (existing) {
      return existing;
    }

    const newEnrollment: Enrollment = {
      id: `enr-${Date.now()}`,
      userId,
      courseId,
      enrolledAt: new Date().toISOString(),
      lastAccessedAt: new Date().toISOString(),
      completedLessonIds: [],
      progressPercent: 0,
      isCompleted: false,
    };

    enrollments.unshift(newEnrollment);
    this.set(STORAGE_KEYS.ENROLLMENTS, enrollments);

    // Update user profile stats
    const profile = this.getUserProfile();
    this.updateUserProfile({ enrolledCoursesCount: profile.enrolledCoursesCount + 1 });

    return newEnrollment;
  }

  public markLessonComplete(
    courseId: string,
    lessonId: string,
    userId = 'user-demo-101'
  ): { enrollment: Enrollment; isCourseNewlyCompleted: boolean } {
    let enrollments = this.get<Enrollment[]>(STORAGE_KEYS.ENROLLMENTS, INITIAL_ENROLLMENTS);
    let enrollment = enrollments.find((e) => e.courseId === courseId && e.userId === userId);

    if (!enrollment) {
      enrollment = this.enrollInCourse(courseId, userId);
      enrollments = this.get<Enrollment[]>(STORAGE_KEYS.ENROLLMENTS, INITIAL_ENROLLMENTS);
    }

    const course = this.getCourseById(courseId);
    if (!course) {
      return { enrollment, isCourseNewlyCompleted: false };
    }

    // Calculate total lessons in course
    let totalLessonsCount = 0;
    course.modules.forEach((mod) => {
      totalLessonsCount += mod.lessons.length;
    });

    if (!enrollment.completedLessonIds.includes(lessonId)) {
      enrollment.completedLessonIds.push(lessonId);
    }

    enrollment.lastLessonId = lessonId;
    enrollment.lastAccessedAt = new Date().toISOString();

    const progressPercent =
      totalLessonsCount > 0
        ? Math.min(100, Math.round((enrollment.completedLessonIds.length / totalLessonsCount) * 100))
        : 100;

    enrollment.progressPercent = progressPercent;

    let isCourseNewlyCompleted = false;
    if (progressPercent === 100 && !enrollment.isCompleted) {
      enrollment.isCompleted = true;
      enrollment.completedAt = new Date().toISOString();
      isCourseNewlyCompleted = true;

      // Automatically issue certificate
      this.issueCertificate(courseId, userId);

      // Add completion notification
      this.addNotification({
        userId,
        title: `Congratulations! Course Completed 🎉`,
        message: `You earned your certificate for ${course.title}. View it in your Certificates tab!`,
        type: 'certificate',
        link: 'certificates',
      });

      // Update user profile
      const profile = this.getUserProfile();
      this.updateUserProfile({ completedCoursesCount: profile.completedCoursesCount + 1 });
    }

    // Save updated enrollments array
    const idx = enrollments.findIndex((e) => e.id === enrollment.id);
    if (idx >= 0) {
      enrollments[idx] = enrollment;
    }
    this.set(STORAGE_KEYS.ENROLLMENTS, enrollments);

    return { enrollment, isCourseNewlyCompleted };
  }

  public updateLessonPlaybackTime(
    courseId: string,
    lessonId: string,
    playbackSeconds: number,
    userId = 'user-demo-101'
  ): void {
    const enrollments = this.get<Enrollment[]>(STORAGE_KEYS.ENROLLMENTS, INITIAL_ENROLLMENTS);
    const enrollment = enrollments.find((e) => e.courseId === courseId && e.userId === userId);
    if (enrollment) {
      enrollment.lastLessonId = lessonId;
      enrollment.lastPlaybackTime = Math.floor(playbackSeconds);
      enrollment.lastAccessedAt = new Date().toISOString();
      this.set(STORAGE_KEYS.ENROLLMENTS, enrollments);
    }
  }

  // --- BOOKMARKS ---
  public getBookmarks(userId = 'user-demo-101'): Bookmark[] {
    return this.get<Bookmark[]>(STORAGE_KEYS.BOOKMARKS, [
      { userId: 'user-demo-101', courseId: 'course-video-reels', addedAt: '2026-03-01' },
    ]);
  }

  public isBookmarked(courseId: string, userId = 'user-demo-101'): boolean {
    const bookmarks = this.getBookmarks(userId);
    return bookmarks.some((b) => b.courseId === courseId);
  }

  public toggleBookmark(courseId: string, userId = 'user-demo-101'): boolean {
    let bookmarks = this.getBookmarks();
    const exists = bookmarks.some((b) => b.courseId === courseId && b.userId === userId);

    if (exists) {
      bookmarks = bookmarks.filter((b) => !(b.courseId === courseId && b.userId === userId));
      this.set(STORAGE_KEYS.BOOKMARKS, bookmarks);
      return false;
    } else {
      bookmarks.unshift({ userId, courseId, addedAt: new Date().toISOString() });
      this.set(STORAGE_KEYS.BOOKMARKS, bookmarks);
      return true;
    }
  }

  // --- NOTIFICATIONS ---
  public getNotifications(userId = 'user-demo-101'): AppNotification[] {
    return this.get<AppNotification[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
  }

  public addNotification(
    notif: Omit<AppNotification, 'id' | 'read' | 'createdAt'> & { id?: string }
  ): AppNotification {
    const notifications = this.getNotifications(notif.userId);
    const newNotif: AppNotification = {
      id: notif.id || `notif-${Date.now()}`,
      userId: notif.userId,
      title: notif.title,
      message: notif.message,
      type: notif.type,
      link: notif.link,
      read: false,
      createdAt: new Date().toISOString(),
    };
    notifications.unshift(newNotif);
    this.set(STORAGE_KEYS.NOTIFICATIONS, notifications);
    return newNotif;
  }

  public markNotificationRead(id: string): void {
    const notifications = this.getNotifications();
    const target = notifications.find((n) => n.id === id);
    if (target) {
      target.read = true;
      this.set(STORAGE_KEYS.NOTIFICATIONS, notifications);
    }
  }

  public markAllNotificationsRead(userId = 'user-demo-101'): void {
    const notifications = this.getNotifications(userId);
    notifications.forEach((n) => (n.read = true));
    this.set(STORAGE_KEYS.NOTIFICATIONS, notifications);
  }

  // --- QUIZ ATTEMPTS ---
  public getQuizAttempts(courseId?: string, userId = 'user-demo-101'): QuizAttempt[] {
    const attempts = this.get<QuizAttempt[]>(STORAGE_KEYS.QUIZ_ATTEMPTS, []);
    if (courseId) {
      return attempts.filter((a) => a.courseId === courseId && a.userId === userId);
    }
    return attempts.filter((a) => a.userId === userId);
  }

  public submitQuizAttempt(
    courseId: string,
    quizId: string,
    answers: Record<string, number[]>,
    score: number,
    passed: boolean,
    userId = 'user-demo-101'
  ): QuizAttempt {
    const attempts = this.get<QuizAttempt[]>(STORAGE_KEYS.QUIZ_ATTEMPTS, []);
    const newAttempt: QuizAttempt = {
      id: `qa-${Date.now()}`,
      userId,
      courseId,
      quizId,
      answers,
      score,
      passed,
      submittedAt: new Date().toISOString(),
    };
    attempts.unshift(newAttempt);
    this.set(STORAGE_KEYS.QUIZ_ATTEMPTS, attempts);

    // Notify user
    this.addNotification({
      userId,
      title: passed ? `Quiz Passed! Score: ${score}%` : `Quiz Attempt Score: ${score}%`,
      message: passed
        ? `Great job! You passed the quiz for course.`
        : `You scored ${score}%. Review course material and try again.`,
      type: 'quiz',
      link: `course/${courseId}`,
    });

    return newAttempt;
  }

  // --- ASSIGNMENT SUBMISSIONS ---
  public getAssignmentSubmissions(userId = 'user-demo-101'): AssignmentSubmission[] {
    return this.get<AssignmentSubmission[]>(STORAGE_KEYS.ASSIGNMENT_SUBMISSIONS, []);
  }

  public getAssignmentSubmission(
    courseId: string,
    assignmentId: string,
    userId = 'user-demo-101'
  ): AssignmentSubmission | undefined {
    const submissions = this.getAssignmentSubmissions(userId);
    return submissions.find((s) => s.courseId === courseId && s.assignmentId === assignmentId);
  }

  public submitAssignment(
    courseId: string,
    assignmentId: string,
    responseText: string,
    fileUrl?: string,
    userId = 'user-demo-101'
  ): AssignmentSubmission {
    const submissions = this.getAssignmentSubmissions(userId);
    const existingIndex = submissions.findIndex(
      (s) => s.courseId === courseId && s.assignmentId === assignmentId && s.userId === userId
    );

    const submission: AssignmentSubmission = {
      id: existingIndex >= 0 ? submissions[existingIndex].id : `sub-${Date.now()}`,
      userId,
      courseId,
      assignmentId,
      responseText,
      fileUrl,
      submittedAt: new Date().toISOString(),
      status: 'submitted',
    };

    if (existingIndex >= 0) {
      submissions[existingIndex] = submission;
    } else {
      submissions.unshift(submission);
    }

    this.set(STORAGE_KEYS.ASSIGNMENT_SUBMISSIONS, submissions);

    // Notify user
    this.addNotification({
      userId,
      title: 'Assignment Submitted Successfully',
      message: 'Your response has been saved and queued for instructor review.',
      type: 'assignment',
    });

    return submission;
  }

  // --- CERTIFICATES ---
  public getCertificates(userId = 'user-demo-101'): Certificate[] {
    return this.get<Certificate[]>(STORAGE_KEYS.CERTIFICATES, []);
  }

  public getCertificateById(id: string): Certificate | undefined {
    const certs = this.get<Certificate[]>(STORAGE_KEYS.CERTIFICATES, []);
    return certs.find((c) => c.id === id || c.verificationCode === id);
  }

  public issueCertificate(courseId: string, userId = 'user-demo-101'): Certificate {
    const certs = this.get<Certificate[]>(STORAGE_KEYS.CERTIFICATES, []);
    const existing = certs.find((c) => c.courseId === courseId && c.userId === userId);
    if (existing) {
      return existing;
    }

    const course = this.getCourseById(courseId);
    const profile = this.getUserProfile();

    const verificationCode = `ERN-${Math.floor(100000 + Math.random() * 900000)}`;

    const newCert: Certificate = {
      id: `cert-${Date.now()}`,
      userId,
      learnerName: profile.displayName || 'EARNERS Learner',
      courseId,
      courseTitle: course ? course.title : 'Digital Skill Course',
      instructorName: course ? course.instructor.name : 'EARNERS Faculty',
      issuedAt: new Date().toISOString().split('T')[0],
      verificationCode,
    };

    certs.unshift(newCert);
    this.set(STORAGE_KEYS.CERTIFICATES, certs);
    return newCert;
  }

  // --- ANNOUNCEMENTS ---
  public getAnnouncements(courseId?: string) {
    if (courseId) {
      return SEED_ANNOUNCEMENTS.filter((a) => a.courseId === courseId);
    }
    return SEED_ANNOUNCEMENTS;
  }
}

export const storage = new StorageService();
