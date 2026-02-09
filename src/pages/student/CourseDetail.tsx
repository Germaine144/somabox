import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { studentApi } from '../../services/student.api';
import { PlayIcon, DownloadIcon, CheckIcon, ChevronDownIcon, ChevronRightIcon } from '../../components/shared/Icons';
import type { Course, CourseModule, UserCourseProgress } from '../../types/student.types';

const CourseDetail = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<CourseModule[]>([]);
  const [progress, setProgress] = useState<UserCourseProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (courseId) {
      loadCourseData();
    }
  }, [courseId]);

  const loadCourseData = async () => {
    if (!courseId) return;
    setLoading(true);
    try {
      const [courseData, modulesData, progressData] = await Promise.all([
        studentApi.getCourseById(courseId),
        studentApi.getCourseModules(courseId),
        studentApi.getCourseProgress(courseId),
      ]);
      setCourse(courseData);
      setModules(modulesData);
      setProgress(progressData);
      // Expand first module by default
      if (modulesData.length > 0) {
        setExpandedModules(new Set([modulesData[0].id]));
      }
    } catch (error) {
      console.error('Failed to load course:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleModule = (moduleId: string) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpandedModules(newExpanded);
  };

  const handleStartLearning = () => {
    // Navigate to first incomplete lesson
    navigate(`/student/courses/${courseId}/learn`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Course not found</h2>
        <button
          onClick={() => navigate('/student/browse')}
          className="text-blue-600 hover:text-blue-700"
        >
          Browse courses
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Course Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-6 text-white">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Course Info */}
          <div className="flex-1">
            <p className="text-blue-300 text-sm font-medium mb-2">{course.category}</p>
            <h1 className="text-2xl lg:text-3xl font-bold mb-3">{course.title}</h1>
            <p className="text-gray-300 mb-4">{course.description}</p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300 mb-6">
              <span>By {course.facilitatorName}</span>
              <span>•</span>
              <span>{course.duration}</span>
              <span>•</span>
              <span className="capitalize">{course.difficulty}</span>
              <span>•</span>
              <span>{course.modulesCount} modules</span>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleStartLearning}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors"
              >
                <PlayIcon className="w-5 h-5" />
                {progress ? 'Continue Learning' : 'Start Learning'}
              </button>
              <button className="bg-white/10 hover:bg-white/20 text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors">
                <DownloadIcon className="w-5 h-5" />
                Download for Offline
              </button>
            </div>
          </div>

          {/* Progress Card */}
          {progress && (
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 w-full lg:w-72">
              <h3 className="font-medium mb-4">Your Progress</h3>
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Overall Progress</span>
                  <span className="font-medium">{progress.overallProgress}%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${progress.overallProgress}%` }}
                  />
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">Lessons Completed</span>
                  <span>{progress.completedLessons.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Quiz Score</span>
                  <span>
                    {progress.quizScores.length > 0
                      ? Math.round(progress.quizScores.reduce((a, b) => a + b.score, 0) / progress.quizScores.length)
                      : '-'}%
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Course Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Course Content</h2>
          <p className="text-sm text-gray-500">
            {modules.length} modules • {modules.reduce((a, b) => a + b.topicsCount, 0)} lessons
          </p>
        </div>

        <div className="divide-y divide-gray-100">
          {modules.map((module, index) => {
            const moduleProgress = progress?.moduleProgress.find(m => m.moduleId === module.id);
            const isExpanded = expandedModules.has(module.id);
            const completedTopics = moduleProgress?.topicsCompleted || 0;

            return (
              <div key={module.id}>
                {/* Module Header */}
                <button
                  onClick={() => toggleModule(module.id)}
                  className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      completedTopics === module.topicsCount
                        ? 'bg-green-100 text-green-600'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {completedTopics === module.topicsCount ? (
                        <CheckIcon className="w-4 h-4" />
                      ) : (
                        index + 1
                      )}
                    </div>
                    <div className="text-left">
                      <h3 className="font-medium text-gray-900">{module.title}</h3>
                      <p className="text-sm text-gray-500">
                        {module.topicsCount} lessons • {module.duration}
                      </p>
                    </div>
                  </div>
                  <ChevronDownIcon
                    className={`w-5 h-5 text-gray-400 transition-transform ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Module Content */}
                {isExpanded && (
                  <div className="bg-gray-50 px-4 py-2">
                    <div className="space-y-1">
                      {Array.from({ length: module.topicsCount }).map((_, topicIndex) => {
                        const topicId = `${module.id}-topic-${topicIndex + 1}`;
                        const isCompleted = progress?.completedLessons.includes(topicId);
                        const isCurrent = progress?.lastLessonId === topicId;

                        return (
                          <button
                            key={topicId}
                            className={`w-full p-3 flex items-center gap-3 rounded-lg transition-colors ${
                              isCurrent
                                ? 'bg-blue-50 border border-blue-200'
                                : 'hover:bg-gray-100'
                            }`}
                          >
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                              isCompleted
                                ? 'bg-green-100 text-green-600'
                                : 'bg-gray-200 text-gray-500'
                            }`}>
                              {isCompleted ? (
                                <CheckIcon className="w-3.5 h-3.5" />
                              ) : (
                                <PlayIcon className="w-3.5 h-3.5" />
                              )}
                            </div>
                            <div className="flex-1 text-left">
                              <p className={`text-sm ${isCurrent ? 'font-medium text-blue-600' : 'text-gray-700'}`}>
                                Lesson {topicIndex + 1}
                              </p>
                              {isCurrent && (
                                <p className="text-xs text-blue-500">Continue from here</p>
                              )}
                            </div>
                            <ChevronRightIcon className="w-4 h-4 text-gray-400" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
