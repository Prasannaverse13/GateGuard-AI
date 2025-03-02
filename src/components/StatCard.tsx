import React from 'react';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, change, trend }) => {
  return (
    <div className="bento-card p-6 hover:shadow-glow-blue">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-400 text-sm">{title}</p>
          <p className="text-2xl font-semibold mt-1 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">{value}</p>
        </div>
        <div className="p-2 bg-gray-800/80 backdrop-blur-sm rounded-lg border border-gray-700/50">
          {icon}
        </div>
      </div>
      {change && (
        <div className="mt-4 flex items-center text-sm">
          {trend === 'up' && <ArrowUp className="h-4 w-4 text-green-500 mr-1" />}
          {trend === 'down' && <ArrowDown className="h-4 w-4 text-red-500 mr-1" />}
          {trend === 'neutral' && <Minus className="h-4 w-4 text-gray-500 mr-1" />}
          <span className={`${
            trend === 'up' ? 'text-green-500' : 
            trend === 'down' ? 'text-red-500' : 
            'text-gray-500'
          }`}>
            {change}
          </span>
        </div>
      )}
    </div>
  );
};

export default StatCard;