import React, { useState } from "react";
import { Settings, Flame, ChevronRight, User } from "lucide-react";

interface UserProfile {
  name: string;
  email: string;
  streak: number;
  avatarUrl: string | null;
}

export default function ProfileSidebar() {
  const [user] = useState<UserProfile>({
    name: "Miles Andray A. Casilao",
    email: "milesandray12@gmail.com",
    streak: 3,
    avatarUrl: null, // Set to null to show initials instead
  });

  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="h-screen w-80 bg-gradient-to-b from-blue-50 to-white border-r border-blue-100 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-blue-100">
        <h2 className="text-sm font-semibold text-blue-600 uppercase tracking-wider">
          Profile
        </h2>
      </div>

      {/* Profile Section */}
      <div className="flex-1 p-6">
        <div className="flex flex-col items-center text-center">
          {/* Profile Picture */}
          <div className="relative mb-4">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-24 h-24 rounded-full border-4 border-blue-200 object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-full border-4 border-blue-200 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-2xl font-bold text-white">
                {getInitials(user.name)}
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 bg-green-500 w-6 h-6 rounded-full border-4 border-white"></div>
          </div>

          {/* User Name */}
          <h3 className="text-xl font-bold mb-1 text-gray-800">{user.name}</h3>
          <p className="text-sm text-gray-500 mb-6">{user.email}</p>

          {/* Streak Card */}
          <div className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-lg p-4 mb-6 shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Flame className="w-8 h-8 text-white" />
                <div className="text-left text-white">
                  <p className="text-2xl font-bold">{user.streak}</p>
                  <p className="text-sm opacity-90">Day Streak</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-white opacity-70" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="w-full space-y-3">
            <button className="w-full bg-blue-500 hover:bg-blue-600 transition-colors rounded-lg p-3 flex items-center justify-between group text-white">
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5" />
                <span className="font-medium">View Profile</span>
              </div>
              <ChevronRight className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity" />
            </button>

            <button className="w-full bg-white hover:bg-gray-50 border-2 border-blue-500 transition-colors rounded-lg p-3 flex items-center justify-between group text-blue-600">
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
  );
}
