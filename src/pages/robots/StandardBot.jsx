import React, { useEffect, useState } from 'react';
import { getAverageRatingApi, getProductsByCategoryApi } from '../../apis/Api';
import Products from '../Products/Products';
import toast from 'react-hot-toast';
import Navbar from '../../components/navbar/Navbar';
import { motion } from 'framer-motion';
import { Sun, Loader, ChevronLeft, ChevronRight,Star } from 'lucide-react';

const StandardBot = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [productsRatings, setProductsRatings] = useState({});
  const limit = 4; // Set to match the default limit in your API

  useEffect(() => {
    fetchProducts();
  }, [page]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await getProductsByCategoryApi('Standard Bot', page, limit);
      if (res.status === 201) {
        setProducts(res.data.products);
        setTotalPages(Math.ceil(res.data.totalCount / limit));
      }
    } catch (err) {
      console.log(err);
      if (err.response?.status === 400) {
        toast.error(err.response.data.message);
        setProducts([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    for (let i = 0; i < products.length; i++) {
      getAverageRatingApi(products[i]._id)
        .then((res) => {
          if (res.status === 200) {
            const ratings=res.data.averageRating
            const id=res.data.productId

            // cretae a map between product id and rating
            setProductsRatings((prev) => {
              return {...prev, [id]:ratings}

            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
      
  }, 
  [products]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Loader className="w-12 h-12 text-indigo-600 animate-spin" />
        <p className="mt-4 text-xl font-semibold text-gray-700">Loading amazing bots...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      <div className="container mx-auto px-4 py-12 pt-24">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Discover Your Drumbots or Standard
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Easy for flippin out your opponent.
          </p>
        </motion.div>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <Sun className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-700">No bots available on this page</h2>
            <p className="mt-2 text-gray-600">Try going back to the previous page or check again later!</p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
          >
            {products.map((singleProduct) => (
              <motion.div
                key={singleProduct._id}
                variants={itemVariants}
                className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl"
              >
                <Products productInformation={singleProduct} color={'indigo'} />
                <div className="p-4 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Average Rating:</span>
                    <div className="flex items-center">
                      <Star className="h-5 w-5 text-yellow-400 mr-1" fill="currentColor" />
                      <span className="text-sm font-semibold text-gray-800">
                        {productsRatings[singleProduct._id] ? productsRatings[singleProduct._id].toFixed(1) : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Pagination */}
        <div className="flex justify-center items-center space-x-2 mt-8">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="text-gray-700">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= totalPages}
            className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StandardBot;