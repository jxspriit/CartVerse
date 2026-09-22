import { Outlet } from "react-router-dom";
import SideBar from "@/components/SideBar";

const DashBoard = () => {
  return (
    <div className="min-h-screen bg-gray-50 lg:flex">
      <SideBar />

      <main className="min-w-0 flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default DashBoard;

