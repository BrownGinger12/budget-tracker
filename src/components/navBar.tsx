import React, { useState } from "react";
import {
  LayoutDashboard,
  TrendingUp,
  PiggyBank,
  Bell,
  LogOut,
} from "lucide-react";

interface NavItem {
  name: string;
  icon: React.ReactNode;
  path: string;
}

const Navbar: React.FC<{
  activePage: string;
  setActivePage: (page: string) => void;
}> = ({ activePage, setActivePage }) => {
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

  return (
    <nav className="bg-white border-b border-blue-100 shadow-sm">
      <div className="w-full px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <PiggyBank className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
              Budget Tracker
            </h1>
          </div>

          <div className="flex items-center space-x-1">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => setActivePage(item.path)}
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200
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
          </div>

          <button
            className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
            onClick={() => console.log("Logging out...")}
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
