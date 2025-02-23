"use client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

// Same in-memory store
interface Token {
  expiresAt: number;
}
let tokens: Record<string, Token> = {};

export default function Attendance() {
  const router = useRouter();
  const { token } = router.query;
  const [status, setStatus] = useState<string>("Validating...");

  useEffect(() => {
    if (token && typeof token === "string") {
      const record = tokens[token];

      if (record && record.expiresAt > Date.now()) {
        setStatus("Attendance Marked Successfully");
        delete tokens[token]; // Invalidate token after use
      } else {
        setStatus("Invalid or Expired QR Code");
      }
    }
  }, [token]);

  return (
    <>
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h1>{status}</h1>
      </div>
    </>
  );
}
