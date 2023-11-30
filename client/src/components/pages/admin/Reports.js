import React, { useState } from "react";
import FailedReportTable from "./Reports/FailedReportTable";
import MarksSummaryReportTable from "./Reports/MarksSummaryReportTable";
import RepeatCourseTable from "./Reports/RepeatCourseTable";
import SpecialConsiderationStudentsReportTable from "./Reports/SpecialConsiderationStudentsReportTable";
import YearReportsTable from "./Reports/YearReportsTable";
import ZeroGradeStudentsReportTable from "./Reports/ZeroGradeStudentsReportTable";

function Reports() {
  const [activeTab, setActiveTab] = useState("YearReports"); // Default to Year Reports tab

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  return (
    <div>
      <h1 className="text-3xl font-semibold text-center mb-8">Reports</h1>
      <div className="flex justify-center space-x-4 mb-8">
        {/* Buttons for each report */}
        <button
          className={`${
            activeTab === "YearReports"
              ? "bg-blue-500 text-white"
              : "bg-gray-300"
          } px-4 py-2 rounded`}
          onClick={() => handleTabClick("YearReports")}
        >
          Year Reports
        </button>
        <button
          className={`${
            activeTab === "FailedReport"
              ? "bg-blue-500 text-white"
              : "bg-gray-300"
          } px-4 py-2 rounded`}
          onClick={() => handleTabClick("FailedReport")}
        >
          Failed Report
        </button>
        <button
          className={`${
            activeTab === "SpecialConsideration"
              ? "bg-blue-500 text-white"
              : "bg-gray-300"
          } px-4 py-2 rounded`}
          onClick={() => handleTabClick("SpecialConsideration")}
        >
          Special Consideration
        </button>
        <button
          className={`${
            activeTab === "ZeroGradeStudents"
              ? "bg-blue-500 text-white"
              : "bg-gray-300"
          } px-4 py-2 rounded`}
          onClick={() => handleTabClick("ZeroGradeStudents")}
        >
          Zero Grade Students
        </button>
        <button
          className={`${
            activeTab === "RepeatCourse"
              ? "bg-blue-500 text-white"
              : "bg-gray-300"
          } px-4 py-2 rounded`}
          onClick={() => handleTabClick("RepeatCourse")}
        >
          Repeat Course
        </button>
        <button
          className={`${
            activeTab === "MarksSummary"
              ? "bg-blue-500 text-white"
              : "bg-gray-300"
          } px-4 py-2 rounded`}
          onClick={() => handleTabClick("MarksSummary")}
        >
          Marks Summary
        </button>
      </div>

      {/* Render the selected report */}
      {activeTab === "YearReports" && <YearReportsTable />}
      {activeTab === "FailedReport" && <FailedReportTable />}
      {activeTab === "SpecialConsideration" && (
        <SpecialConsiderationStudentsReportTable />
      )}
      {activeTab === "ZeroGradeStudents" && <ZeroGradeStudentsReportTable />}
      {activeTab === "RepeatCourse" && <RepeatCourseTable />}
      {activeTab === "MarksSummary" && <MarksSummaryReportTable />}
    </div>
  );
}

export default Reports;
