import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ArrowRight, Heart, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '../../components/navbar/Navbar';
import Footer from '../../components/footer/Footer';
import { deleteFavouriteApi, getFavouritesApi, getAverageRatingApi } from '../../apis/Api';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productsRatings, setProductsRatings] = useState({});

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const res = await getFavouritesApi();
      if (res.status === 200) {
        setFavorites(res.data.favorites);
        fetchRatings(res.data.favorites);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch favorites');
    } finally {
      setLoading(false);
    }
  };

  const fetchRatings = async (favorites) => {
    try {
      const ratingsPromises = favorites.map(fav => getAverageRatingApi(fav.product._id));
      const ratings = await Promise.all(ratingsPromises);
      const ratingsMap = {};
      ratings.forEach((res, index) => {
        if (res.status === 200) {
          ratingsMap[favorites[index].product._id] = res.data.averageRating;
        }
      });
      setProductsRatings(ratingsMap);
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch ratings');
    }
  };

  const removeFromFavorites = async (id, productId) => {
    try {
      const res = await deleteFavouriteApi(id);
      if (res.status === 200) {
        setFavorites((prevFavorites) => prevFavorites.filter(item => item._id !== id));
        localStorage.setItem(`favorite_${productId}`, JSON.stringify(false));
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to remove from favorites');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-r from-purple-50 to-pink-50">
        <Loader className="w-12 h-12 text-purple-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-50 to-pink-50">
      <Navbar />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Your Favorite Sunglasses
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Here's a collection of your most loved eyewear picks.
          </p>
        </motion.div>

        {favorites.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-12 bg-white rounded-lg shadow-lg"
          >
            <Heart className="w-16 h-16 text-pink-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-700">Your favorites list is empty</h2>
            <p className="mt-2 text-gray-600">Start adding some amazing sunglasses to your favorites!</p>
            <Link to="/homepage" className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
              Explore Products
              <ArrowRight className="ml-2 -mr-1 h-5 w-5" aria-hidden="true" />
            </Link>
          </motion.div>
        ) : (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {favorites.map((favorite) => (
                <motion.div 
                  key={favorite._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 ease-in-out transform hover:-translate-y-1"
                >
                  <div className="relative">
                    <img
                      src={`https://localhost:5500/products/${favorite.product.productImage}`}
                      className="w-full h-64 object-cover transition-transform duration-300 hover:scale-105"
                      alt={favorite.product.productName}
                    />
                    <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-start">
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-purple-600 text-white">
                        {favorite.product.productCategory}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h5 className="text-xl font-bold mb-2 text-gray-900">{favorite.product.productName}</h5>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm text-gray-600">{favorite.product.productCategory}</span>
                      <span className="text-lg font-bold text-purple-600">${favorite.product.productPrice.toFixed(2)}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-6 line-clamp-2">{favorite.product.productDescription}</p>
                    <div className="flex items-center mb-4">
                      <Star className="h-5 w-5 text-yellow-400 mr-1" fill="currentColor" />
                      <span className="text-sm font-semibold text-gray-800">
                        {productsRatings[favorite.product._id] ? productsRatings[favorite.product._id].toFixed(1) : 'N/A'}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Link to={`/product/${favorite.product._id}`} className="w-full">
                        <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold text-sm uppercase tracking-wider hover:bg-purple-700 transition-colors duration-200">
                          View More
                        </button>
                      </Link>
                      <button
                        onClick={() => removeFromFavorites(favorite._id, favorite.product._id)}
                        className="w-full px-4 py-2 border border-red-600 text-red-600 rounded-lg font-semibold text-sm uppercase tracking-wider hover:bg-red-600 hover:text-white transition-colors duration-200"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.3 }}
        >
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default Favorites;

