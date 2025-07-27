// File: ComingSoon.jsx
import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './Header';
import Footer from './Footer';

const FestiveOffers = () => {
  return (
   <>
   <Header/>
    <div className="bg-light d-flex align-items-center justify-content-center  max-vh-100 " >
      <Container>
        <Row className="justify-content-center my-5">
          <Col md={8} lg={6}>
            <Card className="text-center shadow-lg p-4 " style={{ borderRadius: '20px',border: '1px solid #bfa980' }}>
              <Card.Body>
                <h1 className="display-4 mb-3" style={{ fontFamily: 'Georgia, serif', color: '#bfa980' }}>
                   Coming Soon 
                </h1>
                <h3 className="mb-4" style={{ fontFamily: 'Playfair Display, serif', color: '#333' }}>
                  A Sparkling New Jewelry Collection Awaits
                </h3>
                <p className="lead text-muted">
                  We’re crafting something elegant and timeless just for you. Stay tuned for the grand reveal of our luxury pieces.
                </p>
                <div className=" d-flex justify-content-center mt-4  " >
                  <img 
                    src="https://tse3.mm.bing.net/th/id/OIP.61Ul26DjPu6iVYaVBMZ8vwAAAA?rs=1&pid=ImgDetMain&o=7&rm=3"
                    alt="Jewelry Coming Soon"
                    className="img-fluid"
                    style={{ maxHeight: '250px', borderRadius: '20px', boxShadow: '50% 1px 1px rgba(0,0,0,0.3)' ,border: '1px solid gray'}}
                  />
                </div>
                <p className="mt-4 text-muted" style={{ fontSize: '14px' }}>
                  © 2025 Thiaworld • All Rights Reserved
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
    <Footer/>
  </>
  );
};

export default FestiveOffers;
