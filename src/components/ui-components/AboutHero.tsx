import React from 'react';

interface AboutHeroProps {
  imageSrc?: string;
}

/**
 * AboutHero component for the About page
 * Displays the hero section with the "Who we are" content
 * Matches the design exactly as shown in the provided image
 */
const AboutHero: React.FC<AboutHeroProps> = ({ imageSrc }) => {
  return (
    <div className="flex flex-col md:flex-row rounded-lg overflow-hidden shadow-md">
      {/* Left side with blue gradient and text */}
      <div className="bg-gradient-to-r from-blue-800 to-blue-600 text-white p-8 md:w-1/3">
        <h1 className="text-4xl font-bold mb-2">Who<br />we are</h1>
        <div className="w-12 h-1 bg-white my-4"></div>
        <p className="text-xl">Get to know<br />more about us</p>
      </div>
      
      {/* Center image */}
      <div className="hidden md:block md:w-1/3 bg-blue-100">
        {imageSrc ? (
          <img 
            src={imageSrc} 
            alt="CCS Team Member" 
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-blue-200 opacity-80">
            {/* This div will be replaced with an actual image */}
          </div>
        )}
      </div>
      
      {/* Right side with content */}
      <div className="bg-white p-8 md:w-1/3">
        <p className="text-gray-800 mb-6">
          CCS has partnered with Zimbabwean companies, institutions and sports teams to provide care, counsel, and crisis management services to their employees, students and team members from a Christian perspective.
        </p>
        <p className="text-gray-800">
          CCS aims to bring about total wellness in the workplace, institution and nationwide. Your mental and spiritual wellness is our ultimate responsibility.
        </p>
      </div>
    </div>
  );
};

export default AboutHero;
