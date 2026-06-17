import { Component} from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';
import { NotificationService } from 'src/app/service/notification.service';
import { Router } from '@angular/router';
import { ReportService } from '../report.service';
import { Subject } from 'rxjs';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';


@Component({
  selector: 'app-importvendorperformancereport',
  templateUrl: './importvendorperformancereport.component.html',
  styleUrl: './importvendorperformancereport.component.css'
})
export class ImportvendorperformancereportComponent {
  currentuser: any;
  userId: any;
  RoleId: any;
  vendorreportimportgrid!: any[];
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
  ) {}
  ngOnInit(): void {
    this.currentuser = this.authService.getCurrentuser();
    this.userId = this.currentuser.id;
    this.RoleId = this.currentuser.User_Roleid;

    this.getallgrid();
  }
  get filteredData() {
    if (!this.searchTerm && !this.fromDate && !this.toDate) {
        return this.vendorreportimportgrid;
    }

    return this.vendorreportimportgrid.filter(bird => {
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
//         return this.vendorreportimportgrid;
//     }
//     return this.vendorreportimportgrid.filter(bird =>
//         Object.values(bird).some(value => 
//             String(value).toLowerCase().includes(this.searchTerm.toLowerCase())
//         )
//     );
// }
getallgrid(): void {
  this.APIServices.vendorreportimportgrid(this.userId).subscribe(
    (value) => {
      this.tablegridviews = value;
      this.vendorreportimportgrid = this.tablegridviews['data'];
      console.log(this.vendorreportimportgrid);
      this.dtTrigger.next(this.vendorreportimportgrid);
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
        VendorName: 'VENDOR NAME',
        BookingNumber: 'BOOKING No',
        bookingdate: 'BOOKING DATE',
        ContainerType: 'CONTAINER TYPE',
        PickupLocation: 'PICKUP LOCATION',
        StuffingLocation: 'STUFFING LOCATION',
        UnloadingLocation: 'PORT OF LOADING',
        InvoiceNumber: 'INVOICE NUMBER',
        InvoiceDate: 'INVOICE DATE',
        SubTotal: 'SUBTOTAL',
        GSTAmount: 'GST',
        CGSTAmount: 'CGST',
        IGSTAmount: 'IGST',
        GrandTotal: 'GRANDTOTAL',
        InvoiceDueDate: 'PAYMENT DUE DATE'
  
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
  this.saveAsExcelFile(excelBuffer, 'VendorImportData');
}
private saveAsExcelFile(buffer: any, fileName: string): void {
  const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
  saveAs(data, `${fileName}_${new Date().getTime()}.xlsx`);
}
}
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';