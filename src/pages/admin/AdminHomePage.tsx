/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Icon } from "@iconify/react";

import {
  useGetTotalBalance,
  useGetTotalAgentBalance,
  useGetTotalUserBalance,
  useGetAllUsers,
  useApproveAgent,
  IAccount,
} from "../../api/adminAPI";
import {
  useGetPendingBalanceRequests,
  useApproveBalanceRequest,
  IBalanceRequest,
} from "../../api/balanceRequestAPI";
import Loader from "../../components/UI/Loader/Loader";
import useAuth from "../../hooks/useAuth";
import { toast } from "react-toastify";

const AdminHomePage: React.FC = () => {
  const { user } = useAuth();
  const adminBalance = user?.balance;

  // Overall balances
  const {
    data: totalBalanceData,
    isLoading: totalBalanceLoading,
    error: totalBalanceError,
  } = useGetTotalBalance();
  const {
    data: totalUserBalanceData,
    isLoading: totalUserBalanceLoading,
    error: totalUserBalanceError,
  } = useGetTotalUserBalance();
  const {
    data: totalAgentBalanceData,
    isLoading: totalAgentBalanceLoading,
    error: totalAgentBalanceError,
  } = useGetTotalAgentBalance();

  // All users and statistics
  const {
    data: allUsersData,
    isLoading: allUsersLoading,
    error: allUsersError,
  } = useGetAllUsers();

  // Balance requests (for admin management)
  const {
    data: pendingBalanceRequestsData,
    isLoading: pendingBalanceRequestsLoading,
    error: pendingBalanceRequestsError,
  } = useGetPendingBalanceRequests();
  const approveBalanceRequestMutation = useApproveBalanceRequest();

  // Agent approval state
  const [showAgentRequests, setShowAgentRequests] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<IAccount | null>(null);

  // Balance request modal state
  const [showBalanceRequests, setShowBalanceRequests] = useState(false);

  const approveAgentMutation = useApproveAgent();

  // Show Loader if any data is still loading
  if (
    totalBalanceLoading ||
    totalUserBalanceLoading ||
    totalAgentBalanceLoading ||
    allUsersLoading ||
    pendingBalanceRequestsLoading
  ) {
    return <Loader />;
  }

  // Error handling if any query failed
  if (
    totalBalanceError ||
    totalUserBalanceError ||
    totalAgentBalanceError ||
    allUsersError ||
    pendingBalanceRequestsError
  ) {
    return (
      <div className="text-center text-red-600 p-4">
        Error loading admin data. Please try again later.
      </div>
    );
  }

  // Fallback: try to get the balance values from nested data or directly.
  const totalBalance =
    ((totalBalanceData as any)?.data?.totalBalance as number) ??
    ((totalBalanceData as any)?.totalBalance as number);
  const totalUserBalance =
    ((totalUserBalanceData as any)?.data?.totalUserBalance as number) ??
    ((totalUserBalanceData as any)?.totalUserBalance as number);
  const totalAgentBalance =
    ((totalAgentBalanceData as any)?.data?.totalAgentBalance as number) ??
    ((totalAgentBalanceData as any)?.totalAgentBalance as number);

  // Extract users and statistics
  const allUsers = allUsersData?.data?.users || [];
  const totalUsersCount = allUsersData?.data?.totalUsers || allUsers.length;
  const activeUsers = allUsersData?.data?.activeUsers || 0;
  const inactiveUsers = allUsersData?.data?.inactiveUsers || 0;
  const totalAgentsCount = allUsers.filter(
    (user) => user?.role === "agent"
  ).length;
  const totalRegularUsers = totalUsersCount - totalAgentsCount;
  const pendingAgents = allUsers.filter(
    (user) => user.role === "agent" && !user.isActive
  );

  // Handler for approving an agent
  const handleApproveAgent = (agentId: string) => {
    approveAgentMutation.mutate(agentId, {
      onSuccess: () => {
        setSelectedAgent(null);
        setShowAgentRequests(false);
      },
      onError: () => {
        alert("Failed to approve agent.");
      },
    });
  };

  // Handler for approving a balance request
  const handleApproveBalanceRequest = (requestId: string) => {
    approveBalanceRequestMutation.mutate(requestId, {
      onSuccess: () => {
        toast.success("Balance request approved successfully.");
        setShowBalanceRequests(false);
      },
      onError: () => {
        toast.error("Failed to approve balance request.");
      },
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {adminBalance !== undefined && (
          <div className="p-4 border border-[#cf1263] rounded-lg shadow">
            <p className="text-lg font-bold text-[#cf1263]">Admin Balance</p>
            <p className="text-2xl font-semibold">৳{adminBalance}</p>
          </div>
        )}
        <div className="p-4 border border-[#cf1263] rounded-lg shadow">
          <p className="text-lg font-bold text-[#cf1263]">Total Balance</p>
          <p className="text-2xl font-semibold">৳{totalBalance}</p>
        </div>
        <div className="p-4 border border-[#cf1263] rounded-lg shadow">
          <p className="text-lg font-bold text-[#cf1263]">
            Total Agent Balance
          </p>
          <p className="text-2xl font-semibold">৳{totalAgentBalance}</p>
        </div>
        <div className="p-4 border border-[#cf1263] rounded-lg shadow">
          <p className="text-lg font-bold text-[#cf1263]">Total User Balance</p>
          <p className="text-2xl font-semibold">৳{totalUserBalance}</p>
        </div>
      </div>

      {/* User & Agent Statistics */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-[#cf1263] mb-4">
          User & Agent Statistics
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 border rounded shadow">
            <p className="text-lg font-medium">Total Users</p>
            <p className="text-2xl font-semibold">{totalUsersCount}</p>
          </div>
          <div className="p-4 border rounded shadow">
            <p className="text-lg font-medium">Active Users</p>
            <p className="text-2xl font-semibold">{activeUsers}</p>
          </div>
          <div className="p-4 border rounded shadow">
            <p className="text-lg font-medium">Inactive Users</p>
            <p className="text-2xl font-semibold">{inactiveUsers}</p>
          </div>
          <div className="p-4 border rounded shadow">
            <p className="text-lg font-medium">Total Agents</p>
            <p className="text-2xl font-semibold">{totalAgentsCount}</p>
          </div>
          <div className="p-4 border rounded shadow">
            <p className="text-lg font-medium">Regular Users</p>
            <p className="text-2xl font-semibold">{totalRegularUsers}</p>
          </div>
        </div>
      </div>

      {/* Agent Requests Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-[#cf1263] mb-4 flex items-center gap-2">
          <Icon icon="mdi:account-alert" className="w-8 h-8" />
          Agent Requests ({pendingAgents.length})
        </h2>
        <button
          onClick={() => setShowAgentRequests(true)}
          className="bg-[#cf1263] text-white px-4 py-2 rounded hover:bg-[#b10f57] transition"
        >
          View Agent Requests
        </button>
      </div>

      {/* Balance Requests Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-[#cf1263] mb-4 flex items-center gap-2">
          <Icon icon="mdi:wallet-plus" className="w-8 h-8" />
          Balance Request ({pendingBalanceRequestsData?.data?.length ?? 0})
        </h2>
        <button
          onClick={() => setShowBalanceRequests(true)}
          className="bg-[#cf1263] text-white px-4 py-2 rounded hover:bg-[#b10f57] transition"
        >
          Manage Balance Requests
        </button>
      </div>

      {/* Modal for Pending Agent Requests */}
      {showAgentRequests && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6 mx-4 relative">
            <button
              onClick={() => {
                setShowAgentRequests(false);
                setSelectedAgent(null);
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <Icon icon="mdi:close" className="w-6 h-6" />
            </button>
            {!selectedAgent ? (
              <>
                <h3 className="text-2xl font-bold text-[#cf1263] mb-4">
                  Pending Agent Requests
                </h3>
                {pendingAgents.length === 0 ? (
                  <p>No pending agent requests.</p>
                ) : (
                  <div className="space-y-3">
                    {pendingAgents.map((agent) => (
                      <div
                        key={agent._id}
                        onClick={() => setSelectedAgent(agent)}
                        className="p-4 border rounded shadow hover:bg-gray-50 cursor-pointer flex items-center gap-4"
                      >
                        <Icon
                          icon="mdi:account"
                          className="w-6 h-6 text-[#cf1263]"
                        />
                        <div>
                          <p className="font-medium">{agent.name}</p>
                          <p className="text-sm text-gray-500">{agent.email}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div>
                <h3 className="text-2xl font-bold text-[#cf1263] mb-4">
                  Agent Details
                </h3>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Name:</span>{" "}
                    {selectedAgent.name}
                  </p>
                  <p>
                    <span className="font-medium">Email:</span>{" "}
                    {selectedAgent.email}
                  </p>
                  <p>
                    <span className="font-medium">Mobile:</span>{" "}
                    {selectedAgent.mobile}
                  </p>
                  <p>
                    <span className="font-medium">NID:</span>{" "}
                    {selectedAgent.nid}
                  </p>
                  <p>
                    <span className="font-medium">Balance:</span> ৳
                    {selectedAgent.balance}
                  </p>
                </div>
                <div className="mt-6 flex justify-end gap-4">
                  <button
                    onClick={() => setSelectedAgent(null)}
                    className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => {
                      if (selectedAgent) handleApproveAgent(selectedAgent._id);
                    }}
                    className="px-4 py-2 bg-[#cf1263] text-white rounded hover:bg-[#b10f57] transition"
                  >
                    Approve
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal for Pending Balance Requests */}
      {showBalanceRequests && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6 mx-4 relative">
            <button
              onClick={() => setShowBalanceRequests(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <Icon icon="mdi:close" className="w-6 h-6" />
            </button>
            <h3 className="text-2xl font-bold text-[#cf1263] mb-4">
              Pending Balance Requests
            </h3>
            {pendingBalanceRequestsData?.data?.length === 0 ? (
              <p>No pending balance requests.</p>
            ) : (
              <div className="space-y-3">
                {pendingBalanceRequestsData?.data?.map(
                  (req: IBalanceRequest) => (
                    <div
                      key={req.requestId}
                      className="p-4 border rounded shadow hover:bg-gray-50 flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium">User ID: {req.userId}</p>
                        <p className="text-sm text-gray-500">
                          Amount: ৳{req.amount}
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          handleApproveBalanceRequest(req.requestId)
                        }
                        className="px-4 py-2 bg-[#cf1263] text-white rounded hover:bg-[#b10f57] transition"
                      >
                        Approve
                      </button>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminHomePage;
