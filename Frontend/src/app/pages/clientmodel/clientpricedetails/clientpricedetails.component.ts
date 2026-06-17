import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientService } from '../client.service';
import { BookingService } from '../../bookingmodel/booking.service';
import { AuthService } from 'src/app/service/auth.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from 'src/app/service/notification.service';
import { gstValidator, panValidator, emailValidator, phoneNumberValidator } from 'src/app/core/gst-validator';
import { environment } from 'src/environments/environment';
import { SettingService } from '../../settingmodel/setting.service';

@Component({
  selector: 'app-clientpricedetails',
  templateUrl: './clientpricedetails.component.html',
  styleUrl: './clientpricedetails.component.css'
})
export class ClientpricedetailsComponent implements AfterViewInit {
  clientprice!: FormGroup;
  importprice!: FormGroup;
  submitted = false;
  buttontext: string = 'Submit';
  headertext: string = 'Create Client Price Details';
  registerdata: any;
  containerselect: any;
  containerdata: any[] = [];
  selectpointofclear: any;
  pointofclear: any[] = [];
  Staffingselect: any;
  Staffing: any[] = [];
  locationsselect: any;
  locations: any[] = [];
  getcustomerdata: any[] = [];
  customerselect: any;
  currentuser: any;
  userId: any;
  RoleId: any;
  custdata: any;
  file_upload: any;
  tablegridview!: any[];
  tablegridviews: any;
  tablegridview1!: any[];
  dtTrigger: Subject<any> = new Subject<any>();
  user_id: any;
  role_id: any;
  C_id: any;
  PR_ID: any;
  updateuser: any;
  viewsdetails: any;


  importview!: any[];
  selectimportview: any;

  importview1!: any[];
  selectimport1: any;
  imfile_upload: any;

  imagreement: any;
  exagreement: any;


  getImportcustomerdata: any[] = [];
  importcustdata: any;
  toDateCancelled: any;
  fromDateCancelled: any;
  searchTerm: any;
  fromDateInprogress: any;
  toDateInprogress: any;
  toDateCompleted: any;
  fromDateCompleted: any;
  fromDatePending: any;
  toDatePending: any;


  statusdatas: any;
  createstatus: any;
  viewstatus: any;
  statusupdate: any;
  statusdelete: any;
  statusapporval: any;

  clientdropdownConfig = {
    displayKey: "CompanyName",
    valueKey: 'Client_Id',
    bindValue: 'Client_Id',
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

  stuffingdropdownConfig = {
    displayKey: "Location_name",
    valueKey: 'SF_Key',
    bindValue: 'SF_Key',
    search: true,
    height: '250px',
    placeholder: "--Select--",
    limitTo: this.Staffing?.length,
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

  impclientdropdownConfig = {
    displayKey: "CompanyName",
    valueKey: 'Client_Id',
    bindValue: 'Client_Id',
    search: true,
    height: '250px',
    placeholder: "--Select--",
    limitTo: this.getImportcustomerdata?.length,
    noResultsFound: "No results found!",
    searchPlaceholder: "Search...",
    clearOnSelection: false
  };


  constructor(private formBuilder: FormBuilder, private clientAPIServies: ClientService, private APIServies: BookingService,
    private router: Router, private authService: AuthService,
    private notifyService: NotificationService, private StatusAPI: SettingService) {
    this.clientprice = this.formBuilder.group({
      clients: this.formBuilder.control('', [Validators.required]),
      Container_type: formBuilder.control('', [Validators.required]),
      emptycontainepick: formBuilder.control('', [Validators.required]),
      stuffinglocation: formBuilder.control('', [Validators.required]),
      Unloading: this.formBuilder.control('', [Validators.required]),
      transcharges: this.formBuilder.control('', [Validators.required]),
      Stuffing2: this.formBuilder.control(''),
      validfrom: this.formBuilder.control(''),
      validto: this.formBuilder.control(''),
      haltingdays: this.formBuilder.control(''),
      haltingcharges: this.formBuilder.control(''),
      halting: this.formBuilder.control('')
    })
    this.importprice = this.formBuilder.group({
      imclients: this.formBuilder.control('', [Validators.required]),
      imContainer_type: formBuilder.control('', [Validators.required]),
      imemptycontainepick: formBuilder.control('', [Validators.required]),
      imUnloading: this.formBuilder.control('', [Validators.required]),
      imUnloading2: this.formBuilder.control(''),
      imfullcontainerpickup: this.formBuilder.control('', [Validators.required]),
      imvalidfrom: this.formBuilder.control(''),
      imvalidto: this.formBuilder.control(''),
      imtranscharges: this.formBuilder.control('', [Validators.required]),
      imhaltingdays: this.formBuilder.control(''),
      imhaltingcharges: this.formBuilder.control(''),
      imhalting: this.formBuilder.control('')
    })
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

  applyDateFilter() {
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

      const Bookingdate = new Date(bird.createdon);
      const from = this.fromDatePending ? new Date(this.fromDatePending) : null;
      const to = this.toDatePending ? new Date(this.toDatePending) : null;

      if (from && Bookingdate < from) matchesDateRange = false;
      if (to && Bookingdate > to) matchesDateRange = false;

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

      const Bookingdate = new Date(bird.createdon);
      const from = this.fromDateCompleted ? new Date(this.fromDateCompleted) : null;
      const to = this.toDateCompleted ? new Date(this.toDateCompleted) : null;

      if (from && Bookingdate < from) matchesDateRange = false;
      if (to && Bookingdate > to) matchesDateRange = false;

      return matchesSearch && matchesDateRange;
    });
  }
  get exportfilteredData() {
    if (!this.searchTerm && !this.fromDateInprogress && !this.toDateInprogress) {
      return this.importview;
    }
    return this.importview.filter(bird => {
      let matchesSearch = true;
      let matchesDateRange = true;

      if (this.searchTerm) {
        matchesSearch = Object.values(bird).some(value =>
          String(value).toLowerCase().includes(this.searchTerm.toLowerCase())
        );
      }

      const Bookingdate = new Date(bird.createdon);
      const from = this.fromDateInprogress ? new Date(this.fromDateInprogress) : null;
      const to = this.toDateInprogress ? new Date(this.toDateInprogress) : null;

      if (from && Bookingdate < from) matchesDateRange = false;
      if (to && Bookingdate > to) matchesDateRange = false;

      return matchesSearch && matchesDateRange;
    });
  }

  get exportfilteredDataCompleted() {
    if (!this.searchTerm && !this.fromDateCancelled && !this.toDateCancelled) {
      return this.importview1;
    }
    return this.importview1.filter(bird => {
      let matchesSearch = true;
      let matchesDateRange = true;

      if (this.searchTerm) {
        matchesSearch = Object.values(bird).some(value =>
          String(value).toLowerCase().includes(this.searchTerm.toLowerCase())
        );
      }

      const Bookingdate = new Date(bird.createdon);
      const from = this.fromDateCancelled ? new Date(this.fromDateCancelled) : null;
      const to = this.toDateCancelled ? new Date(this.toDateCancelled) : null;

      if (from && Bookingdate < from) matchesDateRange = false;
      if (to && Bookingdate > to) matchesDateRange = false;

      return matchesSearch && matchesDateRange;
    });
  }

  ngOnInit(): void {
    this.currentuser = this.authService.getCurrentuser();
    this.userId = this.currentuser.id;
    this.RoleId = this.currentuser.User_Roleid;
    this.accessstatus();
    this.ContainerTypeGet();
    this.getallgrid();

  }

  accessstatus() {
    const name = 'ClientpriceDetails';
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


    this.clientAPIServies.clientpricegrid(this.userId, this.RoleId).subscribe(value => {
      this.tablegridviews = value;
      this.tablegridview = this.tablegridviews['data']
      this.tablegridview.forEach(element => {
        if (element.status == 0) {
          element["spancolur1"] = "badge badge-warning";
          element["pending"] = "Pending";

        }
      })
      this.dtTrigger.next(this.tablegridview);

    });
    this.clientAPIServies.clientpricegridapproval(this.userId, this.RoleId).subscribe(value => {
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
    //import
    this.clientAPIServies.imclientpricegrid(this.userId, this.RoleId).subscribe(value => {
      this.selectimportview = value;
      this.importview = this.selectimportview['data']
      this.importview.forEach(element => {
        if (element.status == 0) {
          element["spancolur1"] = "badge badge-warning";
          element["pending"] = "Pending";

        }
      })
      this.dtTrigger.next(this.importview);

    });
    this.clientAPIServies.imclientpricegridapproval(this.userId, this.RoleId).subscribe(value => {
      this.selectimport1 = value;
      this.importview1 = this.selectimport1['data']
      this.importview1.forEach(element => {
        if (element.status == 1) {
          element["spancolur1"] = "badge badge-success";
          element["approval"] = "Approval";

        }
      })
      this.dtTrigger.next(this.importview1);

    });
  }
  onPendingClick(C_id: any) {
    this.C_id = C_id;
  }
  imPendingClick(C_id: any) {
    this.C_id = C_id;
  }
  Approval() {
    this.clientAPIServies.Approveclientprice(this.C_id).subscribe(value => {
      this.notifyService.showSuccess("Client Price details Approved successfully.", "Clientspricedetails");
      $("#Pendingrop").modal("hide");
      setTimeout(function () {
        window.location.reload();
      }, 2000);
    },
      (error: any) => {
        this.notifyService.showError("Something went to wrong", "Clientspricedetails");
      }
    );
  }
  views(C_id: any) {
    this.reset();
    this.viewsdetails = '0'
    this.PR_ID = C_id
    this.clientAPIServies.getpricedetails(this.PR_ID).subscribe((value) => {
      this.updateuser = value['data'];
    
      const selectedClients = this.getcustomerdata.find(
          (c) => String(c.Client_Id) === String(this.updateuser[0].ClientName)
        );

      const selectedContainer = this.containerdata.find(
          (c) => String(c.G_key) === String(this.updateuser[0].ContainerType)
        );

      const selectedEmptycontainer = this.pointofclear.find(
          (c) => String(c.ICD_key) === String(this.updateuser[0].EmptyContainerPickup)
        );

      const selectedStuffing = this.Staffing.find(
          (c) => String(c.SF_key) === String(this.updateuser[0].StuffingLocation)
        );

        const selectedUnloading = this.locations.find(
          (c) => String(c.L_key) === String( this.updateuser[0].Unloading)
        );

      let formvalues = {
        clients: selectedClients ? selectedClients : null,
        Container_type: selectedContainer ? selectedContainer : null,
        emptycontainepick: selectedEmptycontainer ? selectedEmptycontainer : null,
        stuffinglocation: selectedStuffing ? selectedStuffing : null,
        Stuffing2: this.updateuser[0].Stuffing2,
        Unloading: selectedUnloading ? selectedUnloading : null,
        validfrom: this.updateuser[0].ValidFrom,
        validto: this.updateuser[0].ValidTo,
        transcharges: this.updateuser[0].TransportationCharges,
        haltingdays: this.updateuser[0].HaltingCharges1to2days,
        haltingcharges: this.updateuser[0].HaltingCharges2to5days,
        halting: this.updateuser[0].HaltingChargesabove5days,
      };
    
      this.PR_ID = this.updateuser[0].C_id,
        this.clientprice.patchValue(formvalues);

      if (this.updateuser[0].FileName != null) {

        this.exagreement = `${environment.APIEndpoint}clientprices/${this.updateuser[0].FileName}`;
      } else {
        this.exagreement = null;
      }

    });
  }
  Assignvalueuser(C_id: any) {
    this.reset();
    this.PR_ID = C_id;
    this.viewsdetails = '1'
    this.buttontext = 'Update';
    this.headertext = 'Update Client Price Details';
    this.clientAPIServies.getpricedetails(this.PR_ID).subscribe((value) => {
      this.updateuser = value['data'];

      const selectedClients = this.getcustomerdata.find(
          (c) => String(c.Client_Id) === String(this.updateuser[0].ClientName)
        );

      const selectedContainer = this.containerdata.find(
          (c) => String(c.G_key) === String(this.updateuser[0].ContainerType)
        );

      const selectedEmptycontainer = this.pointofclear.find(
          (c) => String(c.ICD_key) === String(this.updateuser[0].EmptyContainerPickup)
        );

      const selectedStuffing = this.Staffing.find(
          (c) => String(c.SF_key) === String(this.updateuser[0].StuffingLocation)
        );

        const selectedUnloading = this.locations.find(
          (c) => String(c.L_key) === String( this.updateuser[0].Unloading)
        );

      let formvalues = {
        clients: selectedClients ? selectedClients : null,
        Container_type: selectedContainer ? selectedContainer : null,
        emptycontainepick: selectedEmptycontainer ? selectedEmptycontainer : null,
        stuffinglocation: selectedStuffing ? selectedStuffing : null,
        Stuffing2: this.updateuser[0].Stuffing2,
        Unloading: selectedUnloading ? selectedUnloading : null,
        validfrom: this.updateuser[0].ValidFrom,
        validto: this.updateuser[0].ValidTo,
        transcharges: this.updateuser[0].TransportationCharges,
        haltingdays: this.updateuser[0].HaltingCharges1to2days,
        haltingcharges: this.updateuser[0].HaltingCharges2to5days,
        halting: this.updateuser[0].HaltingChargesabove5days,
      };
      this.PR_ID = this.updateuser[0].C_id,
        this.clientprice.patchValue(formvalues);
      if (this.updateuser[0].FileName != null) {
        this.exagreement = `${environment.APIEndpoint}clientprices/${this.updateuser[0].FileName}`;

        this.file_upload = this.updateuser[0].FileName;

      } else {
        this.exagreement = null;
        this.file_upload = null;
      }

    });
  }
  cancel() {
    $("#Pendingrop").modal("hide");
  }
  close() {
    $("#Pendingrop").modal("hide");
  }
  reset() {
    this.clientprice.reset();
    this.buttontext = 'Submit';
    this.viewsdetails = '1'
  }

  ContainerTypeGet() {


    this.clientAPIServies.customers(this.userId, this.RoleId).subscribe(value => {
      this.customerselect = value;
      this.getcustomerdata = this.customerselect['data'];
      this.custdata = this.getcustomerdata;

      this.clientdropdownConfig = {
        displayKey: "CompanyName",
        valueKey: 'Client_Id',
        bindValue: 'Client_Id',
        search: true,
        height: '250px',
        placeholder: "--Select--",
        limitTo: this.getcustomerdata?.length,
        noResultsFound: "No results found!",
        searchPlaceholder: "Search...",
        clearOnSelection: false
      };
    });
    this.clientAPIServies.importcustomers(this.userId, this.RoleId).subscribe(value => {
      let importselect = value;
      this.getImportcustomerdata = importselect['data'];
      this.importcustdata = this.getImportcustomerdata;

      this.impclientdropdownConfig = {
        displayKey: "CompanyName",
        valueKey: 'Client_Id',
        bindValue: 'Client_Id',
        search: true,
        height: '250px',
        placeholder: "--Select--",
        limitTo: this.getImportcustomerdata?.length,
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
    this.APIServies.dropdowngetStaffing(this.userId).subscribe(value => {
      this.Staffingselect = value;
      this.Staffing = this.Staffingselect['data']

      this.stuffingdropdownConfig = {
        displayKey: "Location_name",
        valueKey: 'SF_key',
        bindValue: 'SF_key',
        search: true,
        height: '250px',
        placeholder: "--Select--",
        limitTo: this.Staffing?.length,
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
    return this.clientprice.controls;
  }

  submit() {
    this.submitted = true;
    this.userId = this.currentuser.id;
    this.RoleId = this.currentuser.User_Roleid;


    
    if (this.clientprice.invalid) {
      return;
    }
    const formData = new FormData();
    let registerdata = this.clientprice.value;
    formData.append('file', this.file_upload);
    formData.append('clients', registerdata.clients.Client_Id);
    formData.append('Container_type', registerdata.Container_type.G_key);
    formData.append('Stuffing2', registerdata.Stuffing2);
    formData.append('emptycontainepick', registerdata.emptycontainepick.ICD_key);
    formData.append('stuffinglocation', registerdata.stuffinglocation.SF_key);
    formData.append('Unloading', registerdata.Unloading.L_key);
    formData.append('validfrom', registerdata.validfrom);
    formData.append('validto', registerdata.validto);
    formData.append('transcharges', registerdata.transcharges);
    formData.append('haltingdays', registerdata.haltingdays);
    formData.append('haltingcharges', registerdata.haltingcharges);
    formData.append('halting', registerdata.halting);

    if (this.buttontext == 'Submit') {

      formData.append('CreatedBy', this.userId);

           this.clientAPIServies.insertclientprice(formData).subscribe(() => {

          this.notifyService.showSuccess('Client Selling Price Details created successfully.','ClientSelling'

          );
          this.clientprice.reset();
          setTimeout(function () {
            window.location.reload();
          }, 2000);

        },
        (error) => {
          this.notifyService.showError(
            'Something went to wrong',
            'ClientSelling'
          );
          console.log(error);
        }
      )

    } else {


      formData.append('modifiedBy', this.userId);

      // this.clientAPIServies.updatepricedetails(this.PR_ID, formData).subscribe(data => {
      //   this.notifyService.showSuccess("Client Updated successfully.", "clientprices");
      //   this.clientprice.reset();
      //   setTimeout(function () {
      //     window.location.reload();
      //   }, 2000);
      // }, error => {
      //   this.notifyService.showError("Something went to wrong", "clientprices");
      // });

      this.clientAPIServies.updatepricedetails(this.PR_ID, formData).subscribe(
  data => {
    console.log("Update API success:", data);
    this.notifyService.showSuccess("Client Updated successfully.", "clientprices");
    this.clientprice.reset();
    setTimeout(() => window.location.reload(), 2000);
  },
  error => {
    console.log("Update API error:", error);
    this.notifyService.showError("Something went wrong", "clientprices");
  }
);
    }

  }
  /// file uplaoding event

  File(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.file_upload = file;
    }
  }


  //import
  get m() {
    return this.importprice.controls;
  }

  imApproval() {
    this.clientAPIServies.imApproveclientprice(this.C_id).subscribe(value => {
      this.notifyService.showSuccess("Client Price details Approved successfully.", "Clientspricedetails");
      $("#ImportPendingrop").modal("hide");
      setTimeout(function () {
        window.location.reload();
      }, 2000);
    },
      (error: any) => {
        this.notifyService.showError("Something went to wrong", "Clientspricedetails");
      }
    );
  }
  imviews(C_id: any) {
    this.reset();
    this.viewsdetails = '0'
    this.PR_ID = C_id
    this.clientAPIServies.imgetpricedetails(this.PR_ID).subscribe((value) => {
      this.updateuser = value['data'];
     
       const selectedimpClients = this.getImportcustomerdata.find(
          (c) => String(c.Client_Id) === String(this.updateuser[0].ClientName)
        );

      const selectedimpContainer = this.containerdata.find(
          (c) => String(c.G_key) === String(this.updateuser[0].ContainerType)
        );

      const selectedimpEmptycontainer = this.pointofclear.find(
          (c) => String(c.ICD_key) === String(this.updateuser[0].EmptyContainerPickup)
        );

      const selectedimpFullcontainer = this.pointofclear.find(
          (c) => String(c.ICD_key) === String(this.updateuser[0].fullcontainerpickup)
        );

        const selectedimpUnloading = this.locations.find(
          (c) => String(c.L_key) === String( this.updateuser[0].Unloading)
        );

      let formvalues = {
        imclients: selectedimpClients ? selectedimpClients : null,
        imContainer_type: selectedimpContainer ? selectedimpContainer : null,
        imemptycontainepick: selectedimpEmptycontainer ? selectedimpEmptycontainer : null,
        imUnloading: selectedimpUnloading ? selectedimpUnloading : null,
        imUnloading2: this.updateuser[0].Unloading2,
        imfullcontainerpickup: selectedimpFullcontainer ? selectedimpFullcontainer : null,
        imvalidfrom: this.updateuser[0].ValidFrom,
        imvalidto: this.updateuser[0].ValidTo,
        imtranscharges: this.updateuser[0].TransportationCharges,
        imhaltingdays: this.updateuser[0].HaltingCharges1to2days,
        imhaltingcharges: this.updateuser[0].HaltingCharges2to5days,
        imhalting: this.updateuser[0].HaltingChargesabove5days,
      
      };
      this.PR_ID = this.updateuser[0].C_id,
        this.importprice.patchValue(formvalues);

      if (this.updateuser[0].FileName != null) {


        this.imagreement = `${environment.APIEndpoint}clientprices/${this.updateuser[0].FileName}`;

      } else {
        this.imagreement = null;
      }
    });
  }
  imAssignvalueuser(C_id: any) {
    this.reset();
    this.PR_ID = C_id;
    this.viewsdetails = '1'
    this.buttontext = 'Update';
    this.headertext = 'Update Client Price Details';
    this.clientAPIServies.imgetpricedetails(this.PR_ID).subscribe((value) => {
      this.updateuser = value['data'];

       const selectedimpClients = this.getImportcustomerdata.find(
          (c) => String(c.Client_Id) === String(this.updateuser[0].ClientName)
        );

      const selectedimpContainer = this.containerdata.find(
          (c) => String(c.G_key) === String(this.updateuser[0].ContainerType)
        );

      const selectedimpEmptycontainer = this.pointofclear.find(
          (c) => String(c.ICD_key) === String(this.updateuser[0].EmptyContainerPickup)
        );

      const selectedimpFullcontainer = this.pointofclear.find(
          (c) => String(c.ICD_key) === String(this.updateuser[0].fullcontainerpickup)
        );

        const selectedimpUnloading = this.locations.find(
          (c) => String(c.L_key) === String( this.updateuser[0].Unloading)
        );

      let formvalues = {
        imclients: selectedimpClients ? selectedimpClients : null,
        imContainer_type: selectedimpContainer ? selectedimpContainer : null,
        imemptycontainepick: selectedimpEmptycontainer ? selectedimpEmptycontainer : null,
        imUnloading: selectedimpUnloading ? selectedimpUnloading : null,
        imUnloading2: this.updateuser[0].Unloading2,
        imfullcontainerpickup: selectedimpFullcontainer ? selectedimpFullcontainer : null,
        imvalidfrom: this.updateuser[0].ValidFrom,
        imvalidto: this.updateuser[0].ValidTo,
        imtranscharges: this.updateuser[0].TransportationCharges,
        imhaltingdays: this.updateuser[0].HaltingCharges1to2days,
        imhaltingcharges: this.updateuser[0].HaltingCharges2to5days,
        imhalting: this.updateuser[0].HaltingChargesabove5days,
      };
      this.PR_ID = this.updateuser[0].C_id,
        this.importprice.patchValue(formvalues);
      if (this.updateuser[0].FileName != null) {
        this.imagreement = `${environment.APIEndpoint}clientprices/${this.updateuser[0].FileName}`;

      } else {
        this.imagreement = null;
      }
    });
  }
  imcancel() {
    $("#ImportPendingrop").modal("hide");
  }
  imclose() {
    $("#ImportPendingrop").modal("hide");
  }
  imreset() {
    this.importprice.reset();
    this.buttontext = 'Submit';
    this.viewsdetails = '1'
  }
  imsubmit() {
    this.submitted = true;
    if (this.importprice.invalid) {
      return;
    }
    this.userId = this.currentuser.id;
    this.RoleId = this.currentuser.User_Roleid;
    const formData = new FormData();
    let registerdata = this.importprice.value;
    formData.append('file', this.imfile_upload);
    formData.append('clients', registerdata.imclients.Client_Id);
    formData.append('Container_type', registerdata.imContainer_type.G_key);
    formData.append('EmptyContainerPickup', registerdata.imemptycontainepick.ICD_key);
    formData.append('fullcontainerpickup', registerdata.imfullcontainerpickup.ICD_key);
    formData.append('Unloading2', registerdata.imUnloading2);
    formData.append('Unloading', registerdata.imUnloading.L_key);
    formData.append('validfrom', registerdata.imvalidfrom);
    formData.append('validto', registerdata.imvalidto);
    formData.append('transcharges', registerdata.imtranscharges);
    formData.append('haltingdays', registerdata.imhaltingdays);
    formData.append('haltingcharges', registerdata.imhaltingcharges);
    formData.append('halting', registerdata.imhalting);


    if (this.buttontext == 'Submit') {
      formData.append('CreatedBy', this.userId);
           this.clientAPIServies.iminsertclientprice(formData).subscribe(data => {
        
          this.notifyService.showSuccess(
            'Client Selling Price Details created successfully.',
            'ClientSelling'

          );
          this.importprice.reset();
          setTimeout(function () {
            window.location.reload();
          }, 2000);

        },
        (error) => {
          this.notifyService.showError(
            'Something went to wrong',
            'ClientSelling'
          );
          console.log(error);
        }
      )

    } else {

      formData.append('modifiedBy', this.userId);
      this.clientAPIServies.imupdatepricedetails(this.PR_ID, formData).subscribe(data => {
        this.notifyService.showSuccess("Client Updated successfully.", "clientprices");
        this.importprice.reset();
        setTimeout(function () {
          window.location.reload();
        }, 2000);
      }, error => {
        this.notifyService.showError("Something went to wrong", "clientprices");
      });
    }

  }
  imFile(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.imfile_upload = file;
    }
  }
}
