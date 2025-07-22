"use client";

import React, { useState } from "react";

interface AuthFormProps {
  authType: "signin" | "signup";
  onSubmit: (email: string, password: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}
const AuthForm = ({ authType, onSubmit, loading, error }: AuthFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(email, password);
  };
  return (
    <div className="max-w-xl w-full p-8">
      <div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-amber-200 mb-10">
          {authType === "signin"
            ? "Sign in to your account"
            : "Create your account"}
        </h2>
      </div>

      <form onSubmit={handleSubmit}>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-5">
            {error}
          </div>
        )}
        <div className="flex flex-col gap-5 mb-5">
          <label htmlFor="email" className="text-2xl font-bold">
            Email address
          </label>
          <input
            name="email"
            type="email"
            id="email"
            autoComplete="email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            className="relative block w-full p-3 border-2 border-gray-300 placeholder-gray-500 text-amber-100 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter your email...."
          />
        </div>

        <div className="flex flex-col gap-5 mb-5">
          <label htmlFor="email" className="text-2xl font-bold">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="relative block w-full p-3 border-2 border-gray-300 placeholder-gray-500 text-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 mb-5"
            placeholder="Enter your password...."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="text-lg group relative w-full flex justify-center p-3 border border-transparent rounded-md text-black bg-amber-300 hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer font-bold uppercase"
        >
          {loading
            ? "Loading..."
            : authType === "signin"
            ? "Sign in"
            : "Sign up"}
        </button>
      </form>
    </div>
  );
};

export default AuthForm;
