import { useState, useEffect } from 'react';
import { studentApi } from '../../../services/student.api';
import { ChartIcon, TrophyIcon, FireIcon, ClockIcon, CheckIcon } from '../../shared/Icons';
import type { DashboardStats } from '../../../types/student.types';

const ProgressTracker = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      const data = await studentApi.getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const d = new Date(date);
    const diff = now.getTime() - d.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'lesson_completed':
        return <CheckIcon className="w-4 h-4 text-blue-500" />;
      case 'quiz_completed':
        return <TrophyIcon className="w-4 h-4 text-blue-500" />;
      case 'course_enrolled':
        return <ChartIcon className="w-4 h-4 text-blue-500" />;
      case 'course_completed':
        return <TrophyIcon className="w-4 h-4 text-blue-500" />;
      default:
        return <CheckIcon className="w-4 h-4 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-32 bg-gray-200 rounded-xl"></div>
        <div className="h-64 bg-gray-200 rounded-xl"></div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Progress */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <ChartIcon className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{stats.totalProgress}%</span>
          </div>
          <p className="text-sm text-gray-500">Overall Progress</p>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
            <div
              className="bg-blue-600 h-1.5 rounded-full"
              style={{ width: `${stats.totalProgress}%` }}
            />
          </div>
        </div>

        {/* Courses Completed */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrophyIcon className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              {stats.totalCoursesCompleted}/{stats.totalCoursesEnrolled}
            </span>
          </div>
          <p className="text-sm text-gray-500">Courses Completed</p>
        </div>

        {/* Learning Streak */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <FireIcon className="w-5 h-5 text-orange-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{stats.streakDays}</span>
          </div>
          <p className="text-sm text-gray-500">Day Streak</p>
        </div>

        {/* Time Spent */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <ClockIcon className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{stats.totalTimeSpent}</span>
          </div>
          <p className="text-sm text-gray-500">Time Learning</p>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Average Quiz Score */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-medium text-gray-900 mb-3">Average Quiz Score</h3>
          <div className="flex items-center gap-4">
            <div className="relative w-24 h-24">
              <svg className="w-24 h-24 transform -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="#1e81b2"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${(stats.averageQuizScore / 100) * 251.2} 251.2`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold text-gray-900">{stats.averageQuizScore}%</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">Keep up the great work!</p>
              <p className="text-xs text-gray-400 mt-1">
                Based on {stats.recentActivity.filter(a => a.type === 'quiz_completed').length} quizzes
              </p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-medium text-gray-900 mb-3">Recent Activity</h3>
          <div className="space-y-3 max-h-48 overflow-y-auto">
            {stats.recentActivity.slice(0, 5).map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <div className="mt-0.5">{getActivityIcon(activity.type)}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {activity.title}
                  </p>
                  <p className="text-xs text-gray-500">{activity.description}</p>
                </div>
                <span className="text-xs text-gray-400 whitespace-nowrap">
                  {formatTimeAgo(activity.timestamp)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Learning Goals */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <h3 className="font-medium text-gray-900 mb-4">Weekly Goals</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Complete 5 lessons</span>
              <span className="font-medium text-gray-900">3/5</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: '60%' }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Take 2 quizzes</span>
              <span className="font-medium text-gray-900">2/2</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: '100%' }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Study for 3 hours</span>
              <span className="font-medium text-gray-900">2.5/3</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: '83%' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;
