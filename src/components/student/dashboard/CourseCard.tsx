import { useState } from 'react';
import type { Course } from '../../../types/student.types';
import { Button } from '../../ui/Button';
import { PlayIcon, DownloadIcon, ClockIcon, UsersIcon, StarIcon } from '../../shared/Icons';

interface CourseCardProps {
  course: Course;
  progress?: number;
  status?: 'enrolled' | 'available' | 'completed';
  onEnroll?: (courseId: string) => void;
  onContinue?: (courseId: string) => void;
  onDownload?: (courseId: string) => void;
}

const CourseCard = ({
  course,
  progress,
  status = 'available',
  onEnroll,
  onContinue,
  onDownload,
}: CourseCardProps) => {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleEnroll = () => {
    onEnroll?.(course.id);
  };

  const handleContinue = () => {
    onContinue?.(course.id);
  };

  return (
    <div
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Thumbnail */}
      <div className="relative h-48 bg-gray-200">
        {!imageError ? (
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
            <span className="text-white text-4xl font-bold">
              {course.title.charAt(0)}
            </span>
          </div>
        )}
        
        {/* Overlay on hover */}
        {isHovered && status === 'enrolled' && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <button
              onClick={handleContinue}
              className="bg-white text-gray-900 px-6 py-2 rounded-full font-medium flex items-center gap-2 hover:bg-gray-100 transition-colors"
            >
              <PlayIcon className="w-5 h-5" />
              Continue Learning
            </button>
          </div>
        )}

        {/* Status badge */}
        {status === 'completed' && (
          <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
            <span>✓</span> Completed
          </div>
        )}

        {/* Difficulty badge */}
        <div className={`absolute top-3 left-3 px-2 py-1 rounded-md text-xs font-medium capitalize ${getDifficultyColor(course.difficulty)}`}>
          {course.difficulty}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        <p className="text-xs text-blue-600 font-medium uppercase tracking-wide mb-1">
          {course.category}
        </p>

        {/* Title */}
        <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2">
          {course.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {course.description}
        </p>

        {/* Facilitator */}
        <p className="text-sm text-gray-500 mb-3">
          By {course.facilitatorName}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <span className="flex items-center gap-1">
            <ClockIcon className="w-4 h-4" />
            {course.duration}
          </span>
          <span className="flex items-center gap-1">
            <UsersIcon className="w-4 h-4" />
            {course.enrolledCount}
          </span>
          <span className="flex items-center gap-1 text-yellow-500">
            <StarIcon className="w-4 h-4 fill-current" />
            {course.rating}
          </span>
        </div>

        {/* Progress bar (if enrolled) */}
        {status === 'enrolled' && progress !== undefined && (
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Progress</span>
              <span className="font-medium text-gray-900">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {course.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
          {course.tags.length > 3 && (
            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
              +{course.tags.length - 3}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {status === 'available' && (
            <Button
              variant="default"
              className="flex-1"
              onClick={handleEnroll}
            >
              Enroll Now
            </Button>
          )}
          {status === 'enrolled' && (
            <Button
              variant="default"
              className="flex-1"
              onClick={handleContinue}
            >
              Continue
            </Button>
          )}
          {status === 'completed' && (
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onContinue?.(course.id)}
            >
              Review
            </Button>
          )}
          {status === 'enrolled' && (
            <Button
              variant="ghost"
              onClick={() => onDownload?.(course.id)}
              className="px-3"
            >
              <DownloadIcon className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
