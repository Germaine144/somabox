import { useState, useEffect } from 'react';
import ProgressTracker from '../../components/student/dashboard/ProgressTracker';
import { studentApi } from '../../services/student.api';
import type { UserCourseProgress } from '../../types/student.types';

const Progress = () => {
  const [allProgress, setAllProgress] = useState<UserCourseProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    setLoading(true);
    try {
      // Load enrolled courses and their progress
      const enrollments = await studentApi.getEnrolledCourses();
      const progressData = await Promise.all(
        enrollments.map(async (e) => {
          const progress = await studentApi.getCourseProgress(e.courseId);
          return progress;
        })
      );
      setAllProgress(progressData.filter((p): p is UserCourseProgress => p !== null));
    } catch (error) {
      console.error('Failed to load progress:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Learning Progress</h1>
        <p className="text-gray-500">Track your learning journey and achievements</p>
      </div>

      {/* Overall Stats */}
      <ProgressTracker />

      {/* Course-wise Progress */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Course Progress</h2>
        
        {allProgress.length > 0 ? (
          <div className="space-y-4">
            {allProgress.map((progress) => (
              <div key={progress.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-medium text-gray-900">
                      Course Progress
                    </h3>
                    <p className="text-sm text-gray-500">
                      Last accessed: {new Date(progress.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">
                      {progress.overallProgress}%
                    </p>
                    <p className="text-sm text-gray-500">
                      {progress.completedLessons.length} lessons completed
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress.overallProgress}%` }}
                  />
                </div>

                {/* Module Progress */}
                <div className="space-y-2">
                  {progress.moduleProgress.map((module) => (
                    <div key={module.moduleId} className="flex items-center gap-3">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-700">{module.moduleTitle}</p>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                          <div
                            className="bg-green-500 h-1.5 rounded-full"
                            style={{ width: `${module.progress}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-sm text-gray-500 whitespace-nowrap">
                        {module.topicsCompleted}/{module.totalTopics}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Quiz Scores */}
                {progress.quizScores.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Quiz Scores</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {progress.quizScores.map((quiz) => (
                        <div key={quiz.quizId} className="bg-gray-50 rounded-lg p-3">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {quiz.quizTitle}
                          </p>
                          <p className={`text-lg font-bold ${
                            quiz.score >= 80 ? 'text-green-600' :
                            quiz.score >= 60 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {Math.round((quiz.score / quiz.maxScore) * 100)}%
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Time Spent */}
                <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {Math.floor(progress.totalTimeSpent / 3600)}h {Math.floor((progress.totalTimeSpent % 3600) / 60)}m
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No enrolled courses yet.</p>
            <a
              href="/student/browse"
              className="text-blue-600 hover:text-blue-700 font-medium mt-2 inline-block"
            >
              Browse courses
            </a>
          </div>
        )}
      </div>

      {/* Achievements Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Achievements</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[
            { icon: '🎯', label: 'First Lesson', unlocked: true },
            { icon: '📚', label: 'Course Complete', unlocked: true },
            { icon: '🔥', label: '7 Day Streak', unlocked: true },
            { icon: '🏆', label: 'Perfect Quiz', unlocked: false },
            { icon: '📖', label: '10 Hours', unlocked: true },
            { icon: '⭐', label: 'Top 10%', unlocked: false },
            { icon: '🚀', label: 'Fast Learner', unlocked: true },
            { icon: '💪', label: 'Consistency', unlocked: false },
          ].map((achievement, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg text-center ${
                achievement.unlocked
                  ? 'bg-yellow-50 border border-yellow-200'
                  : 'bg-gray-50 border border-gray-200 opacity-50'
              }`}
            >
              <div className="text-3xl mb-2">{achievement.icon}</div>
              <p className={`text-sm font-medium ${
                achievement.unlocked ? 'text-gray-900' : 'text-gray-500'
              }`}>
                {achievement.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Progress;
