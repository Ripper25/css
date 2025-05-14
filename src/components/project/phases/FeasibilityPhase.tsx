import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  ChartBar, 
  Gear, 
  CurrencyDollar, 
  Scales, 
  CheckCircle, 
  PlusCircle, 
  Upload, 
  FileText,
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
  PieChart,
  Pie,
  Cell
} from "recharts";

interface FeasibilityPhaseProps {
  projectId: number;
  onProgressUpdate: (progress: number) => void;
  isLocked: boolean;
}

interface FeasibilitySection {
  id: string;
  title: string;
  description: string;
  icon: JSX.Element;
  content: string;
  tasks: FeasibilityTask[];
  isCompleted: boolean;
  hasChart?: boolean;
  chartType?: 'pie' | 'bar' | 'table';
  chartData?: any[];
}

interface FeasibilityTask {
  id: string;
  title: string;
  isCompleted: boolean;
}

// Mock data for charts
const marketData = [
  { name: 'Target Group A', value: 45 },
  { name: 'Target Group B', value: 30 },
  { name: 'Target Group C', value: 15 },
  { name: 'Target Group D', value: 10 },
];

const financialData = [
  { category: 'Equipment', amount: 25000 },
  { category: 'Personnel', amount: 45000 },
  { category: 'Marketing', amount: 15000 },
  { category: 'Services', amount: 10000 },
  { category: 'Misc', amount: 5000 },
];

const riskData = [
  { risk: 'Financial', probability: 3, impact: 4, score: 12 },
  { risk: 'Technical', probability: 2, impact: 5, score: 10 },
  { risk: 'Schedule', probability: 4, impact: 3, score: 12 },
  { risk: 'Resource', probability: 3, impact: 3, score: 9 },
  { risk: 'Stakeholder', probability: 2, impact: 4, score: 8 },
];

const COLORS = ['#9b87f5', '#F97316', '#0EA5E9', '#D946EF', '#10B981'];

const FeasibilityPhase = ({ projectId, onProgressUpdate, isLocked }: FeasibilityPhaseProps) => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [sections, setSections] = useState<FeasibilitySection[]>([
    {
      id: "market",
      title: "Market Research",
      description: "Demand, beneficiaries, competitors, trends.",
      icon: <ChartBar size={20} />,
      content: "",
      tasks: [
        { id: "m1", title: "Identify target beneficiaries", isCompleted: false },
        { id: "m2", title: "Analyze demand for services", isCompleted: false },
        { id: "m3", title: "Research similar initiatives", isCompleted: false },
        { id: "m4", title: "Document market trends", isCompleted: false }
      ],
      isCompleted: false,
      hasChart: true,
      chartType: 'pie',
      chartData: marketData
    },
    {
      id: "technical",
      title: "Technical Feasibility",
      description: "Is it possible to execute (skills, tools, systems)?",
      icon: <Gear size={20} />,
      content: "",
      tasks: [
        { id: "t1", title: "Assess required skills", isCompleted: false },
        { id: "t2", title: "Evaluate available tools and systems", isCompleted: false },
        { id: "t3", title: "Identify technical constraints", isCompleted: false },
        { id: "t4", title: "Determine technical requirements", isCompleted: false }
      ],
      isCompleted: false
    },
    {
      id: "financial",
      title: "Financial Feasibility",
      description: "Costs, revenue, ROI, funding sources.",
      icon: <CurrencyDollar size={20} />,
      content: "",
      tasks: [
        { id: "f1", title: "Estimate project costs", isCompleted: false },
        { id: "f2", title: "Identify potential funding sources", isCompleted: false },
        { id: "f3", title: "Calculate ROI or impact metrics", isCompleted: false },
        { id: "f4", title: "Develop preliminary budget", isCompleted: false }
      ],
      isCompleted: false,
      hasChart: true,
      chartType: 'bar',
      chartData: financialData
    },
    {
      id: "risk",
      title: "Risk Assessment",
      description: "Identify risks and mitigation strategies.",
      icon: <Scales size={20} />,
      content: "",
      tasks: [
        { id: "r1", title: "Identify potential risks", isCompleted: false },
        { id: "r2", title: "Assess probability and impact", isCompleted: false },
        { id: "r3", title: "Develop mitigation strategies", isCompleted: false },
        { id: "r4", title: "Create risk management plan", isCompleted: false }
      ],
      isCompleted: false,
      hasChart: true,
      chartType: 'table',
      chartData: riskData
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
    
    const newTask: FeasibilityTask = {
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
  const renderChart = (section: FeasibilitySection) => {
    if (!section.hasChart || !section.chartType) return null;
    
    switch (section.chartType) {
      case 'pie':
        return (
          <div className="mt-4 border p-4 rounded-lg bg-white">
            <h4 className="text-sm font-medium mb-2">Target Beneficiaries</h4>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={section.chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {section.chartData?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        );
      case 'bar':
        return (
          <div className="mt-4 border p-4 rounded-lg bg-white">
            <h4 className="text-sm font-medium mb-2">Estimated Costs</h4>
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
      case 'table':
        return (
          <div className="mt-4 border rounded-lg overflow-hidden">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 text-left text-sm">Risk</th>
                  <th className="p-2 text-left text-sm">Probability (1-5)</th>
                  <th className="p-2 text-left text-sm">Impact (1-5)</th>
                  <th className="p-2 text-left text-sm">Risk Score</th>
                </tr>
              </thead>
              <tbody>
                {section.chartData?.map((risk: any, index: number) => (
                  <tr key={index} className="border-t">
                    <td className="p-2 text-sm">{risk.risk}</td>
                    <td className="p-2 text-sm">{risk.probability}</td>
                    <td className="p-2 text-sm">{risk.impact}</td>
                    <td className="p-2 text-sm">
                      <span className={cn(
                        "px-2 py-1 rounded text-white text-xs",
                        risk.score >= 15 ? "bg-red-500" :
                        risk.score >= 10 ? "bg-orange-500" :
                        risk.score >= 5 ? "bg-yellow-500" :
                        "bg-green-500"
                      )}>
                        {risk.score}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      default:
        return null;
    }
  };

  // Get active section
  const activeFeasibilitySection = activeSection 
    ? sections.find(section => section.id === activeSection) 
    : null;

  // If phase is locked, show locked message
  if (isLocked) {
    return (
      <Card className="border-dashed border-gray-300">
        <CardContent className="py-12">
          <div className="text-center">
            <Lock size={48} className="mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">Feasibility Study Phase Locked</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Complete the Concept Development phase to unlock this phase.
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
        {activeFeasibilitySection ? (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center",
                    activeFeasibilitySection.isCompleted ? "bg-green-100 text-green-600" : "bg-primary-100 text-primary-500"
                  )}>
                    {activeFeasibilitySection.isCompleted ? 
                      <CheckCircle size={20} weight="fill" /> : 
                      activeFeasibilitySection.icon
                    }
                  </div>
                  <div>
                    <CardTitle>{activeFeasibilitySection.title}</CardTitle>
                    <CardDescription>{activeFeasibilitySection.description}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox 
                    id={`complete-${activeFeasibilitySection.id}`}
                    checked={activeFeasibilitySection.isCompleted}
                    onCheckedChange={() => toggleSectionCompletion(activeFeasibilitySection.id)}
                  />
                  <Label htmlFor={`complete-${activeFeasibilitySection.id}`}>Mark as complete</Label>
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
                  placeholder={`Describe the ${activeFeasibilitySection.title.toLowerCase()}...`}
                  value={activeFeasibilitySection.content}
                  onChange={(e) => updateSectionContent(activeFeasibilitySection.id, e.target.value)}
                  className="min-h-[150px]"
                />
              </div>
              
              {/* Render chart if section has one */}
              {renderChart(activeFeasibilitySection)}
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-medium">Tasks</Label>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => addTask(activeFeasibilitySection.id)}
                    className="h-8 text-xs"
                  >
                    <PlusCircle size={14} className="mr-1" />
                    Add Task
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {activeFeasibilitySection.tasks.map(task => (
                    <div key={task.id} className="flex items-center gap-3 p-3 border rounded-lg">
                      <Checkbox 
                        id={`task-${task.id}`}
                        checked={task.isCompleted}
                        onCheckedChange={() => toggleTaskCompletion(activeFeasibilitySection.id, task.id)}
                      />
                      <Input 
                        value={task.title}
                        onChange={(e) => updateTaskTitle(activeFeasibilitySection.id, task.id, e.target.value)}
                        className="flex-1"
                      />
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => deleteTask(activeFeasibilitySection.id, task.id)}
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

export default FeasibilityPhase;
