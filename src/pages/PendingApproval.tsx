import { Link } from "react-router-dom";

const PendingApproval = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#cf1263] to-[#a50e4f] p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center transform transition-all hover:scale-105">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-[#cf1263]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Thank You for Your Request!
        </h1>

        {/* Description */}
        <p className="text-gray-600 mb-6">
          We have received your Agent account application. Our team is currently
          reviewing your request. You will be notified via email once your
          account is approved. Thank you for your patience!
        </p>

        {/* Contact Info */}
        <p className="text-gray-500 text-sm">
          Need help? Contact us at{" "}
          <a
            href="mailto:support@example.com"
            className="text-[#cf1263] hover:underline"
          >
            support@example.com
          </a>
          .
        </p>
        <Link to={"/login"}>
          {" "}
          <button className="mt-5 border p-2 rounded-md text-[#cf1263]">
            Back
          </button>
        </Link>
      </div>
    </div>
  );
};

export default PendingApproval;
