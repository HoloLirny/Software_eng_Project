// TODO: config qr code modal
// TODO: download button
// TODO: add student button
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
} from "@mui/material";
import { Plus } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SettingsIcon from '@mui/icons-material/Settings';
import CloseIcon from '@mui/icons-material/Close';

function Page({ course_id = "261361", pages, setPages }) {
  const [columns, setColumns] = useState([]);
  const [students, setStudents] = useState<{ id: string; name: string }[]>([]);
  const [attendanceData, setAttendanceData] = useState([]); // Store attendance API response
  const [addDateModalOpen, setaddDateModalOpen] = useState(false);
  const [genQRModalOpen, setGenQRModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [detail, setDetail] = useState("");
  const [generateQRDate, setGenerateQRDate] = useState("");
  const [generateQRDetail, setGenerateQRDetail] = useState("");
  const [qrConfigModalOpen, setQrConfigModalOpen] = useState(false);
  const [inputActiveTime, setInputActiveTime] = useState(10);
  const [inputRefreshTime, setInputRefreshTime] = useState(5);
  const [time, setTime] = useState(60 * 10); // 10 minutes
  const [mode, setMode] = useState("time");
  const [expireTime, setExpireTime] = useState(5) // 5 seconds
  
  const COLUMN_WIDTH = 150;

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

  const fetchStudenInClass = async () => {
    try {
      const response = await fetch(`/api/student-api/get/get_by_course_id?course_id=${course_id}`);
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
      const response = await fetch(`/api/attendance-api/get/get_all_attendance`);
      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.error || "Failed to fetch attendance data");
        return;
      }

      const data = await response.json();
      const filteredData = data.filter((record) => record.course_id === course_id);

      setAttendanceData(filteredData);
    } catch (error) {
      console.error("Error fetching attendance data:", error);
      alert("An error occurred while fetching attendance data.");
    }
  };

  // Fetch Columns (Dates)
  const fetchColumns = async () => {
    try {
      const response = await fetch(`/api/attendance-api/get/get_date?course_id=${course_id}`);
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
    if (!selectedDate) return;

    try {
      selectedDate.setHours(12, 0, 0, 0);
      const formattedDate = selectedDate.toISOString().split("T")[0];

      const response = await fetch("/api/attendance-api/add_date", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: formattedDate, description: detail, course_id }),
      });

      const data = await response.json();
      if (!response.ok) {
        alert(data.message);
        return;
      }

      alert("Date Added Successfully");
      fetchColumns();
      handleCloseaddDateModal();
    } catch (error) {
      console.error("Error adding column:", error);
      alert("An error occurred while adding the column.");
    }
  };

  // Check if student is present on a given date
  const isStudentPresent = (studentId, date) => {
    return attendanceData.some(
      (record) => record.student_id === String(studentId) && record.attendance_detail?.date === date
    );
  };

  const handleAddStudent = () => {
    const student_id = "651651651";
    const student_name = "New student";

    setStudents([...students, { id: student_id, name: student_name }]);
  }

  useEffect(() => {
    fetchAttendanceData();
    fetchStudenInClass();
    fetchColumns();
  }, []);

  return (
    <>
      {
      (<Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#8F16AD",
          flexDirection: "column",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          maxWidth: "100%",
          overflowX: "auto",
        }}
      >

      <Button
        onClick={() => setPages("courseconfig")}
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

      <Box sx={{ flexDirection: "row", display: "flex" }}>
        <Button variant="contained" color="secondary" sx={{ marginBottom: 2 }} onClick={handleAddStudent}>
          Add student
        </Button>
        <Box sx={{ color: "white", fontWeight: "bold", fontSize: 24, marginBottom: 2 }}>
          Attendance
        </Box>
        <IconButton 
          color="primary" 
          onClick={handleOpenaddDateModal} 
          sx={{ 
            fontSize: 32, 
            color: "#ffcc00", // Bright yellow to attract attention
            backgroundColor: "#ffffff",
            transition: "transform 0.2s",
            "&:hover": { 
              transform: "scale(1.2)", 
              color: "#ffd700" // Slightly brighter on hover
            } 
          }}
        >
          <Plus size={40} />
        </IconButton>
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
            <TableRow sx={{ backgroundColor: "#d63384", flexDirection: "row", display: "flex" }}>
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
                    backgroundColor: "#d63384",
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
                sx={{ backgroundColor: index % 2 === 0 ? "#fce4ec" : "#f8bbd0", flexDirection: "row", display: "flex"}}
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
                      backgroundColor: colIndex === 0 ? "#f8bbd0" : "inherit",
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

          <DatePicker selected={selectedDate} onChange={setSelectedDate} inline />

          <h3 style={{ color: "#8F16AD", fontWeight: "bold", marginTop: "10px" }}>Detail</h3>
          <TextField fullWidth value={detail} onChange={(e) => setDetail(e.target.value)} />

          <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
            <Button variant="contained" color="secondary" onClick={handleAddColumn}>
              ADD
            </Button>
            <Button variant="contained" color="inherit" onClick={handleCloseaddDateModal}>
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
            <IconButton size="small" onClick={handleOpenQrConfigModal}>
              <SettingsIcon />
            </IconButton>
          </Box>
          <Typography variant="h6" style={{ color: "#8F16AD", fontWeight: "bold", marginTop: 2}}> {generateQRDate} </Typography>
          {generateQRDetail === "" ? <></> : <Typography variant="h6" style={{ color: "#8F16AD", fontWeight: "bold" }}> {generateQRDetail} </Typography>}
          <Button variant="contained" color="secondary" sx={{marginTop: 4}} onClick={() =>  {setPages("qrGen");}}>
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
          <Button variant="contained" color="primary" fullWidth onClick = {handleCloseQrConfigModal}>
            Save
          </Button>
        </form>
        </Box>
      </Modal>

      </Box>)
      }
    </>

  );
}

export default Page;
