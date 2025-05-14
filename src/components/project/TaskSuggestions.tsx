import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from '@phosphor-icons/react';

interface TaskSuggestion {
  title: string;
  dueDate?: string;
  assignee?: string;
}

interface TaskSuggestionsProps {
  projectId: number;
  projectName: string;
  phase: string;
  onAddTask: (task: TaskSuggestion) => void;
  className?: string;
}

const TaskSuggestions: React.FC<TaskSuggestionsProps> = ({
  projectId,
  projectName,
  phase,
  onAddTask,
  className
}) => {
  // Predefined task suggestions based on phase
  const getSuggestedTasks = (): TaskSuggestion[] => {
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    const nextMonth = new Date(today);
    nextMonth.setDate(today.getDate() + 30);
    
    const formatDate = (date: Date) => date.toISOString().split('T')[0];
    
    switch (phase) {
      case 'concept':
        return [
          { title: 'Conduct stakeholder interviews', dueDate: formatDate(nextWeek), assignee: 'Project Manager' },
          { title: 'Research similar projects', dueDate: formatDate(nextWeek), assignee: 'Research Team' },
          { title: 'Draft initial concept document', dueDate: formatDate(nextMonth), assignee: 'Project Lead' }
        ];
      case 'feasibility':
        return [
          { title: 'Conduct market analysis', dueDate: formatDate(nextWeek), assignee: 'Market Analyst' },
          { title: 'Prepare financial projections', dueDate: formatDate(nextMonth), assignee: 'Finance Officer' },
          { title: 'Assess technical requirements', dueDate: formatDate(nextWeek), assignee: 'Technical Lead' }
        ];
      case 'planning':
        return [
          { title: 'Create project timeline', dueDate: formatDate(nextWeek), assignee: 'Project Manager' },
          { title: 'Develop budget breakdown', dueDate: formatDate(nextWeek), assignee: 'Finance Officer' },
          { title: 'Assign team responsibilities', dueDate: formatDate(today), assignee: 'Project Lead' }
        ];
      case 'implementation':
        return [
          { title: 'Schedule kickoff meeting', dueDate: formatDate(today), assignee: 'Project Manager' },
          { title: 'Set up project tracking system', dueDate: formatDate(nextWeek), assignee: 'Project Coordinator' },
          { title: 'Prepare implementation site', dueDate: formatDate(nextWeek), assignee: 'Site Manager' }
        ];
      case 'monitoring':
        return [
          { title: 'Create monitoring framework', dueDate: formatDate(nextWeek), assignee: 'M&E Officer' },
          { title: 'Schedule regular progress reviews', dueDate: formatDate(today), assignee: 'Project Manager' },
          { title: 'Set up data collection tools', dueDate: formatDate(nextWeek), assignee: 'Data Analyst' }
        ];
      case 'reporting':
        return [
          { title: 'Collect final project metrics', dueDate: formatDate(nextWeek), assignee: 'M&E Officer' },
          { title: 'Draft final report', dueDate: formatDate(nextMonth), assignee: 'Project Manager' },
          { title: 'Prepare presentation for stakeholders', dueDate: formatDate(nextMonth), assignee: 'Communications Officer' }
        ];
      default:
        return [
          { title: 'Define project scope', dueDate: formatDate(nextWeek), assignee: 'Project Manager' },
          { title: 'Identify key stakeholders', dueDate: formatDate(today), assignee: 'Project Lead' },
          { title: 'Set project objectives', dueDate: formatDate(nextWeek), assignee: 'Project Team' }
        ];
    }
  };

  const suggestedTasks = getSuggestedTasks();

  return (
    <Card className={`${className || ''}`}>
      <CardContent className="p-4">
        <h3 className="text-sm font-medium mb-3">Suggested Tasks</h3>
        <div className="space-y-2">
          {suggestedTasks.map((task, index) => (
            <div key={index} className="flex items-center justify-between p-2 border rounded-md hover:bg-gray-50">
              <div>
                <p className="text-sm font-medium">{task.title}</p>
                <div className="flex gap-4 mt-1">
                  {task.dueDate && (
                    <p className="text-xs text-gray-500">Due: {task.dueDate}</p>
                  )}
                  {task.assignee && (
                    <p className="text-xs text-gray-500">Assignee: {task.assignee}</p>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onAddTask(task)}
                className="h-8"
              >
                <PlusCircle size={14} className="mr-1" />
                Add
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskSuggestions;
