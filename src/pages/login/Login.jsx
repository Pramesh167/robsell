import React, { useCallback, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ReCAPTCHA from "react-google-recaptcha";
import { Toaster, toast } from "react-hot-toast";
import { loginUserApi, resendLoginOTPApi, verifyLoginOTPApi } from "../../apis/Api";
import {
  Mail,
  Lock,
  Headphones,
  Smartphone,
  Battery,
  Wifi,
  Bluetooth,
  Shield,
  Eye,
  EyeOff,
} from "lucide-react";
import loginui from "../../assets/images/loginui.png";
 
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
 
 
 
    if (email.trim() === "" || !email.includes("@")) {
      setEmailError("Email is empty or invalid");
      isValid = false;
    } else {
      setEmailError("");
    }
    if (password.trim() === "") {
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
            // recaptchaRef.current.execute();
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
          <Icon className="h-5 w-5 text-blue-400" />
        </div>
        <input
          type={isPassword ? (showPassword ? "text" : "password") : type}
          className={`w-full pl-10 ${isPassword ? "pr-10" : "pr-4"} py-3
        bg-gray-800/50 border ${error ? "border-red-500" : "border-gray-700"}
        rounded-xl text-gray-300 placeholder-gray-500
        focus:ring-2 focus:ring-blue-500 focus:border-transparent
        backdrop-blur-sm transition-all duration-300`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          name={name}
          autoComplete="new-password"
          style={{ caretColor: "white" }}
        />
        {isPassword && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={onTogglePassword}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-300" />
            ) : (
              <Eye className="h-5 w-5 text-gray-400 hover:text-gray-300" />
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
        <div className="p-4 bg-blue-500/10 rounded-full w-fit mx-auto mb-4">
          <Mail className="h-12 w-12 text-blue-400" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">
          Verify Your Login
        </h2>
        <p className="text-gray-400">
          We've sent a verification code to {email}
        </p>
      </div>
 
      <div className="space-y-4">
        <div className="relative">
          <input
            type="text"
            className={`w-full px-4 py-3 text-center text-2xl tracking-widest
              bg-gray-800/50 border ${
                otpError ? "border-red-500" : "border-gray-700"
              }
              rounded-xl text-gray-300 placeholder-gray-500
              focus:ring-2 focus:ring-blue-500 focus:border-transparent
              backdrop-blur-sm transition-all duration-300`}
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOTP(sanitizeInput(e.target.value))}
            maxLength="6"
            autoComplete="off"
          />
          {otpError && <p className="text-red-400 text-sm mt-1">{otpError}</p>}
        </div>
 
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleOTPVerification}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600
                   text-white py-3 rounded-xl font-medium
                   hover:from-blue-700 hover:to-purple-700
                   transition-all duration-300"
        >
          Verify OTP
        </motion.button>
 
        <button
          onClick={handleResendOTP}
          className="w-full text-blue-400 hover:text-blue-300
                   font-medium transition-colors py-2"
        >
          Didn't receive the code? Resend
        </button>
      </div>
    </div>
  ));
 
  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900
                    py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
    >
      <Toaster />
 
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-1/4 -left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>
 
      {/* Floating Tech Icons */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute top-20 left-10 opacity-20"
      >
        <Headphones className="h-16 w-16 text-blue-400" />
      </motion.div>
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute top-40 right-10 opacity-20"
      >
        <Smartphone className="h-20 w-20 text-purple-400" />
      </motion.div>
 
      <div className="max-w-6xl mx-auto">
        <div
          className="backdrop-blur-xl bg-gray-800/50 rounded-2xl border border-gray-700
                      shadow-2xl overflow-hidden flex flex-col md:flex-row"
        >
          {/* Form Section */}
          <div className="w-full md:w-1/2 p-8 lg:p-12">
            {!showOTPForm ? (
              <>
                <div className="text-center mb-8">
                  <div className="flex justify-center mb-4">
                    <div className="p-4 bg-blue-500/10 rounded-full">
                      <Headphones className="h-12 w-12 text-blue-400" />
                    </div>
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-2">
                    Welcome Back
                  </h2>
                  <p className="text-gray-400">
                    Sign in to your premium tech account
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
 
                  <div className="flex items-center justify-between">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-700 bg-gray-800/50"
                      />
                      <span className="ml-2 text-sm text-gray-400">
                        Remember me
                      </span>
                    </label>
                    <Link
                      to="/forgetpassword"
                      className="text-sm text-blue-400 hover:text-blue-300 font-medium"
                    >
                      Forgot Password?
                    </Link>
                  </div>
 
                  <div className="flex justify-center bg-gray-800/50 p-4 rounded-xl backdrop-blur-sm">
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
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600
                             text-white py-3 rounded-xl font-medium
                             hover:from-blue-700 hover:to-purple-700
                             transition-all duration-300
                             disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Sign In
                  </motion.button>
                </form>
 
                <div className="mt-8 text-center">
                  <p className="text-gray-400">
                    Don't have an account?{" "}
                    <Link
                      to="/register"
                      className="text-blue-400 hover:text-blue-300 font-medium"
                    >
                      Join now
                    </Link>
                  </p>
                </div>
              </>
            ) : (
            <OTPInput />
            )}
          </div>
 
          {/* Feature Section */}
          <div className="hidden md:block w-1/2 relative bg-gradient-to-br from-gray-900 to-gray-800 p-12">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm" />
            <div className="relative z-10 h-full flex flex-col items-center justify-center text-white">
              <div className="grid grid-cols-2 gap-6 w-full max-w-md">
                <div className="p-4 bg-gray-800/50 rounded-xl backdrop-blur-sm border border-gray-700">
                  <div className="flex items-center space-x-3">
                    <Battery className="w-6 h-6 text-blue-400" />
                    <div>
                      <p className="font-medium text-white">40Hr Battery</p>
                      <p className="text-sm text-gray-400">
                        Long-lasting power
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-gray-800/50 rounded-xl backdrop-blur-sm border border-gray-700">
                  <div className="flex items-center space-x-3">
                    <Bluetooth className="w-6 h-6 text-purple-400" />
                    <div>
                      <p className="font-medium text-white">Premium Audio</p>
                      <p className="text-sm text-gray-400">
                        Crystal clear sound
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-gray-800/50 rounded-xl backdrop-blur-sm border border-gray-700">
                  <div className="flex items-center space-x-3">
                    <Wifi className="w-6 h-6 text-green-400" />
                    <div>
                      <p className="font-medium text-white">5G Ready</p>
                      <p className="text-sm text-gray-400">Lightning fast</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-gray-800/50 rounded-xl backdrop-blur-sm border border-gray-700">
                  <div className="flex items-center space-x-3">
                    <Shield className="w-6 h-6 text-yellow-400" />
                    <div>
                      <p className="font-medium text-white">Secure Login</p>
                      <p className="text-sm text-gray-400">Protected access</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
 
            <img
              src={loginui}
              alt="Premium Tech"
              className="mt-12 max-w-sm rounded-xl border border-gray-700 shadow-2xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
 
export default Login;