// src/MainPage.tsx
import React, { useState } from "react";
import ProfilePage from "./profilePage";
import SettingsPage from "./settingsPage";
import TrackingPage from "./trackingPage";
import DashboardPage from "./dashboardPage";
import SavingsPage from "./savingsPage";
import HistoryPage from "./historyPage";
import Navbar from "../components/navBar";
import Sidebar from "../components/sideBar";

const MainPage: React.FC = () => {
  const [activePage, setActivePage] = useState<string>("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);


  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handlePageChange = (page: string) => {
    setActivePage(page);
    setIsSidebarOpen(false);
  };

  const renderPage = () => {
    switch (activePage) {
      case "profile":
        return <ProfilePage />;
      case "settings":
        return <SettingsPage />;
      case "tracking":
        return <TrackingPage />;
      case "dashboard":
        return <DashboardPage />;
      case "savings":
        return <SavingsPage />;
      case "history":
        return <HistoryPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="w-full h-screen flex flex-col overflow-hidden">
      <Navbar
        activePage={activePage}
        setActivePage={handlePageChange}
        toggleSidebar={toggleSidebar}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={closeSidebar}
          setActivePage={handlePageChange}
        />
        <main className="flex-1 overflow-auto bg-gradient-to-b from-blue-50 to-white">
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

export default MainPage;
