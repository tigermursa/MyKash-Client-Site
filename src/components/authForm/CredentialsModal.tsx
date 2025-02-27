import React, { useState } from "react";
import { FaCopy } from "react-icons/fa";

interface CredentialsModalProps {
  onClose: () => void;
}

const credentialsData = [
  {
    title: "Admin Credentials",
    mobile: "0145698653",
    pin: "12345",
  },
  {
    title: "Agent Credentials",
    mobile: "0145698612",
    pin: "12345",
  },
  {
    title: "User One Credentials",
    mobile: "0145698699",
    pin: "12345",
  },
  {
    title: "User Two Credentials",
    mobile: "0145698659",
    pin: "12345",
  },
];

const CredentialsModal: React.FC<CredentialsModalProps> = ({ onClose }) => {
  const [copied, setCopied] = useState<{ [key: string]: boolean }>({});

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied((prev) => ({ ...prev, [key]: true }));
      // Reset the copied status after 2 seconds.
      setTimeout(() => {
        setCopied((prev) => ({ ...prev, [key]: false }));
      }, 2000);
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Credentials</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            X
          </button>
        </div>
        <div className="space-y-4">
          {credentialsData.map((cred, index) => (
            <div key={index} className="border p-4 rounded">
              <h3 className="font-semibold">{cred.title}</h3>
              <div className="mt-2 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Mobile:</span>
                  <div className="flex items-center">
                    <span className="mr-2">{cred.mobile}</span>
                    <button
                      onClick={() => handleCopy(cred.mobile, `mobile-${index}`)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <FaCopy />
                    </button>
                    {copied[`mobile-${index}`] && (
                      <span className="ml-2 text-green-500 text-sm">
                        Copied!
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">PIN:</span>
                  <div className="flex items-center">
                    <span className="mr-2">{cred.pin}</span>
                    <button
                      onClick={() => handleCopy(cred.pin, `pin-${index}`)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <FaCopy />
                    </button>
                    {copied[`pin-${index}`] && (
                      <span className="ml-2 text-green-500 text-sm">
                        Copied!
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CredentialsModal;
