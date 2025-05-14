
import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, PresentationChart, ChartLineUp, ChartBar } from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";
import { Label } from "@/components/ui/label";

interface ProjectInitializationModalProps {
  projectName: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

// Mock data for charts
const budgetData = [
  { name: 'Planned', amount: 50000 },
  { name: 'Actual', amount: 45000 },
  { name: 'Remaining', amount: 5000 },
];

const timelineData = [
  { name: 'Jan', planned: 10, actual: 8 },
  { name: 'Feb', planned: 20, actual: 18 },
  { name: 'Mar', planned: 30, actual: 25 },
  { name: 'Apr', planned: 40, actual: 35 },
  { name: 'May', planned: 50, actual: 45 },
  { name: 'Jun', planned: 60, actual: 52 },
];

const impactData = [
  { name: 'Direct Beneficiaries', value: 250 },
  { name: 'Indirect Beneficiaries', value: 1000 },
  { name: 'Community Partners', value: 15 },
  { name: 'Volunteer Hours', value: 500 },
];

const COLORS = ['#9b87f5', '#F97316', '#0EA5E9', '#D946EF'];

const riskData = [
  { category: 'Financial', level: 70 },
  { category: 'Operational', level: 45 },
  { category: 'Technical', level: 30 },
  { category: 'Schedule', level: 55 },
];

const ProjectInitializationModal = ({ projectName, isOpen, onOpenChange }: ProjectInitializationModalProps) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [selectedChart, setSelectedChart] = useState<string>("budget");
  
  const steps = [
    {
      id: 1,
      title: "Concept Development",
      sections: [
        {
          title: "Define the Problem or Opportunity",
          description: "What gap or need does the project address?",
          input: "textarea"
        },
        {
          title: "Develop the Idea",
          description: "Brainstorm and outline the core concept or solution.",
          input: "textarea"
        },
        {
          title: "Set Objectives",
          description: "SMART goals: Specific, Measurable, Achievable, Relevant, Time-bound.",
          input: "textarea"
        }
      ]
    },
    {
      id: 2,
      title: "Feasibility Study",
      sections: [
        {
          title: "Market Research",
          description: "Demand, beneficiaries, competitors, trends.",
          input: "textarea"
        },
        {
          title: "Technical Feasibility",
          description: "Is it possible to execute (skills, tools, systems)?",
          input: "textarea"
        },
        {
          title: "Financial Feasibility",
          description: "Costs, revenue, ROI, funding sources.",
          input: "textarea"
        },
        {
          title: "Risk Assessment",
          description: "Identify risks and mitigation strategies.",
          input: "textarea"
        }
      ]
    },
    {
      id: 3,
      title: "Planning Phase",
      sections: [
        {
          title: "Write a Project Proposal or Business Plan",
          description: "Include all components: objectives, budget, timelines, partners, etc.",
          input: "textarea"
        },
        {
          title: "Design the Work Plan",
          description: "Tasks, roles, responsibilities, schedule (Gantt chart or calendar).",
          input: "textarea"
        },
        {
          title: "Budgeting",
          description: "Detailed financial breakdown.",
          input: "textarea"
        },
        {
          title: "Secure Funding or Resources",
          description: "Grants, investors, loans, partnerships.",
          input: "textarea"
        }
      ]
    },
    {
      id: 4,
      title: "Implementation Phase",
      sections: [
        {
          title: "Mobilization",
          description: "Team recruitment, resource purchase, site prep.",
          input: "textarea"
        },
        {
          title: "Execution",
          description: "Start project activities according to plan.",
          input: "textarea"
        },
        {
          title: "Documentation",
          description: "Record every stage—photos, reports, receipts, milestones.",
          input: "textarea"
        }
      ]
    },
    {
      id: 5,
      title: "Monitoring and Evaluation (M&E)",
      sections: [
        {
          title: "Monitoring",
          description: "Track progress (weekly/monthly reports, KPIs).",
          input: "textarea"
        },
        {
          title: "Evaluation",
          description: "Compare actual vs. planned outcomes.",
          input: "textarea"
        },
        {
          title: "Adjustments",
          description: "Realign where necessary—budget, team, timeline.",
          input: "textarea"
        }
      ]
    },
    {
      id: 6,
      title: "Reporting & Impact Assessment",
      sections: [
        {
          title: "Final Report",
          description: "Results, lessons learned, challenges, and successes.",
          input: "textarea",
          hasVisualizations: true
        },
        {
          title: "Impact Assessment",
          description: "Long-term benefits and sustainability.",
          input: "textarea",
          hasVisualizations: true
        },
        {
          title: "Stakeholder Presentation",
          description: "Share results with funders, partners, community, etc.",
          input: "textarea",
          hasVisualizations: true
        }
      ]
    }
  ];
  
  const markStepComplete = (stepId: number) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps([...completedSteps, stepId]);
    }
  };
  
  const isStepComplete = (stepId: number) => {
    return completedSteps.includes(stepId);
  };

  const renderDataVisualization = () => {
    switch (selectedChart) {
      case "budget":
        return (
          <div className="mt-4">
            <h4 className="text-md font-medium mb-2">Budget Allocation</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={budgetData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="amount" fill="#9b87f5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );
      case "timeline":
        return (
          <div className="mt-4">
            <h4 className="text-md font-medium mb-2">Project Timeline Progress</h4>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="planned" stroke="#9b87f5" />
                <Line type="monotone" dataKey="actual" stroke="#7E69AB" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        );
      case "impact":
        return (
          <div className="mt-4">
            <h4 className="text-md font-medium mb-2">Impact Distribution</h4>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={impactData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {impactData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        );
      case "risk":
        return (
          <div className="mt-4 space-y-4">
            <h4 className="text-md font-medium mb-2">Risk Assessment Levels</h4>
            {riskData.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor={`risk-${index}`}>{item.category}</Label>
                  <span className="text-sm font-medium">{item.level}%</span>
                </div>
                <Progress value={item.level} id={`risk-${index}`} className="h-2" />
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[90%] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center justify-between">
            <span>Project Implementation: {projectName}</span>
            <DialogClose className="text-gray-500 hover:text-gray-700">
              <Button variant="ghost" size="sm">Done</Button>
            </DialogClose>
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          <Accordion type="single" collapsible className="w-full">
            {steps.map((step) => (
              <AccordionItem key={step.id} value={`step-${step.id}`}>
                <AccordionTrigger className="text-lg font-medium hover:bg-gray-50 rounded-md p-2">
                  <div className="flex items-center space-x-2">
                    {isStepComplete(step.id) && (
                      <CheckCircle size={20} className="text-green-500" />
                    )}
                    <span>{step.id}. {step.title}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-2">
                  <div className="space-y-4">
                    {step.sections.map((section, idx) => (
                      <div key={idx} className="ios-card">
                        <h3 className="text-md font-medium mb-1">{section.title}</h3>
                        <p className="text-sm text-gray-600 mb-3">{section.description}</p>
                        <div className="mt-2">
                          {section.input === "textarea" ? (
                            <textarea 
                              className="w-full h-24 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                              placeholder="Enter your notes here..."
                            ></textarea>
                          ) : (
                            <Input placeholder="Enter your input here..." />
                          )}
                        </div>
                        
                        {section.hasVisualizations && (
                          <div className="mt-4 border-t pt-4">
                            <div className="flex items-center justify-between">
                              <h4 className="text-md font-medium">Data Visualizations</h4>
                              <div className="flex items-center space-x-2">
                                <Select
                                  value={selectedChart}
                                  onValueChange={setSelectedChart}
                                >
                                  <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select chart" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="budget">Budget</SelectItem>
                                    <SelectItem value="timeline">Timeline</SelectItem>
                                    <SelectItem value="impact">Impact</SelectItem>
                                    <SelectItem value="risk">Risk Assessment</SelectItem>
                                  </SelectContent>
                                </Select>
                                <Button variant="outline" size="icon">
                                  <PresentationChart size={20} />
                                </Button>
                              </div>
                            </div>
                            {renderDataVisualization()}
                          </div>
                        )}
                      </div>
                    ))}
                    
                    <div className="flex justify-end mt-4">
                      <Button 
                        onClick={() => markStepComplete(step.id)}
                        className="bg-primary-500 hover:bg-primary-600"
                      >
                        Mark as Complete
                      </Button>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectInitializationModal;
