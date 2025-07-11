// SEO Optimization Page with Vendor/Admin Role Toggle - BBSCART (Advanced Version)
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Form,
  Button,
  Card,
  Table,
  Badge,
  ProgressBar,
  Modal,
  ToggleButtonGroup,
  ToggleButton,
  Row,
  Col,
  Alert
} from "react-bootstrap";
import {
  FaFacebook,
  FaTwitter,
  FaWhatsapp,
  FaGoogle,
  FaEdit,
  FaFileExport,
  FaFileImport,
  FaChartLine,
  FaGlobe,
  FaExclamationTriangle,
  FaLanguage,
  FaDatabase
} from "react-icons/fa";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const SeoOptimizationPage = () => {
  const [role, setRole] = useState("vendor");
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Sample Product A",
      title: "Buy Sample Product A - Best Deals",
      description: "Get the best price for Sample Product A with fast delivery.",
      keywords: "sample, product A, deals",
      seoScore: 85,
    },
    {
      id: 2,
      name: "Sample Product B",
      title: "",
      description: "",
      keywords: "",
      seoScore: 45,
    },
  ]);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const [seoAlerts, setSeoAlerts] = useState([]);
  const [showImportModal, setShowImportModal] = useState(false);

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setShowEditor(true);
  };

  const handleSave = () => {
    setShowEditor(false);
  };

  const generateSeo = () => {
    setSelectedProduct({
      ...selectedProduct,
      title: `Buy ${selectedProduct.name} at Best Price`,
      description: `Explore ${selectedProduct.name} with amazing discounts and fast delivery.`,
      keywords: `${selectedProduct.name.toLowerCase()}, deals, online shopping`,
    });
  };

  useEffect(() => {
    // Placeholder for real-time SEO alert simulation
    const alerts = products
      .filter((p) => !p.title || p.seoScore < 50)
      .map((p) => ({ productId: p.id, message: `Product "${p.name}" has poor SEO.` }));
    setSeoAlerts(alerts);
  }, [products]);

  return (
   <>
   <Header/>
      <div className="container p-5 border  rounded my-4">
      <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-4">
        <h2 className="d-flex flex-row align-items-center xl:text-2xl">
          <FaChartLine className="me-2" size={35} /> SEO Optimization
        </h2>
        <ToggleButtonGroup type="radio" name="role" value={role} onChange={setRole}>
          <ToggleButton id="vendor-toggle" value="vendor" variant="outline-primary">
            Vendor View
          </ToggleButton>
          <ToggleButton id="admin-toggle" value="admin" variant="outline-danger">
            Admin View
          </ToggleButton>
        </ToggleButtonGroup>
      </div>

      {seoAlerts.length > 0 && (
        <Alert variant="warning" className="me-2 text-xl d-flex flex-row align-items-center" >
          <FaExclamationTriangle className="me-2 " /> SEO Issues Detected in {seoAlerts.length} product(s). Please review below.
        </Alert>
      )}

      <Card className="mb-4">
        <Card.Body>
         
          <div className=" text-muted d-flex flex-row  justify-content-between my-2 pb-3">
             <h5 className="text-xl">{role === "admin" ? "Bulk SEO Dashboard" : "Your Product SEO Overview"}</h5>
        <div className="d-flex flex-row">
                <Button variant="outline-secondary d-flex flex-row align-items-center" className="me-2" onClick={() => setShowImportModal(true)}>
              <FaFileImport className="me-1" /> Import CSV
            </Button>
            <Button variant="outline-success d-flex flex-row align-items-center">
              <FaFileExport className="me-1" /> Export CSV
            </Button>
        </div>
          </div>
          <Table responsive bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Product</th>
                <th>SEO Title</th>
                <th>SEO Score</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p, i) => (
                <tr key={p.id}>
                  <td>{i + 1}</td>
                  <td>{p.name}</td>
                  <td>{p.title || <span className="text-danger">Missing</span>}</td>
                  <td>
                    <ProgressBar
                      variant={p.seoScore >= 75 ? "success" : p.seoScore >= 50 ? "warning" : "danger"}
                      now={p.seoScore}
                      label={`${p.seoScore}%`}
                    />
                  </td>
                  <td>
                    {p.seoScore >= 75 ? (
                      <Badge bg="success">Optimized</Badge>
                    ) : (
                      <Badge bg="warning">Needs Improvement</Badge>
                    )}
                  </td>
                  <td>
                    <Button size="sm" onClick={() => handleEdit(p)} className="d-flex flex-row align-items-center gap-2">
                      <FaEdit /> {role === "admin" ? "Review" : "Edit"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal show={showEditor} onHide={() => setShowEditor(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{role === "admin" ? "Admin SEO Review" : "Edit SEO Metadata"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProduct && (
            <>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>SEO Title</Form.Label>
                    <Form.Control
                      type="text"
                      value={selectedProduct.title}
                      onChange={(e) => setSelectedProduct({ ...selectedProduct, title: e.target.value })}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>SEO Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      value={selectedProduct.description}
                      onChange={(e) => setSelectedProduct({ ...selectedProduct, description: e.target.value })}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>SEO Keywords</Form.Label>
                    <Form.Control
                      type="text"
                      value={selectedProduct.keywords}
                      onChange={(e) => setSelectedProduct({ ...selectedProduct, keywords: e.target.value })}
                    />
                  </Form.Group>
                  <Button variant="outline-primary" onClick={generateSeo} className="mb-3">
                    🔮 Auto-Generate with AI
                  </Button>
                </Col>
                <Col md={6}>
                  <Card>
                    <Card.Body>
                      <h6><FaGoogle /> Google Search Preview</h6>
                      <div className="border p-2">
                        <strong>{selectedProduct.title}</strong>
                        <p className="text-muted small">{selectedProduct.description}</p>
                        <a href="#">www.bbscart.com/product/{selectedProduct.id}</a>
                      </div>
                      <hr />
                      <h6><FaGlobe /> Social Media Preview</h6>
                      <div className="d-flex gap-3">
                        <Badge bg="primary"><FaFacebook /> Facebook</Badge>
                        <Badge bg="info"><FaTwitter /> Twitter</Badge>
                        <Badge bg="success"><FaWhatsapp /> WhatsApp</Badge>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditor(false)}>Cancel</Button>
          <Button variant="success" onClick={handleSave}>Save Changes</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showImportModal} onHide={() => setShowImportModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Import SEO CSV</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="formFile" className="mb-3">
            <Form.Label>Select CSV File</Form.Label>
            <Form.Control type="file" />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowImportModal(false)}>Cancel</Button>
          <Button variant="primary">Upload</Button>
        </Modal.Footer>
      </Modal>

 
    </div>
   <Footer/>
   </>
  );
};

export default SeoOptimizationPage;