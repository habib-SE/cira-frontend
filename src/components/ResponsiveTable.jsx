import React from 'react';

const ResponsiveTable = ({ 
    children, 
    className = '',
    minWidth = 'min-w-[800px]',
    ...props 
}) => {
    return (
        <div className="table-responsive">
            <table className={`w-full ${minWidth} ${className}`} {...props}>
                {children}
            </table>
        </div>
    );
};

export default ResponsiveTable;
