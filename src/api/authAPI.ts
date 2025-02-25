import { useMutation, useQueryClient } from "@tanstack/react-query";

const BASE_URL_FROM_ENV = import.meta.env.VITE_BASE_URL;

const BASE_URL = `${BASE_URL_FROM_ENV}/api/v1/account`;

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
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IAuthResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const registerAccount = (
  data: Partial<IAccount>
): Promise<IAuthResponse<IAccount>> =>
  apiRequest<IAuthResponse<IAccount>>("/register", "POST", data);

export const loginAccount = (
  identifier: string,
  pin: string
): Promise<IAuthResponse<IAccount>> =>
  apiRequest<IAuthResponse<IAccount>>("/login", "POST", { identifier, pin });

export const logoutAccount = (): Promise<IAuthResponse<null>> =>
  apiRequest<IAuthResponse<null>>("/logout", "GET");

export const useRegisterAccount = () => {
  const queryClient = useQueryClient();
  return useMutation<IAuthResponse<IAccount>, Error, Partial<IAccount>>({
    mutationFn: registerAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["account"] });
    },
  });
};

export const useLoginAccount = () => {
  const queryClient = useQueryClient();
  return useMutation<
    IAuthResponse<IAccount>,
    Error,
    { identifier: string; pin: string }
  >({
    mutationFn: ({ identifier, pin }) => loginAccount(identifier, pin),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["account"] });
    },
  });
};

export const useLogoutAccount = () => {
  const queryClient = useQueryClient();
  return useMutation<IAuthResponse<null>, Error, void>({
    mutationFn: logoutAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["account"] });
    },
  });
};
