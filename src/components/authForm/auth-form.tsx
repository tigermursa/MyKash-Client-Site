import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import {
  useRegisterAccount,
  useLoginAccount,
  IAccount,
} from "../../api/authAPI";
import { useGetUser } from "../../api/adminAPI";

interface AuthFormProps {
  type: "sign-in" | "sign-up";
}

interface RegisterFormData
  extends Omit<
    IAccount,
    | "userID"
    | "balance"
    | "isBlocked"
    | "isDelete"
    | "isActive"
    | "favorites"
    | "createdAt"
    | "updatedAt"
  > {
  pin: string;
}

interface LoginFormData {
  identifier: string;
  pin: string;
}

export const AuthForm = ({ type }: AuthFormProps) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const isRegister = type === "sign-up";

  const registerMethods = useForm<RegisterFormData>({ mode: "onBlur" });
  const loginMethods = useForm<LoginFormData>({ mode: "onBlur" });
  const { mutate: registerUser, isPending: isRegistering } =
    useRegisterAccount();
  const { mutate: loginUser, isPending: isLoggingIn } = useLoginAccount();

  // For agents: we'll use this state to trigger the useGetUser hook
  const [agentId, setAgentId] = useState<string | null>(null);

  // This hook will only run when agentId is set (non-null)
  const { data: agentData, isLoading: agentLoading } = useGetUser(
    agentId || ""
  );

  // Once agent data is available, check active status and navigate accordingly.
  useEffect(() => {
    if (agentId && agentData) {
      if (agentData.data.isActive) {
        toast.success("Login successful!");
        navigate("/home");
      } else {
        toast.info("Your account is pending approval.");
        navigate("/approval");
      }
    }
  }, [agentData, agentId, navigate]);

  const onSubmitRegister: SubmitHandler<RegisterFormData> = (data) => {
    registerUser(data, {
      onSuccess: (response) => {
        localStorage.setItem("userIdmykash", response.data.userID);
        toast.success("Registration successful!");
        // For agents navigate to approval, for users to home
        navigate(response.data.role === "user" ? "/home" : "/approval");
      },
      onError: (error: Error) => toast.error(error.message),
    });
  };

  const onSubmitLogin: SubmitHandler<LoginFormData> = (data) => {
    loginUser(
      { identifier: data.identifier, pin: data.pin },
      {
        onSuccess: (response) => {
          localStorage.setItem("userIdmykash", response.data.userID);
          if (response.data.role === "agent") {
            // Set the agent id to trigger useGetUser hook.
            // For now, we use a hardcoded value. Later, connect with your auth hook.
            setAgentId("U1740496558131");
          } else {
            toast.success("Login successful!");
            navigate("/home");
          }
        },
        onError: (error: Error) => toast.error(error.message),
      }
    );
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md mx-auto my-8">
      <h2 className="text-3xl font-bold mb-8 text-center text-[#cf1263]">
        {isRegister ? "Create Account" : "Welcome Back"}
      </h2>
      <form
        onSubmit={
          isRegister
            ? registerMethods.handleSubmit(onSubmitRegister)
            : loginMethods.handleSubmit(onSubmitLogin)
        }
        className="space-y-6"
      >
        {isRegister ? (
          <>
            {/* Row 1: Full Name & Mobile Number */}
            <div className="flex flex-col md:flex-row md:space-x-4">
              <div className="flex-1">
                <label className="block text-gray-700 mb-2">Full Name</label>
                <input
                  {...registerMethods.register("name", {
                    required: "Name is required",
                  })}
                  className="w-full h-12 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf1263] focus:border-transparent"
                />
                <div className="min-h-[1.5rem]">
                  {registerMethods.formState.errors.name && (
                    <span className="text-red-500 text-sm">
                      {registerMethods.formState.errors.name.message}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex-1 mt-4 md:mt-0">
                <label className="block text-gray-700 mb-2">
                  Mobile Number
                </label>
                <input
                  {...registerMethods.register("mobile", {
                    required: "Mobile is required",
                  })}
                  className="w-full h-12 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf1263] focus:border-transparent"
                />
                <div className="min-h-[1.5rem]">
                  {registerMethods.formState.errors.mobile && (
                    <span className="text-red-500 text-sm">
                      {registerMethods.formState.errors.mobile.message}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Row 2: Email Address & NID Number */}
            <div className="flex flex-col md:flex-row md:space-x-4">
              <div className="flex-1">
                <label className="block text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  {...registerMethods.register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Invalid email address",
                    },
                  })}
                  className="w-full h-12 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf1263] focus:border-transparent"
                />
                <div className="min-h-[1.5rem]">
                  {registerMethods.formState.errors.email && (
                    <span className="text-red-500 text-sm">
                      {registerMethods.formState.errors.email.message}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex-1 mt-4 md:mt-0">
                <label className="block text-gray-700 mb-2">NID Number</label>
                <input
                  {...registerMethods.register("nid", {
                    required: "NID is required",
                  })}
                  className="w-full h-12 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf1263] focus:border-transparent"
                />
                <div className="min-h-[1.5rem]">
                  {registerMethods.formState.errors.nid && (
                    <span className="text-red-500 text-sm">
                      {registerMethods.formState.errors.nid.message}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Row 3: Role */}
            <div>
              <label className="block text-gray-700 mb-2">Role</label>
              <select
                {...registerMethods.register("role", {
                  required: "Role is required",
                })}
                className="w-full h-12 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf1263] focus:border-transparent"
              >
                <option value="user">User</option>
                <option value="agent">Agent</option>
              </select>
              <div className="min-h-[1.5rem]"></div>
            </div>
          </>
        ) : (
          <div>
            <label className="block text-gray-700 mb-2">Mobile/Email</label>
            <input
              {...loginMethods.register("identifier", {
                required: "Identifier is required",
              })}
              className="w-full h-12 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf1263] focus:border-transparent"
            />
            <div className="min-h-[1.5rem]">
              {loginMethods.formState.errors.identifier && (
                <span className="text-red-500 text-sm">
                  {loginMethods.formState.errors.identifier.message}
                </span>
              )}
            </div>
          </div>
        )}

        {/* PIN Field */}
        <div>
          <label className="block text-gray-700 mb-2">PIN</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              {...(isRegister
                ? registerMethods.register("pin", {
                    required: "PIN is required",
                    minLength: { value: 5, message: "PIN must be 5 digits" },
                    maxLength: { value: 5, message: "PIN must be 5 digits" },
                  })
                : loginMethods.register("pin", {
                    required: "PIN is required",
                    minLength: { value: 5, message: "PIN must be 5 digits" },
                    maxLength: { value: 5, message: "PIN must be 5 digits" },
                  }))}
              className="w-full h-12 px-3 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf1263] focus:border-transparent"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 px-3 flex items-center"
            >
              {showPassword ? (
                <FiEyeOff className="text-gray-500" />
              ) : (
                <FiEye className="text-gray-500" />
              )}
            </button>
          </div>
          <div className="min-h-[1.5rem]">
            {isRegister
              ? registerMethods.formState.errors.pin && (
                  <span className="text-red-500 text-sm">
                    {registerMethods.formState.errors.pin.message}
                  </span>
                )
              : loginMethods.formState.errors.pin && (
                  <span className="text-red-500 text-sm">
                    {loginMethods.formState.errors.pin.message}
                  </span>
                )}
          </div>
        </div>

        <button
          type="submit"
          disabled={
            isRegister
              ? isRegistering
              : isLoggingIn || (agentLoading && agentId !== null)
          }
          className="w-full h-12 bg-[#cf1263] text-white rounded-lg hover:bg-[#b01050] transition-colors disabled:opacity-50 flex items-center justify-center"
        >
          {isRegister
            ? isRegistering
              ? "Processing..."
              : "Register"
            : isLoggingIn || (agentLoading && agentId !== null)
            ? "Processing..."
            : "Login"}
        </button>
      </form>

      <div className="mt-4 text-center">
        {isRegister ? (
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-bold text-[#cf1263] hover:underline"
            >
              Login
            </Link>
          </p>
        ) : (
          <p className="text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-bold text-[#cf1263] hover:underline"
            >
              Register
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};
