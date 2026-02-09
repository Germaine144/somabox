import { useState, useEffect } from 'react';
import CourseCard from '../../components/student/dashboard/CourseCard';
import { FolderIcon, SyncIcon, WifiOffIcon } from '../../components/shared/Icons';
import { studentApi } from '../../services/student.api';
import type { Course, CourseEnrollment } from '../../types/student.types';

const Library = () => {
  const [enrollments, setEnrollments] = useState<(CourseEnrollment & { course: Course })[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    loadLibrary();

    window.addEventListener('online', () => setIsOnline(true));
    window.addEventListener('offline', () => setIsOnline(false));

    return () => {
      window.removeEventListener('online', () => setIsOnline(true));
      window.removeEventListener('offline', () => setIsOnline(false));
    };
  }, []);

  const loadLibrary = async () => {
    setLoading(true);
    try {
      const data = await studentApi.getEnrolledCourses();
      setEnrollments(data);
    } catch (error) {
      console.error('Failed to load library:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    if (!isOnline) return;
    setSyncing(true);
    // Simulate sync
    await new Promise(resolve => setTimeout(resolve, 2000));
    setSyncing(false);
  };

  const handleContinue = (courseId: string) => {
    window.location.href = `/student/courses/${courseId}`;
  };

  const handleDownload = (courseId: string) => {
    console.log('Download for offline:', courseId);
    // Implement offline download
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Library</h1>
          <p className="text-gray-500">Your downloaded courses for offline access</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Online/Offline Status */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${
            isOnline ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
          }`}>
            {isOnline ? (
              <>
                <WifiOffIcon className="w-4 h-4" />
                <span>Online</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                <span>Offline Mode</span>
              </>
            )}
          </div>
          {isOnline && (
            <button
              onClick={handleSync}
              disabled={syncing}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <SyncIcon className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
              {syncing ? 'Syncing...' : 'Sync All'}
            </button>
          )}
        </div>
      </div>

      {/* Offline Info Banner */}
      {!isOnline && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5">
              <WifiOffIcon className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <h3 className="font-medium text-orange-800">You're offline</h3>
              <p className="text-sm text-orange-700 mt-1">
                You can still access your downloaded courses. Any progress made offline will be synced when you reconnect.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Library Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FolderIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{enrollments.length}</p>
              <p className="text-sm text-gray-500">Downloaded Courses</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {enrollments.filter(e => e.progress === 100).length}
              </p>
              <p className="text-sm text-gray-500">Completed</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {enrollments.filter(e => e.progress > 0 && e.progress < 100).length}
              </p>
              <p className="text-sm text-gray-500">In Progress</p>
            </div>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      {enrollments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrollments.map(enrollment => (
            <CourseCard
              key={enrollment.id}
              course={enrollment.course}
              progress={enrollment.progress}
              status={enrollment.progress === 100 ? 'completed' : 'enrolled'}
              onContinue={handleContinue}
              onDownload={handleDownload}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FolderIcon className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Your library is empty</h3>
          <p className="text-gray-500 mb-4">
            Browse courses and download them for offline access.
          </p>
          <button
            onClick={() => window.location.href = '/student/browse'}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Browse Courses →
          </button>
        </div>
      )}
    </div>
  );
};

export default Library;
