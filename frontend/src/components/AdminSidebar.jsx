import React from "react";
import { Nav } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaBoxOpen,
  FaCoins,
  FaFileAlt,
  FaShoppingCart,
  FaUsers,
} from "react-icons/fa";

const AdminSidebar = () => {
  const location = useLocation();

  const navItems = [
    { icon: <FaHome />, label: "Dashboard", path: "/admin/dashboard" },
    { icon: <FaBoxOpen />, label: "Products", path: "/admin/products" },
    { icon: <FaCoins />, label: "Gold Rates", path: "/admin/goldrate" },
    { icon: <FaFileAlt />, label: "CMS Pages", path: "/admin/cms-pages" },
    { icon: <FaShoppingCart />, label: "Orders", path: "/admin/orders" },
    { icon: <FaUsers />, label: "Customers", path: "/admin/customers" },
  ];

  return (
    <div className="p-3 sidebar bg-dark text-white">
      <h4 className="text-warning mb-4">✨ BBSCART Admin</h4>
      <Nav className="flex-column">
        {navItems.map((item) => (
          <Nav.Item key={item.path} className="mb-2">
            <Nav.Link
              as={Link}
              to={item.path}
              className={`d-flex align-items-center gap-2 sidebar-link ${
                location.pathname === item.path ? "active" : ""
              }`}
            >
              {item.icon} {item.label}
            </Nav.Link>
          </Nav.Item>
        ))}
      </Nav>
    </div>
  );
};

export default AdminSidebar;
