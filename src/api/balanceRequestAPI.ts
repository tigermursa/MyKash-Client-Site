import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const BASE_URL_FROM_ENV = import.meta.env.VITE_BASE_URL;
const BASE_URL = `${BASE_URL_FROM_ENV}/api/v2/balance-request`;

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

// Interfaces for balance requests and related transaction
export interface IBalanceRequest {
  requestId: string;
  userId: string;
  amount: number;
  status: "pending" | "approved" | "rejected";
  createdAt?: string;
  updatedAt?: string;
}

export interface ITransaction {
  transactionId: string;
  fromAccount?: { userID: string; name: string } | null;
  toAccount?: { userID: string; name: string } | null;
  amount: number;
  fee: number;
  transactionType: "sendMoney" | "cashIn" | "cashOut" | "balanceRequest";
  createdAt: string;
  updatedAt: string;
}

export interface IAuthResponse<T> {
  isActive: boolean;
  success: boolean;
  message: string;
  data: T;
}

// API functions

/**
 * Creates a new balance recharge request.
 */
export const createBalanceRequest = (
  userId: string,
  amount: number
): Promise<IAuthResponse<IBalanceRequest>> =>
  apiRequest<IAuthResponse<IBalanceRequest>>("/create", "POST", {
    userId,
    amount,
  });

/**
 * Approves a pending balance request.
 */
export const approveBalanceRequest = (
  requestId: string
): Promise<
  IAuthResponse<{ transaction: ITransaction; balanceRequest: IBalanceRequest }>
> =>
  apiRequest<
    IAuthResponse<{
      transaction: ITransaction;
      balanceRequest: IBalanceRequest;
    }>
  >("/approve", "POST", { requestId });

/**
 * Retrieves all pending balance requests.
 */
export const getPendingBalanceRequests = (): Promise<
  IAuthResponse<IBalanceRequest[]>
> => apiRequest<IAuthResponse<IBalanceRequest[]>>("/pending", "GET");

// Custom hooks

/**
 * Hook to create a balance recharge request.
 */
export const useCreateBalanceRequest = () => {
  const queryClient = useQueryClient();
  return useMutation<
    IAuthResponse<IBalanceRequest>,
    Error,
    { userId: string; amount: number }
  >({
    mutationFn: ({ userId, amount }) => createBalanceRequest(userId, amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["balance-requests-pending"] });
    },
  });
};

/**
 * Hook to approve a balance request.
 */
export const useApproveBalanceRequest = () => {
  const queryClient = useQueryClient();
  return useMutation<
    IAuthResponse<{
      transaction: ITransaction;
      balanceRequest: IBalanceRequest;
    }>,
    Error,
    string
  >({
    mutationFn: (requestId) => approveBalanceRequest(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["balance-requests-pending"] });
    },
  });
};

/**
 * Hook to fetch all pending balance requests.
 */
export const useGetPendingBalanceRequests = () => {
  return useQuery<IAuthResponse<IBalanceRequest[]>, Error>({
    queryKey: ["balance-requests-pending"],
    queryFn: getPendingBalanceRequests,
  });
};
