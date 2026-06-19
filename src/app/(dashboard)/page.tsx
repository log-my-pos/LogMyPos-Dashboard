"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { useUser } from "@/provider/userProvider";
import { getCookie } from "@/utils/auth";
import Link from "next/link";
import { IconMapPin, IconUsers, IconPlus } from "@tabler/icons-react";

export default function DashboardPage() {
  const { user } = useUser();
  const [stats, setStats] = useState({ locations: 0, users: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;

      const token = getCookie("token");
      try {
        let locUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/locations/`;
        if (user.scope === "admin") {
          locUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/locations/all`;
        }

        const locRes = await fetch(locUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const locData = locRes.ok ? await locRes.json() : { data: [] };

        let usersCount = 0;
        const userRes = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        const userData = userRes.ok ? await userRes.json() : { data: [] };
        usersCount = userData.data?.length || 0;

        setStats({
          locations: locData.data?.length || 0,
          users: usersCount,
        });
      } catch (err) {
        console.error("Failed to load dashboard stats", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  return (
    <div className="p-4 md:p-8 w-full max-w-7xl mx-auto space-y-6">
      <div className="bg-white border border-sidebar-foreground shadow-sm p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-normal text-sidebar">
            Welcome to LogMyPos{user ? `, ${user.name}` : ""}!
          </h1>
          <p className="text-[13px] text-[#50575e] mt-1">
            We’ve assembled some links to get you started.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/location-marks/new"
            className="bg-[#2271b1] text-white px-4 py-2 text-[13px] font-medium rounded-sm hover:bg-[#135e96] transition-colors flex items-center gap-1.5"
          >
            <IconPlus size={16} />
            Add New Location
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="shadow-sm">
          <CardHeader>At a Glance</CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-4 text-[13px] text-neutral-500 animate-pulse">
                Loading stats...
              </div>
            ) : (
              <div className="p-4 flex flex-col gap-3">
                <Link
                  href="/location-marks"
                  className="flex items-center gap-2 text-[#2271b1] hover:underline text-[13px]"
                >
                  <IconMapPin size={18} className="text-[#8c8f94]" />
                  <span>
                    {stats.locations} Location Mark
                    {stats.locations !== 1 ? "s" : ""}
                  </span>
                </Link>

                {user?.scope === "admin" && (
                  <Link
                    href="/users"
                    className="flex items-center gap-2 text-[#2271b1] hover:underline text-[13px]"
                  >
                    <IconUsers size={18} className="text-[#8c8f94]" />
                    <span>
                      {stats.users} Registered User
                      {stats.users !== 1 ? "s" : ""}
                    </span>
                  </Link>
                )}

                <div className="mt-2 pt-3 border-t border-sidebar-foreground text-[13px] text-[#50575e]">
                  Running LMP API Version{" "}
                  <span className="font-semibold text-sidebar">v0.4.8</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>Quick Actions</CardHeader>
          <CardContent className="p-4 flex flex-col gap-2">
            <Link
              href="/location-marks/new"
              className="text-[#2271b1] hover:underline text-[13px] flex items-center gap-2"
            >
              Draft a new location mark
            </Link>
            <Link
              href="/location-marks"
              className="text-[#2271b1] hover:underline text-[13px] flex items-center gap-2"
            >
              Manage existing locations
            </Link>
            {user?.scope === "admin" && (
              <Link
                href="/users"
                className="text-[#2271b1] hover:underline text-[13px] flex items-center gap-2"
              >
                View user access list
              </Link>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
