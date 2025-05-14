import React, { useState, useEffect } from 'react';
import {
  Lightbulb,
  MagnifyingGlass,
  Gear,
  Play,
  ChartLineUp,
  PresentationChart,
  CaretRight,
  CaretLeft,
  ArrowsClockwise
} from '@phosphor-icons/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Import phase components
import ConceptPhase from './phases/ConceptPhase';
import FeasibilityPhase from './phases/FeasibilityPhase';
import PlanningPhase from './phases/PlanningPhase';
import ImplementationPhase from './phases/ImplementationPhase';
import MonitoringPhase from './phases/MonitoringPhase';
import ReportingPhase from './phases/ReportingPhase';

// Define the project phase structure
export interface ProjectPhase {
  id: number;
  name: string;
  description: string;
  icon: JSX.Element;
  progress: number;
  status: 'not-started' | 'in-progress' | 'completed';
  isLocked: boolean;
}

interface ProjectNavigatorProps {
  projectId: number;
  projectName: string;
  onProgressUpdate?: (phaseId: number, progress: number) => void;
}

const ProjectNavigator: React.FC<ProjectNavigatorProps> = ({
  projectId,
  projectName,
  onProgressUpdate
}) => {
  // State for phases
  const [phases, setPhases] = useState<ProjectPhase[]>([
    {
      id: 1,
      name: "Concept Development",
      description: "Define the problem, develop the idea, and set objectives",
      icon: <Lightbulb size={24} />,
      progress: 0,
      status: 'not-started',
      isLocked: false
    },
    {
      id: 2,
      name: "Feasibility Study",
      description: "Market research, technical feasibility, financial analysis, risk assessment",
      icon: <MagnifyingGlass size={24} />,
      progress: 0,
      status: 'not-started',
      isLocked: true
    },
    {
      id: 3,
      name: "Planning Phase",
      description: "Project proposal, work plan, budgeting, securing resources",
      icon: <Gear size={24} />,
      progress: 0,
      status: 'not-started',
      isLocked: true
    },
    {
      id: 4,
      name: "Implementation Phase",
      description: "Mobilization, execution, documentation",
      icon: <Play size={24} />,
      progress: 0,
      status: 'not-started',
      isLocked: true
    },
    {
      id: 5,
      name: "Monitoring & Evaluation",
      description: "Track progress, evaluate outcomes, make adjustments",
      icon: <ChartLineUp size={24} />,
      progress: 0,
      status: 'not-started',
      isLocked: true
    },
    {
      id: 6,
      name: "Reporting & Impact Assessment",
      description: "Final report, impact assessment, stakeholder presentation",
      icon: <PresentationChart size={24} />,
      progress: 0,
      status: 'not-started',
      isLocked: true
    }
  ]);

  // State for active phase
  const [activePhase, setActivePhase] = useState<string>("1");

  // State for phase content
  const [phaseContent, setPhaseContent] = useState<{[key: string]: any}>({
    '1': {}, // Concept Development
    '2': {}, // Feasibility Study
    '3': {}, // Planning Phase
    '4': {}, // Implementation Phase
    '5': {}, // Monitoring & Evaluation
    '6': {}  // Reporting & Impact Assessment
  });

  // Update phase progress
  const updatePhaseProgress = (phaseId: number, progress: number) => {
    setPhases(prevPhases =>
      prevPhases.map(phase =>
        phase.id === phaseId
          ? {
              ...phase,
              progress,
              status: progress === 100 ? 'completed' : progress > 0 ? 'in-progress' : 'not-started'
            }
          : phase
      )
    );

    // If a phase is completed, unlock the next phase
    if (progress === 100) {
      setPhases(prevPhases => {
        const updatedPhases = [...prevPhases];
        const currentPhaseIndex = updatedPhases.findIndex(p => p.id === phaseId);

        if (currentPhaseIndex < updatedPhases.length - 1) {
          updatedPhases[currentPhaseIndex + 1].isLocked = false;
        }

        return updatedPhases;
      });
    }

    // Call the parent's onProgressUpdate if provided
    if (onProgressUpdate) {
      onProgressUpdate(phaseId, progress);
    }
  };

  // Calculate overall project progress
  const calculateProjectProgress = (): number => {
    const totalProgress = phases.reduce((sum, phase) => sum + phase.progress, 0);
    return Math.round(totalProgress / phases.length);
  };

  // Get status color based on phase status
  const getStatusColor = (status: 'not-started' | 'in-progress' | 'completed'): string => {
    switch (status) {
      case 'completed':
        return 'bg-green-600';
      case 'in-progress':
        return 'bg-blue-600';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Project Progress Overview */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 mb-6">
        <div className="bg-blue-600 text-white py-2 px-4 font-semibold flex justify-between items-center">
          <span>Project Implementation Progress</span>
        </div>
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-bold text-blue-800">{projectName}</h2>
              <p className="text-gray-600 text-sm">Implementation tracking</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Overall Progress</div>
              <div className="text-2xl font-bold text-blue-800">{calculateProjectProgress()}%</div>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${calculateProjectProgress()}%` }}
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {phases.map((phase) => (
              <div
                key={phase.id}
                className={`h-auto py-3 px-3 flex flex-col items-center justify-center rounded-md border ${
                  activePhase === phase.id.toString()
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 bg-white'
                } ${phase.isLocked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                onClick={() => !phase.isLocked && setActivePhase(phase.id.toString())}
              >
                <div className="relative text-blue-600">
                  {phase.icon}
                  <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${getStatusColor(phase.status)}`}></div>
                </div>
                <div className="text-xs font-medium mt-2 text-center text-blue-800">{phase.name}</div>
                <div className="text-[10px] text-gray-600 mt-1">{phase.progress}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 gap-6">
        {/* Phase Content */}
        <div className="col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>
                {phases.find(p => p.id === parseInt(activePhase))?.name || 'Phase Content'}
              </CardTitle>
              <CardDescription>
                {phases.find(p => p.id === parseInt(activePhase))?.description || 'Phase description'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Phase-specific content components */}
              {activePhase === "1" && (
                <ConceptPhase
                  projectId={projectId}
                  onProgressUpdate={(progress) => updatePhaseProgress(1, progress)}
                />
              )}

              {activePhase === "2" && (
                <FeasibilityPhase
                  projectId={projectId}
                  onProgressUpdate={(progress) => updatePhaseProgress(2, progress)}
                  isLocked={phases[1].isLocked}
                />
              )}

              {activePhase === "3" && (
                <PlanningPhase
                  projectId={projectId}
                  onProgressUpdate={(progress) => updatePhaseProgress(3, progress)}
                  isLocked={phases[2].isLocked}
                />
              )}

              {activePhase === "4" && (
                <ImplementationPhase
                  projectId={projectId}
                  onProgressUpdate={(progress) => updatePhaseProgress(4, progress)}
                  isLocked={phases[3].isLocked}
                />
              )}

              {activePhase === "5" && (
                <MonitoringPhase
                  projectId={projectId}
                  onProgressUpdate={(progress) => updatePhaseProgress(5, progress)}
                  isLocked={phases[4].isLocked}
                />
              )}

              {activePhase === "6" && (
                <ReportingPhase
                  projectId={projectId}
                  onProgressUpdate={(progress) => updatePhaseProgress(6, progress)}
                  isLocked={phases[5].isLocked}
                />
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => {
                  const currentPhaseId = parseInt(activePhase);
                  if (currentPhaseId > 1) {
                    setActivePhase((currentPhaseId - 1).toString());
                  }
                }}
                disabled={activePhase === "1"}
              >
                <CaretLeft size={16} className="mr-1" />
                Previous Phase
              </Button>

              <Button
                onClick={() => {
                  const currentPhaseId = parseInt(activePhase);
                  const nextPhase = phases.find(p => p.id === currentPhaseId + 1);

                  if (nextPhase && !nextPhase.isLocked) {
                    setActivePhase((currentPhaseId + 1).toString());
                  }
                }}
                disabled={
                  activePhase === "6" ||
                  phases.find(p => p.id === parseInt(activePhase) + 1)?.isLocked
                }
              >
                Next Phase
                <CaretRight size={16} className="ml-1" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProjectNavigator;
