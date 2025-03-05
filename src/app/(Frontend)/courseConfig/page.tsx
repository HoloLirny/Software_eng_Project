//FIXME: change responsive of the page
'use client';
import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Card,
    Collapse,
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
import Grid from '@mui/material/Grid2';



function Page({ course_id , pages, setPages, user, role }) {
    const [openAddTA, setOpenAddTA] = useState(false);
    const [taList, setTaList] = useState([]);
    const [files, setFiles] = useState<string[]>([]);
    const [email, setEmail] = useState('');
    const [userEmail, setUserEmail] = useState(user.cmuitaccount);


    const pressAddTAButton = () => {
        if (validateEmail(email)) {
            handleAddTA();
            setEmail('');
        }
    }

    const handleAddTA = async () => {
        const newTA = {course_id: course_id, email: email, user_email: userEmail};
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/ta-api/add`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newTA),
            });

            if(!response.ok){
                Swal.fire({
                    title: 'Error!',
                    text: 'TA has not been added!',
                    icon: 'error',
                    confirmButtonText: 'OK'
                })
            }
            
            setEmail('');
            fetchTA();
            Swal.fire({
                title: 'Success!',
                text: 'TA has been added!',
                icon: 'success',
                confirmButtonText: 'OK',
            })
        } catch (error) {
            Swal.fire({
                title: 'Error!',
                text: 'TA has not been added!',
                icon: 'error',
                confirmButtonText: 'OK'
            })
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
        const taEmail = toDeleteTA.email;

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND}/ta-api/delete?ta_email=${taEmail}&user_email=${userEmail}&course_id=${course_id}`
              );

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
    

    const confirmDeleteFile = (filename: string) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You will not be able to recover this file!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, keep it',
        }).then((result) => {
            if (result.isConfirmed) {
                handleDeleteFile(filename);
            }
        });
    };

    const handleDeleteFile = async (filename: string) => {
        console.log(filename)
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/file-api/delete`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    file_name: filename,
                    course_id: course_id,
                    user_email: userEmail
                })
            });
            console.log(response)
            if (!response.ok) {
                let errorText = 'Failed to delete file!';
                try {
                    const errorData = await response.json(); // Ensure response body is not already used
                    if (errorData && errorData.error) {
                        errorText = errorData.error;
                    }
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                }
            
                Swal.fire({
                    title: 'Error!',
                    text: errorText,
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
                return;
            }

            fetchFile();
            Swal.fire({
                title: 'Success!',
                text: 'File is deleted!',
                icon: 'success',
                confirmButtonText: 'OK'
            })
        } catch (error) {

        }
    }

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files || event.target.files.length === 0) return; // Ensure a file is selected
    
        const formData = new FormData();
        formData.append('file', event.target.files[0]); // Add the file to FormData
    
        console.log([...formData.entries()]); // Debugging: See what is inside FormData
        uploadFile(formData);
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault(); // Prevent default behavior (like opening the file)
        
        const droppedFiles = Array.from(event.dataTransfer.files); // Convert FileList to an array
        const excelFiles = droppedFiles.filter(file => file.name.endsWith('.xls') || file.name.endsWith('.xlsx'));
        
        if (excelFiles.length === 0) {
            Swal.fire({ title: 'Error!', text: 'Please upload an Excel file (.xls or .xlsx)', icon: 'error', confirmButtonText: 'OK' });
            return;
        }
        
        const formData = new FormData();
        formData.append('file', excelFiles[0]); // Add the first Excel file to FormData
        
        console.log([...formData.entries()]); // Debugging: See what is inside FormData
        uploadFile(formData); // Upload the FormData
    };

    const readFileToDB = async (filename: string) =>  {
        try {
            const response = await fetch (`${process.env.NEXT_PUBLIC_BACKEND}/file-api/read_file`, {
                method: "POST",
                body: JSON.stringify({
                    file_name: filename,
                    user_email: userEmail
                })
            });

            if(!response.ok){
                Swal.fire({ 
                    title: 'Error!', 
                    text: 'Read uploaded file failed!', 
                    icon: 'error', 
                    confirmButtonText: 'OK' 
                });
            }
            fetchFile()

        } catch (error) {
            Swal.fire({ 
                title: 'Error!', 
                text: 'Read uploaded file failed!', 
                icon: 'error', 
                confirmButtonText: 'OK' 
            });
        }
    }

    const uploadFile = async (formData: FormData) => {
        try {
            formData.append("course_id", course_id); // Append the course_id
            formData.append("user_email", userEmail); // Append the user_email

            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/file-api/upload`, {
                method: "POST",
                body: formData,
            });  
            if (response.ok) {
                const data = await response.json();
                const fileUrl = data.fileUrl;
                const fileName = fileUrl.substring(fileUrl.lastIndexOf('/') + 1);
                await readFileToDB(fileName);

                Swal.fire({ 
                    title: 'Success!', 
                    text: 'File uploaded successfully!', 
                    icon: 'success', 
                    confirmButtonText: 'OK' 
                });
            } else {

                Swal.fire({ 
                    title: 'Error!', 
                    text: 'File upload failed!', 
                    icon: 'error', 
                    confirmButtonText: 'OK' 
                });
            }
        } catch (error) {
            Swal.fire({ 
                title: 'Error!', 
                text: 'An error occurred!', 
                icon: 'error', 
                confirmButtonText: 'OK' 
            });
        }
    };

    const fetchTA = async () => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND}/ta-api/get/get_by_id?course_id=${course_id}&user_email=${userEmail}`
              );
              if (!response.ok) {
                const errorData = await response.json();
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
            const filenameList: string[] = [];
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND}/file-api/get/get_path_by_id?course_id=${course_id}&user_email=${user.cmuitaccount}`
            );

            if (!response.ok) {
                if (response.status === 404) {
                    // If the status is 404, set files to an empty array
                    setFiles([]);
                } else {
                    // For other errors, handle them normally
                    const errorData = await response.json();
                    Swal.fire({
                        title: 'Error!',
                        text: errorData.error || "Failed to fetch files",
                        icon: 'error',
                        confirmButtonText: 'OK'
                    });
                }
                return;
            }

            const data = await response.json();
            const files = data.files;
            files.forEach(file => {
            const fileUrl = file.file_url;
            const fileName = fileUrl.substring(fileUrl.lastIndexOf('/') + 1);
            filenameList.push(fileName);
            });
            
            setFiles(filenameList);
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
                background: 'linear-gradient(#8f16ad, #560d69)',
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
                    width: '80%',
                    padding: 4,
                    borderRadius: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    position: 'relative',
                }}
            >
                <Grid container spacing={2}>
                    <Grid size={{xs:12,lg:5}}>
                        {/* TA box */}
                            <Box sx = {{ flexDirection: 'column', width: '100%'}}>
                                {/* Add TA Box */}
                                {/* TODO: change way to check role and show */}
                                {role == 'TEACHER' ?
                                    <Box
                                        sx={{
                                            border: '2px solid #d072e8',
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
                                                    placeholder="cmu_email@cmu.ac.th..."
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    sx={{ mt: 1 }}
                                                />

                                                {!validateEmail(email) && email.length > 0 ? 
                                                <Typography sx={{ color: 'red', fontSize: '0.8rem' }}>Please input valid email</Typography> 
                                                : <Box></Box>}

                                                <Button
                                                    fullWidth
                                                    sx={{
                                                        bgcolor: '#8F16AD',
                                                        color: '#fff',
                                                        fontWeight: 'bold',
                                                        '&:hover': { bgcolor: '#7B1395',
                                                         },mt : 1
                                                    }}
                                                    onClick={() => pressAddTAButton()}>
                                                    Add
                                                </Button>

                                            </Box>
                                        </Collapse>
                                    </Box>
                                    :
                                    <Box/>
                                }

                                {/* TA List */}
                                <List sx={{ mt: 2, width: '100%' }}>
                                    <Box sx={{ width: '100%', textAlign: 'left', position: 'relative', pb: 1 }}>
                                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#d072e8' }}>
                                            TA list
                                        </Typography>
                                        <Box sx={{ width: '100%', height: '2px', bgcolor: '#d072e8', mt: 0.5 }} />
                                    </Box>

                                    <Box sx = {{ maxHeight: 250, overflow: 'auto', scrollbarWidth: 'thin', scrollbarColor: '#8F16AD #F5F5F5'}}>
                                        {taList.length > 0 ? taList.map((ta, index) => (
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
                                        )).reverse()
                                        : <Typography sx={{ color: '#8F16AD', fontSize: '0.9rem' }}>
                                        No Ta found
                                    </Typography>} 
                                    </Box>
                                </List>
                            </Box>
                    </Grid>
                
                    <Grid size={{xs:12,lg:7}}>

                    {/* File Box */}
                        <Box sx = {{flexDirection: 'column',width: '90%', ml: 'auto', mr: 'auto'}}>
                            {/* Upload files box */}
                            {role == 'TEACHER'?<Box sx={{
                                border: '2px dashed #8F16AD',
                                padding: 3,
                                borderRadius: 2,
                                bgcolor: '#f9dfff',
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
                                        border: '2px solid #8F16AD',
                                        borderRadius: 3,
                                        padding: 3,
                                        align : 'center',
                                        minHeight: 225,
                                        mt: 2,
                                        
                                        bgcolor: '#fff',
                                        alignItems: 'center',
                                        textAlign: 'center',
                                        cursor: 'pointer',
                                    }}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={handleDrop}
                                >
                                    <Typography sx={{ color: '#8F16AD', fontWeight: 'bold' ,fontSize: '1.3rem'}}>Drag files <b>here</b></Typography>
                                    <Typography sx={{ fontSize: '1.2rem'}}>or</Typography>
                                    <Button variant="contained" component="label" sx={{ mt: 2, bgcolor: '#8F16AD',fontSize: '1.2rem' }}>
                                        Browse
                                        <input hidden type="file" accept=".xls,.xlsx" onChange={handleFileUpload} />
                                    </Button>
                                </Box>         
                            </Box> : <Box></Box>}
                            
                            
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
                                                    <ListItem 
                                                        key={index} 
                                                        sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                                                        onClick={() => setPages("attendance")}
                                                    >
                                                        <InsertDriveFileIcon sx={{ color: '#8F16AD', mr: 1 }} />
                                                        <ListItemText primary={file} sx={{ color: '#8F16AD' }} />
                                                        <DeleteIcon 
                                                            sx={{ color: '#8F16AD', mr: 1, cursor: 'pointer' }} 
                                                            onClick={(e) => {
                                                                e.stopPropagation(); // Prevents triggering onClick for ListItem
                                                                confirmDeleteFile(file)
                                                            }} 
                                                        />
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

            </Card>

        </Box>
    );
}

export default Page;