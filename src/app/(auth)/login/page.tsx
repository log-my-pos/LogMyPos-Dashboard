"use client";

import { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { loginRequest, setAuthCookie, decodeToken, verifyTokenRequest } from "@/utils/auth";
import { useUser } from "@/provider/userProvider";

export default function LoginPage() {
  const router = useRouter();
  const { refreshUser } = useUser();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const identifier = formData.get("identifier") as string;
    const password = formData.get("password") as string;
    const remember = formData.get("remember") === "on";

    try {
      const token = await loginRequest({ identifier, password });

      if (token) {
        const decoded = decodeToken(token);
        
        if (!decoded || decoded.scope !== "admin") {
          setError("Access denied: You do not have administrator permissions.");
          setIsLoading(false);
          return;
        }

        const isCrypticallyValid = await verifyTokenRequest(token);
        if (!isCrypticallyValid) {
          setError("Authentication failed: Unauthorised or invalid token format signature.");
          setIsLoading(false);
          return;
        }

        setAuthCookie(token, remember);

        await refreshUser();

        router.push("./");
      } else {
        setError("Invalid username, email, or password.");
      }
    } catch (err) {
      console.error("Login submit intercept error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6 w-full min-h-screen flex flex-col items-center justify-center bg-background">
      <Card className="max-w-[320px] w-full">
        <CardHeader className="text-xl font-bold">Log In</CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4.5">
            {error && (
              <div className="text-sm font-medium text-destructive bg-destructive/10 p-2.5 border border-destructive/20 text-center">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label
                className="text-[13px] font-semibold text-sidebar"
                htmlFor="identifier"
              >
                Username or Email Address
              </label>
              <input
                type="text"
                id="identifier"
                name="identifier"
                className="w-full border border-sidebar-foreground px-3 py-1.5 text-[14px] focus:outline-none focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1] transition-shadow bg-[#f6f7f7]"
                required
                disabled={isLoading}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                className="text-[13px] font-semibold text-sidebar"
                htmlFor="password"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="w-full border border-sidebar-foreground px-3 py-1.5 text-[14px] focus:outline-none focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1] transition-shadow bg-[#f6f7f7]"
                required
                disabled={isLoading}
              />
            </div>

            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="remember"
                  name="remember"
                  className="w-4 h-4 border-sidebar-foreground text-[#2271b1] focus:ring-[#2271b1] bg-white cursor-pointer"
                  disabled={isLoading}
                />
                <label
                  htmlFor="remember"
                  className="text-[13px] text-sidebar-foreground cursor-pointer select-none"
                >
                  Remember Me
                </label>
              </div>

              <button
                type="submit"
                className="bg-[#2271b1] text-white px-4 py-1.5 text-[13px] font-medium hover:bg-[#135e96] transition-colors border border-[#2271b1] disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Log In"}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}