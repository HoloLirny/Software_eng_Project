"use client"
import { Box, Button, Card, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import HomeIcon from '@mui/icons-material/ArrowBack';
import Grid from '@mui/material/Grid2';
import '@fontsource/prompt';
import QRCode from "qrcode";
import Image from 'next/image';
import iconimg from '../../../../public/icon.png';
import axios from 'axios';

function Page({time, mode, expireTime, courseId,setPage,user_email,date}) {
    // const time = 200;
    // const mode = 'time';
    // const expireTime = 1;
    // const courseId = '261335';

    const [students, setStudents] = useState([]);
    
    const [qrCode, setQrCode] = useState<string>("");
    const [timeLeft, setTimeLeft] = useState<number>(time);

    const generateQRCode = async () => {
        console.log(expireTime)
        if (timeLeft <= 0) return; // Don't generate QR if time expired
        try {
            const res = await fetch(
                `/api/generate-qr?mode=${mode}&courseId=${courseId}&expireTime=${expireTime}&email=${user_email}`
            );
            if (!res.ok) throw new Error("Failed to fetch QR code");

            const data: { url: string } = await res.json();
            console.log(data)
            const qr = await QRCode.toDataURL(data.url);
            setQrCode(qr);
        } catch (error) {
            console.error("QR Code Generation Error:", error);
            setQrCode("");
        }
    };

    useEffect(() => {
        // Start countdown timer
        const countdownInterval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(countdownInterval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(countdownInterval);
    }, []);


useEffect(() => {
    if (!user_email || !courseId || !date) return;

    const interval = setInterval(() => {
        const fetchStudent = async () => {
            try {
                const result = await axios.get(
                    `${process.env.NEXT_PUBLIC_BACKEND}/attendance-api/get/get_by_id`,
                    {
                        params: { course_id: courseId, user_email, date },
                    }
                );

                const studentList = result.data.map((item: any) => ({
                    student_name: item.student.student_name,
                    student_id: item.student.student_id,
                    date: item.attendance_detail.date,
                    description: item.attendance_detail.description,
                }));
		console.log("studentList",studentList)
                setStudents(studentList);
            } catch (error) {
                console.error("Error fetching attendance:", error);
            }
        };

        fetchStudent();
    }, 1000); // 👈 Fetch every second

    return () => clearInterval(interval); // Cleanup on unmount
}, [user_email, courseId, date]); 

        
    useEffect(() => {
        // Generate QR Code initially
        generateQRCode();

        // Refresh QR Code every expireTime seconds
        const qrInterval = setInterval(() => {
            generateQRCode();
        }, expireTime * 1000);

        return () => clearInterval(qrInterval);
    }, []);

   useEffect(()=>{
	console.log(students)
   },[students])

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    return (
        <Box sx={{ bgcolor: 'white', minHeight: "100vh" }}>
            <Box sx={{ height: '135px', bgcolor: '#BF48DD', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100%', px: 4 }}>
                    <Button color={"secondary"} onClick={()=>{setPage("attendance")}}>
                        <HomeIcon sx={{ fontSize: { xs: 40, sm: 45, lg: 50 } }} />
                    </Button>
                    <Typography fontWeight='bold' sx={{ fontSize: { xs: 36, sm: 46 } }}>
                        {courseId}
                    </Typography>
                    <Image src={iconimg} alt="icon" width={60} height={60} />
                </Box>
            </Box>

            <Box>
                <Grid container>
                    <Grid size={{ xs: 12, md: 7 }} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 5 }}>
                        <Card sx={{ padding: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                            <Typography variant="h3" fontWeight="bold" gutterBottom color='#8F16AD'>
                                {formatTime(timeLeft)}
                            </Typography>

                            {timeLeft > 0 ? (
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        bgcolor: 'white',
                                        mt: 2,
                                        padding: 2,
                                        border: '6px dashed #BF48DD',
                                        borderRadius: '20px',
                                        maxWidth: '500px', // Set a max width to maintain frame proportion
                                        maxHeight: '500px', // Set max height to prevent excessive scaling
                                        width: '100%', 
                                        height: 'auto',
                                    }}
                                >
                                    {qrCode ? (
                                        <Image
                                            src={qrCode}
                                            alt="QR Code"
                                            width={500}
                                            height={500}
                                            style={{
                                                width: '100%', // Make it responsive within the box
                                                height: 'auto', // Maintain aspect ratio
                                                display: 'inline-block' // Prevent stretching
                                            }}
                                        />
                                    ) : (
                                        <Typography variant="h6" color="error">
                                            QR Code Expired
                                        </Typography>
                                    )}
                                </Box>
                            ) : (
                                <Typography variant="h6" color="error">
                                    QR Code Expired
                                </Typography>
                            )}

                        </Card>
                    </Grid>

                    <Grid size={{ xs: 12, md: 5 }} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 6 }}>
                        <Box sx={{ bgcolor: '#F2BEFF', padding: 2, width: '100%', boxShadow: 3 }}>
                            <Typography variant="h4" fontWeight="bold" color='#8F16AD' textAlign="left" sx={{ fontFamily: 'Prompt' }}>
                                Student List
                            </Typography>
                        </Box>

                        <Box sx={{overflowY: "auto", bgcolor: '#FCEFFF', height: '100%', p: 2, width: '95%', mt: 0.5 }}>
                            {students.map((student, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        border: '1px solid #8F16AD',
                                        borderRadius: 4,
                                        p: 2,
                                        mb: 2,
                                        color: '#8F16AD',
                                    }}
                                >
                                    <Typography sx={{ fontFamily: 'Prompt' }}>
                                        {student.student_id} {student.student_name}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
}

export default Page;
