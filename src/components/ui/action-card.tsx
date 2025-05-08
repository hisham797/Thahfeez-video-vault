
import React, { ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface ActionCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  className?: string;
  onClick?: () => void;
}

export const ActionCard = ({ icon, title, description, className, onClick }: ActionCardProps) => {
  return (
    <div 
      className={cn(
        "bg-[#1A1F2C]/80 p-6 rounded-lg border border-gray-800 cursor-pointer hover:bg-[#1A1F2C] transition-colors", 
        className
      )}
      onClick={onClick}
    >
      <div className="text-primary-foreground mb-4">
        {icon}
      </div>
      <h3 className="text-white font-medium text-lg mb-1">{title}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  );
};
