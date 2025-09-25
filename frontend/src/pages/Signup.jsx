// pages/Signup.jsx
import SignupForm from "../components/Auth/SignupForm";
import Footer from "../components/Footer";
import Header from "../components/Header";

const Signup = () => (
    <>
  <Header/>
  <div className="container mt-5">
    <div className="row justify-content-center">
      <div className="col-md-6">
        <SignupForm />
      </div>
    </div>
  </div>
  <Footer/>
  </>
);

export default Signup;
