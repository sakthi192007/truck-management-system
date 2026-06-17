import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientService } from '../client.service';
import { AuthService } from 'src/app/service/auth.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from 'src/app/service/notification.service';
import { environment } from 'src/environments/environment';
import { emailExistsValidator } from 'src/app/core/email-vaildators';

import { gstValidator, panValidator, emailValidator, phoneNumberValidator } from 'src/app/core/gst-validator';
@Component({
  selector: 'app-createclient',
  templateUrl: './createclient.component.html',
  styleUrl: './createclient.component.css'
})
export class CreateclientComponent {


  gstfile: any;
  panfile: any;

  countrydata!: any[];
  statedata!: any[];
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  fmedit = 'false';
  clientform!: FormGroup;
  submitted = false;
  currentuser: any = '';
  userId!: number;
  error = 'false';
  Success = 'false';
  errortext: string = '';
  successtext: string = '';
  agencykey: string = '';
  buttontext: string = 'Submit';
  retainerkey: string = '';
  roleconcept: any;
  getdata: any;

  agencydetails: any;
  assigndatadetails: any;
  countrydetails: any;
  statedetails: any;
  countryselect: any;
  stateselect: any;
  clientkeys: any;
  isvehActive = false;
  //sme_files: File[] = [];
  sme_files: any;
  tin_files: any;
  other_files: any
  Client_Id: any;
  roc_files: any;
  views: any;
  getcustomerdata: any;
  custdata: any;
  customerselect: any;
  RoleId: any;

  //file
  pan_fileup: any;
  gst_fileup: any;
  tinfilesup: any;
  smefilesup: any;
  rocfilesup: any;
  otherfilesup: any;

  businessselect: any;
  businessdata: any;

  isUpdateMode: any;
  isViewMode: any;
  allclientdetaildata: any;
  Client_ID:any;

  constructor(private formBuilder: FormBuilder, private APIServies: ClientService, private router: Router, private authService: AuthService, private http: HttpClient, private notifyService: NotificationService) {
    this.roleconcept = history.state.roledata;
    this.views = history.state.views;



    if (this.roleconcept === 'Update') {
      this.fmedit = 'false';
    } else {
      this.fmedit = 'true';
    }
    this.clientform = this.formBuilder.group({
      holder_name: this.formBuilder.control('', [Validators.required]),
      bank_account: this.formBuilder.control('', [Validators.required]),
      bank_name: this.formBuilder.control('', [Validators.required]),
      ifsc_code: this.formBuilder.control('', [Validators.required]),
      branch: this.formBuilder.control('', [Validators.required]),
      bank_add: this.formBuilder.control(''),
      Business: this.formBuilder.control(''),

      first_name: this.formBuilder.control('', [Validators.required]),
      landline: this.formBuilder.control(''),
      company_name: this.formBuilder.control('', [Validators.required]),
      department: this.formBuilder.control('', [Validators.required]),
      city: this.formBuilder.control('', [Validators.required]),
      state: this.formBuilder.control('', [Validators.required]),
      country: this.formBuilder.control('', [Validators.required]),
      postal: this.formBuilder.control('', [Validators.required]),
      company_add: this.formBuilder.control('', [Validators.required]),
      company_add1: this.formBuilder.control(''),
      roc: this.formBuilder.control(''),
      description: this.formBuilder.control(''),
      status: this.formBuilder.control('', [Validators.required]),
      msme: this.formBuilder.control(''),
      tin_tan: this.formBuilder.control(''),

email: this.formBuilder.control(
  '',
  {
    validators: [Validators.required, emailValidator()],
    asyncValidators: [emailExistsValidator(this.APIServies)],
    updateOn: 'blur' // ✅ important to trigger async validation on leaving the field
  }
),
      phone_number: ['', [Validators.required, phoneNumberValidator()]],
      pan: ['', [Validators.required, panValidator()]],
      gst: ['', [Validators.required, gstValidator()]]

    });
    if (this.roleconcept == '' || this.roleconcept == undefined) {

    } else {
      this.buttontext = 'Update';
      let formvalues = {

        first_name: this.roleconcept.FirstName,
        landline: this.roleconcept.landline,
        company_name: this.roleconcept.CompanyName,
        department: this.roleconcept.Department,
        email: this.roleconcept.Email,
        phone_number: this.roleconcept.PhoneNumber,
        city: this.roleconcept.City,
        state: this.roleconcept.State,
        country: this.roleconcept.Country,
        postal: this.roleconcept.Zipcode,
        Business: this.roleconcept.Business,
        company_add: this.roleconcept.CompanyAddress,
        company_add1: this.roleconcept.CompanyAddressLine1,

        holder_name: this.roleconcept.holder_name,
        bank_account: this.roleconcept.bank_account,
        bank_name: this.roleconcept.bank_name,
        ifsc_code: this.roleconcept.ifsc_code,
        branch: this.roleconcept.branch,
        bank_add: this.roleconcept.bank_add,

        msme: this.roleconcept.msme,
        tin_tan: this.roleconcept.tin_tan,
        pan: this.roleconcept.pan_number,
        gst: this.roleconcept.gst_number,
        status: this.roleconcept.status,
        description: this.roleconcept.status
      };

      if (this.roleconcept.PANupload != null) {


        this.pan_fileup = `${environment.APIEndpoint}clientdetails/${this.roleconcept.PANupload}`;
      } else {
        this.pan_fileup = null;
      }
      if (this.roleconcept.GSTfile != null) {
        this.gst_fileup = `${environment.APIEndpoint}clientdetails/${this.roleconcept.GSTfile}`;

      } else {
        this.gst_fileup = null;
      }
      if (this.roleconcept.tinfle != null) {
        this.tinfilesup = `${environment.APIEndpoint}clientdetails/${this.roleconcept.tinfle}`;

      } else {
        this.tinfilesup = null;
      }
      if (this.roleconcept.smefle != null) {
        this.smefilesup = `${environment.APIEndpoint}clientdetails/${this.roleconcept.smefle}`;

      } else {
        this.smefilesup = null;
      }
      if (this.roleconcept.rocfle != null) {
        this.rocfilesup = `${environment.APIEndpoint}clientdetails/${this.roleconcept.rocfle}`;


      } else {
        this.rocfilesup = null;
      }
      if (this.roleconcept.otherfile != null) {
        this.otherfilesup = `${environment.APIEndpoint}clientdetails/${this.roleconcept.otherfile}`;
      } else {
        this.otherfilesup = null;
      }
      this.clientkeys = this.roleconcept.Client_Id
      this.clientform.patchValue(formvalues);

      setTimeout(() => {
    this.clientform.get('status')?.setValue(this.roleconcept.status.toString());
  }, 0);

    }
  }

  onStatusChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;

    if (selectedValue === '1') {
      this.clientform.get('description')?.reset();
    }
  }

  onDescriptionInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.clientform.get('description')?.setValue(inputElement.value);
  }

  shouldShowSubmitButton(): boolean {
    const status = this.clientform.get('status')?.value;
    const description = this.clientform.get('description')?.value;


    return status === '1' || (status === '0' && description && description.length > 0);
  }

  ngOnInit(): void {
    this.currentuser = this.authService.getCurrentuser();
    this.userId = this.currentuser.id;
    this.RoleId = this.currentuser.User_Roleid;

    this.getcountry();
    this.getstate();
    this.dropdown();

     const navState = history.state;

    if (navState && navState.views) {
      this.isViewMode = navState.views === '0';
      this.isUpdateMode = navState.views === '1';
      this.allclientdetaildata = navState.roledata;

      if (this.isViewMode) {
        this.buttontext = '';
        this.clientform.disable();
      } else if (this.isUpdateMode) {
        this.buttontext = 'Update';
        this.clientform.enable();
      }
    }

  }

  dropdown() {
    this.APIServies.dropdowngetcustomer(this.userId, this.RoleId).subscribe(value => {
      this.customerselect = value;
      this.getcustomerdata = this.customerselect['data'];
      this.custdata = this.getcustomerdata;
    });

  }


  getstate() {
    this.APIServies.getallstate().subscribe(value => {
      this.stateselect = value;
      this.statedata = this.stateselect['data']

    });

    this.APIServies.getallbusiness().subscribe(value => {
      this.businessselect = value;
      this.businessdata = this.businessselect['data']
    })
  }
  getcountry() {
    this.APIServies.getallcountry().subscribe(value => {
      this.countryselect = value;
      this.countrydata = this.countryselect['data']

    });
  }

  get f() {
    return this.clientform.controls;
  }
  Assignvalue() {
    this.buttontext = 'Update';
  }
  redirectpage() {
    if (this.roleconcept === 'Update') {
      this.router.navigate(['/retainer']);
    } else {
      this.router.navigate(['/retainergrid']);
    }
  }

  vehiclButton() {
    this.isvehActive = !this.isvehActive;
  }
  refresh() {
    location.reload();
  }
  submit() {
    this.submitted = true;

   if (this.buttontext == 'Submit'){
 if (this.clientform.invalid) {
      return;
    }
   }
   
      const formData = new FormData();
      let registerdata = this.clientform.value;
      formData.append('holder_name', registerdata.holder_name);
      formData.append('bank_account', registerdata.bank_account);
      formData.append('bank_name', registerdata.bank_name);
      formData.append('ifsc_code', registerdata.ifsc_code);
      formData.append('branch', registerdata.branch);
      formData.append('bank_add', registerdata.bank_add);
      formData.append('Business', registerdata.Business);
      formData.append('otherfile', this.other_files);
      formData.append('rocfle', this.roc_files);
      formData.append('tinfle', this.tin_files);
      formData.append('smefle', this.sme_files);
      formData.append('msme', registerdata.msme);
      formData.append('tin_tan', registerdata.tin_tan);
      formData.append('pan', registerdata.pan);
      formData.append('gst', registerdata.gst);
      formData.append('status', registerdata.status);
      formData.append('description', registerdata.description);
      formData.append('gstfle', this.gstfile);
      formData.append('panfle', this.panfile);
      formData.append('FirstName', registerdata.first_name);
      formData.append('landline', registerdata.landline);
      formData.append('CompanyName', registerdata.company_name);
      formData.append('Department', registerdata.department);
      formData.append('Email', registerdata.email);
      formData.append('PhoneNumber', registerdata.phone_number);
      formData.append('userId', this.userId.toString());
      formData.append('City', registerdata.city);
      formData.append('State', registerdata.state);
      formData.append('Country', registerdata.country);
      formData.append('Zipcode', registerdata.postal);
      formData.append('CompanyAddress', registerdata.company_add);
      formData.append('CompanyAddressLine1', registerdata.company_add1);
    if (this.buttontext == 'Submit') {
    
      formData.append('CreatedBy', this.userId.toString());

      this.APIServies.insertclientdetails(formData).subscribe(  (response) => {
         this.Client_ID = response.data.id;
          this.currentuser = this.authService.getCurrentuser();
          let formvalues = {
        CompanyName: this.currentuser.CompanyName,
        Image: this.currentuser.Image,
        UserName:registerdata.company_name,
       Email:registerdata.email,
        Status:registerdata.status
          }
        

       this.APIServies.insertUserclientdetails(formvalues,this.userId,this.Client_ID).subscribe(data => {
        this.notifyService.showSuccess("Client create successfully.", "ClientDetails");
        this.router.navigate(['/ClientDetails']);
      }, error => { this.notifyService.showError("Something went to wrong", "ClientDetails") });
      }, error => { this.notifyService.showError("Something went to wrong", "ClientDetails") });

    } else {
      
      formData.append('modifiedBy', this.userId.toString());

      this.APIServies.updateclientdetails(this.clientkeys, formData).subscribe(data => {

          this.currentuser = this.authService.getCurrentuser();
          let formvalues = {
        CompanyName: this.currentuser.CompanyName,
        Image: this.currentuser.Image,
        UserName:registerdata.company_name,
       Email:registerdata.email,
        Status:registerdata.status
          }
        

       this.APIServies.insertUserclientdetails(formvalues,this.userId,this.clientkeys).subscribe(data => {
        this.notifyService.showSuccess("Client Updated successfully.", "ClientDetails");
        this.router.navigate(['/ClientDetails']);
      }, error => { this.notifyService.showError("Something went to wrong", "ClientDetails") });
      }, error => { this.notifyService.showError("Something went to wrong", "ClientDetails") });


        
    }

  }
  filegst(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.gstfile = file;
    }
  }
  filepan(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.panfile = file;
    }
  }

  smeFile(event: any) {


    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.sme_files = file;
    }
  }
  tanFile(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.tin_files = file;
    }
  }
  rocFile(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.roc_files = file;
    }
  }
  otherFile(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.other_files = file;
    }
  }
}
