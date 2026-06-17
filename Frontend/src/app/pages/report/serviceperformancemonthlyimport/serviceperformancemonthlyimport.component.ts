import { Component, OnInit, ViewChild, OnDestroy,AfterViewInit } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';
import { NotificationService } from 'src/app/service/notification.service';
import { Router } from '@angular/router';
import { ReportService } from '../report.service';
import { Subject } from 'rxjs';
import { DataTableService } from '../../data-table.service';
import { DataTableDirective } from 'angular-datatables';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
declare var $: any;
 


@Component({
  selector: 'app-serviceperformancemonthlyimport',
  templateUrl: './serviceperformancemonthlyimport.component.html',
  styleUrl: './serviceperformancemonthlyimport.component.css'
})
export class ServiceperformancemonthlyimportComponent implements OnInit,AfterViewInit {
  currentuser: any;
  userId: any;
  RoleId: any;
  monthlygridimport!: any[];
  tablegridviews: any;
  dtTrigger: Subject<any> = new Subject<any>();
  searchTerm: string = '';
  @ViewChild(DataTableDirective, { static: false })
  tabledetail: any;
  dtOptions: any = {};
  fromDate: string = '';
  toDate: string = '';
  //dtOptions: DataTablesOptions = {};
  dtTrigger1: Subject<any> = new Subject<any>();
  constructor(
    private APIServices: ReportService,
    private router: Router,
    private authService: AuthService,
    private notifyService: NotificationService, private dataTableService: DataTableService
  ) {}
  ngAfterViewInit(): void {
    setTimeout(() => {
      (window as any).initDataTable();
    }, 1000);
  }
  ngOnInit(): void {
    this.currentuser = this.authService.getCurrentuser();
    this.userId = this.currentuser.id;
    this.RoleId = this.currentuser.User_Roleid;
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      aaSorting: [],
      ordering: false,
      processing: true,
      dom: 'Bfrtip',
      destroy: true,
      buttons: [{
        extend: 'pdf',
        title: 'Receipt details',
        footer: true,
        exportOptions: {
          columns: "thead th:not(.noExport)"
        }
      },
      {
        extend: 'excel',
        title: 'Receipt details',
        footer: true,
        exportOptions: {
          columns: "thead th:not(.noExport)"
        }
      },
      {
        extend: 'csv',
        title: 'Receipt details',
        footer: true,
        exportOptions: {
          columns: "thead th:not(.noExport)"
        },
      },
      {
        extend: 'print',
        title: 'Receipt details',
        footer: true,
        exportOptions: {
          columns: "thead th:not(.noExport)"
        },
      },
        // 'colvis'
      ]
    }
    this.getallgrid();
  }
  get filteredData() {
    if (!this.searchTerm && !this.fromDate && !this.toDate) {
        return this.monthlygridimport;
    }

    return this.monthlygridimport.filter(bird => {
        let matchesSearch = true;
        let matchesDateRange = true;

        // Filter by search term
        if (this.searchTerm) {
            matchesSearch = Object.values(bird).some(value => 
                String(value).toLowerCase().includes(this.searchTerm.toLowerCase())
            );
        }

        // Convert booking date to Date object
        const bookingDate = new Date(bird.createdon);
        const from = this.fromDate ? new Date(this.fromDate) : null;
        const to = this.toDate ? new Date(this.toDate) : null;

        // Filter by date range
        if (from && bookingDate < from) {
            matchesDateRange = false;
        }
        if (to && bookingDate > to) {
            matchesDateRange = false;
        }

        return matchesSearch && matchesDateRange;
    });
}
//   get filteredData() {
//     if (!this.searchTerm) {
//         return this.monthlygridimport;
//     }
//     return this.monthlygridimport.filter(bird =>
//         Object.values(bird).some(value => 
//             String(value).toLowerCase().includes(this.searchTerm.toLowerCase())
//         )
//     );
// }
  getallgrid(): void {
    this.APIServices.monthlygridimport(this.userId).subscribe(
      (value) => {
        this.tablegridviews = value;
        this.monthlygridimport = this.tablegridviews['data'];
        console.log(this.monthlygridimport);
        this.dtTrigger.next(this.monthlygridimport);
      },
      (error) => {
        console.error('Error fetching grid data:', error);
      }
    );
  }
  exportToExcel() {
    // Convert the data to a worksheet
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.filteredData);
     const headerMap: any = {
                        Bookingref: 'BOOKING REF',
                        Customername: 'CUSTOMER NAME',
                        createdon: 'BOOKING DATE',
                        generalType: 'CNTR TYPE',
                        Pickuppoint:'PICK-UP POINT',
                        De_StuffingLocation:'DE-STUFFING LOCATION',
                        Clearancepoint:'CLEARANCE POINT',
                        Portgatein:'PORT OF LOADING',
                        Shippername:'SHIPPER NAME'
                       
                      };
                      
                      const range = XLSX.utils.decode_range(worksheet['!ref']!);
                      for (let C = range.s.c; C <= range.e.c; ++C) {
                        const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C });
                        const cell = worksheet[cellAddress];
                        if (cell && cell.v && headerMap[cell.v]) {
                          cell.v = headerMap[cell.v];
                        }
                      }
  
    // Create a new workbook
    const workbook: XLSX.WorkBook = { Sheets: { 'Import': worksheet }, SheetNames: ['Import'] };
  
    // Write the workbook and convert it to a binary string
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  
    // Save the file
    this.saveAsExcelFile(excelBuffer, 'VolumeImportData');
  }
  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    saveAs(data, `${fileName}_${new Date().getTime()}.xlsx`);
  }
}
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';