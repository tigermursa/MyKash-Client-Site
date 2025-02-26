import React, { useState } from "react";
import { Icon } from "@iconify/react";
import useAuth from "../hooks/useAuth";
import { useGetHistory } from "../api/adminAPI";
import { Link } from "react-router-dom";

interface Transaction {
  transactionId: string;
  amount: number;
  createdAt: string;
  updatedAt: string;
  fromAccount?: {
    name: string;
    accountId: string;
  };
  toAccount?: {
    name: string;
    accountId: string;
  };
  fee: number;
  transactionType: "transfer" | "payment" | "deposit";
}

const History: React.FC = () => {
  const { user, isLoading: authLoading } = useAuth();
  const loggedInUserId = user?._id;
  const userID = user?.userID;
  const [selectedTxId, setSelectedTxId] = useState<string | null>(null);

  const {
    data,
    error,
    isLoading: historyLoading,
  } = useGetHistory(userID as string);

  const transactions: Transaction[] = data?.data || [];
  const selectedTransaction = transactions.find(
    (tx) => tx.transactionId === selectedTxId
  );

  // Helper: determine if a transaction is incoming (logged in user is receiver)
  const isIncoming = (tx: Transaction) =>
    loggedInUserId === tx.toAccount?.accountId;
  // Arrow icon: right for incoming, left for outgoing
  const getArrowIcon = (tx: Transaction) =>
    isIncoming(tx) ? "mdi:arrow-right-bold" : "mdi:arrow-left-bold";
  // Amount styling and sign based on transaction direction
  const getAmountProps = (tx: Transaction) => {
    const incoming = isIncoming(tx);
    return {
      colorClass: incoming ? "text-green-600" : "text-red-600",
      sign: incoming ? "+" : "-",
    };
  };
  // Get counterpart account details based on transaction direction
  const getCounterpart = (tx: Transaction) => {
    if (isIncoming(tx)) {
      return {
        label: "From",
        name: tx.fromAccount?.name || "Unknown",
      };
    }
    return {
      label: "To",
      name: tx.toAccount?.name || "Unknown",
    };
  };

  if (authLoading || historyLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Icon
          icon="svg-spinners:3-dots-scale"
          className="w-12 h-12 text-pink-600"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-50">
        <div className="text-center p-8 max-w-md">
          <Icon
            icon="ion:alert-circle"
            className="w-16 h-16 text-red-600 mx-auto mb-4"
          />
          <h2 className="text-xl font-semibold text-red-800 mb-2">
            Loading Error
          </h2>
          <p className="text-red-600">
            Failed to load transaction history. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold text-center mb-8 text-pink-600 flex items-center justify-center gap-2">
        <Icon icon="mdi:clock-time-three-outline" className="w-8 h-8" />
        Transaction History
      </h1>

      <div className="mb-6 text-center">
        <Link to="/home">
          <button className="flex items-center gap-2 bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700 transition">
            <Icon icon="mdi:home" className="w-6 h-6" />
            Back to Home
          </button>
        </Link>
      </div>

      {transactions.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Icon
            icon="mdi:package-variant-closed"
            className="w-16 h-16 text-gray-400 mx-auto mb-4"
          />
          <p className="text-gray-500 text-lg">No transactions found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {transactions.map((tx) => {
            const { colorClass, sign } = getAmountProps(tx);
            const counterpart = getCounterpart(tx);
            return (
              <div
                key={tx.transactionId}
                onClick={() => setSelectedTxId(tx.transactionId)}
                className="group bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-2 rounded-full bg-opacity-10 ${colorClass}`}
                    >
                      <Icon
                        icon={getArrowIcon(tx)}
                        className={`w-6 h-6 ${colorClass}`}
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {isIncoming(tx) ? "Received Money" : "Sent Money"}{" "}
                        {counterpart.label} {counterpart.name}
                      </p>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <Icon icon="mdi:calendar" className="w-4 h-4" />
                        {new Date(tx.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-xl font-bold ${colorClass}`}>
                      {sign}৳{tx.amount}
                    </p>
                    <p className="text-sm text-gray-500 capitalize">
                      {tx.transactionType}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal for transaction details */}
      {selectedTxId && selectedTransaction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6 mx-4">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Transaction Details
              </h2>
              <button
                onClick={() => setSelectedTxId(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <Icon icon="mdi:close" className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4 text-gray-600">
              <DetailItem
                icon="mdi:identifier"
                label="Transaction ID"
                value={selectedTransaction.transactionId}
              />
              <DetailItem
                icon="mdi:account"
                label="From Account"
                value={selectedTransaction.fromAccount?.name || "N/A"}
              />
              <DetailItem
                icon="mdi:account"
                label="To Account"
                value={selectedTransaction.toAccount?.name || "N/A"}
              />
              <div className="grid grid-cols-2 gap-4">
                <DetailItem
                  icon="mdi:currency-bdt"
                  label="Amount"
                  value={`${isIncoming(selectedTransaction) ? "+" : "-"}৳${
                    selectedTransaction.amount
                  }`}
                />
                <DetailItem
                  icon="mdi:receipt"
                  label="Fee"
                  value={`৳${selectedTransaction.fee}`}
                />
                <DetailItem
                  icon="mdi:calendar"
                  label="Created At"
                  value={new Date(
                    selectedTransaction.createdAt
                  ).toLocaleString()}
                />
                <DetailItem
                  icon="mdi:update"
                  label="Updated At"
                  value={new Date(
                    selectedTransaction.updatedAt
                  ).toLocaleString()}
                />
              </div>
              <div className="mt-6 pt-4 border-t border-gray-200">
                <DetailItem
                  icon="mdi:swap-horizontal"
                  label="Transaction Type"
                  value={selectedTransaction.transactionType}
                  className="capitalize"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface DetailItemProps {
  icon: string;
  label: string;
  value: string | number;
  className?: string;
}
const DetailItem: React.FC<DetailItemProps> = ({
  icon,
  label,
  value,
  className,
}) => (
  <div className="flex items-start gap-3">
    <Icon icon={icon} className="w-5 h-5 text-pink-600 mt-0.5 flex-shrink-0" />
    <div className={className}>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="text-gray-900">{value}</p>
    </div>
  </div>
);

export default History;
