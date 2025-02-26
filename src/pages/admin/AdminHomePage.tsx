/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";

import {
  useGetTotalBalance,
  useGetTotalAgentBalance,
  useGetTotalUserBalance,
  useGetAllUsers,
  useApproveAgent,
  IAccount,
} from "../../api/adminAPI";
import Loader from "../../components/UI/Loader/Loader";
import useAuth from "../../hooks/useAuth";

const AdminHomePage: React.FC = () => {
  const { user } = useAuth();
  const adminBalance = user?.balance;

  // Fetch overall balances
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
  // Fetch all users
  const {
    data: allUsersData,
    isLoading: allUsersLoading,
    error: allUsersError,
  } = useGetAllUsers();

  // State for agent requests modal and agent details
  const [showAgentRequests, setShowAgentRequests] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<IAccount | null>(null);

  const approveMutation = useApproveAgent();

  // Show loader if any data is still loading
  if (
    totalBalanceLoading ||
    totalUserBalanceLoading ||
    totalAgentBalanceLoading ||
    allUsersLoading
  ) {
    return <Loader />;
  }

  // Show error message if any query failed
  if (
    totalBalanceError ||
    totalUserBalanceError ||
    totalAgentBalanceError ||
    allUsersError
  ) {
    return (
      <div className="text-center text-red-600 p-4">
        Error loading admin data. Please try again later.
      </div>
    );
  }

  // Fallback: try to get the value either nested in data or directly at the top level.
  const totalBalance =
    ((totalBalanceData as any)?.data?.totalBalance as number) ??
    ((totalBalanceData as any)?.totalBalance as number);
  const totalUserBalance =
    ((totalUserBalanceData as any)?.data?.totalUserBalance as number) ??
    ((totalUserBalanceData as any)?.totalUserBalance as number);
  const totalAgentBalance =
    ((totalAgentBalanceData as any)?.data?.totalAgentBalance as number) ??
    ((totalAgentBalanceData as any)?.totalAgentBalance as number);

  // Extract all users
  const allUsers = allUsersData?.data?.users || [];
  const totalUsersCount = allUsersData?.data?.totalUsers || allUsers.length;
  const activeUsers = allUsersData?.data?.activeUsers || 0;
  const inactiveUsers = allUsersData?.data?.inactiveUsers || 0;
  // Count agents and regular users
  const totalAgentsCount = allUsers.filter(
    (user) => user?.role === "agent"
  ).length;
  const totalRegularUsers = totalUsersCount - totalAgentsCount;
  // Define pending agents (agents with isActive === false)
  const pendingAgents = allUsers.filter(
    (user) => user.role === "agent" && !user.isActive
  );

  // Handle agent approval
  const handleApprove = (agentId: string) => {
    approveMutation.mutate(agentId, {
      onSuccess: () => {
        setSelectedAgent(null);
        setShowAgentRequests(false);
      },
      onError: () => {
        alert("Failed to approve agent.");
      },
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-[#cf1263]">Admin Dashboard</h1>
        <Link to="/">
          <button className="flex items-center gap-2 bg-[#cf1263] text-white px-4 py-2 rounded hover:bg-[#b10f57] transition">
            <Icon icon="mdi:home" className="w-6 h-6" />
            Back to Home
          </button>
        </Link>
      </div>

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
              // Agent Detail Modal
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
                      if (selectedAgent) handleApprove(selectedAgent._id);
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
    </div>
  );
};

export default AdminHomePage;
