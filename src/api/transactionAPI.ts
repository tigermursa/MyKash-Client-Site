import { useMutation, useQueryClient } from "@tanstack/react-query";

const BASE_URL_FROM_ENV = import.meta.env.VITE_BASE_URL;
const BASE_URL = `${BASE_URL_FROM_ENV}/api/v2/transaction`;

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

export type TransactionType = "sendMoney" | "cashIn" | "cashOut";

export interface ITransaction {
  transactionId: string;
  fromAccount?: string;
  toAccount?: string;
  amount: number;
  fee: number;
  transactionType: TransactionType;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ITransactionResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface SendMoneyPayload {
  senderId: string;
  receiverId: string;
  amount: number;
  isFavoriteTransfer?: boolean;
}

export interface CashInPayload {
  agentId: string;
  userId: string;
  amount: number;
  agentPin: string;
}

export interface CashOutPayload {
  userId: string;
  agentId: string;
  amount: number;
  userPin: string;
}

export const sendMoney = (
  payload: SendMoneyPayload
): Promise<ITransactionResponse<ITransaction>> =>
  apiRequest<ITransactionResponse<ITransaction>>(
    "/send-money",
    "POST",
    payload
  );

export const cashIn = (
  payload: CashInPayload
): Promise<ITransactionResponse<ITransaction>> =>
  apiRequest<ITransactionResponse<ITransaction>>("/cash-in", "POST", payload);

export const cashOut = (
  payload: CashOutPayload
): Promise<ITransactionResponse<ITransaction>> =>
  apiRequest<ITransactionResponse<ITransaction>>("/cash-out", "POST", payload);

export const useSendMoney = () => {
  const queryClient = useQueryClient();
  return useMutation<
    ITransactionResponse<ITransaction>,
    Error,
    SendMoneyPayload
  >({
    mutationFn: sendMoney,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
};

export const useCashIn = () => {
  const queryClient = useQueryClient();
  return useMutation<ITransactionResponse<ITransaction>, Error, CashInPayload>({
    mutationFn: cashIn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
};

export const useCashOut = () => {
  const queryClient = useQueryClient();
  return useMutation<ITransactionResponse<ITransaction>, Error, CashOutPayload>(
    {
      mutationFn: cashOut,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["transactions"] });
      },
    }
  );
};
