
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import ProjectBoxes from "@/components/ui-components/ProjectBoxes";
import ProjectTabs from "@/components/ui-components/ProjectTabs";
import { projects } from "@/data/projectData";

const Projects = () => {
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);

  // If a project is selected, show only that project, otherwise show all
  const projectsToShow = selectedProjectId
    ? projects.filter(p => p.id === selectedProjectId)
    : projects;

  return (
    <MainLayout
      title="Projects"
      showBackButton={true}
      // Pass the selected project ID if one is selected
      projectId={selectedProjectId || undefined}
      projectName={selectedProjectId ? projects.find(p => p.id === selectedProjectId)?.name : undefined}
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Our 2025 Projects</h1>
        <p className="text-gray-600">Get to know what we will be doing in 2025</p>
      </div>

      {/* Project Tabs */}
      <div className="mb-4">
        <ProjectTabs
          projects={projects}
          selectedProjectId={selectedProjectId || undefined}
          onSelectProject={(id) => setSelectedProjectId(id === selectedProjectId ? null : id)}
        />
      </div>

      <div className="mt-8">
        <ProjectBoxes projects={projectsToShow} />
      </div>
    </MainLayout>
  );
};

export default Projects;
