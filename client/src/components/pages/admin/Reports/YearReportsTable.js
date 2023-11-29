import { Button } from "@mui/material";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import React, { useEffect, useState } from "react";

function YearReportsTable() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/scores/").then((response) => {
      setData(response.data);
    });
  }, []);

  useEffect(() => {
    // Filter out students with grade 'F'
    const filteredStudents = data.filter((student) => {
      return (
        student.grade !== "F" &&
        (student.student.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
          student.course.courseCode
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          student.course.courseName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          student.course.academicYear
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          student.course.semester
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          student.grade.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    });
    setFilteredData(filteredStudents);
  }, [searchTerm, data]);

  const organizedData = filteredData.reduce((acc, student) => {
    const academicYear = student.course.academicYear;
    const semester = student.course.semester;
    if (!acc[academicYear]) {
      acc[academicYear] = {};
    }
    if (!acc[academicYear][semester]) {
      acc[academicYear][semester] = [];
    }
    acc[academicYear][semester].push(student);
    return acc;
  }, {});

  // Function to export data to CSV
  const exportToCSV = () => {
    const csvData = [];
    Object.entries(organizedData).forEach(([academicYear, semesters]) => {
      Object.entries(semesters).forEach(([semester, students]) => {
        students.forEach((student) => {
          csvData.push({
            "Academic Year": academicYear,
            Semester: semester,
            "Student Name": student.student.name,
            "Course Code": student.course.courseCode,
            "Course Name": student.course.courseName,
            Grade: student.grade,
          });
        });
      });
    });

    const fileName = "year_reports.csv";
    const headers = [
      { label: "Academic Year", key: "Academic Year" },
      { label: "Semester", key: "Semester" },
      { label: "Student Name", key: "Student Name" },
      { label: "Course Code", key: "Course Code" },
      { label: "Course Name", key: "Course Name" },
      { label: "Grade", key: "Grade" },
    ];

    // Export CSV logic here...
  };

  // Function to export data to Excel
  const exportToExcel = () => {
    const excelData = [];
    Object.entries(organizedData).forEach(([academicYear, semesters]) => {
      Object.entries(semesters).forEach(([semester, students]) => {
        students.forEach((student) => {
          excelData.push({
            "Academic Year": academicYear,
            Semester: semester,
            "Student Name": student.student.name,
            "Course Code": student.course.courseCode,
            "Course Name": student.course.courseName,
            Grade: student.grade,
          });
        });
      });
    });

    const fileName = "year_reports.xlsx";

    // Export Excel logic here...
  };

  // Function to export data to PDF
  const exportToPDF = () => {
    const pdfData = [];
    Object.entries(organizedData).forEach(([academicYear, semesters]) => {
      Object.entries(semesters).forEach(([semester, students]) => {
        students.forEach((student) => {
          pdfData.push([
            academicYear,
            semester,
            student.student.name,
            student.course.courseCode,
            student.course.courseName,
            student.grade,
          ]);
        });
      });
    });

    const doc = new jsPDF();

    // Use autoTable from jspdf-autotable
    doc.autoTable({
      head: [
        [
          "Academic Year",
          "Semester",
          "Student Name",
          "Course Code",
          "Course Name",
          "Grade",
        ],
      ],
      body: pdfData,
    });

    doc.save("year_reports.pdf");
  };

  return (
    <div>
      <h2 className="text-3xl font-semibold text-center mb-8">
        Yearly Reports
      </h2>

      <div className="mb-3">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch justify-between">
          <div className="mr-2">
            <Button variant="contained" onClick={exportToCSV}>
              Export to CSV
            </Button>
          </div>
          <div className="mr-2">
            <Button variant="contained" onClick={exportToExcel}>
              Export to Excel
            </Button>
          </div>
          <div className="mr-2">
            <Button variant="contained" onClick={exportToPDF}>
              Export to PDF
            </Button>
          </div>
          <div className="flex-auto">
            <input
              id="datatable-search-input"
              type="search"
              className="relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-transparent bg-clip-padding px-3 py-[0.25rem] text-base font-normal leading-[1.6] text-neutral-700 outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-primary focus:text-neutral-700 focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:focus:border-primary"
              placeholder="Search"
              aria-label="Search"
              aria-describedby="button-addon1"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div id="datatable">
        {Object.keys(organizedData).length === 0 ? (
          <p className="text-center mt-4 text-gray-500">
            No matching results found
          </p>
        ) : (
          <div>
            {Object.entries(organizedData).map(([academicYear, semesters]) => (
              <div key={academicYear}>
                <h2 className="text-lg font-semibold mt-4">{academicYear}</h2>
                {Object.entries(semesters).map(([semester, students]) => (
                  <div key={semester}>
                    <h2 className="text-lg font-semibold mt-2">{semester}</h2>
                    <table className="min-w-full table-auto">
                      <thead>
                        <tr>
                          <th className="px-4 py-2 text-left">Student Name</th>
                          <th className="px-4 py-2 text-left">Course Code</th>
                          <th className="px-4 py-2 text-left">Course Name</th>
                          <th className="px-4 py-2 text-left">Grade</th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.map((student) => (
                          <tr key={student._id}>
                            <td className="px-4 py-2 text-left">
                              {student.student.name}
                            </td>
                            <td className="px-4 py-2 text-left">
                              {student.course.courseCode}
                            </td>
                            <td className="px-4 py-2 text-left">
                              {student.course.courseName}
                            </td>
                            <td className="px-4 py-2 text-left">
                              {student.grade}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default YearReportsTable;
