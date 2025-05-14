import React, { useState, useEffect } from 'react';
import { 
  MagnifyingGlass, 
  Users, 
  Gear, 
  CurrencyCircleDollar, 
  Warning,
  CheckCircle, 
  PlusCircle, 
  Trash, 
  FileText, 
  Upload, 
  Download 
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

interface AIFeasibilityPhaseProps {
  projectId: number;
  projectName: string;
  phaseContent: any;
  onContentChange: (content: any) => void;
  onProgressUpdate: (progress: number) => void;
}

interface FeasibilityTask {
  id: string;
  title: string;
  isCompleted: boolean;
}

interface Risk {
  id: string;
  title: string;
  impact: 'low' | 'medium' | 'high';
  probability: 'low' | 'medium' | 'high';
  mitigation: string;
}

const AIFeasibilityPhase: React.FC<AIFeasibilityPhaseProps> = ({
  projectId,
  projectName,
  phaseContent,
  onContentChange,
  onProgressUpdate
}) => {
  const [activeTab, setActiveTab] = useState<string>('market');
  const [content, setContent] = useState<any>(phaseContent || {
    market: {
      title: 'Market Analysis',
      content: '',
      tasks: []
    },
    technical: {
      title: 'Technical Feasibility',
      content: '',
      tasks: []
    },
    financial: {
      title: 'Financial Analysis',
      content: '',
      tasks: [],
      budget: {
        total: 0,
        items: []
      }
    },
    risk: {
      title: 'Risk Assessment',
      content: '',
      tasks: [],
      risks: []
    }
  });

  // Initialize content if empty
  useEffect(() => {
    if (Object.keys(phaseContent || {}).length > 0) {
      setContent(phaseContent);
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
          completedItems += section.tasks.filter((task: FeasibilityTask) => task.isCompleted).length;
        }
      });
      
      // Count section content
      Object.keys(content).forEach(sectionKey => {
        const section = content[sectionKey];
        if (section.content) {
          totalItems += 1;
          completedItems += section.content.length > 10 ? 1 : 0;
        }
      });
      
      // Count budget items
      if (content.financial?.budget?.items) {
        totalItems += content.financial.budget.items.length > 0 ? 1 : 0;
        completedItems += content.financial.budget.items.length > 0 ? 1 : 0;
      }
      
      // Count risks
      if (content.risk?.risks) {
        totalItems += content.risk.risks.length > 0 ? 1 : 0;
        completedItems += content.risk.risks.length > 0 ? 1 : 0;
      }
      
      // Calculate percentage
      return totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
    };
    
    const progress = calculateProgress();
    onProgressUpdate(progress);
  }, [content, onProgressUpdate]);

  // Update content and notify parent
  const updateContent = (newContent: any) => {
    setContent(newContent);
    onContentChange(newContent);
  };

  // Toggle task completion
  const toggleTaskCompletion = (sectionKey: string, taskId: string) => {
    const updatedContent = { ...content };
    const taskIndex = updatedContent[sectionKey].tasks.findIndex((t: FeasibilityTask) => t.id === taskId);
    
    if (taskIndex !== -1) {
      updatedContent[sectionKey].tasks[taskIndex].isCompleted = !updatedContent[sectionKey].tasks[taskIndex].isCompleted;
      updateContent(updatedContent);
    }
  };

  // Update task title
  const updateTaskTitle = (sectionKey: string, taskId: string, title: string) => {
    const updatedContent = { ...content };
    const taskIndex = updatedContent[sectionKey].tasks.findIndex((t: FeasibilityTask) => t.id === taskId);
    
    if (taskIndex !== -1) {
      updatedContent[sectionKey].tasks[taskIndex].title = title;
      updateContent(updatedContent);
    }
  };

  // Add a new task
  const addTask = (sectionKey: string) => {
    const updatedContent = { ...content };
    const newTask: FeasibilityTask = {
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
      (t: FeasibilityTask) => t.id !== taskId
    );
    updateContent(updatedContent);
  };

  // Update section content
  const updateSectionContent = (sectionKey: string, text: string) => {
    const updatedContent = { ...content };
    updatedContent[sectionKey].content = text;
    updateContent(updatedContent);
  };

  // Add a budget item
  const addBudgetItem = () => {
    const updatedContent = { ...content };
    
    if (!updatedContent.financial.budget) {
      updatedContent.financial.budget = { total: 0, items: [] };
    }
    
    const newItem = {
      id: `budget-${Date.now()}`,
      description: 'New budget item',
      amount: 0
    };
    
    updatedContent.financial.budget.items.push(newItem);
    updateContent(updatedContent);
  };

  // Update budget item
  const updateBudgetItem = (itemId: string, field: string, value: any) => {
    const updatedContent = { ...content };
    const itemIndex = updatedContent.financial.budget.items.findIndex((item: any) => item.id === itemId);
    
    if (itemIndex !== -1) {
      updatedContent.financial.budget.items[itemIndex][field] = value;
      
      // Recalculate total
      updatedContent.financial.budget.total = updatedContent.financial.budget.items.reduce(
        (sum: number, item: any) => sum + (parseFloat(item.amount) || 0),
        0
      );
      
      updateContent(updatedContent);
    }
  };

  // Delete budget item
  const deleteBudgetItem = (itemId: string) => {
    const updatedContent = { ...content };
    updatedContent.financial.budget.items = updatedContent.financial.budget.items.filter(
      (item: any) => item.id !== itemId
    );
    
    // Recalculate total
    updatedContent.financial.budget.total = updatedContent.financial.budget.items.reduce(
      (sum: number, item: any) => sum + (parseFloat(item.amount) || 0),
      0
    );
    
    updateContent(updatedContent);
  };

  // Add a risk
  const addRisk = () => {
    const updatedContent = { ...content };
    
    if (!updatedContent.risk.risks) {
      updatedContent.risk.risks = [];
    }
    
    const newRisk: Risk = {
      id: `risk-${Date.now()}`,
      title: 'New risk',
      impact: 'medium',
      probability: 'medium',
      mitigation: ''
    };
    
    updatedContent.risk.risks.push(newRisk);
    updateContent(updatedContent);
  };

  // Update risk
  const updateRisk = (riskId: string, field: string, value: any) => {
    const updatedContent = { ...content };
    const riskIndex = updatedContent.risk.risks.findIndex((risk: Risk) => risk.id === riskId);
    
    if (riskIndex !== -1) {
      updatedContent.risk.risks[riskIndex][field] = value;
      updateContent(updatedContent);
    }
  };

  // Delete risk
  const deleteRisk = (riskId: string) => {
    const updatedContent = { ...content };
    updatedContent.risk.risks = updatedContent.risk.risks.filter(
      (risk: Risk) => risk.id !== riskId
    );
    updateContent(updatedContent);
  };

  // Get impact/probability color
  const getSeverityColor = (level: 'low' | 'medium' | 'high'): string => {
    switch (level) {
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="market" className="flex items-center gap-2">
            <Users size={16} />
            <span>Market Analysis</span>
          </TabsTrigger>
          <TabsTrigger value="technical" className="flex items-center gap-2">
            <Gear size={16} />
            <span>Technical Feasibility</span>
          </TabsTrigger>
          <TabsTrigger value="financial" className="flex items-center gap-2">
            <CurrencyCircleDollar size={16} />
            <span>Financial Analysis</span>
          </TabsTrigger>
          <TabsTrigger value="risk" className="flex items-center gap-2">
            <Warning size={16} />
            <span>Risk Assessment</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Market Analysis Tab */}
        <TabsContent value="market">
          <Card>
            <CardHeader>
              <CardTitle>Market Analysis</CardTitle>
              <CardDescription>
                Analyze the target audience, stakeholders, and potential reach
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="market-content" className="text-sm font-medium mb-2 block">
                  Market Analysis
                </Label>
                <Textarea
                  id="market-content"
                  placeholder="Describe the target audience, stakeholders, and potential reach..."
                  value={content.market?.content || ''}
                  onChange={(e) => updateSectionContent('market', e.target.value)}
                  className="min-h-[150px]"
                />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-medium">Tasks</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addTask('market')}
                    className="h-8 text-xs"
                  >
                    <PlusCircle size={14} className="mr-1" />
                    Add Task
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {content.market?.tasks?.map((task: FeasibilityTask) => (
                    <div key={task.id} className="flex items-center gap-3 p-3 border rounded-lg">
                      <Checkbox
                        id={`task-${task.id}`}
                        checked={task.isCompleted}
                        onCheckedChange={() => toggleTaskCompletion('market', task.id)}
                      />
                      <Input
                        value={task.title}
                        onChange={(e) => updateTaskTitle('market', task.id, e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteTask('market', task.id)}
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
        
        {/* Technical Feasibility Tab */}
        <TabsContent value="technical">
          <Card>
            <CardHeader>
              <CardTitle>Technical Feasibility</CardTitle>
              <CardDescription>
                Assess technical requirements, resources, and capabilities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="technical-content" className="text-sm font-medium mb-2 block">
                  Technical Assessment
                </Label>
                <Textarea
                  id="technical-content"
                  placeholder="Describe the technical requirements, resources, and capabilities needed..."
                  value={content.technical?.content || ''}
                  onChange={(e) => updateSectionContent('technical', e.target.value)}
                  className="min-h-[150px]"
                />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-medium">Tasks</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addTask('technical')}
                    className="h-8 text-xs"
                  >
                    <PlusCircle size={14} className="mr-1" />
                    Add Task
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {content.technical?.tasks?.map((task: FeasibilityTask) => (
                    <div key={task.id} className="flex items-center gap-3 p-3 border rounded-lg">
                      <Checkbox
                        id={`task-${task.id}`}
                        checked={task.isCompleted}
                        onCheckedChange={() => toggleTaskCompletion('technical', task.id)}
                      />
                      <Input
                        value={task.title}
                        onChange={(e) => updateTaskTitle('technical', task.id, e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteTask('technical', task.id)}
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
        
        {/* Financial Analysis Tab */}
        <TabsContent value="financial">
          <Card>
            <CardHeader>
              <CardTitle>Financial Analysis</CardTitle>
              <CardDescription>
                Develop budget, funding sources, and financial projections
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="financial-content" className="text-sm font-medium mb-2 block">
                  Financial Overview
                </Label>
                <Textarea
                  id="financial-content"
                  placeholder="Provide an overview of the financial aspects of the project..."
                  value={content.financial?.content || ''}
                  onChange={(e) => updateSectionContent('financial', e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Label className="text-sm font-medium">Budget</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addBudgetItem}
                    className="h-8 text-xs"
                  >
                    <PlusCircle size={14} className="mr-1" />
                    Add Budget Item
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {content.financial?.budget?.items?.map((item: any) => (
                    <div key={item.id} className="flex items-center gap-3 p-3 border rounded-lg">
                      <Input
                        value={item.description}
                        onChange={(e) => updateBudgetItem(item.id, 'description', e.target.value)}
                        className="flex-1"
                        placeholder="Item description"
                      />
                      <div className="w-32 flex items-center">
                        <span className="mr-2">$</span>
                        <Input
                          type="number"
                          value={item.amount}
                          onChange={(e) => updateBudgetItem(item.id, 'amount', e.target.value)}
                          className="flex-1"
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteBudgetItem(item.id)}
                      >
                        <Trash size={16} />
                      </Button>
                    </div>
                  ))}
                  
                  {content.financial?.budget?.items?.length > 0 && (
                    <div className="flex justify-end p-3 border-t">
                      <div className="font-medium">Total: ${content.financial?.budget?.total || 0}</div>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-medium">Tasks</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addTask('financial')}
                    className="h-8 text-xs"
                  >
                    <PlusCircle size={14} className="mr-1" />
                    Add Task
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {content.financial?.tasks?.map((task: FeasibilityTask) => (
                    <div key={task.id} className="flex items-center gap-3 p-3 border rounded-lg">
                      <Checkbox
                        id={`task-${task.id}`}
                        checked={task.isCompleted}
                        onCheckedChange={() => toggleTaskCompletion('financial', task.id)}
                      />
                      <Input
                        value={task.title}
                        onChange={(e) => updateTaskTitle('financial', task.id, e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteTask('financial', task.id)}
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
        
        {/* Risk Assessment Tab */}
        <TabsContent value="risk">
          <Card>
            <CardHeader>
              <CardTitle>Risk Assessment</CardTitle>
              <CardDescription>
                Identify potential risks and develop mitigation strategies
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="risk-content" className="text-sm font-medium mb-2 block">
                  Risk Overview
                </Label>
                <Textarea
                  id="risk-content"
                  placeholder="Provide an overview of the project risks..."
                  value={content.risk?.content || ''}
                  onChange={(e) => updateSectionContent('risk', e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Label className="text-sm font-medium">Risk Register</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addRisk}
                    className="h-8 text-xs"
                  >
                    <PlusCircle size={14} className="mr-1" />
                    Add Risk
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {content.risk?.risks?.map((risk: Risk) => (
                    <div key={risk.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <Input
                          value={risk.title}
                          onChange={(e) => updateRisk(risk.id, 'title', e.target.value)}
                          className="font-medium flex-1 mr-2"
                          placeholder="Risk title"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteRisk(risk.id)}
                        >
                          <Trash size={16} />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <Label className="text-xs font-medium mb-1 block">Impact</Label>
                          <div className="flex gap-2">
                            {['low', 'medium', 'high'].map((level) => (
                              <button
                                key={level}
                                type="button"
                                className={cn(
                                  "flex-1 py-1 px-2 text-xs rounded border",
                                  risk.impact === level ? getSeverityColor(level as any) : "bg-gray-50 text-gray-700 border-gray-200"
                                )}
                                onClick={() => updateRisk(risk.id, 'impact', level)}
                              >
                                {level.charAt(0).toUpperCase() + level.slice(1)}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <Label className="text-xs font-medium mb-1 block">Probability</Label>
                          <div className="flex gap-2">
                            {['low', 'medium', 'high'].map((level) => (
                              <button
                                key={level}
                                type="button"
                                className={cn(
                                  "flex-1 py-1 px-2 text-xs rounded border",
                                  risk.probability === level ? getSeverityColor(level as any) : "bg-gray-50 text-gray-700 border-gray-200"
                                )}
                                onClick={() => updateRisk(risk.id, 'probability', level)}
                              >
                                {level.charAt(0).toUpperCase() + level.slice(1)}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <Label className="text-xs font-medium mb-1 block">Mitigation Strategy</Label>
                        <Textarea
                          value={risk.mitigation}
                          onChange={(e) => updateRisk(risk.id, 'mitigation', e.target.value)}
                          placeholder="How will this risk be mitigated?"
                          className="text-sm min-h-[80px]"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-medium">Tasks</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addTask('risk')}
                    className="h-8 text-xs"
                  >
                    <PlusCircle size={14} className="mr-1" />
                    Add Task
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {content.risk?.tasks?.map((task: FeasibilityTask) => (
                    <div key={task.id} className="flex items-center gap-3 p-3 border rounded-lg">
                      <Checkbox
                        id={`task-${task.id}`}
                        checked={task.isCompleted}
                        onCheckedChange={() => toggleTaskCompletion('risk', task.id)}
                      />
                      <Input
                        value={task.title}
                        onChange={(e) => updateTaskTitle('risk', task.id, e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteTask('risk', task.id)}
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
      </Tabs>
    </div>
  );
};

export default AIFeasibilityPhase;
