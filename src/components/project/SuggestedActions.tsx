import React, { useEffect, useState } from 'react';
import { ArrowRight, Warning, CheckCircle, Clock } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';
import { projects } from '@/data/projectData';
import strategicPlanService from '@/services/StrategicPlanService';

interface Action {
  id: string;
  text: string;
  type: 'warning' | 'success' | 'info';
  link?: string;
  onClick?: () => void;
}

interface SuggestedActionsProps {
  className?: string;
}

const SuggestedActions: React.FC<SuggestedActionsProps> = ({ className }) => {
  const [suggestedActions, setSuggestedActions] = useState<Action[]>([]);

  // Generate actions based on strategic plan and project data
  useEffect(() => {
    // Get strategic plan insights
    const strategicInsights = strategicPlanService.getInsights();

    // Default actions
    const defaultActions: Action[] = [
      {
        id: '1',
        text: 'Review ZPCS Radio Station timeline - 3 tasks delayed',
        type: 'warning',
        link: '/project/5'
      },
      {
        id: '2',
        text: 'Approve Trojan Mine foundation completion report',
        type: 'success',
        link: '/project/4'
      },
      {
        id: '3',
        text: 'Schedule team meeting for Arundel Sabbath planning',
        type: 'info',
        link: '/project/1'
      }
    ];

    // Add strategic plan-based actions
    if (strategicInsights.length > 0) {
      const strategicActions = strategicInsights.slice(0, 2).map((insight, index) => ({
        id: `strategic-${index + 1}`,
        text: insight,
        type: index === 0 ? 'info' : 'success',
        link: '/vision-mission'
      }));

      // Combine default and strategic actions
      setSuggestedActions([...defaultActions, ...strategicActions]);
    } else {
      setSuggestedActions(defaultActions);
    }
  }, []);

  // Get project status summary
  const getProjectSummary = () => {
    const onTrack = projects.filter(p => p.progress && p.progress >= 30).length;
    const atRisk = projects.filter(p => p.progress && p.progress < 20).length;
    const needsAction = projects.filter(p => p.progress && p.progress >= 20 && p.progress < 30).length;

    return { onTrack, atRisk, needsAction };
  };

  const summary = getProjectSummary();

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <Warning size={18} className="text-amber-500" />;
      case 'success':
        return <CheckCircle size={18} className="text-green-500" />;
      case 'info':
        return <Clock size={18} className="text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <div className={`${className || ''}`}>
      {/* Project Overview Banner */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-100">
        <h2 className="font-semibold text-gray-800 mb-2">Project Overview</h2>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
            <span className="text-gray-700">{summary.onTrack} projects on track</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-amber-500 mr-2"></div>
            <span className="text-gray-700">{summary.atRisk} at risk</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
            <span className="text-gray-700">{summary.needsAction} need action</span>
          </div>
        </div>
      </div>

      {/* Suggested Actions */}
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
        <h2 className="font-semibold text-gray-800 mb-3">Suggested Actions</h2>
        <div className="space-y-3">
          {suggestedActions.map(action => (
            <Link
              key={action.id}
              to={action.link || '#'}
              className="flex items-center p-3 hover:bg-gray-50 rounded-md transition-colors border border-gray-100"
              onClick={action.onClick}
            >
              <div className="mr-3">
                {getActionIcon(action.type)}
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-800">{action.text}</p>
              </div>
              <ArrowRight size={16} className="text-gray-400" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SuggestedActions;
