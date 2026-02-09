import { useState, useEffect } from 'react';
import CourseCard from './CourseCard';
import { SearchIcon, ChevronDownIcon } from '../../shared/Icons';
import { studentApi } from '../../../services/student.api';
import type { Course, CourseEnrollment } from '../../../types/student.types';

interface CourseBrowserProps {
  showEnrolledOnly?: boolean;
}

const CourseBrowser = ({ showEnrolledOnly = false }: CourseBrowserProps) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<CourseEnrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [coursesData, enrollmentsData] = await Promise.all([
        studentApi.getCourses(),
        studentApi.getEnrolledCourses(),
      ]);
      setCourses(coursesData);
      setEnrollments(enrollmentsData);
    } catch (error) {
      console.error('Failed to load courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (courseId: string) => {
    try {
      await studentApi.enrollInCourse(courseId);
      await loadData();
    } catch (error) {
      console.error('Failed to enroll:', error);
    }
  };

  const handleContinue = (courseId: string) => {
    // Navigate to course detail page
    window.location.href = `/student/courses/${courseId}`;
  };

  const handleDownload = (courseId: string) => {
    console.log('Download course:', courseId);
    // Implement offline download logic
  };

  // Get unique categories
  const categories = ['all', ...new Set(courses.map(c => c.category))];

  // Filter courses
  const filteredCourses = courses.filter(course => {
    // Check if enrolled
    const enrollment = enrollments.find(e => e.courseId === course.id);
    const isEnrolled = !!enrollment;

    if (showEnrolledOnly && !isEnrolled) return false;
    if (!showEnrolledOnly && isEnrolled) return false;

    // Search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      const matchesSearch =
        course.title.toLowerCase().includes(search) ||
        course.description.toLowerCase().includes(search) ||
        course.tags.some(tag => tag.toLowerCase().includes(search));
      if (!matchesSearch) return false;
    }

    // Category filter
    if (selectedCategory !== 'all' && course.category !== selectedCategory) return false;

    // Difficulty filter
    if (selectedDifficulty !== 'all' && course.difficulty !== selectedDifficulty) return false;

    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        {/* Search */}
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          {/* Category dropdown */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2.5 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>

          {/* Difficulty dropdown */}
          <div className="relative">
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2.5 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
            <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-gray-500 mb-4">
        {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''} found
      </p>

      {/* Course grid */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCourses.map(course => {
            const enrollment = enrollments.find(e => e.courseId === course.id);
            return (
              <CourseCard
                key={course.id}
                course={course}
                progress={enrollment?.progress}
                status={enrollment ? (enrollment.progress === 100 ? 'completed' : 'enrolled') : 'available'}
                onEnroll={handleEnroll}
                onContinue={handleContinue}
                onDownload={handleDownload}
              />
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <SearchIcon className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
          <p className="text-gray-500">
            {showEnrolledOnly
              ? "You haven't enrolled in any courses yet."
              : "Try adjusting your search or filters."}
          </p>
        </div>
      )}
    </div>
  );
};

export default CourseBrowser;
