'use client'

import { useEffect, useState } from 'react';
import { Html5QrcodeScanner,Html5QrcodeScanType } from 'html5-qrcode';
import { ScaleLoader } from 'react-spinners';
import { useAuthStore } from "@/app/store/useAuthStore";
import { useRouter } from "next/navigation";
import Swal from 'sweetalert2';
import { Box, Card } from '@mui/material';

const QRCodeScanner = ({student_id}) => {
    const router = useRouter();
    const [scanResult, setScanResult] = useState("");
    const [status, setStatus] = useState<string>("");
    const [courseId, setCourseId] = useState<string>("");
    const [mode, setMode] = useState<string>("");
    const [validToken, setValidToken] = useState<boolean>(false);
    const [userEmail, setUserEmail] = useState("");
    
    const checkAttendance = async (courseId, user_email) => {
        try {
            const date = new Date(); // Current date and time
            const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
            const day = localDate.toISOString().split("T")[0]
            const response = await fetch (`${process.env.NEXT_PUBLIC_BACKEND}/attendance-api/add`, {
                method: "POST", 
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    course_id: courseId,
                    student_id: student_id,
                    date: day,
                    user_email: user_email,
                })
            })

            if(!response.ok) {
                const errorData = await response.json();
                Swal.fire({
                    title: 'Failed!',
                    text: errorData.message,
                    icon: 'error',
                    confirmButtonText: 'OK',
                })
                return;
            }

            setUserEmail("");
            setCourseId("");
            setValidToken(false);

            Swal.fire({
                title: 'Success!',
                text: 'Check success',
                icon: 'success',
                confirmButtonText: 'OK',
            })
		router.push("../");
        } catch (error){
            Swal.fire({
                title: 'Error!',
                text: 'Your attendance has not been add!',
                icon: 'error',
                confirmButtonText: 'OK'
            })
        }
    }
    const handleScanQRCode = async (result) => {
        const token = result.split('/').pop(); // Extracts the last part after the last slash
        console.log("result",result , "........." , token)
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
                setUserEmail(data.user_email || "")
                setMode(data.mode || "Unknown Mode");
                await checkAttendance(data.courseId, data.user_email);

            } else {
                setStatus("Token Expired. Please scan a new QR code.");
                setCourseId("N/A");
                setMode("N/A");
                return;
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
            return;
        }
    };


    useEffect(() => {
        if (typeof window === 'undefined') return; // Ensure client-side execution

        const scanner = new Html5QrcodeScanner(
            'reader',
            {
                qrbox: { width: 250, height: 250 },  // Bigger scan area
                fps: 10,  // Faster scanning
                aspectRatio: 1.0,  // Square scanner
                rememberLastUsedCamera: true,  // Remembers last used camera
                supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA] // Only use camera
            },
            false
        );

        const onScanSuccess = (result) => {
            scanner.clear();  // Stop scanning after successful result
            setScanResult(result);  // Set the scanned result
            handleScanQRCode(result);
        };

        const onScanError = (err) => {
            console.warn(err);  // Log scan errors
        };

        // Start scanning automatically when the component mounts
        scanner.render(onScanSuccess, onScanError);

        // Cleanup scanner when the component unmounts
        return () => {
            scanner.clear();
        };
    }, []);    
 
    return (
        <Box
        sx={{
            minHeight: '100vh',
            bgcolor: '#8F16AD',
            flexDirection: 'column',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        }}
    >
          <Card
              sx={{
                  minHeight: '80vh',
                  width: '80%',
                  padding: 4,
                  borderRadius: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  position: 'relative',
                  justifyContent: 'center', // Center vertically
                  alignItems: 'center', // Center horizontally
                  textAlign: 'center',
                  
              }}
          >
              <h2>QR Code Scanner</h2>
              {scanResult ? (
                  <></>
              ) : (
                  <div id="reader"></div>
              )}
          </Card>
      </Box>
    );
};

export default QRCodeScanner;
