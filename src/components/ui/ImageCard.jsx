import React, { useState } from 'react';

const aspectRatios = {
  square: 'aspect-square',
  video: 'aspect-video',
  portrait: 'aspect-[3/4]',
};

const sizes = {
  sm: 'h-32 w-32',
  md: 'h-48 w-full',
  lg: 'h-64 w-full',
  xl: 'h-96 w-full',
};

export function ImageCard({
  src,
  alt,
  title,
  description,
  aspectRatio = 'video',
  size = 'md',
  overlay = false,
  className = '',
}) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className={`group overflow-hidden rounded-xl bg-white shadow-sm ${className}`}>
      {/* Image Container */}
      <div className={`relative overflow-hidden bg-gray-100 ${sizes[size] || sizes.md} ${aspectRatios[aspectRatio] || aspectRatios.video}`}>
        {/* Loading state */}
        {isLoading && (
          <div className="absolute inset-0 animate-pulse bg-gray-200" />
        )}

        {/* Image */}
        <img
          src={src}
          alt={alt}
          className={`h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          }`}
          onLoad={() => setIsLoading(false)}
        />

        {/* Overlay Gradient */}
        {overlay && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        )}
      </div>

      {/* Content */}
      {(title || description) && (
        <div className="space-y-2 p-4">
          {title && (
            <h3 className="font-semibold text-gray-900 line-clamp-2">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-sm text-gray-500 line-clamp-2">
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
