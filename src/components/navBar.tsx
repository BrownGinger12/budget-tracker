// src/components/Navbar.tsx
import React, { useState } from "react";
import {
  LayoutDashboard,
  TrendingUp,
  PiggyBank,
  Bell,
  LogOut,
} from "lucide-react";
import { NavItem } from "../types/types";
import { useAuth } from "../context/authContext";

interface NavbarProps {
  activePage: string;
  setActivePage: (page: string) => void;
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  activePage,
  setActivePage,
  toggleSidebar,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { logout } = useAuth();

  const navItems: NavItem[] = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
      path: "dashboard",
    },
    {
      name: "Tracking",
      icon: <TrendingUp className="w-5 h-5" />,
      path: "tracking",
    },
    {
      name: "Savings",
      icon: <PiggyBank className="w-5 h-5" />,
      path: "savings",
    },
    { name: "History", icon: <Bell className="w-5 h-5" />, path: "history" },
  ];

  const handleNavClick = (path: string) => {
    setActivePage(path);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  return (
    <nav className="bg-white border-b border-blue-100 shadow-sm">
      <div className="w-full px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br rounded-lg flex items-center justify-center">
                <img src="studget-icon.png" className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-lg md:text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                Studget
              </h1>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavClick(item.path)}
                className={`
                  flex items-center space-x-2 px-3 lg:px-4 py-2 rounded-lg transition-all duration-200
                  ${
                    activePage === item.path
                      ? "bg-blue-500 text-white shadow-md"
                      : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                  }
                `}
              >
                {item.icon}
                <span className="font-medium text-sm lg:text-base">
                  {item.name}
                </span>
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                  />
                )}
              </svg>
            </button>

            <button
              onClick={handleLogout}
              className="hidden md:flex items-center space-x-2 px-3 lg:px-4 py-2 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium text-sm lg:text-base">Logout</span>
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-blue-100">
            <div className="space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item.path)}
                  className={`
                    w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200
                    ${
                      activePage === item.path
                        ? "bg-blue-500 text-white shadow-md"
                        : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                    }
                  `}
                >
                  {item.icon}
                  <span className="font-medium">{item.name}</span>
                </button>
              ))}
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
