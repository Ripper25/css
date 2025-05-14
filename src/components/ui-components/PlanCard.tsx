
import React from "react";

interface PlanCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const PlanCard = ({ icon, title, description }: PlanCardProps) => {
  return (
    <div className="ios-card mb-6">
      <div className="flex flex-col items-center text-center">
        <div className="w-14 h-14 bg-primary-100 text-primary-500 rounded-xl flex items-center justify-center mb-3">
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
};

export default PlanCard;
