import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import storageKeys from "../constants/storage-keys";
import { logout } from "../slices/authReducer";
import { useDispatch } from "react-redux";

export default function PrivateRoutes() {
  const dispatch = useDispatch();
  let isLogin = checkSession();
  if (!isLogin) {
    dispatch(logout());
  }

  return <>{isLogin ? <Outlet /> : <Navigate to="/login" />}</>;
}

export function checkSession() {
  let isLogin = false;
  let credentials = localStorage.getItem(storageKeys.credentials);
  if (credentials != null) {
    credentials = JSON.parse(credentials);
    isLogin = true;

    const expires_time = credentials.expires_time;
    const now = new Date();

    if (Math.floor(now.getTime() / 1000) > expires_time) {
      isLogin = false;
    }
  }

  return isLogin;
}
