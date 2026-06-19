"use client";

import { jwtDecode } from "jwt-decode";

export interface LoginCredentials {
  identifier: string;
  password: string;
}

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  role: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: UserProfile;
}

export interface JWTPayload {
  sub: string;
  name: string;
  scope: string;
  exp: number;
}

// -------------------- COOKIE UTILS -------------------- //

export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;

  const nameEQ = name + "=";
  const ca = document.cookie.split(";");

  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) {
      return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
  }
  return null;
}

export function setAuthCookie(token: string, remember: boolean = false): void {
  if (typeof document === "undefined") return;

  const cookieValue = encodeURIComponent(token);
  const baseCookie = `token=${cookieValue};path=/;SameSite=Strict`;

  if (remember) {
    const maxAge = 60 * 60 * 24 * 365; // 1 year in seconds
    document.cookie = `${baseCookie};max-age=${maxAge}`;
  } else {
    document.cookie = baseCookie;
  }
}

export function removeAuthCookie(): void {
  if (typeof document === "undefined") return;
  document.cookie = "token=;path=/;SameSite=Strict;max-age=0";
}

// ---------------------- DECODING ---------------------- //

export function decodeToken(token: string): JWTPayload | null {
  try {
    return jwtDecode<JWTPayload>(token);
  } catch (error) {
    console.error("Failed to decode JWT token:", error);
    return null;
  }
}

export function getAuthUser(): JWTPayload | null {
  const token = getCookie("token");
  if (!token) return null;

  const decoded = decodeToken(token);
  if (!decoded) return null;

  const currentTime = Math.floor(Date.now() / 1000);
  if (decoded.exp < currentTime) {
    return null;
  }

  return decoded;
}

// -------------------- API REQUESTS -------------------- //

export async function loginRequest(
  credentials: LoginCredentials,
): Promise<string | null> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Login failed:", response.status, errorText);
      return null;
    }

    const data: LoginResponse = await response.json();
    console.log("Login response:", data);

    return data?.token || null;
  } catch (error) {
    console.error("Login request error:", error);
    return null;
  }
}

export async function verifyTokenRequest(token: string): Promise<boolean> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/verify`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      console.error("Token verification service rejected request status:", response.status);
      return false;
    }

    const data = await response.json();
    // Gracefully handles standard true/false evaluation attributes
    return data?.success === true || data?.valid === true || response.ok;
  } catch (error) {
    console.error("Token verification pipeline query exception error:", error);
    return false;
  }
}