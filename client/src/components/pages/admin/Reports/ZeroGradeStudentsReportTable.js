import { Button } from "@mui/material";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";

function ZeroGradeStudentsReportTable() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/scores/").then((response) => {
      setData(response.data);
    });
  }, []);

  useEffect(() => {
    // Filter students with a grade of 0 in assignment, CAT, or exam
    const filteredStudents = data.filter((student) => {
      const assignmentScores = student.assignmentScores || [];
      const catScores = student.catScores || [];
      const examScore = student.examScore || {};

      // Check if any of the scores are 0
      if (
        assignmentScores.some((scoreObj) => Number(scoreObj.score) === 0) ||
        catScores.some((scoreObj) => Number(scoreObj.score) === 0) ||
        examScore.score === 0
      ) {
        return true;
      }

      return false;
    });
    setFilteredData(filteredStudents);
  }, [data]);

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
    Object.entries(organizedData).forEach(([year, semesters]) => {
      Object.entries(semesters).forEach(([semester, students]) => {
        students.forEach((student) => {
          csvData.push({
            "Academic Year": year,
            Semester: semester,
            "Student Name": student.student.name,
            "Course Code": student.course.courseCode,
            "Course Name": student.course.courseName,
            "Assignment Grade": student.assignmentScores.join(", "),
            "CAT Grade": student.catScores.join(", "),
            "Exam Grade": student.examScore.score,
          });
        });
      });
    });

    const fileName = "zero_grade_students_report.csv";
    const headers = [
      { label: "Academic Year", key: "Academic Year" },
      { label: "Semester", key: "Semester" },
      { label: "Student Name", key: "Student Name" },
      { label: "Course Code", key: "Course Code" },
      { label: "Course Name", key: "Course Name" },
      { label: "Assignment Grade", key: "Assignment Grade" },
      { label: "CAT Grade", key: "CAT Grade" },
      { label: "Exam Grade", key: "Exam Grade" },
    ];

    const csvExporter = (data, headers, fileName) => {
      const csvData = data.map((row) => {
        return headers.map((header) => {
          return row[header.key];
        });
      });
      csvData.unshift(headers.map((header) => header.label));

      const csv = csvData.map((row) => row.join(",")).join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

      if (navigator.msSaveBlob) {
        // IE 10+
        navigator.msSaveBlob(blob, fileName);
      } else {
        const link = document.createElement("a");
        if (link.download !== undefined) {
          // feature detection
          const url = URL.createObjectURL(blob);
          link.setAttribute("href", url);
          link.setAttribute("download", fileName);
          link.style.visibility = "hidden";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }
    };

    csvExporter(csvData, headers, fileName);
  };

  // Function to export data to Excel
  const exportToExcel = () => {
    const excelData = [];
    Object.entries(organizedData).forEach(([year, semesters]) => {
      Object.entries(semesters).forEach(([semester, students]) => {
        students.forEach((student) => {
          excelData.push({
            "Academic Year": year,
            Semester: semester,
            "Student Name": student.student.name,
            "Course Code": student.course.courseCode,
            "Course Name": student.course.courseName,
            "Assignment Grade": student.assignmentScores.join(", "),
            "CAT Grade": student.catScores.join(", "),
            "Exam Grade": student.examScore.score,
          });
        });
      });
    });

    const fileName = "zero_grade_students_report.xlsx";
    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Zero Grade Students Report");
    XLSX.writeFile(wb, fileName);
  };

  // Function to export data to PDF
  const exportToPDF = () => {
    const pdfData = [];
    Object.entries(organizedData).forEach(([year, semesters]) => {
      Object.entries(semesters).forEach(([semester, students]) => {
        students.forEach((student) => {
          pdfData.push([
            year,
            semester,
            student.student.name,
            student.course.courseCode,
            student.course.courseName,
            student.assignmentScores.join(", "),
            student.catScores.join(", "),
            student.examScore.score,
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
          "Assignment Grade",
          "CAT Grade",
          "Exam Grade",
        ],
      ],
      body: pdfData,
    });

    doc.save("zero_grade_students_report.pdf");
  };

  return (
    <div>
      <h2 className="text-3xl font-semibold text-center mb-8">
        Zero Grade Students Report
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
                          <th className="px-4 py-2 text-left">
                            Assignment Grade
                          </th>
                          <th className="px-4 py-2 text-left">CAT Grade</th>
                          <th className="px-4 py-2 text-left">Exam Grade</th>
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
                              {student.assignmentScores
                                .map((scoreObj) => scoreObj.score)
                                .join(", ")}
                            </td>
                            <td className="px-4 py-2 text-left">
                              {student.catScores
                                .map((scoreObj) => scoreObj.score)
                                .join(", ")}
                            </td>
                            <td className="px-4 py-2 text-left">
                              {student.examScore.score}
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

export default ZeroGradeStudentsReportTable;
