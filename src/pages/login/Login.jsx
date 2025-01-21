import React, { useCallback, useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ReCAPTCHA from "react-google-recaptcha";
import { Toaster, toast } from "react-hot-toast";
import featureImage from "../../assets/images/hilog.jpg";
import {
  loginUserApi,
  resendLoginOTPApi,
  verifyLoginOTPApi,
} from "../../apis/Api";
import { Mail, Lock, Gamepad, Eye, EyeOff } from "lucide-react";
import { refreshTokenApi } from "../../apis/Api";
import { jwtDecode } from "jwt-decode";

// Sanitize input to remove script tags and other potentially dangerous HTML
const stripScriptTags = (input) => input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");

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
  const otpInputRefs = useRef([]); // Refs for OTP input boxes

  const navigate = useNavigate();
  const checkTokenExpiry = () => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decoded.exp < currentTime) {
        // Token expired, log out the user
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      } else {
        // Refresh token 5 minutes before expiry
        const timeUntilExpiry = (decoded.exp - currentTime) * 1000;
        if (timeUntilExpiry < 5 * 60 * 1000) {
          refreshToken();
        }
      }
    }
  };
  const refreshToken = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      try {
        const response = await refreshTokenApi(user.id);
        if (response.success) {
          localStorage.setItem("token", response.token);
        } else {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/login";
        }
      } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(checkTokenExpiry, 60 * 1000);
    return () => clearInterval(interval);
  }, []);


  // Reset all fields when the component is unmounted
  useEffect(() => {
    return () => {
      setEmail("");
      setPassword("");
      setEmailError("");
      setPasswordError("");
      setCaptchaToken("");
      setShowOTPForm(false);
      setOTP("");
      setOTPError("");
      setLoginData(null);
      setShowPassword(false);
    };
  }, []);

  // Input validation
  const validation = () => {
    let isValid = true;

    const sanitizedEmail = stripScriptTags(email.trim());
    const sanitizedPassword = stripScriptTags(password.trim());

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

  // Handle email change
  const handleEmailChange = (e) => {
    const cleanValue = stripScriptTags(e.target.value);
    setEmail(cleanValue);
  };

  // Handle password change
  const handlePasswordChange = (e) => {
    const cleanValue = stripScriptTags(e.target.value);
    setPassword(cleanValue);
  };

  // Handle login
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
      email: stripScriptTags(email),
      password: stripScriptTags(password),
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

  // Handle OTP verification
  const handleOTPVerification = () => {
    if (!otp || otp.length !== 6) {
      setOTPError("Please enter a valid 6-digit OTP");
      return;
    }

    const verificationData = {
      ...loginData,
      otp: stripScriptTags(otp),
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

  // Handle login success
  const handleLoginSuccess = (data) => {
    toast.success(data.message);
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.userData));
    window.location.href = data.userData.isAdmin ? "/admin" : "/homepage";
  };

  // Handle resend OTP
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

  // InputField component
  const InputField = useCallback(
    ({
      icon: Icon,
      type,
      placeholder,
      value,
      onChange,
      error,
      isPassword,
      showPassword,
      onTogglePassword,
      name,
    }) => (
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

  // OTPInput component
  const OTPInput = useCallback(() => {
    const otpFields = Array(6).fill(""); // Create an array for 6 OTP digits

    const handleChange = (index, value) => {
      if (/^\d$/.test(value)) {
        // Only allow digits
        const newOTP = otp.split("");
        newOTP[index] = value;
        setOTP(newOTP.join(""));

        // Auto-focus to the next input field if a digit is entered
        if (index < 5 && value !== "") {
          otpInputRefs.current[index + 1].focus();
        }
      }
    };

    const handleKeyDown = (index, e) => {
      if (e.key === "Backspace" && index > 0 && !otp[index]) {
        // Move focus to the previous field on backspace
        otpInputRefs.current[index - 1].focus();
      }
    };

    return (
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="p-4 bg-cyan-900/20 rounded-full w-fit mx-auto mb-4">
            <Mail className="h-12 w-12 text-cyan-400" />
          </div>
          <h2 className="text-3xl font-bold text-cyan-100 mb-2">
            Verify Your Identity
          </h2>
          <p className="text-cyan-400">Security check sent to {email}</p>
        </div>

        <div className="space-y-4">
          <div className="flex justify-center space-x-3">
            {otpFields.map((_, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={otp[index] || ""}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                ref={(el) => (otpInputRefs.current[index] = el)} // Assign ref to each input
                className={`w-12 h-12 text-center text-2xl bg-slate-900/80 border ${
                  otpError ? "border-red-500" : "border-cyan-800"
                } rounded-lg text-cyan-100 focus:ring-2 focus:ring-cyan-500 focus:border-transparent backdrop-blur-xl transition-all duration-300`}
                autoComplete="off"
              />
            ))}
          </div>
          {otpError && <p className="text-red-400 text-sm mt-1">{otpError}</p>}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleOTPVerification}
            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-3 rounded-xl font-medium hover:from-cyan-700 hover:to-blue-700 transition-all duration-300"
          >
            Verify Code
          </motion.button>

          <button
            onClick={handleResendOTP}
            className="w-full text-cyan-400 hover:text-cyan-300 font-medium transition-colors py-2"
          >
            Resend Verification Code
          </button>
        </div>
      </div>
    );
  }, [email, otp, otpError, handleOTPVerification, handleResendOTP]);

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950
                    py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
    >
      <Toaster />

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-1/4 -left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        {/* Circuit Pattern Overlay */}
        <div className="absolute inset-0 bg-circuit-pattern opacity-5"></div>
      </div>

      <div className="max-w-6xl mx-auto">
        <div
          className="backdrop-blur-xl bg-slate-900/50 rounded-2xl border border-cyan-900/50
                      shadow-2xl overflow-hidden flex flex-col md:flex-row"
        >
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
                    onChange={handleEmailChange}
                    error={emailError}
                    name="email"
                  />

                  <InputField
                    icon={Lock}
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={handlePasswordChange}
                    error={passwordError}
                    name="password"
                    isPassword={true}
                    showPassword={showPassword}
                    onTogglePassword={() => setShowPassword(!showPassword)}
                  />

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

          {/* Feature Section */}
          <div className="hidden md:block w-1/2 relative p-12">
            <img
              src={featureImage}
              alt="Feature"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="relative z-10 h-full flex flex-col items-center justify-center text-white">
              {/* Add your overlay content here if needed */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;