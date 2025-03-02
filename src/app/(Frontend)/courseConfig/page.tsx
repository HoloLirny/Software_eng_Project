//FIXME: change responsive of the page
'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Box,
    Button,
    Card,
    Collapse,
    Dialog, 
    DialogActions, 
    DialogContent, 
    DialogTitle,
    Typography,
    IconButton,
    List,
    ListItem,
    ListItemText,
    TextField,
} from '@mui/material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import Swal from 'sweetalert2'
import axios from 'axios';
import Grid from '@mui/material/Grid2';


function Page({ course_id, pages, setPages }) {
   console.log(pages)
   console.log(course_id)
    const router = useRouter(); 
    const [openAddTA, setOpenAddTA] = useState(false);
    const [taList, setTaList] = useState([]);
    const [initialPassword, setInitialPassword] = useState('');
    const [openTAEmailPopup, setOpenTAEmailPopup] = useState(false);
    const [files, setFiles] = useState([
    ]);
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('TEACHER'); {/*FIXME: change this when login is work*/}

    const validatePassword = (password: string) => {
        return password.length >= 8;
    }

    const handleCreateButton = () => {
        if (validatePassword(initialPassword)) {
            setOpenTAEmailPopup(true);
        }
    }

    const pressAddTAButton = () => {
        if (validateEmail(email)) {
            setOpenTAEmailPopup(false);
            handleAddTA();
        }
    }

    const pressCancelButton = () => {
        setEmail('');
        setOpenTAEmailPopup(false);
    }

    const handleAddTA = async () => {
        const newTA = {course_id: course_id, email: email, password: initialPassword };
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/ta-api/add`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newTA),
            });
            if (response.status == 201){
                Swal.fire({
                    title: 'Success!',
                    text: 'TA has been added!',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    willClose: () => setOpenTAEmailPopup(true)
                })
                setEmail('');
                fetchTA();
            }else{
                Swal.fire({
                    title: 'Error!',
                    text: 'TA has not been added!',
                    icon: 'error',
                    confirmButtonText: 'OK'
                })
            }
        } catch (error) {
            console.error("Error adding TA:", error);
        }
    };

    function validateEmail (email: string) {
        const cmuRegex = /^[a-zA-Z0-9._%+-]+@cmu.ac.th$/;
        return cmuRegex.test(email);
    }

    const confirmDeleteTA = (index: number) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You will not be able to recover this TA!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, keep it',
        }).then((result) => {
            if (result.isConfirmed) {
                handleDeleteTA(index);
            }
        });
    }

    const handleDeleteTA = async (index: number) => {
        const toDeleteTA = taList[index];
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/ta-api/delete`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({id: toDeleteTA.id}),
            });

            if (response.status == 200){
                Swal.fire({
                    title: 'Success!',
                    text: 'TA has been deleted!',
                    icon: 'success',
                    confirmButtonText: 'OK',
                })
                fetchTA();
            }else{
                Swal.fire({
                    title: 'Error!',
                    text: 'TA has not been deleted!',
                    icon: 'error',
                    confirmButtonText: 'OK'
                })
            }
        } catch (error) {
            console.error("Error deleting TA:", error);
        }
    };
    
    const handleFileUpload = async (event) => {
        const file = event.target.files[0]; // Get the selected file
        
        if (!file) return;

        uploadFile(file);
    };

    const handleDrop = (event) => {
        event.preventDefault();
        const droppedFiles = Array.from(event.dataTransfer.files);
        const excelFiles = droppedFiles.filter(file => file.name.endsWith(".xls") || file.name.endsWith(".xlsx"));
        if (excelFiles.length === 0) {
            Swal.fire({ title: 'Error!', text: 'Please upload an Excel file (.xls or .xlsx)', icon: 'error', confirmButtonText: 'OK' });
            return;
        }

        uploadFile(excelFiles[0]);
    };

    const uploadFile = async (file) => {
        const formData = new FormData();
        // FIXME: Change course_id and section to the actual course_id and section
        formData.append("file", file); // Append the file
        formData.append("course_id", course_id); // Append the course_id
        formData.append("section", "001")

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND}/file-api/upload`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data", // Required for file uploads
                },
            });
    
            if (response.status === 200) {
                Swal.fire({ 
                    title: 'Success!', 
                    text: 'File uploaded successfully!', 
                    icon: 'success', 
                    confirmButtonText: 'OK' });
                fetchFile();
            } else {
                Swal.fire({ 
                    title: 'Error!', 
                    text: 'File upload failed!', 
                    icon: 'error', 
                    confirmButtonText: 'OK' });
            }
        } catch (error) {
            console.error("Error uploading file:", error);
            Swal.fire({ 
                title: 'Error!', 
                text: 'An error occurred!', 
                icon: 'error', 
                confirmButtonText: 'OK' });
        }
    }

    const fetchTA = async () => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND}/ta-api/get/get_by_id?course_id=${course_id}`
              );
              if (!response.ok) {
                const errorData = await response.json();
                alert(errorData.error || "Failed to fetch TA data");
                return;
              }
              const data = await response.json(); // Parse the response body as JSON
                setTaList(data || []);
        } catch (error) {
          console.error("Error fetching TA:", error);
        }
    };

    const fetchFile = async () => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND}/file-api/get/get_by_id?course_id=${course_id}`
            );

            if (!response.ok) {
                const errorData = await response.json();
                alert(errorData.error || "Failed to fetch files");
                return;
              }

              const data = await response.json();
            setFiles(data || []);
        } catch (error) {
            console.error("Error fetching file:", error);
        }
    };

    useEffect(() => {
        fetchTA();
        fetchFile();
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
            }}>

            <Button
                      onClick={() => setPages("course")}
                    sx={{
                        position: 'absolute',
                        top: 16,
                        left: 16,
                        color: '#8F16AD',
                        backgroundColor: '#fff',
                        fontWeight: 'bold',
                        borderRadius: 2,
                        '&:hover': {
                            backgroundColor: '#f5f5f5',
                        },
                    }}
                >
                    Back
            </Button>

            <Card
                sx={{
                    minHeight: '80vh',
                    width: '75%',
                    padding: 4,
                    borderRadius: 4,
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 2,
                    position: 'relative',
                }}
            >
                <Grid container spacing={2}>
                    <Grid size={{xs:12,lg:4}}>
                        {/* TA box */}
                            <Box sx = {{ flexDirection: 'column', width: '45%', mr: 'auto'}}>
                                {/* Add TA Box */}
                                {role == 'TEACHER' ?
                                    <Box
                                        sx={{
                                            border: '1px solid #8F16AD',
                                            borderRadius: 2,
                                            padding: 2,
                                            bgcolor: '#F5F5F5',
                                            position: 'relative',
                                        }}>

                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                cursor: 'pointer',
                                            }}
                                            onClick={() => setOpenAddTA(!openAddTA)}>
                                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#8F16AD' }}>
                                                ADD TA
                                            </Typography>
                                            <IconButton>
                                                {openAddTA ? <ExpandLessIcon sx={{ color: '#8F16AD' }} /> : <ExpandMoreIcon sx={{ color: '#8F16AD' }} />}
                                            </IconButton>
                                        </Box>

                                        <Collapse in={openAddTA}>
                                            <Box sx={{ mt: 2 }}>
                                                <TextField
                                                    fullWidth
                                                    variant="outlined"
                                                    label="Initial password"
                                                    value={initialPassword}
                                                    onChange={(e) => setInitialPassword(e.target.value)}
                                                    sx={{ bgcolor: '#fff' }}
                                                />
                                                { validatePassword(initialPassword) ? <Box></Box> : 
                                                <Typography sx={{ color: 'red', fontSize: '0.8rem', mb: 2 }}>
                                                    Password must be at least 8 characters</Typography>}

                                                <Button
                                                    fullWidth
                                                    sx={{
                                                        bgcolor: '#8F16AD',
                                                        color: '#fff',
                                                        fontWeight: 'bold',
                                                        '&:hover': { bgcolor: '#7B1395' },
                                                    }}
                                                    onClick={() => handleCreateButton()}>
                                                    Create
                                                </Button>

                                                {/* Popup Dialog */}
                                                <Dialog open={openTAEmailPopup} onClose={() => setOpenTAEmailPopup(false)} sx={{ '& .MuiPaper-root': { borderRadius: 3, padding: 2 } }}>
                                                    <DialogTitle sx={{ color: '#8F16AD', fontWeight: 'bold', textAlign: 'center' }}>
                                                        Please input email here.
                                                    </DialogTitle>
                                                    <DialogContent>
                                                        <TextField
                                                            fullWidth
                                                            variant="outlined"
                                                            placeholder="cmu_email@cmu.ac.th..."
                                                            value={email}
                                                            onChange={(e) => setEmail(e.target.value)}
                                                            sx={{ mt: 1 }}
                                                        />
                                                        {!validateEmail(email) && email.length > 0 ? <Typography sx={{ color: 'red', fontSize: '0.8rem' }}>Please input valid email</Typography> : <Box></Box>}
                                                    </DialogContent>
                                                    <DialogActions sx={{ justifyContent: 'center', gap: 2, pb: 2 }}>
                                                        <Button sx={{ bgcolor: '#8F16AD', color: '#fff', fontWeight: 'bold' }} onClick={pressAddTAButton}>
                                                            ADD
                                                        </Button>
                                                        <Button sx={{ bgcolor: 'red', color: '#fff', fontWeight: 'bold' }} onClick={pressCancelButton}>
                                                            Cancel
                                                        </Button>
                                                    </DialogActions>
                                                </Dialog>

                                            </Box>
                                        </Collapse>
                                    </Box>
                                    :
                                    <Box/>
                                }

                                {/* TA List */}
                                <List sx={{ mt: 2 }}>
                                    <Box sx={{ width: '100%', textAlign: 'left', position: 'relative', pb: 1 }}>
                                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#8F16AD' }}>
                                            TA list
                                        </Typography>
                                        <Box sx={{ width: '100%', height: '2px', bgcolor: '#8F16AD', mt: 0.5 }} />
                                    </Box>

                                    <Box sx = {{ maxHeight: 250, overflow: 'auto', scrollbarWidth: 'thin', scrollbarColor: '#8F16AD #F5F5F5'}}>
                                        {taList.map((ta, index) => (
                                            <ListItem
                                                key={index}
                                                sx={{
                                                    bgcolor: '#F5F5F5',
                                                    borderRadius: 2,
                                                    mb: 1,
                                                    px: 2,
                                                    display: 'flex',
                                                    justifyContent: 'space-between'
                                                }}>

                                                <ListItemText 
                                                    primary={`Email: ${ta.email}`} 
                                                    sx={{ color: '#8F16AD' }}
                                                />
                                                {role == 'TEACHER' ? 
                                                    <IconButton onClick={() => confirmDeleteTA(index)}>
                                                        <DeleteIcon sx={{ color: '#8F16AD' }} />
                                                    </IconButton>
                                                    : <Box></Box>}
                                                    

                                            </ListItem>
                                        )).reverse()} {/* Reverse the list to show the latest TA first */}
                                    </Box>
                                </List>
                            </Box>
                    </Grid>
                
                    <Grid size={{xs:12,lg:8}}>

                    {/* File Box */}
                        <Box sx = {{flexDirection: 'column',width: '50%', ml: 'auto'}}>
                            {/* Upload files box */}
                            <Box sx={{
                                border: '2px dashed #8F16AD',
                                padding: 3,
                                borderRadius: 2,
                                bgcolor: '#F5F5F5',
                                textAlign: 'center',
                            }}>

                                <Typography variant="h6" sx={{ color: '#8F16AD', fontWeight: 'bold' }}>
                                    Upload file!
                                </Typography>
                                <Typography sx={{ color: '#8F16AD', fontSize: '0.9rem' }}>
                                    Upload documents you want
                                </Typography>

                                <Box
                                    sx={{
                                        border: '1px solid #8F16AD',
                                        borderRadius: 2,
                                        padding: 3,
                                        mt: 2,
                                        bgcolor: '#fff',
                                        textAlign: 'center',
                                        cursor: 'pointer',
                                    }}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={handleDrop}
                                >
                                    <Typography sx={{ color: '#8F16AD', fontWeight: 'bold' }}>Drag files <b>here</b></Typography>
                                    <Typography>or</Typography>
                                    <Button variant="contained" component="label" sx={{ mt: 1, bgcolor: '#8F16AD' }}>
                                        Browse
                                        <input hidden type="file" accept=".xls,.xlsx" onChange={handleFileUpload} />
                                    </Button>
                                </Box>         
                            </Box>
                            
                            {/* show all recently upload file */}
                            <Box>
                                {files.length > 0 && (
                                        <Box sx= {{mt: 2}}> 
                                            <Box>
                                                <Typography variant="subtitle1" sx={{ color: '#8F16AD', fontWeight: 'bold' }}>Recent files</Typography>
                                            </Box>
                                            <Box sx = {{ maxHeight: 100, overflow: 'auto', scrollbarWidth: 'thin', scrollbarColor: '#8F16AD #F5F5F5'}}>
                                                <List>
                                                    {files.map((file, index) => (
                                                        <ListItem key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <InsertDriveFileIcon sx={{ color: '#8F16AD', mr: 1 }} />
                                                            <ListItemText primary={file.file_name} sx={{ color: '#8F16AD' }} />
                                                        </ListItem>
                                                    ))}
                                                </List>
                                            </Box>
                                        </Box>
                                    )}
                            </Box>
                        </Box>
                    </Grid>         
                </Grid>

                <Button onClick={()=>{setPages("attendance")}}>
                    next
                </Button>
              
               
            </Card>

        </Box>
    );
}

export default Page;