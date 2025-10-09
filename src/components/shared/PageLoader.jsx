import React from 'react';

const PageLoader = ({ isLoading, children, variant = "default" }) => {
  if (variant === "blur") {
    return (
      <div className="relative">
        {/* Render content with headings visible */}
        <div className={`${isLoading ? 'blur-[1px] opacity-50' : 'blur-0 opacity-100'} transition-all duration-300`}>
          {children}
        </div>
        
        {/* Loader overlay - only covers content below headings */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-50">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-200 border-t-pink-500"></div>
              <p className="text-gray-600 font-medium">Loading...</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (variant === "headings") {
    return (
      <div className="relative">
        {React.Children.map(children, (child, index) => {
          // First child (heading) always visible - no loader
          if (index === 0) {
            return (
              <div key={index} className="relative z-10">
                {child}
              </div>
            );
          }
          
          // Rest of the content with loader overlay
          return (
            <div key={index} className="relative">
              {/* Content - always rendered but with opacity change */}
              <div className={`${isLoading ? 'opacity-30 pointer-events-none' : 'opacity-100'} transition-all duration-300`}>
                {child}
              </div>
              
              {/* Loader overlay - only when loading */}
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center z-50 bg-white/80 backdrop-blur-sm">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-200 border-t-pink-500"></div>
                    <p className="text-gray-600 font-medium">Loading...</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  // Default variant - hide content completely
  return (
    <>
      {/* Loader */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-50">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-200 border-t-pink-500"></div>
            <p className="text-gray-600 font-medium">Loading...</p>
          </div>
        </div>
      )}
      <div className={`${isLoading ? 'hidden' : 'block'}`}>
        {children}
      </div>
    </>
  );
};

export default PageLoader;

