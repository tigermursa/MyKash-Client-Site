import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useRegisterAccount, useLoginAccount } from "../../api/authAPI";
import { IAccount } from "../../api/authAPI";

interface AuthFormProps {
  type: "sign-in" | "sign-up";
}

interface RegisterFormData
  extends Omit<
    IAccount,
    "userID" | "balance" | "isBlocked" | "isDelete" | "isActive" | "favorites"
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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData | LoginFormData>({
    mode: "onBlur",
  });

  const { mutate: registerUser, isPending: isRegistering } =
    useRegisterAccount();
  const { mutate: loginUser, isPending: isLoggingIn } = useLoginAccount();

  const onSubmit: SubmitHandler<RegisterFormData | LoginFormData> = (data) => {
    if (isRegister) {
      registerUser(data as RegisterFormData, {
        onSuccess: (response) => {
          localStorage.setItem("userIdmykash", response.data._id);
          toast.success("Registration successful!");
          navigate(response.data.role === "user" ? "/home" : "/approval");
        },
        onError: (error) => toast.error(error.message),
      });
    } else {
      loginUser(
        { identifier: data.identifier, pin: data.pin },
        {
          onSuccess: (response) => {
            localStorage.setItem("userIdmykash", response.data._id);
            toast.success("Login successful!");
            navigate(response.data.role === "user" ? "/home" : "/approval");
          },
          onError: (error) => toast.error(error.message),
        }
      );
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
      <h2 className="text-3xl font-bold mb-8 text-center text-[#cf1263]">
        {isRegister ? "Create Account" : "Welcome Back"}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {isRegister && (
          <>
            <div>
              <label className="block text-gray-700 mb-2">Full Name</label>
              <input
                {...register("name", { required: "Name is required" })}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#cf1263] focus:border-transparent"
              />
              {errors.name && (
                <span className="text-red-500 text-sm">
                  {errors.name.message}
                </span>
              )}
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Mobile Number</label>
              <input
                {...register("mobile", {
                  required: "Mobile is required",
                })}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#cf1263] focus:border-transparent"
              />
              {errors.mobile && (
                <span className="text-red-500 text-sm">
                  {errors.mobile.message}
                </span>
              )}
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Invalid email address",
                  },
                })}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#cf1263] focus:border-transparent"
              />
              {errors.email && (
                <span className="text-red-500 text-sm">
                  {errors.email.message}
                </span>
              )}
            </div>

            <div>
              <label className="block text-gray-700 mb-2">NID Number</label>
              <input
                {...register("nid", { required: "NID is required" })}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#cf1263] focus:border-transparent"
              />
              {errors.nid && (
                <span className="text-red-500 text-sm">
                  {errors.nid.message}
                </span>
              )}
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Role</label>
              <select
                {...register("role", { required: "Role is required" })}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#cf1263] focus:border-transparent"
              >
                <option value="user">User</option>
                <option value="agent">Agent</option>
              </select>
            </div>
          </>
        )}

        {!isRegister && (
          <div>
            <label className="block text-gray-700 mb-2">Mobile/Email</label>
            <input
              {...register("identifier", {
                required: "Identifier is required",
              })}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#cf1263] focus:border-transparent"
            />
            {errors.identifier && (
              <span className="text-red-500 text-sm">
                {errors.identifier.message}
              </span>
            )}
          </div>
        )}

        <div>
          <label className="block text-gray-700 mb-2">PIN</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              {...register("pin", {
                required: "PIN is required",
                minLength: {
                  value: 5,
                  message: "PIN must be 5 digits",
                },
                maxLength: {
                  value: 5,
                  message: "PIN must be 5 digits",
                },
              })}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#cf1263] focus:border-transparent pr-12"
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
          {errors.pin && (
            <span className="text-red-500 text-sm">{errors.pin.message}</span>
          )}
        </div>

        <button
          type="submit"
          disabled={isRegistering || isLoggingIn}
          className="w-full bg-[#cf1263] text-white p-3 rounded-lg hover:bg-[#b01050] transition-colors disabled:opacity-50"
        >
          {isRegistering || isLoggingIn
            ? "Processing..."
            : isRegister
            ? "Register"
            : "Login"}
        </button>
      </form>
    </div>
  );
};
