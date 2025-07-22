"use client";
import AuthForm from "@/components/AuthForm";
import HabitDashboard from "@/components/HabitDashboard";
import { useEffect, useState } from "react";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authType, setAuthType] = useState<"signin" | "signup">("signin");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setIsAuthenticated(true);
  }, []);
  const handleAuth = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/auth/${authType}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Authentication failed");
      }
      localStorage.setItem("token", data.token);
      setIsAuthenticated(true);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  const toggleAuthMode = () => {
    setAuthType(authType === "signin" ? "signup" : "signin");
    setError(null);
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    setError(null);
    setIsAuthenticated(false);
  };

  if (isAuthenticated) return <HabitDashboard onLogout={handleLogout} />;
  return (
    <main className="w-full min-h-screen bg-gray-950 flex flex-col justify-center items-center">
      <AuthForm
        authType={authType}
        onSubmit={handleAuth}
        loading={loading}
        error={error}
      />
      <div className="text-center mt-4">
        <button
          onClick={toggleAuthMode}
          className="text-indigo-600 hover:text-indigo-500 cursor-pointer"
        >
          {authType === "signin"
            ? "Don't have an account? Sign up"
            : "Already have an account? Sign in"}
        </button>
      </div>
    </main>
  );
}
