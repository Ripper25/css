import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Project } from '@/data/projectData';
import {
  Buildings, Calendar, Users, Radio, Briefcase, GraduationCap,
  FirstAid, Church, ShieldStar, Trophy, Robot, Heartbeat, Broadcast,
  BookOpen, Globe, Handshake, Storefront
} from '@phosphor-icons/react';

interface ProjectTabsProps {
  projects: Project[];
  selectedProjectId?: number;
  onSelectProject?: (projectId: number) => void;
}

/**
 * Beautiful box-style project tabs with icons and titles
 */
const ProjectTabs: React.FC<ProjectTabsProps> = ({
  projects,
  selectedProjectId,
  onSelectProject
}) => {
  const [activeTab, setActiveTab] = useState<number>(selectedProjectId || projects[0]?.id || 0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLDivElement>(null);

  // Get icon for project based on name or id
  const getProjectIcon = (project: Project) => {
    const name = project.name.toLowerCase();

    if (name.includes('church') || name.includes('sabbath')) return <Church weight="fill" />;
    if (name.includes('training') || name.includes('cpe') || name.includes('diploma')) return <GraduationCap weight="fill" />;
    if (name.includes('hospital') || name.includes('arundel')) return <FirstAid weight="fill" />;
    if (name.includes('radio') || name.includes('station')) return <Radio weight="fill" />;
    if (name.includes('police') || name.includes('zrp') || name.includes('commissioner')) return <ShieldStar weight="fill" />;
    if (name.includes('sport') || name.includes('team')) return <Trophy weight="fill" />;
    if (name.includes('chat') || name.includes('bot') || name.includes('ai')) return <Robot weight="fill" />;
    if (name.includes('rehabilitation') || name.includes('recovery')) return <Heartbeat weight="fill" />;
    if (name.includes('congress') || name.includes('endorsement')) return <Globe weight="fill" />;
    if (name.includes('chaplaincy') || name.includes('chaplain')) return <Handshake weight="fill" />;
    if (name.includes('zitf') || name.includes('booth')) return <Storefront weight="fill" />;
    if (name.includes('wose') || name.includes('spiritual')) return <BookOpen weight="fill" />;
    if (name.includes('uniformed') || name.includes('forces')) return <Users weight="fill" />;
    if (name.includes('vocational') || name.includes('youth')) return <Briefcase weight="fill" />;
    if (name.includes('mine')) return <Buildings weight="fill" />;

    // Default icon based on project ID (to ensure variety)
    const iconOptions = [
      <Buildings weight="fill" />, <Calendar weight="fill" />, <Users weight="fill" />,
      <Briefcase weight="fill" />, <GraduationCap weight="fill" />, <Broadcast weight="fill" />
    ];
    return iconOptions[project.id % iconOptions.length];
  };

  // Handle tab selection
  const handleTabClick = (projectId: number) => {
    setActiveTab(projectId);
    if (onSelectProject) {
      onSelectProject(projectId);
    }
  };

  // Scroll active tab into view when it changes
  useEffect(() => {
    if (activeTabRef.current && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const activeElement = activeTabRef.current;

      // Calculate position to scroll to
      const scrollLeft = activeElement.offsetLeft - (container.clientWidth / 2) + (activeElement.clientWidth / 2);

      // Smooth scroll to the active tab
      container.scrollTo({
        left: scrollLeft,
        behavior: 'smooth'
      });
    }
  }, [activeTab]);

  return (
    <div className="relative">
      {/* Tabs container */}
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto py-2 scrollbar-hide"
      >
        <div className="flex space-x-4 px-2 pb-1">
          {projects.map((project) => {
            const isActive = project.id === activeTab;
            const icon = getProjectIcon(project);

            // Get a short title - first word or first 12 chars
            const shortTitle = project.name.split(' ')[0] || project.name.substring(0, 12);

            return (
              <div
                key={project.id}
                ref={isActive ? activeTabRef : null}
                onClick={() => handleTabClick(project.id)}
                className={`
                  relative flex-shrink-0 w-24 h-24 rounded-lg shadow-sm bg-white
                  ${isActive
                    ? 'ring-2 ring-primary-500 shadow-md'
                    : 'ring-1 ring-gray-100 hover:shadow-md'
                  }
                `}
              >
                <div
                  className="cursor-pointer h-full flex flex-col items-center justify-center p-2"
                  title={project.name}
                >
                  <div className={`text-2xl mb-2 ${isActive ? 'text-primary-500' : 'text-gray-500'}`}>
                    {icon}
                  </div>
                  <div className="text-xs font-medium text-center text-gray-700">
                    {shortTitle}
                  </div>
                  {project.progress !== undefined && (
                    <div className="w-full mt-2">
                      <div className="w-full bg-gray-100 rounded-full h-1">
                        <div
                          className="bg-primary-500 h-1 rounded-full"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProjectTabs;
