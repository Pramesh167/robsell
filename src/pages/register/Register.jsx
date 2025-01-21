import React, { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import registerui from '../../assets/images/registerui2.jpg';
import { Link } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { registerUserApi } from '../../apis/Api';
import DOMPurify from 'dompurify';

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

    const sanitizeInput = (input) => DOMPurify.sanitize(input);

    const handleInputChange = (setter) => (e) => {
        const sanitizedValue = sanitizeInput(e.target.value);
        setter(sanitizedValue);
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
        } else {
            setPasswordError('');
        }
        if (!confirmPassword.trim()) {
            setConfirmPasswordError('Confirm Password is required');
            isValid = false;
        } else if (password.trim() !== confirmPassword.trim()) {
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
                        <input type="text" placeholder="First Name" value={firstName} onChange={handleInputChange(setFirstName)} className="form-input" />
                        {firstNameError && <p>{firstNameError}</p>}
                        <input type="text" placeholder="Last Name" value={lastName} onChange={handleInputChange(setLastName)} className="form-input" />
                        {lastNameError && <p>{lastNameError}</p>}
                        <input type="text" placeholder="Username" value={userName} onChange={handleInputChange(setUsername)} className="form-input" />
                        {usernameError && <p>{usernameError}</p>}
                        <input type="email" placeholder="Email" value={email} onChange={handleInputChange(setEmail)} className="form-input" />
                        {emailError && <p>{emailError}</p>}
                        <input type="tel" placeholder="Phone Number" value={phoneNumber} onChange={handleInputChange(setPhoneNumber)} className="form-input" />
                        {phoneNumberError && <p>{phoneNumberError}</p>}
                        <input type={showPassword ? "text" : "password"} placeholder="Password" value={password} onChange={handleInputChange(setPassword)} className="form-input" />
                        <button onClick={() => setShowPassword(!showPassword)}>{showPassword ? <FiEyeOff /> : <FiEye />}</button>
                        {passwordError && <p>{passwordError}</p>}
                        <input type={showConfirmPassword ? "text" : "password"} placeholder="Confirm Password" value={confirmPassword} onChange={handleInputChange(setConfirmPassword)} className="form-input" />
                        <button onClick={() => setShowConfirmPassword(!showConfirmPassword)}>{showConfirmPassword ? <FiEyeOff /> : <FiEye />}</button>
                        {confirmPasswordError && <p>{confirmPasswordError}</p>}
                        <button type="submit">Register</button>
                    </form>
                    <Link to="/login">Already have an account? Log in</Link>
                </div>
                <div className="image-section">
                    <img src={registerui} alt="Register" />
                </div>
            </div>
        </div>
    );
}

export default Register;
