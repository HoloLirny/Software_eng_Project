'use client'

import { useEffect, useState } from 'react';
<<<<<<< HEAD
import { Html5QrcodeScanner } from 'html5-qrcode';
=======
import { Html5QrcodeScanner,Html5QrcodeScanType } from 'html5-qrcode';
>>>>>>> 1fdc07e7fc82db24daea4ad2c4d12b1f89d3a4eb
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
    
<<<<<<< HEAD
    const checkAttendance = async () => {
=======
    const checkAttendance = async (courseId, user_email) => {
>>>>>>> 1fdc07e7fc82db24daea4ad2c4d12b1f89d3a4eb
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
<<<<<<< HEAD
                    user_email: userEmail,
=======
                    user_email: user_email,
>>>>>>> 1fdc07e7fc82db24daea4ad2c4d12b1f89d3a4eb
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
<<<<<<< HEAD
            }).then(() => {
                router.push("../");
            });

=======
            })
		router.push("../");
>>>>>>> 1fdc07e7fc82db24daea4ad2c4d12b1f89d3a4eb
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
<<<<<<< HEAD
        
=======
        console.log("result",result , "........." , token)
>>>>>>> 1fdc07e7fc82db24daea4ad2c4d12b1f89d3a4eb
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
<<<<<<< HEAD
    
=======
   
>>>>>>> 1fdc07e7fc82db24daea4ad2c4d12b1f89d3a4eb
            if (data.valid) {
                console.log(data)
                setStatus("Attendance Marked Successfully");
                setCourseId(data.courseId || "Unknown Course ID");
                setUserEmail(data.user_email || "")
                setMode(data.mode || "Unknown Mode");
<<<<<<< HEAD
                setValidToken(true);
                checkAttendance();
=======
                await checkAttendance(data.courseId, data.user_email);

>>>>>>> 1fdc07e7fc82db24daea4ad2c4d12b1f89d3a4eb
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
<<<<<<< HEAD

        if (validToken) {
            checkAttendance();
        }
    };

    useEffect(() => {
        if (typeof window === 'undefined') return; // Ensure client-side execution
        const scanner = new Html5QrcodeScanner(
            'reader',
            {
                qrbox: { width: 250, height: 250 },
                fps: 5,
=======
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
>>>>>>> 1fdc07e7fc82db24daea4ad2c4d12b1f89d3a4eb
            },
            false
        );

<<<<<<< HEAD
        scanner.render(
            (result) => {
                scanner.clear();
               
                setScanResult(result);
            },
            (err) => console.warn(err)
        );

        return () => scanner.clear(); // Cleanup scanner on unmount
    }, []);

=======
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
 
>>>>>>> 1fdc07e7fc82db24daea4ad2c4d12b1f89d3a4eb
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
<<<<<<< HEAD
                  <p>Scanned Result: {scanResult}</p>
=======
                  <></>
>>>>>>> 1fdc07e7fc82db24daea4ad2c4d12b1f89d3a4eb
              ) : (
                  <div id="reader"></div>
              )}
          </Card>
      </Box>
    );
};

export default QRCodeScanner;
