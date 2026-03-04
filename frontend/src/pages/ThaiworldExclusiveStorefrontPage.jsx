import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Carousel from "react-bootstrap/Carousel";
import { Link } from "react-router-dom";

import bridal from "../../public/assets/bridal.jpg";
import festivel from "../../public/assets/Festivel.jpg";
import mens from "../../public/assets/mens.jpg";
import daily from "../../public/assets/Daily.jpg";
import kids from "../../public/assets/kids.jpg";

const THIAWorldExclusiveStorefrontPage = () => {
  return (
    <div className="container-fluid p-0">
      
      {/* Hero Carousel */}
      <section className="position-relative text-white text-center">
        <Carousel fade controls={false} indicators={false} interval={2000}>
          {[
            {
              image:
                "https://i.pinimg.com/originals/12/f7/44/12f744d5528b06297f627bd20e0d7a73.jpg",
              link: "/collections/bridal",
            },
            {
              image:
                "https://tse1.mm.bing.net/th/id/OIP.LC4xfOCsKBGZ_Q3Vz4aifQHaIs",
              link: "/collections/festivel",
            },
            {
              image:
                "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEghyDjU7YFCayL11a0dWrSoKQ-fz_iQXhvP7mw4QomTEHHrz5v7EkmCgOMnHWrgQzG7D682-6Uo2cn2ZfSKfv75YoaeR8u5W2OYC0yPRavZ_Yo1P_0nuEt0EdxDfWATC13hrrbw7fwgyW25yVqB4IrCPVyagxWB8ajUPBgWENihLnEoAvllB9g_OfYeuCdr/w1200-h630-p-k-no-nu/6_bridal%20gold%20bangles%20.jpg",
              link: "/collections/daily-wear",
            },
          ].map((item, idx) => (
            <Carousel.Item key={idx}>
              <Link to={item.link}>
                <img
                  src={item.image}
                  className="d-block w-100"
                  alt="Slide"
                  style={{
                    maxHeight: "60vh",
                    objectFit: "cover",
                    filter: "brightness(60%)",
                    cursor: "pointer",
                  }}
                />
              </Link>

              <Carousel.Caption>
                <h1 className="display-4 fw-bold">
                  THIAWORLD™ Gold Jewellery
                </h1>
                <p>Crafted in Purity. Cherished for Eternity.</p>
                <Link
                  to="/collections/bridal"
                  className="btn btn-warning btn-lg me-2"
                >
                  Explore Collection
                </Link>
              </Carousel.Caption>
            </Carousel.Item>
          ))}
        </Carousel>
      </section>

      {/* Curated Collections */}
      <section className="container py-5">
   <h2 className="text-center mb-4 fw-bold text-warning text-uppercase  display-6">
  Curated Collections
</h2>
        <div className="row g-3 justify-content-center">
          {[
            { name: "Bridal", image: bridal, link: "/all-jewellery" },
            { name: "Daily Wear", image: daily, link: "/all-jewellery" },
            { name: "Festivel", image: festivel, link: "/all-jewellery" },
            { name: "Men’s", image: mens, link: "/all-jewellery" },
            { name: "Kids & Gifting", image: kids, link: "/all-jewellery" },
          ].map(({ name, image, link }) => (
            <div key={name} className="col-md-2 col-sm-4 col-6 text-center">
              <Link to={link} style={{ textDecoration: "none", color: "inherit" }}>
                <div className="card shadow-sm rounded-4 p-2">
                  <img
                    src={image}
                    alt={name}
                    className="card-img-top"
                    style={{ height: "160px", objectFit: "cover" }}
                  />
                  <div className="card-body">
                    <h6 className="fw-bold">{name}</h6>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default THIAWorldExclusiveStorefrontPage;