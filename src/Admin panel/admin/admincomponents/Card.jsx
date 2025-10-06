import React from 'react';

const Card = ({ 
    children, 
    className = '', 
    hover = false, 
    padding = 'p-fluid-md',
    ...props 
}) => {
    const baseClasses = 'bg-white rounded-2xl shadow-sm border border-gray-100';
    const hoverClasses = hover ? 'hover:shadow-lg transition-all duration-200' : '';
    
    return (
        <div 
            className={`${baseClasses} ${hoverClasses} ${padding} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

export default Card;
