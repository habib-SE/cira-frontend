import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumbs = ({ customPath = null }) => {
  const location = useLocation();
  
  // Parse path segments
  const pathSegments = customPath 
    ? customPath.split('/').filter(Boolean)
    : location.pathname.split('/').filter(Boolean);

  // Build breadcrumb items
  const breadcrumbs = pathSegments.map((segment, index) => {
    const path = '/' + pathSegments.slice(0, index + 1).join('/');
    const isLast = index === pathSegments.length - 1;
    
    // Format segment name
    const formatSegment = (seg) => {
      // Handle special cases
      if (seg === 'admin' || seg === 'doctor' || seg === 'patient') {
        return seg.charAt(0).toUpperCase() + seg.slice(1);
      }
      
      // Replace hyphens with spaces and capitalize
      return seg
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    };

    return {
      label: formatSegment(segment),
      path,
      isLast
    };
  });

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
      {/* Home icon */}
      <Link 
        to="/" 
        className="flex items-center hover:text-pink-600 transition-colors"
      >
        <Home className="w-4 h-4" />
      </Link>

      {/* Breadcrumb items */}
      {breadcrumbs.map((crumb, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          {crumb.isLast ? (
            <span className="font-medium text-gray-900">{crumb.label}</span>
          ) : (
            <Link 
              to={crumb.path} 
              className="hover:text-pink-600 transition-colors"
            >
              {crumb.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumbs;

