import React from 'react';
import Card from '../../Admin panel/admin/admincomponents/Card';

const StatsCard = ({
  title,
  value,
  change,
  icon: Icon,
  color = "text-blue-600",
  bgColor = "bg-blue-50",
  hover = true,
  className = "",
  onClick
}) => {
  return (
    <Card 
      hover={hover} 
      className={`p-6 cursor-pointer ${className}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
          <p className="text-sm text-gray-500">{change}</p>
        </div>
        <div className={`w-12 h-12 ${bgColor} rounded-xl flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      </div>
    </Card>
  );
};

export default StatsCard;

