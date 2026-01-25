import { Sidebar } from "lucide-react";
import Navbar from "../components/navBar";
import TrackingPage from "./trackingPage";
import { useState } from "react";
import ProfileSidebar from "../components/sideBar";
import SavingsPage from "./savingsPage";
import HistoryPage from "./historyPage";

const MainPage: React.FC = () => {
  const [activePage, setActivePage] = useState<string>("dashboard");

  const renderPage = () => {
    switch (activePage) {
      case "tracking":
        return <TrackingPage />;
      case "dashboard":
        return (
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
            <p className="text-gray-600">Dashboard page coming soon...</p>
          </div>
        );
      case "savings":
        return <SavingsPage />;
      case "history":
        return <HistoryPage />;
      default:
        return (
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
            <p className="text-gray-600">Dashboard page coming soon...</p>
          </div>
        );
    }
  };

  return (
    <div className="w-full h-screen flex flex-col">
      <Navbar activePage={activePage} setActivePage={setActivePage} />
      <div className="flex flex-1 overflow-hidden">
        <ProfileSidebar />
        <main className="flex-1 overflow-auto bg-gradient-to-b from-blue-50 to-white">
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

export default MainPage;
