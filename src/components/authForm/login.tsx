import { useState } from "react";
import CredentialsModal from "./CredentialsModal";
import { AuthForm } from "./auth-form";
import { FiKey } from "react-icons/fi";

export default function SignIn() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="min-h-screen flex relative">
      {showModal && <CredentialsModal onClose={() => setShowModal(false)} />}
      {/* Credentials Button in the top-right */}
      <div className="absolute top-4 right-4">
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 bg-red-600 text-white hover:bg-red-700 px-3 py-2 rounded animate-bounce"
        >
          <FiKey />
          <span>Credentials</span>
        </button>
      </div>
      {/* Left-side image visible on large screens */}
      <div className="hidden lg:block lg:w-1/2">
        <img
          src="https://res.cloudinary.com/dvwmhlyd6/image/upload/f_auto,q_auto/v1740628950/adef3d98-6e24-4353-bc0d-dbb3cfeb9aff_njffuh.png"
          alt="Sign In Background"
          className="object-cover w-full h-full"
        />
      </div>
      {/* Right-side form */}
      <div className="flex items-center justify-center w-full lg:w-1/2 p-4">
        <div className="z-20">
          <AuthForm type="sign-in" />
        </div>
      </div>
    </div>
  );
}
