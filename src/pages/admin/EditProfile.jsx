import React, { useState, useEffect } from "react";
import Navbar from "../../components/navbar/Navbar";
import {
  getCurrentUserApi,
  uploadProfilePictureApi,
  editUserProfileApi,
} from "../../apis/Api";
import { toast } from "react-hot-toast";

const EditAdminProfile = () => {
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    username: "",
    profilePicture: null,
  });

  useEffect(() => {
    getCurrentUserApi()
      .then((res) => {
        if (res.status === 200) {
          const userData = res.data.user;
          setProfile({
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            phoneNumber: userData.phoneNumber,
            username: userData.userName,
            profilePicture: userData.profilePicture,
          });
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("Failed to fetch user details");
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("profilePicture", file);

      uploadProfilePictureApi(formData)
        .then((res) => {
          if (res.status === 200) {
            toast.success(res.data.message);
            setProfile({ ...profile, profilePicture: res.data.profilePicture });
          } else {
            toast.error(res.data.message);
          }
        })
        .catch((err) => {
          console.log(err);
          toast.error("Failed to upload profile picture");
        });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedProfile = {
      firstName: profile.firstName,
      lastName: profile.lastName,
      email: profile.email,
      phoneNumber: profile.phoneNumber,
      userName: profile.username,
      profilePicture: profile.profilePicture,
    };

    editUserProfileApi(updatedProfile)
      .then((res) => {
        if (res.status === 200) {
          toast.success(res.data.message);
        } else {
          toast.error(res.data.message);
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("Failed to update profile");
      });
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
        <div className="relative py-3 sm:max-w-3xl sm:mx-auto w-full px-4">
          <div className="relative px-4 py-10 bg-white shadow rounded-lg sm:p-10">
            <form
              className="max-w-md mx-auto space-y-6"
              onSubmit={handleSubmit}
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-8">
                Edit Profile
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Profile Image
                </label>
                <div className="mt-1 flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {profile.profilePicture ? (
                      <img
                        src={`http://localhost:5500/profile_pictures/${profile.profilePicture}`}
                        alt="Profile"
                        className="h-16 w-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-16 w-16 rounded-full bg-gray-300 flex items-center justify-center">
                        <svg
                          className="h-8 w-8 text-gray-500"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <span>Change</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      onChange={handleImageChange}
                      accept="image/*"
                    />
                  </label>
                </div>
              </div>

              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700"
                >
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  value={profile.username}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Username"
                />
              </div>

              {["firstName", "lastName", "email", "phoneNumber"].map(
                (field) => (
                  <div key={field}>
                    <label
                      htmlFor={field}
                      className="block text-sm font-medium text-gray-700 capitalize"
                    >
                      {field.replace(/([A-Z])/g, " $1").trim()}
                    </label>
                    <input
                      type={field === "email" ? "email" : "text"}
                      name={field}
                      id={field}
                      value={profile[field]}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder={field.replace(/([A-Z])/g, " $1").trim()}
                    />
                  </div>
                )
              )}

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Update Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditAdminProfile;
