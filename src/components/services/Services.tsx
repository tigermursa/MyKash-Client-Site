import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { PiNavigationArrow } from "react-icons/pi";
import { SiAidungeon, SiAmeba } from "react-icons/si";
import { toast } from "react-toastify";
import useAuth from "../../hooks/useAuth";
import { useSendMoney, useCashOut, useCashIn } from "../../api/transactionAPI";
import { useGetAllUsers } from "../../api/adminAPI";

// A simple Modal component – you can replace this with your own modal implementation or a UI library component.
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded p-4 w-11/12 max-w-md">
        <button className="text-red-500 float-right" onClick={onClose}>
          Close
        </button>
        <div className="clear-both">{children}</div>
      </div>
    </div>
  );
};

type ServiceType = "sendMoney" | "cashOut" | "cashIn";

const Services: React.FC = () => {
  const { user } = useAuth();
  const [activeService, setActiveService] = useState<ServiceType | null>(null);
  const [selectedTarget, setSelectedTarget] = useState<any>(null);
  const [amount, setAmount] = useState<number>(0);
  const [pin, setPin] = useState<string>("");

  // Get all users data
  const { data: usersData, isLoading } = useGetAllUsers();

  // Mutations for each transaction type
  const sendMoneyMutation = useSendMoney();
  const cashOutMutation = useCashOut();
  const cashInMutation = useCashIn();

  // Determine which list to show based on active service
  let listToShow: any[] = [];
  if (activeService && usersData) {
    if (activeService === "sendMoney") {
      // Only show users with role "user" and exclude the logged in user
      listToShow = usersData.data.users.filter(
        (u: any) => u.role === "user" && u._id !== user._id
      );
    } else if (activeService === "cashOut") {
      // For cash out, list all agents
      listToShow = usersData.data.users.filter((u: any) => u.role === "agent");
    } else if (activeService === "cashIn") {
      // For cash in, list all users (since agent sends cash in for a user)
      listToShow = usersData.data.users.filter((u: any) => u.role === "user");
    }
  }

  // Called when a service card is clicked.
  const handleServiceClick = (service: ServiceType) => {
    // Reset any previous selections and inputs.
    setSelectedTarget(null);
    setAmount(0);
    setPin("");
    setActiveService(service);
  };

  // Called when a user/agent is selected from the list.
  const handleTargetSelect = (target: any) => {
    setSelectedTarget(target);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTarget) {
      toast.error("Please select a target user/agent.");
      return;
    }
    if (activeService === "sendMoney") {
      const payload = {
        senderId: user._id,
        receiverId: selectedTarget._id,
        amount,
        isFavoriteTransfer: false,
      };
      sendMoneyMutation.mutate(payload, {
        onSuccess: (res) => {
          toast.success(res.message);
          // Reset the form and close the modal
          setActiveService(null);
          setSelectedTarget(null);
          setAmount(0);
        },
        onError: (error: any) => {
          toast.error(error.message);
        },
      });
    } else if (activeService === "cashOut") {
      const payload = {
        userId: user._id,
        agentId: selectedTarget._id,
        amount,
        userPin: pin,
      };
      cashOutMutation.mutate(payload, {
        onSuccess: (res) => {
          toast.success(res.message);
          setActiveService(null);
          setSelectedTarget(null);
          setAmount(0);
          setPin("");
        },
        onError: (error: any) => {
          toast.error(error.message);
        },
      });
    } else if (activeService === "cashIn") {
      const payload = {
        agentId: user._id,
        userId: selectedTarget._id,
        amount,
        agentPin: pin,
      };
      cashInMutation.mutate(payload, {
        onSuccess: (res) => {
          toast.success(res.message);
          setActiveService(null);
          setSelectedTarget(null);
          setAmount(0);
          setPin("");
        },
        onError: (error: any) => {
          toast.error(error.message);
        },
      });
    }
  };

  return (
    <div className="p-4">
      {/* Grid of service cards */}
      <div className="grid grid-cols-3 gap-4">
        {user.role === "user" && (
          <>
            <div
              className="service-card flex flex-col items-center justify-center cursor-pointer border p-4 rounded shadow hover:bg-gray-100"
              onClick={() => handleServiceClick("sendMoney")}
            >
              <FaUserCircle size={40} />
              <p className="mt-2">Send Money</p>
            </div>
            <div
              className="service-card flex flex-col items-center justify-center cursor-pointer border p-4 rounded shadow hover:bg-gray-100"
              onClick={() => handleServiceClick("cashOut")}
            >
              <SiAmeba size={40} />
              <p className="mt-2">Cash Out</p>
            </div>
          </>
        )}
        {user.role === "agent" && (
          <div
            className="service-card flex flex-col items-center justify-center cursor-pointer border p-4 rounded shadow hover:bg-gray-100"
            onClick={() => handleServiceClick("cashIn")}
          >
            <SiAidungeon size={40} />
            <p className="mt-2">Cash In</p>
          </div>
        )}
      </div>

      {/* Modal for performing a transaction */}
      <Modal
        isOpen={activeService !== null}
        onClose={() => {
          setActiveService(null);
          setSelectedTarget(null);
        }}
      >
        <h2 className="text-xl font-bold mb-4">
          {activeService === "sendMoney"
            ? "Send Money"
            : activeService === "cashOut"
            ? "Cash Out"
            : "Cash In"}
        </h2>
        {isLoading ? (
          <p>Loading users...</p>
        ) : (
          <>
            {!selectedTarget && (
              <div>
                <p className="mb-2">
                  Select {activeService === "cashOut" ? "Agent" : "User"}:
                </p>
                <ul className="max-h-48 overflow-y-auto border rounded">
                  {listToShow.map((target) => (
                    <li
                      key={target._id}
                      className={`p-2 cursor-pointer hover:bg-gray-200 ${
                        selectedTarget && selectedTarget._id === target._id
                          ? "bg-gray-300"
                          : ""
                      }`}
                      onClick={() => handleTargetSelect(target)}
                    >
                      {target.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {selectedTarget && (
              <div className="mt-4">
                <p className="mb-2">
                  Send money to: <strong>{selectedTarget.name}</strong>
                </p>
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="block mb-1">Amount:</label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(parseFloat(e.target.value))}
                      className="w-full border p-2 rounded"
                      required
                    />
                  </div>
                  {(activeService === "cashOut" ||
                    activeService === "cashIn") && (
                    <div className="mb-4">
                      <label className="block mb-1">
                        {activeService === "cashOut"
                          ? "User Pin:"
                          : "Agent Pin:"}
                      </label>
                      <input
                        type="password"
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                        className="w-full border p-2 rounded"
                        required
                      />
                    </div>
                  )}
                  <button
                    type="submit"
                    className="flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    <span>Send</span>
                    <PiNavigationArrow size={20} className="ml-2" />
                  </button>
                </form>
              </div>
            )}
          </>
        )}
      </Modal>
    </div>
  );
};

export default Services;
