
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { 
  BarChart as BarChartIcon, 
  Clock, 
  Users, 
  Save,
  ArrowRight,
  ArrowDown,
  Calendar
} from "lucide-react";
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

interface ProjectAdjustmentsProps {
  projectId: number;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  hours: number;
}

const ProjectAdjustments = ({ projectId }: ProjectAdjustmentsProps) => {
  const [activeTab, setActiveTab] = useState<string>("budget");
  
  // Budget state
  const [budgetData, setBudgetData] = useState([
    { category: 'Equipment', planned: 50000, actual: 45000 },
    { category: 'Personnel', planned: 75000, actual: 78000 },
    { category: 'Marketing', planned: 25000, actual: 22000 },
    { category: 'Services', planned: 35000, actual: 32000 },
    { category: 'Misc', planned: 15000, actual: 18000 },
  ]);
  
  // Timeline state
  const [timelineData, setTimelineData] = useState([
    { month: 'Jan', planned: 10, actual: 8 },
    { month: 'Feb', planned: 20, actual: 18 },
    { month: 'Mar', planned: 30, actual: 25 },
    { month: 'Apr', planned: 40, actual: 35 },
    { month: 'May', planned: 50, actual: 45 },
    { month: 'Jun', planned: 60, actual: 52 },
  ]);
  
  // Team state
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { id: '1', name: 'John Smith', role: 'Project Manager', hours: 40 },
    { id: '2', name: 'Maria Garcia', role: 'Developer', hours: 35 },
    { id: '3', name: 'David Chen', role: 'Designer', hours: 30 },
    { id: '4', name: 'Sarah Jones', role: 'Content Writer', hours: 25 },
  ]);
  
  // Update budget category value
  const updateBudgetActual = (categoryIndex: number, newValue: number) => {
    const newBudgetData = [...budgetData];
    newBudgetData[categoryIndex] = {
      ...newBudgetData[categoryIndex],
      actual: newValue
    };
    setBudgetData(newBudgetData);
  };
  
  // Update timeline value
  const updateTimelineActual = (monthIndex: number, newValue: number) => {
    const newTimelineData = [...timelineData];
    newTimelineData[monthIndex] = {
      ...newTimelineData[monthIndex],
      actual: newValue
    };
    setTimelineData(newTimelineData);
  };
  
  // Add team member
  const addTeamMember = () => {
    const newMember: TeamMember = {
      id: Date.now().toString(),
      name: '',
      role: '',
      hours: 0
    };
    setTeamMembers([...teamMembers, newMember]);
  };
  
  // Update team member
  const updateTeamMember = (id: string, field: keyof TeamMember, value: string | number) => {
    setTeamMembers(teamMembers.map(member => 
      member.id === id ? { ...member, [field]: value } : member
    ));
  };
  
  // Remove team member
  const removeTeamMember = (id: string) => {
    setTeamMembers(teamMembers.filter(member => member.id !== id));
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Project Adjustments</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="budget" className="flex items-center gap-1">
              <BarChartIcon size={16} />
              <span>Budget</span>
            </TabsTrigger>
            <TabsTrigger value="timeline" className="flex items-center gap-1">
              <Clock size={16} />
              <span>Timeline</span>
            </TabsTrigger>
            <TabsTrigger value="team" className="flex items-center gap-1">
              <Users size={16} />
              <span>Team</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="budget" className="space-y-4">
            <div className="mb-6">
              <h3 className="text-md font-medium mb-2">Budget Allocation & Adjustment</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={budgetData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="planned" fill="#9b87f5" name="Planned" />
                  <Bar dataKey="actual" fill="#F97316" name="Actual" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-4">
              {budgetData.map((item, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-1/4">
                    <Label className="text-sm">{item.category}</Label>
                  </div>
                  <div className="w-1/4">
                    <Label className="text-xs text-gray-500">Planned</Label>
                    <Input 
                      type="number" 
                      value={item.planned} 
                      disabled 
                      className="bg-gray-50"
                    />
                  </div>
                  <div className="w-1/4">
                    <Label className="text-xs text-gray-500">Actual</Label>
                    <Input 
                      type="number" 
                      value={item.actual} 
                      onChange={(e) => updateBudgetActual(index, parseInt(e.target.value))} 
                    />
                  </div>
                  <div className="w-1/4 flex items-end">
                    <div className="text-sm">
                      <span className={item.actual > item.planned ? 'text-red-500' : 'text-green-500'}>
                        {item.actual > item.planned ? (
                          <ArrowUp size={16} className="inline mr-1" />
                        ) : (
                          <ArrowDown size={16} className="inline mr-1" />
                        )}
                        {Math.abs(((item.actual - item.planned) / item.planned) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-between items-center pt-4 border-t mt-6">
              <div>
                <p className="text-sm font-medium">Total Budget: ${budgetData.reduce((sum, item) => sum + item.planned, 0).toLocaleString()}</p>
                <p className="text-sm font-medium">Total Actual: ${budgetData.reduce((sum, item) => sum + item.actual, 0).toLocaleString()}</p>
              </div>
              <Button className="flex items-center gap-2">
                <Save size={16} />
                <span>Save Budget Adjustments</span>
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="timeline" className="space-y-4">
            <div className="mb-6">
              <h3 className="text-md font-medium mb-2">Timeline Progress</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={timelineData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="planned" stroke="#9b87f5" />
                  <Line type="monotone" dataKey="actual" stroke="#F97316" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-4">
              {timelineData.map((item, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-1/4">
                    <Label className="text-sm">{item.month}</Label>
                  </div>
                  <div className="w-1/4">
                    <Label className="text-xs text-gray-500">Planned Progress</Label>
                    <Input 
                      type="number" 
                      value={item.planned} 
                      disabled 
                      className="bg-gray-50"
                    />
                  </div>
                  <div className="w-1/4">
                    <Label className="text-xs text-gray-500">Actual Progress</Label>
                    <Input 
                      type="number" 
                      value={item.actual} 
                      onChange={(e) => updateTimelineActual(index, parseInt(e.target.value))} 
                    />
                  </div>
                  <div className="w-1/4">
                    <Label className="text-xs text-gray-500">Adjust Deadline</Label>
                    <Input type="date" className="text-sm" />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-end items-center pt-4 border-t mt-6">
              <Button className="flex items-center gap-2">
                <Calendar size={16} />
                <span>Update Project Timeline</span>
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="team" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-md font-medium">Team Allocation</h3>
              <Button onClick={addTeamMember} className="flex items-center gap-2">
                <Users size={16} />
                <span>Add Team Member</span>
              </Button>
            </div>
            
            <div className="space-y-4">
              {teamMembers.map((member) => (
                <Card key={member.id} className="border">
                  <CardContent className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <Label className="text-xs text-gray-500">Name</Label>
                        <Input 
                          value={member.name} 
                          onChange={(e) => updateTeamMember(member.id, 'name', e.target.value)} 
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-gray-500">Role</Label>
                        <Input 
                          value={member.role} 
                          onChange={(e) => updateTeamMember(member.id, 'role', e.target.value)} 
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-gray-500">Hours Per Week</Label>
                        <Input 
                          type="number" 
                          value={member.hours} 
                          onChange={(e) => updateTeamMember(member.id, 'hours', parseInt(e.target.value))} 
                        />
                      </div>
                      <div className="flex items-end">
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          className="w-full"
                          onClick={() => removeTeamMember(member.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="flex justify-between items-center pt-4 border-t mt-6">
              <div>
                <p className="text-sm font-medium">Total Team Members: {teamMembers.length}</p>
                <p className="text-sm font-medium">
                  Total Weekly Hours: {teamMembers.reduce((sum, member) => sum + member.hours, 0)}
                </p>
              </div>
              <Button className="flex items-center gap-2">
                <Save size={16} />
                <span>Save Team Allocation</span>
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ProjectAdjustments;

function ArrowUp(props: any) {
  return <ArrowUp {...props} />;
}
