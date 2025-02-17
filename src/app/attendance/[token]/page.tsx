"use client";
import { useEffect, useState } from "react";
import { use } from "react";

// Attendance page
export default function Attendance({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);
  const [status, setStatus] = useState<string>("Validating...");
  const [success, setSuccess] = useState<String>("notSuccess");

  useEffect(() => {
    if (token) {
      fetch("/api/generate-qr", {
        method: "POST",
        body: JSON.stringify({ token }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.valid) {
            setStatus("Attendance Marked Successfully");
            setSuccess("Success");
          } else {
            setStatus("Token Expired. Please scan a new QR code.");
          }
        })
        .catch(() => {
          setStatus("Invalid Token");
        });
    } else {
      setStatus("Invalid Token");
    }
  }, [token]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>{status}</h1>
    </div>
  );
}
