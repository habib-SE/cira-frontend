import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const Chart = ({ 
    type = 'line', 
    data = [], 
    width = '100%', 
    height = 300,
    className = '',
    ...props 
}) => {
    const colors = ['#EC4899', '#F472B6', '#FBBF24', '#10B981', '#3B82F6'];

    const renderChart = () => {
        switch (type) {
            case 'line':
                return (
                    <LineChart data={data} {...props}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="name" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" />
                        <Tooltip 
                            contentStyle={{ 
                                backgroundColor: 'white', 
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }} 
                        />
                        <Line 
                            type="monotone" 
                            dataKey="value" 
                            stroke="#EC4899" 
                            strokeWidth={3}
                            dot={{ fill: '#EC4899', strokeWidth: 2, r: 4 }}
                        />
                    </LineChart>
                );
            
            case 'bar':
                return (
                    <BarChart data={data} {...props}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="name" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" />
                        <Tooltip 
                            contentStyle={{ 
                                backgroundColor: 'white', 
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }} 
                        />
                        <Bar dataKey="value" fill="#EC4899" radius={[4, 4, 0, 0]} />
                    </BarChart>
                );
            
            case 'pie':
                return (
                    <PieChart {...props}>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                            ))}
                        </Pie>
                        <Tooltip 
                            contentStyle={{ 
                                backgroundColor: 'white', 
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }} 
                        />
                    </PieChart>
                );
            
            default:
                return null;
        }
    };

    return (
        <div className={`w-full ${className}`} style={{ width, height }}>
            <ResponsiveContainer width="100%" height="100%">
                {renderChart()}
            </ResponsiveContainer>
        </div>
    );
};

export default Chart;
