import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { BookingService } from '../booking.service';
import { AuthService } from 'src/app/service/auth.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from 'src/app/service/notification.service';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-importBooking',
  templateUrl: './importBooking.component.html',
  styleUrl: './importBooking.component.css',
  providers: [DatePipe],
})
export class ImportBookingComponent {
  Importbookingform!: FormGroup;
  ExportEventbookingform!: FormGroup;

  buttontext: string = 'Submit';
  headertext: string = 'Create Booking Details';
  submitted = false;
  messagetext = '';

  //user details
  currentuser: any;
  userId: any;
  RoleId: any;
  exportimport: any;

  //get customer data
  getcustomerdata: any;
  customerselect: any;
  custdata: any[] = [];

  //Staffing drop
  Staffingselect: any;
  Staffing: any;

  //container
  containerselect: any;
  containerdata: any[] = [];

  //port of loading
  portofloadingselect: any;
  portofloading: any;

  //file
  cro_files: any;
  PodFileim: any;
  fromfiles: any;
  Exportcro_files: any;

  //update
  roleconcept: any;
  bookingkey: any;

  ///available
  available: any;
  availabledata: any;
  avai = false;

  //import
  Importbookingkey: any;
  roledataimport: any;
  BookinimportID: any;
  importBookingdata: any;
  importItems: any;
  itemslength: any;

  //point of clear
  selectpointofclear: any;
  pointofclear: any[] = [];

  //location
  locationsselect: any;
  locations: any[] = [];
  views: any;

  eventlistda: any;
  eventlengthitems: any;
  selectmiles: any;
  containerId: any;
  containersselect: any;
  contanerdata: any;

  selectCompanyName: any;
  addselect: any;
  adddata: any;
  mileviews: any;

  getclientdetails: any;
  Booking_Number: any;
  custname: any;
  cro_up: any;
  Pod_up: any;
  getmilestone: any;

  ImportEventbookingform!: FormGroup;
  getvendordata: any[] = [];
  vendorselect: any;
  Imfiledata: any;

  cro_up_list: { name: string; url: string }[] = [];
  Pod_up_list: { name: string; url: string }[] = [];
  showForm13Files: any;
  filedata: any;
  showpodFiles: any;

  showDeliveryFiles: boolean = false;
  showPodFiles: boolean = false;



  ContainerCopy: any;
  EmptyReturnCopy: any;
  BillOfEntry: any;
  PODFile: any;
  DOFile: any;

  bill_files: any;
  con_files: any;
  emp_files: any;

  showCROFiles = false;
  showContainerFiles = false;
  showShippingFiles = false;
  showEIRFiles = false;
  showWeighmentFiles = false;

  croFiles: any[] = [];
  form13Files: any[] = [];
  containerFiles: any[] = [];
  shippingBillFiles: any[] = [];
  eirFiles: any[] = [];


  shipperdata: any[] = [];
  custdatavalues: any[] = [];


  //loading OCR
  uploading: boolean = false;
  loading: boolean = false;
  safePreviewUrl: SafeResourceUrl | null = null;
  showViewLink = false;
ocrJsonData: any = null;
  previewUrl: string | null = null;
previewType: 'pdf' | 'json' = 'pdf';
  extractedJsondata: any = {}; 
  customerdropdownConfig = {
    displayKey: 'UserName',
    valueKey: 'Client_Id',
    bindValue: 'Client_Id',
    search: true,
    height: '250px',
    placeholder: "--Select--",
    limitTo: this.custdatavalues?.length,
    noResultsFound: "No results found!",
    searchPlaceholder: "Search...",
    clearOnSelection: false
  };

  ShipperdropdownConfig = {
    displayKey: "Ml_LocationName",
    search: true,
    height: '250px',
    placeholder: "--Select--",
    limitTo: this.shipperdata?.length,
    noResultsFound: "No results found!",
    searchPlaceholder: "Search...",
    clearOnSelection: false
  };


  dropdownConfig = {
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

  vendordropdownConfig = {
    displayKey: "VendorName",
    search: true,
    height: '250px',
    placeholder: "--Select--",
    limitTo: this.getvendordata?.length,

    noResultsFound: "No results found!",
    searchPlaceholder: "Search...",
    clearOnSelection: false
  };


  containerdropdownConfig = {
    displayKey: "generalType",
    search: true,
    height: '250px',
    placeholder: "--Select--",
    limitTo: this.containerdata?.length,
    noResultsFound: "No results found!",
    searchPlaceholder: "Search...",
    clearOnSelection: false
  }

  portdropdownConfig = {
    displayKey: "locationName",
    search: true,
    height: '250px',
    placeholder: "--Select--",
    limitTo: this.locations?.length,
    noResultsFound: "No results found!",
    searchPlaceholder: "Search...",
    clearOnSelection: false
  }


  constructor(
    private sanitizer: DomSanitizer,
    private formBuilder: FormBuilder,
    private APIServies: BookingService,
    private router: Router,
    private authService: AuthService,
    private http: HttpClient,
    private notifyService: NotificationService,
    private datePipe: DatePipe
  ) {
    this.importBookingdata = history.state.importBooking;
    this.importItems = history.state.ImportBookingitems;

    this.views = history.state.views;
    this.mileviews = history.state.miledat;

    this.Importbookingform = this.formBuilder.group({
      rows1: this.formBuilder.array([]),
      importclients: this.formBuilder.control('', [Validators.required]),
      importcontainer_date: this.formBuilder.control('', [Validators.required]),
      Consignee: this.formBuilder.control('', [Validators.required]),
      importpointclearance: this.formBuilder.control('', [Validators.required]),
      importcustoms_date: this.formBuilder.control(''),
      DONo: this.formBuilder.control('', [Validators.required]),
      importspecial_integration: this.formBuilder.control(''),
      importcommodity: this.formBuilder.control(''),
      importcro_file: this.formBuilder.control(''),
      Pod_file: this.formBuilder.control(''),
      issuedate: this.formBuilder.control(''),
      contactperson: this.formBuilder.control(''),
      phone_number: this.formBuilder.control(''),
      dovaildupto: this.formBuilder.control(''),
      Eta: this.formBuilder.control(''),
      importportLoading: this.formBuilder.control(''),

      importvessel: this.formBuilder.control(''),
      importvoyage: this.formBuilder.control(''),
      importshippingline: this.formBuilder.control(''),
      confirmationmail: [''],
    });
    this.ImportEventbookingform = this.formBuilder.group({
      rows2: this.formBuilder.array([]),
      importcontainer: this.formBuilder.control('', [Validators.required]),
    });
    if (this.importBookingdata == '' || this.importBookingdata == undefined) {
    } else {
      this.buttontext = 'Update';
      this.headertext = 'Update Booking Details';
      let ContainerPickUpDates = this.importBookingdata[0].ContainerPickUpDate;
      let CustomsClearanceDates =
        this.importBookingdata[0].CustomsClearanceDate;
      let Etas = this.importBookingdata[0].Eta;

      if (Etas) {
        Etas = this.formatDateTime(Etas);
      }
      if (ContainerPickUpDates) {
        ContainerPickUpDates = this.formatDateTime(ContainerPickUpDates);
      }
      if (CustomsClearanceDates) {
        CustomsClearanceDates = this.formatDateTime(CustomsClearanceDates);
      }

      let formvalues = {

        importcontainer_date: ContainerPickUpDates,
        importcustoms_date: CustomsClearanceDates,
        importspecial_integration: this.importBookingdata[0].SpecialInstruction,
        importcommodity: this.importBookingdata[0].Commodity,
        issuedate: this.importBookingdata[0].IssueDateTime,
        importvessel: this.importBookingdata[0].VesselName,
        importvoyage: this.importBookingdata[0].VesselVoyage,
        importshippingline: this.importBookingdata[0].ShippingLine,

        contactperson: this.importBookingdata[0].contactperson,
        phone_number: this.importBookingdata[0].phone_number,
        dovaildupto: this.importBookingdata[0].dovaildupto,
        DONo: this.importBookingdata[0].DONo,
        Eta: Etas,
        confirmationmail: this.importBookingdata[0].confirmationmail,
      };
      this.Booking_Number = this.importBookingdata[0].BookingNumber;
      this.custname = this.importBookingdata[0].name;
      this.getclientdetails = this.importBookingdata[0].emailid;

      this.Importbookingkey = this.importBookingdata[0].IB_id;
      this.Importbookingform.patchValue(formvalues);
this.getFiles();

      if (this.mileviews == 1) {
        this.APIServies.imcontainers(this.Importbookingkey).subscribe(
          (value) => {
            this.containersselect = value;
            this.contanerdata = this.containersselect['data'];
          }
        );
      }
    }


  }
  formatDateTime(dateTime: string): string {
    const date = new Date(dateTime);
    return date.toISOString().slice(0, 16); // YYYY-MM-DDTHH:mm
  }

  getFileName(url: string): string {
    return url ? url.split('/').pop() || 'Download' : 'No File';
  }
  toggleForm13View() {
    this.showForm13Files = !this.showForm13Files;
    this.showpodFiles = !this.showpodFiles;
  }


  ngOnInit(): void {
    this.currentuser = this.authService.getCurrentuser();
    this.userId = this.currentuser.id;
    this.RoleId = this.currentuser.User_Roleid;

    this.getAll();

   

  }

  get e() {
    return this.ImportEventbookingform.controls;
  }
  filesview(){

    const apiBase = environment.APIEndpoint + 'imports/';


    if (this.DOFile) {
      this.croFiles = this.DOFile.map((f: any) => ({
        id: f.IBF_id,
        url: f.DeliveryOrder ? `${apiBase}${f.DeliveryOrder}` : null
      }));
      

//       if (this.croFiles.length > 0) {

//   const pdfUrl = this.croFiles[0].url;

//   this.previewUrl = pdfUrl;

//   this.safePreviewUrl =
//     this.sanitizer.bypassSecurityTrustResourceUrl(pdfUrl);
//      this.showViewLink = true;
// }

    }


    if (this.PODFile) {
      this.form13Files = this.PODFile.map((f: any) => ({
        id: f.Pod_id,
        url: f.pod ? `${apiBase}${f.pod}` : null
      }));
    }

    if (this.BillOfEntry) {
      this.containerFiles = this.BillOfEntry.map((f: any) => ({
        id: f.BLE_id,
        url: f.BillOfEntry ? `${apiBase}${f.BillOfEntry}` : null
      }));
    }

    if (this.EmptyReturnCopy) {
      this.shippingBillFiles = this.EmptyReturnCopy.map((f: any) => ({
        id: f.ERF_id,
        url: f.Emptyreturncopy ? `${apiBase}${f.Emptyreturncopy}` : null
      }));
    }

    if (this.ContainerCopy) {
      this.eirFiles = this.ContainerCopy.map((f: any) => ({
        id: f.Cnt_id,
        url: f.Containerphoto ? `${apiBase}${f.Containerphoto}` : null
      }));
    }
  }

  openOcrModal(pdfUrl: string, json: any) {

  this.safePreviewUrl =
    this.sanitizer.bypassSecurityTrustResourceUrl(pdfUrl);

 

  $('#OcrModal').modal('show');
}

    getFiles() {

       let apiLoaded = 0;
    let totalApi = 1;

    const checkComplete = () => {
      apiLoaded++;
      if (apiLoaded === totalApi) {
        this.filesview();
      }
    };

       this.APIServies.getimportview(this.Importbookingkey).subscribe((value) => {
    
   this.DOFile = value['DOFile'];
       this.PODFile = value['PODFile'];
       this.BillOfEntry = value['BillOfEntry'];
       this.EmptyReturnCopy = value['EmptyReturnCopy'];
       this.ContainerCopy = value['ContainerCopy'];
 checkComplete();
    
    });

      


    }
  getAll() {

    let apiLoaded = 0;
    let totalApi = 7;

    const checkComplete = () => {
      apiLoaded++;
      if (apiLoaded === totalApi) {
        this.loadLineItems();
      }
    };

    this.APIServies.dropdowngetvendor(this.userId).subscribe((value) => {
      this.vendorselect = value;
      this.getvendordata = this.vendorselect['data'];
      checkComplete();
    });

    this.APIServies.dropdownshiper(this.userId).subscribe((value) => {
      const shiperselectvalue = value;
      this.shipperdata = shiperselectvalue['data'];


      this.ShipperdropdownConfig = {
        displayKey: 'Ml_LocationName',
        search: true,
        height: '250px',
        placeholder: '--Select--',
        limitTo: this.shipperdata.length || 1000,
        noResultsFound: 'No results found!',
        searchPlaceholder: 'Search...',
        clearOnSelection: false
      };

      if (this.buttontext !== 'Submit' && this.importBookingdata?.length > 0) {
        const name = String(this.importBookingdata[0].CustomerAddress);
        const selectedShipper = this.shipperdata.find(
          c => String(c.Ml_LocationName) === name
        );

        if (selectedShipper) {
          setTimeout(() => {
            this.Importbookingform.get('Consignee')?.setValue(selectedShipper);
          }, 50);
        }
      }

      checkComplete();

    });
    this.APIServies.dropdowngetcustomer(this.userId, this.RoleId).subscribe((response) => {
      this.customerselect = response;
      this.getcustomerdata = this.customerselect['data'];
      this.custdata = this.getcustomerdata;
      this.custdatavalues = [...this.getcustomerdata];

      this.customerdropdownConfig = {
        displayKey: 'UserName',
        valueKey: 'Client_Id',
        bindValue: 'Client_Id',
        search: true,
        height: '250px',
        placeholder: '--Select--',
        limitTo: this.custdatavalues.length || 1000,
        noResultsFound: 'No results found!',
        searchPlaceholder: 'Search...',
        clearOnSelection: false
      };

      if (this.buttontext !== 'Submit' && this.importBookingdata?.length > 0) {
        const id = String(this.importBookingdata[0].CustomerName);

        const selectedCustomer = this.custdatavalues.find(
          c => String(c.Client_Id) === id
        );

        if (selectedCustomer) {
          setTimeout(() => {
            this.Importbookingform.get('importclients')?.setValue(selectedCustomer);
          }, 50);
        }
      }
      checkComplete();
    }
    );
    this.APIServies.dropdowngetgenerel(this.userId).subscribe((value) => {
      this.containerselect = value;
      this.containerdata = this.containerselect['data'];
      checkComplete();
    });

    this.APIServies.dropdowngetpoint(this.userId).subscribe((value) => {
      this.selectpointofclear = value;
      this.pointofclear = this.selectpointofclear['data'];

      this.dropdownConfig = {
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
      if (this.buttontext !== 'Submit' && this.importBookingdata?.length > 0) {
        const id = String(this.importBookingdata[0].PointOfClearance);
        const selectedPoint = this.pointofclear.find(
          c => String(c.ICD_key) === id
        );

        if (selectedPoint) {
          setTimeout(() => {
            this.Importbookingform.get('importpointclearance')?.setValue(selectedPoint);
          }, 50);
        }
        checkComplete();
      }


    });

    this.APIServies.dropdowngetlocation(this.userId).subscribe((value) => {
      this.locationsselect = value;
      this.locations = this.locationsselect['data'];
      checkComplete();
    });

    this.APIServies.imdropmile().subscribe((value) => {
      let mile = value;
      this.getmilestone = mile['data'];
      checkComplete();
    });
  }

  loadLineItems() {

    if (!this.importItems || this.importItems.length === 0) return;

    for (let i = 0; i < this.importItems.length; i++) {
      this.itemslength = i;
      this.addItemUpdate();
    }
  }
  //import
  addItem() {
    const rowGroup = this.formBuilder.group({
      importContainer_type: [''],
      importnoofcontainer_type: [''],
      importcargoweight: [''],
      Seal: [''],
      importcargokgslbs: [''],
      importpickup: [''],
      importstaffing: [''],
      importemptycontainepick: [''],
      importcontainernumber: [''],
      Vendor: [''],
      Vehiclenos: [''],
      Package: [''],
      discharge1: [''],
      discharge2: [''],
      destuffing2: [''],
      destuffing3: [''],
      destuffing4: [''],
      destuffing5: [''],
      bookingstatus: ['']
    });
    this.row1.push(rowGroup);
  }
  addItemUpdate() {


    const item = this.importItems[this.itemslength];

    const id = String(item?.VendorName);
    const container_id = String(item?.ContainerTypes);
    const emptycontainepick_Id = String(item?.ContainerPickupLocation);
    const Portofdischarge1_id = String(item?.PortofDischarge1);
    const Portofdischarge2_id = String(item?.PortofDischarge2);
    const staffing_Id = String(item?.DE_StuffingLocation);
    const staffing_Id2 = String(item?.DE_StuffingLocation2);
    const staffing_Id3 = String(item?.DE_StuffingLocation3);
    const staffing_Id4 = String(item?.DE_StuffingLocation4);
    const staffing_Id5 = String(item?.DE_StuffingLocation5);
    const Empty_ReturnAt = String(item?.EmptyReturnAt);


    const selectedVendor = this.getvendordata.find(
      c => String(c.CD_ID) === id
    );
    const selectedcontainer = this.containerdata.find(
      c => String(c.G_key) === container_id
    );
    const selectedemptycontainepick = this.pointofclear.find(
      c => String(c.ICD_key) === emptycontainepick_Id
    );

    const selectedstaffing_Id = this.pointofclear.find(
      c => String(c.ICD_key) === staffing_Id
    );
    const selectedstaffing_Id2 = this.pointofclear.find(
      c => String(c.ICD_key) === staffing_Id2
    );
    const selectedstaffing_Id3 = this.pointofclear.find(
      c => String(c.ICD_key) === staffing_Id3
    );
    const selectedstaffing_Id4 = this.pointofclear.find(
      c => String(c.ICD_key) === staffing_Id4
    );
    const selectedstaffing_Id5 = this.pointofclear.find(
      c => String(c.ICD_key) === staffing_Id5
    );
    const selecteddischarge1 = this.locations.find(
      c => String(c.L_key) === Portofdischarge1_id
    );
    const selecteddischarge2 = this.locations.find(
      c => String(c.L_key) === Portofdischarge2_id
    );
    const selectedeEmptyReturnAt = this.pointofclear.find(
      c => String(c.ICD_key) === Empty_ReturnAt
    );
    const rowGroup = this.formBuilder.group({
      Vendor: selectedVendor || null,
      importContainer_type: selectedcontainer || null,
      importcargoweight: item?.CargoWeight || '',
      Seal: item?.SealNumber || '',
      Vehiclenos: item?.Vehicleno || '',
      importcargokgslbs: item?.WeightTypes || '',
      bookingstatus: item?.status != null ? Number(item.status) : null,
      importpickup: selectedemptycontainepick || null,
      importstaffing: selectedstaffing_Id || '',
      importemptycontainepick: selectedeEmptyReturnAt || null,
      importcontainernumber: item?.containernumber || '',

      Package: item?.NoofPackage || '',
      discharge1: selecteddischarge1 || null,
      discharge2: selecteddischarge2 || null,
      destuffing2: selectedstaffing_Id2 || null,
      destuffing3: selectedstaffing_Id3 || null,
      destuffing4: selectedstaffing_Id4 || null,
      destuffing5: selectedstaffing_Id5 || null,
    });

    this.row1.push(rowGroup);
  }
  get row1() {
    return this.Importbookingform.get('rows1') as FormArray;
  }
  get row2() {
    return this.ImportEventbookingform.get('rows2') as FormArray;
  }
  get I() {
    return this.Importbookingform.controls;
  }

  removeItem(index: number): void {
    this.row1.removeAt(index);
  }

  submitImport(importdata: any) {
    this.submitted = true;

    if (this.Importbookingform.invalid) {
      this.notifyService.showWarning(' Please fill in the required field', 'BookingDetails');
      return;
    }
    if (!importdata.length) {

      this.notifyService.showWarning('Please add data in container Type details', 'BookingDetails');
      return;
    }

    const EportLineItem = importdata;
    const formData = new FormData();
    const registerdata = this.Importbookingform.value;
    const clientnames = this.RoleId !== 1
      ? registerdata?.importclients.Client_Id || []
      : this.custdata?.[0]?.Client_Id || null;


    let customeradd = registerdata.Consignee.Ml_LocationName;
    if (customeradd) {
      customeradd = registerdata.Consignee.Ml_LocationName;
    } else {
      customeradd = registerdata.Consignee;
    }
    formData.append('Customer', clientnames);
    formData.append('contactperson', registerdata.contactperson);
    formData.append('phone_number', registerdata.phone_number);
    formData.append('dovaildupto', registerdata.dovaildupto);
    formData.append('Eta', registerdata.Eta);
    formData.append('container_date', registerdata.importcontainer_date);
    formData.append('customer_add', customeradd);
    formData.append('pointclearance', registerdata.importpointclearance.ICD_key);
    formData.append('customs_date', registerdata.importcustoms_date);
    formData.append('portLoading', registerdata.importportLoading);
    formData.append('special_integration', registerdata.importspecial_integration);
    formData.append('commodity', registerdata.importcommodity);
    formData.append('issuedate', registerdata.issuedate);
    formData.append('vessel', registerdata.importvessel);
    formData.append('voyage', registerdata.importvoyage);
    formData.append('Shippingline', registerdata.importshippingline);
    formData.append('DONo', registerdata.DONo);
    formData.append('crofle', this.cro_files);
    formData.append('Pod', this.PodFileim);
    formData.append('confirmationmail', registerdata.confirmationmail);


    if (this.buttontext === 'Submit') {
      formData.append('status', '0');
      formData.append('CreatedBy', this.userId.toString());

      this.APIServies.insertImportbooking(formData).subscribe((response) => {
        this.BookinimportID = response.data.id;

        const fileFormData = new FormData();
        fileFormData.append('Importbookingkey', this.BookinimportID);
        fileFormData.append('crofle', this.cro_files);
        fileFormData.append('empfle', this.emp_files);
        fileFormData.append('confle', this.con_files);
        fileFormData.append('bilfle', this.bill_files);
        fileFormData.append('Pod', this.PodFileim);

        this.APIServies.uploadImportBookingFiles(fileFormData).subscribe(() => {
          this.populateImportLineItems(importdata, this.BookinimportID);

          this.APIServies.insertImportbookingItems(importdata).subscribe(() => {
            this.notifyService.showSuccess('Booking create successfully.', 'BookingDetails');
            this.router.navigate(['/BookingDetails']);
          });
        });


      });

    } else {
      formData.append('modifiedBy', this.userId.toString());
      this.APIServies.UpdateImportbooking(formData, this.Importbookingkey).subscribe(() => {
        const fileFormData = new FormData();

        fileFormData.append('Importbookingkey', this.Importbookingkey);
        fileFormData.append('crofle', this.cro_files);
        fileFormData.append('empfle', this.emp_files);
        fileFormData.append('confle', this.con_files);
        fileFormData.append('bilfle', this.bill_files);
        fileFormData.append('Pod', this.PodFileim);



        this.APIServies.uploadImportBookingFiles(fileFormData).subscribe(() => {
          this.populateImportLineItems(importdata, this.Importbookingkey);

          this.APIServies.UpdateImportbookingItems(importdata, this.Importbookingkey).subscribe(() => {
            this.notifyService.showSuccess('Booking Update successfully.', 'BookingDetails');
            this.router.navigate(['/BookingDetails']);
          });
        });


      });
    }
  }

  populateImportLineItems(data: any[], bookingId: number) {
    const rows1 = this.Importbookingform.get('rows1') as FormArray;

    for (let i = 0; i < rows1.length; i++) {
      const row = rows1.at(i) as FormGroup;

      const vendor = row.get('Vendor')?.value;
      const containerType = row.get('importContainer_type')?.value;

      data[i] = {
        Vendor: vendor?.CD_ID || vendor || '',
        importContainer_type: containerType?.G_key || containerType || '',
        importcontainernumber: row.get('importcontainernumber')?.value || '',
        importcargoweight: row.get('importcargoweight')?.value || '',
        Seal: row.get('Seal')?.value || '',
        Vehiclenos: row.get('Vehiclenos')?.value || '',
        importcargokgslbs: row.get('importcargokgslbs')?.value || '',
        bookingstatus: row.get('bookingstatus')?.value || '',
        importstaffing: row.get('importstaffing')?.value?.ICD_key || row.get('importstaffing')?.value || '',
        importpickup: row.get('importpickup')?.value?.ICD_key || row.get('importpickup')?.value || '',
        importemptycontainepick: row.get('importemptycontainepick')?.value?.ICD_key || row.get('importemptycontainepick')?.value || '',
        Package: row.get('Package')?.value || '',

        DE_StuffingLocation2: row.get('destuffing2')?.value?.ICD_key || row.get('destuffing2')?.value || '',
        DE_StuffingLocation3: row.get('destuffing3')?.value?.ICD_key || row.get('destuffing3')?.value || '',
        DE_StuffingLocation4: row.get('destuffing4')?.value?.ICD_key || row.get('destuffing4')?.value || '',
        DE_StuffingLocation5: row.get('destuffing5')?.value?.ICD_key || row.get('destuffing5')?.value || '',
        PortofDischarge1: row.get('discharge1')?.value?.L_key || row.get('discharge1')?.value || '',
        PortofDischarge2: row.get('discharge2')?.value?.L_key || row.get('discharge2')?.value || '',
        BookinimportID: bookingId
      };
    }
  }
  //ocr Open
  openocrPopup() {
    ($('#OcrModal') as any).modal('show');
  }
  //OCR close
  ocrcloseModal() {
    ($('#OcrModal') as any).modal('hide');
  }
  croFile(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.cro_files = file;
      this.uploading = true;
      this.loading = true;

      const formData = new FormData();
      formData.append('CroFiles', this.cro_files);

      // Allow UI to render loader first
      setTimeout(() => {
        this.APIServies.UploadFile(formData).subscribe({
          next: (response) => {

            const result = response.results[0].data;
            const bookingsnum = result.booking_details.booking_number;
            let placementdate = result.booking_details.placement_date;
            let pickup_dates = result.booking_details.pickup_date;
            const commodity = result.commodity;
            let do_issue_date = result.delivery_order.do_issue_date;
            let do_valid_upto = result.delivery_order.do_valid_upto;
            const shipping_line = result.shipping_details.shipping_line;
            const vessel_name = result.shipping_details.vessel_name;
            const voyage = result.shipping_details.voyage;

            let eta = result.port_details.eta;
            if (placementdate) {
              placementdate = this.convertToISO(placementdate);
            }
            if (pickup_dates) {
              pickup_dates = this.convertToISO(pickup_dates);
            }



            if (eta) {
              eta = this.convertToISO(eta);
            }

            if (do_issue_date) {
              do_issue_date = this.formatDateForInput(do_issue_date);
            }
            if (do_valid_upto) {
              do_valid_upto = this.formatDateForInput(do_valid_upto);
            }

            //lineItems
            const container_number = result.container_details.container_number;
            const container_type = result.container_details.container_type;
            const seal_number = result.container_details.seal_number;
            const values = result.cargo_details.cargo_weight.value;
            const weight_type = result.cargo_details.cargo_weight.weight_type;
            const number_of_packages = result.cargo_details.number_of_packages;

            this.row1.removeAt(0);
            const rowGroup = this.formBuilder.group({
              importContainer_type: container_type || null,
              importcargoweight: values  || null,
              Seal: seal_number || null,
              importcargokgslbs: weight_type || null,
              importcontainernumber: container_number || null,
              Package: number_of_packages || null,
              Vendor: null,
              Vehiclenos: null,
              bookingstatus: null,
              importpickup: null,
              importstaffing: null,
              importemptycontainepick: null,
              discharge1: null,
              discharge2: null,
              destuffing2: null,
              destuffing3: null,
              destuffing4: null,
              destuffing5: null,

            });


            this.row1.push(rowGroup);


            let formvalues = {
              DONo: bookingsnum,
              importcontainer_date: pickup_dates,
              importcustoms_date: placementdate,
              importcommodity: commodity,
              issuedate: do_issue_date,
              dovaildupto: do_valid_upto,
              Eta: eta,
              importshippingline: shipping_line,
              importvessel: vessel_name,
              importvoyage: voyage,
            };

            if (this.cro_files) {
              this.previewUrl = URL.createObjectURL(this.cro_files);
              this.safePreviewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.previewUrl);
              
            }

            
    if (typeof result === 'string') {
      try {
        this.extractedJsondata = JSON.parse(result);
      } catch {
        this.extractedJsondata = {};
      }
    } else {
      this.extractedJsondata = result || {};
    }

    this.ocrJsonData = this.extractedJsondata; 

            this.Importbookingform.patchValue(formvalues);
            this.showViewLink = true;
            this.uploading = false;
            this.loading = false;
          },
          error: (err) => {
            console.error('Upload error:', err);
            this.uploading = false;
            this.loading = false;
            this.showViewLink = false;
          }
        });
      }, 100);
    }
  }
  formatDateForInput(dateValue: any): string {

    if (!dateValue) return '';

    const d = new Date(dateValue);

    if (isNaN(d.getTime())) return '';

    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();

    return `${year}-${day}-${month}`;   // IMPORTANT
  }


  convertToISO(dateInput: any, withTime = true): string | null {

    if (!dateInput) return null;

    const date = this.convertAnyToDate(dateInput);

    if (!date) return null;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    if (withTime) {
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    } else {
      return `${year}-${month}-${day}`;
    }
  }

  convertAnyToDate(dateInput: any): Date | null {

    if (!dateInput) return null;

    // Try JS parse first
    const parsed = new Date(dateInput);

    if (!isNaN(parsed.getTime())) {
      return parsed;
    }

    // Try manual parse (dd/MM/yyyy etc.)
    const parts = dateInput
      .toString()
      .split(/[\/\-. T:]/);

    if (parts.length >= 3) {

      let day = parts[0];
      let month = parts[1];
      let year = parts[2];

      // If yyyy first
      if (year.length !== 4) {
        year = parts[0];
        month = parts[1];
        day = parts[2];
      }

      let hours = parts[3] || 0;
      let minutes = parts[4] || 0;

      return new Date(
        +year,
        +month - 1,
        +day,
        +hours,
        +minutes
      );
    }

    return null;
  }
  billEntry(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.bill_files = file;
    }
  }

  conFile(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.con_files = file;
    }
  }
  empFile(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.emp_files = file;
    }
  }
  PodFile(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.PodFileim = file;
    }
  }

  ImportaddItem() {
    const rowGroup = this.formBuilder.group({
      Milestones: [''],
      Estimate: [''],
      Actual: [''],
    });
    this.row2.push(rowGroup);
  }
  ImportaddItemupdate() {
    let EstimateTimes = this.eventlistda[this.eventlengthitems].EDT;
    let ActualTime = this.eventlistda[this.eventlengthitems].ADT;

    if (EstimateTimes) {
      EstimateTimes = this.formatDateTime(EstimateTimes);
    }
    if (ActualTime) {
      ActualTime = this.formatDateTime(ActualTime);
    }
    const EventrowGroup = this.formBuilder.group({
      Milestones: this.eventlistda?.[this.eventlengthitems]?.milestones || '',
      Estimate: EstimateTimes || '',
      Actual: ActualTime || '',
    });
    this.row2.push(EventrowGroup);
  }
  importremoveItem(index: number): void {
    this.row2.removeAt(index);
  }
  onExportBookingChange(event: any): void {
    const selectedValue = event.target.value;
    this.APIServies.immile(selectedValue).subscribe((value) => {
      this.selectmiles = value;
      this.eventlistda = this.selectmiles['data'];
      this.row2.clear();
      if (this.eventlistda && this.eventlistda.length > 0) {
        for (let j = 0; j < this.eventlistda.length; j++) {
          this.eventlengthitems = j.toString();
          this.ImportaddItemupdate();
        }
      }
    });
  }

  submitEventImport(eventdata: any) {
    this.submitted = true;
    if (this.ImportEventbookingform.invalid) {
      return;
    }
    if (!eventdata.length) {
      alert('Please add data in Milestone details');
      return;
    }
    let registerdata = this.ImportEventbookingform.value;
    this.containerId = registerdata.importcontainer;
    var b = eventdata;

    for (var i = 0; i < b.length; i++) {
      let Milestoness = i.toString() + 'Milestones';
      let Estimates = i.toString() + 'Estimate';
      let Actuals = i.toString() + 'Actual';

      let Milestones = (<HTMLInputElement>document.getElementById(Milestoness))
        .value;
      let Estimate = (<HTMLInputElement>document.getElementById(Estimates))
        .value;
      let Actual = (<HTMLInputElement>document.getElementById(Actuals)).value;

      b[i].Milestones = Milestones;
      b[i].Estimate = Estimate;
      b[i].Actual = Actual;
      b[i].containerId = this.containerId;
    }
    let payload = {
      eventdata: eventdata,
      emaildetails: this.getclientdetails,
      bookingnum: this.Booking_Number,
      name: this.custname,
    };

    if (this.buttontext === 'Submit') {
      this.APIServies.iminsertbookingeventsItems(payload).subscribe(() => {
        this.notifyService.showSuccess(
          'Booking Events created successfully.',
          'BookingDetails'
        );
        this.router.navigate(['/BookingDetails']);
      });
    } else {
      this.APIServies.imupdatebookingeventsItems(
        payload,
        this.containerId
      ).subscribe(() => {
        this.notifyService.showSuccess(
          'Booking Events updated successfully.',
          'BookingDetails'
        );
        this.router.navigate(['/BookingDetails']);
      });
    }
  }
  onCompanyName(event: any): void {
    this.selectCompanyName = event.target.value;
    this.APIServies.add(this.selectCompanyName).subscribe((value) => {
      this.addselect = value;
      this.adddata = this.addselect['data'];
      let formvalues = {
        Consignee: this.adddata[0].CompanyAddress,
      };
      this.Importbookingform.patchValue(formvalues);
    });
  }

  opendeliveryPopup() {
    ($('#deliveryModal') as any).modal('show');
  }
  openpodPopup() {
    ($('#podModal') as any).modal('show');
  }
  openbillentryPopup() {
    ($('#billentryModal') as any).modal('show');
  }
  opencontainerPopup() {
    ($('#containerModal') as any).modal('show');
  }
  openemptyPopup() {
    ($('#emptyModal') as any).modal('show');
  }

  deliveryviewFile(url: string) {
    if (url) {
      window.open(url, '_blank'); // Opens file in a new browser tab
    }
  }
  podviewFile(url: string) {
    if (url) {
      window.open(url, '_blank'); // Opens file in a new browser tab
    }
  }
  billviewFile(url: string) {
    if (url) {
      window.open(url, '_blank'); // Opens file in a new browser tab
    }
  }
  eirviewFile(url: string) {
    if (url) {
      window.open(url, '_blank'); // Opens file in a new browser tab
    }
  }
  shippingviewFile(url: string) {
    if (url) {
      window.open(url, '_blank'); // Opens file in a new browser tab
    }
  }

  deliverycloseModal() {
    $('#deliveryModal').modal('hide');
  }
  podcloseModal() {
    $('#podModal').modal('hide');
  }
  closeModal() {
    $('#billentryModal').modal('hide');
  }
  containercloseModal() {
    $('#containerModal').modal('hide');
  }
  eircloseModal() {
    $('#emptyModal').modal('hide');
  }

  deletedeliveryFile(id: number) {
    this.APIServies.deletedeliveryFile(id, this.Importbookingkey).subscribe({
      next: (res) => {
        console.log("Response API:", res);
        this.notifyService.showSuccess("Delivery Order deleted successfully", "Success");
        this.croFiles = res.CRO;
        window.location.reload();

      },
      error: (err) => {
        console.error("❌ API Error while deleting file:", err);
        this.notifyService.showError("Failed to delete file", "Error");
      }
    });
  }
  deletepodFile(id: number) {
    this.APIServies.deletepodFile(id, this.Importbookingkey).subscribe({
      next: (res) => {
        console.log("Response API:", res);
        this.notifyService.showSuccess("POD file deleted successfully", "Success");
        this.form13Files = res.CRO;
         window.location.reload();
      },
      error: (err) => {
        console.error("❌ API Error while deleting file:", err);
        this.notifyService.showError("Failed to delete file", "Error");
      }
    });
  }
  deletebillFile(id: number) {
    this.APIServies.deletebillFile(id, this.Importbookingkey).subscribe({
      next: (res) => {
        console.log("Response API:", res);
        this.notifyService.showSuccess("Bill of Entry deleted successfully", "Success");
        this.containerFiles = res.CRO;
         window.location.reload();
      },
      error: (err) => {
        console.error("❌ API Error while deleting file:", err);
        this.notifyService.showError("Failed to delete file", "Error");
      }
    });
  }
  deleteeirFile(id: number) {
    this.APIServies.deleteeirFiles(id, this.Importbookingkey).subscribe({
      next: (res) => {
        console.log("Response API:", res);
        this.notifyService.showSuccess("Container Copy deleted successfully", "Success");
        this.eirFiles = res.CRO;
         window.location.reload();
      },
      error: (err) => {
        console.error("❌ API Error while deleting file:", err);
        this.notifyService.showError("Failed to delete file", "Error");
      }
    });
  }
  deleteshipFile(id: number) {
    this.APIServies.deleteshipingFile(id, this.Importbookingkey).subscribe({
      next: (res) => {
        console.log("Response API:", res);
        this.notifyService.showSuccess("Empty Return Copy deleted successfully", "Success");
        this.shippingBillFiles = res.CRO;
         window.location.reload();
      },
      error: (err) => {
        console.error("❌ API Error while deleting file:", err);
        this.notifyService.showError("Failed to delete file", "Error");
      }
    });
  }
}
