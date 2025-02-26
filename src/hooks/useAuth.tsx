import { useGetUser } from "../api/adminAPI";

interface User {
  _id: string;
  username: string;
  email: string;
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
    ? { _id: data.data._id, username: data.data.name, email: data.data.email }
    : null;
  return { user, error: error ?? null, isLoading, refetch };
};

export default useAuth;
