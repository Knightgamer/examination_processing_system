// // npm package: datatables.net-bs5
// // github link: https://github.com/DataTables/Dist-DataTables-Bootstrap5

// $(function () {
//   "use strict";

//   $(function () {
//     var table = $("#dataTableExample").DataTable({
//       aLengthMenu: [
//         [10, 30, 50, -1],
//         [10, 30, 50, "All"],
//       ],
//       iDisplayLength: 10,
//       language: {
//         search: "",
//       },
//       dom: "lBfrtip",
//       buttons: [
//         {
//           extend: "copy",
//           text: "Copy",
//           className: "btn mt-3 btn-primary btn-sm",
//           exportOptions: {
//             columns: ":not(:last-child)", // Exclude the last column
//           },
//         },
//         {
//           extend: "csv",
//           text: "CSV",
//           className: "btn mt-3 btn-primary btn-sm",
//           exportOptions: {
//             columns: ":not(:last-child)",
//           },
//         },
//         {
//           extend: "excel",
//           text: "Excel",
//           className: "btn mt-3 btn-primary btn-sm",
//           exportOptions: {
//             columns: ":not(:last-child)",
//           },
//         },
//         {
//           extend: "pdf",
//           text: "PDF",
//           className: "btn mt-3 btn-primary btn-sm",
//           exportOptions: {
//             columns: ":not(:last-child)",
//           },
//         },
//         {
//           extend: "print",
//           text: "Print",
//           className: "btn mt-3 btn-primary btn-sm",
//           exportOptions: {
//             columns: ":not(:last-child)",
//           },
//         },
//       ],
//     });

//     $("#dataTableExample").each(function () {
//       var datatable = $(this);
//       var search_input = datatable
//         .closest(".dataTables_wrapper")
//         .find("div[id$=_filter] input");
//       search_input.attr("placeholder", "Search");
//       search_input.removeClass("form-control-sm");
//       var length_sel = datatable
//         .closest(".dataTables_wrapper")
//         .find("div[id$=_length] select");
//       length_sel.removeClass("form-control-sm");
//     });
//   });
// });
