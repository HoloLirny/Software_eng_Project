
"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Modal,
  TextField,
  Typography,
  Grid,
} from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SettingsIcon from '@mui/icons-material/Settings';
import CloseIcon from '@mui/icons-material/Close';
import QRgen from '../qrgen/page'
import Swal from "sweetalert2";

function Page({ course_id = "261361", pages, setPages, user }) {
  // TODO: change userEmail when login works
  const [userEmail, setUserEmail] = useState(user.cmuBasicInfo[0].cmuitaccount); 
  const [columns, setColumns] = useState([]);
  const [students, setStudents] = useState<{ id: string; name: string }[]>([]);
  const [attendanceData, setAttendanceData] = useState([]); // Store attendance API response
  const [selectedDate, setSelectedDate] = useState("");
  const [detail, setDetail] = useState("");
  const [generateQRDate, setGenerateQRDate] = useState("");
  const [generateQRDetail, setGenerateQRDetail] = useState("");

  const [student_id, setStudent_id] = useState("");
  const [student_name, setStudent_name] = useState("");
  const [student_email, setStudent_email] = useState("");
  const [section_lec, setSection_lec] = useState("");
  const [section_lab, setSection_lab] = useState("");


  const [addDateModalOpen, setaddDateModalOpen] = useState(false);
  const [genQRModalOpen, setGenQRModalOpen] = useState(false);
  const [qrConfigModalOpen, setQrConfigModalOpen] = useState(false);
  const [editDateModalOpen, setEditDateModalOpen] = useState(false);
  const [addStudentModalOpen, setAddStudentModalOpen] = useState(false);

  const [page,setPage] = useState("attendance");
  
  const [oldDate, setOldDate] = useState("")
  const [oldDetail, setOldDetail] = useState("")
  
  const [inputActiveTime, setInputActiveTime] = useState(10);
  const [inputRefreshTime, setInputRefreshTime] = useState(5);
  const [time, setTime] = useState(60 * 10); // 10 minutes
  const [mode, setMode] = useState("time");
  const [expireTime, setExpireTime] = useState(5) // 5 seconds
  const COLUMN_WIDTH = 150;
  
  const handleEditDateModal = () => {
    setEditDateModalOpen(true);
    setSelectedDate(generateQRDate)
    setDetail(generateQRDetail)
    setOldDate(generateQRDate)
    setOldDetail(generateQRDetail)
  }

  const handleCloseEditDateModal = () => {
    setSelectedDate(null)
    setOldDate("")
    setDetail("")
    setOldDetail("")
    setEditDateModalOpen(false);
  }

  const handleAddStudentModal = () => {
    setAddStudentModalOpen(true);
  }

  const handleCloseAddStudentModal = () => {
    setAddStudentModalOpen(false);
  }

  const handleOpenQrConfigModal = () => setQrConfigModalOpen(true);

  const handleCloseQrConfigModal = () => {
    setExpireTime(inputRefreshTime);
    setTime(inputActiveTime * 60);
    setQrConfigModalOpen(false);
  }

  const handleOpenGenQRModal = (date, detail) => {
    setGenerateQRDate(date);
    setGenerateQRDetail(detail);
    setGenQRModalOpen(true);
  }

  const handleCloseGenQRModal = () => {
    setGenerateQRDate("");
    setGenerateQRDetail("");
    setGenQRModalOpen(false);
  }

  // Open addDateModal
  const handleOpenaddDateModal = () => setaddDateModalOpen(true);

  // Close addDateModal
  const handleCloseaddDateModal = () => {
    setaddDateModalOpen(false);
    setSelectedDate(null);
    setDetail("");
  };

  const handleActiveTimeChange = (e) => {
    const value = Math.max(0, e.target.value); // Prevent values less than 0
    setInputActiveTime(value);
  };

  const handleRefreshTimeChange = (e) => {
    const value = Math.max(0, e.target.value); // Prevent values less than 0
    setInputRefreshTime(value);
  };

  const handleDateChange = (date) => {
    if (date) {
      const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
      setSelectedDate(localDate.toISOString().split("T")[0]); // Converts to "YYYY-MM-DD"
    }
  };

  function isDateInColumns(selectedDate, columns) {
    return columns.some(column => column.label === selectedDate);
  }

  const editDate = async () => {
    if (selectedDate == "") return;
    if (isDateInColumns(selectedDate, columns)) {
      handleCloseEditDateModal();
      handleCloseGenQRModal();
      Swal.fire({ 
        title: 'Failed!', 
        text: 'Date already exists.', 
        icon: 'error', 
        confirmButtonText: 'OK', 
        customClass:{
          popup: "swal-popup",
        }
      });
      return;
    }
    try {
      const response = await fetch('/api/attendance-api/edit_date', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date_old: oldDate,
          date_new: selectedDate,
          description_new: detail,
          course_id: course_id,
          user_email: userEmail }),
        })
        
        handleCloseEditDateModal();
        if (!response.ok){
          const errorData = await response.json();
          Swal.fire({ 
            title: 'Failed!', 
            text: errorData.message, 
            icon: 'error', 
            confirmButtonText: 'OK', 
            customClass: {
              popup: "swal-popup",
            }
          });
          return;
        }
        
        fetchColumns();
        fetchStudenInClass();
        handleCloseGenQRModal();
        
      Swal.fire({ 
        title: 'Success!', 
        text: 'Date successfully edited.', 
        icon: 'success', 
        confirmButtonText: 'OK' 
      });

    } catch (error) {
      Swal.fire({ 
        title: 'Failed!', 
        text: 'Failed to edit date.', 
        icon: 'error', 
        confirmButtonText: 'OK' 
      });
    }
  }

  function validateEmail (email: string) {
    const cmuRegex = /^[a-zA-Z0-9._%+-]+@cmu.ac.th$/;
    return cmuRegex.test(email);
  }

  const isValidStudentId = (id) => {
    // Check if id is a string and contains exactly 9 digits
    return /^[1-9]\d{8}$/.test(id);
  };
  const handleSubmit = async () => {
    // Validate Student ID
    if (!isValidStudentId(student_id)) {
      handleCloseAddStudentModal();
      Swal.fire({
        title: "Invalid Input",
        text: "Student ID must be at least 9 characters.",
        icon: "warning",
        confirmButtonText: "OK",
        customClass:{
          popup: "swal-popup",
        }
      });
      return;
    }

    // Validate Email
    if (!validateEmail(student_email)) {
      handleCloseAddStudentModal();
      Swal.fire({
        title: "Invalid Email",
        text: "Please enter a valid email address.",
        icon: "warning",
        confirmButtonText: "OK",
        customClass:{
          popup: "swal-popup",
        }
      });
      return;
    }

    // Validate Sections (should not be empty)
    if (!section_lec || !section_lab) {
      Swal.fire({
        title: "Missing Sections",
        text: "Both Lecture and Lab sections are required.",
        icon: "warning",
        confirmButtonText: "OK",
        customClass:{
          popup: "swal-popup",
        }
      });
      return;
    }

    try {
      const response = await fetch("/api/student-api/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id,
          student_name,
          student_email,
          course_id,
          section_lec,
          section_lab,
          user_email: userEmail,
        }),
      });

      handleCloseAddStudentModal();
      if (!response.ok) {
        Swal.fire({
          title: "Failed!",
          text: "Failed to add student.",
          icon: "error",
          confirmButtonText: "OK",
        });
        return;
      }

      // Refresh students list
      fetchStudenInClass();

      // Success message
      Swal.fire({
        title: "Success!",
        text: "Student successfully added.",
        icon: "success",
        confirmButtonText: "OK",
      });

      // Reset form fields
      setStudent_id('');
      setStudent_name('');
      setStudent_email('');
      setSection_lec('');
      setSection_lab('');

      // Close modal
      handleCloseAddStudentModal();
    } catch (error) {
      console.error("Error adding student:", error);
      Swal.fire({
        title: "Error",
        text: "An error occurred while adding the student.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };


  const fetchStudenInClass = async () => {
    try {
      const response = await fetch(`/api/student-api/get/get_by_course_id?course_id=${course_id}&user_email=${userEmail}`);
      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.error || "Failed to fetch student data");
        return;
      }

      const data = await response.json();
      const students = data.map(item => ({
        id: item.student_id, // Convert student_id to number
        name: item.student.student_name
      }));
      
      setStudents(students);
    } catch (error) {
      console.error("Error fetching student data:", error);
      alert("An error occurred while fetching student data.");
    }
  }

  // Fetch Attendance Data
  const fetchAttendanceData = async () => {
    try {
      const response = await fetch(`/api/attendance-api/get/get_all_attendance?user_email=${userEmail}`);
      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.error || "Failed to fetch attendance data");
        return;
      }

      const data = await response.json();
      const filteredData = data.filter((record) => record.course_id === course_id);

      setAttendanceData(filteredData);
    } catch (error) {
      Swal.fire({ 
        title: 'Failed!', 
        text: 'Failed to fetch attendance data.', 
        icon: 'error', 
        confirmButtonText: 'OK' 
      });
    }
  };

  // Fetch Columns (Dates)
  const fetchColumns = async () => {
    try {
      const response = await fetch(`/api/attendance-api/get/get_date?course_id=${course_id}&user_email=${userEmail}`);
      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.error || "Failed to fetch columns");
        return;
      }

      const dates = await response.json();
      const formattedColumns = dates.map((date, index) => ({
        id: index + 2,
        label: date.date,
        description: date.description,
      }));
      setColumns([{ id: 0, label: "ID" }, { id: 1, label: "Name" }, ...formattedColumns]);
    } catch (error) {
      console.error("Error fetching columns:", error);
      alert("An error occurred while fetching the columns.");
    }
  };

  // Add Date Column
  const handleAddColumn = async () => {
    if (selectedDate == "") return;

    try {
      handleCloseaddDateModal();
      const response = await fetch("/api/attendance-api/add_date", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: selectedDate,
          description: detail,
          course_id: course_id,
          user_email: userEmail }),
      });

      const data = await response.json();
      if (!response.ok) {
        Swal.fire({ 
          title: 'Failed!', 
          text: data.message, 
          icon: 'error', 
          confirmButtonText: 'OK' 
        });
        return;
      }
      fetchColumns();

      Swal.fire({ 
        title: 'Success!', 
        text: 'Date successfully added.', 
        icon: 'success', 
        confirmButtonText: 'OK' 
      });
    } catch (error) {
      Swal.fire({ 
        title: 'Failed!', 
        text: 'Failed to add date.', 
        icon: 'error', 
        confirmButtonText: 'OK' 
      });
    }
  };

  // Check if student is present on a given date
  const isStudentPresent = (studentId, date) => {
    return attendanceData.some(
      (record) => record.student_id === String(studentId) && record.attendance_detail?.date === date
    );
  };

  // Export file methods
  const exportFile = async () => {
    try {
      const reponse = await fetch(
        `/api/attendance-api/export_attendance_to_excel?course_id=${course_id}&user_email=${userEmail}`
      );

      if(!reponse.ok){
        const errorData = await reponse.json();
        Swal.fire({ 
          title: 'Failed!', 
          text: errorData.message || 'Failed to export file.', 
          icon: 'error', 
          confirmButtonText: 'OK' 
        });
        return;
      }

      const data = await reponse.json();
      const fileUrl = data.fileUrl;
      downloadFile(fileUrl);

    } catch (error) {
      console.error("Error exporting file:", error);
      Swal.fire({
        title: "Failed!",
        text: "Failed to export file.",
        icon: "error",
        confirmButtonText: "OK",
      
      })
    }
  }

  const removePublicFromUrl = (url) => {
    return url.replace("/public", "");
  };

  const getFileName = (filePath) => {
    return filePath.split("/").pop(); // Gets the last part after "/"
  };

  const downloadFile = async (fileUrl) => {

    const cleanedPath = removePublicFromUrl(fileUrl);
    const filename = getFileName(cleanedPath);

    try {
      const response = await fetch(cleanedPath);
      if (!response.ok) {
        throw new Error("Failed to fetch file");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
  }

  useEffect(() => {
    fetchAttendanceData();
  }, [students, columns]);

  useEffect(() => {
    fetchStudenInClass();
    fetchColumns();
    fetchAttendanceData();
  }, []);

  return (
    <>
      {page== "attendance" ?
      (<Box
        sx={{
          minHeight: "100vh",
          background: 'linear-gradient(#8f16ad, #560d69)',
          flexDirection: "column",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          maxWidth: "100%",
          overflowX: "auto",
        }}
      >
      <Box>
        <Button
      onClick={() => setPages("courseconfig")}
      sx={{
          position: 'absolute',
          mb: 2 ,
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

    <Box
      sx={{
        color: "white",
        fontWeight: "bold",
        fontSize: 24,
        position: 'absolute',
        top: 16, // Align vertically with the button
        left: '50%', // Center horizontally
        transform: 'translateX(-50%)', // Offset by 50% of its width to truly center it
        marginBottom: 2,
      }}
    >
      Attendance
    </Box>

    <Button
      variant="contained"
      color="secondary"
      sx={{
        position: 'absolute',
        fontWeight: 'bold' ,
        top: 16, // Align with Attendance
        right: 16, // Position on the right
        marginBottom: 5,
      }}
      onClick={exportFile}
    >
      Export
    </Button>
      </Box>
      
      {/* These buttons will now be placed below the "Back" button */}
      <Box sx={{ display: 'flex', flexDirection: 'row', marginTop: 3 , justifyContent: "space-between" , alignItems: "center", width: "90%", mt : 10}}>
        <Button
          variant="contained"
          
          color="secondary"
          sx={{ marginBottom: 2,
            fontWeight: 'bold' ,
             width: "auto"}} // This makes the button take available space on the left
          onClick={handleAddStudentModal}
        >
          Add student
        </Button>

        <Button
          variant="contained"
          sx={{ marginBottom: 2,
            backgroundColor : 'white',
            color : '#6a329f' ,
            fontWeight: 'bold' ,
             width: "auto"}} // This makes the button take available space on the left
          onClick={handleOpenaddDateModal}
        >
          Add DATE
        </Button>
        
      </Box>



      {/* Table */}
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 2,
          boxShadow: 3,
          minHeight: "80vh",
          minWidth: "95%",
          overflow: "auto", // Enable scrolling
          maxHeight: "80vh",
        }}
      >
        <Table
          sx={{
            minWidth: columns.length * COLUMN_WIDTH,
            tableLayout: "fixed",
          }}
        >
          {/* Table Head */}
          <TableHead sx = {{position: "sticky", top: 0, zIndex: 3}}>
            <TableRow sx={{ backgroundColor: "#c02ae3", flexDirection: "row", display: "flex" }}>
              {columns.map((col, index) => (
                <TableCell
                  key={col.id}
                  sx={{
                    width: COLUMN_WIDTH,
                    minWidth: COLUMN_WIDTH,
                    maxWidth: COLUMN_WIDTH,
                    color: "white",
                    fontWeight: "bold",
                    textAlign: "center",
                    position: "sticky",
                    top: 0, // Fix the header row
                    left: index === 0 ? 0 : "auto", // Fix the first column
                    backgroundColor: "#c02ae3",
                    zIndex: index === 0 ? 4 : 3, // Ensure it stays above other cells
                    cursor: index >= 2 ? "pointer" : "default",
                  }}
                  
                  onClick = {() => index >= 2 && handleOpenGenQRModal(col.label, col.description)}
                >
                  {col.label}
                  {col.description && <p>{col.description}</p>}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          {/* Table Body */}
          <TableBody>
            {students.map((student, index) => (
              <TableRow
                key={index}
                sx={{ backgroundColor: index % 2 === 0 ? "#f6e0fb" : "#eec8f8", flexDirection: "row", display: "flex"}}
              >
                {columns.map((col, colIndex) => (
                  <TableCell
                    key={col.id}
                    sx={{
                      width: COLUMN_WIDTH,
                      minWidth: COLUMN_WIDTH,
                      maxWidth: COLUMN_WIDTH,
                      textAlign: "center",
                      position: colIndex === 0 ? "sticky" : "static",
                      left: colIndex === 0 ? 0 : "auto", // Fix first column
                      backgroundColor: colIndex === 0 ? "#e19bf2" : "inherit",
                      zIndex: colIndex === 0 ? 2 : "auto",
                    }}
                  >
                    {colIndex === 0
                      ? student.id
                      : colIndex === 1
                      ? student.name
                      : isStudentPresent(student.id, col.label)
                      ? "1"
                      : "0"}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* addDateModal for Adding Date */}
      <Modal open={addDateModalOpen} onClose={handleCloseaddDateModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "white",
            p: 4,
            borderRadius: 2,
            boxShadow: 24,
            width: "300px",
            textAlign: "center",
          }}
        >
          {/* Close (X) Button - Top Left */}
          <IconButton 
            sx={{ position: 'absolute', top: 8, left: 8 }} 
            size="small" 
            onClick={handleCloseaddDateModal}
          >
            <CloseIcon />
          </IconButton>
          <h2 style={{ color: "#8F16AD", fontWeight: "bold" }}>Select Date</h2>

          <DatePicker selected={selectedDate ? new Date(selectedDate) : null} 
            onChange={handleDateChange} 
            inline />

          <h3 style={{ color: "#8F16AD", fontWeight: "bold", marginTop: "10px" }}>Detail</h3>
          <TextField fullWidth value={detail} onChange={(e) => setDetail(e.target.value)} />

          <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
            <Button variant="contained" color="secondary" onClick={handleAddColumn}
            sx={{ fontWeight: 'bold'  }}>
              ADD
            </Button>
            <Button variant="contained" color='error' onClick={handleCloseaddDateModal}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* modal for generate QR */}
      <Modal open={genQRModalOpen} onClose={handleCloseGenQRModal}>
        <Box sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "white",
            p: 2,
            borderRadius: 2,
            boxShadow: 24,
            width: "300px",
            textAlign: "center",
          }}>

          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',  // Ensures even spacing
              position: 'relative', 
              width: '100%' 
            }}
            >
            {/* Close (X) Button - Top Left */}
            <IconButton size="small" onClick={handleCloseGenQRModal}>
              <CloseIcon />
            </IconButton>

            {/* Centered "Edit" Text */}
            <Typography 
              variant="h5" 
              sx={{ 
                color: "#8F16AD", 
                fontWeight: "bold", 
                position: "absolute", 
                left: "50%", 
                transform: "translateX(-50%)"  // Centers the text
              }}
              >
              Edit
            </Typography>

            {/* Settings Icon - Top Right */}
            <IconButton size="small" onClick={handleEditDateModal}>
              <SettingsIcon />
            </IconButton>

          </Box>
          <Typography variant="h6" style={{ color: "#8F16AD", fontWeight: "bold", marginTop: 2}}> {generateQRDate} </Typography>
          {generateQRDetail === "" ? <></> : <Typography variant="h6" style={{ color: "#8F16AD", fontWeight: "bold" }}> {generateQRDetail} </Typography>}
          <Button variant="contained" color="secondary" sx={{marginTop: 4, fontWeight: 'bold'}} onClick={handleOpenQrConfigModal}>
            Generate QR
          </Button>
        </Box>
      </Modal>

      {/* QR Code Configuration Modal */}
      <Modal open={qrConfigModalOpen} onClose={handleCloseQrConfigModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "white",
            p: 4,
            borderRadius: 2,
            boxShadow: 24,
            width: "300px",
            textAlign: "center",
          }}
        >
          {/* Close (X) Button - Top Left */}
          <IconButton 
            sx={{ position: 'absolute', top: 8, left: 8 }} 
            size="small" 
            onClick={handleCloseQrConfigModal}
          >
            <CloseIcon />
          </IconButton>
          <h2 style={{ color: "#8F16AD", fontWeight: "bold", marginBottom: 4 }}>QR Code Configuration</h2>

          <form>
          {/* Refresh Time Field */}
          <h3 style={{ color: "#8F16AD", fontWeight: "bold" }}>Refresh Time (s)</h3>
          <TextField
            type="number"
            fullWidth
            variant="outlined"
            value={inputRefreshTime}  // Controlled value
            onChange={handleRefreshTimeChange} // Update state on change
            sx={{ mb: 2 }}
            required
          />

          {/* Active Time Field */}
          <h3 style={{ color: "#8F16AD", fontWeight: "bold" }}>Active Time (mins)</h3>
          <TextField
            type="number"
            fullWidth
            variant="outlined"
            value={inputActiveTime}  // Controlled value
            onChange={handleActiveTimeChange} // Update state on change
            sx={{ mb: 2 }}
            required
          />

          {/* Submit Button */}
          <Button variant="contained" color="secondary" fullWidth onClick = {() => setPage("qrGen")}>
            Generate QR code
          </Button>
        </form>
        </Box>
      </Modal>

      {/* editDateModal for Adding Date */}
      <Modal open={editDateModalOpen} onClose={handleCloseEditDateModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "white",
            p: 4,
            borderRadius: 2,
            boxShadow: 24,
            width: "300px",
            textAlign: "center",
          }}
        >
          {/* Close (X) Button - Top Left */}
          <IconButton 
            sx={{ position: 'absolute', top: 8, left: 8 }} 
            size="small" 
            onClick={handleCloseEditDateModal}
          >
            <CloseIcon />
          </IconButton>
          <h2 style={{ color: "#8F16AD", fontWeight: "bold" }}>Select Date</h2>

          <DatePicker selected={selectedDate ? new Date(selectedDate) : null} 
            onChange={handleDateChange} 
            inline />

          <h3 style={{ color: "#8F16AD", fontWeight: "bold", marginTop: "10px" }}>Detail</h3>
          <TextField fullWidth value={detail} onChange={(e) => setDetail(e.target.value)} />

          <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
            <Button variant="contained" color="secondary" onClick={editDate}>
              Save
            </Button>
            <Button variant="contained" color="error" onClick={handleCloseEditDateModal}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* add student modal */}
      <Modal open={addStudentModalOpen} onClose={handleCloseAddStudentModal}>
      <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'white',
            p: 4,
            borderRadius: 2,
            boxShadow: 24,
            width: '400px',
            textAlign: 'center',
          }}
        >
          {/* Close (X) Button - Top Left */}
          <IconButton
            sx={{ position: 'absolute', top: 8, left: 8 }}
            size="small"
            onClick={handleCloseAddStudentModal}
          >
            <CloseIcon />
          </IconButton>
          
          <h2 style={{ color: '#8F16AD', fontWeight: 'bold', marginBottom: 4 }}>Add Student</h2>

          <form>
          {/* Student ID Field */}
          <Grid container spacing={2} alignItems="center" sx={{ mb: 1 }}>
            <Grid item xs={4}>
              <h3 style={{ color: '#8F16AD', fontWeight: 'bold' }}>Student ID</h3>
            </Grid>
            <Grid item xs={8}>
              <TextField
                fullWidth
                variant="outlined"
                name="student_id"
                value={student_id}
                type="text"
                inputProps={{ maxLength: 9, inputMode: "numeric", pattern: "[0-9]*" }}
                onChange={(e) => {
                  const numericValue = e.target.value.replace(/[^0-9]/g, "");
                  setStudent_id(numericValue);
                }}
                required
              />
            </Grid>
          </Grid>


          {/* Student Name Field */}
          <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <Grid item xs={4}>
              <h3 style={{ color: '#8F16AD', fontWeight: 'bold' }}>Student Name</h3>
            </Grid>
            <Grid item xs={8}>
              <TextField
                fullWidth
                variant="outlined"
                name="student_name"
                value={student_name}
                onChange={(e) => setStudent_name(e.target.value)}
                required
              />
            </Grid>
          </Grid>

          {/* Student Email Field */}
          <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <Grid item xs={4}>
              <h3 style={{ color: '#8F16AD', fontWeight: 'bold' }}>Student Email</h3>
            </Grid>
            <Grid item xs={8}>
              <TextField
                fullWidth
                variant="outlined"
                name="student_email"
                value={student_email}
                onChange={(e) => setStudent_email(e.target.value)}
                required
              />
            </Grid>
          </Grid>

          {/* Section (Lecture) Field */}
          <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <Grid item xs={4}>
              <h3 style={{ color: '#8F16AD', fontWeight: 'bold' }}>Section (Lecture)</h3>
            </Grid>
            <Grid item xs={8}>
              <TextField
                fullWidth
                variant="outlined"
                name="section_lec"
                value={section_lec}
                inputProps={{ maxLength: 3, inputMode: "numeric", pattern: "[0-9]*" }}
                onChange={(e) => {
                  const numericValue = e.target.value.replace(/[^0-9]/g, "");
                  setSection_lec(numericValue);
                }}
                required
              />
            </Grid>
          </Grid>

          {/* Section (Lab) Field */}
          <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <Grid item xs={4}>
              <h3 style={{ color: '#8F16AD', fontWeight: 'bold' }}>Section (Lab)</h3>
            </Grid>
            <Grid item xs={8}>
              <TextField
                fullWidth
                variant="outlined"
                name="section_lab"
                value={section_lab}
                inputProps={{ maxLength: 9, inputMode: "numeric", pattern: "[0-9]*" }}
                onChange={(e) => {
                  const numericValue = e.target.value.replace(/[^0-9]/g, "");
                  setSection_lab(numericValue);
                }}
                required
              />
            </Grid>
          </Grid>

          {/* Submit Button */}
          <Button
            variant="contained"
            color="secondary"
            fullWidth
            onClick={handleSubmit}
            sx={{ fontWeight: 'bold' }}
          >
            Confirm
          </Button>
        </form>
        </Box>
      </Modal>

      </Box>):(
        <QRgen time={time} mode={mode} expireTime={expireTime} courseId={course_id}/>
      )
      }
    </>

  );
}

export default Page;
