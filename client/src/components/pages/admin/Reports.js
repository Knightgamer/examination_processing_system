import React from "react";
import SemesterReportsTable from "./Reports/SemesterReportsTable";

function Reports() {
  return (
    <div>
      <h1 className="text-3xl font-semibold text-center mb-8">Reports</h1>
      <SemesterReportsTable />
    </div>
  );
}

export default Reports;
