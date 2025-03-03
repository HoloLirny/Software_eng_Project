"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios, { AxiosError } from "axios";
import { SignInResponse } from "../api/signIn/route";
import { useAuthStore } from "@/app/store/useAuthStore"; // Import the auth store

export default function CmuEntraIDCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fetchUser = useAuthStore((state) => state.fetchUser);
  const code = searchParams.get("code");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!code) return;

    const handleSignIn = async () => {
      try {
        const response = await axios.post<SignInResponse>(
          "../api/signIn",
          { authorizationCode: code },
          { withCredentials: true }
        );

        if (response.data.ok) {
          await fetchUser(); // Fetch user data after login
          router.push("../course"); // Redirect to course page
        }
      } catch (error: unknown) {
        if (!error.response) {
          setMessage("Cannot connect to CMU EntraID Server. Please try again later.");
        } else if (!error.response.data.ok) {
          setMessage(error.response.data.message);
        } else {
          setMessage("..Unknown error occurred. Please try again later.");
        }
      }
    };

    handleSignIn(); // Call the async function inside useEffect
  }, [code, fetchUser, router]);

  return <div className="p-3">{message || "Redirecting ..."}</div>;
}
