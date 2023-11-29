import React from "react";
import FailedReportTable from "./Reports/FailedReportTable";
import YearReportsTable from "./Reports/YearReportsTable";

function Reports() {
  return (
    <div>
      <h1 className="text-3xl font-semibold text-center mb-8">Reports</h1>
      {/* <SemesterReportsTable /> */}
      <YearReportsTable />
      <FailedReportTable />
    </div>
  );
}

export default Reports;
