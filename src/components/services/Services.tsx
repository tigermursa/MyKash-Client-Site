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
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm transition-all duration-300">
      <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all mx-4">
        <div className="bg-gradient-to-r from-[#cf1263] to-[#ff4d8d] px-6 py-5 flex items-center justify-between">
          <h3 className="text-xl font-bold text-white drop-shadow-md">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/10 transition-colors duration-200"
          >
            <Icon icon="mdi:close" className="text-2xl text-white" />
          </button>
        </div>
        <div className="p-6 space-y-6">{children}</div>
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

  const currentBalance: number = user?.balance ? user.balance : 0;
  const usableBalance: number = currentBalance > 10 ? currentBalance - 10 : 0;

  const { data: usersData, isLoading } = useGetAllUsers();
  const sendMoneyMutation = useSendMoney();
  const cashOutMutation = useCashOut();
  const cashInMutation = useCashIn();
  const createBalanceRequestMutation = useCreateBalanceRequest();

  let listToShow: any[] = [];
  if (
    activeService &&
    usersData?.data?.users &&
    activeService !== "balanceRequest"
  ) {
    listToShow = usersData.data.users.filter((u: any) => {
      if (activeService === "sendMoney") {
        return u.role === "user" && u._id !== user?._id;
      } else if (activeService === "cashOut") {
        // Only show active agents for cashOut
        return u.role === "agent" && u.isActive;
      } else if (activeService === "cashIn") {
        return u.role === "user";
      }
      return false;
    });
  }

  const handleServiceClick = (service: ServiceType) => {
    setActiveService(service);
    if (service !== "balanceRequest") setSelectedTarget(null);
    setAmount(0);
    setPin("");
  };

  const handleTargetSelect = (target: any) => setSelectedTarget(target);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check for sufficient usable balance on applicable services
    if (
      (activeService === "sendMoney" || activeService === "cashOut") &&
      amount > usableBalance
    ) {
      toast.error(`Insufficient balance. Available: ${usableBalance}৳`);
      return;
    }

    // For services that require a PIN, ensure one is provided
    if (
      (activeService === "sendMoney" ||
        activeService === "cashOut" ||
        activeService === "cashIn") &&
      !pin
    ) {
      toast.error("Please enter your security PIN.");
      return;
    }

    const commonErrorHandling = (error: any) =>
      toast.error(error.message || "Transaction failed");

    if (activeService === "sendMoney") {
      if (!selectedTarget) {
        toast.error("Please select a recipient.");
        return;
      }
      const payload = {
        senderId: user!._id,
        receiverId: selectedTarget._id,
        amount,
        userPin: pin,
        isFavoriteTransfer: false,
      };
      sendMoneyMutation.mutate(payload, {
        onSuccess: (res) => {
          toast.success(res.message);
          setActiveService(null);
        },
        onError: commonErrorHandling,
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
        onSuccess: (res) => toast.success(res.message),
        onError: commonErrorHandling,
      });
    } else if (activeService === "cashIn") {
      if (!selectedTarget) {
        toast.error("Please select a recipient.");
        return;
      }
      const payload = {
        agentId: user!._id,
        userId: selectedTarget._id,
        amount,
        agentPin: pin,
      };
      cashInMutation.mutate(payload, {
        onSuccess: (res) => toast.success(res.message),
        onError: commonErrorHandling,
      });
    } else if (activeService === "balanceRequest") {
      createBalanceRequestMutation.mutate(
        { userId: user!._id, amount },
        {
          onSuccess: (res) => toast.success(res.message),
          onError: commonErrorHandling,
        }
      );
    }
  };

  const ServiceCard: React.FC<{
    label: string;
    icon: string;
    onClick?: () => void;
  }> = ({ label, icon, onClick }) => (
    <div
      onClick={onClick}
      className="group cursor-pointer flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-lg transition-all 
                 hover:scale-105 hover:shadow-xl active:scale-95 border border-transparent hover:border-pink-100"
    >
      <div className="p-4 bg-pink-50 rounded-full mb-3 transition-colors group-hover:bg-pink-100">
        <Icon icon={icon} className="text-4xl text-[#cf1263]" />
      </div>
      <p className="text-lg font-semibold text-gray-800">{label}</p>
    </div>
  );

  const modalTitleMap = {
    sendMoney: "Send Money",
    cashOut: "Cash Out",
    cashIn: "Cash In",
    balanceRequest: "Balance Request",
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {user!.role === "user" && (
          <>
            <ServiceCard
              label="Send Money"
              icon="mdi:send"
              onClick={() => handleServiceClick("sendMoney")}
            />
            <ServiceCard
              label="Cash Out"
              icon="mdi:bank-transfer-out"
              onClick={() => handleServiceClick("cashOut")}
            />
          </>
        )}
        {user!.role === "agent" && (
          <>
            <ServiceCard
              label="Cash In"
              icon="mdi:bank-transfer-in"
              onClick={() => handleServiceClick("cashIn")}
            />
            <ServiceCard
              label="Balance Request"
              icon="mdi:wallet-outline"
              onClick={() => handleServiceClick("balanceRequest")}
            />
          </>
        )}
        {user!.role !== "admin" && (
          <Link to="/history">
            <div
              className="group cursor-pointer flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-lg transition-all 
                          hover:scale-105 hover:shadow-xl active:scale-95 border border-transparent hover:border-pink-100"
            >
              <div className="p-4 bg-pink-50 rounded-full mb-3 transition-colors group-hover:bg-pink-100">
                <Icon icon="mdi:history" className="text-4xl text-[#cf1263]" />
              </div>
              <p className="text-lg font-semibold text-gray-800">
                Transaction History
              </p>
            </div>
          </Link>
        )}
      </div>

      <Modal
        isOpen={activeService !== null}
        onClose={() => setActiveService(null)}
        title={activeService ? modalTitleMap[activeService] : ""}
      >
        {(activeService === "sendMoney" || activeService === "cashOut") && (
          <div className="mb-6 p-4 bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl border border-pink-100">
            <div className="flex justify-between text-sm font-medium">
              <span className="text-gray-600">Available Balance:</span>
              <span className="text-[#cf1263]">{usableBalance}৳</span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="text-gray-500">Reserved Amount:</span>
              <span className="text-gray-500">10৳</span>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Icon
              icon="mdi:loading"
              className="text-4xl text-[#cf1263] animate-spin"
            />
          </div>
        ) : activeService === "balanceRequest" ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Request Amount (৳)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(parseFloat(e.target.value))}
                  className="w-full pl-4 pr-12 py-3 border-2 border-gray-200 rounded-xl
                           focus:border-[#cf1263] focus:ring-2 focus:ring-pink-100 outline-none"
                  placeholder="0.00"
                  required
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                  ৳
                </span>
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-[#cf1263] to-[#ff4d8d] hover:to-[#ff367c]
                       text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl"
            >
              Submit Request
            </button>
          </form>
        ) : (
          <>
            {!selectedTarget ? (
              <div>
                <p className="mb-3 font-medium text-gray-700">
                  Select recipient:
                </p>
                <ul className="max-h-60 overflow-y-auto pr-2 space-y-1 scrollbar-thin scrollbar-thumb-pink-200">
                  {listToShow.map((target: any) => (
                    <li
                      key={target._id}
                      onClick={() => handleTargetSelect(target)}
                      className="flex items-center p-3 rounded-lg cursor-pointer transition-all
                               hover:bg-pink-50 active:bg-pink-100 border border-transparent hover:border-pink-200"
                    >
                      <Icon
                        icon="mdi:account-circle"
                        className="text-3xl text-gray-400 mr-3"
                      />
                      <div>
                        <p className="font-medium text-gray-800">
                          {target.name}
                        </p>
                        <p className="text-sm text-gray-500">{target.phone}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center bg-pink-50 rounded-xl p-4">
                  <Icon
                    icon="mdi:check-circle"
                    className="text-2xl text-[#cf1263] mr-3"
                  />
                  <div>
                    <p className="text-sm text-gray-600">Selected account:</p>
                    <p className="font-medium text-gray-800">
                      {selectedTarget.name}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedTarget(null)}
                    className="ml-auto text-gray-400 hover:text-gray-600"
                  >
                    <Icon icon="mdi:close" className="text-xl" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Amount (৳)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(parseFloat(e.target.value))}
                        className="w-full pl-4 pr-12 py-3 border-2 border-gray-200 rounded-xl
                                 focus:border-[#cf1263] focus:ring-2 focus:ring-pink-100 outline-none"
                        placeholder="0.00"
                        required
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                        ৳
                      </span>
                    </div>
                  </div>

                  {(activeService === "cashOut" ||
                    activeService === "cashIn" ||
                    activeService === "sendMoney") && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Security PIN
                      </label>
                      <input
                        type="password"
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl
                                 focus:border-[#cf1263] focus:ring-2 focus:ring-pink-100 outline-none"
                        placeholder="••••"
                        required
                      />
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-gradient-to-r from-[#cf1263] to-[#ff4d8d] hover:to-[#ff367c]
                             text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl
                             flex items-center justify-center gap-2"
                  >
                    {activeService === "sendMoney" && (
                      <Icon icon="mdi:send" className="text-xl" />
                    )}
                    {activeService === "cashOut" && (
                      <Icon icon="mdi:cash-remove" className="text-xl" />
                    )}
                    {activeService === "cashIn" && (
                      <Icon icon="mdi:cash-plus" className="text-xl" />
                    )}
                    {modalTitleMap[activeService as ServiceType]}
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
