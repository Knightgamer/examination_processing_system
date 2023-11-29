import React from "react";
import FailedReportTable from "./Reports/FailedReportTable";
import SpecialConsiderationStudentsReportTable from "./Reports/SpecialConsiderationStudentsReportTable";
import YearReportsTable from "./Reports/YearReportsTable";

function Reports() {
  return (
    <div>
      <h1 className="text-3xl font-semibold text-center mb-8">Reports</h1>
      {/* <SemesterReportsTable /> */}
      <YearReportsTable />
      <FailedReportTable />
      <SpecialConsiderationStudentsReportTable />
    </div>
  );
}

export default Reports;
