import React, { useEffect, useState } from 'react';
import { Camera, Compass, Cpu, GraduationCap, Palette, Video } from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';
import { storage } from '../services/storage';
import { Category } from '../types';

export const CategoriesScreen: React.FC = () => {
  const { navigate } = useNavigation();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const courses = storage.getCourses();
    const map = courses.reduce<Record<string, { count: number; name: string }>>((acc, c) => {
      if (!acc[c.categoryId]) {
        acc[c.categoryId] = { count: 0, name: c.categoryName };
      }
      acc[c.categoryId].count++;
      return acc;
    }, {});

    const list: Category[] = Object.entries(map).map(([id, info]) => ({
      id,
      name: info.name,
      slug: id,
      iconName: id,
      description: `Explore practical skill courses in ${info.name}.`,
      courseCount: info.count,
    }));

    setCategories(list);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 pb-24 md:pb-16 animate-fade-in">
      <section className="bg-slate-900 text-white py-10 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Skill Categories
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-300">
            Browse specialized skill learning paths designed for modern creators and tech professionals.
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => navigate({ page: 'explore', categoryId: cat.id })}
              className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-amber-400 text-left transition-all group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                  {cat.id.includes('ai') ? (
                    <Cpu className="w-6 h-6" />
                  ) : cat.id.includes('video') ? (
                    <Video className="w-6 h-6" />
                  ) : cat.id.includes('design') ? (
                    <Palette className="w-6 h-6" />
                  ) : cat.id.includes('content') ? (
                    <Camera className="w-6 h-6" />
                  ) : (
                    <Compass className="w-6 h-6" />
                  )}
                </div>
                <h3 className="font-extrabold text-base text-slate-900 group-hover:text-amber-600 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {cat.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-amber-700">
                <span>{cat.courseCount} Courses</span>
                <span>Browse Category →</span>
              </div>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};
