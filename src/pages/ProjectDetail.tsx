
import { useState } from "react";
import { useParams } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Calendar, ChartBar, PresentationChart } from "@phosphor-icons/react";
import { projects } from "@/data/projectData";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import ProjectDocumentation from "@/components/project/ProjectDocumentation";
import ProjectInsights from "@/components/project/ProjectInsights";
import ProjectImplementation from "@/components/project/ProjectImplementation";

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const projectId = parseInt(id || "0");
  const [activeTab, setActiveTab] = useState<string>("overview");
  const project = projects.find(p => p.id === projectId);

  if (!project) {
    return (
      <MainLayout title="Project Not Found" showBackButton={true}>
        <div className="ios-card">
          <h2 className="text-xl font-semibold text-gray-800">Project not found</h2>
          <p className="text-gray-600 mt-2">The project you're looking for doesn't exist.</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout
      title={project.name}
      showBackButton={true}
      projectId={project.id}
      projectName={project.name}
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6 bg-[#e6d7b3] p-1 rounded-md">
          <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Overview</TabsTrigger>
          <TabsTrigger value="implementation" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Implementation</TabsTrigger>
          <TabsTrigger value="documentation" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Documentation</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="md:col-span-2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 h-full">
                {/* Project header - blue background with white text */}
                <div className="bg-blue-600 text-white py-3 px-4 text-center font-semibold">
                  {project.name}
                </div>

                <div className="p-6">
                  <p className="text-gray-700 mb-4">{project.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {project.date && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar size={18} className="mr-2 text-blue-600" />
                        <span><strong>Date:</strong> {project.date}</span>
                      </div>
                    )}

                    {project.location && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar size={18} className="mr-2 text-blue-600" />
                        <span><strong>Location:</strong> {project.location}</span>
                      </div>
                    )}

                    {project.attendees && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar size={18} className="mr-2 text-blue-600" />
                        <span><strong>Attendees:</strong> {project.attendees}</span>
                      </div>
                    )}

                    {project.progress !== undefined && (
                      <div className="flex items-center text-sm text-gray-600">
                        <ChartBar size={18} className="mr-2 text-blue-600" />
                        <span><strong>Progress:</strong> {project.progress}%</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
                    <Button
                      onClick={() => setActiveTab("implementation")}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      <PresentationChart size={20} className="mr-2" />
                      Manage Implementation
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Project Insights */}
            <div className="md:col-span-1">
              <ProjectInsights
                projectId={projectId}
                projectName={project.name}
                progress={project.progress || 0}
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
            <div className="bg-blue-600 text-white py-2 px-4 font-semibold">
              Project Details
            </div>
            <div className="p-6">
              <p className="text-gray-700">{project.details || "No additional details available for this project."}</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="implementation">
          <ProjectImplementation
            projectId={projectId}
            projectName={project.name}
            onProgressUpdate={(phaseId, progress) => {
              // Update project progress in a real implementation
              console.log(`Phase ${phaseId} progress updated to ${progress}%`);
            }}
          />
        </TabsContent>

        <TabsContent value="documentation">
          <ProjectDocumentation projectId={projectId} />
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

export default ProjectDetail;
