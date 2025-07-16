import React, { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false); // control sidebar state

  const sidebarWidth = collapsed ? 70 : 240;

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <div
        className="bg-dark text-white position-fixed"
        style={{
          width: `${sidebarWidth}px`,
          height: "100vh",
          transition: "width 0.3s",
          overflow: "hidden",
          zIndex: 1000,
        }}
      >
        <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>

      {/* Main Content */}
      <div
        className="flex-grow-1"
        style={{
          marginLeft: `${sidebarWidth}px`,
          transition: "margin-left 0.3s",
          width: `calc(100% - ${sidebarWidth}px)`,
        }}
      >
        <AdminHeader />
        <main className="p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
