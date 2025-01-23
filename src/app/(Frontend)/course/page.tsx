'use client';
import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Typography,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CloseIcon from '@mui/icons-material/Close';
import Swal from 'sweetalert2'
import '@fontsource/prompt';
import axios from 'axios';

function Page() {
    const Swal = require('sweetalert2')
    const [addOpen, setAddOpen] = useState(false); // State for dialog visibility
    const [editOpen,setEditOpen] = useState(false); // State for
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [courseId, setCourseId] = useState<string>(''); // State for course ID
    const [courseName, setCourseName] = useState<string>(''); // State for course Name
    const [courses, setCourses] = useState([]);
    const [error, setError] = useState({ courseId: '', courseName: '' });
    const [changeOpen, setChangeOpen] = useState(false); // State for change dialog visibility
    const [selectedCoursevalue, setSelectedCoursevalue] = useState('');
    const handleAddClick = () => {
        setAddOpen(true);
    };

    const handleEditClick = (course) => {
        setSelectedCourse(course); // Store the selected course
        setCourseId(course.id); // Populate course ID
        setCourseName(course.name); // Populate course name
        setEditOpen(true);
    };

    const handleChangeClick = () => {
        setSelectedCourse(selectedCourse); // Store the selected course
        setCourseId(selectedCourse.id); // Populate course ID
        setCourseName(selectedCourse.name); // Populate course name
        setChangeOpen(true);
    };

    const handleClose = () => {
        setAddOpen(false);
        setEditOpen(false);
        setCourseId('');
        setCourseName('');
    };

    const handleChangeCourse = async () => {
        try {
          // Call the backend to update the course
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND}/courses-api/update`, // Adjust to match your API route
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                id: 2,
                course_name: courseName, // Include only fields you want to update
                course_id: courseId,
                total_student: 100,
                scan_time:10,
                
            }),
            }
          );
      
          if (!response.ok) {
            // Handle error response (e.g., 404 or 500)
            const errorData = await response.text(); // Use text() to get raw response
            throw new Error(errorData || "Failed to update the course");
          }
      
          // Handle successful response
          const data = await response.json();
          console.log("Update response:", data);
      
          // Update the local course list to reflect the changes
          const updatedCourses = courses.map((course) =>
            course.id === courseId ? { ...course, name: courseName } : course
          );
      
          setCourses(updatedCourses); // Update the course list
          Swal.fire({
            title: "Success!",
            text: "Course updated successfully.",
            icon: "success",
          });
        } catch (error) {
          console.error("Error updating course:", error);
          Swal.fire({
            title: "Error",
            text: error.message || "Failed to update the course. Please try again later.",
            icon: "error",
          });
        } finally {
          setChangeOpen(false); // Close the dialog
          setCourseId(""); // Reset course ID
          setCourseName(""); // Reset course name
        }
      };
      
      
    
    const handleDeleteCourse = async () => {
        Swal.fire({
          title: "Are you sure?",
          text: "You want to delete " + courseName + "?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Delete",
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              // Make DELETE request to the backend
              const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND}/courses-api/delete?course_id=${courseId}`,
                {
                  method: "DELETE",
                }
              );
      
              if (!response.ok) {
                throw new Error("Failed to delete the course");
              }
      
              const data = await response.json();
              console.log("Delete response:", data);
      
              // Remove the deleted course from the courses state
              const updatedCourses = courses.filter((course) => course.id !== courseId);
              setCourses(updatedCourses);
      
              // Show success message
              Swal.fire({
                title: "Deleted!",
                text: courseName + " has been deleted.",
                icon: "success",
              });
            } catch (error) {
              console.error("Error deleting course:", error);
              Swal.fire({
                title: "Error",
                text: "Failed to delete the course. Please try again later.",
                icon: "error",
              });
            }
          }
        });
      
        // Close the dialog and reset state
        setEditOpen(false);
        setCourseId("");
        setCourseName("");
      };
      

    const handleClosechange = () => {
        setChangeOpen(false);
    }

    const validateCourseId = (value) => {
        if (!/^\d*$/.test(value)) {
          return 'Course ID must be a number';
        }
        if (!value) {
          return 'Course ID is required';
        }
        return '';
      };
    
      const validateCourseName = (value) => {
        if (!value.trim()) {
          return 'Course Name is required';
        }
        return '';
      };

    const handleAddCourse = async () => {

        const newCourse = {
            id: courseId,
            name: courseName,
        };
        const addCourse = {
          course_id: courseId,
          course_name: courseName,
          total_student: 500,
          scan_time: 10,
        };
    
        console.log("Payload sent to API:", addCourse); // Log payload for debugging
    
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/courses-api/add`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(addCourse),
            });
    
            console.log("Response status:", response.status);
            console.log("Response object:", response);
    
            if (!response.ok) {
                const errorData = await response.text(); // Capture the error response
                console.error("Error details from server:", errorData);
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const data = await response.json();
            console.log("Response data:", data);
            Swal.fire({
                title: "Successfull",
                text: `Course ${courseId} has been added`, 
                icon: "success",
                timer: 1500
              });
    
            setCourses((prevCourses) => [...prevCourses, addCourse]);
            setAddOpen(false);
            setCourseId("");
            setCourseName("");
        } catch (error) {
            console.error("Error in frontend request:", error);
        }


        setCourses([...courses, newCourse]); // Add new course to the array
        setAddOpen(false); // Close dialog after adding
        setCourseId(''); // Reset fields
        setCourseName('');
    };

    useEffect(() => {
        const fetchCourses = async () => {
          try {
            const result = await axios.get(
              `${process.env.NEXT_PUBLIC_BACKEND}/courses-api/get/get_all_course`
            );
            
            setCourses(result.data.map(course => ({
              id: course.course_id,
              name: course.course_name,
            })));
          } catch (error) {
            console.error("Error fetching courses:", error);
          }
        };
        
        fetchCourses(); // Call the async function
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
            <Box
                sx={{
                    width: '80%',
                    display: 'inline-flex',
                    alignItems: 'baseline',
                    mb: 2,
                }}
            >
                <Typography
                    variant="h4"
                    sx={{
                        fontFamily: 'Prompt',
                        color: '#F2BEFF',
                        fontStyle: 'italic',
                    }}
                >
                    Hello!
                </Typography>
                <Typography
                    variant="h6"
                    sx={{
                        fontFamily: 'Prompt',
                        color: 'white',
                        ml: 1,
                        fontStyle: 'italic',
                    }}
                >
                    John
                </Typography>
            </Box>

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
                <Box sx={{ overflowY: 'auto', maxHeight: 'calc(80vh - 130px)' }}>
                {/* Display courses */}
                <Grid container spacing={2}>
                    {courses.map((course, index) => (
                        <Grid size={{xs:12,md:6}} key={index}>
                            <Card
                                sx={{
                                    // bgcolor: '#F2BEFF',
                                    borderRadius: 4,
                                    padding: 2,
                                    border: '2px solid #BF48DD',
                                }}
                            >
                                <Grid container alignItems="center" spacing={2}>
                                    <Grid size={10}>
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontFamily: 'Prompt',
                                                fontWeight: 'bold',
                                            }}
                                        >
                                            CourseID : <span style={{ color: '#BF48DD' }}>{course.id}</span>
                                        </Typography>
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontFamily: 'Prompt',
                                                fontWeight: 'bold',
                                                color: 'black', // Set the color to black for Course Name
                                            }}
                                        >
                                            Course Name : <span style={{ color: '#BF48DD' }}>{course.name}</span>
                                        </Typography>
                                    </Grid>
                                    <Grid size={2} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        <Button sx={{ height: '100%' }} onClick={() => handleEditClick(course)}>
                                            <MoreVertIcon fontSize="large" />
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
                </Box>   
                <Button
                    variant="contained"
                    onClick={handleAddClick}
                    sx={{
                        bgcolor: '#BF48DD',
                        position: 'absolute',
                        bottom: 30,
                        alignSelf: 'center',
                        borderRadius: 4,
                    }}
                >
                         <Typography sx={{ fontFamily: 'Prompt', fontWeight: 'medium', color: 'white', fontSize: '20px' }}>
                            Add
                        </Typography>
                </Button>
            </Card>


            {/* Dialog for Adding Course */}
            <Dialog open={addOpen} onClose={handleClose}  >
                <DialogTitle sx={{width:'400px'}}>
                    <Button sx={{ml:-2}} onClick={handleClose}>
                        <CloseIcon fontSize='large' sx={{color:'#F2BEFF'}}/>
                    </Button>
                </DialogTitle>
                <DialogContent sx={{paddingLeft:5,paddingRight:5}}>
                <Typography
                    sx={{
                    fontFamily: 'Prompt',
                    fontWeight: 'Bold',
                    color: '#8F16AD',
                    mb: 1,
                    fontSize: '20px',
                    }}
                >
                    Course ID
                </Typography>
                <TextField
                    fullWidth
                    value={courseId}
                    onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value)) {
                        setCourseId(value);
                        setError((prev) => ({ ...prev, courseId: '' }));
                    } else {
                        setError((prev) => ({ ...prev, courseId: 'Course ID must be a number' }));
                    }
                    }}
                    error={!!error.courseId}
                    helperText={error.courseId}
                    sx={{
                    mb: 2,
                    '& .MuiInputBase-root': {
                        backgroundColor: '#EDEDED',
                        borderRadius: 4,
                        border: '1px solid #D9D9D9',
                    },
                    '& .MuiInputLabel-root': {
                        fontFamily: 'Prompt',
                    },
                    '& .MuiInputBase-input': {
                        fontFamily: 'Prompt',
                    },
                    }}
                />
                <Typography
                    sx={{
                    fontFamily: 'Prompt',
                    fontWeight: 'Bold',
                    color: '#8F16AD',
                    mb: 1,
                    fontSize: '20px',
                    }}
                >
                    Course Name
                </Typography>
                <TextField
                    fullWidth
                    value={courseName}
                    onChange={(e) => {
                    const value = e.target.value;
                    setCourseName(value);
                    setError((prev) => ({
                        ...prev,
                        courseName: value.trim() ? '' : 'Course Name is required',
                    }));
                    }}
                    error={!!error.courseName}
                    helperText={error.courseName}
                    sx={{
                    '& .MuiInputBase-root': {
                        backgroundColor: '#EDEDED',
                        borderRadius: 4,
                        border: '1px solid #D9D9D9',
                    },
                    '& .MuiInputLabel-root': {
                        fontFamily: 'Prompt',
                    },
                    '& .MuiInputBase-input': {
                        fontFamily: 'Prompt',
                    },
                    }}
                />
                    

                </DialogContent>
                <DialogActions sx={{ display: 'flex', justifyContent: 'center', width: '100%' ,mb: 2}}>
                    <Button
                        onClick={handleAddCourse}
                        variant="contained"
                        sx={{
                            bgcolor: '#BF48DD',
                            borderRadius: 4,
                            width: '80%'  // Set width to 80%
                        }}
                    >
                        <Typography sx={{ fontFamily: 'Prompt', fontWeight: 'medium', color: 'white', fontSize: '20px' }}>
                            Add
                        </Typography>
                    </Button>
                </DialogActions>

            </Dialog>
            {/* Dialog for Edit */}
            <Dialog open={editOpen} onClose={handleClose} >
                <DialogTitle sx={{width:'400px'}}>
                    <Button sx={{ ml: -2 }} onClick={handleClose}>
                        <CloseIcon fontSize="large" sx={{ color: '#F2BEFF' }} />
                    </Button>
                </DialogTitle>
                <DialogContent sx={{ paddingLeft: 5, paddingRight: 5 }}>
                    <Typography
                        sx={{
                            fontFamily: 'Prompt',
                            fontWeight: 'Bold',
                            color: '#8F16AD',
                            mb: 1,
                            fontSize: '20px',
                        }}
                    >
                        Course ID
                    </Typography>
                    <TextField
                        fullWidth
                        value={courseId}
                        slotProps={{
                            htmlInput: { readOnly: true }, // Make field read-only
                        }}
                        sx={{
                            mb: 2,
                            '& .MuiInputBase-root': {
                                backgroundColor: '#EDEDED',
                                borderRadius: 4,
                                border: '1px solid #D9D9D9',
                            },
                        }}
                    />
                    <Typography
                        sx={{
                            fontFamily: 'Prompt',
                            fontWeight: 'Bold',
                            color: '#8F16AD',
                            mb: 1,
                            fontSize: '20px',
                        }}
                    >
                        Course Name
                    </Typography>
                    <TextField
                        fullWidth
                        value={courseName}
                        slotProps={{
                            htmlInput: { readOnly: true }, // Make field read-only
                        }}
                        sx={{
                            '& .MuiInputBase-root': {
                                backgroundColor: '#EDEDED',
                                borderRadius: 4,
                                border: '1px solid #D9D9D9',
                            },
                        }}
                    />
                </DialogContent>
                <DialogActions
                    sx={{
                        display: 'flex',
                        justifyContent: 'center', // Center buttons horizontally
                        alignItems: 'center', // Align buttons vertically
                        gap: 1, // Add spacing between buttons
                        width: '100%',
                        mb: 2,
                    }}
                >
                    <Button
                        variant="contained"
                        sx={{
                            bgcolor: '#BF48DD',
                            borderRadius: 4,
                            width: '40%', // Adjust button width as needed
                        }}
                        onClick={handleChangeClick}
                    >
                        <Typography sx={{ fontFamily: 'Prompt', fontWeight: 'medium', color: 'white', fontSize: '20px' }}>
                            Edit
                        </Typography>
                    </Button>
                    <Button
                        variant="contained"
                        sx={{
                            bgcolor: '#EB3538',
                            borderRadius: 4,
                            width: '40%', // Adjust button width as needed
                        }}
                        onClick={handleDeleteCourse}
                    >
                        <Typography sx={{ fontFamily: 'Prompt', fontWeight: 'medium', color: 'white', fontSize: '20px' }}>
                            Delete
                        </Typography>
                    </Button>
                </DialogActions>
            </Dialog>
            {/* Dialog for Change */}
            <Dialog open={changeOpen} onClose={handleClose}>
                <DialogTitle sx={{ width: '400px' }}>
                    <Button sx={{ ml: -2 }} onClick={handleClosechange}>
                        <CloseIcon fontSize="large" sx={{ color: '#F2BEFF' }} />
                    </Button>
                </DialogTitle>
                <DialogContent sx={{ paddingLeft: 5, paddingRight: 5 }}>
                    <Typography sx={{ fontFamily: 'Prompt', fontWeight: 'Bold', color: '#8F16AD', mb: 1, fontSize: '20px' }}>
                        Course ID
                    </Typography>
                    <TextField
                        fullWidth
                        value={courseId}
                        onChange={(e) => setCourseId(e.target.value)}
                        sx={{
                            mb: 2,
                            '& .MuiInputBase-root': {
                                backgroundColor: '#EDEDED',
                                borderRadius: 4,
                                border: '1px solid #D9D9D9',
                            },
                        }}
                    />
                    <Typography sx={{ fontFamily: 'Prompt', fontWeight: 'Bold', color: '#8F16AD', mb: 1, fontSize: '20px' }}>
                        Course Name
                    </Typography>
                    <TextField
                        fullWidth
                        value={courseName}
                        onChange={(e) => setCourseName(e.target.value)}
                        sx={{
                            '& .MuiInputBase-root': {
                                backgroundColor: '#EDEDED',
                                borderRadius: 4,
                                border: '1px solid #D9D9D9',
                            },
                        }}
                    />
                </DialogContent>
                <DialogActions
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: 1,
                        width: '100%',
                        mb: 2,
                    }}
                >
                    <Button
                        variant="contained"
                        sx={{
                            bgcolor: '#BF48DD',
                            borderRadius: 4,
                            width: '40%',
                        }}
                        onClick={handleChangeCourse}
                    >
                        <Typography sx={{ fontFamily: 'Prompt', fontWeight: 'medium', color: 'white', fontSize: '20px' }}>
                            Save
                        </Typography>
                    </Button>
                    <Button
                        variant="contained"
                        sx={{
                            bgcolor: '#EB3538',
                            borderRadius: 4,
                            width: '40%',
                        }}
                        onClick={handleClosechange}
                    >
                        <Typography sx={{ fontFamily: 'Prompt', fontWeight: 'medium', color: 'white', fontSize: '20px' }}>
                            Cancle
                        </Typography>
                    </Button>
                </DialogActions>
            </Dialog>

        </Box>
    );
}

export default Page;