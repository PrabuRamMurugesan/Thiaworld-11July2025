import React, { useState } from 'react';
import {
  Container, Row, Col, Form, Button, Table, Badge, Modal, InputGroup
} from 'react-bootstrap';

const MODULES = [
  'CMS Builder', 'Media Library', 'SEO Manager',
  'Plan Manager', 'Hospital Access', 'Analytics Dashboard',
  'POS Settings', 'Multi-City Visibility', 'Emergency Tools'
];

const initialRoles = [
  {
    id: 1,
    name: 'Super Admin',
    description: 'Full platform control',
    tags: ['Global'],
    modules: MODULES.reduce((acc, m) => ({ ...acc, [m]: { view: true, create: true, edit: true, delete: true } }), {}),
    users: ['admin@example.com'],
    region: null,
  }
];

const RoleManager = () => {
  const [roles, setRoles] = useState(initialRoles);
  const [showModal, setShowModal] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleDelete = (id) => {
    setRoles(roles.filter(r => r.id !== id));
  };

  const handleSave = (role) => {
    if (role.id) {
      setRoles(roles.map(r => (r.id === role.id ? role : r)));
    } else {
      role.id = Date.now();
      setRoles([...roles, role]);
    }
    console.log('✅ Role Saved:', role);
    setShowModal(false);
  };

  const filteredRoles = roles.filter(r =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Container fluid className="p-4">
      <Row className="mb-3">
        <Col><h3>🔐 Role-Based Access Manager</h3></Col>
        <Col className="text-end">
          <Button variant="success" onClick={() => { setEditingRole(null); setShowModal(true); }}>
            ➕ Add New Role
          </Button>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={6}>
          <InputGroup>
            <Form.Control
              placeholder="🔍 Search by role or tag..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
      </Row>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Role Name</th>
            <th>Modules</th>
            <th>Users</th>
            <th>Tags</th>
            <th>Region Limit</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredRoles.map(role => (
            <tr key={role.id}>
              <td><strong>{role.name}</strong><br /><small>{role.description}</small></td>
              <td>
                {Object.keys(role.modules).slice(0, 3).map(m => (
                  <Badge bg="info" className="me-1" key={m}>{m}</Badge>
                ))}
                {Object.keys(role.modules).length > 3 && <Badge bg="secondary">+{Object.keys(role.modules).length - 3} more</Badge>}
              </td>
              <td>{role.users?.length || 0}</td>
              <td>
                {role.tags?.map(tag => <Badge key={tag} bg="dark" className="me-1">{tag}</Badge>)}
              </td>
              <td>{role.region || '🌐 Global'}</td>
              <td>
                <Button size="sm" variant="outline-primary" onClick={() => { setEditingRole(role); setShowModal(true); }}>Edit</Button>{' '}
                <Button size="sm" variant="outline-danger" onClick={() => handleDelete(role.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {showModal && (
        <RoleFormModal
          show={showModal}
          onHide={() => setShowModal(false)}
          onSave={handleSave}
          role={editingRole}
        />
      )}
    </Container>
  );
};

const RoleFormModal = ({ show, onHide, onSave, role }) => {
  const [name, setName] = useState(role?.name || '');
  const [description, setDescription] = useState(role?.description || '');
  const [tags, setTags] = useState(role?.tags?.join(', ') || '');
  const [region, setRegion] = useState(role?.region || '');
  const [users, setUsers] = useState(role?.users?.join(', ') || '');
  const [modules, setModules] = useState(role?.modules || {});

  const togglePermission = (mod, type) => {
    setModules({
      ...modules,
      [mod]: {
        ...modules[mod],
        [type]: !modules[mod]?.[type]
      }
    });
  };

  const handleSubmit = () => {
    const payload = {
      id: role?.id || null,
      name,
      description,
      tags: tags.split(',').map(t => t.trim()),
      region,
      users: users.split(',').map(u => u.trim()),
      modules
    };
    onSave(payload);
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{role ? '✏️ Edit Role' : '➕ New Role'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Role Name</Form.Label>
                <Form.Control value={name} onChange={e => setName(e.target.value)} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control value={description} onChange={e => setDescription(e.target.value)} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Region Limit (optional)</Form.Label>
                <Form.Control value={region} onChange={e => setRegion(e.target.value)} />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Tags (comma-separated)</Form.Label>
                <Form.Control value={tags} onChange={e => setTags(e.target.value)} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Assign Users (emails, comma-separated)</Form.Label>
                <Form.Control value={users} onChange={e => setUsers(e.target.value)} />
              </Form.Group>
            </Col>
          </Row>

          <h6 className="mt-3">📦 Module Access</h6>
          {MODULES.map(mod => (
            <div key={mod} className="border p-2 mb-2 rounded bg-light">
              <strong>{mod}</strong>
              <div className="form-check form-check-inline ms-3">
                <Form.Check type="checkbox" label="View" checked={modules[mod]?.view || false} onChange={() => togglePermission(mod, 'view')} />
              </div>
              <div className="form-check form-check-inline">
                <Form.Check type="checkbox" label="Create" checked={modules[mod]?.create || false} onChange={() => togglePermission(mod, 'create')} />
              </div>
              <div className="form-check form-check-inline">
                <Form.Check type="checkbox" label="Edit" checked={modules[mod]?.edit || false} onChange={() => togglePermission(mod, 'edit')} />
              </div>
              <div className="form-check form-check-inline">
                <Form.Check type="checkbox" label="Delete" checked={modules[mod]?.delete || false} onChange={() => togglePermission(mod, 'delete')} />
              </div>
            </div>
          ))}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cancel</Button>
        <Button variant="primary" onClick={handleSubmit}>Save Role</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RoleManager;
