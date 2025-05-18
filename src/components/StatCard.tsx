import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: number;
  color?: 'blue' | 'green' | 'red' | 'orange' | 'purple';
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon, 
  trend, 
  color = 'blue' 
}) => {
  const getColorClasses = () => {
    switch (color) {
      case 'blue':
        return {
          bg: 'bg-blue-100 dark:bg-blue-900/30',
          text: 'text-blue-600 dark:text-blue-300'
        };
      case 'green':
        return {
          bg: 'bg-green-100 dark:bg-green-900/30',
          text: 'text-green-600 dark:text-green-300'
        };
      case 'red':
        return {
          bg: 'bg-red-100 dark:bg-red-900/30',
          text: 'text-red-600 dark:text-red-300'
        };
      case 'orange':
        return {
          bg: 'bg-orange-100 dark:bg-orange-900/30',
          text: 'text-orange-600 dark:text-orange-300'
        };
      case 'purple':
        return {
          bg: 'bg-purple-100 dark:bg-purple-900/30',
          text: 'text-purple-600 dark:text-purple-300'
        };
    }
  };

  const colorClasses = getColorClasses();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center">
        <div className={`w-12 h-12 rounded-full ${colorClasses.bg} flex items-center justify-center mr-4`}>
          <div className={colorClasses.text}>
            {icon}
          </div>
        </div>
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</h3>
          
          {trend !== undefined && (
            <div className="flex items-center mt-1">
              <span className={`text-sm font-medium ${trend > 0 ? 'text-green-600 dark:text-green-400' : trend < 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}`}>
                {trend > 0 ? '+' : ''}{trend}%
              </span>
              <span className="ml-1.5 text-xs text-gray-500 dark:text-gray-400">vs. prev period</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatCard;