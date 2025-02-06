"use client";

import { useState, useEffect } from "react";
import QRCode from "qrcode";

export default function Home() {
  const [qrCode, setQrCode] = useState<string>("");
  const [token, setToken] = useState<string>("");
  const [url, setUrl] = useState<string>("");
  const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null);
  const [mode, setMode] = useState<"time" | "single-scan">("time");
  const [isTokenUsed, setIsTokenUsed] = useState<boolean>(false);
  const [timeLimit, setTimeLimit] = useState<number>(600); // Total time in seconds
  const [remainingTime, setRemainingTime] = useState<number>(600); // Countdown
  const [intervalTime, setIntervalTime] = useState<number>(5); // Refresh interval (default 5s)
  const [countdownId, setCountdownId] = useState<NodeJS.Timeout | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false); // Control QR visibility

  // Fetch QR Code
  const generateQRCode = async () => {
    try {
      const res = await fetch(`/api/generate-qr?mode=${mode}`);
      if (!res.ok) throw new Error("Failed to fetch QR code");

      const data: { url: string; token: string; used: boolean } =
        await res.json();
      setToken(data.token);
      setUrl(data.url);
      setIsTokenUsed(data.used);

      const qr = await QRCode.toDataURL(data.url);
      setQrCode(qr);
    } catch (error) {
      console.error("QR Code Generation Error:", error);
      setQrCode("");
    }
  };

  // Check if token is used
  const checkTokenStatus = async () => {
    if (!token || mode !== "single-scan") return;

    try {
      const res = await fetch(`/api/check-token?token=${token}`);
      if (!res.ok) throw new Error("Failed to check token");

      const data: { used: boolean } = await res.json();
      if (data.used) {
        setIsTokenUsed(true);
        generateQRCode(); // Auto-regenerate
      }
    } catch (error) {
      console.error("Error checking token status:", error);
    }
  };

  // Start interval (for time mode)
  const startInterval = () => {
    if (timerId) clearInterval(timerId); // Clear any existing timers
    if (countdownId) clearInterval(countdownId); // Clear countdown timer

    setRemainingTime(timeLimit); // Reset countdown
    setIsRunning(true); // Show QR

    generateQRCode(); // Generate QR immediately

    // QR Regeneration Interval
    const regenTimer = setInterval(() => {
      generateQRCode();
    }, intervalTime * 1000);

    setTimerId(regenTimer);

    // Real-Time Countdown
    const countdownTimer = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev > 0) return prev - 1;
        return 0;
      });
    }, 1000);

    setCountdownId(countdownTimer);

    // Stop both intervals when time is up
    setTimeout(() => {
      clearInterval(regenTimer);
      clearInterval(countdownTimer);
      setTimerId(null);
      setCountdownId(null);
      setIsRunning(false); // Hide QR
      setQrCode(""); // Clear QR
    }, timeLimit * 1000);
  };

  // Poll token status every 3 sec in single-scan mode
  useEffect(() => {
    let pollId: NodeJS.Timeout | null = null;

    if (mode === "single-scan") {
      pollId = setInterval(checkTokenStatus, 3000);
    }

    return () => {
      if (pollId) clearInterval(pollId);
    };
  }, [token, mode]);

  useEffect(() => {
    startInterval();
    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [mode, intervalTime]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Class Attendance QR Code</h1>

      <div style={{ marginTop: "20px" }}>
        {/* {qrCode ? (
          <img src={qrCode} alt="QR Code" />
        ) : (
          <p>Loading QR Code...</p>
        )} */}
        {isRunning && qrCode ? (
          <img src={qrCode} alt="QR Code" />
        ) : (
          <p>Loading QR Code...</p>
        )}
      </div>

      <p>
        <strong>URL:</strong> {url || "Generating..."}
      </p>
      <p>
        <strong>Token:</strong> {token || "Generating..."}
      </p>
      {mode === "single-scan" && (
        <p>
          <strong>Status:</strong> {isTokenUsed ? "Used" : "Active"}
        </p>
      )}

      <div style={{ marginTop: "20px" }}>
        <label htmlFor="interval">
          <strong>Refresh Interval (seconds):</strong>
        </label>

        <input
          type="number"
          id="interval"
          value={intervalTime}
          onChange={(e) => setIntervalTime(Number(e.target.value))}
          style={{ color: "black", marginLeft: "10px", padding: "5px" }}
          disabled={mode === "single-scan"}
        />
        <p>Time Left: {remainingTime} sec</p>
        <label htmlFor="timeLimit">Total Active Time (seconds): </label>
        <input
          type="number"
          id="timeLimit"
          value={timeLimit}
          onChange={(e) => setTimeLimit(parseInt(e.target.value) || 0)}
          style={{ color: "black", marginLeft: "10px", padding: "5px" }}
        />
        <button
          onClick={startInterval}
          style={{ marginLeft: "10px", padding: "5px" }}
        >
          Generate QR Code
        </button>
      </div>

      <div style={{ marginTop: "20px" }}>
        <label htmlFor="mode">
          <strong>QR Mode:</strong>
        </label>
        <select
          id="mode"
          value={mode}
          onChange={(e) => setMode(e.target.value as "time" | "single-scan")}
          style={{ color: "black", marginLeft: "10px", padding: "5px" }}
        >
          <option value="time">Time-Based Expiration</option>
          <option value="single-scan">Single-Scan Expiration</option>
        </select>
      </div>
    </div>
  );
}
