import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ClientService } from '../../clientmodel/client.service';
import { VendorService } from '../vendor.service';
import { AuthService } from 'src/app/service/auth.service';
import { NotificationService } from 'src/app/service/notification.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { Vehicle, bank, driver } from './vendor-interface';
import { emailExistsValidatorvendor } from 'src/app/core/email-vaildators';


import {
  gstValidator,
  panValidator,
  emailValidator,
  phoneNumberValidator,
} from 'src/app/core/gst-validator';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-vendor-creation',
  templateUrl: './vendor-creation.component.html',
  styleUrl: './vendor-creation.component.css',
})
export class VendorCreationComponent implements OnInit, AfterViewInit {
  gst_file: any;
  pan_file: any;
  dr_file: any;
  bank_file: any;
  rc_file: any;
  insu_file: any;
  poll_file: any;
  truck_file: any;
  sme_files: any;
  tin_files: any;
  roc_files: any;
  other_files: any;
  // dtOptions: any = {};
  dtOptions: DataTables.Settings = {};

  dtTrigger: Subject<any> = new Subject<any>();

  driverdata!: any[];
  driverdatadetails: any;

  bankdata!: any[];
  bankdatadetails: any;

  vehicledata!: any[];
  vehicledatadetails: any;

  addvehicledata!: any[];
  addvehicledatadetails: any;

  aadhar: any;
  countrydata!: any[];
  statedata!: any[];
  containertypedata: any[] = [];
  vehicleSpecdata: any;

  roleconcept: any;
  fmedit = 'false';

  companyform!: FormGroup;
  driverform!: FormGroup;
  bankform!: FormGroup;
  vehicleform!: FormGroup;

  submittedcompany = false;
  submittedbank = false;
  submitteddriv = false;
  submitted = false;
  error = 'false';
  Success = 'false';
  errortext: string = '';
  successtext: string = '';
  agencykey: string = '';
  buttontext: string = 'Submit';
  getdata: any;
  agencydetails: any;
  assigndatadetails: any;
  countrydetails: any;
  statedetails: any;
  countryselect: any;
  stateselect: any;
  vehispcsselect: any;
  containertypesselect: any;
  containerftselect: any;
  currentuser: any;
  userId: any;
  CD_ID: any;
  agencydata: any;
  bankstatus: any;
  vehiclestatus: any;
  drstatus: any;

  updtebankdetails: any;
  updtevehicldetails: any;
  updtedriverdetails: any;
  BD_keys: any;
  VD_keys: any;
  DD_keys: any;

  bankey: any;
  vehikey: any;
  addvehikey: any;
  driverkey: any;

  addinsu_file: any;
  addpoll_file: any;
  addrc_file: any;
  addtruck_file: any;
  AVD_keys: any;
  views: any;

  //file

  gst_up: any;
  pan_up: any;
  other_up: any;
  roc_up: any;
  tin_up: any;
  sme_up: any;

  bank_up: any;

  rc_up: any;
  ins_up: any;
  pol_up: any;
  atr_up: any;
  RoleId: any;
  drl_up: any;
  alerts: { [key: string]: string } = {};  // Change from number to string
  fromDateInprogress: any;
  toDateInprogress: any;
  searchTerm: any;
  fromDateCompleted: any;
  toDateCompleted: any;
  fromDatePending: any;
  toDatePending: any;
  toDateCancelled: any;
  fromDateCancelled: any;

  dropdownConfig = {
    displayKey: "generalType",
     valueKey: 'G_key',
    bindValue: 'G_key',
    search: true,
    height: '250px',
    placeholder: "--Select--",
    limitTo: this.containertypedata?.length,
    noResultsFound: "No results found!",
    searchPlaceholder: "Search...",
    clearOnSelection: false
  };

  vehicletypeOptions = [
    { id: 0, name: 'Own Vehicle' },
    { id: 1, name: 'Additional Vehicle' }
  ];



  constructor(

    private formBuilder: FormBuilder,
    private APIServies: VendorService,
    private ApiCommn: ClientService,
    private router: Router,
    private authService: AuthService,
    private notifyService: NotificationService
  ) {
    this.userId = sessionStorage.getItem('id');
    this.roleconcept = history.state.roledata;
    this.views = history.state.views;
    if (this.roleconcept === 'Update') {
      this.fmedit = 'false';
    } else {
      this.fmedit = 'true';
    }
    this.companyform = this.formBuilder.group({
      Company: this.formBuilder.control('', [Validators.required]),
      description: '',
      sem_msem: [''],
      tin_number: [''],
      city: this.formBuilder.control('', [Validators.required]),
      state: this.formBuilder.control('', [Validators.required]),
      country: this.formBuilder.control('', [Validators.required]),
      off_add: this.formBuilder.control('', [Validators.required]),
      off_add1: [''],
      companystatus: [''],
      gst_files: [''],
      pan_files: [''],
      sme_files: [''],
      tin_files: [''],
      rocs: [''],
      others_file: [''],
      postal: this.formBuilder.control('', [Validators.required]),
      gstOption: ['yes'],
      // company_email: ['', [Validators.required, emailValidator()]],
      company_email: this.formBuilder.control(
        '',
        {
          validators: [Validators.required, emailValidator()],
          asyncValidators: [emailExistsValidatorvendor(this.APIServies)],
          updateOn: 'blur' // ✅ important to trigger async validation on leaving the field
        }
      ),
      company_number: ['', [Validators.required, phoneNumberValidator()]],
      pan_number: ['', [Validators.required, panValidator()]],
      gst_number: ['', [Validators.required, gstValidator()]],
    });
    this.driverform = this.formBuilder.group({
      dri_name: this.formBuilder.control('', [Validators.required]),
      dri_number: this.formBuilder.control('', [Validators.required]),
      licencenum: this.formBuilder.control('', [Validators.required]),
      expired_date: this.formBuilder.control('', [Validators.required]),
      dr_upload: this.formBuilder.control(''),
      status: this.formBuilder.control('', [Validators.required]),
      drivdes: this.formBuilder.control(''),
      aadhar_num: this.formBuilder.control('')
    });
    this.bankform = this.formBuilder.group({
      holder_name: this.formBuilder.control('', [Validators.required]),
      bank_account: this.formBuilder.control('', [Validators.required]),
      bank_name: this.formBuilder.control('', [Validators.required]),
      ifsc_code: this.formBuilder.control('', [Validators.required]),
      branch: this.formBuilder.control('', [Validators.required]),
      bank_add: this.formBuilder.control(''),
      bank_sta: this.formBuilder.control(''),
      bankdes: this.formBuilder.control(''),
      status: this.formBuilder.control('', [Validators.required]),
    });
    this.vehicleform = this.formBuilder.group({
      type_of: this.formBuilder.control('', [Validators.required]),
      own_addition: this.formBuilder.control('', [Validators.required]),
      vehicle_num: this.formBuilder.control('', [Validators.required]),
      rc_num: this.formBuilder.control('', [Validators.required]),
      year_vehicle: this.formBuilder.control('', [Validators.required]),
      permit_Vehicle: this.formBuilder.control(''),
      polluctionexpiry: this.formBuilder.control(''),
      vehides: this.formBuilder.control(''),
      insurancenumber: this.formBuilder.control(''),
      permit_date: this.formBuilder.control(''),
      fcexpirydate: this.formBuilder.control('', [Validators.required]),
      road_tax: this.formBuilder.control('', [Validators.required]),
      Poll_certificate: this.formBuilder.control('', [Validators.required]),
      insurancecompanyname: this.formBuilder.control(''),
      insurance_ex: this.formBuilder.control('', [Validators.required]),
      rc_files: this.formBuilder.control(''),
      vstatus: this.formBuilder.control('', [Validators.required]),
      insurance_file: this.formBuilder.control(''),
      poll_file: this.formBuilder.control(''),
      truck_file: this.formBuilder.control(''),
    });

    if (this.roleconcept == '' || this.roleconcept == undefined) {
    } else {
      this.buttontext = 'Update';
      let formvalues = {
        Company: this.roleconcept.CompanyName,
        gst_number: this.roleconcept.GSTNumber,
        pan_number: this.roleconcept.PANNumber,
        company_number: this.roleconcept.PhoneNumber,
        description: this.roleconcept.description,
        company_email: this.roleconcept.Email,
        sem_msem: this.roleconcept.SEMORMSEM,
        tin_number: this.roleconcept.TINNumber,
        city: this.roleconcept.City,
        state: this.roleconcept.State,
        country: this.roleconcept.Country,
        off_add: this.roleconcept.OfficeAddress,
        off_add1: this.roleconcept.OfficeAddressLine1,
        postal: this.roleconcept.Zipcode,
        companystatus: this.roleconcept.status,
      };
      if (this.roleconcept.GSTFile != null) {
        this.gst_up = `${environment.APIEndpoint}vendorcompany/${this.roleconcept.GSTFile}`;
      } else {
        this.gst_up = null;
      }
      if (this.roleconcept.PANUpload != null) {
        this.pan_up = `${environment.APIEndpoint}vendorcompany/${this.roleconcept.PANUpload}`;

      } else {
        this.pan_up = null;
      }

      if (this.roleconcept.smefle != null) {
        this.sme_up = `${environment.APIEndpoint}vendorcompany/${this.roleconcept.smefle}`;

      } else {
        this.sme_up = null;
      }
      if (this.roleconcept.tinfle != null) {
        this.tin_up = `${environment.APIEndpoint}vendorcompany/${this.roleconcept.tinfle}`;

      } else {
        this.tin_up = null;
      }
      if (this.roleconcept.rocfle != null) {
        this.roc_up = `${environment.APIEndpoint}vendorcompany/${this.roleconcept.rocfle}`;
      } else {
        this.roc_up = null;
      }
      if (this.roleconcept.otherfile != null) {
        this.other_up = `${environment.APIEndpoint}vendorcompany/${this.roleconcept.otherfile}`;

      } else {
        this.other_up = null;
      }
      this.CD_ID = this.roleconcept.CD_ID;
      this.companyform.patchValue(formvalues);

      setTimeout(() => {
        this.companyform.get('companystatus')?.setValue(this.roleconcept.status.toString());
      }, 0);

    }


  }
  onGstChange() {
    this.companyform.get('gstOption')?.valueChanges.subscribe(value => {
      if (value === 'yes') {
        this.companyform.get('gst_number')?.setValidators(Validators.required);
        this.companyform.get('gst_files')?.setValidators(Validators.required);
        this.companyform.get('pan_number')?.setValidators(Validators.required);
        this.companyform.get('pan_files')?.setValidators(Validators.required);
      } else {
        this.companyform.get('gst_number')?.clearValidators();
        this.companyform.get('gst_files')?.clearValidators();
        this.companyform.get('pan_number')?.clearValidators();
        this.companyform.get('pan_files')?.clearValidators();
      }

      // Ensure validation updates are reflected immediately
      this.companyform.get('gst_number')?.updateValueAndValidity();
      this.companyform.get('gst_files')?.updateValueAndValidity();
      this.companyform.get('pan_number')?.updateValueAndValidity();
      this.companyform.get('pan_files')?.updateValueAndValidity();
    });
  }


  ngAfterViewInit(): void {
    setTimeout(() => {
      (window as any).initDataTable();

      // Reusable helper
      const setupTable = (
        wrapperClass: string,
        btnTargetId: string,
        leftSearchClass: string
      ) => {
        // Move buttons
        const btns = document.querySelector(`.${wrapperClass} .dt-buttons`);
        const btnTarget = document.getElementById(btnTargetId);
        if (btns && btnTarget) {
          btnTarget.appendChild(btns);
        }

        // Move search box
        const search = document.querySelector(`.${wrapperClass} .dataTables_filter`);
        const leftBox = document.querySelector(`.${leftSearchClass}`);
        if (search && leftBox) {
          leftBox.appendChild(search);
          (search as HTMLElement).style.marginTop = '5px';
        }
      };

      setupTable('pending-wrapper', 'datatable-buttons-pending', 'left-search');
      setupTable('completed-wrapper', 'datatable-buttons-completed', 'left-search-completed');
      setupTable('inprogress-wrapper', 'datatable-buttons-inprogress', 'left-search-inprogress');
      setupTable('cancelled-wrapper', 'datatable-buttons-cancelled', 'left-search-cancelled');

      document.querySelectorAll('.dataTables_filter input').forEach((input: any) => {
        input.classList.add('form-control', 'form-control-sm');
        input.style.width = '200px';
        input.style.marginLeft = '-5px';
      });

      document.querySelectorAll('.dataTables_filter label').forEach((label: any) => {
        label.style.display = 'inline-flex';
        label.style.alignItems = 'center';
        const input = label.querySelector('input');
        if (input) {
          input.style.marginLeft = '5px';
        }
      });

    }, 1000);
  }

  get filteredData() {
    if (!this.searchTerm && !this.fromDatePending && !this.toDatePending) {
      return this.bankdata;
    }
    return this.bankdata.filter(bird => {
      let matchesSearch = true;
      let matchesDateRange = true;

      if (this.searchTerm) {
        matchesSearch = Object.values(bird).some(value =>
          String(value).toLowerCase().includes(this.searchTerm.toLowerCase())
        );
      }

      const createdOn = new Date(bird.createdOn);
      const from = this.fromDatePending ? new Date(this.fromDatePending) : null;
      const to = this.toDatePending ? new Date(this.toDatePending) : null;

      if (from && createdOn < from) matchesDateRange = false;
      if (to && createdOn > to) matchesDateRange = false;

      return matchesSearch && matchesDateRange;
    });
  }

  get filteredDataCompleted() {
    if (!this.searchTerm && !this.fromDateCompleted && !this.toDateCompleted) {
      return this.vehicledata;
    }
    return this.vehicledata.filter(bird => {
      let matchesSearch = true;
      let matchesDateRange = true;

      if (this.searchTerm) {
        matchesSearch = Object.values(bird).some(value =>
          String(value).toLowerCase().includes(this.searchTerm.toLowerCase())
        );
      }

      const createdOn = new Date(bird.createdOn);
      const from = this.fromDateCompleted ? new Date(this.fromDateCompleted) : null;
      const to = this.toDateCompleted ? new Date(this.toDateCompleted) : null;

      if (from && createdOn < from) matchesDateRange = false;
      if (to && createdOn > to) matchesDateRange = false;

      return matchesSearch && matchesDateRange;
    });
  }
  get exportfilteredData() {
    if (!this.searchTerm && !this.fromDateInprogress && !this.toDateInprogress) {
      return this.addvehicledata;
    }
    return this.addvehicledata.filter(bird => {
      let matchesSearch = true;
      let matchesDateRange = true;

      if (this.searchTerm) {
        matchesSearch = Object.values(bird).some(value =>
          String(value).toLowerCase().includes(this.searchTerm.toLowerCase())
        );
      }

      const createdOn = new Date(bird.createdOn);
      const from = this.fromDateInprogress ? new Date(this.fromDateInprogress) : null;
      const to = this.toDateInprogress ? new Date(this.toDateInprogress) : null;

      if (from && createdOn < from) matchesDateRange = false;
      if (to && createdOn > to) matchesDateRange = false;

      return matchesSearch && matchesDateRange;
    });
  }
  get exportfilteredDataCompleted() {
    if (!this.searchTerm && !this.fromDateCancelled && !this.toDateCancelled) {
      return this.driverdata;
    }
    return this.driverdata.filter(bird => {
      let matchesSearch = true;
      let matchesDateRange = true;

      if (this.searchTerm) {
        matchesSearch = Object.values(bird).some(value =>
          String(value).toLowerCase().includes(this.searchTerm.toLowerCase())
        );
      }

      const createdOn = new Date(bird.createdOn);
      const from = this.fromDateCancelled ? new Date(this.fromDateCancelled) : null;
      const to = this.toDateCancelled ? new Date(this.toDateCancelled) : null;

      if (from && createdOn < from) matchesDateRange = false;
      if (to && createdOn > to) matchesDateRange = false;

      return matchesSearch && matchesDateRange;
    });
  }
  ngOnInit(): void {
    // Initialize DataTable options
    this.dtOptions = {
      pagingType: 'full_numbers',
    };

    // Retrieve session data


    // Retrieve and set local storage data
    const storedCD_ID = localStorage.getItem('CD_ID');
    if (storedCD_ID) {
      this.CD_ID = storedCD_ID;
    }

    this.getcountry();
    this.getstate();
    this.gettypecontainers();
    this.bankgetgrid();
    this.vehiclgetgrid();
    this.drivergetgrid();
    this.addvehiclgetgrid();
    this.checkExpiryDates();
    this.onGstChange();
    this.vehicleform.valueChanges.subscribe(() => this.checkExpiryDates());
  }

  checkExpiryDates() {
    const today = new Date();
    this.alerts = {}; // Reset alerts

    Object.keys(this.vehicleform.controls).forEach((key) => {
      const expiryDateValue = this.vehicleform.get(key)?.value;
      if (expiryDateValue) {
        const expiryDate = new Date(expiryDateValue);

        if (!isNaN(expiryDate.getTime())) {
          const diff = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 3600 * 24)); // Days difference

          // Store the formatted message as a string
          if (diff < 0) {
            this.alerts[key] = `${key} expired ${Math.abs(diff)} day(s) ago`;
          } else if (diff <= 30) {
            this.alerts[key] = `${key} will expire in ${diff} day(s)`;
          }
        }
      }
    });
  }


  bankgetgrid() {
    if (this.CD_ID == '' || this.CD_ID == undefined) {
    } else {
      this.APIServies.getallbank(this.CD_ID).subscribe((value) => {
        this.bankdatadetails = value;
        this.bankdata = this.bankdatadetails['data'];
        this.bankdata.forEach((element) => {
          if (element.status == 1) {
            element['spancolur1'] = 'badge badge-success';
            element['statusname1'] = 'Active';
          } else if (element.status == 0) {
            element['spancolur1'] = 'badge badge-danger';
            element['statusname1'] = 'In Active';
          }
        });
      });
    }
  }

  vehiclgetgrid() {
    if (this.CD_ID == '' || this.CD_ID == undefined) {
    } else {
      this.APIServies.getallvehicle(this.CD_ID).subscribe((value) => {
        this.vehicledatadetails = value;
        this.vehicledata = this.vehicledatadetails['data'];
        this.vehicledata.forEach((element) => {
          if (element.status == 1) {
            element['spancolur1'] = 'badge badge-success';
            element['statusname1'] = 'Active';
          } else if (element.status == 0) {
            element['spancolur1'] = 'badge badge-danger';
            element['statusname1'] = 'In Active';
          }
        });
      });
    }
  }
  addvehiclgetgrid() {
    if (this.CD_ID == '' || this.CD_ID == undefined) {
    } else {
      this.APIServies.getalladdvehicle(this.CD_ID).subscribe((value) => {
        this.addvehicledatadetails = value;
        this.addvehicledata = this.addvehicledatadetails['data'];
        this.addvehicledata.forEach((element) => {
          if (element.status == 1) {
            element['spancolur1'] = 'badge badge-success';
            element['statusname1'] = 'Active';
          } else if (element.status == 0) {
            element['spancolur1'] = 'badge badge-danger';
            element['statusname1'] = 'In Active';
          }
        });
      });
    }
  }
  drivergetgrid() {
    if (this.CD_ID == '' || this.CD_ID == undefined) {
    } else {
      this.APIServies.getalldriver(this.CD_ID).subscribe((value) => {
        this.driverdatadetails = value;
        this.driverdata = this.driverdatadetails['data'];
        this.driverdata.forEach((element) => {
          if (element.status == 1) {
            element['spancolur1'] = 'badge badge-success';
            element['statusname1'] = 'Active';
          } else if (element.status == 0) {
            element['spancolur1'] = 'badge badge-danger';
            element['statusname1'] = 'In Active';
          }
        });
      });
    }
  }
  // all form controls
  get c() {
    return this.companyform.controls;
  }
  get d() {
    return this.driverform.controls;
  }
  get b() {
    return this.bankform.controls;
  }
  get v() {
    return this.vehicleform.controls;
  }

  /// all get values
  getstate() {
    this.ApiCommn.getallstate().subscribe((value) => {
      this.stateselect = value;
      this.statedata = this.stateselect['data'];
    });
  }
  getcountry() {
    this.ApiCommn.getallcountry().subscribe((value) => {
      this.countryselect = value;
      this.countrydata = this.countryselect['data'];
    });
  }

  gettypecontainers() {
    this.APIServies.getalltypecontainer().subscribe((value) => {
      this.containertypesselect = value;
      this.containertypedata = this.containertypesselect['data'];

    
    });
  }



  resetcomapny() {
    this.companyform.reset();
    this.buttontext = 'Submit';
  }
  resetdriver() {
    this.driverform.reset();
    this.buttontext = 'Submit';
  }
  resetvehicle() {
    this.vehicleform.reset();
    this.buttontext = 'Submit';
  }

  reset() {
    this.bankform.reset();
    this.buttontext = 'Submit';
  }

  viewsb(BD_key: any) {
    this.buttontext = 'Update';
    this.BD_keys = BD_key;
    this.APIServies.getupdatebankdetails(BD_key).subscribe((value) => {
      this.updtebankdetails = value['data'];
      let formvalues = {
        holder_name: this.updtebankdetails.AccountHolderName,
        bank_account: this.updtebankdetails.BankAccountNumber,
        bank_name: this.updtebankdetails.BankName,
        ifsc_code: this.updtebankdetails.IFSCCode,
        branch: this.updtebankdetails.Branch,
        bank_add: this.updtebankdetails.BankAddress,
        status: this.updtebankdetails.status,
        bankdes: this.updtebankdetails.description,
      };


      if (this.updtebankdetails.BankStatement != null) {
        this.bank_up = `${environment.APIEndpoint}bank/${this.updtebankdetails.BankStatement}`;
      } else {
        this.bank_up = null;
      }
      this.bankform.patchValue(formvalues);

      setTimeout(() => {
        this.bankform.get('status')?.setValue(this.updtebankdetails.status.toString());
      }, 0);

    });
  }

  Assignvaluebank(BD_key: any) {
    this.reset();

    this.BD_keys = BD_key;
    this.buttontext = 'Update';
    this.APIServies.getupdatebankdetails(BD_key).subscribe((value) => {
      this.updtebankdetails = value['data'];

      let formvalues = {
        holder_name: this.updtebankdetails.AccountHolderName,
        bank_account: this.updtebankdetails.BankAccountNumber,
        bank_name: this.updtebankdetails.BankName,
        ifsc_code: this.updtebankdetails.IFSCCode,
        branch: this.updtebankdetails.Branch,
        bank_add: this.updtebankdetails.BankAddress,
        status: this.updtebankdetails.status,
        bankdes: this.updtebankdetails.description,
      };
      if (this.updtebankdetails.BankStatement != null) {
        this.bank_up = `${environment.APIEndpoint}bank/${this.updtebankdetails.BankStatement}`;
      } else {
        this.bank_up = null;
      }
      this.bankform.patchValue(formvalues);

      setTimeout(() => {
        this.bankform.get('status')?.setValue(this.updtebankdetails.status.toString());
      }, 0);


    });
  }

  Assignvaluevehicle(VD_key: any) {
    this.resetvehicle();
    this.VD_keys = VD_key;
    this.buttontext = 'Update';
    this.APIServies.getupdatevehicledetails(this.VD_keys).subscribe((value) => {
      this.updtevehicldetails = value['data'];

      const id = String(this.updtevehicldetails.TypeofContainers);

    const selectedCustomer = this.containertypedata.find(
      c => String(c.G_key) === id
    );

      let formvalues = {
        type_of: selectedCustomer || null,
        own_addition: this.updtevehicldetails.own_addition,
        vehicle_num: this.updtevehicldetails.VehicleNumber,
        polluctionexpiry: this.updtevehicldetails.polluctionexpiry,
        insurancenumber: this.updtevehicldetails.insurancenumber,
        rc_num: this.updtevehicldetails.RcNumber,
        year_vehicle: this.updtevehicldetails.YearofManufacture,
        permit_Vehicle: this.updtevehicldetails.PermitofVehicle,
        permit_date: this.updtevehicldetails.PermitofVehicleExpiryDate,
        fcexpirydate: this.updtevehicldetails.FCExpiryDate,
        road_tax: this.updtevehicldetails.RoadTaxExpiryDate,
        Poll_certificate:
          this.updtevehicldetails.VehiclePollutionCertificateNumber,
        insurancecompanyname: this.updtevehicldetails.InsuranceCompanyName,
        insurance_ex: this.updtevehicldetails.InsuranceExpiryDate,
        rc_file: this.updtevehicldetails.RCUpload,
        insurance_file: this.updtevehicldetails.InsuranceUpload,
        poll_file: this.updtevehicldetails.PollutionCertificateUpload,
        truck_file: this.updtevehicldetails.AttachedTruckDetails,
        vstatus: this.updtevehicldetails.status,
        vehides: this.updtevehicldetails.vehides,
      };
      this.VD_keys = this.updtevehicldetails.VD_key;
      if (this.updtevehicldetails.RCUpload != null) {
        this.rc_up = `${environment.APIEndpoint}vehicle/${this.updtevehicldetails.RCUpload}`;

      } else {
        this.rc_up = null;
      }
      if (this.updtevehicldetails.InsuranceUpload != null) {
        this.ins_up = `${environment.APIEndpoint}vehicle/${this.updtevehicldetails.InsuranceUpload}`;
      } else {
        this.ins_up = null;
      }
      if (this.updtevehicldetails.PollutionCertificateUpload != null) {
        this.pol_up = `${environment.APIEndpoint}vehicle/${this.updtevehicldetails.PollutionCertificateUpload}`;
      } else {
        this.pol_up = null;
      }
      if (this.updtevehicldetails.AttachedTruckDetails != null) {
        this.atr_up = `${environment.APIEndpoint}vehicle/${this.updtevehicldetails.AttachedTruckDetails}`;
      } else {
        this.atr_up = null;
      }
      this.vehicleform.patchValue(formvalues);

      setTimeout(() => {
        this.vehicleform.get('vstatus')?.setValue(this.updtevehicldetails.status.toString());
      }, 0);

    });
  }

  viewsVehicle(VD_key: any) {
    this.resetvehicle();
    this.VD_keys = VD_key;
    this.buttontext = 'Update';
    this.APIServies.getupdatevehicledetails(this.VD_keys).subscribe((value) => {
      this.updtevehicldetails = value['data'];

       const id = String(this.updtevehicldetails.TypeofContainers);

    const selectedCustomer = this.containertypedata.find(
      c => String(c.G_key) === id
    );


      let formvalues = {
        type_of: selectedCustomer || null,
        own_addition: this.updtevehicldetails.own_addition,
        vehicle_num: this.updtevehicldetails.VehicleNumber,
        polluctionexpiry: this.updtevehicldetails.polluctionexpiry,
        insurancenumber: this.updtevehicldetails.insurancenumber,
        rc_num: this.updtevehicldetails.RcNumber,
        year_vehicle: this.updtevehicldetails.YearofManufacture,
        permit_Vehicle: this.updtevehicldetails.PermitofVehicle,
        permit_date: this.updtevehicldetails.PermitofVehicleExpiryDate,
        fcexpirydate: this.updtevehicldetails.FCExpiryDate,
        road_tax: this.updtevehicldetails.RoadTaxExpiryDate,
        Poll_certificate:
          this.updtevehicldetails.VehiclePollutionCertificateNumber,
        insurancecompanyname: this.updtevehicldetails.InsuranceCompanyName,
        insurance_ex: this.updtevehicldetails.InsuranceExpiryDate,
        rc_file: this.updtevehicldetails.RCUpload,
        insurance_file: this.updtevehicldetails.InsuranceUpload,
        poll_file: this.updtevehicldetails.PollutionCertificateUpload,
        truck_file: this.updtevehicldetails.AttachedTruckDetails,
        vstatus: this.updtevehicldetails.status,
        vehides: this.updtevehicldetails.vehides,
      };

      this.VD_keys = this.updtevehicldetails.VD_key;

      if (this.updtevehicldetails.RCUpload != null) {
        this.rc_up = `${environment.APIEndpoint}vehicle/${this.updtevehicldetails.RCUpload}`;

      } else {
        this.rc_up = null;
      }
      if (this.updtevehicldetails.InsuranceUpload != null) {
        this.ins_up = `${environment.APIEndpoint}vehicle/${this.updtevehicldetails.InsuranceUpload}`;
      } else {
        this.ins_up = null;
      }
      if (this.updtevehicldetails.PollutionCertificateUpload != null) {
        this.pol_up = `${environment.APIEndpoint}vehicle/${this.updtevehicldetails.PollutionCertificateUpload}`;
      } else {
        this.pol_up = null;
      }
      if (this.updtevehicldetails.AttachedTruckDetails != null) {
        this.atr_up = `${environment.APIEndpoint}vehicle/${this.updtevehicldetails.AttachedTruckDetails}`;
      } else {
        this.atr_up = null;
      }

      this.vehicleform.patchValue(formvalues);

      setTimeout(() => {
        this.vehicleform.get('vstatus')?.setValue(this.updtevehicldetails.status.toString());
      }, 0);

    });
  }

  viewsDri(DD_key: any) {
    this.DD_keys = DD_key;
    this.buttontext = 'Update';
    this.APIServies.getupdatedriverdetails(this.DD_keys).subscribe((value) => {
      this.updtedriverdetails = value['data'];
      let formvalues = {
        dri_name: this.updtedriverdetails.DriverName,
        dri_number: this.updtedriverdetails.DriverPhoneNumber,
        licencenum: this.updtedriverdetails.DrivingLicenceNumber,
        aadhar_num: this.updtedriverdetails.AadharNumber,
        expired_date: this.updtedriverdetails.DrivingLicenseExpiredDate,
        dr_upload: this.updtedriverdetails.DrivingLicenceupload,
        status: this.updtedriverdetails.status,
        drivdes: this.updtedriverdetails.description,
      };

      this.DD_keys = this.updtedriverdetails.DD_key;

      if (this.updtedriverdetails.DrivingLicenceupload != null) {
        this.drl_up = `${environment.APIEndpoint}driver/${this.updtevehicldetails.DrivingLicenceupload}`;
      } else {
        this.drl_up = null;
      }
      this.driverform.patchValue(formvalues);

      setTimeout(() => {
        this.driverform.get('status')?.setValue(this.updtedriverdetails.status.toString());
      }, 0);

    });

  }
  Assignvaluedriver(DD_key: any) {
    this.DD_keys = DD_key;
    this.buttontext = 'Update';

    this.APIServies.getupdatedriverdetails(this.DD_keys).subscribe((value) => {
      if (value && value['data']) {
        this.updtedriverdetails = value['data'];

        let formvalues = {
          dri_name: this.updtedriverdetails.DriverName,
          dri_number: this.updtedriverdetails.DriverPhoneNumber,
          licencenum: this.updtedriverdetails.DrivingLicenceNumber,
          aadhar_num: this.updtedriverdetails.AadharNumber,
          expired_date: this.updtedriverdetails.DrivingLicenseExpiredDate,
          dr_upload: this.updtedriverdetails.DrivingLicenceupload,
          status: this.updtedriverdetails.status,
          drivdes: this.updtedriverdetails.description,
        };

        this.DD_keys = this.updtedriverdetails.DD_key;

        if (this.updtedriverdetails.DrivingLicenceupload != null) {
          this.drl_up = `${environment.APIEndpoint}driver/${this.updtedriverdetails.DrivingLicenceupload}`;
        } else {
          this.drl_up = null;
        }

        this.driverform.patchValue(formvalues);

        setTimeout(() => {
          this.driverform.get('status')?.setValue(this.updtedriverdetails.status.toString());
        }, 0);

      }
    });
  }

  /// insert submit values

  companysubmit() {
    this.submittedcompany = true;
    this.currentuser = this.authService.getCurrentuser();
    this.userId = this.currentuser.id;
    this.RoleId = this.currentuser.User_Roleid;
    

    if (this.companyform.invalid) {
      return;
    }
      const formData = new FormData();
      let registerdata = this.companyform.value;

      let city = registerdata.city.substring(0, 3);
      let compnays = registerdata.Company.substring(0, 5);
      let VendorsCode = city + compnays;
      formData.append('otherfile', this.other_files);
      formData.append('rocfle', this.roc_files);
      formData.append('tinfle', this.tin_files);
      formData.append('smefle', this.sme_files);
      formData.append('gstfle', this.gst_file);
      formData.append('panfle', this.pan_file);
      formData.append('Company', registerdata.Company);
      formData.append('Zipcode', registerdata.postal);
      formData.append('VendorCode', VendorsCode);
      formData.append('gst_number', registerdata.gst_number);
      formData.append('pan_number', registerdata.pan_number);
      formData.append('PhoneNumber', registerdata.company_number);
      formData.append('description', registerdata.description);
      formData.append('email', registerdata.company_email);
      formData.append('sem_msem', registerdata.sem_msem);
      formData.append('tin_number', registerdata.tin_number);
      formData.append('city', registerdata.city);
      formData.append('state', registerdata.state);
      formData.append('country', registerdata.country);
      formData.append('CompanyAddress', registerdata.off_add);
      formData.append('CompanyAddressLine1', registerdata.off_add1);
      formData.append('status', registerdata.companystatus);
      formData.append('userId', this.userId);
    if (this.buttontext == 'Submit') {
    
      formData.append('CreatedBy', this.userId.toString());
      this.APIServies.insertcompanydetails(formData).subscribe(
        (response) => {
          this.CD_ID = response.data.id;
          localStorage.setItem('CD_ID', this.CD_ID);
          this.currentuser = this.authService.getCurrentuser();
          let formvalues = {
            CompanyName: this.currentuser.CompanyName,
            Image: this.currentuser.Image,
            UserName: registerdata.Company,
            Email: registerdata.company_email,
            Status: registerdata.companystatus
          }
          this.APIServies.insertUservendordetails(formvalues, this.userId, this.CD_ID).subscribe(data => {
            this.notifyService.showSuccess("Vendor CompanyDetails created successfully.", "VendorDetails");
          }, error => { this.notifyService.showError("Something went to wrong", "VendorDetails") });
        },
        (error) => { this.notifyService.showError("Something went to wrong", "VendorDetails") }
      );
    } else {
     
      formData.append('ModifiedBy', this.userId.toString());
      this.APIServies.Updatecompanydetails(this.CD_ID, formData).subscribe(
        (response) => {
          localStorage.setItem('CD_ID', this.CD_ID);
          this.currentuser = this.authService.getCurrentuser();
          let formvalues = {
            CompanyName: this.currentuser.CompanyName,
            Image: this.currentuser.Image,
            UserName: registerdata.Company,
            Email: registerdata.company_email,
            Status: registerdata.companystatus
          }
          this.APIServies.insertUservendordetails(formvalues, this.userId, this.CD_ID).subscribe(data => {
            this.notifyService.showSuccess("Vendor CompanyDetails Update successfully.", "VendorDetails");
          }, error => { this.notifyService.showError("Something went to wrong", "VendorDetails") });
        },
        (error) => { this.notifyService.showError("Something went to wrong", "VendorDetails") }
      );
    }
  }

  banksubmit() {

    this.submittedbank = true;
    if (this.bankform.invalid) {
      return;
    }
 let registerdata = this.bankform.value;
      let city = registerdata.holder_name.substring(0, 3);
      let compnays = registerdata.bank_account.substring(0, 5);
      let banksCode = city + compnays;

      const formData = new FormData();
      formData.append('CD_ID', this.CD_ID.toString());
      formData.append('bankcode', banksCode);
      formData.append('bankfile', this.bank_file);
      formData.append('holdername', registerdata.holder_name);
      formData.append('bankaccount', registerdata.bank_account);
      formData.append('bankname', registerdata.bank_name);
      formData.append('ifsccode', registerdata.ifsc_code);
      formData.append('branch', registerdata.branch);
      formData.append('bankadd', registerdata.bank_add);
      formData.append('status', registerdata.status);
      formData.append('description', registerdata.bankdes);
    if (this.buttontext == 'Submit') {
     
      formData.append('CreatedBy', this.userId.toString());
      this.APIServies.insertbankdetails(formData).subscribe(
        (data) => {
          this.notifyService.showSuccess(
            'BankDetails created successfully.',
            'BankDetails'
          );
          this.Success = 'true';
          this.bankform.reset();
          setTimeout(function () {
            window.location.reload();
          }, 2000);
        },
        (error) => {
          this.notifyService.showError(
            'Something went to wrong',
            'BankDetails'
          );
        }
      );
    } else {
      
      formData.append('ModifiedBy', this.userId.toString());
      this.APIServies.Updatebankdetails(this.BD_keys, formData).subscribe(
        (data) => {
          this.notifyService.showSuccess(
            'BankDetails Update successfully.',
            'BankDetails'
          );
          this.Success = 'true';
          this.bankform.reset();
          setTimeout(function () {
            window.location.reload();
          }, 2000);
        },
        (error) => {
          this.notifyService.showError(
            'Something went to wrong',
            'BankDetails'
          );
        }
      );
    }
  }
  vehiclesubmit() {
    this.submitted = true;

    if (this.vehicleform.invalid) {
      return;
    }
let registerdata = this.vehicleform.value;
      let city = registerdata.vehicle_num.substring(0, 3);
      let compnays = registerdata.rc_num.substring(0, 5);
      let vehiCode = city + compnays;
      const formData = new FormData();
      formData.append('rcfile', this.rc_file);
      formData.append('vehiclecode', vehiCode);
      formData.append('pollfile', this.poll_file);
      formData.append('insufile', this.insu_file);
      formData.append('truckfile', this.truck_file);
      formData.append('CD_ID', this.CD_ID.toString());
      formData.append('type_of', registerdata.type_of.G_key);
      formData.append('vehicle_num', registerdata.vehicle_num);
      formData.append('polluctionexpiry', registerdata.polluctionexpiry);
      formData.append('insurancenumber', registerdata.insurancenumber);
      formData.append('own_addition', registerdata.own_addition);
      formData.append('rc_num', registerdata.rc_num);
      formData.append('year_vehicle', registerdata.year_vehicle);
      formData.append('permit_Vehicle', registerdata.permit_Vehicle);
      formData.append('permit_date', registerdata.permit_date);
      formData.append('fcexpirydate', registerdata.fcexpirydate);
      formData.append('road_tax', registerdata.road_tax);
      formData.append('Poll_certificate', registerdata.Poll_certificate);
      formData.append(
        'insurancecompanyname',
        registerdata.insurancecompanyname
      );
      formData.append('insurance_ex', registerdata.insurance_ex);
      formData.append('status', registerdata.vstatus);
      formData.append('vehides', registerdata.vehides);
    if (this.buttontext == 'Submit') {
      
      formData.append('CreatedBy', this.userId.toString());
      this.APIServies.insertvehicledetails(formData).subscribe(
        (data) => {
          this.notifyService.showSuccess(
            'VehicleDetails created successfully.',
            'VehicleDetails'
          );
          this.Success = 'true';
          this.vehicleform.reset();
          setTimeout(function () {
            window.location.reload();
          }, 2000);
        },
        (error) => {
          this.notifyService.showError(
            'Something went to wrong',
            'VehicleDetails'
          );
        }
      );
    } else {
      
      formData.append('ModifiedBy', this.userId.toString());
      this.APIServies.updatevehicledetails(this.VD_keys, formData).subscribe(
        (data) => {
          this.notifyService.showSuccess(
            'VehicleDetails update successfully.',
            'VehicleDetails'
          );
          this.Success = 'true';
          this.vehicleform.reset();
          setTimeout(function () {
            window.location.reload();
          }, 2000);
        },
        (error) => {
          this.notifyService.showError(
            'Something went to wrong',
            'VehicleDetails'
          );
        }
      );
    }
  }

  driversubmit() {
    this.submitteddriv = true;
    if (this.driverform.invalid) {
      return;
    }
 let registerdata = this.driverform.value;
      let city = registerdata.dri_name.substring(0, 3);
      let compnays = registerdata.licencenum.substring(0, 5);
      let drivCode = city + compnays;
      const formData = new FormData();
      formData.append('drfile', this.dr_file);
      formData.append('Drivercode', drivCode);
      formData.append('name', registerdata.dri_name);
      formData.append('phonenumber', registerdata.dri_number);
      formData.append('licencenum', registerdata.licencenum);
      formData.append('aadhar_num', registerdata.aadhar_num);
      formData.append('expired_date', registerdata.expired_date);
      formData.append('CD_ID', this.CD_ID.toString());
      formData.append('status', registerdata.status);
      formData.append('description', registerdata.drivdes);
    if (this.buttontext == 'Submit') {
     
      formData.append('CreatedBy', this.userId.toString());
      this.APIServies.insertdriverdetails(formData).subscribe(
        (data) => {
          this.notifyService.showSuccess(
            'DriverDetails create successfully.',
            'DriverDetails'
          );
          this.Success = 'true';
          this.driverform.reset();
          setTimeout(function () {
            window.location.reload();
          }, 2000);
        },
        (error) => {
          this.notifyService.showError(
            'Something went to wrong',
            'DriverDetails'
          );
        }
      );
    } else {
     
      formData.append('ModifiedBy', this.userId.toString());
      this.APIServies.updatedriverdetails(this.DD_keys, formData).subscribe(
        (data) => {
          this.notifyService.showSuccess(
            'DriverDetails Update successfully.',
            'DriverDetails'
          );
          this.Success = 'true';
          this.driverform.reset();
          setTimeout(function () {
            window.location.reload();
          }, 2000);
        },
        (error) => {
          this.notifyService.showError(
            'Something went to wrong',
            'DriverDetails'
          );
        }
      );
    }
  }
  drivess() {
    $('#Driverop').modal('hide');
  }

  vehiclclics() {
    $('#vehicleopp').modal('hide');
  }
  closeback() {
    $('#Agency').modal('hide');
  }

  refresh() {
    this.Success = 'false';
  }

  ///delete
  Deleterole(BD_key: any) {
    this.bankey = BD_key;
  }
  Deleteroledriver(DD_key: any) {
    this.driverkey = DD_key;
  }
  Deleterolevehicle(VD_key: any) {
    this.vehikey = VD_key;
  }

  deletebank() {
    this.APIServies.deletebank(this.bankey).subscribe(
      (res) => {
        this.notifyService.showSuccess(
          'Bank details deleted successfully.',
          'Bank details'
        );
        this.bankform.reset();
        $('#Delete').modal('hide');
        setTimeout(function () {
          window.location.reload();
        }, 2000);
      },
      (error: any) => {
        this.notifyService.showError('Something went to wrong', 'Bank details');
      }
    );
  }
  deletedriver() {
    this.APIServies.deletedrivers(this.driverkey).subscribe(
      (res) => {
        this.notifyService.showSuccess(
          'Driver details deleted successfully.',
          'Driver details'
        );
        this.bankform.reset();
        $('#Deleterop').modal('hide');
        setTimeout(function () {
          window.location.reload();
        }, 2000);
      },
      (error: any) => {
        this.notifyService.showError(
          'Something went to wrong',
          'Driver details'
        );
      }
    );
  }
  deletevehicle() {
    this.APIServies.deletevehicles(this.vehikey).subscribe(
      (res) => {
        this.notifyService.showSuccess(
          'Vehicle details deleted successfully.',
          'Vehicle details'
        );
        this.bankform.reset();
        $('#vehicleDelete').modal('hide');
        setTimeout(function () {
          window.location.reload();
        }, 2000);
      },
      (error: any) => {
        this.notifyService.showError(
          'Something went to wrong',
          'Vehicle details'
        );
      }
    );
  }

  canceldriv() {
    $('#Deleterop').modal('hide');
  }
  closedriv() {
    $('#Deleterop').modal('hide');
  }
  cancelbank() {
    $('#Delete').modal('hide');
  }
  closebank() {
    $('#Delete').modal('hide');
  }
  cancel() {
    $('#vehicleDelete').modal('hide');
  }
  close() {
    $('#vehicleDelete').modal('hide');
  }

  /// file uplaoding event

  gstFile(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.gst_file = file;
      this.companyform.get('gst_files')?.setValue(file);
    }
  }


  panFile(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.pan_file = file;
    }
  }

  drUpload(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.dr_file = file;
    }
  }
  bankSta(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.bank_file = file;
    }
  }

  rcFile(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.rc_file = file;
    }
  }

  insuFile(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.insu_file = file;
    }
  }
  pollFile(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.poll_file = file;
    }
  }
  truckFile(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.truck_file = file;
    }
  }
  smeFile(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.sme_files = file;
    }
  }
  rocFile(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.roc_files = file;
    }
  }
  tanFile(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.tin_files = file;
    }
  }

  otherFile(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.other_files = file;
    }
  }

}

