import React from "react";
import PageLayout from "./PageLayout";
import TabBar from "../ui-components/TabBar";

interface MainLayoutProps {
  title: string;
  showBackButton?: boolean;
  showMenu?: boolean;
  children: React.ReactNode;
  projectId?: number;
  projectName?: string;
}

/**
 * MainLayout combines PageLayout and TabBar to create a consistent layout
 * for all pages in the application.
 */
const MainLayout = ({
  title,
  showBackButton = false,
  showMenu = false, // Changed default to false to hide menu button
  children,
  projectId,
  projectName
}: MainLayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen pb-16">
      <PageLayout title={title} showBackButton={showBackButton} showMenu={showMenu}>
        {children}
      </PageLayout>

      <TabBar />
    </div>
  );
};

export default MainLayout;
