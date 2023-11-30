import React from "react";
import FailedReportTable from "./Reports/FailedReportTable";
import MarksSummaryReportTable from "./Reports/MarksSummaryReportTable";
import RepeatCourseTable from "./Reports/RepeatCourseTable";
import SpecialConsiderationStudentsReportTable from "./Reports/SpecialConsiderationStudentsReportTable";
import YearReportsTable from "./Reports/YearReportsTable";
import ZeroGradeStudentsReportTable from "./Reports/ZeroGradeStudentsReportTable";

function Reports() {
  return (
    <div>
      <h1 className="text-3xl font-semibold text-center mb-8">Reports</h1>
      {/* <SemesterReportsTable /> */}
      <YearReportsTable />
      <FailedReportTable />
      <SpecialConsiderationStudentsReportTable />
      <ZeroGradeStudentsReportTable />
      <RepeatCourseTable />
      <MarksSummaryReportTable />
    </div>
  );
}

export default Reports;
