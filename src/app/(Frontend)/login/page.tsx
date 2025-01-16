import { Box, Button, Card, Container, TextField, Typography } from '@mui/material'
import React from 'react'
import Grid from '@mui/material/Grid2'

function page() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#8F16AD',alignContent:'center' }}>
    <Grid container spacing={2}>
        <Grid size={{xs:12,sm:12,md:12,lg:6}}>
            <Typography variant="h4" sx={{ fontFamily: 'Prompt', color: 'white', margin: 5 ,ml:10 }}>
                Logo Hear
            </Typography>
          
        </Grid>
        <Grid size={{xs:12,sm:12,md:12,lg:6}}>
            <Card sx={{ margin: 10, borderRadius: 4 ,display:'flex',justifyContent:'center',alignCon:'center',width:'80%',maxWidth:'500px'}}>
                <Box sx={{ margin: 4 }}>
                    <Typography variant="h5" sx={{ fontFamily: 'Prompt', fontWeight: 'medium' }}>
                        Welcome!
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{
                            fontFamily: 'Prompt',
                            fontWeight: 'normal',
                            color: '#BF48DD',
                            mt: 1,
                            mb: 2,
                        }}
                    >
                        Please enter your email and password.
                    </Typography>
                    <Grid container spacing={2} sx={{ width: '100%' }}>
                    <Grid size={12}>
                        <TextField
                                fullWidth
                                required
                                id="username"
                                label="Email"
                                slotProps={{
                                    inputLabel: { style: { fontFamily: 'Prompt' },sx:{ml:1} },
                                    input: { 
                                        style: { fontFamily: 'Prompt' },
                                        sx: { borderRadius: '10px' }, // Apply border radius
                                    },
                                }}
                            />
                        </Grid>


                        <Grid size={12}>
                            <TextField
                                fullWidth
                                required
                                id="password"
                                label="Password"
                                slotProps={{
                                    inputLabel: { style: { fontFamily: 'Prompt' },sx:{ml:1} },
                                    input: { 
                                        style: { fontFamily: 'Prompt' },
                                        sx: { borderRadius: '10px' }, // Apply border radius
                                    },
                                }}
                            />
                        </Grid>
                    </Grid>
                    <Box>
                        <Box sx={{ color: '#BF48DD', mt: 2, mb: 2 }}>
                            <Typography
                            variant="body2"
                            sx={{
                                fontFamily: 'Prompt',
                                fontWeight: 'normal',
                                color: '#BF48DD',
                                mt: 1,
                                mb: 2,
                                ml:1
                            }}
                            >
                            Forgot Password?
                            </Typography>
                        </Box>
                    </Box>
                    <Box sx={{display:'flex',justifyContent:'center',mt:"5%"}}>
                        <Button variant="contained" sx={{bgcolor:'#BF48DD'}}>
                            <Typography
                                variant="body2"
                                sx={{
                                    fontFamily: 'Prompt',
                                    fontWeight: 'medium',
                                    color: '#fff',
                                }}
                                >
                                Login
                            </Typography>
                        </Button>
                    </Box>
                        
                </Box>
                
            </Card>
        </Grid>
    </Grid>
    </Box>


  )
}

export default page