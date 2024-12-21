import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Attendance() {
  const router = useRouter();
  const { token } = router.query;
  const [status, setStatus] = useState<string>("Validating...");

  useEffect(() => {
    if (token && typeof token === "string") {
      // Handle the token validation logic here.
      // For example, check the token expiration, etc.
      setStatus("Attendance Marked Successfully");
    }
  }, [token]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>{status}</h1>
    </div>
  );
}
