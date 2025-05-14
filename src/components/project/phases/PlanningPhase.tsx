import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  FileText, 
  Calendar, 
  CurrencyDollar, 
  Handshake, 
  CheckCircle, 
  PlusCircle, 
  Upload, 
  Download,
  Trash,
  Lock
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts";

interface PlanningPhaseProps {
  projectId: number;
  onProgressUpdate: (progress: number) => void;
  isLocked: boolean;
}

interface PlanningSection {
  id: string;
  title: string;
  description: string;
  icon: JSX.Element;
  content: string;
  tasks: PlanningTask[];
  isCompleted: boolean;
  hasChart?: boolean;
  chartType?: 'bar' | 'line';
  chartData?: any[];
}

interface PlanningTask {
  id: string;
  title: string;
  isCompleted: boolean;
}

// Mock data for charts
const budgetData = [
  { category: 'Equipment', amount: 25000 },
  { category: 'Personnel', amount: 45000 },
  { category: 'Marketing', amount: 15000 },
  { category: 'Services', amount: 10000 },
  { category: 'Misc', amount: 5000 },
];

const timelineData = [
  { month: 'Jan', planned: 10 },
  { month: 'Feb', planned: 25 },
  { month: 'Mar', planned: 40 },
  { month: 'Apr', planned: 55 },
  { month: 'May', planned: 70 },
  { month: 'Jun', planned: 85 },
  { month: 'Jul', planned: 100 },
];

const PlanningPhase = ({ projectId, onProgressUpdate, isLocked }: PlanningPhaseProps) => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [sections, setSections] = useState<PlanningSection[]>([
    {
      id: "proposal",
      title: "Project Proposal",
      description: "Include all components: objectives, budget, timelines, partners, etc.",
      icon: <FileText size={20} />,
      content: "",
      tasks: [
        { id: "p1", title: "Define project scope", isCompleted: false },
        { id: "p2", title: "Set clear objectives", isCompleted: false },
        { id: "p3", title: "Identify key stakeholders", isCompleted: false },
        { id: "p4", title: "Draft full proposal document", isCompleted: false }
      ],
      isCompleted: false
    },
    {
      id: "workplan",
      title: "Work Plan",
      description: "Tasks, roles, responsibilities, schedule (Gantt chart or calendar).",
      icon: <Calendar size={20} />,
      content: "",
      tasks: [
        { id: "w1", title: "Break down project into tasks", isCompleted: false },
        { id: "w2", title: "Assign responsibilities", isCompleted: false },
        { id: "w3", title: "Create timeline with milestones", isCompleted: false },
        { id: "w4", title: "Develop communication plan", isCompleted: false }
      ],
      isCompleted: false,
      hasChart: true,
      chartType: 'line',
      chartData: timelineData
    },
    {
      id: "budget",
      title: "Budgeting",
      description: "Detailed financial breakdown.",
      icon: <CurrencyDollar size={20} />,
      content: "",
      tasks: [
        { id: "b1", title: "Itemize all expenses", isCompleted: false },
        { id: "b2", title: "Research accurate cost estimates", isCompleted: false },
        { id: "b3", title: "Include contingency funds", isCompleted: false },
        { id: "b4", title: "Create budget spreadsheet", isCompleted: false }
      ],
      isCompleted: false,
      hasChart: true,
      chartType: 'bar',
      chartData: budgetData
    },
    {
      id: "funding",
      title: "Secure Funding",
      description: "Grants, investors, loans, partnerships.",
      icon: <Handshake size={20} />,
      content: "",
      tasks: [
        { id: "f1", title: "Identify potential funding sources", isCompleted: false },
        { id: "f2", title: "Prepare funding applications/pitches", isCompleted: false },
        { id: "f3", title: "Develop partnerships", isCompleted: false },
        { id: "f4", title: "Create funding tracking system", isCompleted: false }
      ],
      isCompleted: false
    }
  ]);

  // Set first section as active by default
  useEffect(() => {
    if (sections.length > 0 && !activeSection && !isLocked) {
      setActiveSection(sections[0].id);
    }
  }, [sections, activeSection, isLocked]);

  // Calculate and update progress whenever sections change
  useEffect(() => {
    if (isLocked) {
      onProgressUpdate(0);
      return;
    }
    
    const totalTasks = sections.reduce((total, section) => total + section.tasks.length, 0);
    const completedTasks = sections.reduce(
      (total, section) => total + section.tasks.filter(task => task.isCompleted).length, 
      0
    );
    
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    onProgressUpdate(progress);
  }, [sections, onProgressUpdate, isLocked]);

  // Toggle task completion
  const toggleTaskCompletion = (sectionId: string, taskId: string) => {
    if (isLocked) return;
    
    setSections(prevSections => 
      prevSections.map(section => 
        section.id === sectionId 
          ? {
              ...section,
              tasks: section.tasks.map(task => 
                task.id === taskId 
                  ? { ...task, isCompleted: !task.isCompleted }
                  : task
              )
            }
          : section
      )
    );
  };

  // Toggle section completion
  const toggleSectionCompletion = (sectionId: string) => {
    if (isLocked) return;
    
    setSections(prevSections => 
      prevSections.map(section => 
        section.id === sectionId 
          ? { ...section, isCompleted: !section.isCompleted }
          : section
      )
    );
  };

  // Update section content
  const updateSectionContent = (sectionId: string, content: string) => {
    if (isLocked) return;
    
    setSections(prevSections => 
      prevSections.map(section => 
        section.id === sectionId 
          ? { ...section, content }
          : section
      )
    );
  };

  // Add a new task
  const addTask = (sectionId: string) => {
    if (isLocked) return;
    
    const newTask: PlanningTask = {
      id: `task-${Date.now()}`,
      title: "New task",
      isCompleted: false
    };
    
    setSections(prevSections => 
      prevSections.map(section => 
        section.id === sectionId 
          ? { ...section, tasks: [...section.tasks, newTask] }
          : section
      )
    );
  };

  // Update task title
  const updateTaskTitle = (sectionId: string, taskId: string, title: string) => {
    if (isLocked) return;
    
    setSections(prevSections => 
      prevSections.map(section => 
        section.id === sectionId 
          ? {
              ...section,
              tasks: section.tasks.map(task => 
                task.id === taskId 
                  ? { ...task, title }
                  : task
              )
            }
          : section
      )
    );
  };

  // Delete a task
  const deleteTask = (sectionId: string, taskId: string) => {
    if (isLocked) return;
    
    setSections(prevSections => 
      prevSections.map(section => 
        section.id === sectionId 
          ? {
              ...section,
              tasks: section.tasks.filter(task => task.id !== taskId)
            }
          : section
      )
    );
  };

  // Render chart based on type
  const renderChart = (section: PlanningSection) => {
    if (!section.hasChart || !section.chartType) return null;
    
    switch (section.chartType) {
      case 'bar':
        return (
          <div className="mt-4 border p-4 rounded-lg bg-white">
            <h4 className="text-sm font-medium mb-2">Budget Breakdown</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={section.chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="amount" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );
      case 'line':
        return (
          <div className="mt-4 border p-4 rounded-lg bg-white">
            <h4 className="text-sm font-medium mb-2">Project Timeline</h4>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={section.chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="planned" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        );
      default:
        return null;
    }
  };

  // Get active section
  const activePlanningSection = activeSection 
    ? sections.find(section => section.id === activeSection) 
    : null;

  // If phase is locked, show locked message
  if (isLocked) {
    return (
      <Card className="border-dashed border-gray-300">
        <CardContent className="py-12">
          <div className="text-center">
            <Lock size={48} className="mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">Planning Phase Locked</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Complete the Feasibility Study phase to unlock this phase.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Sidebar with sections */}
      <div className="space-y-2">
        {sections.map(section => (
          <div 
            key={section.id}
            className={cn(
              "p-3 border rounded-lg cursor-pointer transition-all",
              activeSection === section.id ? "border-primary-500 bg-primary-50" : "hover:bg-gray-50",
              section.isCompleted ? "border-green-200 bg-green-50" : ""
            )}
            onClick={() => setActiveSection(section.id)}
          >
            <div className="flex items-start gap-3">
              <div className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center",
                section.isCompleted ? "bg-green-100 text-green-600" : "bg-primary-100 text-primary-500"
              )}>
                {section.isCompleted ? <CheckCircle size={16} weight="fill" /> : section.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium">{section.title}</h3>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-gray-500 line-clamp-1">{section.description}</p>
                  <div className="flex items-center">
                    <span className="text-xs text-gray-500">
                      {section.tasks.filter(t => t.isCompleted).length}/{section.tasks.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Main content area */}
      <div className="md:col-span-3">
        {activePlanningSection ? (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center",
                    activePlanningSection.isCompleted ? "bg-green-100 text-green-600" : "bg-primary-100 text-primary-500"
                  )}>
                    {activePlanningSection.isCompleted ? 
                      <CheckCircle size={20} weight="fill" /> : 
                      activePlanningSection.icon
                    }
                  </div>
                  <div>
                    <CardTitle>{activePlanningSection.title}</CardTitle>
                    <CardDescription>{activePlanningSection.description}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox 
                    id={`complete-${activePlanningSection.id}`}
                    checked={activePlanningSection.isCompleted}
                    onCheckedChange={() => toggleSectionCompletion(activePlanningSection.id)}
                  />
                  <Label htmlFor={`complete-${activePlanningSection.id}`}>Mark as complete</Label>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="section-content" className="text-sm font-medium mb-2 block">
                  Content
                </Label>
                <Textarea 
                  id="section-content"
                  placeholder={`Describe the ${activePlanningSection.title.toLowerCase()}...`}
                  value={activePlanningSection.content}
                  onChange={(e) => updateSectionContent(activePlanningSection.id, e.target.value)}
                  className="min-h-[150px]"
                />
              </div>
              
              {/* Render chart if section has one */}
              {renderChart(activePlanningSection)}
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-medium">Tasks</Label>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => addTask(activePlanningSection.id)}
                    className="h-8 text-xs"
                  >
                    <PlusCircle size={14} className="mr-1" />
                    Add Task
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {activePlanningSection.tasks.map(task => (
                    <div key={task.id} className="flex items-center gap-3 p-3 border rounded-lg">
                      <Checkbox 
                        id={`task-${task.id}`}
                        checked={task.isCompleted}
                        onCheckedChange={() => toggleTaskCompletion(activePlanningSection.id, task.id)}
                      />
                      <Input 
                        value={task.title}
                        onChange={(e) => updateTaskTitle(activePlanningSection.id, task.id, e.target.value)}
                        className="flex-1"
                      />
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => deleteTask(activePlanningSection.id, task.id)}
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
                
                {/* Mock files for proposal section */}
                {activePlanningSection.id === "proposal" && (
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center justify-between p-2 border rounded-md">
                      <div className="flex items-center gap-2">
                        <FileText size={16} className="text-gray-500" />
                        <div>
                          <p className="text-sm font-medium">Project_Proposal_Draft.docx</p>
                          <p className="text-xs text-gray-500">Added Feb 5, 2025</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Download size={14} />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline"
                onClick={() => {
                  const currentIndex = sections.findIndex(s => s.id === activeSection);
                  if (currentIndex > 0) {
                    setActiveSection(sections[currentIndex - 1].id);
                  }
                }}
                disabled={sections.findIndex(s => s.id === activeSection) === 0}
              >
                Previous Section
              </Button>
              
              <Button
                onClick={() => {
                  const currentIndex = sections.findIndex(s => s.id === activeSection);
                  if (currentIndex < sections.length - 1) {
                    setActiveSection(sections[currentIndex + 1].id);
                  }
                }}
                disabled={sections.findIndex(s => s.id === activeSection) === sections.length - 1}
              >
                Next Section
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <Card>
            <CardContent className="py-6">
              <p className="text-center text-gray-500">Select a section to begin</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PlanningPhase;
