import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ClientService } from '../../clientmodel/client.service';
import { BookingService } from '../../bookingmodel/booking.service';
import { VendorService } from '../vendor.service';
import { AuthService } from 'src/app/service/auth.service';
import { NotificationService } from 'src/app/service/notification.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { SettingService } from '../../settingmodel/setting.service';
import {
  gstValidator,
  panValidator,
  emailValidator,
  phoneNumberValidator,
} from 'src/app/core/gst-validator';
import { data, get } from 'jquery';
//import { PassThrough } from 'stream';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-vendorpricedetails',
  templateUrl: './vendorpricedetails.component.html',
  styleUrl: './vendorpricedetails.component.css'
})
export class VendorpricedetailsComponent implements OnInit, AfterViewInit {

  vendorprice!: FormGroup;
  impvendorprice!: FormGroup;
  file_up: any;
  imfile_up: any;
  submitted = false;
  V_id: any;
  PR_ID: any;
  updateuser: any;
  buttontext: string = 'Submit';
  headertext: string = 'Create Vendor Price Details';
  tablegridview!: any[];
  tablegridviews: any;
  tablegridview1!: any[];
  tablegridviewimp!: any[];
  tablegridviewimp1!: any[];
  tablegridviewsimp: any;
  dtTrigger: Subject<any> = new Subject<any>();
  containerselect: any;
  containerdata: any[] = [];
  selectpointofclear: any;
  pointofclear: any[] = [];
  Staffingselect: any;
  Staffing: any;
  locationsselect: any;
  locations: any[] = [];
  getcustomerdata: any[] = [];
  customerselect: any;
  currentuser: any;
  userId: any;
  RoleId: any;
  custdata: any;
  file_upload: any;
  registerdata: any;
  user_id: any;
  role_id: any;
  pendingprice: any;
  viewsdetails: any;
  //
  importview: any;
  importview1: any;
  imfile_upload: any;
  impprice: any;
  selectimport1: any;
  selectimportview: any;
  roleconcept: any;
  searchTerm: any;
  fromDatePending: any;
  toDatePending: any;
  fromDateCompleted: any;
  toDateCompleted: any;
  fromDateInprogress: any;
  toDateInprogress: any;
  fromDateCancelled: any;
  toDateCancelled: any;



  statusdatas: any;
  createstatus: any;
  viewstatus: any;
  statusupdate: any;
  statusdelete: any;
  statusapporval: any;

  vendordropdownConfig = {
    displayKey: "CompanyName",
    valueKey: 'CD_ID',
    bindValue: 'CD_ID',
    search: true,
    height: '250px',
    placeholder: "--Select--",
    limitTo: this.getcustomerdata?.length,
    noResultsFound: "No results found!",
    searchPlaceholder: "Search...",
    clearOnSelection: false
  };

  containerdropdownConfig = {
    displayKey: "generalType",
    valueKey: 'G_key',
    bindValue: 'G_key',
    search: true,
    height: '250px',
    placeholder: "--Select--",
    limitTo: this.containerdata?.length,
    noResultsFound: "No results found!",
    searchPlaceholder: "Search...",
    clearOnSelection: false
  };

  stuffingdropdownConfig = {
    displayKey: "Ml_LocationName",
    valueKey: 'Ml_key',
    bindValue: 'Ml_key',
    search: true,
    height: '250px',
    placeholder: "--Select--",
    limitTo: this.pointofclear?.length,
    noResultsFound: "No results found!",
    searchPlaceholder: "Search...",
    clearOnSelection: false
  };

  unloadingdropdownConfig = {
    displayKey: "locationName",
    valueKey: 'L_key',
    bindValue: 'L_key',
    search: true,
    height: '250px',
    placeholder: "--Select--",
    limitTo: this.locations?.length,
    noResultsFound: "No results found!",
    searchPlaceholder: "Search...",
    clearOnSelection: false
  };

  emptydropdownConfig = {
    displayKey: "LocationName",
    valueKey: 'ICD_key',
    bindValue: 'ICD_key',
    search: true,
    height: '250px',
    placeholder: "--Select--",
    limitTo: this.pointofclear?.length,
    noResultsFound: "No results found!",
    searchPlaceholder: "Search...",
    clearOnSelection: false
  };

  impvendordropdownConfig = {
    displayKey: "CompanyName",
    search: true,
    height: '250px',
    placeholder: "--Select--",
    limitTo: this.getcustomerdata?.length,
    noResultsFound: "No results found!",
    searchPlaceholder: "Search...",
    clearOnSelection: false
  };

  impcontainerdropdownConfig = {
    displayKey: "generalType",
    search: true,
    height: '250px',
    placeholder: "--Select--",
    limitTo: this.containerdata?.length,
    noResultsFound: "No results found!",
    searchPlaceholder: "Search...",
    clearOnSelection: false
  };

  impunloadingdropdownConfig = {
    displayKey: "locationName",
    search: true,
    height: '250px',
    placeholder: "--Select--",
    limitTo: this.locations?.length,
    noResultsFound: "No results found!",
    searchPlaceholder: "Search...",
    clearOnSelection: false
  };

  impemptydropdownConfig = {
    displayKey: "LocationName",
    search: true,
    height: '250px',
    placeholder: "--Select--",
    limitTo: this.pointofclear?.length,
    noResultsFound: "No results found!",
    searchPlaceholder: "Search...",
    clearOnSelection: false
  };

  impfulldropdownConfig = {
    displayKey: "LocationName",
    search: true,
    height: '250px',
    placeholder: "--Select--",
    limitTo: this.pointofclear?.length,
    noResultsFound: "No results found!",
    searchPlaceholder: "Search...",
    clearOnSelection: false
  };

  constructor(private formBuilder: FormBuilder, private APIService: VendorService, private APIServies: BookingService, private router: Router, private authService: AuthService, private notifyService: NotificationService, private StatusAPI: SettingService) {
    this.vendorprice = this.formBuilder.group({
      Vendor: this.formBuilder.control('', [Validators.required]),
      Container_type: formBuilder.control('', [Validators.required]),
      emptycontainepick: formBuilder.control('', [Validators.required]),
      Stuffing: formBuilder.control('', [Validators.required]),
      Stuffing2: formBuilder.control(''),
      Unloading: this.formBuilder.control('', [Validators.required]),
      validfrom: this.formBuilder.control(''),
      validto: this.formBuilder.control(''),
      transcharges: this.formBuilder.control('', [Validators.required]),
      halting: this.formBuilder.control(''),
      haltingdays: this.formBuilder.control(''),
      haltingcharges: this.formBuilder.control(''),
      //Price:this.formBuilder.control(''),
      //total:this.formBuilder.control('',[Validators.required]),
      file: this.formBuilder.control('')

    })
    this.impvendorprice = this.formBuilder.group({
      impVendor: this.formBuilder.control(''),
      impcontainer_type: formBuilder.control('', [Validators.required]),
      imemptycontainepick: formBuilder.control('', [Validators.required]),
      imUnloading: this.formBuilder.control('', [Validators.required]),
      imUnloading2: this.formBuilder.control(''),
      imfullcontainerpickup: this.formBuilder.control('', [Validators.required]),
      imvalidfrom: this.formBuilder.control(''),
      imvalidto: this.formBuilder.control(''),
      imtranscharges: this.formBuilder.control('', [Validators.required]),
      imhaltingdays: this.formBuilder.control(''),
      imhaltingcharges: this.formBuilder.control(''),
      imhalting: this.formBuilder.control(''),

    })

  }

  ngOnInit(): void {
    this.currentuser = this.authService.getCurrentuser();
    this.userId = this.currentuser.id;
    this.RoleId = this.currentuser.User_Roleid;
    this.accessstatus();
    this.ContainerTypeGet();
    this.getallgrid();

  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      (window as any).initDataTable();

      const setupTable = (
        wrapperClass: string,
        btnTargetId: string,
        leftSearchClass: string
      ) => {
        const btns = document.querySelector(`.${wrapperClass} .dt-buttons`);
        const btnTarget = document.getElementById(btnTargetId);
        if (btns && btnTarget) {
          btnTarget.appendChild(btns);
        }

        const search = document.querySelector(`.${wrapperClass} .dataTables_filter`);
        const leftBox = document.querySelector(`.${leftSearchClass}`);
        if (search && leftBox) {
          leftBox.appendChild(search);

          const searchLabel = search.querySelector('label');
          if (searchLabel) {
            const input = searchLabel.querySelector('input');
            if (input) {
              search.appendChild(input);
              searchLabel.remove();
            }
          }

          const searchInput = search.querySelector('input') as HTMLInputElement;
          if (searchInput) {
            const wrapper = document.createElement('div');
            wrapper.style.position = 'relative';
            wrapper.style.width = '200px';

            searchInput.classList.add('form-control', 'form-control-sm');
            searchInput.style.paddingLeft = '30px';
            searchInput.style.width = '100%';
            searchInput.placeholder = 'Search...';
            searchInput.style.border = '1px solid #007bff';

            const icon = document.createElement('i');
            icon.classList.add('fa', 'fa-search');
            icon.style.position = 'absolute';
            icon.style.left = '8px';
            icon.style.top = '50%';
            icon.style.transform = 'translateY(-50%)';
            icon.style.color = '#007bff';
            icon.style.pointerEvents = 'none';

            searchInput.parentNode?.insertBefore(wrapper, searchInput);
            wrapper.appendChild(searchInput);
            wrapper.appendChild(icon);
          }

          (search as HTMLElement).style.marginTop = '0';
        }
      };

      setupTable('pending-wrapper', 'datatable-buttons-pending', 'left-search');
      setupTable('completed-wrapper', 'datatable-buttons-completed', 'left-search-completed');
      setupTable('inprogress-wrapper', 'datatable-buttons-inprogress', 'left-search-inprogress');
      setupTable('cancelled-wrapper', 'datatable-buttons-cancelled', 'left-search-cancelled');

    }, 1000);
  }

  get filteredData() {
    if (!this.searchTerm && !this.fromDatePending && !this.toDatePending) {
      return this.tablegridview;
    }
    return this.tablegridview.filter(bird => {
      let matchesSearch = true;
      let matchesDateRange = true;

      if (this.searchTerm) {
        matchesSearch = Object.values(bird).some(value =>
          String(value).toLowerCase().includes(this.searchTerm.toLowerCase())
        );
      }

      const createdon = new Date(bird.createdon);
      const from = this.fromDatePending ? new Date(this.fromDatePending) : null;
      const to = this.toDatePending ? new Date(this.toDatePending) : null;

      if (from && createdon < from) matchesDateRange = false;
      if (to && createdon > to) matchesDateRange = false;

      return matchesSearch && matchesDateRange;
    });
  }

  get filteredDataCompleted() {
    if (!this.searchTerm && !this.fromDateCompleted && !this.toDateCompleted) {
      return this.tablegridview1;
    }
    return this.tablegridview1.filter(bird => {
      let matchesSearch = true;
      let matchesDateRange = true;

      if (this.searchTerm) {
        matchesSearch = Object.values(bird).some(value =>
          String(value).toLowerCase().includes(this.searchTerm.toLowerCase())
        );
      }

      const createdon = new Date(bird.createdon);
      const from = this.fromDateCompleted ? new Date(this.fromDateCompleted) : null;
      const to = this.toDateCompleted ? new Date(this.toDateCompleted) : null;

      if (from && createdon < from) matchesDateRange = false;
      if (to && createdon > to) matchesDateRange = false;

      return matchesSearch && matchesDateRange;
    });
  }
  get exportfilteredData() {
    if (!this.searchTerm && !this.fromDateInprogress && !this.toDateInprogress) {
      return this.tablegridviewimp;
    }
    return this.tablegridviewimp.filter(bird => {
      let matchesSearch = true;
      let matchesDateRange = true;

      if (this.searchTerm) {
        matchesSearch = Object.values(bird).some(value =>
          String(value).toLowerCase().includes(this.searchTerm.toLowerCase())
        );
      }

      const createdon = new Date(bird.createdon);
      const from = this.fromDateInprogress ? new Date(this.fromDateInprogress) : null;
      const to = this.toDateInprogress ? new Date(this.toDateInprogress) : null;

      if (from && createdon < from) matchesDateRange = false;
      if (to && createdon > to) matchesDateRange = false;

      return matchesSearch && matchesDateRange;
    });
  }

  get exportfilteredDataCompleted() {
    if (!this.searchTerm && !this.fromDateCancelled && !this.toDateCancelled) {
      return this.tablegridviewimp1;
    }
    return this.tablegridviewimp1.filter(bird => {
      let matchesSearch = true;
      let matchesDateRange = true;

      if (this.searchTerm) {
        matchesSearch = Object.values(bird).some(value =>
          String(value).toLowerCase().includes(this.searchTerm.toLowerCase())
        );
      }

      const createdon = new Date(bird.createdon);
      const from = this.fromDateCancelled ? new Date(this.fromDateCancelled) : null;
      const to = this.toDateCancelled ? new Date(this.toDateCancelled) : null;

      if (from && createdon < from) matchesDateRange = false;
      if (to && createdon > to) matchesDateRange = false;

      return matchesSearch && matchesDateRange;
    });
  }

  applyDateFilter() {

  }



  accessstatus() {
    const name = 'VendorPriceDetails';
    this.StatusAPI.accessstatus(this.RoleId, name).subscribe(value => {
      const statusvalues = value;
      this.statusdatas = statusvalues['data']
      this.createstatus = this.statusdatas[0].CanCreate;
      this.viewstatus = this.statusdatas[0].CanView;
      this.statusupdate = this.statusdatas[0].CanEdit;
      this.statusdelete = this.statusdatas[0].CanDelete;
      this.statusapporval = this.statusdatas[0].CanReport;
    })
  }
  getallgrid() {

    this.APIService.vendorpricegrid(this.userId, this.RoleId).subscribe(value => {
      this.tablegridviews = value;
      this.tablegridview = this.tablegridviews['data']
      console.log(this.tablegridview)
      this.tablegridview.forEach(element => {
        if (element.status == 0) {
          element["spancolur1"] = "badge badge-warning";
          element["pending"] = "Pending";

        }
      })
      this.dtTrigger.next(this.tablegridview);

    });
    this.APIService.vendorpricegridapproval(this.userId, this.RoleId).subscribe(value => {
      this.tablegridviews = value;
      this.tablegridview1 = this.tablegridviews['data']
      this.tablegridview1.forEach(element => {
        if (element.status == 1) {
          element["spancolur1"] = "badge badge-success";
          element["approval"] = "Approval";

        }
      })
      this.dtTrigger.next(this.tablegridview1);

    });

    this.APIService.vendorpricegridimp(this.userId, this.RoleId).subscribe(value => {
      this.selectimportview = value;
      this.tablegridviewimp = this.selectimportview['data']
      this.tablegridviewimp.forEach(element => {
        if (element.status == 0) {
          element["spancolur1"] = "badge badge-warning";
          element["pending"] = "Pending";

        }
      })
      this.dtTrigger.next(this.tablegridviewimp);

    });
    this.APIService.vendorpricegridapprovalimp(this.userId, this.RoleId).subscribe(value => {
      this.selectimport1 = value;
      this.tablegridviewimp1 = this.selectimport1['data']
      this.tablegridviewimp1.forEach(element => {
        if (element.status == 1) {
          element["spancolur1"] = "badge badge-success";
          element["approval"] = "Approval";
        }
      })
      this.dtTrigger.next(this.tablegridviewimp1);

    });
  }

  onPendingClick(V_id: any) {
    this.V_id = V_id;
  }
  Approval() {
    this.APIService.Approvevendorprice(this.V_id).subscribe(value => {
      this.notifyService.showSuccess("VendorPrice details Approved successfully.", "VendorPriceDetails");
      $("#Pendingrop").modal("hide");
      setTimeout(function () {
        window.location.reload();
      }, 2000);
    },
      (error: any) => {
        this.notifyService.showError("Something went to wrong", "VendorPriceDetails");
      }
    );
  }
  cancel() {
    $("#Pendingrop").modal("hide");
  }
  close() {
    $("#Pendingrop").modal("hide");
  }


  ContainerTypeGet() {
    this.APIService.dropdowngetcustomer(this.userId, this.RoleId).subscribe(value => {
      this.customerselect = value;
      this.getcustomerdata = this.customerselect['data'];
      this.custdata = this.getcustomerdata;

      this.vendordropdownConfig = {
        displayKey: "CompanyName",
        valueKey: 'CD_ID',
        bindValue: 'CD_ID',
        search: true,
        height: '250px',
        placeholder: "--Select--",
        limitTo: this.getcustomerdata?.length,
        noResultsFound: "No results found!",
        searchPlaceholder: "Search...",
        clearOnSelection: false
      };

    });

    this.APIServies.dropdowngetgenerel(this.userId).subscribe(value => {
      this.containerselect = value;
      this.containerdata = this.containerselect['data']

      this.containerdropdownConfig = {
        displayKey: "generalType",
        valueKey: 'G_key',
        bindValue: 'G_key',
        search: true,
        height: '250px',
        placeholder: "--Select--",
        limitTo: this.containerdata?.length,
        noResultsFound: "No results found!",
        searchPlaceholder: "Search...",
        clearOnSelection: false
      };

    });
    this.APIServies.dropdowngetpoint(this.userId).subscribe(value => {
      this.selectpointofclear = value;
      this.pointofclear = this.selectpointofclear['data']

      this.stuffingdropdownConfig = {
        displayKey: "LocationName",
        valueKey: 'ICD_key',
        bindValue: 'ICD_key',
        search: true,
        height: '250px',
        placeholder: "--Select--",
        limitTo: this.pointofclear?.length,
        noResultsFound: "No results found!",
        searchPlaceholder: "Search...",
        clearOnSelection: false
      };

      this.emptydropdownConfig = {
        displayKey: "LocationName",
        valueKey: 'ICD_key',
        bindValue: 'ICD_key',
        search: true,
        height: '250px',
        placeholder: "--Select--",
        limitTo: this.pointofclear?.length,
        noResultsFound: "No results found!",
        searchPlaceholder: "Search...",
        clearOnSelection: false
      };

    });

    this.APIServies.dropdowngetlocation(this.userId).subscribe(value => {
      this.locationsselect = value;
      this.locations = this.locationsselect['data']

      this.unloadingdropdownConfig = {
        displayKey: "locationName",
        valueKey: 'L_key',
        bindValue: 'L_key',
        search: true,
        height: '250px',
        placeholder: "--Select--",
        limitTo: this.locations?.length,
        noResultsFound: "No results found!",
        searchPlaceholder: "Search...",
        clearOnSelection: false
      };


    });
  }


  get f() {
    return this.vendorprice.controls;
  }
  submit() {
    this.submitted = true;
    if (this.vendorprice.invalid) {
      return;
    }
     const formData = new FormData();
      let registerdata = this.vendorprice.value;

      console.log(this.vendorprice.value);
      console.log(registerdata.Vendor);


      formData.append('file', this.file_upload);
      formData.append('Vendor', registerdata.Vendor.CD_ID);
      formData.append('Container_type', registerdata.Container_type.G_key);
      formData.append('emptycontainepick', registerdata.emptycontainepick.ICD_key);
      formData.append('Stuffing', registerdata.Stuffing.ICD_key);
      formData.append('Stuffing2', registerdata.Stuffing2);
      formData.append('Unloading', registerdata.Unloading.L_key);
      formData.append('validfrom', registerdata.validfrom);
      formData.append('validto', registerdata.validto);
      formData.append('transcharges', registerdata.transcharges);
      formData.append('halting', registerdata.halting);
      formData.append('haltingdays', registerdata.haltingdays);
      formData.append('haltingcharges', registerdata.haltingcharges);
 
    if (this.buttontext == 'Submit') {
       formData.append('Status', '0');
          formData.append('CreatedBy', this.userId);
      this.APIService.insertvendorprice(formData).subscribe(
        (response) => {
          this.notifyService.showSuccess(
            'Vendor Price Details created successfully.',
            'vendorprice'

          );
          this.vendorprice.reset();
          setTimeout(function () {
            window.location.reload();
          }, 2000);

        },
        (error) => {
          this.notifyService.showError(
            'Something went to wrong',
            'vendorprice'
          );
          console.log(error);
        }
      )

    } else {
      
      formData.append('modifiedBy', this.userId);
      this.APIService.updatepricedetails(this.PR_ID, formData).subscribe(data => {
        this.notifyService.showSuccess(" Updated successfully.", "Vendorprice Details");
        this.vendorprice.reset();
        setTimeout(function () {
          window.location.reload();
        }, 2000);
      }, error => {
        this.notifyService.showError("Something went to wrong", "Vendorprice Details");
      });
    }
  }

  reset() {
    this.vendorprice.reset();
    this.buttontext = 'Submit';
    this.viewsdetails = '1'
  }

  /// file uplaoding event

  File(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.file_upload = file;
    }
  }
  views(V_id: any) {
    this.reset();
    this.viewsdetails = '0'
    this.PR_ID = V_id
    this.APIService.getpricedetails(this.PR_ID).subscribe((value) => {
      this.updateuser = value['data'];

      
        
        const selectedVendor = this.getcustomerdata.find(
          (c) => String(c.CD_ID) === String(this.updateuser[0].VendorName)
        );

        const selectedContainer = this.containerdata.find(
          (c) => String(c.G_key) === String(this.updateuser[0].ContainerType)
        );

        const selectedEmptyContainer = this.pointofclear.find(
          (c) => String(c.ICD_key) === String(this.updateuser[0].EmptyContainerPickup)
        );

        const selectedStuffing = this.pointofclear.find(
          (c) => String(c.ICD_key) === String(this.updateuser[0].StuffingLocation)
        );

        const selectedUnloading = this.locations.find(
          (c) => String(c.L_key) === String(this.updateuser[0].Unloading)
        );


      let formvalues = {
        Vendor: selectedVendor ? selectedVendor : null,
        Container_type: selectedContainer ? selectedContainer : null,
        emptycontainepick: selectedEmptyContainer ? selectedEmptyContainer : null,
        Stuffing: selectedStuffing ? selectedStuffing : null,
        Stuffing2: this.updateuser[0].Stuffing2,
        Unloading: selectedUnloading ? selectedUnloading : null,
        validfrom: this.updateuser[0].ValidFrom,
        validto: this.updateuser[0].ValidTo,
        transcharges: this.updateuser[0].TransportationCharges,
        haltingdays: this.updateuser[0].HaltingCharges1to2days,
        haltingcharges: this.updateuser[0].HaltingCharges2to5days,
        halting: this.updateuser[0].HaltingChargesabove5days,
      };
      this.PR_ID = this.updateuser[0].V_id,
        this.vendorprice.patchValue(formvalues);
      if (this.updateuser[0].FileName != null) {
        this.file_up = `${environment.APIEndpoint}Vendorprices/${this.updateuser[0].FileName}`;

      } else {
        this.file_up = null;
      }
    });

  }
  Assignvalueuser(V_id: any) {
    this.reset();
    this.PR_ID = V_id;
    this.viewsdetails = '1'
    this.buttontext = 'Update';
    this.headertext = 'Update Vendor Price Details';
    this.APIService.getpricedetails(this.PR_ID).subscribe((value) => {
      this.updateuser = value['data'];

        
        const selectedVendor = this.getcustomerdata.find(
          (c) => String(c.CD_ID) === String(this.updateuser[0].VendorName)
        );

        const selectedContainer = this.containerdata.find(
          (c) => String(c.G_key) === String(this.updateuser[0].ContainerType)
        );

        const selectedEmptyContainer = this.pointofclear.find(
          (c) => String(c.ICD_key) === String(this.updateuser[0].EmptyContainerPickup)
        );

        const selectedStuffing = this.pointofclear.find(
          (c) => String(c.ICD_key) === String(this.updateuser[0].StuffingLocation)
        );

        const selectedUnloading = this.locations.find(
          (c) => String(c.L_key) === String(this.updateuser[0].Unloading)
        );

      let formvalues = {

        Vendor: selectedVendor ? selectedVendor : null,
        Container_type: selectedContainer ? selectedContainer : null,
        emptycontainepick: selectedEmptyContainer ? selectedEmptyContainer : null,
        Stuffing: selectedStuffing ? selectedStuffing : null,
        Stuffing2: this.updateuser[0].Stuffing2,
        Unloading: selectedUnloading ? selectedUnloading : null,
        validfrom: this.updateuser[0].ValidFrom,
        validto: this.updateuser[0].ValidTo,
        transcharges: this.updateuser[0].TransportationCharges,
        haltingdays: this.updateuser[0].HaltingCharges1to2days,
        haltingcharges: this.updateuser[0].HaltingCharges2to5days,
        halting: this.updateuser[0].HaltingChargesabove5days,
      };
      this.PR_ID = this.updateuser[0].V_id,
        this.vendorprice.patchValue(formvalues);
      if (this.updateuser[0].FileName != null) {
        this.file_up = `${environment.APIEndpoint}Vendorprices/${this.updateuser[0].FileName}`;

      } else {
        this.file_up = null;
      }
    });

  }

  //Import


  get h() {
    return this.impvendorprice.controls;
  }

  submitimp() {
    this.submitted = true;

    this.userId = this.currentuser.id;
    this.RoleId = this.currentuser.User_Roleid;
   


    if (this.impvendorprice.invalid) {
      return;
    }

    const formData = new FormData();
      let registerdata = this.impvendorprice.value;
      formData.append('impfile', this.imfile_upload);
      formData.append('impVendor', registerdata.impVendor.CD_ID);
      formData.append('impcontainer_type', registerdata.impcontainer_type.G_key);
      formData.append('imemptycontainepick', registerdata.imemptycontainepick.ICD_key);
      formData.append('imfullcontainerpickup', registerdata.imfullcontainerpickup.ICD_key);
      formData.append('imUnloading', registerdata.imUnloading.L_key);
      formData.append('imUnloading2', registerdata.imUnloading2);
      formData.append('imvalidfrom', registerdata.imvalidfrom);
      formData.append('imvalidto', registerdata.imvalidto);
      formData.append('imtranscharges', registerdata.imtranscharges);
      formData.append('imhalting', registerdata.imhalting);
      formData.append('imhaltingdays', registerdata.imhaltingdays);
      formData.append('imhaltingcharges', registerdata.imhaltingcharges);
      

    if (this.buttontext == 'Submit') {
      formData.append('Status', '0');
      formData.append('CreatedBy', this.userId);
      this.APIService.insertimpvendorprice(formData).subscribe(
        (response) => {
          this.notifyService.showSuccess(
            'Vendor Price Details created successfully.',
            'vendorprice'

          );
          this.impvendorprice.reset();
          setTimeout(function () {
            window.location.reload();
          }, 2000);

        },
        (error) => {
          this.notifyService.showError(
            'Something went to wrong',
            'vendorprice'
          );
          console.log(error);
        }
      )

    } else {
      formData.append('modifiedBy', this.userId);
      this.APIService.updateimppricedetails(this.PR_ID, formData).subscribe(data => {
        this.notifyService.showSuccess(" Updated successfully.", "Vendorprice Details");
        this.impvendorprice.reset();
        setTimeout(function () {
          window.location.reload();
        }, 2000);
      }, error => {
        this.notifyService.showError("Something went to wrong", "Vendorprice Details");
      });
    }
  }
  resetimp() {
    this.impvendorprice.reset();
    this.buttontext = 'Submit';
    this.viewsdetails = '1'

  }
  cancelimp() {
    $("#impoPendingrop").modal("hide");
  }
  closeimp() {
    $("#impoPendingrop").modal("hide");
  }
  Approvalimp() {
    this.APIService.impApprovevendorprice(this.V_id).subscribe(value => {
      this.notifyService.showSuccess("VendorPrice details Approved successfully.", "VendorPriceDetails");
      $("#impoPendingrop").modal("hide");
      setTimeout(function () {
        window.location.reload();
      }, 2000);
    },
      (error: any) => {
        this.notifyService.showError("Something went to wrong", "VendorPriceDetails");
      }
    );
  }
  viewsimp(V_id: any) {
    this.resetimp();
    this.viewsdetails = '0'
    this.PR_ID = V_id
    this.APIService.impgetpricedetails(this.PR_ID).subscribe((value) => {
      this.updateuser = value['data'];
     

      const selectedimpVendor = this.getcustomerdata.find(
          (c) => String(c.CD_ID) === String(this.updateuser[0].VendorName)
        );

        const selectedimpContainer = this.containerdata.find(
          (c) => String(c.G_key) === String(this.updateuser[0].ContainerType)
        );

        const selectedimpEmptyContainer = this.pointofclear.find(
          (c) => String(c.ICD_key) === String(this.updateuser[0].EmptyContainerPickup)
        );

        const selectedimpFullStuffing = this.pointofclear.find(
          (c) => String(c.ICD_key) === String(this.updateuser[0].FullContainerPickupFromCFSPort)
        );

        const selectedimpUnloading = this.locations.find(
          (c) => String(c.L_key) === String(this.updateuser[0].Unloading)
        );

      let formvalues = {
        impVendor: selectedimpVendor ? selectedimpVendor : null,
        impcontainer_type: selectedimpContainer ? selectedimpContainer : null,
        imemptycontainepick: selectedimpEmptyContainer ? selectedimpEmptyContainer : null,
        imfullcontainerpickup: selectedimpFullStuffing ? selectedimpFullStuffing : null,
        imUnloading: selectedimpUnloading ? selectedimpUnloading : null,
        imUnloading2: this.updateuser[0].Unloading2,
        imvalidfrom: this.updateuser[0].ValidFrom,
        imvalidto: this.updateuser[0].ValidTo,
        imtranscharges: this.updateuser[0].TransportationCharges,
        imhaltingdays: this.updateuser[0].HaltingCharges1to2days,
        imhaltingcharges: this.updateuser[0].HaltingCharges2to5days,
        imhalting: this.updateuser[0].HaltingChargesabove5days
      };
      this.PR_ID = this.updateuser[0].V_id,
        this.impvendorprice.patchValue(formvalues);
      if (this.updateuser[0].Agreement != null) {
        this.imfile_up = `${environment.APIEndpoint}Vendorprices/${this.updateuser[0].Agreement}`;
      } else {
        this.imfile_up = null;
      }
    });

  }
  Assignvalueuserimp(V_id: any) {
    this.resetimp();
    this.PR_ID = V_id;
    this.viewsdetails = '1'
    this.buttontext = 'Update';
    this.headertext = 'Update Vendor Price Details';
    this.APIService.impgetpricedetails(this.PR_ID).subscribe((value) => {
      this.updateuser = value['data'];
    

      const selectedimpVendor = this.getcustomerdata.find(
          (c) => String(c.CD_ID) === String(this.updateuser[0].VendorName)
        );

        const selectedimpContainer = this.containerdata.find(
          (c) => String(c.G_key) === String(this.updateuser[0].ContainerType)
        );

        const selectedimpEmptyContainer = this.pointofclear.find(
          (c) => String(c.ICD_key) === String(this.updateuser[0].EmptyContainerPickup)
        );

        const selectedimpFullStuffing = this.pointofclear.find(
          (c) => String(c.ICD_key) === String(this.updateuser[0].FullContainerPickupFromCFSPort)
        );

        const selectedimpUnloading = this.locations.find(
          (c) => String(c.L_key) === String(this.updateuser[0].Unloading)
        );

      let formvalues = {
        impVendor: selectedimpVendor ? selectedimpVendor : null,
        impcontainer_type: selectedimpContainer ? selectedimpContainer : null,
        imemptycontainepick: selectedimpEmptyContainer ? selectedimpEmptyContainer : null,
        imfullcontainerpickup: selectedimpFullStuffing ? selectedimpFullStuffing : null,
        imUnloading: selectedimpUnloading ? selectedimpUnloading : null,
        imUnloading2: this.updateuser[0].Unloading2,
        imvalidfrom: this.updateuser[0].ValidFrom,
        imvalidto: this.updateuser[0].ValidTo,
        imtranscharges: this.updateuser[0].TransportationCharges,
        imhaltingdays: this.updateuser[0].HaltingCharges1to2days,
        imhaltingcharges: this.updateuser[0].HaltingCharges2to5days,
        imhalting: this.updateuser[0].HaltingChargesabove5days
      };
      this.PR_ID = this.updateuser[0].V_id,
        this.impvendorprice.patchValue(formvalues);
      if (this.updateuser[0].Agreement != null) {
        this.imfile_up = `${environment.APIEndpoint}Vendorprices/${this.updateuser[0].Agreement}`;
      } else {
        this.imfile_up = null;
      }
    });
  }
  onPendingClickimp(V_id: any) {
    this.V_id = V_id;

  }
  imFile(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.imfile_upload = file;
    }
  }
}
