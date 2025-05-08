
import React, { ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface StatCardProps {
  icon: ReactNode;
  title: string;
  value: string | number;
  subtitle?: string;
  className?: string;
}

export const StatCard = ({ icon, title, value, subtitle, className }: StatCardProps) => {
  return (
    <div className={cn("bg-[#1A1F2C]/80 p-6 rounded-lg border border-gray-800 flex items-start justify-between", className)}>
      <div className="flex items-center space-x-4">
        <div className="text-primary-foreground">
          {icon}
        </div>
        <div>
          <h3 className="text-sm text-gray-400 font-medium">{title}</h3>
          {subtitle && <p className="text-xs text-green-500 mt-1">{subtitle}</p>}
        </div>
      </div>
      <p className="text-3xl font-bold text-white">{value}</p>
    </div>
  );
};
