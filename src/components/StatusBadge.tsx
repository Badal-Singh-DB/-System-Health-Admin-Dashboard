import React from 'react';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

type Status = 'success' | 'warning' | 'error';

interface StatusBadgeProps {
  status: Status;
  text: string;
  details?: string;
  size?: 'sm' | 'md' | 'lg';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  text, 
  details, 
  size = 'md' 
}) => {
  const getStatusColors = () => {
    switch (status) {
      case 'success':
        return {
          bg: 'bg-green-100 dark:bg-green-900/30',
          text: 'text-green-800 dark:text-green-300',
          border: 'border-green-200 dark:border-green-800',
          icon: <CheckCircle className={`${size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'} text-green-500`} />
        };
      case 'warning':
        return {
          bg: 'bg-orange-100 dark:bg-orange-900/30',
          text: 'text-orange-800 dark:text-orange-300',
          border: 'border-orange-200 dark:border-orange-800',
          icon: <AlertTriangle className={`${size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'} text-orange-500`} />
        };
      case 'error':
        return {
          bg: 'bg-red-100 dark:bg-red-900/30',
          text: 'text-red-800 dark:text-red-300',
          border: 'border-red-200 dark:border-red-800',
          icon: <XCircle className={`${size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'} text-red-500`} />
        };
    }
  };

  const styles = getStatusColors();
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2'
  };

  return (
    <div className={`inline-flex items-center rounded-full border ${styles.bg} ${styles.text} ${styles.border} ${sizeClasses[size]} transition-all duration-200`}>
      {styles.icon}
      <span className={`ml-1.5 font-medium`}>{text}</span>
      {details && (
        <span className="ml-1 opacity-75 text-xs">({details})</span>
      )}
    </div>
  );
};

export default StatusBadge;