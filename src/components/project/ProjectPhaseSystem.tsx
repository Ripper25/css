import { useState, useEffect } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Lightbulb,
  MagnifyingGlass,
  Gear,
  Play,
  ChartLineUp,
  PresentationChart,
  CaretRight,
  Calendar
} from "@phosphor-icons/react";
import ConceptPhase from "./phases/ConceptPhase";
import FeasibilityPhase from "./phases/FeasibilityPhase";
import PlanningPhase from "./phases/PlanningPhase";
import ImplementationPhase from "./phases/ImplementationPhase";
import MonitoringPhase from "./phases/MonitoringPhase";
import ReportingPhase from "./phases/ReportingPhase";
import { projects, plans } from "@/data/projectData";

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

interface ProjectPhaseSystemProps {
  projectId: number;
  projectName: string;
}

const ProjectPhaseSystem = ({ projectId, projectName }: ProjectPhaseSystemProps) => {
  const [activePhase, setActivePhase] = useState<string>("1");

  // Find the current project
  const project = projects.find(p => p.id === projectId);

  // Find associated plans for this project
  const associatedPlans = plans.filter(plan => plan.projectId === projectId);

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
  };

  // Calculate overall project progress
  const calculateProjectProgress = (): number => {
    // If we have a project with progress data, use that
    if (project?.progress !== undefined) {
      return project.progress;
    }

    // Otherwise calculate from phases
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
        <div className="bg-blue-600 text-white py-2 px-4 font-semibold">
          Project Implementation Progress
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
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${calculateProjectProgress()}%` }}
            />
          </div>

          {/* Associated calendar events */}
          {associatedPlans.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-3">
                <Calendar size={18} className="text-blue-600" />
                <h3 className="text-sm font-medium text-blue-800">Associated Calendar Events</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {associatedPlans.map(plan => (
                  <div key={plan.id} className="text-xs p-3 border rounded-md bg-[#e6d7b3] shadow-sm">
                    <div className="font-medium text-blue-800">{plan.name}</div>
                    <div className="text-gray-700 mt-1">{plan.date} • {plan.location}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

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

      {/* Phase Content */}
      <Tabs value={activePhase} onValueChange={setActivePhase} className="w-full">
        <TabsContent value="1">
          <ConceptPhase
            projectId={projectId}
            onProgressUpdate={(progress) => updatePhaseProgress(1, progress)}
          />
        </TabsContent>

        <TabsContent value="2">
          <FeasibilityPhase
            projectId={projectId}
            onProgressUpdate={(progress) => updatePhaseProgress(2, progress)}
            isLocked={phases[1].isLocked}
          />
        </TabsContent>

        <TabsContent value="3">
          <PlanningPhase
            projectId={projectId}
            onProgressUpdate={(progress) => updatePhaseProgress(3, progress)}
            isLocked={phases[2].isLocked}
          />
        </TabsContent>

        <TabsContent value="4">
          <ImplementationPhase
            projectId={projectId}
            onProgressUpdate={(progress) => updatePhaseProgress(4, progress)}
            isLocked={phases[3].isLocked}
          />
        </TabsContent>

        <TabsContent value="5">
          <MonitoringPhase
            projectId={projectId}
            onProgressUpdate={(progress) => updatePhaseProgress(5, progress)}
            isLocked={phases[4].isLocked}
          />
        </TabsContent>

        <TabsContent value="6">
          <ReportingPhase
            projectId={projectId}
            onProgressUpdate={(progress) => updatePhaseProgress(6, progress)}
            isLocked={phases[5].isLocked}
          />
        </TabsContent>
      </Tabs>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <button
          className={`px-4 py-2 rounded-md border border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors ${
            activePhase === "1" ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onClick={() => {
            const currentPhaseId = parseInt(activePhase);
            if (currentPhaseId > 1) {
              setActivePhase((currentPhaseId - 1).toString());
            }
          }}
          disabled={activePhase === "1"}
        >
          Previous Phase
        </button>

        <button
          className={`px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center ${
            activePhase === "6" || phases.find(p => p.id === parseInt(activePhase) + 1)?.isLocked
              ? 'opacity-50 cursor-not-allowed'
              : ''
          }`}
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
        </button>
      </div>
    </div>
  );
};

export default ProjectPhaseSystem;
