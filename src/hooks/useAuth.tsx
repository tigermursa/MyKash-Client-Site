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
  // Get userId from localStorage; note that this may return null
  const userId: string | null = localStorage.getItem("userIdmykash");

  // Pass a fallback empty string if userId is null; the hook's enabled flag will prevent unnecessary queries
  const { data, error, isLoading, refetch } = useGetUser(userId ?? "");

  // Extract only the necessary fields from the API response
  const user: User | null = data?.data
    ? {
        _id: data.data._id,
        username: data.data.name,
        email: data.data.email,
      }
    : null;

  return { user, error: error ?? null, isLoading, refetch };
};

export default useAuth;
