import React, { useState, useEffect } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import registerui from '../../assets/images/registerui2.jpg';
import { Link } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { registerUserApi } from '../../apis/Api';

function Register() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [userName, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [firstNameError, setFirstNameError] = useState('');
    const [lastNameError, setLastNameError] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [phoneNumberError, setPhoneNumberError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');

    // Password checklist state
    const [passwordChecklist, setPasswordChecklist] = useState({
        minLength: false,
        hasLowercase: false,
        hasUppercase: false,
        hasSpecialChar: false,
    });

    // Validate password requirements
    const validatePassword = (password) => {
        const minLength = password.length >= 8;
        const hasLowercase = /[a-z]/.test(password);
        const hasUppercase = /[A-Z]/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        setPasswordChecklist({
            minLength,
            hasLowercase,
            hasUppercase,
            hasSpecialChar,
        });
    };

    // Update password checklist whenever password changes
    useEffect(() => {
        validatePassword(password);
    }, [password]);

    const stripScriptTags = (input) => input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");

    const handleChange = (value, setter) => {
        const cleanValue = stripScriptTags(value);
        setter(cleanValue);
    };

    const handlePhoneNumberChange = (value) => {
        const cleanValue = stripScriptTags(value);
        if (/^\d*$/.test(cleanValue)) {
            setPhoneNumber(cleanValue);
        }
    };

    const validateForm = () => {
        let isValid = true;
        if (!firstName.trim()) {
            setFirstNameError('First Name is required');
            isValid = false;
        } else {
            setFirstNameError('');
        }
        if (!lastName.trim()) {
            setLastNameError('Last Name is required');
            isValid = false;
        } else {
            setLastNameError('');
        }
        if (!userName.trim()) {
            setUsernameError('Username is required');
            isValid = false;
        } else {
            setUsernameError('');
        }
        if (!email.trim()) {
            setEmailError('Email is required');
            isValid = false;
        } else {
            setEmailError('');
        }
        if (!phoneNumber.trim()) {
            setPhoneNumberError('Number is required');
            isValid = false;
        } else {
            setPhoneNumberError('');
        }
        if (!password.trim()) {
            setPasswordError('Password is required');
            isValid = false;
        } else if (!passwordChecklist.minLength || !passwordChecklist.hasLowercase || !passwordChecklist.hasUppercase || !passwordChecklist.hasSpecialChar) {
            setPasswordError('Password does not meet the requirements');
            isValid = false;
        } else {
            setPasswordError('');
        }
        if (!confirmPassword.trim()) {
            setConfirmPasswordError('Confirm Password is required');
            isValid = false;
        } else if (password !== confirmPassword) {
            setConfirmPasswordError('Passwords do not match');
            isValid = false;
        } else {
            setConfirmPasswordError('');
        }
        return isValid;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const data = {
            firstName,
            lastName,
            userName,
            email,
            phoneNumber,
            password
        };

        registerUserApi(data)
            .then((res) => {
                if (res.data.success === false) {
                    toast.error(res.data.message);
                } else {
                    toast.success(res.data.message);
                }
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.message) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error('Registration failed. Please try again.');
                }
            });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-4">
            <Toaster />
            <div className="bg-gray-900 text-gray-200 rounded-lg shadow-xl overflow-hidden max-w-4xl w-full flex flex-col md:flex-row">
                <div className="w-full md:w-1/2 p-8">
                    <h2 className="text-3xl font-bold mb-2 text-white">Register</h2>
                    <p className="text-gray-400 mb-6">Please fill in the details to create an account</p>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <input
                                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-200"
                                type="text"
                                placeholder="First Name"
                                value={firstName}
                                onChange={(e) => handleChange(e.target.value, setFirstName)}
                            />
                            {firstNameError && <p className="text-red-500 text-sm mt-1">{firstNameError}</p>}
                        </div>
                        <div>
                            <input
                                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-200"
                                type="text"
                                placeholder="Last Name"
                                value={lastName}
                                onChange={(e) => handleChange(e.target.value, setLastName)}
                            />
                            {lastNameError && <p className="text-red-500 text-sm mt-1">{lastNameError}</p>}
                        </div>
                        <div>
                            <input
                                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-200"
                                type="text"
                                placeholder="Username"
                                value={userName}
                                onChange={(e) => handleChange(e.target.value, setUsername)}
                            />
                            {usernameError && <p className="text-red-500 text-sm mt-1">{usernameError}</p>}
                        </div>
                        <div>
                            <input
                                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-200"
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => handleChange(e.target.value, setEmail)}
                            />
                            {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
                        </div>
                        <div>
                            <input
                                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-200"
                                type="tel"
                                placeholder="Phone Number"
                                value={phoneNumber}
                                onChange={(e) => handlePhoneNumberChange(e.target.value)}
                            />
                            {phoneNumberError && <p className="text-red-500 text-sm mt-1">{phoneNumberError}</p>}
                        </div>
                        <div className="relative">
                            <input
                                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-200"
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => handleChange(e.target.value, setPassword)}
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FiEyeOff /> : <FiEye />}
                            </button>
                            {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
                        </div>
                        {/* Password Checklist */}
                        <div className="text-sm text-gray-400">
                            <p>Password must meet the following requirements:</p>
                            <ul className="list-disc pl-5">
                                <li className={passwordChecklist.minLength ? 'text-green-500' : 'text-red-500'}>
                                    At least 8 characters
                                </li>
                                <li className={passwordChecklist.hasLowercase ? 'text-green-500' : 'text-red-500'}>
                                    Contains a lowercase letter
                                </li>
                                <li className={passwordChecklist.hasUppercase ? 'text-green-500' : 'text-red-500'}>
                                    Contains an uppercase letter
                                </li>
                                <li className={passwordChecklist.hasSpecialChar ? 'text-green-500' : 'text-red-500'}>
                                    Contains a special character
                                </li>
                            </ul>
                        </div>
                        <div className="relative">
                            <input
                                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-200"
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => handleChange(e.target.value, setConfirmPassword)}
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                            </button>
                            {confirmPasswordError && <p className="text-red-500 text-sm mt-1">{confirmPasswordError}</p>}
                        </div>
                        <button type="submit" className="w-full bg-purple-700 hover:bg-purple-800 text-white py-2 rounded-md transition duration-300">
                            Register
                        </button>
                    </form>
                    <div className="mt-6 text-center">
                        <p>
                            Already have an account? <Link to="/login" className="text-purple-400 hover:text-purple-300">Login</Link>
                        </p>
                    </div>
                </div>
                <div className="hidden md:block w-1/2">
                    <img
                        src={registerui}
                        alt="Register"
                        className="object-cover w-full h-full"
                    />
                </div>
            </div>
        </div>
    );
}

export default Register;