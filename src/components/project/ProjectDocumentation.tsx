
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImagePlus, FileText, Receipt, CalendarCheck, Upload } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ProjectDocumentationProps {
  projectId: number;
}

interface MilestoneType {
  id: string;
  title: string;
  date: string;
  status: 'pending' | 'completed';
  description: string;
}

const ProjectDocumentation = ({ projectId }: ProjectDocumentationProps) => {
  const [activeTab, setActiveTab] = useState<string>("photos");
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [milestones, setMilestones] = useState<MilestoneType[]>([
    {
      id: '1',
      title: 'Project Kickoff',
      date: '2025-01-15',
      status: 'completed',
      description: 'Initial meeting with all stakeholders'
    },
    {
      id: '2',
      title: 'Phase 1 Completion',
      date: '2025-02-01',
      status: 'completed',
      description: 'Concept development completed'
    },
    {
      id: '3',
      title: 'Mid-Project Review',
      date: '2025-03-15',
      status: 'pending',
      description: 'Review progress with stakeholders'
    }
  ]);
  
  const simulateUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };
  
  const addMilestone = () => {
    const newMilestone: MilestoneType = {
      id: Date.now().toString(),
      title: 'New Milestone',
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
      description: 'Describe this milestone'
    };
    
    setMilestones([...milestones, newMilestone]);
  };
  
  const updateMilestoneStatus = (id: string, status: 'pending' | 'completed') => {
    setMilestones(milestones.map(milestone => 
      milestone.id === id ? { ...milestone, status } : milestone
    ));
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Project Documentation</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="photos" className="flex items-center gap-1">
              <ImagePlus size={16} />
              <span>Photos</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-1">
              <FileText size={16} />
              <span>Reports</span>
            </TabsTrigger>
            <TabsTrigger value="receipts" className="flex items-center gap-1">
              <Receipt size={16} />
              <span>Receipts</span>
            </TabsTrigger>
            <TabsTrigger value="milestones" className="flex items-center gap-1">
              <CalendarCheck size={16} />
              <span>Milestones</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="photos" className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <ImagePlus size={48} className="mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500 mb-4">Upload project photos</p>
              <div className="flex justify-center">
                <Button onClick={simulateUpload} className="flex items-center gap-2">
                  <Upload size={16} />
                  <span>Upload Photos</span>
                </Button>
              </div>
              {isUploading && (
                <div className="mt-4">
                  <Progress value={uploadProgress} className="h-2" />
                  <p className="text-sm text-gray-500 mt-1">Uploading... {uploadProgress}%</p>
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              {/* Placeholder for images */}
              {[1, 2, 3].map(i => (
                <div key={i} className="aspect-square bg-gray-100 rounded-md flex items-center justify-center">
                  <p className="text-gray-400">Image {i}</p>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="reports" className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <FileText size={48} className="mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500 mb-4">Upload project reports</p>
              <div className="flex justify-center">
                <Button onClick={simulateUpload} className="flex items-center gap-2">
                  <Upload size={16} />
                  <span>Upload Report</span>
                </Button>
              </div>
            </div>
            <div className="space-y-3 mt-4">
              {[
                { name: "Initial Assessment Report", date: "2025-01-20" },
                { name: "Progress Report Q1", date: "2025-03-31" },
              ].map((report, i) => (
                <div key={i} className="flex items-center justify-between p-3 border rounded-md">
                  <div className="flex items-center gap-2">
                    <FileText size={20} className="text-gray-500" />
                    <div>
                      <p className="font-medium">{report.name}</p>
                      <p className="text-sm text-gray-500">{report.date}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">View</Button>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="receipts" className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Receipt size={48} className="mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500 mb-4">Upload expense receipts</p>
              <div className="flex justify-center">
                <Button onClick={simulateUpload} className="flex items-center gap-2">
                  <Upload size={16} />
                  <span>Upload Receipt</span>
                </Button>
              </div>
            </div>
            <div className="space-y-3 mt-4">
              {[
                { name: "Equipment Purchase", amount: "$1,250.00", date: "2025-01-15" },
                { name: "Venue Booking", amount: "$800.00", date: "2025-01-22" },
              ].map((receipt, i) => (
                <div key={i} className="flex items-center justify-between p-3 border rounded-md">
                  <div className="flex items-center gap-2">
                    <Receipt size={20} className="text-gray-500" />
                    <div>
                      <p className="font-medium">{receipt.name}</p>
                      <p className="text-sm text-gray-500">{receipt.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{receipt.amount}</p>
                    <Button variant="ghost" size="sm">View</Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="milestones" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Project Milestones</h3>
              <Button onClick={addMilestone} className="flex items-center gap-2">
                <CalendarCheck size={16} />
                <span>Add Milestone</span>
              </Button>
            </div>
            <div className="space-y-4">
              {milestones.map((milestone) => (
                <Card key={milestone.id} className="border">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">{milestone.title}</h4>
                        <p className="text-sm text-gray-500">Due: {milestone.date}</p>
                      </div>
                      <Button 
                        variant={milestone.status === 'completed' ? "default" : "outline"} 
                        size="sm"
                        onClick={() => updateMilestoneStatus(
                          milestone.id, 
                          milestone.status === 'completed' ? 'pending' : 'completed'
                        )}
                      >
                        {milestone.status === 'completed' ? 'Completed' : 'Mark Complete'}
                      </Button>
                    </div>
                    <p className="text-sm mt-2">{milestone.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ProjectDocumentation;
