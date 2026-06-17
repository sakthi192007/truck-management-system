import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { AuthService } from 'src/app/service/auth.service';
import { Router } from '@angular/router';
import { MasterdataService } from '../MasterData.service';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from 'src/app/service/notification.service';
import { SettingService } from '../../settingmodel/setting.service';
import { gstValidator, panValidator, emailValidator, phoneNumberValidator } from 'src/app/core/gst-validator';
import { emailExistsValidatormaster} from 'src/app/core/email-vaildators';
@Component({
  selector: 'app-branch',
  templateUrl: './branch.component.html',
  styleUrl: './branch.component.css'
})
export class BranchComponent {
  Branchform!: FormGroup;
  SubAdminform!: FormGroup;
  Userform!: FormGroup;
  submitted = false;
  buttontext: string = 'Submit';
  countrydata: any;
  statedata: any;
  rollname: any;
  role_id: any;
  currentuser: any;
  userId: any;
  selectCompany: any;
  views: any;
  SubadminNamedata: any
  isSubmitDisabled = false;
  isSubmitted = false;
  isSubAdminSubmitted = false;
  isnotvisible = false;
  Branchdata: any;
  UserUpdateId: any;
  BranchNamevalue: any;
  companynamevalue: any;
  BranchId: any;
  SubAdmindata: any;
  userdata: any;
  lengthitems:any;
  userlengthitems:any;
  companylogo:any;

  constructor(private formBuilder: FormBuilder, private APIServies: MasterdataService, private Api: SettingService, private router: Router, private authService: AuthService, private http: HttpClient, private notifyService: NotificationService) {
    this.Branchdata = history.state.Branchdata;
    this.SubAdmindata = history.state.Subdata;
    this.userdata = history.state.Userdata;

    this.SubAdminform = this.formBuilder.group({
      rows1: this.formBuilder.array([])
    })
    this.Userform = this.formBuilder.group({
      rows2: this.formBuilder.array([])
    })
    this.Branchform = this.formBuilder.group({
      Companyname: this.formBuilder.control('', [Validators.required]),
      Branchname: this.formBuilder.control('', [Validators.required]),
      city: this.formBuilder.control('', [Validators.required]),
      state: this.formBuilder.control('', [Validators.required]),
      country: this.formBuilder.control('', [Validators.required]),
      postal: this.formBuilder.control('', [Validators.required]),
      Branch: this.formBuilder.control('', [Validators.required]),
      company_add: this.formBuilder.control('', [Validators.required]),
      email: this.formBuilder.control(
             '',
             {
               validators: [Validators.required, emailValidator()],
               asyncValidators: [emailExistsValidatormaster(this.APIServies)],
               updateOn: 'blur' // ✅ important to trigger async validation on leaving the field
             }
           ),
      phone_number: ['', [Validators.required, phoneNumberValidator()]],
      pan: ['', [Validators.required, panValidator()]],
      gst: ['', [Validators.required, gstValidator()]],
      status: this.formBuilder.control('', [Validators.required]),
      description: this.formBuilder.control(''),

    });

    if (this.Branchdata == '' || this.Branchdata == undefined) {
    } else {
      this.buttontext = 'Update';
      this.isSubmitted = true;
      let formvalues = {

        CompanyName: this.Branchdata.CompanyName,
        Branchname: this.Branchdata.BranchName,
        city: this.Branchdata.City,
        state: this.Branchdata.State,
        country: this.Branchdata.Country,
        postal: this.Branchdata.PostalCode,
        Branch: this.Branchdata.BranchCode,
        company_add: this.Branchdata.Address,
        email: this.Branchdata.Email,
        phone_number: this.Branchdata.PhoneNumber,
        pan: this.Branchdata.PanNumber,
        gst: this.Branchdata.GSTNo,
        status: this.Branchdata.status,
        description: this.Branchdata.description
      }
      this.companynamevalue = this.Branchdata.CompanyName;
      this.UserUpdateId = this.Branchdata.User_ID;
      this.Branchform.patchValue(formvalues);
      this.BranchNamevalue = this.Branchdata.BranchName;


    }
     if (this.SubAdmindata == '' || this.SubAdmindata == undefined) {
    } else {
      this.isSubAdminSubmitted = true;
      this.SubadminNamedata = this.SubAdmindata;
      var a = this.SubAdmindata;
      for (var j = 0; j < a.length; j++) {
        this.lengthitems = j.toString();
        this.updateSubAdminaddItem();
      }
    }
      if (this.userdata == '' || this.userdata == undefined) {
    } else {
       
      var a = this.userdata;
      for (var j = 0; j < a.length; j++) {
        this.userlengthitems = j.toString();
       this.updateUseraddItem();
      }
    }
  }
  ngOnInit(): void {
    this.currentuser = this.authService.getCurrentuser();
    this.userId = this.currentuser.id;
    this.role_id = sessionStorage.getItem('User_Roleid');
 
    this.getcompany();
    this.getcountry();
    this.getstate();

  }
  get row1(): FormArray {
    return this.SubAdminform.get('rows1') as FormArray;
  }

  get row2() {
    return this.Userform.get('rows2') as FormArray;
  }

  getcompany() {
    this.Api.getdropcompanydetails(this.role_id, this.userId).subscribe((response: any) => {
      this.selectCompany = response;
      const role = this.selectCompany['data'];

      this.rollname = role[0];
      let formData = {
        Companyname: this.rollname.CompanyName,
      };
      this.companynamevalue = this.rollname.CompanyName,
        this.Branchform.patchValue(formData);
    });
  }

  getstate() {
    this.APIServies.getallstate().subscribe(value => {
      const stateselect = value;
      this.statedata = stateselect['data']

    });


  }
  getcountry() {
    this.APIServies.getallcountry().subscribe(value => {
      const countryselect = value;
      this.countrydata = countryselect['data']

    });
  }

  onBranchCode(event: any): void {
    const selectstate = event.target.value;
    this.Api.getbranch(selectstate).subscribe((value) => {
      const branchvalue = value;
      const Branchdata = branchvalue['data'];
      let formvalues = {
        Branch: Branchdata[0].Branch,
      };
      this.Branchform.patchValue(formvalues);
    });
  }
  get f() {
    return this.Branchform.controls;
  }
SubAdminaddItem(): void {
    const rowGroup = this.formBuilder.group({
      BranchNameAdmin: [this.BranchNamevalue],
      SubAdminName: [''],
      SubAdminEmail: [''],
      SubAdminPhone: [''],
      Subadminstatus: [''],
      SubAdminId: ['']
    });
    this.row1.push(rowGroup);
  }
  updateSubAdminaddItem(): void {
    const rowGroup = this.formBuilder.group({
      BranchNameAdmin: [this.BranchNamevalue],
      SubAdminName: this.SubAdmindata?.[this.lengthitems]?.UserName || '',
      SubAdminEmail: this.SubAdmindata?.[this.lengthitems]?.Email || '',
      SubAdminPhone: this.SubAdmindata?.[this.lengthitems]?.PhoneNumber || '',
      Subadminstatus: this.SubAdmindata?.[this.lengthitems]?.status || '',
      SubAdminId: this.SubAdmindata?.[this.lengthitems]?.User_ID || '',
    });
    this.row1.push(rowGroup);
  }
  UseraddItem() {
    const rowGroup = this.formBuilder.group({
      SubadminName: [''],
      UserName: [''],
      UserEmail: [''],
      UserPhone: [''],
      Userstatus: [''],
      UserAdminId: ['']


    });
    this.row2.push(rowGroup);
  }
  updateUseraddItem() {
    const rowGroup = this.formBuilder.group({
      SubadminName: this.userdata?.[this.userlengthitems]?.Clientid || '',
      UserName: this.userdata?.[this.userlengthitems]?.UserName || '',
      UserEmail: this.userdata?.[this.userlengthitems]?.Email || '',
      UserPhone: this.userdata?.[this.userlengthitems]?.PhoneNumber || '',
      Userstatus: this.userdata?.[this.userlengthitems]?.status || '',
      UserAdminId: this.userdata?.[this.userlengthitems]?.User_ID || '',


    });
    this.row2.push(rowGroup);
  }

  SubAdminremoveItem(index: number): void {
    this.row1.removeAt(index);
  }

  UserremoveItem(index: number): void {
    this.row2.removeAt(index);
  }

  Usersubmit() {
const payload = this.Userform.value.rows2;
    if (!payload.length) {
      this.notifyService.showWarning("Please add data in User details", "Branch Details");
      return;
    }
       this.companylogo = sessionStorage.getItem('Image');
    if (this.buttontext == 'Submit') {
      this.Api.insertUserdetails(payload,this.companylogo,this.companynamevalue).subscribe(data => {
        this.notifyService.showSuccess("User create successfully.", "Branch Details");
       
      }, error => { this.notifyService.showError("Something went to wrong", "Branch Details") });
    } else {
this.Api.UpdateUserdetails(payload,this.companylogo,this.companynamevalue).subscribe(data => {
        this.notifyService.showSuccess("User Update successfully.", "Branch Details");
      }, error => { this.notifyService.showError("Something went to wrong", "Branch Details") });
    }

  }
  SubAdminsubmit() {
    const payload = this.SubAdminform.value.rows1;
    if (!payload.length) {
      this.notifyService.showWarning("Please add data in SubAdmin details", "Branch Details");
      return;
    }
      this.companylogo = sessionStorage.getItem('Image');
    if (this.buttontext == 'Submit') {
      this.Api.insertSubAdmindetails(payload, this.companynamevalue, this.UserUpdateId,this.companylogo).subscribe(data => {
        const stateselect = data;
        this.SubadminNamedata = stateselect['data']

        this.notifyService.showSuccess("SubAdmin create successfully.", "Branch Details");
        this.isSubmitDisabled = true;
        this.isSubmitted = true;
        this.isSubAdminSubmitted = true;
        this.SubAdminform.disable();
        // this.router.navigate(['/Branchgrid']);
      }, error => { this.notifyService.showError("Something went to wrong", "Branch Details") });
    } else {
this.Api.UpdateSubAdmindetails(payload, this.companynamevalue, this.UserUpdateId,this.companylogo).subscribe(data => {
        const stateselect = data;
        this.SubadminNamedata = stateselect['data']

        this.notifyService.showSuccess("SubAdmin Update successfully.", "Branch Details");
       
      }, error => { this.notifyService.showError("Something went to wrong", "Branch Details") });
    }


  }
  submit() {

    this.submitted = true;
    if (this.Branchform.invalid) {
      return;
    }
      this.companylogo = sessionStorage.getItem('Image');
    if (this.buttontext == 'Submit') {
      let registerdata = this.Branchform.value;

      let formvalues = {
        CompanyName: registerdata.Companyname,
        BranchName: registerdata.Branchname,
        City: registerdata.city,
        State: registerdata.state,
        Country: registerdata.country,
        PostalCode: registerdata.postal,
        Branch: registerdata.Branch,
        Address: registerdata.company_add,
        Email: registerdata.email,
        PhoneNumber: registerdata.phone_number,
        PanNumber: registerdata.pan,
        GSTNo: registerdata.gst,
        Status: registerdata.status,
        Description: registerdata.description,
        User_ID: this.userId,
        Image:this.companylogo
      }
      this.Api.insertBranchdetails(formvalues).subscribe(data => {
        this.BranchNamevalue = data.data.Name;
        this.UserUpdateId = data.data.id;
        this.notifyService.showSuccess("Branch create successfully.", "Branch Details");
        this.isSubmitDisabled = true;
        this.isSubmitted = true;
        this.Branchform.disable();
        // this.router.navigate(['/Branchgrid']);
      }, error => { this.notifyService.showError("Something went to wrong", "Branch Details") });


    } else {
      let registerdata = this.Branchform.value;
      let formvalues = {
        CompanyName: registerdata.Companyname,
        BranchName: registerdata.Branchname,
        City: registerdata.city,
        State: registerdata.state,
        Country: registerdata.country,
        PostalCode: registerdata.postal,
        Branch: registerdata.Branch,
        Address: registerdata.company_add,
        Email: registerdata.email,
        PhoneNumber: registerdata.phone_number,
        PanNumber: registerdata.pan,
        GSTNo: registerdata.gst,
        Status: registerdata.status,
        Description: registerdata.description,
         Image:this.companylogo
      }
      this.Api.UpdateBranchdetails(formvalues, this.UserUpdateId).subscribe(data => {
        this.BranchNamevalue = data.data.Name;
        this.UserUpdateId = data.data.id;
        this.notifyService.showSuccess("Branch Update successfully.", "Branch Details");
        this.isSubmitDisabled = true;
        this.Branchform.disable();
        // this.router.navigate(['/Branchgrid']);
      }, error => { this.notifyService.showError("Something went to wrong", "Branch Details") });

    }

  }
}
