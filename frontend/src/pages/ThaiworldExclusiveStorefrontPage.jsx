import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { FaStar, FaShoppingCart, FaHeart } from "react-icons/fa";
import Carousel from "react-bootstrap/Carousel";

const THIAWorldExclusiveStorefrontPage = () => {
  return (
    <div className="container-fluid p-0">
      {/* Hero Banner Carousel */}
      <section className="position-relative text-white text-center">
        <Carousel fade controls={false} indicators={false} interval={1500}>
          {["https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEghyDjU7YFCayL11a0dWrSoKQ-fz_iQXhvP7mw4QomTEHHrz5v7EkmCgOMnHWrgQzG7D682-6Uo2cn2ZfSKfv75YoaeR8u5W2OYC0yPRavZ_Yo1P_0nuEt0EdxDfWATC13hrrbw7fwgyW25yVqB4IrCPVyagxWB8ajUPBgWENihLnEoAvllB9g_OfYeuCdr/w1200-h630-p-k-no-nu/6_bridal%20gold%20bangles%20.jpg", 
            "https://tse1.explicit.bing.net/th/id/OIP.LC4xfOCsKBGZ_Q3Vz4aifQHaIs?w=900&h=1056&rs=1&pid=ImgDetMain&o=7&rm=3", 
            "https://i.pinimg.com/originals/12/f7/44/12f744d5528b06297f627bd20e0d7a73.jpg"
          ].map((img, idx) => (
            <Carousel.Item key={idx}>
              <img
                src={img}
                className="d-block w-100 rounded"
                alt={`Slide ${idx + 1}`}
                style={{ maxHeight: "50vh", objectFit: "cover", filter: "brightness(60%)" }}
              />
              <Carousel.Caption className="text-center">
                <h1 className="display-3 fw-bold">THIAWORLD™ Gold Jewellery</h1>
                <p className="lead my-3">Crafted in Purity. Cherished for Eternity.</p>
                <a href="#collections" className="btn btn-warning btn-lg me-2 shadow">Explore Collection</a>
                <a href="/thia-secure-plan" className="btn btn-outline-light btn-lg shadow">THIA Secure Plan</a>
              </Carousel.Caption>
            </Carousel.Item>
          ))}
        </Carousel>
      </section>

      {/* Curated Collections */}
  <section id="collections" className="container py-5">
  <h2 className="text-center display-5 fw-semibold mb-4">Curated Collections</h2>

  {/* Define name + image URL pairs */}
  <div className="row g-4 justify-content-center">
    {[
      {
        name: "Bridal",
        image:
          "https://i.pinimg.com/originals/99/24/6b/99246bc9814508b68078ac42bdd2d749.png",
      },
      {
        name: "Daily Wear",
        image:
          "https://tse1.explicit.bing.net/th/id/OIP.-SjK4flJMG2VPPxgLzpzpwHaHa?rs=1&pid=ImgDetMain&o=7&rm=3",
      },
      {
        name: "Festive",
        image:
          "https://tse1.mm.bing.net/th/id/OIP.cRMn8eS9-naSMhNYlw1QVAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3",
      },
      {
        name: "Men’s",
        image:
          "https://tse2.mm.bing.net/th/id/OIP.ZvYjKRG4PrNgvFpl7Q-d1QHaF5?rs=1&pid=ImgDetMain&o=7&rm=3",
      },
      {
        name: "Kids & Gifting",
        image:
          "https://th.bing.com/th/id/R.b8ceefd60ea3f58863e0bab858049a51?rik=nMN19Rb5pZsWaw&riu=http%3a%2f%2fwww.giva.co%2fcdn%2fshop%2farticles%2f456.jpg%3fv%3d1711530595&ehk=8nyZqYa6r3yEou4AeqyP2L0%2b%2fsPxK5ler9RzmdxNV%2bE%3d&risl=&pid=ImgRaw&r=0",
      },
    ].map(({ name, image }) => (
      <div key={name} className="col-md-2 col-sm-4 col-6 text-center">
        <div className="card border-1 p-2 shadow-sm rounded-4">
          <img
            src={image}
            alt={name}
            className="card-img-top rounded-top-4"
            style={{ height: "160px", objectFit: "cover" }}
          />
          <div className="card-body">
            <h6 className="fw-bold mb-0">{name}</h6>
          </div>
        </div>
      </div>
    ))}
  </div>
</section>


      {/* Remaining sections... (unchanged) */}
      {/* ... */}
    </div>
  );
};

export default THIAWorldExclusiveStorefrontPage;
