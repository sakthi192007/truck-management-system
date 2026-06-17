import { Component } from '@angular/core';
//import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';
import { NotificationService } from 'src/app/service/notification.service';
import { Router } from '@angular/router';
import { ReportService } from '../report.service';
import { Subject } from 'rxjs';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
@Component({
  selector: 'app-service-performance-export',
  templateUrl: './service-performance-export.component.html',
  styleUrl: './service-performance-export.component.css'
})
export class ServicePerformanceExportComponent {
  currentuser: any;
  userId: any;
  RoleId: any;
  exportreportgrid!: any[];
  tablegridviews: any;
  dtTrigger: Subject<any> = new Subject<any>();
  searchTerm: string = '';
  fromDate: string = '';
  toDate: string = '';
  constructor(
    private APIServices: ReportService,
    private router: Router,
    private authService: AuthService,
    private notifyService: NotificationService
  ) { }
  ngOnInit(): void {
    this.currentuser = this.authService.getCurrentuser();
    this.userId = this.currentuser.id;
    this.RoleId = this.currentuser.User_Roleid;

    this.getallgrid();
  }
  //   applyDateFilter() {
  //     this.filteredData; 
  // }

  get filteredData() {
    if (!this.searchTerm && !this.fromDate && !this.toDate) {
      return this.exportreportgrid;
    }

    return this.exportreportgrid.filter(bird => {
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
  //         return this.exportreportgrid;
  //     }
  //     return this.exportreportgrid.filter(bird =>
  //         Object.values(bird).some(value => 
  //             String(value).toLowerCase().includes(this.searchTerm.toLowerCase())
  //         )
  //     );
  // }
  getallgrid(): void {
    this.APIServices.exportreportgrid(this.userId).subscribe(
      (value) => {
        this.tablegridviews = value;
        this.exportreportgrid = this.tablegridviews['data'];
        console.log(this.exportreportgrid);
        this.dtTrigger.next(this.exportreportgrid);
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
      CompanyName: 'CUSTOMER NAME',
      createdon: 'BOOKING DATE',
      containernumber: 'CONTAINER NO',
      Stuffing_Location: 'STUFFING POINT',
      ShipperName: 'SHIPPER NAME',
      EMPTYYARD_EDT: 'EMPTY YARD - ESTIMATED',
      EMPTYYARD_ADT: 'EMPTY YARD - ACTUAL',
      EMPTYCNTRLOAD_EDT: 'EMPTY CNTR LOAD - ESTIMATED',
      EMPTYCNTRLOAD_ADT: 'EMPTY CNTR LOAD - ACTUAL',
      FACTORYGATEIN_EDT: 'FACTORY GATE IN - ESTIMATED',
      FACTORYGATEIN_ADT: 'FACTORY GATE IN - ACTUAL',
      FACTORYGATEOUT_EDT: 'FACTORY GATE OUT - ESTIMATED',
      FACTORYGATEOUT_ADT: 'FACTORY GATE OUT - ACTUAL',
      CFSGATEIN_EDT: 'CFS GATE IN - ESTIMATED',
      CFSGATEIN_ADT: 'CFS GATE IN - ACTUAL',
      CFSGATEOUT_EDT: 'CFS GATE OUT - ESTIMATED',
      CFSGATEOUT_ADT: 'CFS GATE OUT - ACTUAL',
      PORTGATEIN_EDT: 'PORT GATE IN - ESTIMATED',
      PORTGATEIN_ADT: 'PORT GATE IN - ACTUAL'

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
    const workbook: XLSX.WorkBook = { Sheets: { 'Export': worksheet }, SheetNames: ['Export'] };

    // Write the workbook and convert it to a binary string
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    // Save the file
    this.saveAsExcelFile(excelBuffer, 'Serviceperformanceexport');
  }
  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    saveAs(data, `${fileName}_${new Date().getTime()}.xlsx`);
  }

}
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';