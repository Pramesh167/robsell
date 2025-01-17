import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'

const AdminRoutes = () => {
    // 1. Get user data from local storage
    const user = JSON.parse(localStorage.getItem('user'))

    // check user
    // Check isAdmin= true
    // if true : Access all the routes of Admin (Outlet)
    // if false : Navigate to login page

    return user != null && user.isAdmin ? <Outlet />
        : <Navigate to={'/login'} />




}

export default AdminRoutes
