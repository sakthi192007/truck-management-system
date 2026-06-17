import { Component } from '@angular/core';
import {
  FormGroup,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { all_api_service } from 'src/app/service/all_api_service';
import { AuthService } from 'src/app/service/auth.service';
import { NotificationService } from 'src/app/service/notification.service';
import { BookingallocationService } from '../bookingallocation.service';

@Component({
  selector: 'app-bookingallocation',
  templateUrl: './bookingallocation.component.html',
  styleUrl: './bookingallocation.component.css'
})
export class BookingallocationComponent {
  Allocationform!: FormGroup;
  buttontext: string = 'Submit';
  headerdata: string = 'Create Booking Allocation';
  submitted = false;
  vendorselect: any;
  getvendordata: any;
  selectCompanyName: any;
  getinvoiceNumber: any;
  companyselect: any;
  getcompanydata: any;
  getbookingNumber: any;
  roleconcept: any;
  ID: any;
  apkey: any;
  currentuser: any;
  userId: any;
  role_id: any;

  constructor(
    private formBuilder: FormBuilder,
    private APIServies: BookingallocationService,
    private router: Router,
    private authService: AuthService,
    private http: HttpClient,
    private notifyService: NotificationService
  ) {
    this.roleconcept = history.state.roledata;

    this.Allocationform = this.formBuilder.group({
      Vendor: ['', Validators.required],
      company: ['', Validators.required],
      bookingno: ['', Validators.required],
      status: ['', Validators.required]
    });

    if (this.roleconcept && this.roleconcept.length) {
      this.buttontext = 'Update';
      this.headerdata = 'Update Booking Allocation'
      const role = this.roleconcept[0];
      this.apkey = role.ID;

      this.Allocationform.patchValue({
        Vendor: role.Vendor_ID,
        company: role.Client_ID,
        bookingno: role.BookingNumber,
        status: role.Status
      });
    }
  }

 ngOnInit() {
    this.currentuser = this.authService.getCurrentuser();
    this.userId = this.currentuser.id;
    this.role_id = sessionStorage.getItem('User_Roleid');
  this.getAll();
}

getAll() {
  this.APIServies.dropdowngetvendor().subscribe(vendorData => {
    this.vendorselect = vendorData;
    this.getvendordata = this.vendorselect['data'];

    this.APIServies.dropdowngetcompany().subscribe(companyData => {
      this.companyselect = companyData;
      this.getcompanydata = this.companyselect['data'];

      // After loading vendors and companies, check if editing
      if (this.roleconcept && this.roleconcept.length) {
        const role = this.roleconcept[0];
        this.apkey = role.ID;

        // Load booking numbers based on the selected company
        this.APIServies.dropbookingnumbers(role.Client_ID).subscribe(bookingData => {
          this.getbookingNumber = bookingData['data'];

          // Now patch the form values
          this.Allocationform.patchValue({
            Vendor: role.Vendor_ID,
            company: role.Client_ID,
            bookingno: role.BookingNumber,
            status: role.Status
          });

          this.buttontext = 'Update';
        });
      }
    });
  });
}

  onCompanyName(event: any): void {
    this.selectCompanyName = event.target.value;
    this.APIServies.dropbookingnumbers(this.selectCompanyName).subscribe(value => {
      this.vendorselect = value;
      this.getbookingNumber = this.vendorselect['data'];
    });
  }

  submit() {
    this.submitted = true;

    if (this.Allocationform.invalid) {
      return;
    }

    const registerdata = this.Allocationform.value;
  registerdata.CreatedBy=this.userId;
    if (this.buttontext === 'Submit') {
      this.APIServies.insertallocation(registerdata).subscribe(
        data => {
          this.notifyService.showSuccess("Booking allocation added successfully.", "Booking allocation");
          this.Allocationform.reset();
          this.submitted = false;
          setTimeout(() => window.location.reload(), 2000);
            this.router.navigate(['/Allocationgrid'])
        },
        error => {
          this.notifyService.showError("Something went wrong", "Booking allocation");
        }
      );
    } else {
      this.APIServies.updateallocation(this.apkey, registerdata).subscribe(
        data => {
          this.notifyService.showSuccess("Booking allocation updated successfully.", "Booking allocation");
          this.Allocationform.reset();
          this.submitted = false;
          setTimeout(() => window.location.reload(), 2000);
            this.router.navigate(['/Allocationgrid'])
        },
        error => {
          this.notifyService.showError("Something went wrong", "Booking allocation");
        }
      );
    }
  }

  get f() {
    return this.Allocationform.controls;
  }
}
