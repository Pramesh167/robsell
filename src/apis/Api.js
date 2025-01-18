import axios from "axios";

// Creating backend Config!
const Api = axios.create({
    baseURL: "http://localhost:5500",
    withCredentials: true,
    headers: {
        'Content-Type': 'multipart/form-data'
    }
})


const config2 = {
    headers: {
        
        'authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
    }
}


const config = {
    headers: {
        'authorization': `Bearer ${localStorage.getItem('token')}`
    }
}
// Test API 
export const testApi = () => Api.get('/test')


//=========================== Auth Apis ===========================

// Register Api
export const registerUserApi = (data) => Api.post('/api/user/create', data)

// Login Api
export const loginUserApi = (data) => Api.post('/api/user/login', data)

// get current user api
export const getCurrentUserApi = () => Api.get('/api/user/current',config)

// edit user profile api
export const editUserProfileApi = (data) => Api.put('/api/user/update',data,config)

//Upload Profile Picture Api
export const uploadProfilePictureApi = (data) => Api.post('/api/user/profile_picture',data)

//forgot password
export const forgotPasswordApi = (data) => Api.post('/api/user/forgot_password', data);
  
// verify otp
export const verifyOtpApi = (data) => Api.post('/api/user/verify_otp', data);

// google login
export const googleLoginApi = (data) => Api.post("/api/user/google", data);

// get by email
export const getUserByGoogleEmail = (data) =>
	Api.post(`/api/user/getGoogleUser`, data);


//=========================== Product Apis ===========================

// Create Product Api
export const createProductApi = (data) => Api.post('/api/product/create', data)

// Get All Products Api
export const getAllProductsApi = () => Api.get('/api/product/get_all_products',config)

// Update Product Api
export const updateProduct = (id,data) => Api.put(`/api/product/update_product/${id}`,data,config)

//delete product api
export const deleteProduct = (id) => Api.delete(`/api/product/delete_product/${id}`, config)

// Get Single Product Api
export const getSingleProductApi = (id) => Api.get(`/api/product/get_single_product/${id}`,config)

// Get Products By Category including pagination
export const getProductsByCategoryApi = (category, page, limit=2 ) =>  Api.get(`/api/product/get_products_by_category?category=${category}&page=${page}&limit=${limit}`, config)
  
  
//=========================== Cart Apis ===========================

// Add to Cart Api
export const addToCartApi = (data) => Api.post('/api/cart/add_to_cart', data,config)

// Get Cart Api
export const getCartApi = () => Api.get('/api/cart/get_cart',config)

// delete cart item api
export const deleteCartItemApi = (id) => Api.delete(`/api/cart/remove_cart_item/${id}`,config)

// update cart status api
export const updateStatusApi = () => Api.put(`/api/cart/update_status`,'',config)

// update cart item
export const updateCartItemApi=(data)=> Api.put(`/api/cart/update_cart`,data,config)


//=========================== Order Apis ===========================
//place order api
export const placeOrderApi = (data) => Api.post('/api/order/place_order',data,config2)

// get single order api
export const getSingleOrderApi = (id) => Api.get(`/api/order/get_single_order/${id}`,config)

// get all orders api
export const getAllOrdersApi = () => Api.get('/api/order/get_all_orders',config)

// order status update api
export const updateOrderStatusApi = (id,data) => Api.post(`/api/order/update_order_status/${id}`,data,config2)

// get orders by user api
export const getOrdersByUserApi = () => Api.get('/api/order/get_orders_by_user',config)


//=========================== Review Apis ===========================

// add review api
export const addReviewApi = (data) => Api.post('/api/review/post_reviews', data,config)

// get reviews api
export const getReviewsApi = (ProductId) => Api.get(`/api/review/get_reviews/${ProductId}`,config)

// get reviews by product and user api
export const getReviewsByProductAndUserApi = (ProductId) => Api.get(`/api/review/get_reviews_by_user_and_product/${ProductId}`,config) 

// get average rating api
export const getAverageRatingApi = (ProductId) => Api.get(`/api/review/get_average_rating/${ProductId}`,config)

//update review api
export const updateReviewApi = (productId,data) => Api.put(`/api/review/update_reviews/${productId}`,data,config)


//=========================== Favourites Apis ===========================

// add to favourites api
export const addFavouriteApi = (data) => Api.post('/api/favourite/add_favourite', data,config)

// get favourites api
export const getFavouritesApi = () => Api.get('/api/favourite/get_favourite',config)

// delete favourite api
export const deleteFavouriteApi = (id) => Api.delete(`/api/favourite/remove_favourite/${id}`,config)


// Payment api
export const createPaymentApi = (data) =>
	Api.post(`/api/payment/add`, data, config2);

const KhaltiApi = axios.create({
	baseURL: "https://test-pay.khalti.com/",
	headers: {
		"Content-Type": "application/json",
		authorization: `key test_public_key_38acaf5cadbe41e781e13d35f19509f4`,
	},
});

export const initiateKhaltiPayment = (data) =>
	KhaltiApi.post("api/v2/epayment/initiate/", data);

// Function to initialize Khalti payment
export const initializeKhaltiPaymentApi = (data) =>
    Api.post("api/khalti/initialize-khalti", data);

// Function to verify Khalti payment
export const verifyKhaltiPaymentApi = (params) =>
    Api.get("/api/khalti/complete-khalti-payment", { params });


