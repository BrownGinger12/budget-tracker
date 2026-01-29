// src/components/Sidebar.tsx
import React from "react";
import { Settings, Flame, ChevronRight, User } from "lucide-react";
import { useAuth } from "../context/authContext";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  setActivePage: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  setActivePage,
}) => {
  const { userProfile } = useAuth();

  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleViewProfile = () => {
    setActivePage("profile");
    onClose();
  };

  const handleSettings = () => {
    setActivePage("settings");
    onClose();
  };

  if (!userProfile) return null;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        ></div>
      )}

      <div
        className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-80 bg-gradient-to-b from-blue-50 to-white border-r border-blue-100 
        flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        <button
          onClick={onClose}
          className="lg:hidden absolute top-4 right-4 p-2 rounded-lg text-gray-600 hover:bg-blue-100"
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="p-6 border-b border-blue-100">
          <h2 className="text-sm font-semibold text-blue-600 uppercase tracking-wider">
            Profile
          </h2>
        </div>

        <div className="flex-1 p-6 overflow-y-auto">
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-4">
              {userProfile.avatarUrl ? (
                <img
                  src={userProfile.avatarUrl}
                  alt={userProfile.name}
                  className="w-24 h-24 rounded-full border-4 border-blue-200 object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-full border-4 border-blue-200 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-2xl font-bold text-white">
                  {getInitials(userProfile.name)}
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 bg-green-500 w-6 h-6 rounded-full border-4 border-white"></div>
            </div>

            <h3 className="text-xl font-bold mb-1 text-gray-800">
              {userProfile.name}
            </h3>
            <p className="text-sm text-gray-500 mb-6">{userProfile.email}</p>

            <div className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-lg p-4 mb-6 shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Flame className="w-8 h-8 text-white" />
                  <div className="text-left text-white">
                    <p className="text-2xl font-bold">{userProfile.streak}</p>
                    <p className="text-sm opacity-90">Day Streak</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-white opacity-70" />
              </div>
            </div>

            <div className="w-full space-y-3">
              <button
                onClick={handleViewProfile}
                className="w-full bg-blue-500 hover:bg-blue-600 transition-colors rounded-lg p-3 flex items-center justify-between group text-white"
              >
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5" />
                  <span className="font-medium">View Profile</span>
                </div>
                <ChevronRight className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity" />
              </button>

              <button
                onClick={handleSettings}
                className="w-full bg-white hover:bg-gray-50 border-2 border-blue-500 transition-colors rounded-lg p-3 flex items-center justify-between group text-blue-600"
              >
                <div className="flex items-center space-x-3">
                  <Settings className="w-5 h-5" />
                  <span className="font-medium">Settings</span>
                </div>
                <ChevronRight className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
