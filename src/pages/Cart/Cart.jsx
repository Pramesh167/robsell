
import React, { useState, useEffect } from 'react';
import { getCartApi, deleteCartItemApi, updateCartItemApi } from '../../apis/Api';
import Navbar from '../../components/navbar/Navbar';
import toast from 'react-hot-toast';
import { json, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Minus, Plus, ArrowRight, Trash2 } from 'lucide-react';

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const[quantityChanged,setQuantityChanged]=useState(false);

  useEffect(() => {
    fetchCart();
  }, [quantityChanged]);

  const fetchCart = async () => {
    try {
      const res = await getCartApi();
      if (res.status === 200 && res.data && res.data.products) {
        const cartItems = res.data.products.map(item => ({
          ...item,
          quantity: item.quantity
        }));
        setCart(cartItems);
        calculateSubtotal(cartItems);
      } else {
        setCart([]);
      }
    } catch (err) {
      console.error("Error fetching cart:", err);
      setCart([]);
    }
  };

  const handleQuantityChange = (index, change) => {
    const newQuantity = cart[index].quantity + change;
    if (newQuantity < 1) {
      toast.error("Quantity cannot be less than 1");
      return;
    }
    if (newQuantity > cart[index].productId.productQuantity) {
      toast.error("Out of Stock");
      return;
    }

    const newCart = [...cart];
    newCart[index].quantity = newQuantity;
    const data={
      productId:cart[index].productId._id,
      quantity:newQuantity
    }
    updateCartItemApi(data).then((res)=>{
      console.log(res.data);
      setQuantityChanged(!quantityChanged);
    }).catch((err)=>{
      console.log(err);
    })
   
  };

  const calculateSubtotal = (items) => {
    const total = items.reduce((acc, item) => acc + (item.productId.productPrice * item.quantity), 0);
    setSubtotal(total);
  };

  const handleDeleteItem = async (id) => {
    try {
      const res = await deleteCartItemApi(id);
      if (res.status === 200) {
        toast.success(res.data.message);
        setQuantityChanged(!quantityChanged);
        // window.location.reload();
      }
    } catch (err) {
      console.error("Error deleting item from cart:", err);
      toast.error("Failed to remove item from cart");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      <Navbar />
      <div className="container mx-auto p-5 pt-24">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-center text-gray-800 mb-8"
        >
          Your Shopping Cart
        </motion.h1>
        {cart.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center text-gray-600 text-xl"
          >
            Your cart is empty. <Link to="/" className="text-orange-500 hover:underline">Start shopping</Link>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white shadow-2xl rounded-lg p-6"
          >
            {cart.map((item, index) => (
              <motion.div 
                key={item._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex flex-col md:flex-row justify-between items-center py-4 border-b last:border-b-0"
              >
                <div className="flex flex-col md:flex-row items-center md:space-x-4 mb-4 md:mb-0">
                  <img
                    src={`https://localhost:5500/products/${item.productId.productImage}`}
                    alt={item.productId.productName}
                    className="w-32 h-32 object-cover rounded-lg shadow-md transition-transform duration-300 hover:scale-105"
                  />
                  <div className="mt-4 md:mt-0 text-center md:text-left">
                    <h5 className="text-xl font-bold text-gray-800">{item.productId.productName}</h5>
                    <p className="text-gray-600 mt-2">Price: Rs. {item.productId.productPrice.toFixed(2)}</p>
                    <p className="text-gray-500 mt-1 text-sm">{item.productId.productDescription}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={() => handleQuantityChange(index, -1)}
                    className="p-1 rounded-full bg-orange-100 text-orange-500 hover:bg-orange-200 transition-colors duration-300"
                  >
                    <Minus size={20} />
                  </button>
                  <span className="text-lg font-semibold w-8 text-center">{item.quantity}</span>
                  <button 
                    onClick={() => handleQuantityChange(index, 1)}
                    className="p-1 rounded-full bg-orange-100 text-orange-500 hover:bg-orange-200 transition-colors duration-300"
                  >
                    <Plus size={20} />
                  </button>
                  <span className="text-lg font-bold text-gray-800 ml-4">
                    Rs. {(item.productId.productPrice * item.quantity).toFixed(2)}
                  </span>
                  <button 
                    onClick={() => handleDeleteItem(item._id)}
                    className="p-2 rounded-full bg-red-100 text-red-500 hover:bg-red-200 transition-colors duration-300"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </motion.div>
            ))}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-8"
            >
              <div className="flex justify-between text-xl font-bold text-gray-800 mb-4">
                <span>Subtotal:</span>
                <span>Rs. {subtotal.toFixed(2)}</span>
              </div>
              <Link to={`/placeorder/${JSON.stringify(cart)}`}>
                <button className="w-full py-3 bg-gradient-to-r from-orange-400 to-orange-500 text-white text-lg font-semibold rounded-lg shadow-md hover:from-orange-500 hover:to-orange-600 transition-all duration-300 flex items-center justify-center space-x-2">
                  <span>Proceed to Checkout</span>
                  <ArrowRight size={20} />
                </button>
              </Link>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Cart;