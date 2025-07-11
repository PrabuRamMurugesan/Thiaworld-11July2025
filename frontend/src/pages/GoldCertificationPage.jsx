import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import Header from '../components/Header';
import Footer from '../components/Footer';

const GoldCertificationPage = () => {
  useEffect(() => {
    document.title = "Gold Certification & Authenticity | THIAWORLD";
  }, []);

  const sectionStyle = {
    background: 'linear-gradient(to right, #fff8e1, #fff3cd)',
    borderRadius: '1rem',
    padding: '2rem',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    marginBottom: '2rem'
  };

  const badgeStyle = {
    fontSize: '0.75rem',
    marginLeft: '0.5rem',
  };

  return (
    <>
      <Header />

      <section className="bg-dark text-white py-5 text-center">
        <h1 className="display-5 fw-bold">Certified & Trusted Gold Jewellery</h1>
        <p className="lead">THIAWORLD ensures every piece is BIS certified and ethically sourced.</p>
        <Button variant="warning" size="lg" className="me-3">Explore Jewellery</Button>
        <Button variant="outline-light" size="lg">Verify Your Gold</Button>
      </section>

      <Container className="my-5">

        {/* BIS Hallmarking Section */}
        <div style={sectionStyle}>
          <h3 className="text-dark mb-3">🔖 What is BIS Hallmarking?</h3>
          <p>
            BIS Hallmarking certifies the purity and authenticity of gold jewellery in India. Each stamp includes:
          </p>
          <ul>
            <li>BIS Logo</li>
            <li>Purity (e.g., 22K916)</li>
            <li>Assaying Centre ID</li>
            <li>Year of Mark</li>
            <li>Jeweller ID</li>
          </ul>
          <img src="https://cdn.pixabay.com/photo/2016/02/02/15/55/jewellery-1175535_1280.jpg" width={500} height={50} alt="BIS Hallmark" className="img-fluid rounded shadow my-3" />
        </div>

        {/* Purity Section */}
        <div style={sectionStyle}>
          <h3 className="text-dark mb-3">⚖️ Gold Purity Levels Explained</h3>
          <Row>
            <Col md={6}>
              <ul>
                <li><strong>24K (99.9%)</strong> – Purest form, ideal for investment</li>
                <li><strong>22K (91.6%)</strong> – Standard for premium jewellery</li>
                <li><strong>18K (75%)</strong> – Stylish & durable ornaments</li>
                <li><strong>14K (58.3%)</strong> – Budget-friendly daily wear</li>
              </ul>
            </Col>
            <Col md={6}>
              <img src="https://cdn.pixabay.com/photo/2016/02/02/15/55/jewellery-1175535_1280.jpg" alt="Purity Chart" className="img-fluid rounded" />
            </Col>
          </Row>
        </div>

        {/* Certificate Sample */}
        <div style={sectionStyle}>
          <h3 className="text-dark mb-3">📄 Sample Certificate</h3>
          <Card className="shadow-sm">
            <Card.Body>
              <img src="https://cdn.pixabay.com/photo/2016/02/02/15/55/jewellery-1175535_1280.jpg" alt="Sample Certificate" className="img-fluid rounded mb-3" />
              <Button variant="outline-warning">Download Sample PDF</Button>
            </Card.Body>
          </Card>
        </div>

        {/* Verification */}
        <div style={sectionStyle}>
          <h3 className="text-dark mb-3">✅ Verify Your Gold</h3>
          <ol>
            <li>Look for the BIS stamp on your jewellery</li>
            <li>Use <a href="https://cdn.pixabay.com/photo/2016/02/02/15/55/jewellery-1175535_1280.jpg" target="_blank" rel="noopener noreferrer">BIS Portal</a> or BIS CARE app to verify serial</li>
            <li>Coming Soon:
              <Badge bg="secondary" style={badgeStyle}>BBSCART QR Validator</Badge>
              <Badge bg="secondary" style={badgeStyle}>Auto AI Detection</Badge>
            </li>
          </ol>
        </div>

        {/* THIAWORLD Standards */}
        <div style={sectionStyle}>
          <h3 className="text-dark mb-3">🏅 THIAWORLD Gold Standards</h3>
          <p>
            All our gold is tested in BIS-approved and NABL-certified labs using methods like Fire Assay and XRF.
            Ethical sourcing and quality control is our commitment to you.
          </p>
        </div>

        {/* FAQs */}
        <div style={sectionStyle}>
          <h3 className="text-dark mb-3">📚 FAQs & Myths</h3>
          <ul>
            <li><strong>Myth:</strong> Hallmarked gold is 100% pure — <span className="text-danger">False</span></li>
            <li><strong>Truth:</strong> Hallmark indicates stated karat purity, not 100% elemental gold</li>
            <li><strong>Q:</strong> Can I verify my product myself? — ✅ Yes, via BIS tools or our verifier (Coming Soon)</li>
          </ul>
        </div>

        {/* Legal Section */}
        <div style={sectionStyle}>
          <h3 className="text-dark mb-3">📜 Legal Compliance</h3>
          <p>
            Compliant with India’s BIS Hallmarking Mandate (2024). Return policies ensure full refunds or exchanges for non-certified jewellery.
          </p>
        </div>

        {/* Future Features */}
        <div style={sectionStyle}>
          <h3 className="text-dark mb-3">🔮 Future & Advanced Features</h3>
          <Row>
            <Col md={6}>
              <ul>
                <li>🔗 Blockchain-based Gold Provenance</li>
                <li>🤖 AI Gold Authenticator Tool</li>
                <li>📲 QR/Serial Number Validator</li>
                <li>📤 Shareable Certificate Generator</li>
                <li>📥 Certificate Wallet & Digital Downloads</li>
              </ul>
            </Col>
            <Col md={6}>
              <ul>
                <li>📢 Recall Alerts & Fraud Reporting</li>
                <li>💎 Investment Grade Rating Tags</li>
                <li>🧪 Interactive Testing Simulator</li>
                <li>📬 Weekly Gold Tips & Newsletters</li>
                <li>🔐 Blockchain Tracker Integration</li>
              </ul>
            </Col>
          </Row>
        </div>

        {/* CTA */}
        <div className="text-center mb-5">
          <Button variant="success" size="lg" className="me-3">Verify Your Product</Button>
          <Button variant="outline-dark" size="lg">Shop THIAWORLD</Button>
        </div>

      </Container>

      <Footer />
    </>
  );
};

export default GoldCertificationPage;
