import { Component} from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';
import { NotificationService } from 'src/app/service/notification.service';
import { Router } from '@angular/router';
import { ReportService } from '../report.service';
import { Subject } from 'rxjs';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-tdsinvoicereport',
  templateUrl: './tdsinvoicereport.component.html',
  styleUrl: './tdsinvoicereport.component.css'
})
export class TdsinvoicereportComponent {
currentuser: any;
    userId: any;
    RoleId: any;
    tdsdatareportgrid!: any[];
    tablegridviews: any;
    dtTrigger: Subject<any> = new Subject<any>();
    searchTerm: string = '';
    fromDate: string = '';
    toDate: string = '';
  tdsreportgrid: any;
    constructor(
        private APIServices: ReportService,
        private router: Router,
        private authService: AuthService,
        private notifyService: NotificationService
      ) {}
      ngOnInit(): void {
        this.currentuser = this.authService.getCurrentuser();
        this.userId = this.currentuser.id;
        this.RoleId = this.currentuser.User_Roleid;
    
        this.getallgrid();
      }
       get filteredData() {
    if (!this.searchTerm && !this.fromDate && !this.toDate) {
        return this.tdsreportgrid;
    }

    return this.tdsdatareportgrid.filter(bird => {
        let matchesSearch = true;
        let matchesDateRange = true;
        // Filter by search term
        if (this.searchTerm) {
            matchesSearch = Object.values(bird).some(value => 
                String(value).toLowerCase().includes(this.searchTerm.toLowerCase())
            );
        }

        // Convert booking date to Date object
        const Paymentdate = new Date(bird.Paymentdate);
        const from = this.fromDate ? new Date(this.fromDate) : null;
        const to = this.toDate ? new Date(this.toDate) : null;

        // Filter by date range
        if (from && Paymentdate < from) {
            matchesDateRange = false;
        }
        if (to && Paymentdate > to) {
            matchesDateRange = false;
        }

        return matchesSearch && matchesDateRange;
    });
}
getallgrid(): void {
  this.APIServices.tdsreportgrid(this.userId).subscribe(
    (value) => {
      this.tablegridviews = value;
      this.tdsreportgrid = this.tablegridviews['data'];
      console.log(this.tdsreportgrid);
      this.dtTrigger.next(this.tdsreportgrid);
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
  PANNumber: 'PAN Number',
  CompanyName: 'Company Name',
  Branch:'Party State',
  GrandTotal: 'Amount of Payment',
  Paymentdate: 'Month',
  TDS:'TDS',
  TDSAmount:'TDS Amount'
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
  this.saveAsExcelFile(excelBuffer, 'TDSreportData');
}
private saveAsExcelFile(buffer: any, fileName: string): void {
  const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
  saveAs(data, `${fileName}_${new Date().getTime()}.xlsx`);
}
}
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

