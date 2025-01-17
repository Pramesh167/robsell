import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import loginui from "../../assets/images/loginui.png";
import "./Login.css";
import { Toaster, toast } from "react-hot-toast";
import {
  googleLoginApi,
  loginUserApi,
  getUserByGoogleEmail,
} from "../../apis/Api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [googleToken, setGoogleToken] = useState("");
  const [googleId, setGoogleId] = useState("");
  const [role, setRole] = useState("");
  const [showModal, setShowModal] = useState(false);

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

    const data = {
      email: email,
      password: password,
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
        } else {
          toast.error("Login failed. Please try again.");
        }
      });
  };

  const handleGoogleLogin = () => {
    googleLoginApi({ token: googleToken, googleId, role, password })
      .then((response) => {
        if (response.status === 201) {
          toast.success("Login Successful");
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("user", JSON.stringify(response.data.user));
          window.location.href = "/homepage";
        } else {
          console.error("Failed to send token to backend");
        }
      })
      .catch((error) =>
        console.error("Error sending token to backend:", error)
      );
  };

  return (
    <div className="login-container bg-gradient-to-r from-blue-500 to-purple-600">
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
            <button type="submit" className="login-button">
              Login
            </button>
          </form>
          <div className="google-login">
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                const token = credentialResponse.credential;
                const details = jwtDecode(token);
                setGoogleId(details.sub);
                setGoogleToken(token);

                getUserByGoogleEmail({ token })
                  .then((response) => {
                    if (response.status === 200) {
                      handleGoogleLogin({ token });
                    } else if (response.status === 201) {
                      setShowModal(true);
                    }
                  })
                  .catch((error) => {
                    if (error.response && error.response.status === 400) {
                      toast.warning(error.response.data.message);
                    } else {
                      toast.error("Error: Something went wrong");
                    }
                  });
              }}
              onError={() => {
                console.log("Login Failed");
              }}
            />
          </div>
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

      {/* Modal for first-time Google login */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-8">
            <h2 className="mb-4 text-2xl font-bold">
              Complete Your Registration
            </h2>
            
            <input
              type="password"
              placeholder="Set a password"
              className="mb-4 w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-indigo-500"
              onChange={(e) => setPassword(e.target.value)}
            />
            
            <div className="flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="mr-2 px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleGoogleLogin}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
              >
                Complete Registration
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
