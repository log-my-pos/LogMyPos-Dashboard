"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getCookie, type UserProfile } from "@/utils/auth";
import { useUser } from "@/provider/userProvider";
import Link from "next/link";

interface LocationMark {
  id: string;
  title: string;
  description: string | null;
  latitude: number;
  longitude: number;
  user_id: string;
}

interface LocationImage {
  id: string;
  url: string;
  path: string;
}

interface UpdatePayload {
  title: string;
  description: string | null;
  latitude: number;
  longitude: number;
  user_id?: string;
}

export default function EditLocationPage() {
  const { id } = useParams<{ id: string }>();
  const { user: currentUser } = useUser();

  const [location, setLocation] = useState<LocationMark | null>(null);
  const [images, setImages] = useState<LocationImage[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getCookie("token");
        const requests = [
          fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/locations/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/locations/image/${id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          ),
        ];

        if (currentUser?.scope === "admin") {
          requests.push(
            fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/`, {
              headers: { Authorization: `Bearer ${token}` },
            })
          );
        }

        const [locRes, imgRes, usersRes] = await Promise.all(requests);

        if (!locRes.ok) throw new Error("Failed to load location.");
        const locData = await locRes.json();
        setLocation(locData.data);

        if (imgRes.ok) {
          const imgData = await imgRes.json();
          setImages(imgData.images || []);
        }

        if (usersRes?.ok) {
          const uData = await usersRes.json();
          setUsers(uData.data || []);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };
    if (id && currentUser) fetchData();
  }, [id, currentUser]);

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const payload: UpdatePayload = {
      title: formData.get("title") as string,
      description: (formData.get("description") as string) || null,
      latitude: parseFloat(formData.get("latitude") as string),
      longitude: parseFloat(formData.get("longitude") as string),
    };

    const assignedUserId = formData.get("user_id") as string;
    if (assignedUserId) {
      payload.user_id = assignedUserId;
    }

    try {
      const token = getCookie("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/locations/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) throw new Error("Failed to update location.");
      alert("Location updated successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const token = getCookie("token");
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("images", files[i]);
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/locations/image/${id}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to upload images.");

      const imgRes = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/locations/image/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (imgRes.ok) {
        const imgData = await imgRes.json();
        setImages(imgData.images || []);
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;
    try {
      const token = getCookie("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/locations/image/${imageId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Failed to delete image.");
      setImages((prev) => prev.filter((img) => img.id !== imageId));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete image");
    }
  };

  if (loading)
    return <div className="p-8 text-neutral-500">Loading editor...</div>;
  if (!location)
    return <div className="p-8 text-destructive">Location not found.</div>;

  return (
    <div className="p-4 md:p-8 w-full max-w-6xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <h1 className="text-2xl font-normal text-sidebar">
          Edit Location Mark
        </h1>
        <Link
          href="/location-marks/new"
          className="border border-[#2271b1] text-[#2271b1] hover:bg-[#f6f7f7] px-3 py-1 text-[13px] rounded-sm transition-colors"
        >
          Add New
        </Link>
      </div>

      {error && (
        <div className="text-[13px] text-destructive bg-destructive/10 p-3 border-l-4 border-destructive mb-4 shadow-sm">
          {error}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        <div className="flex-1 flex flex-col gap-6 w-full">
          <form
            id="edit-form"
            onSubmit={handleUpdate}
            className="flex flex-col gap-4"
          >
            <input
              type="text"
              name="title"
              defaultValue={location.title}
              required
              className="w-full border border-[#8c8f94] px-4 py-3 text-xl rounded-sm focus:outline-none focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1] bg-white shadow-sm"
            />
            <textarea
              name="description"
              defaultValue={location.description || ""}
              rows={8}
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
                  defaultValue={location.latitude}
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
                  defaultValue={location.longitude}
                  required
                  className="w-full border border-[#8c8f94] px-3 py-2 text-[14px] rounded-sm focus:outline-none focus:border-[#2271b1] bg-white shadow-sm"
                />
              </div>
            </div>

            {currentUser?.scope === "admin" && (
              <input
                type="hidden"
                id="hidden_user_id"
                name="user_id"
                defaultValue={location.user_id}
              />
            )}
          </form>

          <div className="bg-white border border-sidebar-foreground shadow-sm rounded-sm mt-4">
            <div className="border-b border-sidebar-foreground px-4 py-3 bg-[#f6f7f7] flex justify-between items-center">
              <h2 className="text-[14px] font-semibold text-sidebar">
                Location Gallery
              </h2>
              <div>
                <input
                  type="file"
                  id="image-upload"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={uploading}
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer border border-[#2271b1] text-[#2271b1] hover:bg-[#f6f7f7] px-3 py-1.5 text-[13px] rounded-sm transition-colors"
                >
                  {uploading ? "Uploading..." : "Add Images"}
                </label>
              </div>
            </div>
            <div className="p-4">
              {images.length === 0 ? (
                <div className="text-neutral-500 text-sm text-center py-4">
                  No images attached.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {images.map((img) => (
                    <div
                      key={img.id}
                      className="relative group border border-sidebar-foreground rounded-sm overflow-hidden aspect-square bg-neutral-100"
                    >
                      <img
                        src={img.url}
                        alt="Location"
                        className="object-cover w-full h-full"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          onClick={() => handleDeleteImage(img.id)}
                          className="bg-destructive text-white px-3 py-1 text-xs rounded hover:bg-red-700 shadow-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="w-full lg:w-72 flex flex-col gap-4">
          <div className="bg-white border border-sidebar-foreground shadow-sm rounded-sm">
            <div className="border-b border-sidebar-foreground px-4 py-3 bg-[#f6f7f7]">
              <h2 className="text-[14px] font-semibold text-sidebar">
                Publish
              </h2>
            </div>
            <div className="p-4 bg-white text-[13px] text-[#50575e] space-y-2">
              <p>
                <strong>Status:</strong> Published
              </p>
              <p>
                <strong>ID:</strong>{" "}
                <span className="font-mono text-xs">
                  {location.id.split("-")[0]}...
                </span>
              </p>
            </div>
            <div className="border-t border-sidebar-foreground p-3 bg-[#f6f7f7] flex items-center justify-between">
              <Link
                href="/location-marks"
                className="text-destructive hover:underline text-[13px]"
              >
                Cancel
              </Link>
              <button
                type="submit"
                form="edit-form"
                disabled={saving}
                className="bg-[#2271b1] text-white px-4 py-1.5 text-[13px] font-medium rounded-sm hover:bg-[#135e96] transition-colors disabled:opacity-70"
              >
                {saving ? "Updating..." : "Update"}
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
                  defaultValue={location.user_id}
                  onChange={(e) => {
                    const hiddenInput = document.getElementById(
                      "hidden_user_id"
                    ) as HTMLInputElement;
                    if (hiddenInput) hiddenInput.value = e.target.value;
                  }}
                  className="w-full border border-[#8c8f94] px-2 py-1.5 text-[13px] rounded-sm focus:outline-none focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1] bg-white shadow-sm"
                >
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.username} ({u.email})
                    </option>
                  ))}
                </select>
                <p className="text-xs text-neutral-500 mt-2">
                  Assign this location to a different owner.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}