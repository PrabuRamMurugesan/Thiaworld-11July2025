// pages/Login.jsx
import LoginForm from "../components/Auth/LoginForm";
import Footer from "../components/Footer";
import Header from "../components/Header";

const Login = () => (
  <>
  <Header/>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <LoginForm />
        </div>
      
    </div>
    <Footer/>
  </>
);

export default Login;
