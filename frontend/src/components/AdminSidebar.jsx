import React, { useState } from "react";
import { Nav } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import {
  FaBars,
  FaHome,
  FaBoxOpen,
  FaCoins,
  FaFileAlt,
  FaShoppingCart,
  FaUsers,
  FaDragon,
} from "react-icons/fa";
import { IoLanguage } from "react-icons/io5";
import { BsFillGeoFill } from "react-icons/bs";
import { MdManageAccounts } from "react-icons/md";
import { TbSeo } from "react-icons/tb";
import { SiDecapcms } from "react-icons/si";
const AdminSidebar = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { icon: <FaHome />, label: "Dashboard", path: "/admin/dashboard" },
    { icon: <FaBoxOpen />, label: "Products", path: "/admin/products/bulk" },
    { icon: <FaCoins />, label: "Gold Rates", path: "/goldrate" },
    { icon: <FaFileAlt />, label: "CMS Pages", path: "/cms-panel-admin" },
    { icon: <FaShoppingCart />, label: "Orders", path: "/admin/orders" },
    { icon: <FaUsers />, label: "Customers", path: "/admin/customers" },
    { icon: <FaDragon />, label: "Media", path: "/admin/media" },
    {
      icon: <IoLanguage />,
      label: "Multi-Language",
      path: "/admin/multi-language",
    },
    {
      icon: <BsFillGeoFill />,
      label: "Geo Visibility",
      path: "/admin/geo-visibility",
    },
    {
      icon: <MdManageAccounts />,
      label: "Role Manager",
      path: "/admin/roles-manager",
    },
    {
      icon: <MdManageAccounts />,
      label: "Media Library",
      path: "/admin/media",
    },
    { icon: <TbSeo />, label: "Seo Manager", path: "/admin/seo-manager" },
    {
      icon: <TbSeo />,
      label: "Preview Scheduler",
      path: "/admin/preview-scheduler",
    },
    {
      icon: <SiDecapcms />,
      label: "CMS Panel",
      path: "/admin/cms-panel-admin",
    },
  ];

  return (
    <div
      className={`sidebar bg-dark text-white p-3 ${
        collapsed ? "collapsed" : ""
      }`}
      style={{
        minHeight: "100vh",
        width: collapsed ? "70px" : "240px",
        transition: "width 0.3s",
      }}
    >
      {/* Toggle Button */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        {!collapsed && (
          <h5 className="text-warning m-0">
            {" "}
            <a href="/" target="_blank">
              ✨ BBSCART
            </a>
          </h5>
        )}
        <button
          className="btn btn-sm btn-outline-light ms-auto"
          onClick={() => setCollapsed(!collapsed)}
        >
          <FaBars />
        </button>
      </div>

      <Nav className="flex-column">
        {navItems.map((item) => (
          <Nav.Item key={item.path} className="mb-2">
            <Nav.Link
              as={Link}
              to={item.path}
              className={`d-flex align-items-center gap-2 text-white sidebar-link ${
                location.pathname === item.path ? "active" : ""
              }`}
              style={{ paddingLeft: "10px", fontSize: "0.95rem" }}
            >
              {item.icon}
              {!collapsed && <span>{item.label}</span>}
            </Nav.Link>
          </Nav.Item>
        ))}
      </Nav>
    </div>
  );
};

export default AdminSidebar;
