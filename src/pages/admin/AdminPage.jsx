import React, { useState, useEffect } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import {
  FaShoppingCart,
  FaList,
  FaClipboardList,
  FaUserCircle,
  FaSignOutAlt,
  FaUserClock,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import AddProduct from "./AddProduct";
import ViewProduct from "./ViewProduct";
import ViewOrder from "./ViewOrder";
import UserLog from "./UserLog"; // Import the UserLog component
import logo from "../../assets/images/applogo.png";
import { toast } from "react-hot-toast";
import { getCurrentUserApi } from "../../apis/Api";

const AdminPage = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profilePicture, setProfilePicture] = useState(
    "/api/placeholder/40/40"
  );
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  useEffect(() => {
    getCurrentUserApi()
      .then((res) => {
        if (res.status === 200) {
          setUser(res.data.user);
          setProfilePicture(
            `https://localhost:5500/profile_pictures/${res.data.user.profilePicture}`
          );
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    window.location.href = "/login";
  };

  return (
    <div className="bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen flex flex-col">
      <header className="flex justify-between items-center p-4 bg-white shadow-lg">
        <div className="flex items-center">
          <img
            src={logo}
            alt="Robsell Logo"
            className="w-12 h-12 mr-2 rounded-full"
          />
          <span className="text-2xl font-bold text-red-600">Robsell</span>
        </div>
        <div className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-purple-600">
          Admin Panel
        </div>
        <div className="relative">
          <motion.img
            src={profilePicture}
            alt="Profile"
            className="w-10 h-10 rounded-full cursor-pointer border-2 border-red-600"
            onClick={toggleDropdown}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          />
          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-10"
              >
                <a
                  href="/adminprofile"
                  className="block px-4 py-2 text-gray-800 hover:bg-red-100 flex items-center cursor-pointer"
                >
                  <FaUserCircle className="mr-2" /> Edit Profile
                </a>
                <a
                  onClick={handleLogout}
                  className="block px-4 py-2 text-gray-800 hover:bg-red-100 rounded-b-lg flex items-center cursor-pointer"
                >
                  <FaSignOutAlt className="mr-2" /> Logout
                </a>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>
      <Tabs className="flex-grow p-6">
        <TabList className="flex justify-center bg-white rounded-full shadow-md p-1 mb-6">
          <Tab
            className="bg-red-600 text-white py-2 px-6 rounded-full flex items-center mx-2 transition-all duration-300 ease-in-out"
            selectedClassName="bg-purple-600 shadow-lg transform scale-105"
          >
            <FaShoppingCart className="mr-2" /> Add Product
          </Tab>
          <Tab
            className="bg-red-600 text-white py-2 px-6 rounded-full flex items-center mx-2 transition-all duration-300 ease-in-out"
            selectedClassName="bg-purple-600 shadow-lg transform scale-105"
          >
            <FaList className="mr-2" /> View Products
          </Tab>
          <Tab
            className="bg-red-600 text-white py-2 px-6 rounded-full flex items-center mx-2 transition-all duration-300 ease-in-out"
            selectedClassName="bg-purple-600 shadow-lg transform scale-105"
          >
            <FaClipboardList className="mr-2" /> Order Details
          </Tab>
          <Tab
            className="bg-red-600 text-white py-2 px-6 rounded-full flex items-center mx-2 transition-all duration-300 ease-in-out"
            selectedClassName="bg-purple-600 shadow-lg transform scale-105"
          >
            <FaUserClock className="mr-2" /> User Logs
          </Tab>
        </TabList>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <TabPanel>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <AddProduct />
            </motion.div>
          </TabPanel>
          <TabPanel>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ViewProduct />
            </motion.div>
          </TabPanel>
          <TabPanel>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ViewOrder />
            </motion.div>
          </TabPanel>
          <TabPanel>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <UserLog />
            </motion.div>
          </TabPanel>
        </div>
      </Tabs>
    </div>
  );
};

export default AdminPage;