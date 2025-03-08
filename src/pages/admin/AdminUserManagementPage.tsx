import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useGetAllUsers, useBlockUser } from "../../api/adminAPI";
import { IAccount } from "../../api/adminAPI";
import Loader from "../../components/UI/Loader/Loader";
import { toast } from "react-toastify";

const AdminUserManagementPage = () => {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useGetAllUsers();
  const [selectedUser, setSelectedUser] = useState<IAccount | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Using isMutating (React Query v4) to reflect the mutation state
  const { mutate: toggleBlock, isPending: isBlocking } = useBlockUser();

  const handleViewUser = (user: IAccount) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleToggleBlock = () => {
    if (selectedUser) {
      // Save the current user state to revert in case of an error
      const previousUser = selectedUser;
      // Optimistic update: immediately toggle the isBlocked state in the modal
      const updatedUser = {
        ...selectedUser,
        isBlocked: !selectedUser.isBlocked,
      };
      setSelectedUser(updatedUser);

      // Call the mutation
      toggleBlock(selectedUser.userID, {
        onSuccess: () => {
          toast.success("User status updated successfully");
          // Invalidate to refresh the list data if needed
          queryClient.invalidateQueries({ queryKey: ["admin-users"] });
        },
        onError: (error: Error) => {
          toast.error(`Error: ${error.message}`);
          // Revert the optimistic update if the API call fails
          setSelectedUser(previousUser);
        },
      });
    }
  };

  if (isLoading)
    return (
      <div className="text-center p-8">
        <Loader />
      </div>
    );

  if (error)
    return (
      <div className="text-center p-8 text-red-600">Error: {error.message}</div>
    );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8 text-[#cf1263]">
        User Management
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.data.users.map((user) => (
          <div key={user._id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold">{user.name}</h2>
                <p className="text-gray-600 text-sm">{user.userID}</p>
                <span
                  className={`inline-block mt-2 px-3 py-1 text-sm rounded-full ${
                    user.role === "admin"
                      ? "bg-purple-100 text-purple-800"
                      : user.role === "agent"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {user.role}
                </span>
              </div>
              <button
                onClick={() => handleViewUser(user)}
                className="px-4 py-2 bg-[#cf1263] text-white rounded-md hover:bg-[#a90f50] transition-colors"
              >
                View
              </button>
            </div>
            <div className="flex justify-between items-center text-sm">
              <p
                className={`font-medium ${
                  user.isBlocked ? "text-red-600" : "text-green-600"
                }`}
              >
                {user.isBlocked ? "Blocked" : "Active"}
              </p>
              <p>Balance: ৳{user.balance}</p>
            </div>
          </div>
        ))}
      </div>
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-2xl font-bold text-[#cf1263]">
                {selectedUser.name}
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3">
              <p>
                <span className="font-semibold">Email:</span>{" "}
                {selectedUser.email}
              </p>
              <p>
                <span className="font-semibold">Mobile:</span>{" "}
                {selectedUser.mobile}
              </p>
              <p>
                <span className="font-semibold">Role:</span> {selectedUser.role}
              </p>
              <p>
                <span className="font-semibold">Balance:</span> ৳
                {selectedUser.balance}
              </p>
              <p>
                <span className="font-semibold">NID:</span> {selectedUser.nid}
              </p>
              <p>
                <span className="font-semibold">Status:</span>
                <span
                  className={`ml-2 ${
                    selectedUser.isBlocked ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {selectedUser.isBlocked ? "Blocked" : "Active"}
                </span>
              </p>
            </div>
            <div className="mt-6 flex justify-end gap-4">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                onClick={handleCloseModal}
                disabled={isBlocking}
              >
                Close
              </button>
              <button
                className={`px-4 py-2 rounded-md transition-colors ${
                  selectedUser.isBlocked
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-red-600 hover:bg-red-700 text-white"
                }`}
                onClick={handleToggleBlock}
                disabled={isBlocking}
              >
                {isBlocking
                  ? "Updating..."
                  : selectedUser.isBlocked
                  ? "Unblock User"
                  : "Block User"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserManagementPage;
