import { AuthForm } from "./auth-form";

export default function SignIn() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4  z-10">
      <div className="z-20">
        <AuthForm type="sign-in" />
      </div>
    </div>
  );
}
