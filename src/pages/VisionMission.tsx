
import MainLayout from "@/components/layout/MainLayout";
import { visionMission } from "@/data/projectData";
import { Lightbulb, Target } from "@phosphor-icons/react";

const VisionMission = () => {
  return (
    <MainLayout title="Vision & Mission" showBackButton={true}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Vision & Mission</h1>
        <p className="text-gray-600">Get to know where we are headed</p>
      </div>

      {/* Vision */}
      <div className="ios-card mb-6">
        <div className="flex items-start">
          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4 text-primary-500">
            <Lightbulb size={24} weight="fill" />
          </div>
          <div>
            <h2 className="ios-header">Vision</h2>
            <p className="text-gray-600">{visionMission.vision}</p>
          </div>
        </div>
      </div>

      {/* Mission */}
      <div className="ios-card">
        <div className="flex items-start">
          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4 text-primary-500">
            <Target size={24} weight="fill" />
          </div>
          <div>
            <h2 className="ios-header">Mission</h2>
            <p className="text-gray-600">{visionMission.mission}</p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default VisionMission;
