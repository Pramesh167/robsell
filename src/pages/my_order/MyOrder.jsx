import React, { useState, useEffect } from "react";
import { Package, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import { getOrdersByUserApi } from "../../apis/Api";
import { toast } from "react-hot-toast";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const res = await getOrdersByUserApi();
        if (res.data.success && res.data.orders) {
          setOrders(res.data.orders);
        } else {
          toast.error("Error Fetching Orders");
        }
      } catch (error) {
        console.error("Error Fetching Orders:", error);
        setError("Error fetching orders. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleTrackOrder = async (orderId) => {
    try {
      const response = await getOrdersByUserApi();
      if (response.data.success) {
        const updatedOrder = response.data.orders.find(
          (order) => order._id === orderId
        );
        if (updatedOrder) {
          setOrders(
            orders.map((order) =>
              order._id === orderId ? updatedOrder : order
            )
          );
          toast.success("Order status updated successfully!");
        }
      }
    } catch (error) {
      console.error("Error tracking order:", error);
      toast.error("Failed to track order. Please try again later.");
    }
  };

  const toggleOrderExpansion = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-purple-100">
        <motion.div
          className="text-2xl font-bold text-blue-600"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          Loading orders...
        </motion.div>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-purple-100">
        <div className="text-2xl font-bold text-red-500">Error: {error}</div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-purple-100">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-extrabold mb-12 text-blue-600 text-center"
        >
          My Delightful Orders
        </motion.h1>
        <div className="space-y-8">
          {orders.map((order) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden border border-blue-200"
            >
              <div
                className="p-6 cursor-pointer bg-blue-50 hover:bg-blue-100 transition-colors duration-300"
                onClick={() => toggleOrderExpansion(order._id)}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Package className="text-blue-500 mr-3" size={28} />
                    <span className="text-2xl font-semibold text-gray-800">
                      Order #{order._id.slice(-6)}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-lg font-medium text-blue-500 mr-4">
                      {order.status}
                    </span>
                    {expandedOrder === order._id ? (
                      <ChevronUp size={24} />
                    ) : (
                      <ChevronDown size={24} />
                    )}
                  </div>
                </div>
              </div>
              <AnimatePresence>
                {expandedOrder === order._id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-6 pb-6 bg-white"
                  >
                    <div className="mb-4">
                      {order.carts.map((product) => (
                        <div
                          key={product.productId._id}
                          className="flex items-center mb-4 p-3 bg-blue-50 rounded-lg"
                        >
                          <img
                            src={`https://localhost:5500/products/${product.productId.productImage}`}
                            alt={product.productId.productName || 'Product Image'}
                            className="w-20 h-20 object-cover rounded-md mr-4 border border-blue-200"
                          />
                          <div>
                            <div className="text-lg font-semibold text-gray-800">
                              {product.productId.productName}
                            </div>
                            <div className="text-md text-gray-600">
                              Quantity: {product.quantity}
                            </div>
                            <div className="text-md font-medium text-blue-600">
                              $
                              {(
                                product.productId.productPrice *
                                product.quantity
                              ).toFixed(2)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between items-center border-t border-blue-200 pt-4">
                      <span className="text-xl font-bold text-gray-800">
                        Total: $
                        {order.carts
                          .reduce(
                            (total, product) =>
                              total +
                              product.productId.productPrice *
                                product.quantity,
                            0
                          )
                          .toFixed(2)}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTrackOrder(order._id);
                        }}
                        className="bg-blue-500 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-blue-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                      >
                        Track Order
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MyOrders;
