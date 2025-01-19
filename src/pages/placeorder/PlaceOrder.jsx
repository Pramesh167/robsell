import React, { useEffect, useState } from "react";
import {
  placeOrderApi,
  initializeKhaltiPaymentApi,
  updateStatusApi,
} from "../../apis/Api"; // Assuming you have these APIs
import { toast } from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";

const PlaceOrder = () => {
  const [cart, setCart] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const params = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    phone: "",
    deliveryFee: 40.0,
  });

  useEffect(() => {
    const carts = JSON.parse(params.cart);
    if (params.cart) {
      setCart(JSON.parse(params.cart));
      setSubtotal(
        carts.reduce(
          (sum, item) => sum + item.productId.productPrice * item.quantity,
          0
        )
      );
    }
  }, [params]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateOrderData = () => {
    const {
      firstName,
      lastName,
      email,
      street,
      city,
      state,
      zipCode,
      country,
      phone,
    } = formData;
    if (
      !firstName ||
      !lastName ||
      !email ||
      !street ||
      !city ||
      !state ||
      !zipCode ||
      !country ||
      !phone
    ) {
      toast.error("Please fill all the fields.");
      return false;
    }
    if (
      !cart.length ||
      cart.some(
        (product) =>
          !product.productId || !product.productId._id || product.quantity <= 0
      )
    ) {
      toast.error("No products added to the order or invalid product data.");
      return false;
    }
    return true;
  };

  const handlePayment = async (orderId, totalPrice) => {
    try {
      const paymentResponse = await initializeKhaltiPaymentApi({
        orderId,
        totalPrice,
        website_url: window.location.origin,
      });
      if (paymentResponse.data.success) {
        const paymentUrl = paymentResponse.data.payment.payment_url;
        window.location.href = paymentUrl;
      } else {
        toast.error("Failed to initialize payment. Please try again.");
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      toast.error(
        "Error processing payment: " +
          (error.response?.data?.message || error.message || "Unknown error")
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateOrderData()) return;

    const total = subtotal + formData.deliveryFee;
    const orderData = {
      carts: cart,
      totalPrice: total,
      name: formData.firstName + " " + formData.lastName,
      email: formData.email,
      street: formData.street,
      city: formData.city,
      state: formData.state,
      zipCode: formData.zipCode,
      country: formData.country,
      phone: formData.phone,
      payment: false,
    };

    try {
      const response = await placeOrderApi(orderData);
      if (response.data.success) {
        toast.success(response.data.message);

        // Handle payment
        const orderId = response.data.order_id;
        if (orderId) {
          // Handle payment
          await handlePayment(orderId, total);

          // Update order status after payment initiation
          await updateStatusApi();
        } else {
          toast.error("Order ID not found in response.");
        }
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error(
        "Error placing order: " +
          (error.response?.data?.message || error.message || "Unknown error")
      );
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-100 to-indigo-100 min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto p-4 md:p-8 lg:p-12">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2 p-6 md:p-8 lg:p-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Delivery Information
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                {Object.entries(formData).map(
                  ([key, value]) =>
                    key !== "deliveryFee" && (
                      <div key={key}>
                        <label
                          htmlFor={key}
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          {key.charAt(0).toUpperCase() +
                            key.slice(1).replace(/[A-Z]/g, " $&")}
                        </label>
                        <input
                          id={key}
                          type={key === "email" ? "email" : "text"}
                          name={key}
                          value={value}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    )
                )}
                <button
                  type="submit"
                  className="w-full mt-8 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Place Order and Pay
                </button>
              </form>
            </div>
            <div className="md:w-1/2 bg-indigo-100 p-6 md:p-8 lg:p-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Order Summary
              </h2>
              <div className="space-y-4">
                {cart.map((product, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg shadow-md p-4 flex items-center"
                  >
                    <img
                      src={`https://localhost:5500/products/${product.productId.productImage}`}
                      alt={product.productId.productName}
                      className="w-16 h-16 object-cover rounded-md mr-4"
                    />
                    <div className="flex-grow flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">
                          {product.productId.productName}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Qty: {product.quantity}
                        </p>
                      </div>
                      <span className="font-semibold">
                        $
                        {(
                          product.productId.productPrice * product.quantity
                        ).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className="font-semibold">
                      ${formData.deliveryFee.toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-xl font-bold">
                    <span>Total</span>
                    <span>${(subtotal + formData.deliveryFee).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
