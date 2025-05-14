import React from 'react';
import { Link } from 'react-router-dom';
import { Project } from '@/data/projectData';
import {
  Buildings, Calendar, Users, Radio, Briefcase, GraduationCap,
  FirstAid, Church, ShieldStar, Trophy, Robot, Heartbeat, Broadcast,
  BookOpen, Globe, Handshake, Storefront, ArrowRight
} from '@phosphor-icons/react';

interface ProjectBoxesProps {
  projects: Project[];
}

/**
 * Bento box style project layout with detailed information
 */
const ProjectBoxes: React.FC<ProjectBoxesProps> = ({
  projects
}) => {
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



  return (
    <div className="grid grid-cols-5 gap-4">
      {projects.map((project) => {
        const icon = getProjectIcon(project);

        return (
          <div key={project.id} className="flex flex-col">
            {/* Project title - blue background with white text */}
            <div className="bg-blue-600 text-white py-2 px-3 text-center font-semibold rounded-t-md">
              {project.name}
            </div>

            {/* Project content - beige background with details */}
            <div className="bg-[#e6d7b3] p-4 text-sm text-gray-800 flex-1 border border-gray-300 rounded-b-md">
              <div className="flex justify-center mb-3">
                <div className="text-blue-700 text-3xl">
                  {icon}
                </div>
              </div>

              <p className="text-center mb-4 text-sm">{project.description}</p>

              {project.date && (
                <div className="text-xs mt-2">
                  <span className="font-semibold">Date:</span> {project.date}
                </div>
              )}

              {project.location && (
                <div className="text-xs mt-1">
                  <span className="font-semibold">Location:</span> {project.location}
                </div>
              )}

              {project.attendees && (
                <div className="text-xs mt-1">
                  <span className="font-semibold">Attendees:</span> {project.attendees}
                </div>
              )}

              {/* Progress bar */}
              {project.progress !== undefined && (
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-600">Progress</span>
                    <span className="text-xs font-medium text-blue-800">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Implementation link */}
              <div className="mt-4 text-center">
                <Link
                  to={`/project/${project.id}`}
                  className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  View Implementation <ArrowRight size={14} className="ml-1" />
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProjectBoxes;
