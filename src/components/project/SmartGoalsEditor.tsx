import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Target, 
  CheckCircle, 
  PlusCircle, 
  Trash, 
  Calendar, 
  ChartBar, 
  CheckSquare, 
  Clock,
  ArrowsClockwise
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export interface SmartGoal {
  id: string;
  title: string;
  specific: string;
  measurable: string;
  achievable: string;
  relevant: string;
  timeBound: string;
  isCompleted: boolean;
  dueDate?: string;
  progress: number;
}

interface SmartGoalsEditorProps {
  goals: SmartGoal[];
  onChange: (goals: SmartGoal[]) => void;
}

const SmartGoalsEditor = ({ goals, onChange }: SmartGoalsEditorProps) => {
  const [activeGoalId, setActiveGoalId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("specific");
  
  // Set first goal as active by default if none is selected
  useEffect(() => {
    if (goals.length > 0 && !activeGoalId) {
      setActiveGoalId(goals[0].id);
    }
  }, [goals, activeGoalId]);
  
  // Get the active goal
  const activeGoal = activeGoalId ? goals.find(goal => goal.id === activeGoalId) : null;
  
  // Add a new goal
  const addGoal = () => {
    const newGoal: SmartGoal = {
      id: `goal-${Date.now()}`,
      title: "New Goal",
      specific: "",
      measurable: "",
      achievable: "",
      relevant: "",
      timeBound: "",
      isCompleted: false,
      progress: 0
    };
    
    const updatedGoals = [...goals, newGoal];
    onChange(updatedGoals);
    setActiveGoalId(newGoal.id);
  };
  
  // Delete a goal
  const deleteGoal = (goalId: string) => {
    const updatedGoals = goals.filter(goal => goal.id !== goalId);
    onChange(updatedGoals);
    
    // If the active goal is deleted, set the first goal as active
    if (activeGoalId === goalId && updatedGoals.length > 0) {
      setActiveGoalId(updatedGoals[0].id);
    } else if (updatedGoals.length === 0) {
      setActiveGoalId(null);
    }
  };
  
  // Update goal title
  const updateGoalTitle = (goalId: string, title: string) => {
    const updatedGoals = goals.map(goal => 
      goal.id === goalId ? { ...goal, title } : goal
    );
    onChange(updatedGoals);
  };
  
  // Update goal property
  const updateGoalProperty = (goalId: string, property: keyof SmartGoal, value: string | number | boolean) => {
    const updatedGoals = goals.map(goal => 
      goal.id === goalId ? { ...goal, [property]: value } : goal
    );
    onChange(updatedGoals);
  };
  
  // Calculate goal completeness
  const calculateGoalCompleteness = (goal: SmartGoal): number => {
    let completeness = 0;
    let totalFields = 5; // S.M.A.R.T fields
    
    if (goal.specific) completeness++;
    if (goal.measurable) completeness++;
    if (goal.achievable) completeness++;
    if (goal.relevant) completeness++;
    if (goal.timeBound) completeness++;
    
    return Math.round((completeness / totalFields) * 100);
  };
  
  // Update goal progress based on SMART fields
  useEffect(() => {
    if (activeGoal) {
      const progress = calculateGoalCompleteness(activeGoal);
      if (progress !== activeGoal.progress) {
        updateGoalProperty(activeGoal.id, "progress", progress);
      }
    }
  }, [activeGoal]);
  
  // Get the next incomplete tab
  const getNextIncompleteTab = (goal: SmartGoal): string => {
    if (!goal.specific) return "specific";
    if (!goal.measurable) return "measurable";
    if (!goal.achievable) return "achievable";
    if (!goal.relevant) return "relevant";
    if (!goal.timeBound) return "timeBound";
    return "specific";
  };
  
  // Move to the next tab
  const moveToNextTab = () => {
    if (!activeGoal) return;
    
    const tabs = ["specific", "measurable", "achievable", "relevant", "timeBound"];
    const currentIndex = tabs.indexOf(activeTab);
    const nextIndex = (currentIndex + 1) % tabs.length;
    setActiveTab(tabs[nextIndex]);
  };
  
  // Move to the next incomplete tab
  const moveToNextIncompleteTab = () => {
    if (!activeGoal) return;
    
    const nextTab = getNextIncompleteTab(activeGoal);
    setActiveTab(nextTab);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">SMART Goals</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={addGoal}
          className="h-8"
        >
          <PlusCircle size={16} className="mr-2" />
          Add Goal
        </Button>
      </div>
      
      {goals.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            <Target size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 mb-4">No SMART goals defined yet</p>
            <Button onClick={addGoal}>
              <PlusCircle size={16} className="mr-2" />
              Add Your First Goal
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Goals List */}
          <div className="space-y-2">
            {goals.map(goal => (
              <div 
                key={goal.id}
                className={cn(
                  "p-3 border rounded-lg cursor-pointer transition-all",
                  activeGoalId === goal.id ? "border-primary-500 bg-primary-50" : "hover:bg-gray-50",
                  goal.isCompleted ? "border-green-200 bg-green-50" : ""
                )}
                onClick={() => setActiveGoalId(goal.id)}
              >
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center",
                    goal.isCompleted ? "bg-green-100 text-green-600" : "bg-primary-100 text-primary-500"
                  )}>
                    {goal.isCompleted ? <CheckCircle size={16} weight="fill" /> : <Target size={16} />}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium">{goal.title}</h3>
                    <div className="flex items-center justify-between mt-1">
                      <div className="w-full pr-6">
                        <div className="flex justify-between items-center text-xs text-gray-500 mb-1">
                          <span>Completeness</span>
                          <span>{goal.progress}%</span>
                        </div>
                        <Progress value={goal.progress} className="h-1" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Goal Editor */}
          <div className="md:col-span-2">
            {activeGoal ? (
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center",
                        activeGoal.isCompleted ? "bg-green-100 text-green-600" : "bg-primary-100 text-primary-500"
                      )}>
                        {activeGoal.isCompleted ? <CheckCircle size={20} weight="fill" /> : <Target size={20} />}
                      </div>
                      <Input
                        value={activeGoal.title}
                        onChange={(e) => updateGoalTitle(activeGoal.id, e.target.value)}
                        className="font-medium border-0 focus-visible:ring-0 p-0 text-lg h-auto"
                        placeholder="Goal Title"
                      />
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => deleteGoal(activeGoal.id)}
                      className="h-8 w-8 text-gray-500 hover:text-red-500"
                    >
                      <Trash size={16} />
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="due-date" className="text-xs text-gray-500">Due Date</Label>
                      <div className="flex items-center gap-1">
                        <Calendar size={14} className="text-gray-500" />
                        <Input
                          id="due-date"
                          type="date"
                          value={activeGoal.dueDate || ''}
                          onChange={(e) => updateGoalProperty(activeGoal.id, "dueDate", e.target.value)}
                          className="h-7 text-xs w-auto"
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Label htmlFor="goal-completed" className="text-xs text-gray-500">Mark as Complete</Label>
                      <Button
                        variant={activeGoal.isCompleted ? "default" : "outline"}
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => updateGoalProperty(activeGoal.id, "isCompleted", !activeGoal.isCompleted)}
                      >
                        {activeGoal.isCompleted ? (
                          <><CheckSquare size={14} className="mr-1" /> Completed</>
                        ) : (
                          <><CheckSquare size={14} className="mr-1" /> Mark Complete</>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid grid-cols-5 mb-4">
                      <TabsTrigger value="specific" className="text-xs">
                        <Badge variant={activeGoal.specific ? "default" : "outline"} className="mr-1 h-4 w-4 p-0">S</Badge>
                        Specific
                      </TabsTrigger>
                      <TabsTrigger value="measurable" className="text-xs">
                        <Badge variant={activeGoal.measurable ? "default" : "outline"} className="mr-1 h-4 w-4 p-0">M</Badge>
                        Measurable
                      </TabsTrigger>
                      <TabsTrigger value="achievable" className="text-xs">
                        <Badge variant={activeGoal.achievable ? "default" : "outline"} className="mr-1 h-4 w-4 p-0">A</Badge>
                        Achievable
                      </TabsTrigger>
                      <TabsTrigger value="relevant" className="text-xs">
                        <Badge variant={activeGoal.relevant ? "default" : "outline"} className="mr-1 h-4 w-4 p-0">R</Badge>
                        Relevant
                      </TabsTrigger>
                      <TabsTrigger value="timeBound" className="text-xs">
                        <Badge variant={activeGoal.timeBound ? "default" : "outline"} className="mr-1 h-4 w-4 p-0">T</Badge>
                        Time-bound
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="specific">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Target size={16} className="text-primary-500" />
                          <h4 className="text-sm font-medium">Specific</h4>
                        </div>
                        <p className="text-xs text-gray-500">
                          What exactly do you want to achieve? Be clear and detailed about the goal.
                        </p>
                        <Textarea
                          value={activeGoal.specific}
                          onChange={(e) => updateGoalProperty(activeGoal.id, "specific", e.target.value)}
                          placeholder="Describe your specific goal..."
                          className="min-h-[120px]"
                        />
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="measurable">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <ChartBar size={16} className="text-primary-500" />
                          <h4 className="text-sm font-medium">Measurable</h4>
                        </div>
                        <p className="text-xs text-gray-500">
                          How will you measure progress and success? Include quantities, metrics, or indicators.
                        </p>
                        <Textarea
                          value={activeGoal.measurable}
                          onChange={(e) => updateGoalProperty(activeGoal.id, "measurable", e.target.value)}
                          placeholder="Define how you'll measure this goal..."
                          className="min-h-[120px]"
                        />
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="achievable">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <CheckSquare size={16} className="text-primary-500" />
                          <h4 className="text-sm font-medium">Achievable</h4>
                        </div>
                        <p className="text-xs text-gray-500">
                          Is this goal realistic given your resources and constraints? Explain why it's attainable.
                        </p>
                        <Textarea
                          value={activeGoal.achievable}
                          onChange={(e) => updateGoalProperty(activeGoal.id, "achievable", e.target.value)}
                          placeholder="Explain why this goal is achievable..."
                          className="min-h-[120px]"
                        />
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="relevant">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <ArrowsClockwise size={16} className="text-primary-500" />
                          <h4 className="text-sm font-medium">Relevant</h4>
                        </div>
                        <p className="text-xs text-gray-500">
                          Why is this goal important? How does it align with broader objectives?
                        </p>
                        <Textarea
                          value={activeGoal.relevant}
                          onChange={(e) => updateGoalProperty(activeGoal.id, "relevant", e.target.value)}
                          placeholder="Describe why this goal is relevant..."
                          className="min-h-[120px]"
                        />
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="timeBound">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Clock size={16} className="text-primary-500" />
                          <h4 className="text-sm font-medium">Time-bound</h4>
                        </div>
                        <p className="text-xs text-gray-500">
                          When will you achieve this goal? Set deadlines and milestones.
                        </p>
                        <Textarea
                          value={activeGoal.timeBound}
                          onChange={(e) => updateGoalProperty(activeGoal.id, "timeBound", e.target.value)}
                          placeholder="Define the timeframe for this goal..."
                          className="min-h-[120px]"
                        />
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
                
                <CardFooter className="flex justify-between">
                  <Button 
                    variant="outline"
                    onClick={moveToNextTab}
                  >
                    Next Section
                  </Button>
                  
                  <Button
                    onClick={moveToNextIncompleteTab}
                    disabled={activeGoal.progress === 100}
                  >
                    {activeGoal.progress === 100 ? "All Sections Complete" : "Next Incomplete Section"}
                  </Button>
                </CardFooter>
              </Card>
            ) : (
              <Card>
                <CardContent className="py-10 text-center">
                  <p className="text-gray-500">Select a goal to edit or create a new one</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartGoalsEditor;
