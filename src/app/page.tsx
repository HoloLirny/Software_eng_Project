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
  const [timeLimitMinutes, setTimeLimitMinutes] = useState<number>(0);
  const [timeLimitSeconds, setTimeLimitSeconds] = useState<number>(30);
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const [intervalTime, setIntervalTime] = useState<number>(5);
  const [countdownId, setCountdownId] = useState<NodeJS.Timeout | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);

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

  const startInterval = () => {
    if (timerId) clearInterval(timerId);
    if (countdownId) clearInterval(countdownId);

    let totalSeconds = timeLimitMinutes * 60 + timeLimitSeconds;
    setRemainingTime(totalSeconds);
    setIsRunning(true);

    generateQRCode();

    const regenTimer = setInterval(() => {
      generateQRCode();
    }, intervalTime * 1000);

    setTimerId(regenTimer);

    const countdownTimer = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev > 0) return prev - 1;
        return 0;
      });
    }, 1000);

    setCountdownId(countdownTimer);

    setTimeout(() => {
      clearInterval(regenTimer);
      clearInterval(countdownTimer);
      setTimerId(null);
      setCountdownId(null);
      setIsRunning(false);
      setQrCode("");
    }, totalSeconds * 1000);
  };

  useEffect(() => {
    let pollId: NodeJS.Timeout | null = null;

    // if (mode === "single-scan") {
    //   pollId = setInterval(checkTokenStatus, 3000);
    // }

    return () => {
      if (pollId) clearInterval(pollId);
    };
  }, [token, mode]);

  const handleSecondsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let seconds = parseInt(e.target.value) || 0;
    let minutes = timeLimitMinutes;
    if (seconds >= 60) {
      minutes += Math.floor(seconds / 60);
      seconds %= 60;
    }
    setTimeLimitMinutes(minutes);
    setTimeLimitSeconds(seconds);
  };

  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "50px",
      }}
    >
      <h1>Class Attendance QR Code</h1>

      {/* QR Section */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "20px",
        }}
      >
        {isRunning && qrCode ? (
          <img src={qrCode} alt="QR Code" />
        ) : (
          <p>No QR Code generated yet.</p>
        )}
      </div>

      {/* For Testing Monitor. Will be hidden in Production */}
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
        <label htmlFor="timeLimit">Total Active Time: </label>
        <input
          type="number"
          id="timeLimitMinutes"
          value={timeLimitMinutes}
          onChange={(e) => setTimeLimitMinutes(parseInt(e.target.value) || 0)}
          style={{ color: "black", marginLeft: "10px", padding: "5px" }}
        />
        min
        <input
          type="number"
          id="timeLimitSeconds"
          value={timeLimitSeconds}
          onChange={handleSecondsChange}
          style={{ color: "black", marginLeft: "10px", padding: "5px" }}
        />
        sec
      </div>
      <div>
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
