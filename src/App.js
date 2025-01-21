import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Toaster } from "react-hot-toast";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import HomePage from "./pages/homepage/HomePage";
import Onboarding from "./pages/onboarding/Onboarding";
import AdminPage from "./pages/admin/AdminPage";
import AdminRoutes from "./protected_routes/AdminRoutes";
import UserRoutes from "./protected_routes/UserRoutes";
import Addtocart from "./pages/Cart/Cart";
import ProductDetails from "./pages/product_details/ProductDetails";
import PlaceOrder from "./pages/placeorder/PlaceOrder";
import ForgetPassword from "./pages/forget_password/ForgetPassword";
import MyOrders from "./pages/my_order/MyOrder";
import Favorites from "./pages/favourites/Favourites";
import EditProfile from "./pages/edit_profile/EditProfile";
import EditAdminProfile from "./pages/admin/EditProfile";
import StandardBot from "./pages/robots/StandardBot";
import WedgeBot from "./pages/robots/WedgeBot";
import UserLog from "./pages/admin/UserLog";

function App() {
  return (
    <Router>
      <Toaster />
      <Routes>
        <Route path="/" element={<Onboarding />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin Protected Routes */}
        <Route element={<AdminRoutes />}>
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/userlog" element={<UserLog />} />
          <Route path="/adminprofile" element={<EditAdminProfile />} />
          {/* <Route path='/add-product' element={<AddProduct />} /> */}
        </Route>

        {/* User Protected Routes */}
        <Route element={<UserRoutes />}>
          <Route path="/homepage" element={<HomePage />} />
          <Route path="/addtocart" element={<Addtocart />} />
          <Route path="/standard" element={<StandardBot />} />
          <Route path="/wedgebot" element={<WedgeBot />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/placeorder/:cart" element={<PlaceOrder />} />
          <Route path="/myorder" element={<MyOrders />} />
          <Route path="/favourites" element={<Favorites />} />
          <Route path="/profile" element={<EditProfile />} />
        </Route>
        <Route path="/forgetpassword" element={<ForgetPassword />} />
      </Routes>
    </Router>
  );
}
export default App;
