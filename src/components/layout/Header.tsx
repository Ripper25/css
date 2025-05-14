
import { useNavigate, Link } from "react-router-dom";
import { CaretLeft, List } from "@phosphor-icons/react";
import { useState } from "react";
import MobileNav from "./MobileNav";
import logoImage from "../../assets/images/logo.png";

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  showMenu?: boolean;
}

const Header = ({ title, showBackButton = false, showMenu = false }: HeaderProps) => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-10 bg-white bg-opacity-90 backdrop-blur-md px-4 py-2 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center">
          {showBackButton ? (
            <button
              onClick={() => navigate(-1)}
              className="mr-3 text-primary-500 p-1 rounded-full hover:bg-primary-100"
            >
              <CaretLeft size={24} />
            </button>
          ) : (
            <Link to="/" className="mr-3">
              <img src={logoImage} alt="CSS Logo" className="h-8 w-auto" />
            </Link>
          )}
          <div>
            <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
            <div className="text-xs text-gray-500">Corporate Chaplaincy Services</div>
          </div>
        </div>

        {showMenu && (
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <List size={24} />
          </button>
        )}
      </header>

      <MobileNav isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  );
};

export default Header;
