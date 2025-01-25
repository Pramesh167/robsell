
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { createProductApi } from '../../apis/Api';
import { motion } from 'framer-motion';
import { Camera, Package, DollarSign, Hash, FileText } from 'lucide-react';
import axios from 'axios';

const AddProduct = () => {
  const [productName, setProductName] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productQuantity, setProductQuantity] = useState('');
  const [productImage, setProductImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [csrfToken, setCsrfToken] = useState(null); // State to store CSRF token

  // Fetch CSRF token when the component mounts
  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await axios.get(
          "https://localhost:5500/api/csrf-token",
          {
            withCredentials: true, // Include cookies
          }
        );
        setCsrfToken(response.data.csrfToken); // Store the CSRF token
      } catch (error) {
        console.error("Error fetching CSRF token:", error);
      }
    };

    fetchCsrfToken();
  }, []);



  const handleImage = (event) => {
    const file = event.target.files[0];
    setProductImage(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async(e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('productName', productName);
    formData.append('productPrice', productPrice);
    formData.append('productCategory', productCategory);
    formData.append('productDescription', productDescription);
    formData.append('productQuantity', productQuantity);
    formData.append('productImage', productImage);
    try {
      const response = await axios.post(
        "https://localhost:5500/api/product/create",
        formData,
        {
          headers: {
            "X-CSRF-Token": csrfToken, 
          },
          withCredentials: true,
        }
      );

      if (response.status === 201) {
        toast.success(response.data.message);

        
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          toast.warning(error.response.data.message);
        } else if (error.response.status === 500) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Something went wrong");
        }
      } else {
        toast.error("Something went wrong");
      }
    }

    // createProductApi(formData)
    //   .then((res) => {
    //     if (res.data.success) {
    //       toast.success(res.data.message);
    //     }
    //   })
    //   .catch((error) => {
    //     if (error.response) {
    //       if (error.response.status === 400) {
    //         toast.error(error.response.data.message);
    //       } else if (error.response.status === 401) {
    //         toast.error(error.response.data.message);
    //       } else {
    //         toast.error("Something went wrong");
    //       }
    //     }
    //   });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-8 max-w-5xl mx-auto bg-white rounded-xl shadow-2xl"
    >
      <h1 className="text-4xl font-bold text-center mb-10 text-gray-800">Add New Product</h1>
      <form className="space-y-8" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="col-span-1"
          >
            <label className="flex items-center text-lg font-medium text-gray-700 mb-3" htmlFor="productName">
              <Package className="mr-2" size={24} />
              Product Name
            </label>
            <input
              className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
              id="productName"
              type="text"
              placeholder="Enter product name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="col-span-1"
          >
            <label className="flex items-center text-lg font-medium text-gray-700 mb-3" htmlFor="productCategory">
              <Hash className="mr-2" size={24} />
              Product Category
            </label>
            <select
              className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
              id="productCategory"
              value={productCategory}
              onChange={(e) => setProductCategory(e.target.value)}
            >
              <option value="" disabled>Select Category</option>
              <option value="Standard Bot">Standard</option>
              <option value="Wedge Bot">Wedgebot</option>
            </select>
          </motion.div>
        </div>
        <motion.div 
          whileHover={{ scale: 1.02 }}
        >
          <label className="flex items-center text-lg font-medium text-gray-700 mb-3" htmlFor="productPrice">
            <DollarSign className="mr-2" size={24} />
            Product Price
          </label>
          <input
            className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
            id="productPrice"
            type="text"
            placeholder="Enter product price"
            value={productPrice}
            onChange={(e) => setProductPrice(e.target.value)}
          />
        </motion.div>
        <motion.div 
          whileHover={{ scale: 1.02 }}
        >
          <label className="flex items-center text-lg font-medium text-gray-700 mb-3" htmlFor="productQuantity">
            <Hash className="mr-2" size={24} />
            Product Quantity
          </label>
          <input
            className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
            id="productQuantity"
            type="text"
            placeholder="Enter product quantity"
            value={productQuantity}
            onChange={(e) => setProductQuantity(e.target.value)}
          />
        </motion.div>
        <motion.div 
          whileHover={{ scale: 1.02 }}
        >
          <label className="flex items-center text-lg font-medium text-gray-700 mb-3" htmlFor="productDescription">
            <FileText className="mr-2" size={24} />
            Product Description
          </label>
          <textarea
            className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
            id="productDescription"
            rows="5"
            placeholder="Enter product description"
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
          />
        </motion.div>
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="relative"
        >
          <label className="flex items-center text-lg font-medium text-gray-700 mb-3" htmlFor="productImage">
            <Camera className="mr-2" size={24} />
            Upload Image
          </label>
          <input
            className="hidden"
            id="productImage"
            type="file"
            onChange={handleImage}
            accept="image/*"
          />
          <label 
            htmlFor="productImage" 
            className="cursor-pointer flex items-center justify-center w-full h-64 border-3 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 transition duration-150 ease-in-out overflow-hidden"
          >
            {imagePreview ? (
              <div className="relative w-full h-full">
                <img
                  src={imagePreview}
                  alt="Selected Product"
                  className="absolute inset-0 w-full h-full object-contain"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                  <p className="text-white text-lg font-semibold">Change Image</p>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <Camera className="mx-auto h-16 w-16 text-gray-400" />
                <p className="mt-2 text-lg text-gray-600">Click to upload image</p>
              </div>
            )}
          </label>
        </motion.div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full bg-blue-600 text-white text-xl font-semibold py-4 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out"
          type="submit"
        >
          Add Product
        </motion.button>
      </form>
    </motion.div>
  );
};

export default AddProduct;