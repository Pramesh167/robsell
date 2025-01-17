import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  getSingleProductApi,
  addToCartApi,
  addReviewApi,
  getReviewsApi,
  getReviewsByProductAndUserApi,
  getAverageRatingApi,
  updateReviewApi,
} from "../../apis/Api";
import toast from "react-hot-toast";
import Navbar from "../../components/navbar/Navbar";

import {
  Star,
  ShoppingCart,
  CreditCard,
  Edit,
  Plus,
  Minus,
} from "lucide-react";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");
  const [isOutStock, setIsOutStock] = useState(false);

  const [mainImage, setMainImage] = useState("");
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");
  const [reviews, setReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewChange, setReviewChange] = useState(false);
  const [ownReview, setOwnReview] = useState(null);
  const [productsRatings, setProductsRatings] = useState({});



  
  useEffect(() => {
    getSingleProductApi(id)
      .then((res) => {
        if (res.status === 200) {
          setProduct(res.data.product);
          setMainImage(res.data.product.productImage);
          updateStockStatus(res.data.product, quantity);
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("Failed to load product details");
      });
  }, [id]);

  useEffect(() => {
    getReviewsApi(id)
      .then((res) => {
        if (res.status === 200) {
          setReviews(res.data.reviews);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id, reviewChange]);

  useEffect(() => {
    getReviewsByProductAndUserApi(id)
      .then((res) => {
        if (res.status === 200) {
          setOwnReview(res.data.review);
          if (res.data.review) {
            setRating(res.data.review.rating);
            setReview(res.data.review.review);
          }
        } else {
          setOwnReview(null);
          setRating(5);
          setReview("");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id, reviewChange]);

  useEffect(() => {
    getAverageRatingApi(id)
      .then((res) => {
        if (res.status === 200) {
          const ratings = res.data.averageRating;
          const productId = res.data.productId;

          setProductsRatings((prev) => {
            return { ...prev, [productId]: ratings };
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id, reviewChange]);

  const updateStockStatus = (product, quantity) => {
    if (product.productQuantity < quantity) {
      setError("Out of Stock");
      setIsOutStock(true);
    } else {
      setError("");
      setIsOutStock(false);
    }
  };

  const handleQuantityChange = (newQuantity) => {
    newQuantity = parseInt(newQuantity, 10);
    if (newQuantity > quantity && isOutStock) {
      return;
    }
    setQuantity(newQuantity);
    if (product) {
      updateStockStatus(product, newQuantity);
    }
  };

  const addToCart = () => {
    if (!isOutStock && product && quantity > 0) {
      addToCartApi({ productId: product._id, quantity: quantity })
        .then((res) => {
          if (res.status === 201) {
            toast.success("Product added to cart");
          } else {
            toast.error(res.data.message);
          }
        })
        .catch((err) => {
          console.log(err);
          toast.error("Failed to add to cart");
        });
    }
  };

  const buyNow = () => {
    addToCart();
  };

  
  
  

  

  

  const handleReviewSubmit = async (event) => {
    event.preventDefault();

    if (!rating || !review) {
      toast.error("Please ensure all fields are filled correctly.");
      return;
    }

    addReviewApi({ productId: product._id, rating, review })
      .then((response) => {
        if (response.status === 201) {
          toast.success(response.data.message);
          setShowReviewForm(false);
          setReviewChange(!reviewChange);
        } else {
          return Promise.reject(
            response.data.message || "Unexpected error occurred"
          );
        }
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 400) {
            toast.error(error.response.data.message);
          } else {
            toast.error("Error Occurred");
          }
        }
      });
  };

  const handleReviewUpdate = async (event) => {
    event.preventDefault();

    if (!rating || !review) {
      toast.error("Please ensure all fields are filled correctly.");
      return;
    }

    updateReviewApi(product._id, { rating, review })
      .then((response) => {
        if (response.status === 200) {
          toast.success(response.data.message);
          setShowReviewForm(false);
          setReviewChange(!reviewChange);
        } else {
          return Promise.reject(
            response.data.message || "Unexpected error occurred"
          );
        }
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 400) {
            toast.error(error.response.data.message);
          } else {
            toast.error("Error Occurred");
          }
        }
      });
  };

  if (!product) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all hover:scale-[1.02] duration-300">
          <div className="md:flex">
            <div className="md:w-1/2 p-8">
              <div className="relative pb-[100%] mb-6 rounded-xl overflow-hidden shadow-lg">
                <img
                  src={`http://localhost:5500/products/${mainImage}`}
                  alt={product.productName}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
              </div>
              <div className="flex space-x-4 overflow-x-auto pb-4">
                <img
                  src={`http://localhost:5500/products/${product.productImage}`}
                  alt={product.productName}
                  className="w-24 h-24 object-cover rounded-lg cursor-pointer hover:opacity-75 transition duration-300 shadow-md"
                  onClick={() => setMainImage(product.productImage)}
                />
                {product.additionalImages &&
                  product.additionalImages.map((img, index) => (
                    <img
                      key={index}
                      src={`http://localhost:5500/products/${img}`}
                      alt={`Additional ${index}`}
                      className="w-24 h-24 object-cover rounded-lg cursor-pointer hover:opacity-75 transition duration-300 shadow-md"
                      onClick={() => setMainImage(img)}
                    />
                  ))}
              </div>
            </div>
            <div className="md:w-1/2 p-8 bg-gradient-to-br from-white to-gray-100">
              <h1 className="text-4xl font-bold mb-4 text-gray-800 tracking-tight">
                {product.productName}
              </h1>
              <div className="flex items-center mb-6">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      aria-label={`Rating ${star}`}
                      className={`w-6 h-6 ${
                        star <= productsRatings[product._id]
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-gray-600 font-semibold">
                  {productsRatings[product._id]?.toFixed(1) || "No ratings"}
                </span>
              </div>
              <div className="text-4xl font-bold text-indigo-600 mb-6">
                ${product.productPrice.toFixed(2)}
              </div>
              <p className="text-gray-600 mb-8 leading-relaxed">
                {product.productDescription}
              </p>
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                  Product Details
                </h2>
                <ul className="space-y-2">
                  <li className="flex items-center text-gray-700">
                    <div className="w-24 font-semibold">Color:</div>
                    <div className="flex-1">{product.color}</div>
                  </li>
                  <li className="flex items-center text-gray-700">
                    <div className="w-24 font-semibold">Available:</div>
                    <div className="flex-1">{product.productQuantity}</div>
                  </li>
                  <li className="flex items-center text-gray-700">
                    <div className="w-24 font-semibold">Category:</div>
                    <div className="flex-1">{product.productCategory}</div>
                  </li>
                </ul>
              </div>
              {isOutStock && (
                <div className="text-red-500 text-xl mb-6 font-semibold">
                  {error}
                </div>
              )}
              <div className="mb-8">
                <label
                  htmlFor="quantity"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Quantity
                </label>
                <div className="flex items-center">
                  <button
                    onClick={() =>
                      handleQuantityChange(Math.max(1, quantity - 1))
                    }
                    className="p-2 rounded-l-md bg-gray-200 text-gray-600 hover:bg-gray-300 transition duration-300"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    value={quantity}
                    onChange={(e) => handleQuantityChange(e.target.value)}
                    min="1"
                    className="w-16 px-3 py-2 text-center border-y border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    className="p-2 rounded-r-md bg-gray-200 text-gray-600 hover:bg-gray-300 transition duration-300"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 mb-8">
                <button
                  onClick={addToCart}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-md font-bold hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 flex items-center justify-center shadow-lg"
                  disabled={isOutStock}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </button>
                <button
                  onClick={buyNow}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-md font-bold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 flex items-center justify-center shadow-lg"
                  disabled={isOutStock}
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  Buy Now
                </button>
              </div>
            
              
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="mt-16 bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-3xl font-bold mb-8 text-gray-800">
            Customer Reviews
          </h2>
          {reviews && reviews.length > 0 ? (
            reviews.map((review, index) => (
              <div
                key={index}
                className="mb-8 pb-8 border-b border-gray-200 last:border-b-0"
              >
                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        aria-label={`Review Rating ${star}`}
                        className={`w-5 h-5 ${
                          star <= review.rating
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-4 text-sm text-gray-600">
                    {review.date}
                  </span>
                </div>
                <p className="text-gray-700 leading-relaxed">{review.review}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-600 italic">
              No reviews yet. Be the first to review this product!
            </p>
          )}
          <button
            onClick={() => {
              setShowReviewForm(true);
              if (ownReview) {
                setRating(ownReview.rating);
                setReview(ownReview.review);
              }
            }}
            className="mt-8 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-3 rounded-md font-bold hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 flex items-center justify-center shadow-lg"
          >
            <Edit className="w-5 h-5 mr-2" />
            {ownReview ? "Update Review" : "Write a Review"}
          </button>

          {showReviewForm && (
            <form
              onSubmit={ownReview ? handleReviewUpdate : handleReviewSubmit}
              className="mt-8 bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-xl shadow-inner"
            >
              <h3 className="text-2xl font-semibold mb-6">
                {ownReview ? "Update Your Review" : "Write Your Review"}
              </h3>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      aria-label={`Rating ${star}`}
                      className={`w-8 h-8 cursor-pointer transition-colors duration-200 ${
                        star <= rating
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300 hover:text-yellow-300"
                      }`}
                      onClick={() => setRating(star)}
                    />
                  ))}
                </div>
              </div>
              <div className="mb-6">
                <label
                  htmlFor="review"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Your Review
                </label>
                <textarea
                  id="review"
                  rows="4"
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  className="w-full px-4 py-3 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
                  placeholder="Share your thoughts about this product..."
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-md font-bold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg"
              >
                Submit Review
              </button>
            </form>
          )}
        </div>
      </div>


    </div>
  );
};

export default ProductDetails;
