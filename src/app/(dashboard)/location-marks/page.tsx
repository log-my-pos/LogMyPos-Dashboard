"use client";

import { useEffect, useState } from "react";
import { getCookie, type UserProfile } from "@/utils/auth";
import Link from "next/link";

interface LocationMark {
  id: string;
  title: string;
  description: string | null;
  latitude: number;
  longitude: number;
  user_id: string;
  created_at: string;
}

export default function LocationMarksPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [locations, setLocations] = useState<LocationMark[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const token = getCookie("token");
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setUsers(data.data || []);
        }
      } catch {
        console.warn("Failed to fetch users for dropdown");
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchLocations = async () => {
      setLoading(true);
      setError(null);
      const token = getCookie("token");
      try {
        let url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/locations/`;
        if (selectedFilter === "all") {
          url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/locations/all`;
        } else if (selectedFilter !== "") {
          url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/locations/?id=${selectedFilter}`;
        }

        const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) throw new Error(`Failed to fetch locations (Status: ${res.status})`);
        
        const data = await res.json();
        setLocations(data.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unexpected error occurred");
        setLocations([]);
      } finally {
        setLoading(false);
      }
    };
    fetchLocations();
  }, [selectedFilter]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to move this to the trash?")) return;
    
    try {
      const token = getCookie("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/locations/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to delete location.");
      setLocations((prev) => prev.filter((loc) => loc.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Deletion failed");
    }
  };

  return (
    <div className="p-4 md:p-8 w-full max-w-7xl mx-auto">
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <h1 className="text-2xl font-normal text-sidebar">Location Marks</h1>
        <Link 
          href="/location-marks/new" 
          className="border border-[#2271b1] text-[#2271b1] hover:bg-[#f6f7f7] px-3 py-1 text-[13px] rounded-sm transition-colors"
        >
          Add New
        </Link>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <select
          value={selectedFilter}
          onChange={(e) => setSelectedFilter(e.target.value)}
          className="border border-[#8c8f94] px-2 py-1 text-[13px] rounded-sm focus:outline-none focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1] bg-white max-w-xs shadow-sm"
        >
          <option value="all">All Global Locations (Admin)</option>
          <option value="">My Locations Only</option>
          <optgroup label="Specific Users">
            {users.map((u) => (
              <option key={u.id} value={u.id}>{u.username} ({u.email})</option>
            ))}
          </optgroup>
        </select>
        <button className="border border-[#8c8f94] px-3 py-1 text-[13px] bg-[#f6f7f7] hover:bg-white rounded-sm text-sidebar-muted shadow-sm">
          Filter
        </button>
      </div>

      {error && (
        <div className="text-[13px] text-destructive bg-destructive/10 p-3 border-l-4 border-destructive mb-4 shadow-sm">
          {error}
        </div>
      )}

      <div className="bg-white border border-sidebar-foreground shadow-sm relative">
        {loading && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
            <span className="text-sm text-neutral-500 animate-pulse">Loading...</span>
          </div>
        )}
        <table className="w-full text-left text-[13px] border-collapse">
          <thead>
            <tr className="border-b border-sidebar-foreground bg-[#f6f7f7]">
              <th className="py-2 px-4 font-semibold text-sidebar-muted">Title</th>
              <th className="py-2 px-4 font-semibold text-sidebar-muted">Coordinates</th>
              <th className="py-2 px-4 font-semibold text-sidebar-muted">Date</th>
            </tr>
          </thead>
          <tbody>
            {locations.map((loc, index) => (
              <tr 
                key={loc.id} 
                className={`group border-b border-sidebar-foreground transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-[#f9f9f9]'}`}
              >
                <td className="py-3 px-4 w-1/2 align-top">
                  <div className="font-bold text-[#2271b1] text-[14px] mb-1">{loc.title}</div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 text-[12px]">
                    <Link href={`/location-marks/edit/${loc.id}`} className="text-[#2271b1] hover:underline">Edit</Link>
                    <span className="text-neutral-300">|</span>
                    <button onClick={() => handleDelete(loc.id)} className="text-[#b32d2e] hover:underline">Trash</button>
                  </div>
                </td>
                <td className="py-3 px-4 font-mono text-xs text-[#50575e] align-top">
                  {loc.latitude.toFixed(4)}, {loc.longitude.toFixed(4)}
                </td>
                <td className="py-3 px-4 text-[#50575e] align-top">
                  {new Date(loc.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {locations.length === 0 && !loading && (
              <tr>
                <td colSpan={3} className="py-4 px-4 text-center text-neutral-500">No locations found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}