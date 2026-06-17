import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  FormControl,
} from '@angular/forms';
import { AuthService } from 'src/app/service/auth.service';
import { Router } from '@angular/router';
import { PODService } from '../documentation.service';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from 'src/app/service/notification.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-doccreation',
  standalone: false,
  templateUrl: './doccreation.component.html',
  styleUrl: './doccreation.component.css'
})
export class DoccreationComponent implements OnInit {
  lrform!: FormGroup;
  submitted = false;
  showTerms: boolean = false;
  termsAccepted: boolean = false;
  bookings: any[] = [];
  selectedBooking: any = null;
  savedPdfUrl:any;
  lrpdf:any;
  fileName:any;

  userId:any;
RoleId:any;
currentuser:any;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private PODService: PODService,
     private http: HttpClient,
     private notifyService: NotificationService
  ) {}

ngOnInit(): void {
   this.currentuser = this.authService.getCurrentuser();
    this.userId = this.currentuser.id;

    this.loadBookings();
    this.lrform = this.fb.group({
     BookingNo: ['', Validators.required],
      Consignmentnoteno: [''],
      Sealno: [''],
      ShipmentType: this.fb.array([]),
      ConsignmentDate: [''],
      Company: [''],
      PoliceNo: [''],
      Amount: [''],
      Date: [''],
      Risk: [''],
      ConsignornameAdd: [''],
      ConsigneenameAdd: [''],
      FromAdd: [''],
      ToAdd: [''],
      Containerno: [''],
      Driverno: [''],
      Noofpkgspallets: [''],
      CustomerinvoiceNo: [''],
      Customerinvoice: [''],
      Natureofgoods: [''],
      WeightGross: [''],
      WeightChargeable: [''],
      FreightPaid: [''],
      FreightToPay: [''],
      SurchargePaid: [''],
      SurchargeToPay: [''],
      CpchPaid: [''],
      CpchToPay: [''],
      StchPaid: [''],
      StchToPay: [''],
      HAMALIchPaid: [''],
      HAMALIchToPay: [''],
      RiskrsPaid: [''],
      RiskrsToPay: [''],
      ServicechPaid: [''],
      ServicechToPay: [''],
      GrandTotalPaid: [''],
      GrandTotalToPay: [''],
      FreightTopayorPaid: [''],
      Valuers: [''],
      Privatemark: [''],
      Remarks: [''],
      
    });
  }
loadBookings(): void {
  this.PODService.getbooking(this.userId).subscribe(value => {
      const tablegridviews = value;
      this.bookings = tablegridviews['data'];
    });
}
onBookingChange(event: any): void {
  const bookingNumber = event.target.value;
  this.PODService.getBookingDetails(bookingNumber).subscribe({
    next: (res: any) => {
      if (res?.data) {
        this.lrform.patchValue({
          Sealno: res.data.Sealno,
          Containerno: res.data.Containerno,
          Company: res.data.Company,
          PoliceNo: res.data.PoliceNo
        });
      } else {
        this.lrform.patchValue({
          Sealno: '',
          Containerno: '',
          Company: '',
          PoliceNo: ''
        });
      }
    },
    error: (err) => {
       this.notifyService.showSuccess("Failed to load booking details", "LRCopy");
      this.lrform.patchValue({
        Sealno: '',
        Containerno: '',
        Company: '',
        PoliceNo: ''
      });
    }
  });
}

get f() {
    return this.lrform.controls;
  }

onShipmentTypeChange(event: any) {
    const shipmentArray: FormArray = this.lrform.get(
      'ShipmentType'
    ) as FormArray;

    if (event.target.checked) {
      shipmentArray.push(new FormControl(event.target.value));
    } else {
      const index = shipmentArray.controls.findIndex(
        (x) => x.value === event.target.value
      );
      if (index !== -1) {
        shipmentArray.removeAt(index);
      }
    }
  }

submit() {
  this.submitted = true;

 this.userId = this.currentuser.id;
     this.RoleId = this.currentuser.User_Roleid;
       
      
   
  const formData = this.lrform.value;

  // Ensure PDF is generated before inserting POD
  this.convertPDF(formData);
}

convertPDF(formData: any) {
  formData.PoliceNo = formData.PoliceNo || 'NA';

  this.PODService.generatePDF(formData).subscribe({
    next: (res: any) => {
      if (res.success) {
        

        this.savedPdfUrl = res.file;
        this.fileName = res.file.split('/').pop();
        formData.pdf_url = this.fileName;

        const shipmentArray: FormArray = this.lrform.get('ShipmentType') as FormArray;
        formData.Shipmenttype = shipmentArray.value.join(',');

        // 👉 Now call insertPOD only after PDF is ready
        this.PODService.insertPOD(formData, this.userId).subscribe({
          next: (res: any) => {
           this.notifyService.showSuccess("POD inserted successfully", "POD");
            this.submitted = false;
          },
          error: (err) => {
           this.notifyService.showSuccess("Failed to insert POD", "POD");
            this.submitted = false;
          },
        });

      } else {
       
        this.submitted = false;
      }
    },
    error: (err) => {
     
      this.submitted = false;
    },
  });
}




acceptTerms() {
   
  }

goBack() {}
}
