
import { X, House, User, Lightbulb, Calendar, Target } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import logoImage from "../../assets/images/logo.png";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileNav = ({ isOpen, onClose }: MobileNavProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="fixed right-0 top-0 h-full w-4/5 max-w-sm bg-white shadow-lg flex flex-col animate-in slide-in-from-right">
        <div className="flex justify-between items-center p-4 border-b">
          <div className="flex items-center">
            <img src={logoImage} alt="CSS Logo" className="h-8 w-auto mr-3" />
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
              <div className="text-xs text-gray-500">Corporate Chaplaincy Services</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-auto py-2">
          <nav className="space-y-1 px-3">
            <NavLink to="/" icon={<House size={20} />} onClick={onClose}>
              Home
            </NavLink>
            <NavLink to="/about" icon={<User size={20} />} onClick={onClose}>
              About Us
            </NavLink>
            <NavLink to="/vision-mission" icon={<Lightbulb size={20} />} onClick={onClose}>
              Vision & Mission
            </NavLink>
            <NavLink to="/plans" icon={<Calendar size={20} />} onClick={onClose}>
              Our 2025 Plans
            </NavLink>
            <NavLink to="/operational-needs" icon={<Target size={20} />} onClick={onClose}>
              Operational Needs
            </NavLink>
          </nav>
        </div>

        <div className="p-4 border-t flex items-center justify-center">
          <img src={logoImage} alt="CSS Logo" className="h-6 w-auto mr-2" />
          <div className="text-sm text-gray-500">
            Corporate Chaplaincy Services © 2025
          </div>
        </div>
      </div>
    </div>
  );
};

interface NavLinkProps {
  to: string;
  icon: React.ReactNode;
  onClick: () => void;
  children: React.ReactNode;
}

const NavLink = ({ to, icon, onClick, children }: NavLinkProps) => (
  <Link
    to={to}
    className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-primary-100 hover:text-primary-600 transition-colors"
    onClick={onClick}
  >
    <span className="text-gray-500">{icon}</span>
    <span>{children}</span>
  </Link>
);

export default MobileNav;
