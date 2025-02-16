"use client"
import { Box, Card, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import HomeIcon from '@mui/icons-material/Home';
import Grid from '@mui/material/Grid2';
import '@fontsource/prompt';

function page() {
    const courseid = 261336;
    const studentData = [
        { id: '650610111', name: 'สมชาย ใจดี' },
        { id: '650610112', name: 'สมหญิง สุขสันต์' },
        { id: '650610113', name: 'อนันต์ รักเรียน' },
        { id: '650610114', name: 'จารุวรรณ ขยันทำงาน' },
      ];
    const initialTime = 5 * 60; // 5 minutes in seconds

    const [time, setTime] = useState(initialTime);

    useEffect(() => {
        if (time <= 0) return;

        const timer = setInterval(() => {
            setTime((prevTime) => prevTime - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [time]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    return (
        <div>
            <Box sx={{bgcolor:'white',minHeight:"100vh"}}>
                <Box sx={{ height: '135px', bgcolor: '#BF48DD', display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100%', px: 4 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <HomeIcon sx={{ fontSize: {xs:40,sm:45,lg:50}}}/>
                        </Box> 
                        <Typography fontWeight='bold' sx={{fontSize:{xs:36,sm:46}}}>
                            {courseid}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <img src="/icon.png" alt="icon" style={{ width: {xs:'40px',sm:'45px'}, height: '60px' }} />
                        </Box>
                    </Box>
                </Box>

                <Box>
                    <Grid container>
                        <Grid size={{xs:12,md:7}} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 5}}>
                            <Card  sx={{padding:8, display: 'flex', flexDirection: 'column', alignItems: 'center' ,width:'100%'}}>
                                <Typography variant="h3" fontWeight="bold" gutterBottom color='#8F16AD'>
                                    {formatTime(time)}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: 'white', mt: 2, padding: 3, border: '6px dashed #BF48DD',borderRadius:'20px'}}>
                                    <img src="/qrcode.webp" alt="icon" style={{ width: '100%', height: '100%',maxHeight:'400px' }} />
                                </Box>

                            </Card>
                            
                        </Grid>

                        <Grid size={{xs:12,md:5}} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center',padding:6}}>
                            
                            <Box sx={{ bgcolor: '#F2BEFF', padding: 2, width: '100%', boxShadow: 3 }}>
                                <Typography variant="h4" fontWeight="bold"  color='#8F16AD' textAlign="left" sx={{fontFamily:'Prompt'}}  >
                                 Student List
                                </Typography>
                            </Box>
                            <Box sx={{ bgcolor: '#FCEFFF', height: '100%', p: 2, width: '95%', mt: 0.5 }}>
                            {studentData.map((student, index) => (
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
                                <Typography sx={{fontFamily:'Prompt'}}> {/* Explicitly set here */}
                                    {student.id} {student.name}
                                </Typography>
                                
                                </Box>
                            ))}
                            </Box>

                        
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </div>
    )
}

export default page;
