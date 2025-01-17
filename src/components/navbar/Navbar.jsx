import React, { useState, useEffect } from "react";
import applogo from "../../assets/images/applogo.png";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingCart, User, Menu, X } from "lucide-react";
import { toast } from "react-hot-toast";
import { getCurrentUserApi } from "../../apis/Api";
import Footer from "../footer/Footer";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  useEffect(() => {
    getCurrentUserApi()
      .then((res) => {
        if (res.status === 200) {
          setUser(res.data.user);
          localStorage.setItem("user", JSON.stringify(res.data.user));
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    window.location.href = "/login";
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 20 }}
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-md" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img
                className="h-10 w-auto mr-2"
                src={applogo}
                alt="Lensify Logo"
              />
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
                Lensify
              </span>
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <NavLink to="/homepage">Home</NavLink>
            <NavLink to="/standard">Standard</NavLink>
            <NavLink to="/wedgebot">Wedgebot</NavLink>
            <NavLink to="/myorder">My Orders</NavLink>
            <NavLink to="/favourites">Favourites</NavLink>
            
            <Link
              to="/addtocart"
              className="text-gray-600 hover:text-gray-800 transition-colors duration-200"
            >
              <ShoppingCart className="w-6 h-6" />
            </Link>

            <div className="relative">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center focus:outline-none"
              >
                <User className="w-8 h-8 text-gray-600" />
                <span className="text-gray-800 font-medium">
                  {user ? user.firstName : "Guest"}
                </span>
              </button>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.1 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5"
                >
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50"
                  >
                    Edit Profile
                  </Link>
                  <Link
                    to="/signout"
                    onClick={handleLogout}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign out
                  </Link>
                </motion.div>
              )}
            </div>
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="md:hidden bg-white shadow-lg"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavLink to="/homepage" mobile>
              Home
            </NavLink>
            <NavLink to="/sunglasses" mobile>
              Sun Glasses
            </NavLink>
            <NavLink to="/powerglasses" mobile>
              Power Glasses
            </NavLink>
            <NavLink to="/myorder" mobile>
              My Orders
            </NavLink>
            <NavLink to="/favourites" mobile>
              Favourites
            </NavLink>
            <NavLink to="/addtocart" mobile>
              <ShoppingCart className="w-5 h-5 mr-2" />
              Cart
            </NavLink>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

const NavLink = ({ to, children, mobile }) => (
  <Link
    to={to}
    className={`${
      mobile
        ? "block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
        : "text-gray-600 hover:text-gray-800 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 relative group"
    }`}
  >
    {children}
    {!mobile && (
      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
    )}
  </Link>
);

export default Navbar;
