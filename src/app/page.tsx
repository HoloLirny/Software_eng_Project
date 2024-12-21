"use client"; // This is needed to enable hooks

import { useState, useEffect } from "react";
import QRCode from "qrcode";

export default function Home() {
  const [qrCode, setQrCode] = useState<string>("");
  const [token, setToken] = useState<string>("");
  const [intervalTime, setIntervalTime] = useState<number>(300); // Default 5 min (300 sec)
  const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null);

  // Generate QR Code (calls the API to get the URL and token)
  const generateQRCode = async () => {
    const res = await fetch("/api/generate-qr");
    const data: { url: string; token: string } = await res.json();
    setToken(data.token);

    const qr = await QRCode.toDataURL(data.url);
    setQrCode(qr);
  };

  // Start interval based on user input
  const startInterval = () => {
    if (timerId) clearInterval(timerId); // Clear existing timer

    generateQRCode(); // Generate QR code immediately
    const newTimerId = setInterval(generateQRCode, intervalTime * 1000); // Refresh QR every interval
    setTimerId(newTimerId);
  };

  // Handle input change for interval
  const handleIntervalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setIntervalTime(value);
    }
  };

  useEffect(() => {
    generateQRCode(); // Generate initially
    startInterval(); // Start interval timer
    return () => {
      if (timerId) clearInterval(timerId); // Cleanup interval when component unmounts
    };
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Class Attendance QR Code</h1>

      {qrCode && <img src={qrCode} alt="QR Code" />}

      <p>Token: {token}</p>

      <div style={{ marginTop: "20px" }}>
        <label htmlFor="interval">Refresh Interval (seconds): </label>
        <input
          type="number"
          id="interval"
          value={intervalTime}
          onChange={handleIntervalChange}
          style={{ marginRight: "10px" }}
        />
        <button onClick={startInterval}>Generate QR Code</button>
      </div>
    </div>
  );
}
