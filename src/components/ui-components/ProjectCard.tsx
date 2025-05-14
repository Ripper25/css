
import { CalendarBlank, CaretRight } from "@phosphor-icons/react";
import { Link } from "react-router-dom";

interface ProjectCardProps {
  id: number;
  name: string;
  description: string;
  date?: string;
}

const ProjectCard = ({ id, name, description, date }: ProjectCardProps) => {
  return (
    <Link to={`/project/${id}`} className="block">
      <div className="ios-card mb-4 hover:shadow-lg transition-all">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
            <p className="mt-1 text-sm text-gray-600 line-clamp-2">{description}</p>
            
            {date && (
              <div className="mt-3 flex items-center text-xs text-gray-500">
                <CalendarBlank size={14} className="mr-1" />
                {date}
              </div>
            )}
          </div>
          
          <div className="ml-2 p-2 text-primary-500">
            <CaretRight size={20} weight="bold" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;
