import React from "react";
import { Link } from "react-router-dom";
import { MdErrorOutline } from "react-icons/md";

const PaymentFailed = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 text-center p-4">
      <MdErrorOutline className="text-red-600 text-6xl mb-4" />
      <h1 className="text-4xl font-bold text-red-700">Payment Failed</h1>
      <p className="mt-2 text-lg text-gray-700">
        Something went wrong. Please try again.
      </p>
      <Link
        to="/cart"
        className="mt-6 px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
      >
        Retry Payment
      </Link>
    </div>
  );
};

export default PaymentFailed;
