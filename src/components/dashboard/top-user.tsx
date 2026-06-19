"use client";

import { useRouter } from "next/navigation";
import { useUser } from "@/provider/userProvider";

export default function TopUser() {
  const { user, logout } = useUser();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (!user) {
    return (
      <div className="px-2 flex items-center h-8 text-[13px] text-neutral-400 select-none animate-pulse">
        Loading profile...
      </div>
    );
  }

  const displayName = user.name;

  return (
    <div className="group/top-user relative">
      <div className="px-2 flex items-center gap-1.5 h-8 text-[13px] text-white group-hover/top-user:bg-sidebar-foreground/10 group-hover/top-user:text-[#72aee6] transition-colors">
        Howdy, {displayName}
      </div>

      {/* Dropdown Menu */}
      <div className="absolute right-0 bg-[#2d3337] p-2 hidden group-hover/top-user:flex flex-col min-w-25 border border-neutral-700 shadow-md z-50">
        <button
          onClick={handleLogout}
          className="text-left text-[13px] text-white hover:text-[#72aee6] w-full py-1 px-2 transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
