import { useGetUser } from "../api/adminAPI";

interface User {
  _id: string;
  username: string;
  balance: number;
  mobile: string;
  userID: string;
  role: string;
}

interface UseAuthReturn {
  user: User | null;
  error: Error | null;
  isLoading: boolean;
  refetch: () => void;
}

const useAuth = (): UseAuthReturn => {
  const userId = localStorage.getItem("userIdmykash");
  const { data, error, isLoading, refetch } = useGetUser(userId ?? "");
  const user: User | null = data?.data
    ? {
        _id: data.data._id,
        username: data.data.name,
        balance: data.data.balance,
        mobile: data.data.mobile,
        userID: data.data.userID,
        role: data.data.role,
      }
    : null;
  return { user, error: error ?? null, isLoading, refetch };
};

export default useAuth;
