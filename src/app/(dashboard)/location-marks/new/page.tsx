"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCookie, type UserProfile } from "@/utils/auth";
import { useUser } from "@/provider/userProvider";
import Link from "next/link";

export default function NewLocationPage() {
  const router = useRouter();
  const { user: currentUser } = useUser();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      if (currentUser?.scope !== "admin") return;

      const token = getCookie("token");
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (res.ok) {
          const data = await res.json();
          setUsers(data.data || []);
        }
      } catch {
        console.warn("Failed to fetch users");
      }
    };
    fetchUsers();
  }, [currentUser]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const payload = {
      title: formData.get("title") as string,
      description: (formData.get("description") as string) || null,
      latitude: parseFloat(formData.get("latitude") as string),
      longitude: parseFloat(formData.get("longitude") as string),
    };

    const targetUserId = formData.get("user_id") as string;
    let url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/locations/`;
    if (targetUserId) {
      url += `?id=${targetUserId}`;
    }

    try {
      const token = getCookie("token");
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to create location.");
      }

      router.push("/location-marks");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create location");
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 w-full max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <h1 className="text-2xl font-normal text-sidebar">Add New Location</h1>
        <Link
          href="/location-marks"
          className="border border-[#2271b1] text-[#2271b1] hover:bg-[#f6f7f7] px-3 py-1 text-[13px] rounded-sm transition-colors"
        >
          Back to list
        </Link>
      </div>

      {error && (
        <div className="text-[13px] text-destructive bg-destructive/10 p-3 border-l-4 border-destructive mb-4 shadow-sm">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="flex flex-col md:flex-row gap-6 items-start"
      >
        <div className="flex-1 flex flex-col gap-4 w-full">
          <input
            type="text"
            name="title"
            placeholder="Add title"
            required
            className="w-full border border-[#8c8f94] px-4 py-3 text-xl rounded-sm focus:outline-none focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1] bg-white shadow-sm"
          />
          <textarea
            name="description"
            placeholder="Add a description..."
            rows={10}
            className="w-full border border-[#8c8f94] px-4 py-3 text-[14px] rounded-sm focus:outline-none focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1] bg-white shadow-sm resize-y"
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-semibold text-sidebar-muted mb-1">
                Latitude
              </label>
              <input
                type="number"
                step="any"
                name="latitude"
                required
                className="w-full border border-[#8c8f94] px-3 py-2 text-[14px] rounded-sm focus:outline-none focus:border-[#2271b1] bg-white shadow-sm"
              />
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-sidebar-muted mb-1">
                Longitude
              </label>
              <input
                type="number"
                step="any"
                name="longitude"
                required
                className="w-full border border-[#8c8f94] px-3 py-2 text-[14px] rounded-sm focus:outline-none focus:border-[#2271b1] bg-white shadow-sm"
              />
            </div>
          </div>
        </div>

        <div className="w-full md:w-72 flex flex-col gap-4">
          <div className="bg-white border border-sidebar-foreground shadow-sm rounded-sm">
            <div className="border-b border-sidebar-foreground px-4 py-3 bg-[#f6f7f7]">
              <h2 className="text-[14px] font-semibold text-sidebar">
                Publish
              </h2>
            </div>
            <div className="p-4 bg-white flex items-center justify-end">
              <button
                type="submit"
                disabled={loading}
                className="bg-[#2271b1] text-white px-4 py-1.5 text-[13px] font-medium rounded-sm hover:bg-[#135e96] transition-colors disabled:opacity-70"
              >
                {loading ? "Saving..." : "Publish"}
              </button>
            </div>
          </div>

          {currentUser?.scope === "admin" && (
            <div className="bg-white border border-sidebar-foreground shadow-sm rounded-sm">
              <div className="border-b border-sidebar-foreground px-4 py-3 bg-[#f6f7f7]">
                <h2 className="text-[14px] font-semibold text-sidebar">Author</h2>
              </div>
              <div className="p-4 bg-white">
                <select
                  name="user_id"
                  className="w-full border border-[#8c8f94] px-2 py-1.5 text-[13px] rounded-sm focus:outline-none focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1] bg-white shadow-sm"
                >
                  <option value="">{currentUser.name} (Me)</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.username} ({u.email})
                    </option>
                  ))}
                </select>
                <p className="text-xs text-neutral-500 mt-2">
                  Select an owner for this location. Defaults to you.
                </p>
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}