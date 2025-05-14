

import { Link } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Lightbulb, Calendar } from "@phosphor-icons/react";
import ProjectCarousel from "@/components/ui-components/ProjectCarousel";

const Index = () => {
  return (
    <MainLayout
      title="CCS Management"
      showBackButton={false}
      // No specific project on the home page
    >
      {/* Quick Links */}
      <div className="mt-4 mb-6">
        <div className="flex overflow-x-auto pb-2 -mx-1">
          <QuickLink
            to="/vision-mission"
            icon={<Lightbulb size={24} />}
            label="Vision & Mission"
          />
          <QuickLink
            to="/plans"
            icon={<Calendar size={24} />}
            label="Plans"
          />
        </div>
      </div>

      {/* Project Boxes - Bento Box Style */}
      <div className="mb-12">
        <div className="flex flex-col items-center text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Our 2025 Projects</h2>
          <p className="text-gray-600">Get to know what will be doing in 2025</p>
          <div className="w-24 h-1 bg-blue-600 mt-4"></div>
        </div>

        {/* Show all projects on the home page */}
        <ProjectCarousel />
      </div>

      {/* Vision & Mission Preview */}
      <div className="mb-8 ios-card">
        <h2 className="ios-header mb-4">Our Vision</h2>
        <p className="text-gray-600 mb-4">
          To champion and become a beacon of spiritual care and wholistic wellness in the workplace, institutions, sport and beyond.
        </p>
        <Link to="/vision-mission" className="ios-button inline-block">
          Learn More
        </Link>
      </div>
    </MainLayout>
  );
};

interface QuickLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const QuickLink = ({ to, icon, label }: QuickLinkProps) => (
  <Link
    to={to}
    className="flex-shrink-0 w-20 mx-1 flex flex-col items-center p-3 rounded-xl bg-white shadow-sm border border-gray-50"
  >
    <div className="text-primary-500 mb-2">{icon}</div>
    <span className="text-xs text-gray-700 text-center">{label}</span>
  </Link>
);

export default Index;
