import React, { useEffect, useState } from "react";
import { getAverageRatingApi, getProductsByCategoryApi } from "../../apis/Api";
import Products from "../Products/Products";
import toast from "react-hot-toast";
import Navbar from "../../components/navbar/Navbar";
import { motion } from "framer-motion";
import { Loader, ChevronRight, ChevronLeft, Star } from "lucide-react";
import { Bot } from "lucide-react"; // Added Bot icon for robot logo

const WedgeBot = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const limit = 4;
  const [productsRatings, setProductsRatings] = useState({});

  useEffect(() => {
    fetchProducts();
  }, [currentPage]);

  const fetchProducts = () => {
    setLoading(true);
    getProductsByCategoryApi("Wedge Bot", currentPage, limit)
      .then((res) => {
        if (res.status === 201) {
          setProducts(res.data.products);
          setTotalPages(Math.ceil(res.data.totalCount / limit));
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        if (err.response?.status === 400) {
          toast.error(err.response.data.message);
          setProducts([]);
        }
      });
  };

  useEffect(() => {
    for (let i = 0; i < products.length; i++) {
      getAverageRatingApi(products[i]._id)
        .then((res) => {
          if (res.status === 200) {
            const ratings = res.data.averageRating;
            const id = res.data.productId;
            setProductsRatings((prev) => ({
              ...prev,
              [id]: ratings,
            }));
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [products]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-purple-100">
        <Loader className="w-16 h-16 text-purple-600 animate-spin" />
        <p className="mt-6 text-2xl font-semibold text-gray-700">
          Focusing on your perfect vision...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100">
      <Navbar />
      {/* Added pt-16 to prevent overlap with navbar */}
      <div className="container mx-auto px-4 py-12 pt-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-6">
            Enhance Your Vision with Style
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
            Discover our collection of premium power glasses that combine
            clarity with fashion.
          </p>
        </motion.div>

        {products.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-16 bg-white rounded-xl shadow-lg max-w-2xl mx-auto"
          >
            <div className="relative w-24 h-24 mx-auto mb-6">
              <Bot className="w-24 h-24 text-purple-400 absolute" />
              {/* Overlay the glasses icon on top of the robot */}
              <div className="absolute inset-0 flex items-center justify-center">
                <svg
                  viewBox="0 0 24 24"
                  width="60"
                  height="60"
                  className="text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M6 4h12M6 4v8m12-8v8M6 12h12M9 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM15 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                </svg>
              </div>
            </div>
            <h2 className="text-3xl font-semibold text-gray-700 mb-4">
              No robots abailave  at the moment
            </h2>
            <p className="text-xl text-gray-600">
              Our new collection is coming soon. Stay tuned!
            </p>
          </motion.div>
        ) : (
          <>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            >
              {products.map((singleProduct) => (
                <motion.div
                  key={singleProduct._id}
                  variants={itemVariants}
                  className="bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl"
                >
                  <Products productInformation={singleProduct} color="purple" />
                  <div className="p-4 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        Average Rating:
                      </span>
                      <div className="flex items-center">
                        <Star
                          className="h-5 w-5 text-yellow-400 mr-1"
                          fill="currentColor"
                        />
                        <span className="text-sm font-semibold text-gray-800">
                          {productsRatings[singleProduct._id]
                            ? productsRatings[singleProduct._id].toFixed(1)
                            : "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
            <div className="flex justify-center items-center space-x-2 mt-8">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <span className="text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WedgeBot;