import { Injectable } from '@angular/core';
declare var $: any;

@Injectable({
  providedIn: 'root'
})
export class DataTableService {

  constructor() { }

  initializeDataTable(selector: string, options: any = {}) {
    $(selector).DataTable(options);
  }

  initializeExportableDataTable(selector: string, options: any = {}) {
    const defaultOptions = {
      lengthChange: false,
      buttons: ["copy", "excel", "pdf", "colvis"]
    };

    options = { ...defaultOptions, ...options };

    const table = $(selector).DataTable(options);
    table.buttons().container().appendTo(`${selector}_wrapper .col-md-6:eq(0)`);

    $(".dataTables_length select").addClass("form-select form-select-sm");
  }
}
