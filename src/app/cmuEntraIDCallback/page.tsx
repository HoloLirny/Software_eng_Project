"use client";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { SignInResponse } from "../api/signIn/route";
import { ScaleLoader } from "react-spinners";
import { useAuthStore } from "@/app/store/useAuthStore"; // Import the auth store

export default function cmuEntraIDCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fetchUser = useAuthStore((state) => state.fetchUser);
  const code = searchParams.get("code");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const checkUserAndSignIn = async () => {
      const userExists = await fetchUser(); // Fetch user from backend

      if (userExists) {
        router.push("../"); // If user exists, navigate to course page
        return;
      }

      if (!code) return; // Wait until the authorization code is available

	  axios
	  .post<SignInResponse>(`${process.env.NEXT_PUBLIC_BACKEND}/signIn`, 
	    { authorizationCode: code },
	    { withCredentials: true }  // Add this to send and receive cookies
	  )
	  .then((resp) => {
	    if (resp.data.ok) {
	      router.push("../");  // Navigate if sign-in is successful
	    }
	  })
	  .catch((error: AxiosError<SignInResponse>) => {
	    if (!error.response) {
	      setMessage(
	        "Cannot connect to CMU EntraID Server. Please try again later."
	      );
	    } else if (!error.response.data.ok) {
	      setMessage(error.response.data.message);
	    } else {
	      setMessage("Unknown error occurred. Please try again later.");
	    }
	  });

    };

    checkUserAndSignIn();
  }, [code, fetchUser, router]);

  return (
    <div className="p-3 bg-[#8F16AD] flex justify-center items-center h-screen">
      <ScaleLoader color="#ffffff" />
      {message && <p className="text-white mt-4">{message}</p>}
    </div>
  );
}
