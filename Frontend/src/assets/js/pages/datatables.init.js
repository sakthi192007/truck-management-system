

function DataTabletow() {
    $(".datatablegrid").DataTable({
        dom: 'Bfrtip',
        lengthChange: !1,
        buttons: ['copy', 'excel', 'pdf', 'colvis'],
        responsive: false
    })
    .buttons()
    .container()
    .appendTo(".datatablegrid_wrapper .col-md-12:eq(0)");

    $(".dataTables_length select").addClass("form-select form-select-sm");
}
function DataTableone() {
    $(".datatablegridsub").DataTable({
        dom: 'Bfrtip',
        lengthChange: !1,
        buttons: ['copy', 'excel', 'pdf', 'colvis'],
        responsive: false
    })
    .buttons()
    .container()
    .appendTo(".datatablegrid_wrapper .col-md-12:eq(0)");

    $(".dataTables_length select").addClass("form-select form-select-sm");
}
window.initDataTable = function() {
   
    DataTabletow();
};
window.initSubDataTable = function() {
   
    DataTableone();
};
window.initSubDataTableromove = function() {
  
    const selector = '.datatablegridsub';

   
    if ($.fn.DataTable.isDataTable(selector)) {
        $(selector).DataTable().clear().destroy();
    }
};


