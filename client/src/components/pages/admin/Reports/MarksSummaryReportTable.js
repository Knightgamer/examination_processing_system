import { Button } from "@mui/material";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";

function MarksSummaryReportTable() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [summaryData, setSummaryData] = useState([]);

  useEffect(() => {
    // Fetch data from your API (replace with your API endpoint)
    axios.get("http://localhost:5000/scores/").then((response) => {
      setData(response.data);
    });
  }, []);

  useEffect(() => {
    // Group data by student, academic year, and semester
    const groupedData = data.reduce((acc, entry) => {
      const studentId = entry.student._id;
      const academicYear = entry.course.academicYear;
      const semester = entry.course.semester;

      if (!acc[studentId]) {
        acc[studentId] = {};
      }

      if (!acc[studentId][academicYear]) {
        acc[studentId][academicYear] = {};
      }

      if (!acc[studentId][academicYear][semester]) {
        acc[studentId][academicYear][semester] = [];
      }

      acc[studentId][academicYear][semester].push(entry);

      return acc;
    }, {});

    // Calculate total marks, mean marks, and recommendation
    const summary = Object.keys(groupedData).map((studentId) => {
      const studentData = groupedData[studentId];
      const studentName =
        studentData[Object.keys(studentData)[0]][
          Object.keys(studentData[Object.keys(studentData)[0]])[0]
        ][0].student.name;

      const studentSummary = {
        studentId,
        studentName,
        summary: [],
      };

      Object.keys(studentData).forEach((academicYear) => {
        Object.keys(studentData[academicYear]).forEach((semester) => {
          const courses = studentData[academicYear][semester];
          const totalAssignmentMarks = courses.reduce(
            (total, course) =>
              total +
              course.assignmentScores.reduce(
                (assignmentTotal, assignment) =>
                  assignmentTotal + assignment.score,
                0
              ),
            0
          );
          const totalCatMarks = courses.reduce(
            (total, course) =>
              total +
              course.catScores.reduce(
                (catTotal, cat) => catTotal + cat.score,
                0
              ),
            0
          );
          const totalExamMarks = courses.reduce(
            (total, course) => total + course.examScore.score,
            0
          );
          const totalMarks =
            totalAssignmentMarks + totalCatMarks + totalExamMarks;
          const meanMarks = totalMarks / courses.length;

          // Define your recommendation logic here (e.g., pass, fail, etc.)
          let recommendation = "Pass";
          if (meanMarks < 50) {
            recommendation = "Fail";
          } else if (meanMarks < 60) {
            recommendation = "Supplementary";
          }

          studentSummary.summary.push({
            academicYear,
            semester,
            assignmentMarks: totalAssignmentMarks,
            catMarks: totalCatMarks,
            examMarks: totalExamMarks,
            totalMarks,
            meanMarks,
            recommendation,
          });
        });
      });

      return studentSummary;
    });

    setSummaryData(summary);
  }, [data]);

  // Function to export data to CSV
  const exportToCSV = () => {
    const csvData = [];
    summaryData.forEach((studentSummary) => {
      studentSummary.summary.forEach((summary) => {
        csvData.push({
          "Student ID": studentSummary.studentId,
          "Student Name": studentSummary.studentName,
          "Academic Year": summary.academicYear,
          Semester: summary.semester,
          "Assignment Marks": summary.assignmentMarks,
          "CAT Marks": summary.catMarks,
          "Exam Marks": summary.examMarks,
          "Total Marks": summary.totalMarks,
          "Mean Marks": summary.meanMarks.toFixed(2),
          Recommendation: summary.recommendation,
        });
      });
    });

    const fileName = "marks_summary_report.csv";
    const headers = [
      { label: "Student ID", key: "Student ID" },
      { label: "Student Name", key: "Student Name" },
      { label: "Academic Year", key: "Academic Year" },
      { label: "Semester", key: "Semester" },
      { label: "Assignment Marks", key: "Assignment Marks" },
      { label: "CAT Marks", key: "CAT Marks" },
      { label: "Exam Marks", key: "Exam Marks" },
      { label: "Total Marks", key: "Total Marks" },
      { label: "Mean Marks", key: "Mean Marks" },
      { label: "Recommendation", key: "Recommendation" },
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
    summaryData.forEach((studentSummary) => {
      studentSummary.summary.forEach((summary) => {
        excelData.push({
          "Student ID": studentSummary.studentId,
          "Student Name": studentSummary.studentName,
          "Academic Year": summary.academicYear,
          Semester: summary.semester,
          "Assignment Marks": summary.assignmentMarks,
          "CAT Marks": summary.catMarks,
          "Exam Marks": summary.examMarks,
          "Total Marks": summary.totalMarks,
          "Mean Marks": summary.meanMarks.toFixed(2),
          Recommendation: summary.recommendation,
        });
      });
    });

    const fileName = "marks_summary_report.xlsx";
    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Marks Summary Report");
    XLSX.writeFile(wb, fileName);
  };

  // Function to export data to PDF
  const exportToPDF = () => {
    const pdfData = [];
    summaryData.forEach((studentSummary) => {
      studentSummary.summary.forEach((summary) => {
        pdfData.push([
          studentSummary.studentId,
          studentSummary.studentName,
          summary.academicYear,
          summary.semester,
          summary.assignmentMarks,
          summary.catMarks,
          summary.examMarks,
          summary.totalMarks,
          summary.meanMarks.toFixed(2),
          summary.recommendation,
        ]);
      });
    });

    const doc = new jsPDF();

    // Use autoTable from jspdf-autotable
    doc.autoTable({
      head: [
        [
          "Student ID",
          "Student Name",
          "Academic Year",
          "Semester",
          "Assignment Marks",
          "CAT Marks",
          "Exam Marks",
          "Total Marks",
          "Mean Marks",
          "Recommendation",
        ],
      ],
      body: pdfData,
    });

    doc.save("marks_summary_report.pdf");
  };

  return (
    <div>
      <h2 className="text-3xl font-semibold text-center mb-8">
        Marks Summary Report
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
        {summaryData.length === 0 ? (
          <p className="text-center mt-4 text-gray-500">
            No matching results found
          </p>
        ) : (
          <div>
            {summaryData.map((studentSummary) => (
              <div key={studentSummary.studentId}>
                <h2 className="text-lg font-semibold mt-4">
                  Student ID: {studentSummary.studentId}
                </h2>
                <h3 className="text-lg font-semibold mt-2">
                  Student Name: {studentSummary.studentName}
                </h3>
                <table className="min-w-full table-auto">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left">Academic Year</th>
                      <th className="px-4 py-2 text-left">Semester</th>
                      <th className="px-4 py-2 text-left">Assignment Marks</th>
                      <th className="px-4 py-2 text-left">CAT Marks</th>
                      <th className="px-4 py-2 text-left">Exam Marks</th>
                      <th className="px-4 py-2 text-left">Total Marks</th>
                      <th className="px-4 py-2 text-left">Mean Marks</th>
                      <th className="px-4 py-2 text-left">Recommendation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentSummary.summary.map((summaryItem, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 text-left">
                          {summaryItem.academicYear}
                        </td>
                        <td className="px-4 py-2 text-left">
                          {summaryItem.semester}
                        </td>
                        <td className="px-4 py-2 text-left">
                          {summaryItem.assignmentMarks}
                        </td>
                        <td className="px-4 py-2 text-left">
                          {summaryItem.catMarks}
                        </td>
                        <td className="px-4 py-2 text-left">
                          {summaryItem.examMarks}
                        </td>
                        <td className="px-4 py-2 text-left">
                          {summaryItem.totalMarks}
                        </td>
                        <td className="px-4 py-2 text-left">
                          {summaryItem.meanMarks}
                        </td>
                        <td className="px-4 py-2 text-left">
                          {summaryItem.recommendation}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MarksSummaryReportTable;
