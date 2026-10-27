import React from 'react';

export const CourseCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col h-full animate-pulse">
      <div className="h-40 bg-slate-200" />
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-2">
          <div className="h-3 w-1/3 bg-slate-200 rounded-md" />
          <div className="h-5 w-5/6 bg-slate-200 rounded-md" />
          <div className="h-4 w-full bg-slate-100 rounded-md" />
        </div>
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-slate-200" />
            <div className="h-3 w-20 bg-slate-200 rounded-md" />
          </div>
          <div className="h-3 w-8 bg-slate-200 rounded-md" />
        </div>
      </div>
    </div>
  );
};
