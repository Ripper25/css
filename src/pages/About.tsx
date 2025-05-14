
import MainLayout from "@/components/layout/MainLayout";
import { aboutInfo, clients, values } from "@/data/projectData";
import ValueCard from "@/components/ui-components/ValueCard";

const About = () => {
  return (
    <MainLayout title="About CCS" showBackButton={true}>
      {/* Strategic Plan Header */}
      <div className="text-right mb-4">
        <h3 className="text-sm font-medium text-gray-700">2024 STRATEGIC PLAN | CCS 2024</h3>
      </div>

      {/* Full Page Hero Design */}
      <div className="h-screen -mt-16 -mb-16"> {/* Negative margins to compensate for header/footer */}
        <div className="h-full flex flex-col md:flex-row">
          {/* Left side with blue gradient and text */}
          <div className="bg-gradient-to-r from-blue-800 to-blue-600 text-white p-8 md:w-1/3 flex flex-col justify-center">
            <div className="max-w-xs mx-auto md:mx-0 mt-16"> {/* Added margin-top to account for header */}
              <h1 className="text-5xl font-bold mb-2">Who<br />we are</h1>
              <div className="w-16 h-1 bg-white my-6"></div>
              <p className="text-2xl">Get to know<br />more about us</p>
            </div>
          </div>

          {/* Center image - placeholder until you provide the actual image */}
          <div className="hidden md:block md:w-1/3 bg-blue-100">
            {/* Image will be added here when provided */}
            <div className="h-full w-full bg-blue-200 opacity-80">
              {/* This div will be replaced with an actual image */}
            </div>
          </div>

          {/* Right side with content */}
          <div className="bg-white p-8 md:w-1/3 flex flex-col justify-center">
            <div className="max-w-xs mx-auto md:mx-0 mt-16"> {/* Added margin-top to account for header */}
              <p className="text-gray-800 mb-8 text-lg">
                {aboutInfo.description1}
              </p>
              <p className="text-gray-800 text-lg">
                {aboutInfo.description2}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Our Values - Hidden initially, visible when scrolling down */}
      <div className="mb-6 mt-8">
        <h2 className="ios-header mb-4">Our Values</h2>
        {values.map(value => (
          <ValueCard
            key={value.id}
            number={value.id}
            title={value.name}
          />
        ))}
      </div>

      {/* Our Clients - Hidden initially, visible when scrolling down */}
      <div className="ios-card mb-6">
        <h2 className="ios-header mb-4">Our Clients</h2>
        <div className="flex flex-wrap gap-2">
          {clients.map((client, index) => (
            <div
              key={index}
              className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-xs font-medium"
            >
              {client}
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default About;
