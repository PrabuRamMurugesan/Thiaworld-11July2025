import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <Container fluid className="p-0">
      <Row className="gx-0">
        {/* Sidebar */}
        <Col md={2} className="bg-dark vh-100 text-white position-fixed">
          <AdminSidebar />
        </Col>

        {/* Content */}
        <Col md={{ span: 10, offset: 2 }} className="ms-auto">
          <AdminHeader />
          <main className="p-4">
            <Outlet /> {/* This renders the nested admin pages */}
          </main>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminLayout;
