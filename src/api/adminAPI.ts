import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const BASE_URL_FROM_ENV = import.meta.env.VITE_BASE_URL;
const BASE_URL = `${BASE_URL_FROM_ENV}/api/v1/admin`;

async function apiRequest<T>(
  endpoint: string,
  method: string,
  body?: object
): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }
  return response.json() as Promise<T>;
}

export interface IAccount {
  _id: string;
  userID: string;
  name: string;
  mobile: string;
  email: string;
  nid: string;
  pin: string;
  role: "user" | "agent" | "admin";
  balance: number;
  isBlocked: boolean;
  isDelete: boolean;
  isActive: boolean;
  favorites?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ITransaction {
  transactionId: string;
  fromAccount?: { userID: string; name: string } | null;
  toAccount?: { userID: string; name: string } | null;
  amount: number;
  fee: number;
  transactionType: "sendMoney" | "cashIn" | "cashOut";
  createdAt: string;
  updatedAt: string;
}

export interface IAuthResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface IAdminUsersResponseData {
  users: IAccount[];
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
}

export const approveAgent = (id: string): Promise<IAuthResponse<IAccount>> =>
  apiRequest<IAuthResponse<IAccount>>(`/approve-agent/${id}`, "PUT");

export const getAllUsers = (): Promise<
  IAuthResponse<IAdminUsersResponseData>
> => apiRequest<IAuthResponse<IAdminUsersResponseData>>("/users", "GET");

export const getUser = (userID: string): Promise<IAuthResponse<IAccount>> =>
  apiRequest<IAuthResponse<IAccount>>(`/user/${userID}`, "GET");

export const getTotalBalance = (): Promise<
  IAuthResponse<{ totalBalance: number }>
> =>
  apiRequest<IAuthResponse<{ totalBalance: number }>>("/total-balance", "GET");

export const getTotalUserBalance = (): Promise<
  IAuthResponse<{ totalUserBalance: number }>
> =>
  apiRequest<IAuthResponse<{ totalUserBalance: number }>>(
    "/total-balance/user",
    "GET"
  );

export const getTotalAgentBalance = (): Promise<
  IAuthResponse<{ totalAgentBalance: number }>
> =>
  apiRequest<IAuthResponse<{ totalAgentBalance: number }>>(
    "/total-balance/agent",
    "GET"
  );

export const getHistory = (
  userID: string
): Promise<IAuthResponse<ITransaction[]>> =>
  apiRequest<IAuthResponse<ITransaction[]>>(`/history/${userID}`, "GET");

export const useApproveAgent = () => {
  const queryClient = useQueryClient();
  return useMutation<IAuthResponse<IAccount>, Error, string>({
    mutationFn: (id) => approveAgent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
  });
};

export const useGetAllUsers = () => {
  return useQuery<IAuthResponse<IAdminUsersResponseData>, Error>({
    queryKey: ["admin-users"],
    queryFn: getAllUsers,
  });
};

export const useGetUser = (userID: string) => {
  return useQuery<IAuthResponse<IAccount>, Error>({
    queryKey: ["admin-user", userID],
    queryFn: () => getUser(userID),
    enabled: !!userID,
  });
};

export const useGetTotalBalance = () => {
  return useQuery<IAuthResponse<{ totalBalance: number }>, Error>({
    queryKey: ["total-balance"],
    queryFn: getTotalBalance,
  });
};

export const useGetTotalUserBalance = () => {
  return useQuery<IAuthResponse<{ totalUserBalance: number }>, Error>({
    queryKey: ["total-user-balance"],
    queryFn: getTotalUserBalance,
  });
};

export const useGetTotalAgentBalance = () => {
  return useQuery<IAuthResponse<{ totalAgentBalance: number }>, Error>({
    queryKey: ["total-agent-balance"],
    queryFn: getTotalAgentBalance,
  });
};

export const useGetHistory = (userID: string) => {
  return useQuery<IAuthResponse<ITransaction[]>, Error>({
    queryKey: ["history", userID],
    queryFn: () => getHistory(userID),
    enabled: !!userID,
  });
};
