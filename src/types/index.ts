export type UserRole = 'learner' | 'instructor' | 'admin';

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  role: UserRole;
  bio?: string;
  joinedAt: string;
  completedCoursesCount: number;
  enrolledCoursesCount: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  description: string;
  courseCount: number;
}

export interface Instructor {
  id: string;
  name: string;
  title: string;
  avatar: string;
  bio: string;
  rating: number;
  studentsCount: number;
}

export type LessonType = 'video' | 'text' | 'resource';

export interface ResourceItem {
  title: string;
  url: string;
  type: string;
  size?: string;
}

export interface Lesson {
  id: string;
  title: string;
  durationMinutes: number;
  type: LessonType;
  videoUrl?: string; // HTML5 direct mp4 / embed link
  content?: string; // Rich article or text lesson
  resources?: ResourceItem[];
  isFreePreview?: boolean;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswers: number[]; // indices
  isMultiSelect: boolean;
  explanation: string;
}

export interface Quiz {
  id: string;
  courseId: string;
  title: string;
  description: string;
  passingScore: number; // percentage, e.g. 70
  questions: QuizQuestion[];
}

export interface Assignment {
  id: string;
  courseId: string;
  title: string;
  instructions: string;
  dueDate?: string;
  submissionRequirements?: string[];
}

export interface Course {
  id: string;
  title: string;
  subtitle: string;
  slug: string;
  categoryId: string;
  categoryName: string;
  instructor: Instructor;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  language: string;
  totalDuration: string;
  badgeTag?: string; // e.g. 'Popular', 'Trending', 'New'
  gradientTheme: string; // Tailwind background gradient for visual theme
  iconName: string;
  modules: Module[];
  learningOutcomes: string[];
  prerequisites: string[];
  isPublished: boolean;
  isFeatured?: boolean;
  popularPath?: string;
  createdAt: string;
  updatedAt: string;
  quiz?: Quiz;
  assignment?: Assignment;
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  enrolledAt: string;
  lastAccessedAt: string;
  completedLessonIds: string[];
  lastLessonId?: string;
  lastPlaybackTime?: number; // saved position in seconds
  progressPercent: number;
  isCompleted: boolean;
  completedAt?: string;
}

export interface QuizAttempt {
  id: string;
  userId: string;
  courseId: string;
  quizId: string;
  score: number; // calculated percentage
  passed: boolean;
  submittedAt: string;
  answers: Record<string, number[]>; // questionId -> selected indices
}

export interface AssignmentSubmission {
  id: string;
  userId: string;
  courseId: string;
  assignmentId: string;
  responseText: string;
  fileUrl?: string;
  submittedAt: string;
  status: 'submitted' | 'reviewed' | 'graded';
  grade?: string;
  feedback?: string;
}

export interface Certificate {
  id: string;
  userId: string;
  learnerName: string;
  courseId: string;
  courseTitle: string;
  instructorName: string;
  issuedAt: string;
  verificationCode: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'announcement' | 'assignment' | 'quiz' | 'course_update' | 'certificate';
  link?: string;
  read: boolean;
  createdAt: string;
}

export interface Bookmark {
  userId: string;
  courseId: string;
  addedAt: string;
}

export interface Announcement {
  id: string;
  courseId: string;
  title: string;
  content: string;
  date: string;
}
