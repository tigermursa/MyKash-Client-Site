import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUserCircle,
  FaWallet,
  FaHome,
  FaTachometerAlt,
} from "react-icons/fa"; // Changed Dashboard icon
import { FiMenu, FiLogOut, FiUser } from "react-icons/fi";
import useAuth from "../../hooks/useAuth";
import { useLogoutAccount } from "../../api/authAPI";

const Navbar = () => {
  const { user, refetch } = useAuth();
  const navigate = useNavigate();
  const { mutate: logoutUser, isPending: isLoggingOut } = useLogoutAccount();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [showBalance, setShowBalance] = useState(false);

  const handleLogout = () => {
    logoutUser(undefined, {
      onSuccess: () => navigate("/login"),
      onError: (error: Error) => console.error(error.message),
    });
  };

  const handleShowBalance = () => {
    refetch();
    setShowBalance(true);
    setTimeout(() => {
      setShowBalance(false);
    }, 4000);
  };

  return (
    <nav className="bg-[#cf1263] px-4 py-2 flex justify-between items-center relative">
      <div className="flex items-center space-x-2">
        {user ? (
          <>
            <FaUserCircle className="text-3xl text-gray-100" />
            <span className="hidden md:inline text-gray-100 font-medium">
              {user.username}
            </span>
          </>
        ) : null}
      </div>

      <div className="flex-1 flex justify-center">
        <div
          onClick={handleShowBalance}
          className="relative cursor-pointer bg-white text-black px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-500 ease-in-out max-w-xs w-full"
        >
          <span
            className={`transition-opacity duration-500 flex items-center justify-center ${
              showBalance ? "opacity-0" : "opacity-100"
            }`}
          >
            Tap here to see balance
          </span>
          <span
            className={`transition-opacity duration-500 absolute inset-0 flex items-center justify-center ${
              showBalance ? "opacity-100" : "opacity-0"
            }`}
          >
            {user && (
              <>
                <FaWallet className="mr-1" />
                {`${Number(user.balance).toFixed(2)} taka`}
              </>
            )}
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Home Button (Desktop) */}
        <button
          onClick={() => navigate("/home")}
          className="hidden md:flex items-center bg-white text-[#cf1263] hover:bg-gray-200 hover:cursor-pointer px-4 py-2 rounded-md space-x-2"
        >
          <FaHome className="text-xl" />
          <span>Home</span>
        </button>

        {/* Dashboard Button (Only for Admins, Desktop) */}
        {user?.role === "admin" && (
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="hidden md:flex items-center bg-white text-[#cf1263] hover:bg-gray-200 hover:cursor-pointer px-4 py-2 rounded-md space-x-2"
          >
            <FaTachometerAlt className="text-xl" /> {/* Updated Icon */}
            <span>Dashboard</span>
          </button>
        )}

        {/* Logout Button (Desktop) */}
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="hidden md:flex items-center bg-white text-red-600 hover:bg-gray-200 hover:cursor-pointer px-4 py-2 rounded-md space-x-2"
        >
          <FiLogOut />
          <span>Logout</span>
        </button>

        {/* Mobile Dropdown Menu */}
        <div className="md:hidden relative">
          <button
            onClick={() => setDropdownOpen(!isDropdownOpen)}
            className="p-2"
          >
            <FiMenu className="text-2xl text-gray-100" />
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-10">
              {/* Home Button (Mobile) */}
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  navigate("/home");
                }}
                className="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                <FaHome className="mr-2" />
                Home
              </button>

              {/* Dashboard Button (Only for Admins, Mobile) */}
              {user?.role === "admin" && (
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate("/admin/dashboard");
                  }}
                  className="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  <FaTachometerAlt className="mr-2" /> {/* Updated Icon */}
                  Dashboard
                </button>
              )}

              {/* Profile Button (Mobile) */}
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  navigate("/profile");
                }}
                className="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                <FiUser className="mr-2" />
                Profile
              </button>

              {/* Logout Button (Mobile) */}
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                <FiLogOut className="mr-2" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
