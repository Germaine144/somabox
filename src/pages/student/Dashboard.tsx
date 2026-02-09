import { useState } from 'react';
import CourseBrowser from '../../components/student/dashboard/CourseBrowser';
import ProgressTracker from '../../components/student/dashboard/ProgressTracker';
import { ChevronRightIcon } from '../../components/shared/Icons';

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'my-courses' | 'browse'>('overview');

  // For now, we'll use a simple approach - the components handle their own data loading

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back, Student!</h1>
        <p className="text-blue-100">
          Continue your learning journey. You're making great progress!
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-6">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'my-courses', label: 'My Courses' },
            { id: 'browse', label: 'Browse Courses' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-[500px]">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Continue Learning Section */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Continue Learning</h2>
                <button
                  onClick={() => setActiveTab('my-courses')}
                  className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  View all <ChevronRightIcon className="w-4 h-4" />
                </button>
              </div>
              <CourseBrowser showEnrolledOnly={true} />
            </section>

            {/* Progress Tracker */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Progress</h2>
              <ProgressTracker />
            </section>
          </div>
        )}

        {activeTab === 'my-courses' && (
          <section>
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">My Enrolled Courses</h2>
              <p className="text-gray-500 text-sm">
                Track your progress and continue learning where you left off.
              </p>
            </div>
            <CourseBrowser showEnrolledOnly={true} />
          </section>
        )}

        {activeTab === 'browse' && (
          <section>
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Browse All Courses</h2>
              <p className="text-gray-500 text-sm">
                Discover new courses and expand your knowledge.
              </p>
            </div>
            <CourseBrowser showEnrolledOnly={false} />
          </section>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
