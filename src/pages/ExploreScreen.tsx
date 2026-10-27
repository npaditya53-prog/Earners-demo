import React, { useDeferredValue, useEffect, useMemo, useState } from 'react';
import { Filter, Grid, Search, SlidersHorizontal, X } from 'lucide-react';
import { CourseCard } from '../components/CourseCard';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '../context/NavigationContext';
import { storage } from '../services/storage';
import { Category, Course } from '../types';

export const ExploreScreen: React.FC = () => {
  const { location, searchQuery, setSearchQuery } = useNavigation();
  const { user } = useAuth();

  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  
  // Filter state
  const [selectedCategory, setSelectedCategory] = useState<string>(
    (location.page === 'explore' && location.categoryId) || 'all'
  );
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'relevance' | 'newest' | 'alphabetical'>('relevance');
  const [searchFilter, setSearchFilter] = useState(searchQuery || '');

  // Use deferred value for smooth typing without lag
  const deferredSearch = useDeferredValue(searchFilter);

  useEffect(() => {
    setCourses(storage.getCourses().filter((c) => c.isPublished));
    setCategories(storage.getCourses().reduce<Category[]>((acc, c) => {
      if (!acc.some((item) => item.id === c.categoryId)) {
        acc.push({
          id: c.categoryId,
          name: c.categoryName,
          slug: c.categoryId,
          iconName: 'Compass',
          description: '',
          courseCount: 1,
        });
      }
      return acc;
    }, []));
  }, []);

  useEffect(() => {
    if (location.page === 'explore' && location.categoryId) {
      setSelectedCategory(location.categoryId);
    }
  }, [location]);

  const enrollments = storage.getEnrollments(user?.uid);
  const enrolledIds = new Set(enrollments.map((e) => e.courseId));

  // Filter logic
  const filteredCourses = useMemo(() => {
    return courses
      .filter((course) => {
        // Search term check
        if (deferredSearch.trim()) {
          const query = deferredSearch.toLowerCase();
          const matchTitle = course.title.toLowerCase().includes(query);
          const matchSub = course.subtitle.toLowerCase().includes(query);
          const matchInst = course.instructor.name.toLowerCase().includes(query);
          const matchCat = course.categoryName.toLowerCase().includes(query);
          const matchOutcome = course.learningOutcomes.some((o) => o.toLowerCase().includes(query));
          if (!matchTitle && !matchSub && !matchInst && !matchCat && !matchOutcome) return false;
        }

        // Category check
        if (selectedCategory !== 'all' && course.categoryId !== selectedCategory) {
          return false;
        }

        // Level check
        if (selectedLevel !== 'all' && course.level !== selectedLevel) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortBy === 'alphabetical') {
          return a.title.localeCompare(b.title);
        }
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      });
  }, [courses, deferredSearch, selectedCategory, selectedLevel, sortBy]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedLevel('all');
    setSearchFilter('');
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24 md:pb-16 animate-fade-in">
      
      {/* Header Banner */}
      <section className="bg-slate-900 text-white py-10 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Explore Digital Skill Courses
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-300">
            Find high-impact training in AI automation, video production, graphic design, and freelancing.
          </p>

          {/* Search bar */}
          <div className="mt-6 max-w-2xl relative">
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search by title, topic, or instructor..."
              className="w-full pl-11 pr-10 py-3 bg-slate-800 border border-slate-700 rounded-2xl text-sm text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 transition-colors"
            />
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            {searchFilter && (
              <button
                onClick={() => setSearchFilter('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* Interactive Segmented Filter Controls (Functional Buttons) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-200">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap shrink-0 transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              All Courses
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap shrink-0 transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-amber-500 text-slate-950 shadow-xs font-bold'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Secondary Controls: Level & Sorting Dropdowns */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Level Filter */}
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="all">All Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            {/* Sort Filter */}
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="relevance">Featured</option>
                <option value="newest">Newest First</option>
                <option value="alphabetical">Alphabetical</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Counter & Reset Filter Indicator */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-xs font-semibold text-slate-500">
            Showing <span className="text-slate-900 font-bold">{filteredCourses.length}</span> courses
            {selectedCategory !== 'all' || selectedLevel !== 'all' || searchFilter ? ' (filtered)' : ''}
          </div>

          {(selectedCategory !== 'all' || selectedLevel !== 'all' || searchFilter) && (
            <button
              onClick={resetFilters}
              className="text-xs font-bold text-amber-600 hover:text-amber-700 underline"
            >
              Reset all filters
            </button>
          )}
        </div>

        {/* Course Grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                isEnrolled={enrolledIds.has(course.id)}
                progressPercent={
                  enrollments.find((e) => e.courseId === course.id)?.progressPercent
                }
              />
            ))}
          </div>
        ) : (
          /* Empty Search State */
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto my-8">
            <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900 mb-1">No courses found</h3>
            <p className="text-xs text-slate-500 mb-6">
              We couldn't find any courses matching your search "{searchFilter}". Try adjusting your keywords or category filters.
            </p>
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors"
            >
              Clear Search & Show All
            </button>
          </div>
        )}

      </main>
    </div>
  );
};
