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
  const [courseId, setCourseId] = useState<string>("Loading...");
  const [mode, setMode] = useState<string>("Loading...");

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
            setCourseId(data.courseId || "Unknown Course ID"); // Display courseId from backend
            setMode(data.mode || "Unknown Mode");
          } else {
            setStatus("Token Expired. Please scan a new QR code.");
            setCourseId("N/A");
            setMode("N/A");
          }
        })
        .catch(() => {
          setStatus("Invalid Token");
          setMode("N/A");
          setCourseId("N/A");
        });
    } else {
      setStatus("Invalid Token");
      setMode("N/A");
      setCourseId("N/A");
    }
  }, [token]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>{status}</h1>
      <h2>Course ID: {courseId}</h2>
      <h3>Mode: {mode}</h3>
    </div>
  );
}
