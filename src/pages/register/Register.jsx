import React, { useState } from 'react';
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

    const [firstNameError, setFirstNameError] = useState('');
    const [lastNameError, setLastNameError] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [phoneNumberError, setPhoneNumberError] = useState('')
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');

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
        if(!phoneNumber.trim()){
            setPhoneNumberError('Number is required');
            isValid = false
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
            firstName: firstName,
            lastName: lastName,
            userName: userName,
            email: email,
            phoneNumber: phoneNumber,
            password: password,
        };

        registerUserApi(data).then((res) => {
            if(res.data.sucess === false){
              toast.error(res.data.message)
            } else {
              toast.success(res.data.message)
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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500 p-4">
            <Toaster />
            <div className="bg-white rounded-lg shadow-xl overflow-hidden max-w-4xl w-full flex flex-col md:flex-row">
                <div className="w-full md:w-1/2 p-8">
                    <h2 className="text-3xl font-bold mb-2 text-gray-800">Register</h2>
                    <p className="text-gray-600 mb-6">Please fill in the details to create an account</p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <input
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                type="text"
                                name="firstname"
                                placeholder="First Name"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                            {firstNameError && <p className="text-red-500 text-sm mt-1">{firstNameError}</p>}
                        </div>
                        <div>
                            <input
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                type="text"
                                name="lastname"
                                placeholder="Last Name"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                            {lastNameError && <p className="text-red-500 text-sm mt-1">{lastNameError}</p>}
                        </div>
                        <div>
                            <input
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                type="text"
                                name="username"
                                placeholder="Username"
                                value={userName}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            {usernameError && <p className="text-red-500 text-sm mt-1">{usernameError}</p>}
                        </div>
                        <div>
                            <input
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
                        </div>
                        <div>
                            <input
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                type="tel"
                                name="phone"
                                placeholder="Phone Number"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                            />
                            {phoneNumberError && <p className="text-red-500 text-sm mt-1">{phoneNumberError}</p>}
                        </div>
                        <div>
                            <input
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
                        </div>
                        <div>
                            <input
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                type="password"
                                name="confirm-password"
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            {confirmPasswordError && <p className="text-red-500 text-sm mt-1">{confirmPasswordError}</p>}
                        </div>
                        <button type="submit" className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition duration-300">
                            Register
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            Already have an account?{' '}
                            <Link to="/login" className="text-purple-600 hover:underline">
                                Login
                            </Link>
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

export default Register