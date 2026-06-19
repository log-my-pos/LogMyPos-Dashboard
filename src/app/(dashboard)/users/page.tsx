"use client";

import { useEffect, useState } from "react";
import { getCookie, type UserProfile } from "@/utils/auth";

export default function UsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = getCookie("token");
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch user list. Ensure you have admin permissions.");
        }

        const data = await res.json();
        setUsers(data.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="p-4 md:p-8 w-full max-w-7xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <h1 className="text-2xl font-normal text-sidebar">Users</h1>
      </div>

      {loading ? (
        <div className="text-[13px] text-neutral-500 animate-pulse">Loading users...</div>
      ) : error ? (
        <div className="text-[13px] text-destructive bg-destructive/10 p-3 border-l-4 border-destructive mb-4 shadow-sm">
          {error}
        </div>
      ) : (
        <div className="bg-white border border-sidebar-foreground shadow-sm">
          <table className="w-full text-left text-[13px] border-collapse">
            <thead>
              <tr className="border-b border-sidebar-foreground bg-[#f6f7f7]">
                <th className="py-2 px-4 font-semibold text-sidebar-muted">Username</th>
                <th className="py-2 px-4 font-semibold text-sidebar-muted">Email</th>
                <th className="py-2 px-4 font-semibold text-sidebar-muted">Role</th>
                <th className="py-2 px-4 font-semibold text-sidebar-muted">User ID</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr 
                  key={user.id} 
                  className={`border-b border-sidebar-foreground hover:bg-[#f6f7f7] transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-[#f9f9f9]'}`}
                >
                  <td className="py-3 px-4 font-bold text-[#2271b1]">{user.username}</td>
                  <td className="py-3 px-4 text-sidebar-muted">{user.email}</td>
                  <td className="py-3 px-4">
                    <span className="capitalize">{user.role}</span>
                  </td>
                  <td className="py-3 px-4 text-[#8c8f94] font-mono text-xs">{user.id}</td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-4 px-4 text-center text-neutral-500">No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}