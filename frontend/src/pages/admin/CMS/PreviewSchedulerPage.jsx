// PreviewSchedulerPage.jsx

import React, { useState } from 'react';
import {
  Container, Row, Col, Card, Button, Form, Modal, Badge,
} from 'react-bootstrap';
import {
  FaCalendarAlt, FaRobot, FaLink,
} from 'react-icons/fa';
import axios from 'axios';

const dummyContent = {
  title: 'RajAI Care Plan – Best for Families',
  slug: '/plans/rajai-care-plus',
  description: 'A powerful AI-powered care plan that includes diagnostics, OPD, and emergency support.',
  contentType: 'Plan',
  previewImage: '/img/sample/rajai.png',
};

const PreviewSchedulerPage = () => {
  const [device, setDevice] = useState('desktop');
  const [region, setRegion] = useState('India');
  const [role, setRole] = useState('Guest');
  const [lang, setLang] = useState('EN');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [schedule, setSchedule] = useState({ publish: '', expire: '' });
  const [saving, setSaving] = useState(false);

  const getDeviceStyle = () => {
    switch (device) {
      case 'mobile': return { width: '375px', height: '667px' };
      case 'tablet': return { width: '768px', height: '1024px' };
      default: return { width: '100%', height: '480px' };
    }
  };

  const handleSaveSchedule = async () => {
    try {
      setSaving(true);
      await axios.post('/api/schedule', {
        contentId: dummyContent.slug,
        publishAt: schedule.publish,
        expireAt: schedule.expire,
        region,
        role,
        lang,
        device,
      });
      alert('✅ Schedule saved successfully.');
      setShowScheduleModal(false);
    } catch (err) {
      console.error(err);
      alert('❌ Failed to save schedule.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container fluid className="p-4">
      <Row className="mb-4 align-items-center">
        <Col md={8}>
          <h4>🧪 Preview & Scheduler Manager</h4>
          <p className="text-muted">Preview drafts by region/device/user and schedule timed publishing or expiry.</p>
        </Col>
        <Col md={4} className="text-end">
          <Button variant="primary" onClick={() => setShowScheduleModal(true)}>
            <FaCalendarAlt className="me-2" /> Schedule Publish / Expiry
          </Button>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={3}>
          <Form.Select value={device} onChange={(e) => setDevice(e.target.value)}>
            <option value="desktop">💻 Desktop</option>
            <option value="tablet">📱 Tablet</option>
            <option value="mobile">📲 Mobile</option>
          </Form.Select>
        </Col>
        <Col md={3}>
          <Form.Select value={region} onChange={(e) => setRegion(e.target.value)}>
            <option>Chennai</option>
            <option>Tamil Nadu</option>
            <option>India</option>
            <option>UAE</option>
          </Form.Select>
        </Col>
        <Col md={3}>
          <Form.Select value={role} onChange={(e) => setRole(e.target.value)}>
            <option>Guest</option>
            <option>User</option>
            <option>Hospital Admin</option>
            <option>BBSCART Staff</option>
          </Form.Select>
        </Col>
        <Col md={3}>
          <Form.Select value={lang} onChange={(e) => setLang(e.target.value)}>
            <option>EN</option>
            <option>HI</option>
            <option>AR</option>
          </Form.Select>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={12} className="d-flex justify-content-center">
          <Card style={{ ...getDeviceStyle(), overflow: 'hidden' }} className="border shadow">
            <Card.Body>
              <h5>{dummyContent.title}</h5>
              <p className="text-muted small">{dummyContent.description}</p>
              <img
                src={dummyContent.previewImage}
                alt="Preview"
                className="img-fluid rounded mb-3"
                style={{ height: '200px', objectFit: 'cover', width: '100%' }}
              />
              <div className="text-muted small">
                <Badge bg="info" className="me-1">Device: {device}</Badge>
                <Badge bg="dark" className="me-1">Role: {role}</Badge>
                <Badge bg="success" className="me-1">Region: {region}</Badge>
                <Badge bg="warning" className="me-1">Lang: {lang}</Badge>
              </div>
              <hr />
              <div>
                <FaLink className="me-2" />Preview Link: <code>https://bbscart.health{dummyContent.slug}?preview=true</code>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="mb-4">
        <Card.Body>
          <h6><FaRobot className="me-2" />AI Suggestions (Coming Soon)</h6>
          <p className="text-muted mb-0">Try stronger CTA in your title. Optimize description to less than 160 characters. Schedule weekday mornings for better visibility.</p>
        </Card.Body>
      </Card>

      <Modal show={showScheduleModal} onHide={() => setShowScheduleModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>📅 Schedule Content</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Publish Time</Form.Label>
              <Form.Control type="datetime-local" value={schedule.publish} onChange={(e) => setSchedule({ ...schedule, publish: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Expiry Time</Form.Label>
              <Form.Control type="datetime-local" value={schedule.expire} onChange={(e) => setSchedule({ ...schedule, expire: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check label="Send alert to marketing team" />
              <Form.Check label="Lock content after scheduled time" />
              <Form.Check label="Auto-replace with fallback banner" />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowScheduleModal(false)}>Cancel</Button>
          <Button variant="primary" disabled={saving} onClick={handleSaveSchedule}>
            {saving ? 'Saving…' : 'Save Schedule'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default PreviewSchedulerPage;