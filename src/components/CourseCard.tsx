import React, { useState } from 'react';
import { Bookmark, Clock, PlayCircle, Star, User } from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';
import { storage } from '../services/storage';
import { Course } from '../types';

interface CourseCardProps {
  course: Course;
  isEnrolled?: boolean;
  progressPercent?: number;
  onBookmarkChange?: () => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  isEnrolled,
  progressPercent,
  onBookmarkChange,
}) => {
  const { navigate } = useNavigation();
  const [bookmarked, setBookmarked] = useState(storage.isBookmarked(course.id));

  const handleBookmarkToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newState = storage.toggleBookmark(course.id);
    setBookmarked(newState);
    if (onBookmarkChange) onBookmarkChange();
  };

  return (
    <div
      onClick={() => navigate({ page: 'course-details', courseId: course.id })}
      className="group bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col overflow-hidden cursor-pointer h-full"
    >
      {/* Editorial Header Banner with Clean Gradient Theme & Icon */}
      <div className={`relative h-40 bg-gradient-to-br ${course.gradientTheme} p-5 flex flex-col justify-between overflow-hidden shrink-0`}>
        {/* Subtle geometric grid backdrop */}
        <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />

        <div className="relative z-10 flex items-center justify-between">
          <span className="text-xs font-semibold text-amber-300/90 tracking-wide">
            {course.categoryName}
          </span>
          <button
            onClick={handleBookmarkToggle}
            className={`p-2 rounded-xl backdrop-blur-md transition-transform active:scale-90 ${
              bookmarked
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'bg-slate-950/40 text-slate-200 hover:bg-slate-950/60'
            }`}
            aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark course'}
          >
            <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-slate-950' : ''}`} />
          </button>
        </div>

        <div className="relative z-10 flex items-end justify-between gap-3">
          <div className="flex items-center gap-2">
            {course.badgeTag && (
              <span className="text-[11px] font-bold text-slate-900 bg-amber-400 px-2.5 py-0.5 rounded-md shadow-xs">
                {course.badgeTag}
              </span>
            )}
            {isEnrolled && (
              <span className="text-[11px] font-semibold text-emerald-300 bg-emerald-950/80 border border-emerald-800/80 px-2 py-0.5 rounded-md">
                Enrolled
              </span>
            )}
          </div>
          <PlayCircle className="w-8 h-8 text-white/80 group-hover:text-amber-400 group-hover:scale-110 transition-all shrink-0" />
        </div>
      </div>

      {/* Card Content Details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Zero-Pill Unboxed Text Metadata with Typographic Separator */}
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-2">
            <span>{course.level}</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {course.totalDuration}
            </span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>{course.language}</span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-base text-slate-900 group-hover:text-amber-600 transition-colors line-clamp-2 leading-snug mb-2">
            {course.title}
          </h3>

          {/* Subtitle */}
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
            {course.subtitle}
          </p>
        </div>

        {/* Footer: Instructor & Progress or Rating */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-auto">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-6 h-6 rounded-full bg-slate-200 overflow-hidden shrink-0 flex items-center justify-center text-slate-600 text-[10px] font-bold">
              {course.instructor.avatar ? (
                <img src={course.instructor.avatar} alt={course.instructor.name} className="w-full h-full object-cover" />
              ) : (
                <User className="w-3.5 h-3.5" />
              )}
            </div>
            <span className="text-xs text-slate-700 font-medium truncate">
              {course.instructor.name}
            </span>
          </div>

          <div className="flex items-center gap-1 text-xs font-semibold text-slate-800 shrink-0">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>{course.instructor.rating}</span>
          </div>
        </div>

        {/* Enrolled Progress Bar */}
        {isEnrolled && typeof progressPercent === 'number' && (
          <div className="mt-3 pt-2 border-t border-slate-100">
            <div className="flex justify-between items-center text-[11px] font-semibold text-slate-600 mb-1">
              <span>{progressPercent === 100 ? 'Completed 🎉' : 'Course Progress'}</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  progressPercent === 100 ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
