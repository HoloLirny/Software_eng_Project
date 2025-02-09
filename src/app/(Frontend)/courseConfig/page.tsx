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

function Page() {
    const router = useRouter();
    const [openAddTA, setOpenAddTA] = useState(false);
    const [taList, setTaList] = useState([{}]);
    const [initialPassword, setInitialPassword] = useState('');
    const [openTAEmailPopup, setOpenTAEmailPopup] = useState(false);
    const [files, setFiles] = useState([
        { name: 'studenList.xlsx'}
    ]);
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('TEACHER')

    const validatePassword = (password) => {
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
        const newTA = {course_id: "001001", email: email, password: initialPassword };
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
        setEmail('');
    };

    function validateEmail (email:string) {
        const cmuRegex = /^[a-zA-Z0-9._%+-]+@cmu.ac.th$/;
        const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail.com$/;
        return cmuRegex.test(email) || gmailRegex.test(email);
    }

    const confirmDeleteTA = (index) => {
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

    // Remove TA from the list
    const handleDeleteTA = async (index) => {
        const toDeleteTA = taList[index];
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/ta-api/delete`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(toDeleteTA.id),
            });
            if (response.status == 200){
                Swal.fire({
                    title: 'Success!',
                    text: 'TA has been deleted!',
                    icon: 'success',
                    confirmButtonText: 'OK',
                })
                setTaList(taList.filter((ta, i) => i !== index));
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
    
    // TODO: Implement this function with backend
    const handleFileUpload = (event) => {
        const newFiles = Array.from(event.target.files);
        setFiles([...files, ...newFiles]);
    };

    // TODO: Implement this function with backend
    const handleDragOver = (event) => {
        event.preventDefault();
    };

    // TODO: Implement this function with backend
    const handleDrop = (event) => {
        event.preventDefault();
        const droppedFiles = Array.from(event.dataTransfer.files);
        setFiles([...files, ...droppedFiles]);
    };

    useEffect(() => {
        const fetchTA = async () => {
          try {
            const result = await axios.get(
              `${process.env.NEXT_PUBLIC_BACKEND}/ta-api/get/get_all_ta`
            );
            console.log(result.data);
            setTaList(result.data);
          } catch (error) {
            console.error("Error fetching TA:", error);
          }
        };
        
        fetchTA(); // Call the async function
      }, [email, ]);



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
                    onClick={() => router.back()}
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
                        ))}
                    </List>
                </Box>


                {/* Upload file Box */}
                <Box sx = {{flexDirection: 'column',width: '50%', ml: 'auto'}}>
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
                            }}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                        >
                            <Typography sx={{ color: '#8F16AD', fontWeight: 'bold' }}>Drag files <b>here</b></Typography>
                            <Typography>or</Typography>
                            <Button variant="contained" component="label" sx={{ mt: 1, bgcolor: '#8F16AD' }}>
                                Browse
                                <input hidden type="file" multiple onChange={handleFileUpload} />
                            </Button>
                        </Box>
                            
                        {files.length > 0 && (
                            <Box sx={{ mt: 3, bgcolor: '#fff', padding: 2, borderRadius: 2 }}>
                                <Typography variant="subtitle1" sx={{ color: '#8F16AD', fontWeight: 'bold' }}>Recent files</Typography>
                                <List>
                                    {files.map((file, index) => (
                                        <ListItem key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                                            <InsertDriveFileIcon sx={{ color: '#8F16AD', mr: 1 }} />
                                            <ListItemText primary={file.name} sx={{ color: '#8F16AD' }} />
                                        </ListItem>
                                    ))}
                                </List>
                            </Box>
                        )}
                    </Box>
                </Box>

            </Card>

        </Box>
    );
}

export default Page;