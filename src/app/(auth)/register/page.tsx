import type { Metadata } from "next";
import { AuthForm } from "@/components/AuthForm";

export const metadata: Metadata = {
  title: "Register",
};

const RegisterPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950">
      <div className="bg-neutral-900 p-8 rounded-lg shadow-md">
        <h1 className="font-semibold mb-4">Register</h1>
        <AuthForm isLogin={false} />
      </div>
    </div>
  );
};

export default RegisterPage;
