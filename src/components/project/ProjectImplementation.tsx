import React from 'react';
import { Calendar } from '@phosphor-icons/react';
import { projects, plans } from "@/data/projectData";
import ProjectNavigator from './ProjectNavigator';

interface ProjectImplementationProps {
  projectId: number;
  projectName: string;
  onProgressUpdate?: (phaseId: number, progress: number) => void;
}

const ProjectImplementation: React.FC<ProjectImplementationProps> = ({
  projectId,
  projectName,
  onProgressUpdate
}) => {
  // Find associated plans for this project
  const associatedPlans = plans.filter(plan => plan.projectId === projectId);

  return (
    <div className="space-y-6">
      {/* Associated calendar events */}
      {associatedPlans.length > 0 && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 mb-6">
          <div className="bg-blue-600 text-white py-2 px-4 font-semibold">
            <span>Associated Calendar Events</span>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {associatedPlans.map(plan => (
                <div key={plan.id} className="text-xs p-3 border rounded-md bg-[#e6d7b3] shadow-sm">
                  <div className="font-medium text-blue-800">{plan.name}</div>
                  <div className="text-gray-700 mt-1">{plan.date} • {plan.location}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Project Navigator */}
      <ProjectNavigator
        projectId={projectId}
        projectName={projectName}
        onProgressUpdate={onProgressUpdate}
      />
    </div>
  );
};

export default ProjectImplementation;
