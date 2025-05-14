import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  UsersThree,
  Play,
  ClipboardText,
  CheckCircle,
  PlusCircle,
  Upload,
  FileText,
  Download,
  Trash,
  Lock,
  Image
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import TaskSuggestions from "@/components/project/TaskSuggestions";

interface ImplementationPhaseProps {
  projectId: number;
  onProgressUpdate: (progress: number) => void;
  isLocked: boolean;
}

interface ImplementationSection {
  id: string;
  title: string;
  description: string;
  icon: JSX.Element;
  content: string;
  tasks: ImplementationTask[];
  isCompleted: boolean;
  files?: ImplementationFile[];
}

interface ImplementationTask {
  id: string;
  title: string;
  isCompleted: boolean;
  dueDate?: string;
  assignee?: string;
}

interface ImplementationFile {
  id: string;
  name: string;
  type: 'image' | 'document' | 'spreadsheet';
  date: string;
  size: string;
}

const ImplementationPhase = ({ projectId, onProgressUpdate, isLocked }: ImplementationPhaseProps) => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [sections, setSections] = useState<ImplementationSection[]>([
    {
      id: "mobilization",
      title: "Mobilization",
      description: "Team recruitment, resource purchase, site prep.",
      icon: <UsersThree size={20} />,
      content: "",
      tasks: [
        { id: "m1", title: "Recruit project team members", isCompleted: false, dueDate: "2025-03-01", assignee: "Project Manager" },
        { id: "m2", title: "Purchase necessary equipment", isCompleted: false, dueDate: "2025-03-10", assignee: "Procurement Officer" },
        { id: "m3", title: "Prepare implementation site", isCompleted: false, dueDate: "2025-03-15", assignee: "Site Coordinator" },
        { id: "m4", title: "Conduct team orientation", isCompleted: false, dueDate: "2025-03-20", assignee: "Project Manager" }
      ],
      isCompleted: false
    },
    {
      id: "execution",
      title: "Execution",
      description: "Start project activities according to plan.",
      icon: <Play size={20} />,
      content: "",
      tasks: [
        { id: "e1", title: "Launch kickoff meeting", isCompleted: false, dueDate: "2025-04-01", assignee: "Project Manager" },
        { id: "e2", title: "Implement core activities", isCompleted: false, dueDate: "2025-04-15", assignee: "Implementation Team" },
        { id: "e3", title: "Track progress against timeline", isCompleted: false, dueDate: "2025-04-30", assignee: "Project Coordinator" },
        { id: "e4", title: "Conduct regular team check-ins", isCompleted: false, dueDate: "2025-05-15", assignee: "Project Manager" }
      ],
      isCompleted: false
    },
    {
      id: "documentation",
      title: "Documentation",
      description: "Record every stage—photos, reports, receipts, milestones.",
      icon: <ClipboardText size={20} />,
      content: "",
      tasks: [
        { id: "d1", title: "Take photos of implementation", isCompleted: false, dueDate: "2025-05-01", assignee: "Documentation Officer" },
        { id: "d2", title: "Collect receipts and invoices", isCompleted: false, dueDate: "2025-05-10", assignee: "Finance Officer" },
        { id: "d3", title: "Write progress reports", isCompleted: false, dueDate: "2025-05-20", assignee: "Project Coordinator" },
        { id: "d4", title: "Document milestone achievements", isCompleted: false, dueDate: "2025-05-30", assignee: "Project Manager" }
      ],
      isCompleted: false,
      files: [
        { id: "f1", name: "Site_Preparation.jpg", type: "image", date: "2025-03-15", size: "2.4 MB" },
        { id: "f2", name: "Team_Meeting_Minutes.docx", type: "document", date: "2025-04-02", size: "450 KB" },
        { id: "f3", name: "Equipment_Receipts.pdf", type: "document", date: "2025-03-12", size: "1.2 MB" }
      ]
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

    const newTask: ImplementationTask = {
      id: `task-${Date.now()}`,
      title: "New task",
      isCompleted: false,
      dueDate: new Date().toISOString().split('T')[0],
      assignee: "Unassigned"
    };

    setSections(prevSections =>
      prevSections.map(section =>
        section.id === sectionId
          ? { ...section, tasks: [...section.tasks, newTask] }
          : section
      )
    );
  };

  // Update task details
  const updateTask = (sectionId: string, taskId: string, updates: Partial<ImplementationTask>) => {
    if (isLocked) return;

    setSections(prevSections =>
      prevSections.map(section =>
        section.id === sectionId
          ? {
              ...section,
              tasks: section.tasks.map(task =>
                task.id === taskId
                  ? { ...task, ...updates }
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

  // Get file icon based on type
  const getFileIcon = (type: 'image' | 'document' | 'spreadsheet') => {
    switch (type) {
      case 'image':
        return <Image size={16} className="text-blue-500" />;
      case 'document':
        return <FileText size={16} className="text-red-500" />;
      case 'spreadsheet':
        return <FileText size={16} className="text-green-500" />;
      default:
        return <FileText size={16} className="text-gray-500" />;
    }
  };

  // Get active section
  const activeImplementationSection = activeSection
    ? sections.find(section => section.id === activeSection)
    : null;

  // If phase is locked, show locked message
  if (isLocked) {
    return (
      <Card className="border-dashed border-gray-300">
        <CardContent className="py-12">
          <div className="text-center">
            <Lock size={48} className="mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">Implementation Phase Locked</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Complete the Planning phase to unlock this phase.
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
        {activeImplementationSection ? (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center",
                    activeImplementationSection.isCompleted ? "bg-green-100 text-green-600" : "bg-primary-100 text-primary-500"
                  )}>
                    {activeImplementationSection.isCompleted ?
                      <CheckCircle size={20} weight="fill" /> :
                      activeImplementationSection.icon
                    }
                  </div>
                  <div>
                    <CardTitle>{activeImplementationSection.title}</CardTitle>
                    <CardDescription>{activeImplementationSection.description}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id={`complete-${activeImplementationSection.id}`}
                    checked={activeImplementationSection.isCompleted}
                    onCheckedChange={() => toggleSectionCompletion(activeImplementationSection.id)}
                  />
                  <Label htmlFor={`complete-${activeImplementationSection.id}`}>Mark as complete</Label>
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
                  placeholder={`Describe the ${activeImplementationSection.title.toLowerCase()} process...`}
                  value={activeImplementationSection.content}
                  onChange={(e) => updateSectionContent(activeImplementationSection.id, e.target.value)}
                  className="min-h-[150px]"
                />
              </div>

              {/* Task Suggestions */}
              <TaskSuggestions
                projectId={projectId}
                projectName={activeImplementationSection.title}
                phase="implementation"
                onAddTask={(task) => {
                  const newTask: ImplementationTask = {
                    id: `task-${Date.now()}`,
                    title: task.title,
                    isCompleted: false,
                    dueDate: task.dueDate,
                    assignee: task.assignee
                  };

                  setSections(prevSections =>
                    prevSections.map(section =>
                      section.id === activeImplementationSection.id
                        ? { ...section, tasks: [...section.tasks, newTask] }
                        : section
                    )
                  );
                }}
                className="mb-6"
              />

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-medium">Implementation Tasks</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addTask(activeImplementationSection.id)}
                    className="h-8 text-xs"
                  >
                    <PlusCircle size={14} className="mr-1" />
                    Add Task
                  </Button>
                </div>

                <div className="space-y-3">
                  {activeImplementationSection.tasks.map(task => (
                    <div key={task.id} className="border rounded-lg overflow-hidden">
                      <div className="flex items-center gap-3 p-3">
                        <Checkbox
                          id={`task-${task.id}`}
                          checked={task.isCompleted}
                          onCheckedChange={() => toggleTaskCompletion(activeImplementationSection.id, task.id)}
                        />
                        <Input
                          value={task.title}
                          onChange={(e) => updateTask(activeImplementationSection.id, task.id, { title: e.target.value })}
                          className="flex-1 border-0 focus-visible:ring-0 p-0 h-auto"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteTask(activeImplementationSection.id, task.id)}
                          className="h-8 w-8"
                        >
                          <Trash size={14} />
                        </Button>
                      </div>

                      <div className="bg-gray-50 p-3 grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <Label className="text-xs text-gray-500 mb-1 block">Due Date</Label>
                          <Input
                            type="date"
                            value={task.dueDate || ''}
                            onChange={(e) => updateTask(activeImplementationSection.id, task.id, { dueDate: e.target.value })}
                            className="h-8 text-xs"
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-gray-500 mb-1 block">Assignee</Label>
                          <Input
                            value={task.assignee || ''}
                            onChange={(e) => updateTask(activeImplementationSection.id, task.id, { assignee: e.target.value })}
                            className="h-8 text-xs"
                            placeholder="Assignee name"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">
                  Implementation Documentation
                </Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload size={24} className="mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-500 mb-2">Upload implementation documents, photos, and receipts</p>
                  <Button size="sm" className="h-8 text-xs">
                    <Upload size={14} className="mr-1" />
                    Upload Files
                  </Button>
                </div>

                {/* Files section */}
                {activeImplementationSection.files && activeImplementationSection.files.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {activeImplementationSection.files.map(file => (
                      <div key={file.id} className="flex items-center justify-between p-2 border rounded-md">
                        <div className="flex items-center gap-2">
                          {getFileIcon(file.type)}
                          <div>
                            <p className="text-sm font-medium">{file.name}</p>
                            <p className="text-xs text-gray-500">{file.date} • {file.size}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Download size={14} />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Implementation progress */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label className="text-sm font-medium">Implementation Progress</Label>
                  <span className="text-sm font-medium">
                    {activeImplementationSection.tasks.filter(t => t.isCompleted).length}/{activeImplementationSection.tasks.length} tasks
                  </span>
                </div>
                <Progress
                  value={
                    activeImplementationSection.tasks.length > 0
                      ? (activeImplementationSection.tasks.filter(t => t.isCompleted).length / activeImplementationSection.tasks.length) * 100
                      : 0
                  }
                  className="h-2"
                />
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

export default ImplementationPhase;
