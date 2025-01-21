// Login.jsx

import React, { useCallback, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ReCAPTCHA from "react-google-recaptcha";
import { Toaster, toast } from "react-hot-toast";
//importing feature image
import featureImage from '../../assets/images/hilog.jpg';
import { loginUserApi, resendLoginOTPApi, verifyLoginOTPApi } from "../../apis/Api";
import {
  Mail,
  Lock,
  Gamepad,
  
  Cpu,
  Zap,
  Shield,
  Eye,
  EyeOff,
} from "lucide-react";
 
const sanitizeInput = (input) => {
  const element = document.createElement("div");
  element.innerText = input;
  return element.innerText;
};
 
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const [showOTPForm, setShowOTPForm] = useState(false);
  const [otp, setOTP] = useState("");
  const [otpError, setOTPError] = useState("");
  const [loginData, setLoginData] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const recaptchaRef = useRef(null);
 
  const navigate = useNavigate();
 
  const validation = () => {
    let isValid = true;
 
    const sanitizedEmail = sanitizeInput(email.trim());
    const sanitizedPassword = sanitizeInput(password.trim());
 
    if (sanitizedEmail.trim() === "" || !sanitizedEmail.includes("@")) {
      setEmailError("Email is empty or invalid");
      isValid = false;
    } else {
      setEmailError("");
    }
 
    if (sanitizedPassword.trim() === "") {
      setPasswordError("Password is empty");
      isValid = false;
    } else {
      setPasswordError("");
    }
 
    return isValid;
  };
 
  const handleEmailChange = (e) => {
    setEmail(sanitizeInput(e.target.value));
  };
 
  const handlePasswordChange = (e) => {
    setPassword(sanitizeInput(e.target.value));
  };
 
  const handleLogin = (e) => {
    e.preventDefault();
 
    if (!validation()) return;
 
    if (!captchaToken) {
      toast.error("CAPTCHA is missing or expired. Please complete it.");
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
        recaptchaRef.current.execute();
      }
      return;
    }
 
    const data = {
      email: sanitizeInput(email),
      password: sanitizeInput(password),
      recaptchaToken: captchaToken,
    };
 
    loginUserApi(data)
      .then((res) => {
        if (res.data.requireOTP) {
          setLoginData(data);
          setShowOTPForm(true);
          toast.success("OTP sent to your email");
        } else if (res.data.success === false) {
          toast.error(res.data.message);
        } else {
          handleLoginSuccess(res.data);
        }
      })
      .catch((error) => {
        if (
          error.response?.status === 401 &&
          error.response?.data?.message.includes("CAPTCHA expired")
        ) {
          toast.error("CAPTCHA expired. Please refresh and try again.");
          if (recaptchaRef.current) {
            recaptchaRef.current.reset();
          }
        } else {
          toast.error(
            error.response?.data?.message || "Login failed. Please try again."
          );
        }
      });
  };
 
  const handleOTPVerification = () => {
    if (!otp) {
      setOTPError("Please enter the OTP");
      return;
    }
 
    const verificationData = {
      ...loginData,
      otp: sanitizeInput(otp),
    };
 
    verifyLoginOTPApi(verificationData)
      .then((res) => {
        if (res.data.success) {
          handleLoginSuccess(res.data);
        } else {
          toast.error(res.data.message);
        }
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || "OTP verification failed");
      });
  };
 
  const handleLoginSuccess = (data) => {
    toast.success(data.message);
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.userData));
    window.location.href = data.userData.isAdmin ? "/admin" : "/homepage";
  };
 
  const handleResendOTP = () => {
    resendLoginOTPApi({ email: loginData.email })
      .then((res) => {
        if (res.data.success) {
          toast.success("OTP resent successfully");
        } else {
          toast.error(res.data.message);
        }
      })
      .catch((error) => {
        toast.error("Failed to resend OTP");
      });
  };
 
  const InputField = useCallback(
    ({ icon: Icon, type, placeholder, value, onChange, error, isPassword, showPassword, onTogglePassword, name }) => (
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-cyan-400" />
        </div>
        <input
          type={isPassword ? (showPassword ? "text" : "password") : type}
          className={`w-full pl-10 ${isPassword ? "pr-10" : "pr-4"} py-3
          bg-slate-900/80 border ${error ? "border-red-500" : "border-cyan-800"}
          rounded-xl text-cyan-100 placeholder-cyan-700
          focus:ring-2 focus:ring-cyan-500 focus:border-transparent
          backdrop-blur-xl transition-all duration-300`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          name={name}
          autoComplete="off"
          style={{ caretColor: "#06b6d4" }}
        />
        {isPassword && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={onTogglePassword}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5 text-cyan-600 hover:text-cyan-400" />
            ) : (
              <Eye className="h-5 w-5 text-cyan-600 hover:text-cyan-400" />
            )}
          </button>
        )}
        {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
      </div>
    ),
    []
  );

  const OTPInput = useCallback(() => (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="p-4 bg-cyan-900/20 rounded-full w-fit mx-auto mb-4">
          <Mail className="h-12 w-12 text-cyan-400" />
        </div>
        <h2 className="text-3xl font-bold text-cyan-100 mb-2">
          Verify Your Identity
        </h2>
        <p className="text-cyan-400">
          Security check sent to {email}
        </p>
      </div>

      <div className="space-y-4">
        <input
          type="text"
          className={`w-full px-4 py-3 text-center text-2xl tracking-widest
            bg-slate-900/80 border ${otpError ? "border-red-500" : "border-cyan-800"}
            rounded-xl text-cyan-100 placeholder-cyan-700
            focus:ring-2 focus:ring-cyan-500 focus:border-transparent
            backdrop-blur-xl transition-all duration-300`}
          placeholder="Enter Verification Code"
          value={otp}
          onChange={(e) => setOTP(e.target.value)}
          maxLength="6"
          autoComplete="off"
        />
        {otpError && <p className="text-red-400 text-sm mt-1">{otpError}</p>}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleOTPVerification}
          className="w-full bg-gradient-to-r from-cyan-600 to-blue-600
                   text-white py-3 rounded-xl font-medium
                   hover:from-cyan-700 hover:to-blue-700
                   transition-all duration-300"
        >
          Verify Code
        </motion.button>

        <button
          onClick={handleResendOTP}
          className="w-full text-cyan-400 hover:text-cyan-300
                   font-medium transition-colors py-2"
        >
          Resend Verification Code
        </button>
      </div>
    </div>
  ));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950
                    py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <Toaster />

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-1/4 -left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        
        {/* Circuit Pattern Overlay */}
        <div className="absolute inset-0 bg-circuit-pattern opacity-5"></div>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="backdrop-blur-xl bg-slate-900/50 rounded-2xl border border-cyan-900/50
                      shadow-2xl overflow-hidden flex flex-col md:flex-row">
          
          {/* Form Section */}
          <div className="w-full md:w-1/2 p-8 lg:p-12">
            {!showOTPForm ? (
              <>
                <div className="text-center mb-8">
                  <div className="flex justify-center mb-4">
                    <div className="p-4 bg-cyan-900/20 rounded-full">
                      <Gamepad className="h-12 w-12 text-cyan-400" />
                    </div>
                  </div>
                  <h2 className="text-3xl font-bold text-cyan-100 mb-2">
                    Access Robsell
                  </h2>
                  <p className="text-cyan-400">
                    Your gateway to premium robotics
                  </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                  <InputField
                    icon={Mail}
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={emailError}
                    name="email"
                  />

                  <InputField
                    icon={Lock}
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={passwordError}
                    name="password"
                    isPassword={true}
                    showPassword={showPassword}
                    onTogglePassword={() => setShowPassword(!showPassword)}
                  />

                  {/* <div className="flex items-center justify-between">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="form-checkbox h-4 w-4 text-cyan-600 rounded border-cyan-700 bg-slate-800/50"
                      />
                      <span className="ml-2 text-sm text-cyan-400">
                        Remember me
                      </span>
                    </label>
                    <Link
                      to="/forgetpassword"
                      className="text-sm text-cyan-400 hover:text-cyan-300 font-medium"
                    >
                      Reset Password
                    </Link>
                  </div> */}

                  <div className="flex justify-center bg-slate-900/50 p-4 rounded-xl backdrop-blur-sm">
                    <ReCAPTCHA
                      ref={recaptchaRef}
                      sitekey="6LfMdLwqAAAAAFb3ezw9X3MVdeu5wVT7Gu4yZBvm"
                      theme="dark"
                      onChange={(token) => setCaptchaToken(token)}
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={!captchaToken}
                    className="w-full bg-gradient-to-r from-cyan-600 to-blue-600
                             text-white py-3 rounded-xl font-medium
                             hover:from-cyan-700 hover:to-blue-700
                             transition-all duration-300
                             disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Access System
                  </motion.button>
                </form>

                <div className="mt-8 text-center">
                  <p className="text-cyan-400">
                    New to RoboRobsell?{" "}
                    <Link
                      to="/register"
                      className="text-cyan-300 hover:text-cyan-200 font-medium"
                    >
                      Create Account
                    </Link>
                  </p>
                </div>
              </>
            ) : (
              <OTPInput />
            )}
          </div>
          
// Feature Section
<div className="hidden md:block w-1/2 relative p-12">
  <img src={featureImage} alt="Feature" className="absolute inset-0 w-full h-full object-cover" />
  <div className="relative z-10 h-full flex flex-col items-center justify-center text-white">
    {/* Add your overlay content here if needed */}
  </div>
</div>

          

          {/* Feature Section
          <div className="hidden md:block w-1/2 relative bg-gradient-to-br from-slate-950 to-cyan-950 p-12">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-sm" />
            <div className="relative z-10 h-full flex flex-col items-center justify-center text-cyan-100">
              <div className="grid grid-cols-2 gap-6 w-full max-w-md">
                <div className="p-4 bg-slate-900/80 rounded-xl backdrop-blur-sm border border-cyan-900/50 hover:border-cyan-500/50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <Cpu className="w-6 h-6 text-cyan-400" />
                    <div>
                      <p className="font-medium">AI-Powered</p>
                      <p className="text-sm text-cyan-400">Smart assistance</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-slate-900/80 rounded-xl backdrop-blur-sm border border-cyan-900/50 hover:border-cyan-500/50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <Zap className="w-6 h-6 text-cyan-400" />
                    <div>
                      <p className="font-medium">Quick Deploy</p>
                      <p className="text-sm text-cyan-400">Instant setup</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-slate-900/80 rounded-xl backdrop-blur-sm border border-cyan-900/50 hover:border-cyan-500/50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <Gamepad className="w-6 h-6 text-cyan-400" />
                    <div>
                      <p className="font-medium">Premium Bots</p>
                      <p className="text-sm text-cyan-400">Top quality</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-slate-900/80 rounded-xl backdrop-blur-sm border border-cyan-900/50 hover:border-cyan-500/50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <Shield className="w-6 h-6 text-cyan-400" />
                    <div>
                      <p className="font-medium">Secure Access</p>
                      <p className="text-sm text-cyan-400">Enhanced safety</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Login;