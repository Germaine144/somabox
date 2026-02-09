// Student Types
export interface Student {
  id: string;
  userId: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  enrolledCourses: string[];
  completedCourses: string[];
  totalProgress: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  facilitatorId: string;
  facilitatorName: string;
  category: string;
  tags: string[];
  modulesCount: number;
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  rating: number;
  enrolledCount: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CourseEnrollment {
  id: string;
  studentId: string;
  courseId: string;
  enrolledAt: Date;
  lastAccessedAt: Date;
  progress: number;
  status: 'active' | 'completed' | 'paused';
}

export interface UserCourseProgress {
  id: string;
  studentId: string;
  courseId: string;
  moduleProgress: ModuleProgress[];
  overallProgress: number;
  lastLessonId: string;
  completedLessons: string[];
  quizScores: QuizScore[];
  totalTimeSpent: number;
  updatedAt: Date;
}

export interface ModuleProgress {
  moduleId: string;
  moduleTitle: string;
  progress: number;
  topicsCompleted: number;
  totalTopics: number;
}

export interface QuizScore {
  quizId: string;
  quizTitle: string;
  score: number;
  maxScore: number;
  attemptedAt: Date;
}

export interface CourseModule {
  id: string;
  courseId: string;
  title: string;
  description: string;
  order: number;
  topicsCount: number;
  duration: string;
}

export interface Topic {
  id: string;
  moduleId: string;
  title: string;
  type: 'video' | 'document' | 'quiz' | 'assignment';
  contentUrl: string;
  duration: string;
  order: number;
}

export interface DashboardStats {
  totalCoursesEnrolled: number;
  totalCoursesCompleted: number;
  totalProgress: number;
  totalTimeSpent: string;
  averageQuizScore: number;
  streakDays: number;
  recentActivity: RecentActivity[];
}

export interface RecentActivity {
  id: string;
  type: 'lesson_completed' | 'quiz_completed' | 'course_enrolled' | 'course_completed';
  title: string;
  description: string;
  timestamp: Date;
}
