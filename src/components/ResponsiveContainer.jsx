import React from 'react';

const ResponsiveContainer = ({ 
    children, 
    className = '', 
    maxWidth = 'max-w-7xl',
    padding = 'p-fluid-md',
    ...props 
}) => {
    return (
        <div 
            className={`container-fluid ${maxWidth} ${padding} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

export default ResponsiveContainer;
