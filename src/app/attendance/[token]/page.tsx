"use client";
import { useEffect, useState } from "react";
import { use } from "react";
import Swal from "sweetalert2";

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
  const student_id = "650610759"
  const [loading, setLoading] = useState<boolean>(false);
  const [checkData, setCheckdata] = useState<any>({})

  
  useEffect(() => {
    const fetchData = async () => {
      if (token) {
        try {
          const res = await fetch("/api/generate-qr", {
            method: "POST",
            body: JSON.stringify({ token }),
            headers: {
              "Content-Type": "application/json",
            },
          });
          const data = await res.json();

          if (data.valid) {
            console.log(data)
            setStatus("Attendance Marked Successfully");
            setCourseId(data.courseId || "Unknown Course ID");
            setMode(data.mode || "Unknown Mode");
            // Call handleCheck after successful validation
            await handleCheck(student_id, data.courseId, "02/01/2555"); // Ensure handleCheck is awaited
          } else {
            setStatus("Token Expired. Please scan a new QR code.");
            setCourseId("N/A");
            setMode("N/A");
          }
        } catch (error) {
          setStatus("Invalid Token");
          setMode("N/A");
          setCourseId("N/A");
        }
      } else {
        setStatus("Invalid Token");
        setMode("N/A");
        setCourseId("N/A");
      }
    };

    fetchData(); // Call the fetchData function
  }, [token]);

  const addDate = async () => {
    const date = {
      description: "T1",
      date: "02/01/2555",
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/attendance-api/add_date`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(date),
      });

      if (!response.ok) {
        const errorData = await response.text();
        Swal.fire({
          title: "Error",
          text: errorData || "An unexpected error occurred.",
          icon: "error",
        });
        return; // Exit if response is not ok
      }

      const data = await response.json();
      console.log("Response data:", data);

      // Show the alert on successful check
      Swal.fire({
        title: "Successful",
        text: `Course ${courseId} has been added`,
        icon: "success",
        timer: 1500,
        customClass: {
          popup: 'swal-popup',
        },
      });

    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        title: "Error",
        text: "An error occurred while checking attendance.",
        icon: "error",
      });
    }
  };

  const handleCheck = async (student_id, course_id, date) => {
    setLoading(true); // Set loading state to true
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/attendance-api/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id,
          course_id,
          date,
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        Swal.fire({
          title: "Error",
          text: errorData || "An unexpected error occurred.",
          icon: "error",
        });
        return; // Exit if response is not ok
      }

      const data = await response.json();
      console.log("Response data:", data);

      // Show the alert on successful check
      Swal.fire({
        title: "Successful",
        text: `Course ${courseId} has been added`,
        icon: "success",
        timer: 1500,
        customClass: {
          popup: 'swal-popup',
        },
      });

    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        title: "Error",
        text: "An error occurred while checking attendance.",
        icon: "error",
      });
    } finally {
      setLoading(false); // Ensure loading state is reset
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>{status}</h1>
      <h2>Course ID: {courseId}</h2>
      <h3>Mode: {mode}</h3>
      <button onClick={addDate}>Add Date</button>
      {/* <button onClick={handleCheck}>Check Attendance</button> */}
    </div>
  );
}
