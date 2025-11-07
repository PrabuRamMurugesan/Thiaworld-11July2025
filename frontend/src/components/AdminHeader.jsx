import React from "react";
import { Navbar, Container, Nav } from "react-bootstrap";
import { FaBell, FaUserCircle } from "react-icons/fa";

const AdminHeader = () => {
  return (
    <Navbar bg="light" expand="lg" className="shadow-sm border-bottom w-100">
      <Container fluid>
        <Navbar.Brand className="fw-bold p-3">Thiaworld Admin</Navbar.Brand>
        <Nav className="ms-auto d-flex align-items-center gap-4">
          <Nav.Link href="#" className="position-relative">
            <FaBell size={20} />
            <span className="badge bg-danger rounded-circle position-absolute top-0 start-100 translate-middle p-1">
              3
            </span>
          </Nav.Link>
          <Nav.Link href="#">
            <FaUserCircle size={24} /> Admin
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default AdminHeader;
