import React from "react";
import { Link } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";

const PaymentSuccess = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 text-center p-4">
      <FaCheckCircle className="text-green-600 text-6xl mb-4" />
      <h1 className="text-4xl font-bold text-green-700">Payment Successful!</h1>
      <p className="mt-2 text-lg text-gray-700">Thank you for your purchase.</p>
      <Link
        to="/"
        className="mt-6 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
      >
        Continue Shopping
      </Link>
    </div>
  );
};

export default PaymentSuccess;
