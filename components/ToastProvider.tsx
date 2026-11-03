"use client";
import { Toaster } from "react-hot-toast";
const ToastProvider = () => {
  return <Toaster position="top-center" toastOptions={{ duration: 3200, style: { borderRadius: "14px", background: "#173d29", color: "#fff" } }} />;
}
export default ToastProvider;
