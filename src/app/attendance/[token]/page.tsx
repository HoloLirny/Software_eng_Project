"use client";
import { useEffect, useState } from "react";
import { use } from "react";
import Swal from "sweetalert2";
import { ScaleLoader } from 'react-spinners';
import { useAuthStore } from "@/app/store/useAuthStore";
import { useRouter } from "next/navigation";

// Attendance page
export default function Attendance({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
 
  const { token } = use(params);
  const student_id = "650610759"
  const [validToken, setValidToken] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [checkData, setCheckdata] = useState<any>({})

    



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

    </div>
  );
}
