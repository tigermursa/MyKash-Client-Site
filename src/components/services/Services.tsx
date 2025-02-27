/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import useAuth from "../../hooks/useAuth";
import { useSendMoney, useCashOut, useCashIn } from "../../api/transactionAPI";
import { useGetAllUsers } from "../../api/adminAPI";
import { useCreateBalanceRequest } from "../../api/balanceRequestAPI";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded p-6 w-11/12 max-w-md">
        <button
          className="text-red-500 float-right text-lg font-bold"
          onClick={onClose}
        >
          &times;
        </button>
        <div className="clear-both mt-4">{children}</div>
      </div>
    </div>
  );
};

type ServiceType = "sendMoney" | "cashOut" | "cashIn" | "balanceRequest";

const Services: React.FC = () => {
  const { user } = useAuth();
  const [activeService, setActiveService] = useState<ServiceType | null>(null);
  const [selectedTarget, setSelectedTarget] = useState<any>(null);
  const [amount, setAmount] = useState<number>(0);
  const [pin, setPin] = useState<string>("");

  // Fetch all users (used for Send Money, Cash Out, Cash In)
  const { data: usersData, isLoading } = useGetAllUsers();

  // Transaction mutations
  const sendMoneyMutation = useSendMoney();
  const cashOutMutation = useCashOut();
  const cashInMutation = useCashIn();
  // Hook for creating a balance request (used by agents)
  const createBalanceRequestMutation = useCreateBalanceRequest();

  // For services that need to select a target user
  let listToShow: any[] = [];
  if (
    activeService &&
    usersData?.data?.users &&
    activeService !== "balanceRequest"
  ) {
    listToShow = usersData.data.users.filter((u: any) => {
      if (activeService === "sendMoney") {
        return u.role === "user" && u._id !== user?._id;
      }
      // For cashOut and cashIn, use role-specific filtering
      return u.role === (activeService === "cashOut" ? "agent" : "user");
    });
  }

  const handleServiceClick = (service: ServiceType) => {
    setActiveService(service);
    if (service !== "balanceRequest") {
      setSelectedTarget(null);
    }
    setAmount(0);
    setPin("");
  };

  const handleTargetSelect = (target: any) => {
    setSelectedTarget(target);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeService === "sendMoney") {
      if (!selectedTarget) {
        toast.error("Please select a target user.");
        return;
      }
      const payload = {
        senderId: user!._id,
        receiverId: selectedTarget._id,
        amount,
        isFavoriteTransfer: false,
      };
      sendMoneyMutation.mutate(payload, {
        onSuccess: (res) => {
          toast.success(res.message);
          setActiveService(null);
        },
        onError: (error: any) => toast.error(error.message),
      });
    } else if (activeService === "cashOut") {
      if (!selectedTarget) {
        toast.error("Please select an agent.");
        return;
      }
      const payload = {
        userId: user!._id,
        agentId: selectedTarget._id,
        amount,
        userPin: pin,
      };
      cashOutMutation.mutate(payload, {
        onSuccess: (res) => {
          toast.success(res.message);
          setActiveService(null);
        },
        onError: (error: any) => toast.error(error.message),
      });
    } else if (activeService === "cashIn") {
      if (!selectedTarget) {
        toast.error("Please select a target user.");
        return;
      }
      const payload = {
        agentId: user!._id,
        userId: selectedTarget._id,
        amount,
        agentPin: pin,
      };
      cashInMutation.mutate(payload, {
        onSuccess: (res) => {
          toast.success(res.message);
          setActiveService(null);
        },
        onError: (error: any) => toast.error(error.message),
      });
    } else if (activeService === "balanceRequest") {
      const payload = {
        userId: user!._id,
        amount,
      };
      createBalanceRequestMutation.mutate(payload, {
        onSuccess: (res) => {
          toast.success(res.message);
          setActiveService(null);
        },
        onError: (error: any) => toast.error(error.message),
      });
    }
  };

  // A reusable service card design
  const ServiceCard: React.FC<{
    label: string;
    icon: string;
    onClick?: () => void;
  }> = ({ label, icon, onClick }) => (
    <div
      onClick={onClick}
      className="group cursor-pointer flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow transition transform hover:scale-105 hover:shadow-xl"
    >
      <Icon
        icon={icon}
        width="48"
        className="text-indigo-600 group-hover:text-indigo-800"
      />
      <p className="mt-3 text-lg font-semibold text-gray-800">{label}</p>
    </div>
  );

  return (
    <div className="p-4">
      {/* Service Cards Grid */}
      <div className="grid grid-cols-3 gap-6">
        {user!.role === "user" && (
          <>
            <ServiceCard
              label="Send Money"
              icon="mdi:send"
              onClick={() => handleServiceClick("sendMoney")}
            />
            <ServiceCard
              label="Cash Out"
              icon="mdi:cash-refund"
              onClick={() => handleServiceClick("cashOut")}
            />
          </>
        )}
        {user!.role === "agent" && (
          <>
            <ServiceCard
              label="Cash In"
              icon="mdi:cash-plus"
              onClick={() => handleServiceClick("cashIn")}
            />
            <ServiceCard
              label="Balance Request"
              icon="mdi:wallet-plus"
              onClick={() => handleServiceClick("balanceRequest")}
            />
          </>
        )}
        {/* History card for all roles */}
        <Link to="/history">
          <div className="group cursor-pointer flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow transition transform hover:scale-105 hover:shadow-xl">
            <Icon
              icon="mdi:history"
              width="48"
              className="text-indigo-600 group-hover:text-indigo-800"
            />
            <p className="mt-3 text-lg font-semibold text-gray-800">History</p>
          </div>
        </Link>
      </div>

      {/* Modal for Service Actions */}
      <Modal
        isOpen={activeService !== null}
        onClose={() => {
          setActiveService(null);
          setSelectedTarget(null);
        }}
      >
        <h2 className="text-xl font-bold mb-4">
          {activeService === "sendMoney" && "Send Money"}
          {activeService === "cashOut" && "Cash Out"}
          {activeService === "cashIn" && "Cash In"}
          {activeService === "balanceRequest" && "Balance Request"}
        </h2>
        {isLoading ? (
          <p>Loading users...</p>
        ) : activeService === "balanceRequest" ? (
          // For balance request, no target selection is needed.
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mb-1 font-medium">Amount:</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value))}
                className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full flex items-center justify-center bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
            >
              <span>Request Balance</span>
            </button>
          </form>
        ) : (
          <>
            {!selectedTarget ? (
              <div>
                <p className="mb-2 font-medium">Select a user:</p>
                <ul className="max-h-48 overflow-y-auto border rounded">
                  {listToShow.map((target: any) => (
                    <li
                      key={target._id}
                      className="p-2 cursor-pointer hover:bg-gray-200"
                      onClick={() => handleTargetSelect(target)}
                    >
                      {target.name}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="mt-4">
                <p className="mb-2 font-medium">
                  Target: <strong>{selectedTarget.name}</strong>
                </p>
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="block mb-1 font-medium">Amount:</label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(parseFloat(e.target.value))}
                      className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
                      required
                    />
                  </div>
                  {(activeService === "cashOut" ||
                    activeService === "cashIn") && (
                    <div className="mb-4">
                      <label className="block mb-1 font-medium">
                        {activeService === "cashOut"
                          ? "User Pin:"
                          : "Agent Pin:"}
                      </label>
                      <input
                        type="password"
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                        className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
                        required
                      />
                    </div>
                  )}
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
                  >
                    <span>
                      {activeService === "sendMoney"
                        ? "Send Money"
                        : activeService === "cashOut"
                        ? "Cash Out"
                        : activeService === "cashIn"
                        ? "Cash In"
                        : "Request Balance"}
                    </span>
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
