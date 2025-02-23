"use client";
import React, { useEffect, useState } from "react";
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, IconButton, Paper, Button } from "@mui/material";
import { Plus } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Dynamic columns
const initialColumns = [
  { id: 1, label: "ID" },
  { id: 2, label: "Name" },
];

// Dynamic data
const initStudents = [
  { id: 650610690, name: "John"},
  { id: 650610420, name: "Bob"},
];

function Page() {
  const [columns, setColumns] = useState(initialColumns);
  const [students, setStudents] = useState(initStudents);

  const handleAddColumn = () => {

    setColumns([...columns, { id: columns.length + 1, label: "23/2/68" }]);
  };

  const handleAddStudent = () => {
    setStudents([...students, { id: students.length + 1, name: "New"}]);
  };

  const COLUMN_WIDTH = 150;
  const ACTION_COLUMN_WIDTH = 60; 

  // const fetchTable = () => {
  //   return columns.map((col) => (
  //     <TableCell key={col.id} sx={{ color: "white", fontWeight: "bold" }}>
  //       {col.label}
  //     </TableCell>
  //   ));
  // };

  return (
    <Box sx={{
      minHeight: '100vh',
      bgcolor: '#8F16AD',
      flexDirection: 'column',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      maxWidth: '100%',
      overflowX: "auto",
  }}>
      <Box sx={{flexDirection: 'row', display: 'flex'}}>
        <Button variant="contained" color="secondary" sx={{ marginBottom: 2 }} onClick={handleAddStudent}>Add student</Button>
        <Box sx={{ color: "white", fontWeight: "bold", fontSize: 24, marginBottom: 2 }}>Attendance</Box>
        
      </Box>
      
      <TableContainer component={Paper} sx={{
          borderRadius: 2,
          boxShadow: 3,
          minHeight: '80vh', 
          minWidth: "95%", // Fixed width before scrolling starts
          }}>
        <Table sx = {{ 
            minWidth: columns.length * COLUMN_WIDTH, // Ensure minimum width grows with columns
            tableLayout: "fixed", // Prevent columns from resizing
            }}>
          {/* Table Head */}
          <TableHead>
            <TableRow sx={{ backgroundColor: "#d63384"}}>
            {columns.map((col, index) => (
                <TableCell
                  key={col.id}
                  sx={{
                    width: COLUMN_WIDTH,
                    minWidth: COLUMN_WIDTH,
                    maxWidth: COLUMN_WIDTH,
                    color: "white",
                    fontWeight: "bold",
                    position: index === 0 ? "sticky" : "static", // Fix first column
                    left: index === 0 ? 0 : "auto",
                    backgroundColor: "#d63384",
                    zIndex: index === 0 ? 2 : 1,
                  }}
                >
                  {col.label}
                </TableCell>
              ))}
              <TableCell
              sx = {{
                width: ACTION_COLUMN_WIDTH,
                  minWidth: ACTION_COLUMN_WIDTH,
                  maxWidth: ACTION_COLUMN_WIDTH,
                  position: "sticky",
                  right: 0,
                  backgroundColor: "#d63384",
                  zIndex: 2,
              }}>
                <IconButton color="primary" onClick={handleAddColumn}>
                  <Plus />
                </IconButton>
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
                      position: colIndex === 0 ? "sticky" : "static", // Fix first column
                      left: colIndex === 0 ? 0 : "auto",
                      backgroundColor: colIndex === 0 ? "#f8bbd0" : "inherit",
                      zIndex: colIndex === 0 ? 1 : "auto",
                    }}
                  >
                    {student[col.label.toLowerCase()]}
                  </TableCell>
                ))}
                
                {/* Sticky Rightmost Cell */}
                <TableCell
                  // sx={{
                  //   width: ACTION_COLUMN_WIDTH,
                  //   minWidth: ACTION_COLUMN_WIDTH,
                  //   maxWidth: ACTION_COLUMN_WIDTH,
                  //   position: "sticky",
                  //   right: 0,
                  //   backgroundColor: index % 2 === 0 ? "#fce4ec" : "#f8bbd0",
                  //   zIndex: 1,
                  // }}
                >
                  ...
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default Page;