import React from 'react';

const LoadingSpinner = ({ size = 'md', message = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] p-8">
      <div className={`${sizeClasses[size]} border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin`}></div>
      <p className="mt-4 text-gray-600 animate-pulse">{message}</p>
    </div>
  );
};

// Product Card Skeleton Component
export const ProductCardSkeleton = () => {
  return (
    <div className="animate-pulse bg-white rounded-2xl border-2 border-gray-200 overflow-hidden">
      {/* Image Skeleton */}
      <div className="h-48 bg-gray-200"></div>
      
      {/* Content Skeleton */}
      <div className="p-6">
        {/* Title */}
        <div className="h-6 bg-gray-200 rounded mb-3 w-3/4"></div>
        
        {/* Description */}
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
        
        {/* Price */}
        <div className="h-6 bg-orange-200 rounded w-1/3"></div>
      </div>
    </div>
  );
};

// Category Card Skeleton
export const CategorySkeleton = () => {
  return (
    <div className="animate-pulse text-center">
      <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-3"></div>
      <div className="h-4 bg-gray-200 rounded w-16 mx-auto"></div>
    </div>
  );
};

// Search Results Skeleton
export const SearchResultsSkeleton = () => {
  return (
    <div className="animate-pulse">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </div>
          <div className="h-4 bg-orange-200 rounded w-16"></div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSpinner;
