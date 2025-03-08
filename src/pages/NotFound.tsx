import React from "react";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-white p-4">
      <div className="relative flex flex-col items-center text-center">
        {/* Decorative Gradient Circle */}
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#cf1263] rounded-full opacity-20 blur-3xl animate-tilt"></div>

        {/* Animated Professional Icon */}
        <Icon
          icon="mdi:alert-circle-outline"
          width={100}
          className="relative mx-auto mb-4 animate-bounce"
          style={{ color: "#cf1263" }}
        />
        <h1 className="text-6xl font-extrabold text-[#cf1263] mb-4 drop-shadow-lg">
          404
        </h1>
        <p className="text-xl text-gray-700 mb-8 max-w-md">
          Oops! We couldn’t find the page you’re looking for. It might have been
          moved or deleted.
        </p>
        <Link to="/home">
          <button className="px-8 py-3 bg-[#cf1263] text-white rounded-full shadow-lg transform transition duration-300 hover:scale-105 hover:bg-[#b10f57] focus:outline-none">
            Go Home
          </button>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
