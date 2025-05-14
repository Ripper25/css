import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  ArrowLeft, 
  CheckCircle, 
  Circle, 
  PlusCircle, 
  Trash, 
  Upload,
  Download,
  FileText,
  Users,
  Calendar,
  ChartBar,
  Target,
  Lightbulb,
  MagnifyingGlass,
  Gear,
  CurrencyDollar,
  Handshake,
  UsersThree,
  Play,
  ClipboardText,
  ChartLineUp,
  Scales,
  PresentationChart,
  Graph
} from "@phosphor-icons/react";
import { projects } from "@/data/projectData";
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
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";

// Define phase data structure
interface PhaseSection {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  content: string;
  tasks: PhaseTask[];
  hasVisualizations?: boolean;
}

interface PhaseTask {
  id: string;
  title: string;
  completed: boolean;
}

interface PhaseData {
  id: number;
  name: string;
  description: string;
  progress: number;
  sections: PhaseSection[];
}

// Mock data for charts
const marketData = [
  { name: 'Target Group A', value: 45 },
  { name: 'Target Group B', value: 30 },
  { name: 'Target Group C', value: 15 },
  { name: 'Target Group D', value: 10 },
];

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

const riskData = [
  { risk: 'Financial', probability: 3, impact: 4, score: 12 },
  { risk: 'Technical', probability: 2, impact: 5, score: 10 },
  { risk: 'Schedule', probability: 4, impact: 3, score: 12 },
  { risk: 'Resource', probability: 3, impact: 3, score: 9 },
  { risk: 'Stakeholder', probability: 2, impact: 4, score: 8 },
];

const COLORS = ['#9b87f5', '#F97316', '#0EA5E9', '#D946EF', '#10B981'];

// Phase icons mapping
const phaseIcons: Record<number, JSX.Element> = {
  1: <Lightbulb size={24} />,
  2: <MagnifyingGlass size={24} />,
  3: <Gear size={24} />,
  4: <Play size={24} />,
  5: <ChartLineUp size={24} />,
  6: <PresentationChart size={24} />
};

// Section icons mapping
const sectionIcons: Record<string, JSX.Element> = {
  "problem": <Target size={20} />,
  "idea": <Lightbulb size={20} />,
  "objectives": <Target size={20} />,
  "market": <ChartBar size={20} />,
  "technical": <Gear size={20} />,
  "financial": <CurrencyDollar size={20} />,
  "risk": <Scales size={20} />,
  "proposal": <FileText size={20} />,
  "workplan": <Calendar size={20} />,
  "budget": <CurrencyDollar size={20} />,
  "funding": <Handshake size={20} />,
  "mobilization": <UsersThree size={20} />,
  "execution": <Play size={20} />,
  "documentation": <ClipboardText size={20} />,
  "monitoring": <ChartLineUp size={20} />,
  "evaluation": <Scales size={20} />,
  "adjustments": <Gear size={20} />,
  "report": <FileText size={20} />,
  "impact": <Graph size={20} />,
  "presentation": <PresentationChart size={20} />
};

// Get section icon based on title
const getSectionIcon = (title: string): JSX.Element => {
  const key = title.toLowerCase().split(' ')[0];
  return sectionIcons[key] || <FileText size={20} />;
};

const ProjectPhaseDetail = () => {
  const { projectId, phaseId } = useParams<{ projectId: string, phaseId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("content");
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [phaseData, setPhaseData] = useState<PhaseData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Find the project
  const project = projects.find(p => p.id === parseInt(projectId || "0"));
  
  // Mock phase data based on phase ID
  useEffect(() => {
    // Simulate loading data
    setIsLoading(true);
    
    setTimeout(() => {
      // Generate mock data for the phase
      const mockPhaseData = generateMockPhaseData(parseInt(phaseId || "1"));
      setPhaseData(mockPhaseData);
      
      // Set the first section as active by default
      if (mockPhaseData.sections.length > 0) {
        setActiveSection(mockPhaseData.sections[0].id);
      }
      
      setIsLoading(false);
    }, 500);
  }, [phaseId]);
  
  // Generate mock data for each phase
  const generateMockPhaseData = (phaseId: number): PhaseData => {
    const phases: Record<number, PhaseData> = {
      1: {
        id: 1,
        name: "Concept Development",
        description: "Define the problem, develop the idea, and set objectives",
        progress: 75,
        sections: [
          {
            id: "problem",
            title: "Define the Problem or Opportunity",
            description: "What gap or need does the project address?",
            completed: true,
            content: "This project addresses the spiritual needs of workers in various companies who lack access to regular spiritual guidance and support.",
            tasks: [
              { id: "p1", title: "Identify the target audience", completed: true },
              { id: "p2", title: "Research existing solutions", completed: true },
              { id: "p3", title: "Document the gap or need", completed: true }
            ]
          },
          {
            id: "idea",
            title: "Develop the Idea",
            description: "Brainstorm and outline the core concept or solution.",
            completed: true,
            content: "Provide regular spiritual programs, counseling, and resources to workers through on-site visits and digital platforms.",
            tasks: [
              { id: "i1", title: "Brainstorm potential solutions", completed: true },
              { id: "i2", title: "Outline core concept", completed: true },
              { id: "i3", title: "Get feedback from stakeholders", completed: false }
            ]
          },
          {
            id: "objectives",
            title: "Set Objectives",
            description: "SMART goals: Specific, Measurable, Achievable, Relevant, Time-bound.",
            completed: false,
            content: "1. Conduct 3 weeks of spiritual emphasis per year at each company\n2. Establish prayer rooms at 5 companies by end of 2025\n3. Reach 1000+ workers through various programs",
            tasks: [
              { id: "o1", title: "Define specific goals", completed: true },
              { id: "o2", title: "Ensure goals are measurable", completed: true },
              { id: "o3", title: "Set timeframes for each goal", completed: false },
              { id: "o4", title: "Align with organizational mission", completed: false }
            ]
          }
        ]
      },
      // Additional phases would be defined here
    };
    
    // Return the requested phase or a default if not found
    return phases[phaseId] || {
      id: phaseId,
      name: `Phase ${phaseId}`,
      description: "Phase description",
      progress: 0,
      sections: []
    };
  };
  
  // Handle section completion toggle
  const toggleSectionCompletion = (sectionId: string) => {
    if (!phaseData) return;
    
    setPhaseData({
      ...phaseData,
      sections: phaseData.sections.map(section => 
        section.id === sectionId 
          ? { ...section, completed: !section.completed }
          : section
      )
    });
  };
  
  // Handle task completion toggle
  const toggleTaskCompletion = (sectionId: string, taskId: string) => {
    if (!phaseData) return;
    
    setPhaseData({
      ...phaseData,
      sections: phaseData.sections.map(section => 
        section.id === sectionId 
          ? { 
              ...section, 
              tasks: section.tasks.map(task => 
                task.id === taskId 
                  ? { ...task, completed: !task.completed }
                  : task
              )
            }
          : section
      )
    });
  };
  
  // Update section content
  const updateSectionContent = (sectionId: string, content: string) => {
    if (!phaseData) return;
    
    setPhaseData({
      ...phaseData,
      sections: phaseData.sections.map(section => 
        section.id === sectionId 
          ? { ...section, content }
          : section
      )
    });
  };
  
  // Add a new task to a section
  const addTask = (sectionId: string) => {
    if (!phaseData) return;
    
    const newTask: PhaseTask = {
      id: `task-${Date.now()}`,
      title: "New task",
      completed: false
    };
    
    setPhaseData({
      ...phaseData,
      sections: phaseData.sections.map(section => 
        section.id === sectionId 
          ? { ...section, tasks: [...section.tasks, newTask] }
          : section
      )
    });
  };
  
  // Update task title
  const updateTaskTitle = (sectionId: string, taskId: string, title: string) => {
    if (!phaseData) return;
    
    setPhaseData({
      ...phaseData,
      sections: phaseData.sections.map(section => 
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
    });
  };
  
  // Delete a task
  const deleteTask = (sectionId: string, taskId: string) => {
    if (!phaseData) return;
    
    setPhaseData({
      ...phaseData,
      sections: phaseData.sections.map(section => 
        section.id === sectionId 
          ? { 
              ...section, 
              tasks: section.tasks.filter(task => task.id !== taskId)
            }
          : section
      )
    });
  };
  
  // Calculate overall phase progress
  const calculatePhaseProgress = (): number => {
    if (!phaseData) return 0;
    
    const totalTasks = phaseData.sections.reduce(
      (total, section) => total + section.tasks.length, 0
    );
    
    const completedTasks = phaseData.sections.reduce(
      (total, section) => total + section.tasks.filter(task => task.completed).length, 0
    );
    
    return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  };
  
  // Render appropriate visualization based on section
  const renderVisualization = (sectionId: string) => {
    switch(sectionId) {
      case "market":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={marketData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {marketData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
      case "budget":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={budgetData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="amount" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        );
      case "workplan":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="planned" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        );
      case "risk":
        return (
          <div className="mt-4">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 text-left">Risk</th>
                    <th className="p-2 text-left">Probability (1-5)</th>
                    <th className="p-2 text-left">Impact (1-5)</th>
                    <th className="p-2 text-left">Risk Score</th>
                  </tr>
                </thead>
                <tbody>
                  {riskData.map((risk, index) => (
                    <tr key={index} className="border-t">
                      <td className="p-2">{risk.risk}</td>
                      <td className="p-2">{risk.probability}</td>
                      <td className="p-2">{risk.impact}</td>
                      <td className="p-2">
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
          </div>
        );
      default:
        return null;
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading phase data...</p>
        </div>
      </div>
    );
  }
  
  if (!phaseData) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Phase data not found</p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => navigate(`/project/${projectId}`)}
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Project
        </Button>
      </div>
    );
  }
  
  const activePhaseSection = activeSection 
    ? phaseData.sections.find(section => section.id === activeSection) 
    : null;
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate(`/project/${projectId}`)}
          >
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{phaseData.name}</h1>
            <p className="text-gray-600">{project?.name || "Project"}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="text-right">
            <div className="text-sm font-medium">Phase Progress</div>
            <div className="text-2xl font-bold">{calculatePhaseProgress()}%</div>
          </div>
          <div className="w-16 h-16 rounded-full border-4 border-primary-100 flex items-center justify-center">
            {phaseIcons[phaseData.id] || <Circle size={24} />}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar with sections */}
        <div className="space-y-2">
          {phaseData.sections.map(section => (
            <div 
              key={section.id}
              className={cn(
                "p-3 border rounded-lg cursor-pointer transition-all",
                activeSection === section.id ? "border-primary-500 bg-primary-50" : "hover:bg-gray-50",
                section.completed ? "border-green-200 bg-green-50" : ""
              )}
              onClick={() => setActiveSection(section.id)}
            >
              <div className="flex items-start gap-3">
                <div className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center",
                  section.completed ? "bg-green-100 text-green-600" : "bg-primary-100 text-primary-500"
                )}>
                  {section.completed ? <CheckCircle size={16} weight="fill" /> : getSectionIcon(section.title)}
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium">{section.title}</h3>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-gray-500 line-clamp-1">{section.description}</p>
                    <div className="flex items-center">
                      <span className="text-xs text-gray-500">
                        {section.tasks.filter(t => t.completed).length}/{section.tasks.length}
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
          {activePhaseSection ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center",
                      activePhaseSection.completed ? "bg-green-100 text-green-600" : "bg-primary-100 text-primary-500"
                    )}>
                      {activePhaseSection.completed ? 
                        <CheckCircle size={20} weight="fill" /> : 
                        getSectionIcon(activePhaseSection.title)
                      }
                    </div>
                    <div>
                      <CardTitle>{activePhaseSection.title}</CardTitle>
                      <CardDescription>{activePhaseSection.description}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id={`complete-${activePhaseSection.id}`}
                      checked={activePhaseSection.completed}
                      onCheckedChange={() => toggleSectionCompletion(activePhaseSection.id)}
                    />
                    <Label htmlFor={`complete-${activePhaseSection.id}`}>Mark as complete</Label>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid grid-cols-3 mb-4">
                    <TabsTrigger value="content">Content</TabsTrigger>
                    <TabsTrigger value="tasks">Tasks</TabsTrigger>
                    <TabsTrigger value="files">Files</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="content" className="space-y-4">
                    <Textarea 
                      placeholder="Enter content for this section..."
                      value={activePhaseSection.content}
                      onChange={(e) => updateSectionContent(activePhaseSection.id, e.target.value)}
                      className="min-h-[200px]"
                    />
                    
                    {/* Visualizations for specific sections */}
                    {renderVisualization(activePhaseSection.id)}
                  </TabsContent>
                  
                  <TabsContent value="tasks" className="space-y-4">
                    <div className="space-y-2">
                      {activePhaseSection.tasks.map(task => (
                        <div key={task.id} className="flex items-center gap-3 p-3 border rounded-lg">
                          <Checkbox 
                            id={`task-${task.id}`}
                            checked={task.completed}
                            onCheckedChange={() => toggleTaskCompletion(activePhaseSection.id, task.id)}
                          />
                          <Input 
                            value={task.title}
                            onChange={(e) => updateTaskTitle(activePhaseSection.id, task.id, e.target.value)}
                            className="flex-1"
                          />
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => deleteTask(activePhaseSection.id, task.id)}
                          >
                            <Trash size={16} />
                          </Button>
                        </div>
                      ))}
                    </div>
                    
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => addTask(activePhaseSection.id)}
                    >
                      <PlusCircle size={16} className="mr-2" />
                      Add Task
                    </Button>
                  </TabsContent>
                  
                  <TabsContent value="files" className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <Upload size={32} className="mx-auto mb-4 text-gray-400" />
                      <p className="text-gray-500 mb-4">Upload files related to this section</p>
                      <div className="flex justify-center">
                        <Button className="flex items-center gap-2">
                          <Upload size={16} />
                          <span>Upload Files</span>
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {/* Mock files */}
                      {[
                        { name: "Requirements Document.pdf", date: "2025-01-15", size: "1.2 MB" },
                        { name: "Meeting Notes.docx", date: "2025-01-20", size: "450 KB" }
                      ].map((file, i) => (
                        <div key={i} className="flex items-center justify-between p-3 border rounded-md">
                          <div className="flex items-center gap-2">
                            <FileText size={20} className="text-gray-500" />
                            <div>
                              <p className="font-medium">{file.name}</p>
                              <p className="text-xs text-gray-500">{file.date} • {file.size}</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="icon">
                            <Download size={16} />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              
              <CardFooter className="flex justify-between">
                <Button 
                  variant="outline"
                  onClick={() => {
                    const currentIndex = phaseData.sections.findIndex(s => s.id === activeSection);
                    if (currentIndex > 0) {
                      setActiveSection(phaseData.sections[currentIndex - 1].id);
                    }
                  }}
                  disabled={phaseData.sections.findIndex(s => s.id === activeSection) === 0}
                >
                  Previous Section
                </Button>
                
                <Button
                  onClick={() => {
                    const currentIndex = phaseData.sections.findIndex(s => s.id === activeSection);
                    if (currentIndex < phaseData.sections.length - 1) {
                      setActiveSection(phaseData.sections[currentIndex + 1].id);
                    }
                  }}
                  disabled={phaseData.sections.findIndex(s => s.id === activeSection) === phaseData.sections.length - 1}
                >
                  Next Section
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-gray-500">Select a section to view details</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectPhaseDetail;
