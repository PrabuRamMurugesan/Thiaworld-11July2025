// SeoManagerPage.jsx

import React, { useState } from 'react';
import {
  Container, Row, Col, Table, Button, Modal, Form, Badge, Tabs, Tab, InputGroup
} from 'react-bootstrap';
import { FaEdit, FaPlus, FaTrash, FaExternalLinkAlt, FaRobot, FaGlobe } from 'react-icons/fa';

const initialData = [
  {
    id: 1,
    slug: '/plans/rajai-care-plus',
    title: 'Rajai Care Plus - BBSCART',
    description: 'Affordable plan with cashless OPD, emergency cover and diagnostics in 300+ hospitals.',
    canonical: 'https://bbscart.com/plans/rajai-care-plus',
    ogImage: '/img/plans/rajai.png',
    twitterCard: {
      title: 'Rajai Care Plus',
      description: 'OPD + Diagnostics + Emergency',
      image: '/img/plans/rajai.png',
    },
    usedIn: ['Plan Detail Page', 'QR Pass Generator'],
    lang: 'EN',
    score: 87,
  },
];

const SeoManagerPage = () => {
  const [seoList, setSeoList] = useState(initialData);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [activeLang, setActiveLang] = useState('EN');

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowModal(true);
  };

  const handleAddNew = () => {
    setEditingItem(null);
    setShowModal(true);
  };

  const GooglePreview = ({ title, description, slug }) => (
    <div className="border rounded p-3 mb-3 bg-light">
      <div className="text-success small">https://bbscart.com{slug}</div>
      <h6>{title}</h6>
      <p className="text-muted small mb-0">{description}</p>
    </div>
  );

  const TwitterPreview = ({ title, description, image }) => (
    <div className="border rounded p-3 bg-light d-flex gap-3 mb-3">
      <img src={image} alt="Twitter card" style={{ width: 80, height: 80, objectFit: 'cover' }} />
      <div>
        <strong>{title}</strong>
        <p className="small text-muted mb-0">{description}</p>
      </div>
    </div>
  );

  return (
    <Container fluid className="p-4">
      <Row className="mb-4">
        <Col md={8}>
          <h4>🔍 SEO Manager</h4>
          <p className="text-muted">Manage metadata, canonical links, OG & Twitter tags for all pages</p>
        </Col>
        <Col md={4} className="text-end">
          <Button variant="primary" onClick={handleAddNew}>
            <FaPlus className="me-1" /> Add SEO Entry
          </Button>
        </Col>
      </Row>

      <Table bordered hover responsive>
        <thead className="table-light">
          <tr>
            <th>Slug</th>
            <th>Meta Title</th>
            <th>Lang</th>
            <th>Score</th>
            <th>Used In</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {seoList.map((item) => (
            <tr key={item.id}>
              <td>{item.slug}</td>
              <td>{item.title}</td>
              <td><Badge bg="info">{item.lang}</Badge></td>
              <td>
                <Badge bg={item.score >= 80 ? 'success' : 'warning'}>{item.score}/100</Badge>
              </td>
              <td>
                {item.usedIn.map((use, i) => (
                  <Badge key={i} bg="secondary" className="me-1">{use}</Badge>
                ))}
              </td>
              <td>
                <Button size="sm" variant="outline-primary" onClick={() => handleEdit(item)}>
                  <FaEdit /> Edit
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingItem ? 'Edit SEO Entry' : 'Add SEO Entry'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Tabs activeKey={activeLang} onSelect={setActiveLang} className="mb-3">
            {['EN', 'HI', 'AR'].map((lang) => (
              <Tab eventKey={lang} title={<span><FaGlobe className="me-1" />{lang}</span>} key={lang}>
                <Form>
                  <Form.Group className="mb-2">
                    <Form.Label>Slug / URL</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>/</InputGroup.Text>
                      <Form.Control defaultValue={editingItem?.slug || ''} />
                    </InputGroup>
                  </Form.Group>

                  <Form.Group className="mb-2">
                    <Form.Label>Meta Title</Form.Label>
                    <Form.Control defaultValue={editingItem?.title || ''} />
                  </Form.Group>

                  <Form.Group className="mb-2">
                    <Form.Label>Meta Description</Form.Label>
                    <Form.Control as="textarea" rows={2} defaultValue={editingItem?.description || ''} />
                  </Form.Group>

                  <Form.Group className="mb-2">
                    <Form.Label>Canonical URL</Form.Label>
                    <Form.Control type="url" defaultValue={editingItem?.canonical || ''} />
                  </Form.Group>

                  <hr />
                  <h6>📣 Social Media Tags</h6>

                  <Form.Group className="mb-2">
                    <Form.Label>OG / Twitter Title</Form.Label>
                    <Form.Control defaultValue={editingItem?.twitterCard?.title || ''} />
                  </Form.Group>

                  <Form.Group className="mb-2">
                    <Form.Label>OG / Twitter Description</Form.Label>
                    <Form.Control defaultValue={editingItem?.twitterCard?.description || ''} />
                  </Form.Group>

                  <Form.Group className="mb-2">
                    <Form.Label>OG / Twitter Image URL</Form.Label>
                    <Form.Control defaultValue={editingItem?.twitterCard?.image || ''} />
                  </Form.Group>

                  <hr />
                  <h6>🧠 AI Suggestions <FaRobot /></h6>
                  <p className="text-muted small">Future: Auto-generate meta tags based on page content using AI.</p>

                  <hr />
                  <h6>🔍 SEO Preview</h6>
                  <GooglePreview
                    title={editingItem?.title || 'Sample Title'}
                    description={editingItem?.description || 'Sample description text for this page.'}
                    slug={editingItem?.slug || '/sample-path'}
                  />
                  <TwitterPreview
                    title={editingItem?.twitterCard?.title || 'Sample Social Title'}
                    description={editingItem?.twitterCard?.description || 'Description for social media.'}
                    image={editingItem?.twitterCard?.image || '/img/default-og.jpg'}
                  />
                </Form>
              </Tab>
            ))}
          </Tabs>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary">Save SEO</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default SeoManagerPage;
