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
import './style.css';
import { ScaleLoader } from 'react-spinners';
import CourseConfig from '../courseConfig/page'
import { useAuthStore } from "@/app/store/useAuthStore";
import Attendance from '../attendance/page'
import { useRouter } from "next/navigation";

interface Course {
    course_id : number;
    course_name : string;
    id : number;
    scan_time : string;
    teacher_id : number;
   
}

function Page() {
    const router = useRouter();
    const fetchUser = useAuthStore((state) => state.fetchUser);
    const res = useAuthStore((state) => state.user);
    const [loading, setLoading] = useState(true);

    const [studentRole, setStudentRole] = useState<string | null>("STUDENT");
    // const user = res.cmuBasicInfo[0];
    const Swal = require('sweetalert2')
    const [addOpen, setAddOpen] = useState(false); // State for dialog visibility
    const [editOpen,setEditOpen] = useState(false); // State for
    const [selectedCourse, setSelectedCourse] = useState<Course>("");
    const [courseId, setCourseId] = useState<string>(''); // State for course ID
    const [courseName, setCourseName] = useState<string>(''); // State for course Name
    const [courses, setCourses] = useState<Course>([]);
    const [changeOpen, setChangeOpen] = useState(false); // State for change dialog visibility
    const [error, setError] = useState({ courseId: "" });
    const [selectcourseconfig,setSelectcourseconfig] = useState(null);
    const [pages, setPages] = useState("home"); // Manage page state
    
    const handleEditClick = (course:any) => {
        setSelectedCourse(course);
        setEditOpen(true);
    };

    const handleClose = () => {
        setAddOpen(false);
        setEditOpen(false);
        setCourseId('');
        setCourseName('');
    };

    const handleChangeCourse = async () => {
        try {
            if (selectedCourse.course_id && selectedCourse.course_id.length !== 6) {
                Swal.fire({
                    title: "Please check your input",
                    text: "Course ID must be exactly 6 digits",
                    icon: "error",
                    timer: 1500,
                    customClass: {
                        popup: "swal-popup",
                    },
                });
                return;
            }
            if (!selectedCourse.course_name || !selectedCourse.course_id || !selectedCourse.id) {
                Swal.fire({
                    title: "Error",
                    text: "Course Name, Course ID, and Course ID are required.",
                    icon: "error",
                    timer: 1500,
                    customClass: {
                        popup: "swal-popup",
                    },
                });
                return;
            }
    
            // Send PUT request to update the course
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND}/courses-api/update`, 
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        course_name: selectedCourse.course_name, // Include only fields you want to update
                        course_id: selectedCourse.course_id,    
                        id: selectedCourse.id,
                        scan_time: selectedCourse.scan_time, // Optional
                        teacher_id: selectedCourse.teacher_id, // Optional
                        user_email: user.cmuitaccount, // Ensure you have user_email (probably from context or store)
                    }),
                }
            );
    
            if (!response.ok) {
                // Handle error response
                const errorData = await response.text(); // Use text() to get raw response
                throw new Error(errorData || "Failed to update the course");
            }
    
            // Handle successful response
            const data = await response.json();
            console.log("Update response:", data);
    
            // Update the local course list to reflect the changes
            const updatedCourses = courses.map((course) =>
                course.id === selectedCourse.id ? { ...course, ...selectedCourse } : course
            );
    
            setCourses(updatedCourses); // Update the course list in state
    
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
            setEditOpen(false);
            setCourseId(""); // Reset course ID
            setCourseName(""); // Reset course name
        }
    };

    const handleDeleteCourse = async () => {
        Swal.fire({
            title: "Are you sure?",
            text: `You want to delete the course "${selectedCourse.course_name}"?`,
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
                        `${process.env.NEXT_PUBLIC_BACKEND}/courses-api/delete?course_id=${selectedCourse.course_id}&user_email=${user.cmuitaccount}`, // Include user_email in query params
                        {
                            method: "DELETE",
                        }
                    );
    
                    if (!response.ok) {
                        throw new Error("Failed to delete the course");
                    }
    
                    // Handle successful deletion
                    const data = await response.json();
                    console.log("Course deleted successfully:", data);
    
                    // Reset selected course and other state
                    setSelectedCourse(null);
                    setCourseId("");
                    setCourseName("");
    
                    // Show success message
                    Swal.fire({
                        title: "Deleted!",
                        text: `"${selectedCourse.course_name}" has been deleted.`,
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
    };

    const handleAddCourse = async () => {
        if (error.courseId || courseId == "" || courseName == "") {
           return;
        } else {
            const newCourse = {
                id: courseId,
                name: courseName,
            };
            const addCourse = {
                course_id: courseId,
                course_name: courseName,
                user_email:user.cmuitaccount
            };
    
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/courses-api/add`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(addCourse),
                });
    
                if (!response.ok) {
                    const errorData = await response.text();
                    setError((prev) => ({ ...prev, courseId: errorData }));

                
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
    
                const data = await response.json();
                console.log("Response data:", data);
    
                // Show the alert before closing the dialog
                Swal.fire({
                    title: "Successful",
                    text: `Course ${courseId} has been added`, 
                    icon: "success",
                    timer: 1500,
                    customClass: {
                        popup: 'swal-popup'
                    }
                });
    
                setCourses((prevCourses) => [...prevCourses, newCourse]);
    
                // Delay closing dialog slightly to ensure alert appears first
                setTimeout(() => {
                    setAddOpen(false);
                    setCourseId("");
                    setCourseName("");
                }, 100); 
    
            } catch (error) {
                console.error("Error in frontend request:", error);
            }
        }
    };

    const user = res?.cmuBasicInfo?.[0] || null; 
    console.log("this is ",user)
    useEffect(() => {
        fetchUser().then(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (!loading && user === null) {
            Swal.fire({
                title: "Error",
                text: "Please login",
                icon: "error",
                timer: 1500,
                customClass: {
                    popup: "swal-popup",
                },
            })
            router.push("/login");
        }
    }, [user, loading]);
     
    useEffect(() => {
    const fetchRole = async () => {
        if (!user?.cmuitaccount) return; // Ensure user is available before making the request
    
        try {
        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND}/get_role`,
            {
            params: { email: user.cmuitaccount }, // Pass email as query param
            }
        );
        console.log("responce student ",response.data)
        setStudentRole(response.data);
        } catch (error) {
        console.error("Error fetching role:", error);
        setStudentRole("STUDENT"); // Handle error case
        }
    };

    fetchRole();
      
    }, [user]);
    console.log(studentRole)
    useEffect(() => {
        const fetchCourses = async (userEmail: string) => {
            try {
                const result = await axios.get(
                    `${process.env.NEXT_PUBLIC_BACKEND}/courses-api/get/get_by_user_email`,
                    {
                        params: { user_email: userEmail },
                    }
                );
                const coursesData = result.data.map((item: any) => item.course); 
                setCourses(coursesData); // Set only the course data
            } catch (error) {
                console.error("Error fetching courses:", error);
            }
        };
    
        if (studentRole !== "STUDENT" && user?.cmuitaccount ) {
            console.log("thsi is o skokapodkops")
            fetchCourses(user.cmuitaccount); 
        }
    
    }, [changeOpen, editOpen, addOpen, selectedCourse, user?.cmuitaccount]); // Add user.cmuitaccount as a dependency
    
      
      const handlecourseconfig = (id) => {
        setSelectcourseconfig(id);
        setPages("courseconfig");
        console.log("page after",pages)
      }

      if (loading) return (
        <>
            <div className="p-3 bg-[#8F16AD] flex justify-center items-center h-screen">
            <ScaleLoader color="#ffffff" />
            </div>

        </>
      );

    return (
        <>
        {/* {user && ( */}
            { user && pages == "courseconfig" ? (
                <CourseConfig course_id={selectcourseconfig} pages={pages} setPages={setPages} user={user}/>
            ):  user && pages == "attendance" ? (
                <Attendance course_id={selectcourseconfig} pages={pages} setPages={setPages } user={user}/>
            ) : user && studentRole !== "STUDENT" ? (
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
                    {user && (
                        <Typography
                            variant="h6"
                            sx={{
                                fontFamily: 'Prompt',
                                color: 'white',
                                ml: 1,
                                fontStyle: 'italic',
                            }}
                        >
                            {user.firstname_TH} {user.lastname_TH}
                        </Typography>
                    )}
                
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
                
                        {courses.length == 0 && studentRole !== "TA" && (
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        height: '100%',
                                        textAlign: 'center',
                                        width: '100%', // Ensure full width
                                    }}
                                >
                                    <Typography 
                                        variant="h5" // Increase text size
                                        color="info" // Change color
                                        sx={{
                                            fontWeight: 'bold', // Make it bold
                                        }}
                                    >
                                        Please Add Course
                                    </Typography>
                                </Box>
                            
                        )}

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
                                        <Grid size={11} onClick={() => handlecourseconfig(course.course_id)}>
                                            <Typography
                                                variant="h6"
                                                sx={{
                                                    fontFamily: 'Prompt',
                                                    fontWeight: 'bold',
                                                    fontSize:{xs:"14px",sm:'20px'}
                                                }}
                                            >
                                                CourseID : <span style={{ color: '#BF48DD' }}>{course.course_id}</span>
                                            </Typography>
                                            <Typography
                                                variant="h6"
                                                sx={{
                                                    fontSize:{xs:"14px",sm:'20px'},
                                                    fontFamily: 'Prompt',
                                                    fontWeight: 'bold',
                                                    color: 'black', // Set the color to black for Course Name
                                                }}
                                            >
                                                Course Name : <span style={{ color: '#BF48DD' }}>{course.course_name}</span>
                                            </Typography>
                                        </Grid>
                                        { studentRole !== "TA" && (
                                        <Grid size={1} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                <Button sx={{ height: '100%' ,mr:-2}} onClick={() => handleEditClick(course)}>
                                                    <MoreVertIcon fontSize="large" />
                                                </Button>
                                            </Grid> 
                                        )}
                                        
                                    </Grid>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                    </Box>   
                    { studentRole !== "TA" && (
                    <Button
                        variant="contained"
                        onClick={()=>{setAddOpen(true)}}
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
                    )}
                    
                </Card>


                {/* Dialog for Adding Course */}
                <Dialog 
                    open={addOpen} 
                    onClose={handleClose}
                    sx={{ 
                        display: 'flex',
                        alignItems: 'center', // Centers content vertically
                        justifyContent: 'center', // Centers content horizontally
                        '& .MuiDialog-paper': { // Targets the dialog box itself
                            width: { xs: '250px', sm: '400px', md: '500px' },
                            // display: 'flex',
                            // flexDirection: 'column',
                            // alignItems: 'center', // Centers content inside
                            // textAlign: 'center'
                        }
                    }} 
                >
                    <DialogTitle  
                    
                    >
                        
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
                        fontSize: {xs:"16px",sm:"20px"},
                        }}
                    >
                        Course ID
                    </Typography>
                    <TextField
                        fullWidth
                        value={courseId}
                        onChange={(e) => {
                            const value = e.target.value;
                            // Allow input only if it is numeric and up to 6 digits
                            if (/^\d*$/.test(value)) {
                                setCourseId(value);

                                // Check if it's exactly 6 digits
                                if (value.length === 6) {
                                    setError((prev) => ({ ...prev, courseId: '' }));
                                } else {
                                    setError((prev) => ({
                                        ...prev,
                                        courseId: 'Course ID must be exactly 6 digits',
                                    }));
                                }
                            } else {
                                setError((prev) => ({
                                    ...prev,
                                    courseId: 'Course ID must be numeric',
                                }));
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
                        fontSize: {xs:"16px",sm:"20px"},
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
                            <Typography sx={{ fontFamily: 'Prompt', fontWeight: 'medium', color: 'white', fontSize: {xs:"16px",sm:"20px"},}}>
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
                                fontSize: {xs:"16px",sm:"20px"},
                            }}
                        >
                            Course ID
                        </Typography>
                        
                        <TextField
                            fullWidth
                            value={selectedCourse ? selectedCourse.course_id : ''} 
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
                                fontSize: {xs:"16px",sm:"20px"},
                            }}
                        >
                            Course Name
                        </Typography>
                        <TextField
                            fullWidth
                            value={selectedCourse ? selectedCourse.course_name : ''} 
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
                            onClick={()=> setChangeOpen(true)}
                        >
                            <Typography sx={{ fontFamily: 'Prompt', fontWeight: 'medium', color: 'white', fontSize: {xs:"16px",sm:"20px"},}}>
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
                            <Typography sx={{ fontFamily: 'Prompt', fontWeight: 'medium', color: 'white', fontSize: {xs:"16px",sm:"20px"}, }}>
                                Delete
                            </Typography>
                        </Button>
                    </DialogActions>
                </Dialog>
                {/* Dialog for Change */}
                <Dialog open={changeOpen} onClose={handleClose}>
                    <DialogTitle sx={{ width: '400px' }}>
                        <Button sx={{ ml: -2 }} onClick={()=>{ setChangeOpen(false);}}>
                            <CloseIcon fontSize="large" sx={{ color: '#F2BEFF' }} />
                        </Button>
                    </DialogTitle>
                    <DialogContent sx={{ paddingLeft: 5, paddingRight: 5 }}>
                        <Typography sx={{ fontFamily: 'Prompt', fontWeight: 'Bold', color: '#8F16AD', mb: 1, fontSize: {xs:"16px",sm:"20px"}, }}>
                            Course ID
                        </Typography>
                        
                        <TextField
                            fullWidth
                            value={selectedCourse?.course_id || ""}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (/^\d*$/.test(value)) {
                                setSelectedCourse((prev) => ({
                                    ...prev,
                                    course_id: value,
                                }));

                                if (value.length === 6) {
                                    setError((prev) => ({ ...prev, courseId: '' }));
                                } else {
                                    setError((prev) => ({
                                    ...prev,
                                    courseId: 'Course ID must be exactly 6 digits',
                                    }));
                                }
                                } else {
                                setError((prev) => ({
                                    ...prev,
                                    courseId: 'Course ID must be numeric',
                                }));
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

                        <Typography sx={{ fontFamily: 'Prompt', fontWeight: 'Bold', color: '#8F16AD', mb: 1, fontSize: {xs:"16px",sm:"20px"}, }}>
                            Course Name
                        </Typography>
                        <TextField
                            fullWidth
                            value={selectedCourse ? selectedCourse.course_name : ''} 
                            onChange={(e) =>
                                setSelectedCourse((prev) => ({
                                    ...prev,
                                    course_name: e.target.value,
                                }))
                            }
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
                            <Typography sx={{ fontFamily: 'Prompt', fontWeight: 'medium', color: 'white', fontSize: {xs:"16px",sm:"20px"},}}>
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
                            onClick={()=>{ setChangeOpen(false);}}
                        >
                            <Typography sx={{ fontFamily: 'Prompt', fontWeight: 'medium', color: 'white', fontSize: {xs:"16px",sm:"20px"}, }}>
                                Cancle
                            </Typography>
                        </Button>
                    </DialogActions>
                </Dialog>

            </Box>
            ) : user && studentRole == "STUDENT" ? (
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
                        {user.firstname_TH} {user.lastname_TH}
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
                        justifyContent: 'center', // Center vertically
                        alignItems: 'center', // Center horizontally
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '100%',
                            textAlign: 'start',
                            width: '100%', // Ensure full width
                        }}
                    >
                        <Typography 
                            variant="h5" // Increase text size
                            sx={{
                                fontWeight: 'bold', // Make it bold
                                color: '#FF0000', // Optional: Change color
                            }}
                        >
                            Access Denied, Please Contact Admin
                        </Typography>
                    </Box>
                </Card>

                </Box>
        
            
            ):(
                <></>
            )
        
        }
        {/* )} */}
        
       
        </>
    );
}

export default Page;