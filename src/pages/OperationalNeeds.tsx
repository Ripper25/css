
import MainLayout from "@/components/layout/MainLayout";
import { operationalNeeds } from "@/data/projectData";
import OperationalNeedCard from "@/components/ui-components/OperationalNeedCard";

const OperationalNeeds = () => {
  return (
    <MainLayout title="Operational Needs" showBackButton={true}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Our Operational Needs</h1>
        <p className="text-gray-600">Get to know what will make us succeed.</p>
      </div>

      {operationalNeeds.map(need => (
        <OperationalNeedCard
          key={need.id}
          title={need.title}
          description={need.description}
        />
      ))}
    </MainLayout>
  );
};

export default OperationalNeeds;
