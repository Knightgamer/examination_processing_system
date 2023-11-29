import React from "react";
import SemesterReportsTable from "./Reports/SemesterReportsTable";
import YearReportsTable from "./Reports/YearReportsTable";

function Reports() {
  return (
    <div>
      <h1 className="text-3xl font-semibold text-center mb-8">Reports</h1>
      <SemesterReportsTable />
      <YearReportsTable />
    </div>
  );
}

export default Reports;
