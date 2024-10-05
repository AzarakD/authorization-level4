"use client";

import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import clsx from "clsx";

import { IAuthFormData } from "@/types";
import authService from "@/services/auth.service";
import styles from "./AuthForm.module.scss";

interface AuthFormProps {
  isLogin: boolean;
}

export const AuthForm: React.FC<AuthFormProps> = ({ isLogin }) => {
  const { register, handleSubmit, reset } = useForm<IAuthFormData>();

  const router = useRouter();

  const { mutate: mutateLogin, isPending: isLoginPending } = useMutation({
    mutationKey: ["login"],
    mutationFn: (data: IAuthFormData) => authService.login(data),
    onSuccess: () => {
      reset();
      router.push("/");
    },
  });

  const { mutate: mutateRegister, isPending: isRegisterPending } = useMutation({
    mutationKey: ["register"],
    mutationFn: (data: IAuthFormData) => authService.register(data),
    onSuccess: () => {
      reset();
      router.push("/");
    },
  });

  const onSubmit: SubmitHandler<IAuthFormData> = (data) => {
    isLogin ? mutateLogin(data) : mutateRegister(data);
  };

  const isPending = isLoginPending || isRegisterPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-sm mx-auto">
      <div className="mb-4">
        <label className="text-gray-600">
          Email
          <input
            type="email"
            placeholder="Enter email: "
            {...register("email", { required: true })}
            className={clsx(
              styles["input-field"],
              "w-full p-2 border rounded focus:outline-none focus:border-indigo-500"
            )}
          />
        </label>
      </div>

      <div className="mb-4">
        <label className="text-gray-600">
          Password
          <input
            type="password"
            placeholder="Enter password: "
            {...register("password", { required: true })}
            className={clsx(
              styles["input-field"],
              "w-full p-2 border rounded focus:outline-none focus:border-indigo-500"
            )}
          />
        </label>
      </div>

      <div className="mb-4">
        <button
          type="submit"
          className={clsx(
            styles["btn-primary"],
            isLogin ? "bg-indigo-500" : "bg-green-500",
            isPending ? "opacity-75 cursor-not-allowed" : ""
          )}
          disabled={isPending}
        >
          {isLogin ? "Login" : "Register"}
        </button>
      </div>
    </form>
  );
};
