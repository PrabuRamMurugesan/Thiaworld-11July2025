// Google & Meta Ads Retargeting Page - BBSCART (Final Full Logic Version)
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Card,
  Button,
  Form,
  Row,
  Col,
  Table,
  Modal,
  Badge,
  Tabs,
  Tab,
} from "react-bootstrap";
import {
  FaGoogle,
  FaFacebook,
  FaEye,
  FaCheckCircle,
  FaExclamationTriangle,
  FaChartLine,
  FaPlayCircle,
  FaRobot,
  FaClipboardCheck,
  FaTools,
  FaPowerOff,
} from "react-icons/fa";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const AdsRetargetingPage = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [pixelStatus, setPixelStatus] = useState({ google: true, meta: false });
  const [selectedPlatform, setSelectedPlatform] = useState("google");
  const [campaigns, setCampaigns] = useState([
    {
      id: 1,
      name: "Retarget Cart Abandoners",
      platform: "Google",
      status: "Active",
      impressions: 2400,
      clicks: 150,
      roas: 3.2,
      headline: "Buy Now - Don't Miss Out!",
      description: "Get amazing discounts before your cart disappears."
    },
  ]);

  const [formData, setFormData] = useState({
    name: "",
    budget: "",
    segment: "",
    headline: "",
    description: "",
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLaunchCampaign = () => {
    if (!formData.name || !formData.budget || !formData.segment) return;
    const newCampaign = {
      id: campaigns.length + 1,
      name: formData.name,
      platform: selectedPlatform === "google" ? "Google" : "Meta",
      status: "Active",
      impressions: 0,
      clicks: 0,
      roas: 0,
      headline: formData.headline,
      description: formData.description
    };
    setCampaigns([...campaigns, newCampaign]);
    setShowCreateModal(false);
    setFormData({ name: "", budget: "", segment: "", headline: "", description: "" });
  };

  const handleGenerateAI = () => {
    let headline = "";
    let description = "";
    if (formData.segment.includes("Cart")) {
      headline = "Still thinking? Complete your purchase!";
      description = "You left items in your cart. They're waiting for you!";
    } else if (formData.segment.includes("Wishlist")) {
      headline = "Your wishlist is hot!";
      description = "Get the products you've been eyeing at the best price.";
    } else {
      headline = "Deals you can't miss!";
      description = "Return now to grab our exclusive offers before they end.";
    }
    setFormData({ ...formData, headline, description });
  };

  const toggleStatus = (id) => {
    const updated = campaigns.map((c) =>
      c.id === id ? { ...c, status: c.status === "Active" ? "Paused" : "Active" } : c
    );
    setCampaigns(updated);
  };

  const viewCampaign = (data) => {
    setViewData(data);
    setShowViewModal(true);
  };

  return (
  <>
  <Header/>
    <div className="container p-5 my-4 border rounded ">
      <h2 className="mb-4 d-flex flex-row align-items-center xl:text-2xl " >
        <FaChartLine className="me-2" /> Google & Meta Ads Retargeting
      </h2>

      <Row className="mb-4">
        <Col md={6}>
          <Card bg={pixelStatus.google ? "light" : "warning"}>
            <Card.Body>
           <div className="d-flex flex-row align-items-center">
               <FaGoogle className="me-2 text-primary" /> Google Pixel:{" "}
           </div>
              {pixelStatus.google ? (
                <Badge bg="success " className="d-flex flex-row align-items-center gap-2 mt-3 p-3"><FaCheckCircle /> Active</Badge>
              ) : (
                <Badge bg="danger" ><FaExclamationTriangle /> Missing</Badge>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card bg={pixelStatus.meta ? "light" : "warning"}>
            <Card.Body>
            <div className="d-flex flex-row align-items-center gap-2 ">
                  <FaFacebook className="me-2 text-primary " /> Meta Pixel:{" "}
            </div>
              {pixelStatus.meta ? (
                <Badge bg="success"><FaCheckCircle /> Active</Badge>
              ) : (
                <Badge bg="danger" className="d-flex flex-row align-items-center gap-2 mt-3 p-3"><FaExclamationTriangle /> Missing</Badge>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <div className="d-flex w-100 align-items-center my-5">
        <h5 className="text-xl w-25">Active Campaigns</h5>
        <Button onClick={() => setShowCreateModal(true)} className="d-flex flex-row align-items-center ms-auto" variant="primary">
          <FaPlayCircle className="me-1" /> New Retargeting Campaign
        </Button>
      </div>

      <Table bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Campaign Name</th>
            <th>Platform</th>
            <th>Status</th>
            <th>Impressions</th>
            <th>Clicks</th>
            <th>ROAS</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {campaigns.map((c, i) => (
            <tr key={c.id}>
              <td>{i + 1}</td>
              <td>{c.name}</td>
              <td>{c.platform}</td>
              <td>
                <Badge bg={c.status === "Active" ? "success" : "secondary"}>{c.status}</Badge>
              </td>
              <td>{c.impressions}</td>
              <td>{c.clicks}</td>
              <td>{c.roas}x</td>
              <td>
                <Button variant="outline-primary" size="sm" onClick={() => viewCampaign(c)}><FaEye /></Button>{" "}
                <Button variant="outline-danger" size="sm" onClick={() => toggleStatus(c.id)}><FaPowerOff /></Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Create Modal */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Launch New Ad Campaign</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Tabs activeKey={selectedPlatform} onSelect={(k) => setSelectedPlatform(k)} className="mb-3">
            {['google', 'meta'].map((platform) => (
              <Tab
                eventKey={platform}
                title={platform === 'google' ? <><FaGoogle className="me-1" /> Google Ads</> : <><FaFacebook className="me-1" /> Meta Ads</>}
                key={platform}
              >
                <Form>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Campaign Name</Form.Label>
                        <Form.Control name="name" value={formData.name} onChange={handleInputChange} placeholder="Campaign Name" />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Daily Budget (₹)</Form.Label>
                        <Form.Control name="budget" value={formData.budget} onChange={handleInputChange} type="number" />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Target Segment</Form.Label>
                        <Form.Select name="segment" value={formData.segment} onChange={handleInputChange}>
                          <option value="">-- Select --</option>
                          <option>Cart Abandoners</option>
                          <option>Viewed Products</option>
                          <option>Past Buyers</option>
                          <option>Wishlist Users</option>
                          <option>Location: Metro Cities</option>
                          <option>Frequent Visitors</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Ad Headline</Form.Label>
                        <Form.Control name="headline" value={formData.headline} onChange={handleInputChange} />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Ad Description</Form.Label>
                        <Form.Control name="description" value={formData.description} onChange={handleInputChange} as="textarea" rows={3} />
                      </Form.Group>
                      <Button variant="outline-info" onClick={handleGenerateAI}><FaRobot className="me-1" /> Auto-Generate with AI</Button>
                    </Col>
                  </Row>
                </Form>
              </Tab>
            ))}
          </Tabs>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreateModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleLaunchCampaign}><FaClipboardCheck className="me-1" /> Launch Campaign</Button>
        </Modal.Footer>
      </Modal>

      {/* View Modal */}
      <Modal show={showViewModal} onHide={() => setShowViewModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Campaign Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {viewData && (
            <>
              <p><strong>Name:</strong> {viewData.name}</p>
              <p><strong>Platform:</strong> {viewData.platform}</p>
              <p><strong>Status:</strong> {viewData.status}</p>
              <p><strong>Impressions:</strong> {viewData.impressions}</p>
              <p><strong>Clicks:</strong> {viewData.clicks}</p>
              <p><strong>ROAS:</strong> {viewData.roas}</p>
              <p><strong>Headline:</strong> {viewData.headline}</p>
              <p><strong>Description:</strong> {viewData.description}</p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  <Footer/>
  </>
  );
};

export default AdsRetargetingPage;
