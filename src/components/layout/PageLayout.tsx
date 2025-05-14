
import Header from "./Header";

interface PageLayoutProps {
  title: string;
  showBackButton?: boolean;
  showMenu?: boolean;
  children: React.ReactNode;
}

const PageLayout = ({
  title,
  showBackButton = false,
  showMenu = false, // Changed default to false to hide menu button
  children
}: PageLayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header title={title} showBackButton={showBackButton} showMenu={showMenu} />
      <main className="flex-1 px-4 py-6">
        {children}
      </main>
    </div>
  );
};

export default PageLayout;
