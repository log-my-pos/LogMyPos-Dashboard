"use client";

export default function LoginPage() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Logging in...");
  };

  return (
    <div className="p-4 md:p-6 w-full min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="w-full max-w-[320px] bg-white border border-sidebar-foreground p-0 shadow-sm">
        <div className="border-b border-sidebar-foreground px-4 py-2">
          <h2 className="text-[14px] font-semibold text-sidebar">Log In</h2>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4.5">
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
              />
            </div>

            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="remember"
                  name="remember"
                  className="w-4 h-4 border-sidebar-foreground text-[#2271b1] focus:ring-[#2271b1] bg-white"
                />
                <label
                  htmlFor="remember"
                  className="text-[13px] text-sidebar-foreground"
                >
                  Remember Me
                </label>
              </div>

              <button
                type="submit"
                className="bg-[#2271b1] text-white px-4 py-1.5 text-[13px] font-medium hover:bg-[#135e96] transition-colors border border-[#2271b1]"
              >
                Log In
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
