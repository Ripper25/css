import React, { useEffect, useState } from 'react';
import { Calendar, ChartBar, Clock, Warning, CheckCircle, Lightning } from '@phosphor-icons/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import strategicPlanService from '@/services/StrategicPlanService';

interface ProjectInsightsProps {
  projectId: number;
  projectName: string;
  progress?: number;
  className?: string;
}

const ProjectInsights: React.FC<ProjectInsightsProps> = ({
  projectId,
  projectName,
  progress = 0,
  className
}) => {
  // Determine project status based on progress
  const getProjectStatus = () => {
    if (progress < 20) return 'at-risk';
    if (progress < 50) return 'needs-attention';
    return 'on-track';
  };

  const getStatusIcon = () => {
    const status = getProjectStatus();
    switch (status) {
      case 'at-risk':
        return <Warning size={20} className="text-red-500" />;
      case 'needs-attention':
        return <Clock size={20} className="text-amber-500" />;
      case 'on-track':
        return <CheckCircle size={20} className="text-green-500" />;
      default:
        return null;
    }
  };

  const [insights, setInsights] = useState<{id: string; text: string; type: string}[]>([]);

  // Get insights from the strategic plan service
  useEffect(() => {
    // Get insights from the strategic plan
    const strategicInsights = strategicPlanService.getInsights(projectId);

    // Convert to the format needed for display
    const formattedInsights = strategicInsights.map((text, index) => ({
      id: (index + 1).toString(),
      text,
      type: index === 0 ? 'positive' : index === 1 ? 'warning' : 'info'
    }));

    // Add project-specific insights based on project ID
    if (projectId === 4) { // Trojan Mine Church
      formattedInsights.push({
        id: 'project-1',
        text: 'Foundation work completed ahead of schedule',
        type: 'positive'
      });
      formattedInsights.push({
        id: 'project-2',
        text: 'Wall construction should begin by March 15',
        type: 'warning'
      });
    } else if (projectId === 5) { // ZPCS Radio Station
      formattedInsights.push({
        id: 'project-1',
        text: 'Project is behind schedule by approximately 2 weeks',
        type: 'warning'
      });
      formattedInsights.push({
        id: 'project-2',
        text: '3 tasks are currently delayed and need attention',
        type: 'warning'
      });
    } else if (projectId === 1) { // Arundel Sabbath
      formattedInsights.push({
        id: 'project-1',
        text: 'Planning phase is 45% complete',
        type: 'info'
      });
      formattedInsights.push({
        id: 'project-2',
        text: 'Team meeting should be scheduled within 7 days',
        type: 'warning'
      });
    }

    setInsights(formattedInsights);
  }, [projectId]);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'positive':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'warning':
        return <Clock size={16} className="text-amber-500" />;
      case 'info':
        return <Lightning size={16} className="text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <Card className={`${className || ''}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <span className="mr-2">Project Insights</span>
            {getStatusIcon()}
          </CardTitle>
          <Button variant="ghost" size="sm" className="text-xs">
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1 text-sm">
            <span className="text-gray-600">Overall Progress</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="space-y-3 mt-4">
          {insights.map(insight => (
            <div key={insight.id} className="flex items-start gap-2">
              <div className="mt-0.5">
                {getInsightIcon(insight.type)}
              </div>
              <p className="text-sm text-gray-700">{insight.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            These insights are generated based on project data and patterns from similar projects.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectInsights;
