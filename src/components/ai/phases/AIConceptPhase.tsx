import React, { useState, useEffect } from 'react';
import {
  Lightbulb,
  Target,
  CheckCircle,
  PlusCircle,
  Trash,
  FileText,
  Upload,
  Download,
  Export
} from '@phosphor-icons/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import strategicPlanService from '@/services/StrategicPlanService';

interface AIConceptPhaseProps {
  projectId: number;
  projectName: string;
  phaseContent: any;
  onContentChange: (content: any) => void;
  onProgressUpdate: (progress: number) => void;
}

interface ConceptTask {
  id: string;
  title: string;
  isCompleted: boolean;
}

interface SmartGoal {
  id: string;
  title: string;
  specific: string;
  measurable: string;
  achievable: string;
  relevant: string;
  timeBound: string;
  isCompleted: boolean;
  progress: number;
}

const AIConceptPhase: React.FC<AIConceptPhaseProps> = ({
  projectId,
  projectName,
  phaseContent,
  onContentChange,
  onProgressUpdate
}) => {
  const [activeTab, setActiveTab] = useState<string>('problem');
  const [exportLoading, setExportLoading] = useState<boolean>(false);
  const [isConceptComplete, setIsConceptComplete] = useState<boolean>(false);
  const [showConceptNote, setShowConceptNote] = useState<boolean>(false);

  const [content, setContent] = useState<any>(phaseContent || {
    problem: {
      title: 'Problem Statement',
      content: '',
      tasks: []
    },
    idea: {
      title: 'Solution Concept',
      content: '',
      tasks: []
    },
    objectives: {
      title: 'SMART Objectives',
      content: '',
      goals: []
    }
  });

  // Initialize content if empty or ensure it has the required properties
  useEffect(() => {
    if (Object.keys(phaseContent || {}).length > 0) {
      // Make sure the content has the required properties
      const updatedContent = { ...phaseContent };

      // Ensure problem section has required properties
      if (!updatedContent.problem) {
        updatedContent.problem = { title: 'Problem Statement', content: '', tasks: [] };
      }

      // Ensure idea section has required properties
      if (!updatedContent.idea) {
        updatedContent.idea = { title: 'Solution Concept', content: '', tasks: [] };
      }

      // Ensure objectives section has required properties
      if (!updatedContent.objectives) {
        updatedContent.objectives = { title: 'SMART Objectives', content: '', goals: [] };
      }

      setContent(updatedContent);
    }
  }, [phaseContent]);

  // Calculate and update progress whenever content changes
  useEffect(() => {
    const calculateProgress = () => {
      let totalItems = 0;
      let completedItems = 0;

      // Count tasks
      Object.keys(content).forEach(sectionKey => {
        const section = content[sectionKey];
        if (section.tasks && Array.isArray(section.tasks)) {
          totalItems += section.tasks.length;
          completedItems += section.tasks.filter((task: ConceptTask) => task.isCompleted).length;
        }
      });

      // Count SMART goals
      if (content.objectives && content.objectives.goals) {
        totalItems += content.objectives.goals.length;
        completedItems += content.objectives.goals.filter((goal: SmartGoal) => goal.isCompleted).length;
      }

      // Count section content
      Object.keys(content).forEach(sectionKey => {
        const section = content[sectionKey];
        if (section.content) {
          totalItems += 1;
          completedItems += section.content.length > 10 ? 1 : 0;
        }
      });

      // Calculate percentage
      return totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
    };

    const progress = calculateProgress();
    onProgressUpdate(progress);

    // Check if concept is complete (has content in all sections and at least 70% progress)
    const isComplete =
      (content.problem?.content?.length > 10) &&
      (content.idea?.content?.length > 10) &&
      (content.objectives?.content?.length > 10) &&
      (content.objectives?.goals?.length > 0) &&
      (progress >= 70);

    setIsConceptComplete(isComplete);

    // Automatically show the concept note when complete
    if (isComplete && !showConceptNote) {
      setShowConceptNote(true);
    }
  }, [content, onProgressUpdate, showConceptNote]);

  // Update content and notify parent
  const updateContent = (newContent: any) => {
    setContent(newContent);
    onContentChange(newContent);
  };

  // Toggle task completion
  const toggleTaskCompletion = (sectionKey: string, taskId: string) => {
    const updatedContent = { ...content };
    const taskIndex = updatedContent[sectionKey].tasks.findIndex((t: ConceptTask) => t.id === taskId);

    if (taskIndex !== -1) {
      updatedContent[sectionKey].tasks[taskIndex].isCompleted = !updatedContent[sectionKey].tasks[taskIndex].isCompleted;
      updateContent(updatedContent);
    }
  };

  // Update task title
  const updateTaskTitle = (sectionKey: string, taskId: string, title: string) => {
    const updatedContent = { ...content };
    const taskIndex = updatedContent[sectionKey].tasks.findIndex((t: ConceptTask) => t.id === taskId);

    if (taskIndex !== -1) {
      updatedContent[sectionKey].tasks[taskIndex].title = title;
      updateContent(updatedContent);
    }
  };

  // Add a new task
  const addTask = (sectionKey: string) => {
    const updatedContent = { ...content };
    const newTask: ConceptTask = {
      id: `task-${Date.now()}`,
      title: 'New task',
      isCompleted: false
    };

    updatedContent[sectionKey].tasks.push(newTask);
    updateContent(updatedContent);
  };

  // Delete a task
  const deleteTask = (sectionKey: string, taskId: string) => {
    const updatedContent = { ...content };
    updatedContent[sectionKey].tasks = updatedContent[sectionKey].tasks.filter(
      (t: ConceptTask) => t.id !== taskId
    );
    updateContent(updatedContent);
  };

  // Update section content
  const updateSectionContent = (sectionKey: string, text: string) => {
    const updatedContent = { ...content };
    updatedContent[sectionKey].content = text;
    updateContent(updatedContent);
  };

  // Toggle SMART goal completion
  const toggleGoalCompletion = (goalId: string) => {
    const updatedContent = { ...content };
    const goalIndex = updatedContent.objectives.goals.findIndex((g: SmartGoal) => g.id === goalId);

    if (goalIndex !== -1) {
      updatedContent.objectives.goals[goalIndex].isCompleted = !updatedContent.objectives.goals[goalIndex].isCompleted;
      updateContent(updatedContent);
    }
  };

  // Update SMART goal
  const updateGoal = (goalId: string, field: string, value: string) => {
    const updatedContent = { ...content };
    const goalIndex = updatedContent.objectives.goals.findIndex((g: SmartGoal) => g.id === goalId);

    if (goalIndex !== -1) {
      updatedContent.objectives.goals[goalIndex][field] = value;
      updateContent(updatedContent);
    }
  };

  // Add a new SMART goal
  const addGoal = () => {
    const updatedContent = { ...content };
    const newGoal: SmartGoal = {
      id: `goal-${Date.now()}`,
      title: 'New Goal',
      specific: '',
      measurable: '',
      achievable: '',
      relevant: '',
      timeBound: '',
      isCompleted: false,
      progress: 0
    };

    if (!updatedContent.objectives.goals) {
      updatedContent.objectives.goals = [];
    }

    updatedContent.objectives.goals.push(newGoal);
    updateContent(updatedContent);
  };

  // Delete a SMART goal
  const deleteGoal = (goalId: string) => {
    const updatedContent = { ...content };
    updatedContent.objectives.goals = updatedContent.objectives.goals.filter(
      (g: SmartGoal) => g.id !== goalId
    );
    updateContent(updatedContent);
  };

  // Generate a formatted concept note programmatically
  const generateFormattedConceptNote = () => {
    // Get strategic plan information for context
    const strategicPlan = strategicPlanService.getStrategicPlan();

    // Format the concept note with proper sections and content
    const formattedNote = `
# ${projectName} - Concept Note
Date: ${new Date().toLocaleDateString()}

## 1. Executive Summary
This concept note outlines the project "${projectName}" which addresses ${content.problem?.content?.substring(0, 100)}...

## 2. Project Background
### Problem Statement
${content.problem?.content || "No problem statement provided yet"}

### Problem-Related Tasks
${content.problem?.tasks && content.problem.tasks.length > 0
  ? content.problem.tasks.map((t: ConceptTask) => `- ${t.title} (${t.isCompleted ? 'Completed' : 'Not completed'})`).join('\n')
  : "No problem-related tasks defined yet"}

## 3. Proposed Solution
### Solution Concept
${content.idea?.content || "No solution concept provided yet"}

### Solution-Related Tasks
${content.idea?.tasks && content.idea.tasks.length > 0
  ? content.idea.tasks.map((t: ConceptTask) => `- ${t.title} (${t.isCompleted ? 'Completed' : 'Not completed'})`).join('\n')
  : "No solution-related tasks defined yet"}

## 4. Strategic Alignment
This project aligns with the following organizational objectives:
- Vision: ${strategicPlan.vision}
- Mission: ${strategicPlan.mission}
- Strategic Objectives: ${strategicPlan.strategic_objectives.map(obj => obj.objective).join(', ')}

## 5. Project Objectives and Goals
### Objectives Overview
${content.objectives?.content || "No objectives overview provided yet"}

### SMART Goals
${content.objectives?.goals && content.objectives.goals.length > 0
  ? content.objectives.goals.map((g: SmartGoal) => `
#### ${g.title}
- Specific: ${g.specific || "Not specified"}
- Measurable: ${g.measurable || "Not specified"}
- Achievable: ${g.achievable || "Not specified"}
- Relevant: ${g.relevant || "Not specified"}
- Time-bound: ${g.timeBound || "Not specified"}
`).join('\n')
  : "No SMART goals defined yet"}

## 6. Implementation Considerations
Based on the tasks identified, the following implementation considerations should be addressed:
- Ensure all problem-related tasks are completed before moving to solution implementation
- Validate the solution concept against the problem statement
- Establish metrics for measuring progress against SMART goals

## 7. Next Steps
- Complete any remaining tasks in the concept development phase
- Move to feasibility study phase
- Develop detailed implementation plan
`;

    return formattedNote;
  };

  // Export concept note as a comprehensive document
  const exportConceptNote = () => {
    setExportLoading(true);

    try {
      // Generate the concept note
      const formattedConceptNote = generateFormattedConceptNote();

      // Create a blob and download it
      const blob = new Blob([formattedConceptNote], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${projectName.replace(/\s+/g, '_')}_Concept_Note.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Error exporting concept note:', error);
    } finally {
      setExportLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="problem" className="flex items-center gap-2">
              <Target size={16} />
              <span>Problem Statement</span>
            </TabsTrigger>
            <TabsTrigger value="idea" className="flex items-center gap-2">
              <Lightbulb size={16} />
              <span>Solution Concept</span>
            </TabsTrigger>
            <TabsTrigger value="objectives" className="flex items-center gap-2">
              <Target size={16} />
              <span>SMART Objectives</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={exportConceptNote}
            disabled={exportLoading || !isConceptComplete}
            className="flex items-center gap-1"
          >
            {exportLoading ? <span className="animate-pulse">...</span> : <Export size={14} />}
            <span>Export Concept Note</span>
          </Button>
        </div>
      </div>

      {/* Concept completion notification */}
      {isConceptComplete && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4 flex items-center">
          <CheckCircle size={18} className="text-green-600 mr-2" />
          <p className="text-sm text-green-800">
            Concept development is complete! Your concept note has been generated below.
          </p>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsContent value="problem">
          <Card>
            <CardHeader>
              <CardTitle>Problem Statement</CardTitle>
              <CardDescription>
                Define the problem or opportunity that this project addresses
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="problem-content" className="text-sm font-medium mb-2 block">
                  Problem Description
                </Label>
                <Textarea
                  id="problem-content"
                  placeholder="Describe the problem or opportunity..."
                  value={content.problem?.content || ''}
                  onChange={(e) => updateSectionContent('problem', e.target.value)}
                  className="min-h-[150px]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-medium">Tasks</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addTask('problem')}
                    className="h-8 text-xs"
                  >
                    <PlusCircle size={14} className="mr-1" />
                    Add Task
                  </Button>
                </div>

                <div className="space-y-2">
                  {content.problem?.tasks?.map((task: ConceptTask) => (
                    <div key={task.id} className="flex items-center gap-3 p-3 border rounded-lg">
                      <Checkbox
                        id={`task-${task.id}`}
                        checked={task.isCompleted}
                        onCheckedChange={() => toggleTaskCompletion('problem', task.id)}
                      />
                      <Input
                        value={task.title}
                        onChange={(e) => updateTaskTitle('problem', task.id, e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteTask('problem', task.id)}
                      >
                        <Trash size={16} />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">
                  Supporting Documents
                </Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload size={24} className="mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-500 mb-2">Upload supporting documents</p>
                  <Button size="sm" className="h-8 text-xs">
                    <Upload size={14} className="mr-1" />
                    Upload Files
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Solution Concept Tab */}
        <TabsContent value="idea">
          <Card>
            <CardHeader>
              <CardTitle>Solution Concept</CardTitle>
              <CardDescription>
                Outline your proposed solution or approach
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="idea-content" className="text-sm font-medium mb-2 block">
                  Solution Description
                </Label>
                <Textarea
                  id="idea-content"
                  placeholder="Describe your solution concept..."
                  value={content.idea?.content || ''}
                  onChange={(e) => updateSectionContent('idea', e.target.value)}
                  className="min-h-[150px]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-medium">Tasks</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addTask('idea')}
                    className="h-8 text-xs"
                  >
                    <PlusCircle size={14} className="mr-1" />
                    Add Task
                  </Button>
                </div>

                <div className="space-y-2">
                  {content.idea?.tasks?.map((task: ConceptTask) => (
                    <div key={task.id} className="flex items-center gap-3 p-3 border rounded-lg">
                      <Checkbox
                        id={`task-${task.id}`}
                        checked={task.isCompleted}
                        onCheckedChange={() => toggleTaskCompletion('idea', task.id)}
                      />
                      <Input
                        value={task.title}
                        onChange={(e) => updateTaskTitle('idea', task.id, e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteTask('idea', task.id)}
                      >
                        <Trash size={16} />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SMART Objectives Tab */}
        <TabsContent value="objectives">
          <Card>
            <CardHeader>
              <CardTitle>SMART Objectives</CardTitle>
              <CardDescription>
                Define Specific, Measurable, Achievable, Relevant, Time-bound goals
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="objectives-content" className="text-sm font-medium mb-2 block">
                  Objectives Overview
                </Label>
                <Textarea
                  id="objectives-content"
                  placeholder="Provide an overview of your objectives..."
                  value={content.objectives?.content || ''}
                  onChange={(e) => updateSectionContent('objectives', e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <Label className="text-sm font-medium">SMART Goals</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addGoal}
                    className="h-8 text-xs"
                  >
                    <PlusCircle size={14} className="mr-1" />
                    Add Goal
                  </Button>
                </div>

                <div className="space-y-6">
                  {content.objectives?.goals?.map((goal: SmartGoal) => (
                    <div key={goal.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Checkbox
                            id={`goal-${goal.id}`}
                            checked={goal.isCompleted}
                            onCheckedChange={() => toggleGoalCompletion(goal.id)}
                          />
                          <Input
                            value={goal.title}
                            onChange={(e) => updateGoal(goal.id, 'title', e.target.value)}
                            className="font-medium"
                            placeholder="Goal title"
                          />
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteGoal(goal.id)}
                        >
                          <Trash size={16} />
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-xs font-medium mb-1 block">Specific</Label>
                          <Textarea
                            value={goal.specific}
                            onChange={(e) => updateGoal(goal.id, 'specific', e.target.value)}
                            placeholder="What exactly will be accomplished?"
                            className="text-sm min-h-[80px]"
                          />
                        </div>
                        <div>
                          <Label className="text-xs font-medium mb-1 block">Measurable</Label>
                          <Textarea
                            value={goal.measurable}
                            onChange={(e) => updateGoal(goal.id, 'measurable', e.target.value)}
                            placeholder="How will progress be measured?"
                            className="text-sm min-h-[80px]"
                          />
                        </div>
                        <div>
                          <Label className="text-xs font-medium mb-1 block">Achievable</Label>
                          <Textarea
                            value={goal.achievable}
                            onChange={(e) => updateGoal(goal.id, 'achievable', e.target.value)}
                            placeholder="Is this realistic with available resources?"
                            className="text-sm min-h-[80px]"
                          />
                        </div>
                        <div>
                          <Label className="text-xs font-medium mb-1 block">Relevant</Label>
                          <Textarea
                            value={goal.relevant}
                            onChange={(e) => updateGoal(goal.id, 'relevant', e.target.value)}
                            placeholder="How does this align with broader objectives?"
                            className="text-sm min-h-[80px]"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label className="text-xs font-medium mb-1 block">Time-bound</Label>
                          <Textarea
                            value={goal.timeBound}
                            onChange={(e) => updateGoal(goal.id, 'timeBound', e.target.value)}
                            placeholder="What is the deadline or timeframe?"
                            className="text-sm min-h-[80px]"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Concept Note Preview - shown when concept is complete */}
              {isConceptComplete && showConceptNote && (
                <div className="mt-8 border-t pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Concept Note</h3>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="prose prose-sm max-w-none whitespace-pre-line">
                      {generateFormattedConceptNote()}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIConceptPhase;