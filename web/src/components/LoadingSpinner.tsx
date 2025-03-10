
import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full py-12">
      <div className="relative flex">
        <div className="w-4 h-4 rounded-full bg-primary/70 animate-pulse-slow"></div>
        <div className="w-4 h-4 rounded-full bg-primary/70 animate-pulse-slow animation-delay-200 mx-2"></div>
        <div className="w-4 h-4 rounded-full bg-primary/70 animate-pulse-slow animation-delay-400"></div>
      </div>
      <p className="mt-4 text-sm text-muted-foreground animate-pulse-slow">
        Processing graph query...
      </p>
    </div>
  );
};

export default LoadingSpinner;
