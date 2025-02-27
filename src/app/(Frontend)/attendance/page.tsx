"use client";
import React, { useState } from "react";
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
} from "@mui/material";
import { Plus } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Initial columns
const initialColumns = [
  { id: 1, label: "ID" },
  { id: 2, label: "Name" },
];

// Initial student data
const initStudents = [
  { id: 650610690, name: "John" },
  { id: 650610420, name: "Bob" },
];

function Page() {
  const [columns, setColumns] = useState(initialColumns);
  const [students, setStudents] = useState(initStudents);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [detail, setDetail] = useState("");

  const COLUMN_WIDTH = 150;
  const ACTION_COLUMN_WIDTH = 60;

  // Open Modal
  const handleOpenModal = () => {
    setModalOpen(true);
  };

  // Close Modal
  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedDate(null);
    setDetail("");
  };

  // Handle Date Selection
  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  const fetchColumns = async () => {
    try {
      const courseId = "001001"; // Change this to dynamic if needed
      const response = await fetch(`/api/attendance-api/get/get_date?course_id=${courseId}`);
  
      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.error || "Failed to fetch columns");
        return;
      }
      
      const dates = await response.json();
      console.log(response);
      console.log(dates);
  
      // Convert fetched dates into column objects
      // const formattedColumns = dates.map((date, index) => ({
      //   id: index + 1,
      //   label: date, // Assuming date is in correct format
      // }));
  
      // console.log(formattedColumns);
      // setColumns([{ id: 0, label: "ID" }, { id: 1, label: "Name" }, ...formattedColumns]); // Keeping initial columns
    } catch (error) {
      console.error("Error fetching columns:", error);
      alert("An error occurred while fetching the columns.");
    }
  };
  

  // Add Column with Date
  const handleAddColumn = async () => {
    if (!selectedDate) return; // Ensure a date is selected before proceeding
  
    try {
      selectedDate.setHours(12, 0, 0, 0); // Prevent timezone shift
      const formattedDate = selectedDate.toISOString().split("T")[0]; // Convert to YYYY-MM-DD format
      const response = await fetch("/api/attendance-api/add_date", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: formattedDate,
          description: detail, // Using the 'detail' state
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        alert(data.message); // Show error message if request fails
        return;
      } else {
        alert("susscsfds")
      }
  
      // Add new column on successful API call
      // setColumns([...columns, { id: columns.length + 1, label: formattedDate }]);
      fetchColumns()
      handleCloseModal(); // Close modal
  
    } catch (error) {
      console.error("Error adding column:", error);
      alert("An error occurred while adding the column.");
    }
  };
  

  return (
    <Box
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
      <Box sx={{ flexDirection: "row", display: "flex" }}>
        <Button variant="contained" color="secondary" sx={{ marginBottom: 2 }}>
          Add student
        </Button>
        <Box sx={{ color: "white", fontWeight: "bold", fontSize: 24, marginBottom: 2 }}>
          Attendance
        </Box>
        <IconButton color="primary" onClick={handleOpenModal}>
          <Plus />
        </IconButton>
      </Box>

      {/* Table */}
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 2,
          boxShadow: 3,
          minHeight: "80vh",
          minWidth: "95%", // Fixed width before scrolling starts
        }}
      >
        <Table
          sx={{
            minWidth: columns.length * COLUMN_WIDTH,
            tableLayout: "fixed",
          }}
        >
          {/* Table Head */}
          <TableHead>
            <TableRow sx={{ backgroundColor: "#d63384" }}>
              {columns.map((col, index) => (
                <TableCell
                  key={col.id}
                  sx={{
                    width: COLUMN_WIDTH,
                    minWidth: COLUMN_WIDTH,
                    maxWidth: COLUMN_WIDTH,
                    color: "white",
                    fontWeight: "bold",
                    position: index === 0 ? "sticky" : "static",
                    left: index === 0 ? 0 : "auto",
                    backgroundColor: "#d63384",
                    zIndex: index === 0 ? 2 : 1,
                  }}
                >
                  {col.label}
                </TableCell>
              ))}
              {/* Plus Button - Opens Modal */}
              <TableCell
                sx={{
                  width: ACTION_COLUMN_WIDTH,
                  minWidth: ACTION_COLUMN_WIDTH,
                  maxWidth: ACTION_COLUMN_WIDTH,
                  position: "sticky",
                  right: 0,
                  backgroundColor: "#d63384",
                  zIndex: 2,
                }}
              >
              </TableCell>
            </TableRow>
          </TableHead>

          {/* Table Body */}
          <TableBody>
            {students.map((student, index) => (
              <TableRow key={index} sx={{ backgroundColor: index % 2 === 0 ? "#fce4ec" : "#f8bbd0" }}>
                {columns.map((col, colIndex) => (
                  <TableCell
                    key={col.id}
                    sx={{
                      width: COLUMN_WIDTH,
                      minWidth: COLUMN_WIDTH,
                      maxWidth: COLUMN_WIDTH,
                      position: colIndex === 0 ? "sticky" : "static",
                      left: colIndex === 0 ? 0 : "auto",
                      backgroundColor: colIndex === 0 ? "#f8bbd0" : "inherit",
                      zIndex: colIndex === 0 ? 1 : "auto",
                    }}
                  >
                    {student[col.label.toLowerCase()] || "..."}
                  </TableCell>
                ))}
                <TableCell>...</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal for Adding Date */}
      <Modal open={modalOpen} onClose={handleCloseModal}>
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
          <h2 style={{ color: "#8F16AD", fontWeight: "bold" }}>selected Date</h2>

          {/* Date Input Field */}
          <TextField
            value={selectedDate ? selectedDate.toLocaleDateString() : ""}
            placeholder="MM/DD/YYYY"
            fullWidth
            sx={{ marginBottom: 2 }}
            onClick={(e) => e.stopPropagation()}
          />

          {/* Calendar Date Picker */}
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            inline
          />

          <h3 style={{ color: "#8F16AD", fontWeight: "bold", marginTop: "10px" }}>Detail</h3>
          <TextField
            fullWidth
            sx={{ marginBottom: 2 }}
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
          />

          {/* Action Buttons */}
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Button variant="contained" color="secondary" onClick={handleAddColumn}>
              ADD
            </Button>
            <Button variant="contained" color="inherit" onClick={handleCloseModal}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}

export default Page;
