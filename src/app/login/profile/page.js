"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Profile() {
  const { data: session, status } = useSession();

  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // When after loading success and have session, show profile
  return (
    status === "authenticated" &&
    session.user && (
      <div className="flex h-screen items-center justify-center">
        <div className="bg-white p-6 rounded-md shadow-md">
          <div className="text-center mb-4">
            <img
              src={session.user.image}
              className="rounded-full w-20 h-20 mx-auto"
            />
          </div>
          <p className="text-black">
            Welcome, <b>{session.user.name}!</b>
          </p>
          <p className="text-black">Email: {session.user.email}</p>
          <p className="text-black">Role: {session.user.role}</p>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="w-full bg-blue-500 text-white py-2 rounded"
          >
            Logout
          </button>
        </div>
      </div>
    )
  );
}
