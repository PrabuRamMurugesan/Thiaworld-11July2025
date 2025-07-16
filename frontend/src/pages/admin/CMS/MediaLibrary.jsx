// MediaLibraryPage.jsx

import React, { useState } from 'react';
import {
  Container, Row, Col, Card, Button, Modal, Form, Badge,
} from 'react-bootstrap';
import { FaUpload, FaFolderPlus, FaEye } from 'react-icons/fa';

const dummyMedia = [
  {
    id: 1,
    name: 'doctor1.jpg',
    type: 'image',
    tags: ['Doctor', 'Profile'],
    folder: 'Doctors',
    url: '/img/sample/doctor1.jpg',
    size: '342 KB',
    usedIn: ['Doctor Profile: Dr. Mehta', 'AI Suggestion Banner'],
    languageMap: ['EN', 'HI'],
    uploadedBy: 'admin',
    license: '© BBSCART 2025',
    date: '2025-07-10',
  },
  {
    id: 2,
    name: 'plan_video.mp4',
    type: 'video',
    tags: ['Plans', 'Intro'],
    folder: 'Plan Videos',
    url: '/media/plan_video.mp4',
    size: '2.1 MB',
    usedIn: ['Plan Purchase Page', 'QR Pass Generator'],
    languageMap: ['EN'],
    uploadedBy: 'designer',
    license: 'Stock - Envato #89234',
    date: '2025-07-11',
  },
];

const MediaLibraryPage = () => {
  const [showUpload, setShowUpload] = useState(false);
  const [showDetails, setShowDetails] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // ✅ Folder states
  const [folders, setFolders] = useState(['Doctors', 'Plan Videos']);
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const filteredMedia = dummyMedia.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Container fluid className="p-4">
      <Row className="mb-3 align-items-center">
        <Col md={6}>
          <h4 className="mb-0">📁 Media Library</h4>
          <small className="text-muted">Manage all images, videos, and assets</small>
        </Col>
        <Col md={6} className="text-end">
          <Button variant="outline-primary" onClick={() => setShowUpload(true)}>
            <FaUpload className="me-1" /> Upload Media
          </Button>{' '}
          <Button variant="outline-secondary" onClick={() => setShowNewFolderModal(true)}>
            <FaFolderPlus className="me-1" /> New Folder
          </Button>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col>
          <Form.Control
            type="text"
            placeholder="Search by name, tag, or folder..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Col>
      </Row>

      <Row>
        {filteredMedia.map((item) => (
          <Col md={4} key={item.id} className="mb-4">
            <Card>
              {item.type === 'image' ? (
                <Card.Img variant="top" src={item.url} height="200" style={{ objectFit: 'cover' }} />
              ) : (
                <video src={item.url} height="200" controls className="w-100" />
              )}
              <Card.Body>
                <Card.Title className="d-flex justify-content-between">
                  <span>{item.name}</span>
                  <FaEye
                    style={{ cursor: 'pointer' }}
                    onClick={() => setShowDetails(item)}
                    title="View Details"
                  />
                </Card.Title>
                <div className="mb-2">
                  {item.tags.map((tag, idx) => (
                    <Badge bg="info" key={idx} className="me-1">{tag}</Badge>
                  ))}
                </div>
                <div className="text-muted small">
                  Folder: {item.folder} <br />
                  Size: {item.size} <br />
                  Language: {item.languageMap.join(', ')}
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Upload Modal */}
      <Modal show={showUpload} onHide={() => setShowUpload(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Upload Media</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Select File</Form.Label>
              <Form.Control type="file" multiple />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Tags (comma-separated)</Form.Label>
              <Form.Control type="text" placeholder="e.g. Doctor, Profile" />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Folder</Form.Label>
              <Form.Select>
                {folders.map((folder, idx) => (
                  <option key={idx} value={folder}>{folder}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Language Mapping</Form.Label>
              <Form.Select multiple>
                <option>EN</option>
                <option>HI</option>
                <option>AR</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>License / Source Info</Form.Label>
              <Form.Control type="text" placeholder="e.g. Envato #X, CC-BY, etc." />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUpload(false)}>
            Cancel
          </Button>
          <Button variant="primary">Upload</Button>
        </Modal.Footer>
      </Modal>

      {/* 📁 New Folder Modal */}
      <Modal show={showNewFolderModal} onHide={() => setShowNewFolderModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Folder</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Folder Name</Form.Label>
            <Form.Control
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="e.g. Hospital Banners"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowNewFolderModal(false)}>Cancel</Button>
          <Button
            variant="primary"
            onClick={() => {
              if (newFolderName.trim()) {
                setFolders([...folders, newFolderName.trim()]);
                setNewFolderName('');
                setShowNewFolderModal(false);
              }
            }}
          >
            Create Folder
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Details Modal */}
      <Modal show={!!showDetails} onHide={() => setShowDetails(null)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            Media Details: {showDetails?.name || 'Loading...'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {showDetails ? (
            <>
              {showDetails.type === 'image' ? (
                <img src={showDetails.url} alt={showDetails.name} className="w-100 rounded mb-3" />
              ) : (
                <video src={showDetails.url} controls className="w-100 mb-3" />
              )}
              <Row>
                <Col md={6}>
                  <p><strong>Size:</strong> {showDetails.size}</p>
                  <p><strong>Folder:</strong> {showDetails.folder}</p>
                  <p><strong>Tags:</strong> {showDetails.tags.join(', ')}</p>
                  <p><strong>Languages:</strong> {showDetails.languageMap.join(', ')}</p>
                </Col>
                <Col md={6}>
                  <p><strong>License:</strong> {showDetails.license}</p>
                  <p><strong>Uploaded By:</strong> {showDetails.uploadedBy}</p>
                  <p><strong>Date:</strong> {showDetails.date}</p>
                  <p><strong>Used In:</strong></p>
                  <ul>
                    {showDetails.usedIn.map((use, idx) => (
                      <li key={idx}>{use}</li>
                    ))}
                  </ul>
                </Col>
              </Row>
            </>
          ) : (
            <p>Loading...</p>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default MediaLibraryPage;
