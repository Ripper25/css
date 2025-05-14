import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  ChartLineUp, 
  Scales, 
  Gear, 
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
  LineChart,
  Line
} from "recharts";
import { Progress } from "@/components/ui/progress";

interface MonitoringPhaseProps {
  projectId: number;
  onProgressUpdate: (progress: number) => void;
  isLocked: boolean;
}

interface MonitoringSection {
  id: string;
  title: string;
  description: string;
  icon: JSX.Element;
  content: string;
  tasks: MonitoringTask[];
  isCompleted: boolean;
  hasChart?: boolean;
  chartType?: 'bar' | 'line';
  chartData?: any[];
}

interface MonitoringTask {
  id: string;
  title: string;
  isCompleted: boolean;
}

interface KPI {
  id: string;
  name: string;
  target: number;
  actual: number;
  unit: string;
}

// Mock data for charts
const progressData = [
  { month: 'Jan', planned: 10, actual: 8 },
  { month: 'Feb', planned: 25, actual: 20 },
  { month: 'Mar', planned: 40, actual: 35 },
  { month: 'Apr', planned: 55, actual: 50 },
  { month: 'May', planned: 70, actual: 65 },
  { month: 'Jun', planned: 85, actual: 75 },
  { month: 'Jul', planned: 100, actual: 85 },
];

const budgetData = [
  { category: 'Equipment', planned: 25000, actual: 27500 },
  { category: 'Personnel', planned: 45000, actual: 42000 },
  { category: 'Marketing', planned: 15000, actual: 16200 },
  { category: 'Services', planned: 10000, actual: 9800 },
  { category: 'Misc', planned: 5000, actual: 6500 },
];

const MonitoringPhase = ({ projectId, onProgressUpdate, isLocked }: MonitoringPhaseProps) => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [sections, setSections] = useState<MonitoringSection[]>([
    {
      id: "monitoring",
      title: "Monitoring",
      description: "Track progress (weekly/monthly reports, KPIs).",
      icon: <ChartLineUp size={20} />,
      content: "",
      tasks: [
        { id: "m1", title: "Establish monitoring framework", isCompleted: false },
        { id: "m2", title: "Collect data regularly", isCompleted: false },
        { id: "m3", title: "Track KPIs", isCompleted: false },
        { id: "m4", title: "Prepare monitoring reports", isCompleted: false }
      ],
      isCompleted: false,
      hasChart: true,
      chartType: 'line',
      chartData: progressData
    },
    {
      id: "evaluation",
      title: "Evaluation",
      description: "Compare actual vs. planned outcomes.",
      icon: <Scales size={20} />,
      content: "",
      tasks: [
        { id: "e1", title: "Analyze collected data", isCompleted: false },
        { id: "e2", title: "Compare results with objectives", isCompleted: false },
        { id: "e3", title: "Identify successes and challenges", isCompleted: false },
        { id: "e4", title: "Document lessons learned", isCompleted: false }
      ],
      isCompleted: false,
      hasChart: true,
      chartType: 'bar',
      chartData: budgetData
    },
    {
      id: "adjustments",
      title: "Adjustments",
      description: "Realign where necessary—budget, team, timeline.",
      icon: <Gear size={20} />,
      content: "",
      tasks: [
        { id: "a1", title: "Identify areas needing adjustment", isCompleted: false },
        { id: "a2", title: "Develop adjustment strategies", isCompleted: false },
        { id: "a3", title: "Implement necessary changes", isCompleted: false },
        { id: "a4", title: "Document all adjustments", isCompleted: false }
      ],
      isCompleted: false
    }
  ]);

  const [kpis, setKpis] = useState<KPI[]>([
    { id: "kpi1", name: "Beneficiaries Reached", target: 1000, actual: 850, unit: "people" },
    { id: "kpi2", name: "Activities Completed", target: 25, actual: 22, unit: "activities" },
    { id: "kpi3", name: "Budget Utilization", target: 100000, actual: 92000, unit: "USD" },
    { id: "kpi4", name: "Stakeholder Satisfaction", target: 90, actual: 85, unit: "%" }
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
    
    const newTask: MonitoringTask = {
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

  // Add a new KPI
  const addKPI = () => {
    if (isLocked) return;
    
    const newKPI: KPI = {
      id: `kpi-${Date.now()}`,
      name: "New KPI",
      target: 0,
      actual: 0,
      unit: "units"
    };
    
    setKpis([...kpis, newKPI]);
  };

  // Update KPI
  const updateKPI = (kpiId: string, updates: Partial<KPI>) => {
    if (isLocked) return;
    
    setKpis(prevKPIs => 
      prevKPIs.map(kpi => 
        kpi.id === kpiId 
          ? { ...kpi, ...updates }
          : kpi
      )
    );
  };

  // Delete a KPI
  const deleteKPI = (kpiId: string) => {
    if (isLocked) return;
    
    setKpis(prevKPIs => prevKPIs.filter(kpi => kpi.id !== kpiId));
  };

  // Render chart based on type
  const renderChart = (section: MonitoringSection) => {
    if (!section.hasChart || !section.chartType) return null;
    
    switch (section.chartType) {
      case 'bar':
        return (
          <div className="mt-4 border p-4 rounded-lg bg-white">
            <h4 className="text-sm font-medium mb-2">Budget: Planned vs. Actual</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={section.chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="planned" fill="#8884d8" name="Planned" />
                <Bar dataKey="actual" fill="#82ca9d" name="Actual" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );
      case 'line':
        return (
          <div className="mt-4 border p-4 rounded-lg bg-white">
            <h4 className="text-sm font-medium mb-2">Progress: Planned vs. Actual</h4>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={section.chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="planned" stroke="#8884d8" name="Planned" />
                <Line type="monotone" dataKey="actual" stroke="#82ca9d" name="Actual" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        );
      default:
        return null;
    }
  };

  // Get active section
  const activeMonitoringSection = activeSection 
    ? sections.find(section => section.id === activeSection) 
    : null;

  // If phase is locked, show locked message
  if (isLocked) {
    return (
      <Card className="border-dashed border-gray-300">
        <CardContent className="py-12">
          <div className="text-center">
            <Lock size={48} className="mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">Monitoring & Evaluation Phase Locked</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Complete the Implementation phase to unlock this phase.
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
        {activeMonitoringSection ? (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center",
                    activeMonitoringSection.isCompleted ? "bg-green-100 text-green-600" : "bg-primary-100 text-primary-500"
                  )}>
                    {activeMonitoringSection.isCompleted ? 
                      <CheckCircle size={20} weight="fill" /> : 
                      activeMonitoringSection.icon
                    }
                  </div>
                  <div>
                    <CardTitle>{activeMonitoringSection.title}</CardTitle>
                    <CardDescription>{activeMonitoringSection.description}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox 
                    id={`complete-${activeMonitoringSection.id}`}
                    checked={activeMonitoringSection.isCompleted}
                    onCheckedChange={() => toggleSectionCompletion(activeMonitoringSection.id)}
                  />
                  <Label htmlFor={`complete-${activeMonitoringSection.id}`}>Mark as complete</Label>
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
                  placeholder={`Describe the ${activeMonitoringSection.title.toLowerCase()} process...`}
                  value={activeMonitoringSection.content}
                  onChange={(e) => updateSectionContent(activeMonitoringSection.id, e.target.value)}
                  className="min-h-[150px]"
                />
              </div>
              
              {/* Render chart if section has one */}
              {renderChart(activeMonitoringSection)}
              
              {/* KPI tracking (only for monitoring section) */}
              {activeMonitoringSection.id === "monitoring" && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-sm font-medium">Key Performance Indicators (KPIs)</Label>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={addKPI}
                      className="h-8 text-xs"
                    >
                      <PlusCircle size={14} className="mr-1" />
                      Add KPI
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    {kpis.map(kpi => (
                      <div key={kpi.id} className="border rounded-lg overflow-hidden">
                        <div className="flex items-center gap-3 p-3">
                          <Input 
                            value={kpi.name}
                            onChange={(e) => updateKPI(kpi.id, { name: e.target.value })}
                            className="flex-1 border-0 focus-visible:ring-0 p-0 h-auto font-medium"
                            placeholder="KPI Name"
                          />
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => deleteKPI(kpi.id)}
                            className="h-8 w-8"
                          >
                            <Trash size={14} />
                          </Button>
                        </div>
                        
                        <div className="bg-gray-50 p-3 grid grid-cols-3 gap-3 text-sm">
                          <div>
                            <Label className="text-xs text-gray-500 mb-1 block">Target</Label>
                            <div className="flex items-center">
                              <Input 
                                type="number" 
                                value={kpi.target}
                                onChange={(e) => updateKPI(kpi.id, { target: parseFloat(e.target.value) })}
                                className="h-8 text-xs"
                              />
                              <Input 
                                value={kpi.unit}
                                onChange={(e) => updateKPI(kpi.id, { unit: e.target.value })}
                                className="h-8 text-xs w-20 ml-2"
                                placeholder="Unit"
                              />
                            </div>
                          </div>
                          <div>
                            <Label className="text-xs text-gray-500 mb-1 block">Actual</Label>
                            <Input 
                              type="number" 
                              value={kpi.actual}
                              onChange={(e) => updateKPI(kpi.id, { actual: parseFloat(e.target.value) })}
                              className="h-8 text-xs"
                            />
                          </div>
                          <div>
                            <Label className="text-xs text-gray-500 mb-1 block">Progress</Label>
                            <div className="pt-1">
                              <Progress 
                                value={kpi.target > 0 ? (kpi.actual / kpi.target) * 100 : 0} 
                                className="h-2"
                              />
                              <div className="text-xs mt-1 text-right">
                                {kpi.target > 0 ? Math.round((kpi.actual / kpi.target) * 100) : 0}%
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-medium">Tasks</Label>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => addTask(activeMonitoringSection.id)}
                    className="h-8 text-xs"
                  >
                    <PlusCircle size={14} className="mr-1" />
                    Add Task
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {activeMonitoringSection.tasks.map(task => (
                    <div key={task.id} className="flex items-center gap-3 p-3 border rounded-lg">
                      <Checkbox 
                        id={`task-${task.id}`}
                        checked={task.isCompleted}
                        onCheckedChange={() => toggleTaskCompletion(activeMonitoringSection.id, task.id)}
                      />
                      <Input 
                        value={task.title}
                        onChange={(e) => updateTaskTitle(activeMonitoringSection.id, task.id, e.target.value)}
                        className="flex-1"
                      />
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => deleteTask(activeMonitoringSection.id, task.id)}
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
                  <p className="text-sm text-gray-500 mb-2">Upload monitoring reports and evaluation documents</p>
                  <Button size="sm" className="h-8 text-xs">
                    <Upload size={14} className="mr-1" />
                    Upload Files
                  </Button>
                </div>
                
                {/* Mock files for monitoring section */}
                {activeMonitoringSection.id === "monitoring" && (
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center justify-between p-2 border rounded-md">
                      <div className="flex items-center gap-2">
                        <FileText size={16} className="text-gray-500" />
                        <div>
                          <p className="text-sm font-medium">Monthly_Progress_Report_May.pdf</p>
                          <p className="text-xs text-gray-500">Added Jun 2, 2025</p>
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

export default MonitoringPhase;
