// CMSAdvancedAdminPanel.jsx

import React, { useState } from 'react';
import {
  Container, Row, Col, Card, Button, Form, Modal, Badge, Tabs, Tab,
} from 'react-bootstrap';
import {
  FaEdit, FaHistory, FaChartBar, FaUpload, FaMoon, FaSun, FaRobot, FaPlus, FaEye, FaCodeBranch, FaTools,
} from 'react-icons/fa';

const dummyContent = {
  title: 'RajAI Care Plan – Best for Families',
  description: 'A powerful AI-powered care plan that includes diagnostics, OPD, and emergency support.',
  lastUpdated: '2025-07-14',
  version: 5,
};

const CMSAdvancedAdminPanel = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [tabKey, setTabKey] = useState('editor');
  const [showSchedule, setShowSchedule] = useState(false);
  const [publishSchedule, setPublishSchedule] = useState({ publish: '', expire: '' });

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <Container fluid className={`p-5 ${darkMode ? 'bg-dark text-light' : ''}`}>
      <Row className="align-items-center mb-3">
        <Col md={8}>
          <h4>🧠 CMS Advanced Admin Panel</h4>
          <small className="text-muted">Manage content workflow, editing, history, analytics, optimization and more</small>
        </Col>
        <Col md={4} className="text-end">
          <Button variant={darkMode ? 'light' : 'dark'} onClick={toggleDarkMode} className="me-2">
            {darkMode ? <FaSun /> : <FaMoon />} Toggle Dark Mode
          </Button>
          <Button variant="primary" onClick={() => setShowSchedule(true)}>
            <FaPlus className="me-1" /> Schedule Publish
          </Button>
        </Col>
      </Row>

      <Tabs activeKey={tabKey} onSelect={(k) => setTabKey(k)} className="mb-4">
        <Tab eventKey="editor" title={<span><FaEdit className="me-1" />Editor</span>}>
          <Card className="mb-3">
            <Card.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Title</Form.Label>
                  <Form.Control type="text" defaultValue={dummyContent.title} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control as="textarea" rows={4} defaultValue={dummyContent.description} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Rich Text Editor</Form.Label>
                  <Form.Control as="textarea" rows={6} placeholder="Start writing content..." />
                </Form.Group>
              </Form>
              <Button variant="success" className="me-2">💾 Save Draft</Button>
              <Button variant="warning">📤 Submit for Review</Button>
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="history" title={<span><FaHistory className="me-1" />History</span>}>
          <Card className="mb-3">
            <Card.Body>
              <h6>Version History (v{dummyContent.version})</h6>
              <ul>
                <li>v5 – Updated CTA and keywords – <em>by admin</em></li>
                <li>v4 – Added new image – <em>by designer</em></li>
                <li>v3 – Initial Arabic translation – <em>by translator</em></li>
              </ul>
              <Button variant="outline-secondary">↩️ Rollback to v4</Button>
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="analytics" title={<span><FaChartBar className="me-1" />Analytics</span>}>
          <Card className="mb-3">
            <Card.Body>
              <h6>Content Analytics</h6>
              <ul>
                <li>Views: 1243</li>
                <li>Clicks on CTA: 218</li>
                <li>Avg. Time on Page: 2m 14s</li>
                <li>Form Submissions: 54</li>
              </ul>
              <p className="mt-3">💡 Tip: Publish on weekday mornings for max visibility.</p>
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="optimizer" title={<span><FaUpload className="me-1" />Media Optimizer</span>}>
          <Card className="mb-3">
            <Card.Body>
              <Form>
                <Form.Group>
                  <Form.Label>Upload Media (auto WebP + compress)</Form.Label>
                  <Form.Control type="file" />
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="ai" title={<span><FaRobot className="me-1" />AI Assistant</span>}>
          <Card className="mb-3">
            <Card.Body>
              <h6>AI Content Suggestions</h6>
              <p>“Try shorter title. Add location in keyword. Consider linking to Form Builder.”</p>
              <Button variant="info">Apply Suggestion</Button>
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="forms" title={<span><FaCodeBranch className="me-1" />Forms Builder</span>}>
          <Card className="mb-3">
            <Card.Body>
              <h6>Dynamic Forms</h6>
              <Form>
                <Form.Group className="mb-2">
                  <Form.Label>Form Title</Form.Label>
                  <Form.Control type="text" placeholder="e.g. Appointment Inquiry" />
                </Form.Group>
                <Form.Check label="Name Field" defaultChecked />
                <Form.Check label="Email Field" defaultChecked />
                <Form.Check label="Dropdown (Reason for Visit)" />
                <Button variant="outline-success" className="mt-2">Save Form</Button>
              </Form>
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="tools" title={<span><FaTools className="me-1" />Tools & Logs</span>}>
          <Card className="mb-3">
            <Card.Body>
              <h6>CMS Activity Log</h6>
              <ul className="small">
                <li>[2025-07-14 15:12] admin@bbs – Edited Plan Title</li>
                <li>[2025-07-13 10:44] designer@bbs – Uploaded banner.jpg</li>
              </ul>
              <Button variant="outline-primary">Export Logs (CSV)</Button>
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>

      {/* Schedule Modal */}
      <Modal show={showSchedule} onHide={() => setShowSchedule(false)}>
        <Modal.Header closeButton>
          <Modal.Title>📅 Schedule Content</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Publish At</Form.Label>
              <Form.Control type="datetime-local" value={publishSchedule.publish} onChange={(e) => setPublishSchedule({ ...publishSchedule, publish: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Expire At</Form.Label>
              <Form.Control type="datetime-local" value={publishSchedule.expire} onChange={(e) => setPublishSchedule({ ...publishSchedule, expire: e.target.value })} />
            </Form.Group>
            <Form.Check label="Lock after expiry" className="mb-2" />
            <Form.Check label="Alert marketing team" className="mb-2" />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSchedule(false)}>Cancel</Button>
          <Button variant="primary">Save Schedule</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default CMSAdvancedAdminPanel;
