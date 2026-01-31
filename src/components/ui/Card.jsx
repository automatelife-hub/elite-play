import React from 'react';

const cardVariants = {
  default: 'rounded-xl border border-gray-200 bg-white text-gray-900 shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-200',
  elevated: 'rounded-xl border border-gray-200 bg-white text-gray-900 shadow-md hover:shadow-lg transition-all duration-200',
  interactive: 'rounded-xl border border-gray-200 bg-white text-gray-900 cursor-pointer hover:shadow-lg hover:-translate-y-1 hover:border-blue-500 transition-all duration-200',
  subtle: 'rounded-xl border border-gray-100 bg-gray-50/50 text-gray-900 hover:bg-gray-50 transition-all duration-200',
};

const paddingSizes = {
  none: 'p-0',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
  xl: 'p-10',
};

export const Card = React.forwardRef(
  ({ className = '', variant = 'default', padding = 'md', ...props }, ref) => {
    const baseClasses = cardVariants[variant] || cardVariants.default;
    const paddingClass = paddingSizes[padding] || paddingSizes.md;
    const combinedClasses = `${baseClasses} ${paddingClass} ${className}`;

    return <div ref={ref} className={combinedClasses} {...props} />;
  }
);

Card.displayName = 'Card';

export const CardHeader = React.forwardRef(
  ({ className = '', ...props }, ref) => (
    <div ref={ref} className={`space-y-2 ${className}`} {...props} />
  )
);

CardHeader.displayName = 'CardHeader';

export const CardFooter = React.forwardRef(
  ({ className = '', ...props }, ref) => (
    <div ref={ref} className={`flex items-center pt-6 ${className}`} {...props} />
  )
);

CardFooter.displayName = 'CardFooter';

export const CardTitle = React.forwardRef(
  ({ className = '', ...props }, ref) => (
    <h3
      ref={ref}
      className={`font-semibold leading-none tracking-tight text-gray-900 ${className}`}
      {...props}
    />
  )
);

CardTitle.displayName = 'CardTitle';

export const CardDescription = React.forwardRef(
  ({ className = '', ...props }, ref) => (
    <p
      ref={ref}
      className={`text-sm text-gray-500 ${className}`}
      {...props}
    />
  )
);

CardDescription.displayName = 'CardDescription';
