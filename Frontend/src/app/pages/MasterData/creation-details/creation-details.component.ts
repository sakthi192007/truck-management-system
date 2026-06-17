import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/service/auth.service';
import { Router } from '@angular/router';
import { MasterdataService } from '../MasterData.service';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from 'src/app/service/notification.service';
import { gstValidator, panValidator, emailValidator, phoneNumberValidator } from 'src/app/core/gst-validator';
import { environment } from 'src/environments/environment';
import { emailExistsValidatormaster} from 'src/app/core/email-vaildators';

@Component({
  selector: 'app-creation-details',
  templateUrl: './creation-details.component.html',
  styleUrl: './creation-details.component.css'
})
export class CreationDetailsComponent {
  clientform!: FormGroup;
  currentuser: any = '';
  userId: any;
  RoleId: any;
  User_ID: any;
  submitted = false;
  buttontext: string = 'Submit';
  logo_file: any;
  stateselect: any;
  statedata: any;
  countryselect: any;
  countrydata: any;
  loginUserId: any;
  roleconcept: any;
  views: any;
  imageview:any;
  constructor(private formBuilder: FormBuilder, private APIServies: MasterdataService,private router: Router, private authService: AuthService, private http: HttpClient, private notifyService: NotificationService) {
    this.roleconcept = history.state.roledata;
    this.views = history.state.views;
    this.clientform = this.formBuilder.group({

      company_name: this.formBuilder.control('', [Validators.required]),
      city: this.formBuilder.control('', [Validators.required]),
      state: this.formBuilder.control('', [Validators.required]),
      country: this.formBuilder.control('', [Validators.required]),
      postal: this.formBuilder.control('', [Validators.required]),
      company_add: this.formBuilder.control('', [Validators.required]),
      UserName: this.formBuilder.control('', [Validators.required]),
      logo_file: this.formBuilder.control(''),
     email: this.formBuilder.control(
       '',
       {
         validators: [Validators.required, emailValidator()],
         asyncValidators: [emailExistsValidatormaster(this.APIServies)],
         updateOn: 'blur' // ✅ important to trigger async validation on leaving the field
       }
     ),      phone_number: ['', [Validators.required, phoneNumberValidator()]],
      pan: ['', [Validators.required, panValidator()]],
      gst: ['', [Validators.required, gstValidator()]],
      status: this.formBuilder.control('', [Validators.required]),
      description: this.formBuilder.control(''),


    });
    if (this.roleconcept && this.roleconcept.length) {
      this.buttontext = 'Update';
      const role = this.roleconcept[0];
      let formData = {
        company_name: this.roleconcept[0].CompanyName,
        UserName: this.roleconcept[0].UserName,
        city: this.roleconcept[0].City,
        state: this.roleconcept[0].State,
        country: this.roleconcept[0].Country,
        postal: this.roleconcept[0].PostalCode,
        company_add: this.roleconcept[0].Address,
        email: this.roleconcept[0].Email,
        phone_number: this.roleconcept[0].PhoneNumber,
        pan: this.roleconcept[0].PanNumber,
        gst: this.roleconcept[0].GSTNo,
        status: this.roleconcept[0].status,
        description: this.roleconcept[0].description,
      };

       if (this.roleconcept[0].Image != null) {
              this.imageview = `${environment.APIEndpoint}ClientImages/${this.roleconcept[0].Image}`;
      
      
            } else {
              this.imageview = null;
            }

       this.clientform.patchValue(formData);
       this.User_ID= this.roleconcept[0].User_ID;
    }
  }
  ngOnInit(): void {

    this.currentuser = this.authService.getCurrentuser();
    this.userId = this.currentuser.id;
    this.RoleId = this.currentuser.User_Roleid;

    this.getcountry();
    this.getstate();
  }

  getstate() {
    this.APIServies.getallstate().subscribe(value => {
      this.stateselect = value;
      this.statedata = this.stateselect['data']

    });


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
  companylogo(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.logo_file = file;
    }
  }
  submit() {
    this.submitted = true;
  
    if (this.buttontext == 'Submit') {
  if (this.clientform.invalid) {
      return;
    }
      const formData = new FormData();
      let registerdata = this.clientform.value;
      formData.append('CompanyName', registerdata.company_name);
      formData.append('UserName', registerdata.UserName);
      formData.append('GSTNo', registerdata.gst);
      formData.append('PanNumber', registerdata.pan);
      formData.append('PhoneNumber', registerdata.phone_number);
      formData.append('PostalCode', registerdata.postal);
      formData.append('Email', registerdata.email);
      formData.append('City', registerdata.city);
      formData.append('State', registerdata.state);
      formData.append('Country', registerdata.country);
      formData.append('Address', registerdata.company_add);
      formData.append('CompanyLogo', this.logo_file);
      formData.append('status', registerdata.status);
      formData.append('description', registerdata.description);
      formData.append('User_ID', this.userId);
      this.APIServies.insertclientdetails(formData).subscribe(data => {
        this.notifyService.showSuccess("Company create successfully.", "ClientDetails");
        this.router.navigate(['/Creationgrid']);
      }, error => { this.notifyService.showError("Something went to wrong", "ClientDetails") });

      
    } else {
      const formData = new FormData();
      let registerdata = this.clientform.value;
      formData.append('CompanyName', registerdata.company_name);
      formData.append('UserName', registerdata.UserName);
      formData.append('GSTNo', registerdata.gst);
      formData.append('PanNumber', registerdata.pan);
      formData.append('PhoneNumber', registerdata.phone_number);
      formData.append('PostalCode', registerdata.postal);
      formData.append('Email', registerdata.email);
      formData.append('City', registerdata.city);
      formData.append('State', registerdata.state);
      formData.append('Country', registerdata.country);
      formData.append('Address', registerdata.company_add);
      formData.append('CompanyLogo', this.logo_file);
      formData.append('status', registerdata.status);
      formData.append('description', registerdata.description);
      this.APIServies.updateclientdetails(this.User_ID, formData).subscribe(data => {
         this.notifyService.showSuccess("Client Updated successfully.", "ClientDetails");
         this.router.navigate(['/Creationgrid'])
      }, error => { this.notifyService.showError("Something went wrong", "ClientDetails") });
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

}
