import type { 
  Course, 
  CourseEnrollment, 
  UserCourseProgress, 
  DashboardStats,
  CourseModule,
  Topic
} from '../types/student.types';

const API_BASE = '/api/student';

// Mock data for development (before backend is ready)
const mockCourses: Course[] = [
  {
    id: 'course-1',
    title: 'Introduction to Web Development',
    description: 'Learn the fundamentals of HTML, CSS, and JavaScript to build modern websites.',
    thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400',
    facilitatorId: 'fac-1',
    facilitatorName: 'Dr. Sarah Johnson',
    category: 'Technology',
    tags: ['HTML', 'CSS', 'JavaScript', 'Web'],
    modulesCount: 8,
    duration: '20 hours',
    difficulty: 'beginner',
    rating: 4.8,
    enrolledCount: 1250,
    isPublished: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-06-20'),
  },
  {
    id: 'course-2',
    title: 'Data Science with Python',
    description: 'Master data analysis, visualization, and machine learning with Python.',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400',
    facilitatorId: 'fac-2',
    facilitatorName: 'Prof. Michael Chen',
    category: 'Data Science',
    tags: ['Python', 'Data Science', 'ML', 'Analytics'],
    modulesCount: 12,
    duration: '35 hours',
    difficulty: 'intermediate',
    rating: 4.9,
    enrolledCount: 890,
    isPublished: true,
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-07-15'),
  },
  {
    id: 'course-3',
    title: 'UI/UX Design Fundamentals',
    description: 'Create beautiful and user-friendly interfaces using modern design principles.',
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400',
    facilitatorId: 'fac-3',
    facilitatorName: 'Emma Williams',
    category: 'Design',
    tags: ['UI', 'UX', 'Design', 'Figma'],
    modulesCount: 6,
    duration: '15 hours',
    difficulty: 'beginner',
    rating: 4.7,
    enrolledCount: 650,
    isPublished: true,
    createdAt: new Date('2024-03-05'),
    updatedAt: new Date('2024-08-01'),
  },
  {
    id: 'course-4',
    title: 'Advanced React Development',
    description: 'Take your React skills to the next level with hooks, context, and advanced patterns.',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400',
    facilitatorId: 'fac-1',
    facilitatorName: 'Dr. Sarah Johnson',
    category: 'Technology',
    tags: ['React', 'JavaScript', 'Frontend', 'Web'],
    modulesCount: 10,
    duration: '25 hours',
    difficulty: 'advanced',
    rating: 4.9,
    enrolledCount: 420,
    isPublished: true,
    createdAt: new Date('2024-04-20'),
    updatedAt: new Date('2024-09-10'),
  },
  {
    id: 'course-5',
    title: 'Digital Marketing Essentials',
    description: 'Learn to create effective digital marketing campaigns across multiple platforms.',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400',
    facilitatorId: 'fac-4',
    facilitatorName: 'James Miller',
    category: 'Marketing',
    tags: ['Marketing', 'SEO', 'Social Media', 'Analytics'],
    modulesCount: 8,
    duration: '18 hours',
    difficulty: 'beginner',
    rating: 4.6,
    enrolledCount: 780,
    isPublished: true,
    createdAt: new Date('2024-05-12'),
    updatedAt: new Date('2024-10-05'),
  },
];

const mockEnrollments: CourseEnrollment[] = [
  {
    id: 'enroll-1',
    studentId: 'student-1',
    courseId: 'course-1',
    enrolledAt: new Date('2024-06-01'),
    lastAccessedAt: new Date('2024-11-28'),
    progress: 65,
    status: 'active',
  },
  {
    id: 'enroll-2',
    studentId: 'student-1',
    courseId: 'course-2',
    enrolledAt: new Date('2024-07-15'),
    lastAccessedAt: new Date('2024-11-25'),
    progress: 30,
    status: 'active',
  },
  {
    id: 'enroll-3',
    studentId: 'student-1',
    courseId: 'course-3',
    enrolledAt: new Date('2024-05-10'),
    lastAccessedAt: new Date('2024-08-20'),
    progress: 100,
    status: 'completed',
  },
];

const mockProgress: UserCourseProgress[] = [
  {
    id: 'progress-1',
    studentId: 'student-1',
    courseId: 'course-1',
    moduleProgress: [
      { moduleId: 'mod-1', moduleTitle: 'HTML Basics', progress: 100, topicsCompleted: 5, totalTopics: 5 },
      { moduleId: 'mod-2', moduleTitle: 'CSS Fundamentals', progress: 100, topicsCompleted: 6, totalTopics: 6 },
      { moduleId: 'mod-3', moduleTitle: 'JavaScript Intro', progress: 40, topicsCompleted: 2, totalTopics: 5 },
    ],
    overallProgress: 65,
    lastLessonId: 'topic-3-3',
    completedLessons: ['topic-1-1', 'topic-1-2', 'topic-1-3', 'topic-1-4', 'topic-1-5', 'topic-2-1', 'topic-2-2', 'topic-2-3', 'topic-2-4', 'topic-2-5', 'topic-2-6', 'topic-3-1', 'topic-3-2'],
    quizScores: [
      { quizId: 'quiz-1', quizTitle: 'HTML Basics Quiz', score: 90, maxScore: 100, attemptedAt: new Date('2024-06-15') },
      { quizId: 'quiz-2', quizTitle: 'CSS Fundamentals Quiz', score: 85, maxScore: 100, attemptedAt: new Date('2024-06-25') },
    ],
    totalTimeSpent: 7200,
    updatedAt: new Date('2024-11-28'),
  },
];

const mockDashboardStats: DashboardStats = {
  totalCoursesEnrolled: 3,
  totalCoursesCompleted: 1,
  totalProgress: 52,
  totalTimeSpent: '48h 30m',
  averageQuizScore: 88,
  streakDays: 7,
  recentActivity: [
    { id: 'act-1', type: 'lesson_completed', title: 'Completed JavaScript Variables', description: 'Introduction to JavaScript', timestamp: new Date('2024-11-28T10:30:00') },
    { id: 'act-2', type: 'quiz_completed', title: 'CSS Fundamentals Quiz', description: 'Score: 85%', timestamp: new Date('2024-11-27T15:45:00') },
    { id: 'act-3', type: 'course_enrolled', title: 'Enrolled in Data Science', description: 'Python for Data Analysis', timestamp: new Date('2024-11-25T09:00:00') },
    { id: 'act-4', type: 'lesson_completed', title: 'Completed CSS Grid', description: 'Layout with CSS Grid', timestamp: new Date('2024-11-26T14:20:00') },
  ],
};

// API Functions (using mock data for now)
export const studentApi = {
  // Get all available courses
  async getCourses(): Promise<Course[]> {
    try {
      const response = await fetch(`${API_BASE}/courses`);
      if (!response.ok) throw new Error('Failed to fetch courses');
      return response.json();
    } catch (error) {
      console.log('Using mock course data');
      return mockCourses;
    }
  },

  // Get course by ID
  async getCourseById(courseId: string): Promise<Course | null> {
    try {
      const response = await fetch(`${API_BASE}/courses/${courseId}`);
      if (!response.ok) throw new Error('Course not found');
      return response.json();
    } catch (error) {
      return mockCourses.find(c => c.id === courseId) || null;
    }
  },

  // Get enrolled courses
  async getEnrolledCourses(): Promise<(CourseEnrollment & { course: Course })[]> {
    try {
      const response = await fetch(`${API_BASE}/my-courses`);
      if (!response.ok) throw new Error('Failed to fetch enrolled courses');
      return response.json();
    } catch (error) {
      return mockEnrollments.map(enrollment => ({
        ...enrollment,
        course: mockCourses.find(c => c.id === enrollment.courseId)!,
      }));
    }
  },

  // Enroll in a course
  async enrollInCourse(courseId: string): Promise<CourseEnrollment> {
    try {
      const response = await fetch(`${API_BASE}/courses/${courseId}/enroll`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to enroll');
      return response.json();
    } catch (error) {
      const newEnrollment: CourseEnrollment = {
        id: `enroll-${Date.now()}`,
        studentId: 'student-1',
        courseId,
        enrolledAt: new Date(),
        lastAccessedAt: new Date(),
        progress: 0,
        status: 'active',
      };
      mockEnrollments.push(newEnrollment);
      return newEnrollment;
    }
  },

  // Get course progress
  async getCourseProgress(courseId: string): Promise<UserCourseProgress | null> {
    try {
      const response = await fetch(`${API_BASE}/progress/${courseId}`);
      if (!response.ok) throw new Error('Progress not found');
      return response.json();
    } catch (error) {
      return mockProgress.find(p => p.courseId === courseId) || null;
    }
  },

  // Get dashboard stats
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const response = await fetch(`${API_BASE}/dashboard/stats`);
      if (!response.ok) throw new Error('Failed to fetch stats');
      return response.json();
    } catch (error) {
      return mockDashboardStats;
    }
  },

  // Get course modules
  async getCourseModules(courseId: string): Promise<CourseModule[]> {
    try {
      const response = await fetch(`${API_BASE}/courses/${courseId}/modules`);
      if (!response.ok) throw new Error('Failed to fetch modules');
      return response.json();
    } catch (error) {
      // Return mock modules
      return [
        { id: 'mod-1', courseId, title: 'HTML Basics', description: 'Learn HTML fundamentals', order: 1, topicsCount: 5, duration: '2h' },
        { id: 'mod-2', courseId, title: 'CSS Fundamentals', description: 'Style your web pages', order: 2, topicsCount: 6, duration: '3h' },
        { id: 'mod-3', courseId, title: 'JavaScript Intro', description: 'Add interactivity', order: 3, topicsCount: 5, duration: '4h' },
      ];
    }
  },

  // Get module topics
  async getModuleTopics(moduleId: string): Promise<Topic[]> {
    try {
      const response = await fetch(`${API_BASE}/modules/${moduleId}/topics`);
      if (!response.ok) throw new Error('Failed to fetch topics');
      return response.json();
    } catch (error) {
      return [];
    }
  },
};

export default studentApi;
