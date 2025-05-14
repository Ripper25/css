import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  FileText, 
  Graph, 
  PresentationChart, 
  CheckCircle, 
  PlusCircle, 
  Upload, 
  Download,
  Trash,
  Lock,
  Share
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
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts";

interface ReportingPhaseProps {
  projectId: number;
  onProgressUpdate: (progress: number) => void;
  isLocked: boolean;
}

interface ReportingSection {
  id: string;
  title: string;
  description: string;
  icon: JSX.Element;
  content: string;
  tasks: ReportingTask[];
  isCompleted: boolean;
  hasChart?: boolean;
  chartType?: 'pie' | 'bar' | 'radar';
  chartData?: any[];
}

interface ReportingTask {
  id: string;
  title: string;
  isCompleted: boolean;
}

interface ImpactMetric {
  id: string;
  name: string;
  value: number;
  description: string;
}

// Mock data for charts
const beneficiaryData = [
  { name: 'Direct Beneficiaries', value: 850 },
  { name: 'Indirect Beneficiaries', value: 3200 },
  { name: 'Community Partners', value: 25 },
  { name: 'Volunteers', value: 120 },
];

const outcomeData = [
  { category: 'Knowledge Gain', value: 85 },
  { category: 'Behavior Change', value: 72 },
  { category: 'Skills Improvement', value: 78 },
  { category: 'Quality of Life', value: 65 },
  { category: 'Community Impact', value: 70 },
];

const sustainabilityData = [
  { subject: 'Financial', A: 80, fullMark: 100 },
  { subject: 'Environmental', A: 75, fullMark: 100 },
  { subject: 'Social', A: 90, fullMark: 100 },
  { subject: 'Institutional', A: 65, fullMark: 100 },
  { subject: 'Technical', A: 70, fullMark: 100 },
];

const COLORS = ['#9b87f5', '#F97316', '#0EA5E9', '#D946EF', '#10B981'];

const ReportingPhase = ({ projectId, onProgressUpdate, isLocked }: ReportingPhaseProps) => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [sections, setSections] = useState<ReportingSection[]>([
    {
      id: "report",
      title: "Final Report",
      description: "Results, lessons learned, challenges, and successes.",
      icon: <FileText size={20} />,
      content: "",
      tasks: [
        { id: "r1", title: "Compile all project data", isCompleted: false },
        { id: "r2", title: "Document achievements and challenges", isCompleted: false },
        { id: "r3", title: "Analyze lessons learned", isCompleted: false },
        { id: "r4", title: "Prepare comprehensive final report", isCompleted: false }
      ],
      isCompleted: false,
      hasChart: true,
      chartType: 'bar',
      chartData: outcomeData
    },
    {
      id: "impact",
      title: "Impact Assessment",
      description: "Long-term benefits and sustainability.",
      icon: <Graph size={20} />,
      content: "",
      tasks: [
        { id: "i1", title: "Assess direct and indirect impacts", isCompleted: false },
        { id: "i2", title: "Evaluate sustainability factors", isCompleted: false },
        { id: "i3", title: "Document long-term benefits", isCompleted: false },
        { id: "i4", title: "Prepare impact assessment report", isCompleted: false }
      ],
      isCompleted: false,
      hasChart: true,
      chartType: 'pie',
      chartData: beneficiaryData
    },
    {
      id: "presentation",
      title: "Stakeholder Presentation",
      description: "Share results with funders, partners, community, etc.",
      icon: <PresentationChart size={20} />,
      content: "",
      tasks: [
        { id: "p1", title: "Prepare presentation materials", isCompleted: false },
        { id: "p2", title: "Schedule stakeholder meetings", isCompleted: false },
        { id: "p3", title: "Deliver presentations", isCompleted: false },
        { id: "p4", title: "Collect stakeholder feedback", isCompleted: false }
      ],
      isCompleted: false,
      hasChart: true,
      chartType: 'radar',
      chartData: sustainabilityData
    }
  ]);

  const [impactMetrics, setImpactMetrics] = useState<ImpactMetric[]>([
    { 
      id: "im1", 
      name: "Lives Improved", 
      value: 850, 
      description: "Number of individuals who directly benefited from the project with improved quality of life" 
    },
    { 
      id: "im2", 
      name: "Knowledge Increase", 
      value: 85, 
      description: "Percentage increase in knowledge among participants based on pre/post assessments" 
    },
    { 
      id: "im3", 
      name: "Community Engagement", 
      value: 25, 
      description: "Number of community organizations actively participating in the project" 
    },
    { 
      id: "im4", 
      name: "Sustainability Score", 
      value: 76, 
      description: "Overall sustainability score (0-100) based on financial, social, and environmental factors" 
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
    
    const newTask: ReportingTask = {
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

  // Add a new impact metric
  const addImpactMetric = () => {
    if (isLocked) return;
    
    const newMetric: ImpactMetric = {
      id: `im-${Date.now()}`,
      name: "New Impact Metric",
      value: 0,
      description: "Description of this impact metric"
    };
    
    setImpactMetrics([...impactMetrics, newMetric]);
  };

  // Update impact metric
  const updateImpactMetric = (metricId: string, updates: Partial<ImpactMetric>) => {
    if (isLocked) return;
    
    setImpactMetrics(prevMetrics => 
      prevMetrics.map(metric => 
        metric.id === metricId 
          ? { ...metric, ...updates }
          : metric
      )
    );
  };

  // Delete an impact metric
  const deleteImpactMetric = (metricId: string) => {
    if (isLocked) return;
    
    setImpactMetrics(prevMetrics => prevMetrics.filter(metric => metric.id !== metricId));
  };

  // Render chart based on type
  const renderChart = (section: ReportingSection) => {
    if (!section.hasChart || !section.chartType) return null;
    
    switch (section.chartType) {
      case 'pie':
        return (
          <div className="mt-4 border p-4 rounded-lg bg-white">
            <h4 className="text-sm font-medium mb-2">Beneficiary Distribution</h4>
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
            <h4 className="text-sm font-medium mb-2">Project Outcomes</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={section.chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" name="Score (0-100)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );
      case 'radar':
        return (
          <div className="mt-4 border p-4 rounded-lg bg-white">
            <h4 className="text-sm font-medium mb-2">Sustainability Assessment</h4>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart cx="50%" cy="50%" outerRadius={80} data={section.chartData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar name="Sustainability" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                <Legend />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        );
      default:
        return null;
    }
  };

  // Get active section
  const activeReportingSection = activeSection 
    ? sections.find(section => section.id === activeSection) 
    : null;

  // If phase is locked, show locked message
  if (isLocked) {
    return (
      <Card className="border-dashed border-gray-300">
        <CardContent className="py-12">
          <div className="text-center">
            <Lock size={48} className="mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">Reporting & Impact Assessment Phase Locked</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Complete the Monitoring & Evaluation phase to unlock this phase.
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
        {activeReportingSection ? (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center",
                    activeReportingSection.isCompleted ? "bg-green-100 text-green-600" : "bg-primary-100 text-primary-500"
                  )}>
                    {activeReportingSection.isCompleted ? 
                      <CheckCircle size={20} weight="fill" /> : 
                      activeReportingSection.icon
                    }
                  </div>
                  <div>
                    <CardTitle>{activeReportingSection.title}</CardTitle>
                    <CardDescription>{activeReportingSection.description}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox 
                    id={`complete-${activeReportingSection.id}`}
                    checked={activeReportingSection.isCompleted}
                    onCheckedChange={() => toggleSectionCompletion(activeReportingSection.id)}
                  />
                  <Label htmlFor={`complete-${activeReportingSection.id}`}>Mark as complete</Label>
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
                  placeholder={`Describe the ${activeReportingSection.title.toLowerCase()}...`}
                  value={activeReportingSection.content}
                  onChange={(e) => updateSectionContent(activeReportingSection.id, e.target.value)}
                  className="min-h-[150px]"
                />
              </div>
              
              {/* Render chart if section has one */}
              {renderChart(activeReportingSection)}
              
              {/* Impact metrics (only for impact section) */}
              {activeReportingSection.id === "impact" && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-sm font-medium">Impact Metrics</Label>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={addImpactMetric}
                      className="h-8 text-xs"
                    >
                      <PlusCircle size={14} className="mr-1" />
                      Add Metric
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    {impactMetrics.map(metric => (
                      <div key={metric.id} className="border rounded-lg overflow-hidden">
                        <div className="flex items-center gap-3 p-3">
                          <Input 
                            value={metric.name}
                            onChange={(e) => updateImpactMetric(metric.id, { name: e.target.value })}
                            className="flex-1 border-0 focus-visible:ring-0 p-0 h-auto font-medium"
                            placeholder="Metric Name"
                          />
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => deleteImpactMetric(metric.id)}
                            className="h-8 w-8"
                          >
                            <Trash size={14} />
                          </Button>
                        </div>
                        
                        <div className="bg-gray-50 p-3 grid grid-cols-1 gap-3 text-sm">
                          <div className="flex items-center gap-3">
                            <Label className="text-xs text-gray-500 w-20">Value</Label>
                            <Input 
                              type="number" 
                              value={metric.value}
                              onChange={(e) => updateImpactMetric(metric.id, { value: parseFloat(e.target.value) })}
                              className="h-8 text-xs"
                            />
                          </div>
                          <div>
                            <Label className="text-xs text-gray-500 mb-1 block">Description</Label>
                            <Textarea 
                              value={metric.description}
                              onChange={(e) => updateImpactMetric(metric.id, { description: e.target.value })}
                              className="min-h-[60px] text-xs"
                              placeholder="Describe this impact metric"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Presentation options (only for presentation section) */}
              {activeReportingSection.id === "presentation" && (
                <div>
                  <Label className="text-sm font-medium mb-2 block">
                    Stakeholder Presentation Options
                  </Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Button variant="outline" className="justify-start h-auto py-3">
                      <div className="flex flex-col items-start">
                        <div className="flex items-center">
                          <PresentationChart size={16} className="mr-2" />
                          <span className="font-medium">Create Presentation</span>
                        </div>
                        <span className="text-xs text-gray-500 mt-1">
                          Generate a presentation from project data
                        </span>
                      </div>
                    </Button>
                    <Button variant="outline" className="justify-start h-auto py-3">
                      <div className="flex flex-col items-start">
                        <div className="flex items-center">
                          <Share size={16} className="mr-2" />
                          <span className="font-medium">Share Results</span>
                        </div>
                        <span className="text-xs text-gray-500 mt-1">
                          Share results with stakeholders
                        </span>
                      </div>
                    </Button>
                  </div>
                </div>
              )}
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-medium">Tasks</Label>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => addTask(activeReportingSection.id)}
                    className="h-8 text-xs"
                  >
                    <PlusCircle size={14} className="mr-1" />
                    Add Task
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {activeReportingSection.tasks.map(task => (
                    <div key={task.id} className="flex items-center gap-3 p-3 border rounded-lg">
                      <Checkbox 
                        id={`task-${task.id}`}
                        checked={task.isCompleted}
                        onCheckedChange={() => toggleTaskCompletion(activeReportingSection.id, task.id)}
                      />
                      <Input 
                        value={task.title}
                        onChange={(e) => updateTaskTitle(activeReportingSection.id, task.id, e.target.value)}
                        className="flex-1"
                      />
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => deleteTask(activeReportingSection.id, task.id)}
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
                  <p className="text-sm text-gray-500 mb-2">Upload final reports and presentation materials</p>
                  <Button size="sm" className="h-8 text-xs">
                    <Upload size={14} className="mr-1" />
                    Upload Files
                  </Button>
                </div>
                
                {/* Mock files for report section */}
                {activeReportingSection.id === "report" && (
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center justify-between p-2 border rounded-md">
                      <div className="flex items-center gap-2">
                        <FileText size={16} className="text-gray-500" />
                        <div>
                          <p className="text-sm font-medium">Final_Project_Report.pdf</p>
                          <p className="text-xs text-gray-500">Added Jul 15, 2025</p>
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

export default ReportingPhase;
