import React from 'react'
import { useSelector } from 'react-redux'
import { Outlet, Navigate } from 'react-router-dom'

export default function PrivateRoute() {
    const { crtUser } = useSelector((state) => state.user);
    return crtUser ? <Outlet /> : <Navigate to='/sign-in' />;
}
