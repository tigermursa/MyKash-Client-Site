import { AuthForm } from "./auth-form";

export default function SignIn() {
  return (
    <div className="min-h-screen flex">
      {/* Left-side image only visible on large screens */}
      <div className="hidden lg:block lg:w-1/2">
        <img
          src="https://res.cloudinary.com/dvwmhlyd6/image/upload/f_auto,q_auto/v1740628950/adef3d98-6e24-4353-bc0d-dbb3cfeb9aff_njffuh.png"
          alt="Sign In Background"
          className="object-cover w-full h-full"
        />
      </div>
      {/* Right-side form */}
      <div className="flex items-center justify-center w-full lg:w-1/2 p-4">
        <div className="z-20">
          <AuthForm type="sign-in" />
        </div>
      </div>
    </div>
  );
}
