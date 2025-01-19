import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Recaptcha from "react-google-recaptcha";

import { jwtDecode } from "jwt-decode";
import loginui from "../../assets/images/loginui.png";
import "./Login.css";
import { Toaster, toast } from "react-hot-toast";
import {
  loginUserApi,
} from "../../apis/Api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [role, setRole] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");
  const recaptchaRef = useRef(null);

  const navigate = useNavigate();

  const validation = () => {
    let isValid = true;

    if (email.trim() === "" || !email.includes("@")) {
      setEmailError("Email is empty or invalid");
      isValid = false;
    }

    if (password.trim() === "") {
      setPasswordError("Password is empty");
      isValid = false;
    }

    return isValid;
  };

  const handleLogin = (e) => {
    e.preventDefault();
  
    if (!validation()) {
      return;
    }
    if (!captchaToken) {
      toast.error("CAPTCHA is missing or expired. Please complete it.");
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
        recaptchaRef.current.execute();
      }
      return;
    }
    const data = {
      email: email,
      password: password,
      recaptchaToken: captchaToken,
    };

    loginUserApi(data)
      .then((res) => {
        if (res.data.success === false) {
          toast.error(res.data.message);
        } else {
          toast.success(res.data.message);
          localStorage.setItem("token", res.data.token);
          const convertedData = JSON.stringify(res.data.userData);
          localStorage.setItem("user", convertedData);
          window.location.href = res.data.userData.isAdmin
            ? "/admin"
            : "/homepage";
        }
      })
      .catch((error) => {
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          toast.error(error.response.data.message);
        }if(
          recaptchaRef.current){
          recaptchaRef.current.reset();

          }
        
         else {
          toast.error("Login failed. Please try again.");
        }
      });
  };


  return (
    <div className="login-container bg-gradient-to-r from-black to-purple-900">
      <Toaster />
      <div className="login-box">
        <div className="login-form">
          <h2 className="login-title">Login</h2>
          <p className="login-subtitle">Please Login to Continue</p>
          <form onSubmit={handleLogin} className="login-fields">
            <div className="input-container">
              <input
                onChange={(e) => setEmail(e.target.value)}
                className="login-input"
                type="text"
                name="email"
                value={email}
                placeholder="Email"
              />
              {emailError && (
                <p className="login-error-message">{emailError}</p>
              )}
            </div>
            <div className="input-container">
              <input
                className="login-input"
                type="password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {passwordError && (
                <p className="login-error-message">{passwordError}</p>
              )}
              <p className="text-right mt-2">
                <Link
                  to="/forgetpassword"
                  className="text-blue-600 hover:underline text-sm"
                >
                  Forgot Password?
                </Link>
              </p>
            </div>
            <Recaptcha
              ref={recaptchaRef}
              sitekey={"6LfMdLwqAAAAAFb3ezw9X3MVdeu5wVT7Gu4yZBvm"}
              onChange={(token) => setCaptchaToken(token)}>

              </Recaptcha>
            <button type="submit" disabled={(!captchaToken)} className="login-button ">
              Login
            </button>
          </form>

     
          <div className="register-link">
            <p>
              Don't have an account?{" "}
              <Link to="/register" className="text-blue-600 hover:underline">
                Register
              </Link>
            </p>
          </div>
        </div>
        <div className="login-image">
          <img src={loginui} alt="Login" />
        </div>
      </div>
    </div>
  );
};

export default Login;
