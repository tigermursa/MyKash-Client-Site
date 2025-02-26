import { AuthForm } from "./auth-form";

export default function SignUp() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4  ">
      <div className="z-20">
        <AuthForm type="sign-up" />
      </div>
    </div>
  );
}
