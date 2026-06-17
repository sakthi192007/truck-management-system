import { Component, OnInit, AfterViewInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { BookingService } from '../booking.service';
import { AuthService } from 'src/app/service/auth.service';
import { Router } from '@angular/router';
import { forkJoin, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from 'src/app/service/notification.service';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.css',
  providers: [DatePipe],
})
export class BookingComponent implements OnInit {
  bookingform!: FormGroup;
  ExportEventbookingform!: FormGroup;

  buttontext: string = 'Submit';
  headertext: string = 'Create Booking Details';
  submitted = false;
  messagetext = '';
  selectCompanyName: any;
  //user details
  currentuser: any;
  userId: any;
  RoleId: any;
  exportimport: any;

  //get customer data
  getvendordata: any[] = [];
  vendorselect: any;
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
  fromfiles: any;
  Exportcro_files: any;
  containerfiles: any;
  shippingfiles: any;
  eirfiles: any;
  sealfiles: any;
  weighmentfiles: any;

  //update
  roleconcept: any;
  bookingkey: any;

  ///available
  available: any;
  availabledata: any;
  avai = false;

  //point of clear
  selectpointofclear: any;

  pointofclear: any[] = [];


  //location
  locationsselect: any;
  locations: any[] = [];
  views: any;

  ///export
  BookinExpotID: any;
  ExBookingitems: any;
  bookingid: any;
  lengthitems: any;
  croimages: any;
  formimages: any;

  //export event

  Expotmile: any;
  exportdata!: any;
  mileselect: any;
  miles: any;
  selectmiles: any;
  containersselect: any;
  contanerdata: any;
  ES_id: any;
  eventdata: any;
  eventlistda: any;
  containerId: any;

  addselect: any;
  adddata: any;
  mileviews: any;
  CustomerId: any;

  getadmindetails: any;
  getclientdetails: any;
  Booking_Number: any;
  custname: any;
  from: any;
  Expseal: any;
  Expeir: any;
  Expcontainer: any;
  Expshipping: any;
  Exportcro: any;
  getmilestone: any;
  Exfiledata: any;
  Expweighment: any;
  filedata: any;
  Exfiledata_CRO: any;
  Exfiledata_Form13files: any;
  Exfiledata_Shippingfiles: any;
  Exfiledata_EIRfiles: any;
  Exfiledata_Weighment: any;
  Exfiledata_Sealfiles: any;
  Exfiledata_Containerfiles: any;


  croFiles: any[] = [];
  form13Files: any[] = [];
  containerFiles: any[] = [];
  shippingBillFiles: any[] = [];
  eirFiles: any[] = [];
  sealFiles: any[] = [];
  weighmentFiles: any[] = [];

  showCROFiles = false;
  showForm13Files = false;
  showContainerFiles = false;
  showShippingFiles = false;
  showEIRFiles = false;
  showSealFiles = false;
  showWeighmentFiles = false;
//loading OCR
  uploading: boolean = false;
loading: boolean = false;
 safePreviewUrl: SafeResourceUrl | null = null;
showViewLink= false;
  shipperdata: any[] = [];
  custdatavalues: any[] = [];
previewUrl: string | null = null;
ocrJsonData: any = null;
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
        valueKey: 'CD_ID',
         bindValue: 'CD_ID',
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
  
  pickupdropdownConfig = {
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

  portdropdownConfig = {
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
    this.roleconcept = history.state.Exportdata;
    this.ExBookingitems = history.state.Exportlineitems;
    this.views = history.state.views;
    this.mileviews = history.state.miledat;
    this.ExportEventbookingform = this.formBuilder.group({
      rows1: this.formBuilder.array([]),
      exportcontainer: this.formBuilder.control('', [Validators.required]),
    });
    this.bookingform = this.formBuilder.group({
      rows2: this.formBuilder.array([]),
      clients: this.formBuilder.control('', [Validators.required]),
      customer_add: this.formBuilder.control('', [Validators.required]),
      container_date: this.formBuilder.control('', [Validators.required]),
      pointclearance: this.formBuilder.control('', [Validators.required]),
      exportcustoms_date: this.formBuilder.control('', [Validators.required]),
      special_integration: this.formBuilder.control(''),
      contactperson: this.formBuilder.control(''),
      phone_number: this.formBuilder.control(''),
      portcut_off: [''],
      etd_time: [''],
      commodity: this.formBuilder.control(''),
      exportvessel: this.formBuilder.control(''),
      eportvoyage: this.formBuilder.control(''),
      eportShippingline: this.formBuilder.control(''),
      LinearBkgno: this.formBuilder.control('', [Validators.required]),
      confirmationmail: [''],
    });
    if (this.eventdata == '' || this.eventdata == undefined) {
    } else {
      this.buttontext = 'Update';
      let formvalues = {
        exportcontainer: this.eventdata[0].Containernumber,
      };
      this.ExportEventbookingform.patchValue(formvalues);
    }
    if (this.roleconcept == '' || this.roleconcept == undefined) {
    } else {
      this.headertext = 'Update Booking Details';
      this.buttontext = 'Update';
      let IssueDateTimes = this.roleconcept[0].ContainerPlacementDate;
      let CustomsClearanceDates = this.roleconcept[0].CustomsClearanceDate;
      let Portcutoffs = this.roleconcept[0].Portcutoff;
      let etds = this.roleconcept[0].etd;
      if (IssueDateTimes) {
        IssueDateTimes = this.formatDateTime(IssueDateTimes);
      }
      if (Portcutoffs) {
        Portcutoffs = this.formatDateTime(Portcutoffs);
      }
      if (etds) {
        etds = this.formatDateTime(etds);
      }
      if (CustomsClearanceDates) {
        CustomsClearanceDates = this.formatDateTime(CustomsClearanceDates);
      }
      let formvalues = {
        phone_number: this.roleconcept[0].phone_number,
        contactperson: this.roleconcept[0].contactperson,
        clients: this.roleconcept[0].CustomerName,
       
        container_date: IssueDateTimes,
        portcut_off: Portcutoffs,
        etd_time: etds,
      
        exportcustoms_date: CustomsClearanceDates,
        special_integration: this.roleconcept[0].SpecialInstruction,
        commodity: this.roleconcept[0].Commodity,
        exportvessel: this.roleconcept[0].VesselName,
        eportvoyage: this.roleconcept[0].VesselVoyage,
        eportShippingline: this.roleconcept[0].ShippingLine,
        LinearBkgno: this.roleconcept[0].LinearBkgno,
        confirmationmail: this.roleconcept[0].confirmation_mail,
      };
      this.bookingid = this.roleconcept[0].EB_id;
      this.Booking_Number = this.roleconcept[0].BookingNumber;
      this.custname = this.roleconcept[0].name;
      this.getclientdetails = this.roleconcept[0].emailid;
      this.CustomerId = this.roleconcept[0].CustomerName;
      this.bookingform.patchValue(formvalues);
      this.getFiles();
      if (this.mileviews == 1) {
        this.APIServies.containers(this.bookingid).subscribe((value) => {
          this.containersselect = value;
          this.contanerdata = this.containersselect['data'];
        });
      }
    }
   

  }




  formatDateTime(dateTime: string): string {
    const date = new Date(dateTime);
    return date.toISOString().slice(0, 16); // YYYY-MM-DDTHH:mm
  }

  ngOnInit(): void {
    this.currentuser = this.authService.getCurrentuser();
    this.userId = this.currentuser.id;
    this.RoleId = this.currentuser.User_Roleid;

    this.getAll();

   
   
   
  }
filesview(){

    

    const apiBase = environment.APIEndpoint + 'exports/';

    if (this.Exfiledata_CRO) {
      this.croFiles = this.Exfiledata_CRO.map((f: any) => ({
        id:f.EBF_id,
        url: f.CRO ? `${apiBase}${f.CRO}` : null
      }));
    }

    if (this.Exfiledata_Form13files) {
      this.form13Files = this.Exfiledata_Form13files.map((f: any) => ({
        id:f.EBF_id,
        url: f.Form13 ? `${apiBase}${f.Form13}` : null
      }));
    }

    if (this.Exfiledata_Containerfiles) {
      this.containerFiles = this.Exfiledata_Containerfiles.map((f: any) => ({
        id: f.CF_id,
        url: f.ContainerCopy ? `${apiBase}${f.ContainerCopy}` : null
      }));
    }

    if (this.Exfiledata_Shippingfiles) {
      this.shippingBillFiles = this.Exfiledata_Shippingfiles.map((f: any) => ({
        id:f.SF_id,
        url: f.ShippingBillcopy ? `${apiBase}${f.ShippingBillcopy}` : null
      }));
    }

    if (this.Exfiledata_EIRfiles) {
      this.eirFiles = this.Exfiledata_EIRfiles.map((f: any) => ({
        id:f.EIR_id,
        url: f.EIRCopy ? `${apiBase}${f.EIRCopy}` : null
      }));
    }

    if (this.Exfiledata_Sealfiles) {
      this.sealFiles = this.Exfiledata_Sealfiles.map((f: any) => ({
        id:f.ES_id,
        url: f.SealCopy ? `${apiBase}${f.SealCopy}` : null
      }));
    }

    if (this.Exfiledata_Weighment) {
      this.weighmentFiles = this.Exfiledata_Weighment.map((f: any) => ({
        id:f.WF_id,
        url: f.Weighmentphoto ? `${apiBase}${f.Weighmentphoto}` : null
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

     this.APIServies.getdocumets(this.bookingid).subscribe((value) => {
    
      this.Exfiledata_CRO = value['CRO'];
       this.Exfiledata_Form13files = value['Form13files'];
       this.Exfiledata_Shippingfiles = value['Shippingfiles'];
       this.Exfiledata_EIRfiles = value['EIRfiles'];
       this.Exfiledata_Weighment = value['Weighment'];
       this.Exfiledata_Sealfiles = value['Sealfiles'];
       this.Exfiledata_Containerfiles = value['Containerfiles'];
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

this.APIServies.dropdowngetcustomer(this.userId, this.RoleId).subscribe((response) => {
  this.customerselect = response;
  this.getcustomerdata = this.customerselect['data'] || [];
  this.custdata = this.customerselect['data'] || [];
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

  if (this.buttontext !== 'Submit' && this.roleconcept?.length > 0) {
    const id = String(this.roleconcept[0].CustomerName);

    const selectedCustomer = this.custdatavalues.find(
      c => String(c.Client_Id) === id
    );

    if (selectedCustomer) {
      setTimeout(() => {  
        this.bookingform.get('clients')?.setValue(selectedCustomer);
      }, 50);
    }
  }
   checkComplete();
});


    this.APIServies.dropdowngetvendor(this.userId).subscribe((value) => {
      this.vendorselect = value;
      this.getvendordata = this.vendorselect['data'];

      this.vendordropdownConfig = {
        displayKey: "VendorName",
        valueKey: 'CD_ID',
        bindValue: 'CD_ID',
        search: true,
        height: '250px',
        placeholder: "--Select--",
        limitTo: this.getvendordata?.length,
        noResultsFound: "No results found!",
        searchPlaceholder: "Search...",
        clearOnSelection: false
      };
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

  if (this.buttontext !== 'Submit' && this.roleconcept?.length > 0) {
    const name = String(this.roleconcept[0].CustomerAddress);
    const selectedShipper = this.shipperdata.find(
      c => String(c.Ml_LocationName) === name
    );

    if (selectedShipper) {
      setTimeout(() => {  
        this.bookingform.get('customer_add')?.setValue(selectedShipper);
      }, 50);
    }
  }

    checkComplete();

    });


    this.APIServies.dropdowngetgenerel(this.userId).subscribe((value) => {
      this.containerselect = value;
      this.containerdata = this.containerselect['data'];

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
 if (this.buttontext !== 'Submit' && this.roleconcept?.length > 0) {
    const id = String(this.roleconcept[0].PointOfClearance);
    const selectedPoint = this.pointofclear.find(
      c => String(c.ICD_key) === id
    );

    if (selectedPoint) {
      setTimeout(() => {  
        this.bookingform.get('pointclearance')?.setValue(selectedPoint);
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

    this.APIServies.dropmile().subscribe((value) => {
      let mile = value;
      this.getmilestone = mile['data'];
       checkComplete();
    });
  }

loadLineItems() {
  if (!this.ExBookingitems || this.ExBookingitems.length === 0) return;

  for (let i = 0; i < this.ExBookingitems.length; i++) {
    this.lengthitems = i;
    this.ExportaddItemUpdate();
  }
}

  ///export
  get f() {
    return this.bookingform.controls;
  }
  get e() {
    return this.ExportEventbookingform.controls;
  }
  get row1() {
    return this.ExportEventbookingform.get('rows1') as FormArray;
  }
  get row2() {
    return this.bookingform.get('rows2') as FormArray;
  }
  ExportaddItem() {
    const rowGroup = this.formBuilder.group({
      Vendor: [''],
      Container_type: [''],
      exportcontainernumber: [''],
      noofcontainer_type: [''],
      cargoweight: [''],
      Seal: [''],
      cargokgslbs: [''],
      staffing: [''],
      emptycontainepick: [''],
      Vehiclenos: [''],
      Package: [''],
      stuffing2: [''],
      stuffing3: [''],
      stuffing4: [''],
      stuffing5: [''],
      loading1: [''],
      loading2: [''],
      bookingstatus: ['']

    });
    this.row2.push(rowGroup);
  }
ExportaddItemUpdate() {


  const item = this.ExBookingitems[this.lengthitems];

  const id = String(item?.VendorName);
  const container_id = String(item?.ContainerTypes);
  const emptycontainepick_Id = String(item?.EmptyContainerPickup);
  const staffing_Id = String(item?.StuffingLocation);
  const staffing_Id2 = String(item?.StuffingLocation2);
  const staffing_Id3 = String(item?.StuffingLocation3);
  const staffing_Id4 = String(item?.StuffingLocation4);
  const staffing_Id5 = String(item?.StuffingLocation5);
  const PortofLoading_id = String(item?.PortofLoading1);
  const PortofLoading2_id = String(item?.PortofLoading2);

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
   const selectedicd = this.locations.find(
    c => String(c.L_key) === PortofLoading_id
  );
   const selectedDestination = this.locations.find(
    c => String(c.L_key) === PortofLoading2_id
  );

  const rowGroup = this.formBuilder.group({
  Vendor: selectedVendor || null,
    Container_type: selectedcontainer  || null,
    exportcontainernumber: item?.containernumber || '',
    noofcontainer_type: item?.NoOfContainers || '',
    cargoweight: item?.CargoWeight || '',
    Seal: item?.SealNumber || '',
    cargokgslbs: item?.WeightTypes || '',
     bookingstatus: item?.status != null ? Number(item.status) : null,
    staffing: selectedstaffing_Id || null,
    emptycontainepick: selectedemptycontainepick || null,
    Vehiclenos: item?.Vehicleno || '',
    Package: item?.NoofPackage || '',
    stuffing2: selectedstaffing_Id2 || null,
    stuffing3:selectedstaffing_Id3 || null,
    stuffing4: selectedstaffing_Id4 || null,
    stuffing5: selectedstaffing_Id5 || null,
    loading1: selectedicd || null,
    loading2: selectedDestination || null
  });

  this.row2.push(rowGroup);
}


  ExportremoveItem(index: number): void {
    this.row2.removeAt(index);
  }
  submit(anotherdata: any) {
    this.submitted = true;

    if (this.bookingform.invalid) {
        this.notifyService.showWarning(' Please fill in the required field', 'BookingDetails');
      return;
    }

    if (!anotherdata.length) {
         this.notifyService.showWarning('Please add data in container Type details', 'BookingDetails');
      return;
    }

    const EportLineItem = anotherdata;

    const formData = new FormData();
    const registerdata = this.bookingform.value;
    const clientnames = this.RoleId !== 1
      ? registerdata?.clients.Client_Id || []
      : this.custdata?.[0]?.Client_Id || null;

        let customeradd = registerdata.customer_add.Ml_LocationName; 
  if(customeradd){
customeradd = registerdata.customer_add.Ml_LocationName;
  }else{
 customeradd = registerdata.customer_add;
  }

    // let cliennames = this.RoleId === 0 ? registerdata.clients : this.custdata[0].User_ID;

    formData.append('contactperson', registerdata.contactperson);
    formData.append('phone_number', registerdata.phone_number);
    formData.append('Portcutoff', registerdata.portcut_off);
    formData.append('etd', registerdata.etd_time);
    formData.append('Customer', clientnames);
    formData.append('container_date', registerdata.container_date);
    formData.append('customer_add', customeradd);
    formData.append('pointclearance', registerdata.pointclearance.ICD_key);
    formData.append('customs_date', registerdata.exportcustoms_date);
    formData.append('special_integration', registerdata.special_integration);
    formData.append('commodity', registerdata.commodity);
    formData.append('vessel', registerdata.exportvessel);
    formData.append('voyage', registerdata.eportvoyage);
    formData.append('Shippingline', registerdata.eportShippingline);
    formData.append('LinearBkgno', registerdata.LinearBkgno);
    formData.append('crofle', this.Exportcro_files);
    formData.append('from13', this.fromfiles);
    formData.append('Confirmationemail', registerdata.confirmationmail)

    if (this.buttontext === 'Submit') {
      formData.append('status', '0');
      formData.append('CreatedBy', this.userId.toString());

      this.APIServies.insertEportbooking(formData).subscribe((response) => {
        this.BookinExpotID = response.data.id;

        const fileFormData = new FormData();
        fileFormData.append('BookingId', this.BookinExpotID.toString());
        fileFormData.append('crofle', this.Exportcro_files);
        fileFormData.append('from13', this.fromfiles);
        fileFormData.append('containerfile', this.containerfiles);
        fileFormData.append('shipfile', this.shippingfiles);
        fileFormData.append('eirfiles', this.eirfiles);
        fileFormData.append('sealfiles', this.sealfiles);
        fileFormData.append('weighmentfiles', this.weighmentfiles);

        this.APIServies.uploadExportBookingFiles(fileFormData).subscribe(() => {
          this.populateLineItems(anotherdata, this.BookinExpotID);

          this.APIServies.insertEportbookingItems(anotherdata).subscribe(() => {
            this.notifyService.showSuccess('Booking create successfully.', 'BookingDetails');
            this.router.navigate(['/BookingDetails']);
          });
        });


      });

    } else {
      formData.append('modifiedBy', this.userId.toString());
      this.APIServies.updateEportbooking(formData, this.bookingid).subscribe(() => {
        const fileFormData = new FormData();
        fileFormData.append('BookingId', this.bookingid.toString());
        fileFormData.append('crofle', this.Exportcro_files);
        fileFormData.append('from13', this.fromfiles);
        fileFormData.append('containerfile', this.containerfiles);
        fileFormData.append('shipfile', this.shippingfiles);
        fileFormData.append('eirfiles', this.eirfiles);
        fileFormData.append('sealfiles', this.sealfiles);
        fileFormData.append('weighmentfiles', this.weighmentfiles);

        this.APIServies.uploadExportBookingFiles(fileFormData).subscribe(() => {
          this.populateLineItems(anotherdata, this.bookingid);

          this.APIServies.updateEportbookingItems(anotherdata, this.bookingid).subscribe(() => {
            this.notifyService.showSuccess('Booking update successfully.', 'BookingDetails');
            this.router.navigate(['/BookingDetails']);
          });
        });
      });
    }
  }

populateLineItems(data: any[], bookingId: number) {
  const rows2 = this.bookingform.get('rows2') as FormArray;

  for (let i = 0; i < rows2.length; i++) {
    const row = rows2.at(i) as FormGroup;

    const vendor = row.get('Vendor')?.value;
    const containerType = row.get('Container_type')?.value;

    data[i] = {
      Vendor: vendor?.CD_ID || vendor || '',   // If object → CD_ID, else value
      Container_type: containerType?.G_key || containerType || '', // Only G_key
      exportcontainernumber: row.get('exportcontainernumber')?.value || '',
      cargoweight: row.get('cargoweight')?.value || '',
      Seal: row.get('Seal')?.value || '',
      Vehiclenos: row.get('Vehiclenos')?.value || '',
      cargokgslbs: row.get('cargokgslbs')?.value || '',
      bookingstatus: row.get('bookingstatus')?.value || '',
      staffing: row.get('staffing')?.value?.ICD_key || row.get('staffing')?.value || '',
      emptycontainepick: row.get('emptycontainepick')?.value?.ICD_key || row.get('emptycontainepick')?.value || '',
      Package: row.get('Package')?.value || '',
      stuffing2: row.get('stuffing2')?.value?.ICD_key || row.get('stuffing2')?.value || '',
      stuffing3: row.get('stuffing3')?.value?.ICD_key || row.get('stuffing3')?.value || '',
      stuffing4: row.get('stuffing4')?.value?.ICD_key || row.get('stuffing4')?.value || '',
      stuffing5: row.get('stuffing5')?.value?.ICD_key || row.get('stuffing5')?.value || '',
      loading1: row.get('loading1')?.value?.L_key || row.get('loading1')?.value || '',
      loading2: row.get('loading2')?.value?.L_key || row.get('loading2')?.value || '',
      BookinExpotID: bookingId
    };
  }
}


eportcrocroFile(event: any) {
  if (event.target.files.length > 0) {
    const file = event.target.files[0];
    this.Exportcro_files = file;

    this.uploading = true;
    this.loading = true;

    const formData = new FormData();
    formData.append('CroFiles', this.Exportcro_files);

    // Allow UI to render loader first
    setTimeout(() => {
      this.APIServies.UploadFile(formData).subscribe({
        next: (response) => {
         
          const result = response.results[0].data;
          const bookingsnum = result.booking_details.booking_number;
          let placementdate = result.booking_details.placement_date;
          const commodity = result.commodity;


          if (placementdate) {
  placementdate  =this.convertToISO(placementdate);
}

          let etd = result.port_details.etd;

if (etd) {
  etd  =this.convertToISO(etd);
}

console.log(etd);

        
   let port_cut_off = result.port_details.port_cut_off;

if (port_cut_off) {
 port_cut_off =this.convertToISO(port_cut_off);
}

console.log(port_cut_off);
         
        const shipping_line = result.shipping_details.shipping_line;
        const vessel_name = result.shipping_details.vessel_name;
        const voyage = result.shipping_details.voyage;


  let formvalues = {
        LinearBkgno: bookingsnum,
        container_date:placementdate,
        commodity:commodity,
        portcut_off:port_cut_off,
        etd_time:etd,
        eportShippingline:shipping_line,
        exportvessel:vessel_name,
        eportvoyage:voyage,
      };
     
      if (this.Exportcro_files) {
      this.previewUrl = URL.createObjectURL(this.Exportcro_files);
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

      this.bookingform.patchValue(formvalues);
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


  eportcrocroFrom13(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.fromfiles = file;
    }
  }
  exportcontainerphoto(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.containerfiles = file;
    }
  }

  exportshipping(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.shippingfiles = file;
    }
  }
  exporteir(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.eirfiles = file;
    }
  }
  exportseal(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.sealfiles = file;
    }
  }
  exportWeighment(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.weighmentfiles = file;
    }
  }

  ///export Milestones

  EventremoveItem(index: number) {
    this.row1.removeAt(index);
  }
  Exportevent(eventdata: any) {
    this.submitted = true;
    if (this.ExportEventbookingform.invalid) {
      return;
    }
    if (!eventdata.length) {
      alert('Please add data in Milestones details');
      return;
    }
    let registerdata = this.ExportEventbookingform.value;
    this.containerId = registerdata.exportcontainer;
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
      this.APIServies.insertbookingeventsItems(payload).subscribe(() => {
        this.notifyService.showSuccess(
          'Booking Events created successfully.',
          'BookingDetails'
        );
        this.router.navigate(['/BookingDetails']);
      });
    } else {
      this.APIServies.updatebookingeventsItems(
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
  ExaddItem() {
    const rowGroup = this.formBuilder.group({
      Milestones: [''],
      Estimate: [''],
      Actual: [''],
    });

    this.row1.push(rowGroup);
  }
  ExaddItemupdate() {
    let EstimateTimes = this.eventlistda[this.lengthitems].EDT;
    let ActualTime = this.eventlistda[this.lengthitems].ADT;

    if (EstimateTimes) {
      EstimateTimes = this.formatDateTime(EstimateTimes);
    }
    if (ActualTime) {
      ActualTime = this.formatDateTime(ActualTime);
    }
    const EventrowGroup = this.formBuilder.group({
      Milestones: this.eventlistda?.[this.lengthitems]?.milestones || '',
      Estimate: EstimateTimes,
      Actual: ActualTime,
    });
    this.row1.push(EventrowGroup);
  }
  onExportBookingChange(event: any): void {
    const selectedValue = event.target.value;
    this.APIServies.mile(selectedValue).subscribe((value) => {
      this.selectmiles = value;
      this.eventlistda = this.selectmiles['data'];
      this.row1.clear();
      if (this.eventlistda && this.eventlistda.length > 0) {
        for (let j = 0; j < this.eventlistda.length; j++) {
          this.lengthitems = j.toString();
          this.ExaddItemupdate();
        }
      }
    });
  }
  onCompanyName(event: any): void {
    this.selectCompanyName = event.target.value;
    this.APIServies.add(this.selectCompanyName).subscribe((value) => {
      this.addselect = value;
      this.adddata = this.addselect['data'];
      let formvalues = {
        customer_add: this.adddata[0].CompanyAddress,
      };
      this.bookingform.patchValue(formvalues);
    });
  }

    getFileName(url: string | null): string {
    if (!url) return '';
    return url.split('/').pop() || '';
  }
  openocrPopup(){
($('#OcrModal') as any).modal('show');
  }
//cro open
  opencroPopup() {
    ($('#croModal') as any).modal('show');
  }
//from open
  openfromPopup() {
    ($('#formModal') as any).modal('show');
  }
//from shipping
  openshippingPopup() {
    ($('#shipModal') as any).modal('show');
  }
//from eir
  openeirPopup() {
    ($('#eirModal') as any).modal('show');
  }
//from seal
  opensealPopup() {
    ($('#sealModal') as any).modal('show');
  }
//from weighment
  openweighmentPopup() {
    ($('#weighmentModal') as any).modal('show');
  }
  //container open
  openContainerPopup() {
    ($('#containerModal') as any).modal('show');
  }



//cro view
  croviewFile(url: string) {
    if (url) {
      window.open(url, '_blank'); // Opens file in a new browser tab
    }
  }
//from view
  formviewFile(url: string) {
    if (url) {
      window.open(url, '_blank'); // Opens file in a new browser tab
    }
  }
  eirviewFile(url: string) {
    if (url) {
      window.open(url, '_blank'); // Opens file in a new browser tab
    }
  }
  sealviewFile(url: string) {
    if (url) {
      window.open(url, '_blank'); // Opens file in a new browser tab
    }
  }
  weghmentviewFile(url: string) {
    if (url) {
      window.open(url, '_blank'); // Opens file in a new browser tab
    }
  }
  shippingviewFile(url: string) {
    if (url) {
      window.open(url, '_blank'); // Opens file in a new browser tab
    }
  }
  //container view
  viewFile(url: string) {
    if (url) {
      window.open(url, '_blank'); // Opens file in a new browser tab
    }
  }

  //OCR close
  ocrcloseModal() {
  ($('#OcrModal') as any).modal('hide');
}

//cro close
    crocloseModal() {
    $('#croModal').modal('hide');
  }
//form close
    fromcloseModal() {
    $('#formModal').modal('hide');
  }
//container close
  closeModal() {
    $('#containerModal').modal('hide');
  }
  
//container close
  shippingcloseModal() {
    $('#shipModal').modal('hide');
  }
//container close
  eircloseModal() {
    $('#eirModal').modal('hide');
  }
//container close
  sealcloseModal() {
    $('#sealModal').modal('hide');
  }
//container close
  weghmentcloseModal() {
    $('#weighmentModal').modal('hide');
  }
  removecroFile(index: number) {
    this.croFiles.splice(index, 1);
  }
  removeformFile(index: number) {
    this.form13Files.splice(index, 1);
  }
  removeContainerFile(index: number) {
    this.containerFiles.splice(index, 1);
  }
//cro delete
  deletecroFile(id: number) {
  
 this.APIServies.deletecorFiles(id, this.bookingid).subscribe({
  next: (res) => {
    console.log("Response API:", res);
    this.notifyService.showSuccess("CRO file deleted successfully", "Success");
    this.croFiles = res.CRO;
     window.location.reload();
  },
  error: (err) => {
    console.error("❌ API Error while deleting file:", err);
    this.notifyService.showError("Failed to delete file", "Error");
  }
});
  }
//form delete
  deleteformFile(id: number) {
    this.APIServies.deleteformFiles(id, this.bookingid).subscribe({
  next: (res) => {
    console.log("Response API:", res);
    this.notifyService.showSuccess("Form13 file deleted successfully", "Success");
    this.form13Files = res.CRO;
     window.location.reload();
  },
  error: (err) => {
    console.error("❌ API Error while deleting file:", err);
    this.notifyService.showError("Failed to delete file", "Error");
  }
});
  }
//shipping delete
  deleteshippingFile(id: number) {
    this.APIServies.deleteshipFile(id, this.bookingid).subscribe({
  next: (res) => {
    console.log("Response API:", res);
    this.notifyService.showSuccess("Shipping file deleted successfully", "Success");
    this.shippingBillFiles = res.CRO;
     window.location.reload();
  },
  error: (err) => {
    console.error("❌ API Error while deleting file:", err);
    this.notifyService.showError("Failed to delete file", "Error");
  }
});
  }
//shipping delete
  deleteeirFile(id: number) {
   this.APIServies.deleteeirFile(id, this.bookingid).subscribe({
  next: (res) => {
    console.log("Response API:", res);
    this.notifyService.showSuccess("EIR file deleted successfully", "Success");
    this.eirFiles = res.CRO;
     window.location.reload();
  },
  error: (err) => {
    console.error("❌ API Error while deleting file:", err);
    this.notifyService.showError("Failed to delete file", "Error");
  }
});
  }
//shipping delete
  deletesealFile(id: number) {
   this.APIServies.deleteSealFile(id, this.bookingid).subscribe({
  next: (res) => {
    console.log("Response API:", res);
    this.notifyService.showSuccess("Seal file deleted successfully", "Success");
    this.sealFiles = res.CRO;
     window.location.reload();
  },
  error: (err) => {
    console.error("❌ API Error while deleting file:", err);
    this.notifyService.showError("Failed to delete file", "Error");
  }
});
  }
//shipping delete
  deleteweighmentFile(id: number) {

    this.APIServies.deleteweighmentFile(id, this.bookingid).subscribe({
  next: (res) => {
    console.log("Response API:", res);
    this.notifyService.showSuccess("Weighment file deleted successfully", "Success");
    this.weighmentFiles = res.CRO;
     window.location.reload();
  },
  error: (err) => {
    console.error("❌ API Error while deleting file:", err);
    this.notifyService.showError("Failed to delete file", "Error");
  }
});
  }
  //container delete
  deleteContainerFile(id: number) {
     this.APIServies.deleteContainerFile(id, this.bookingid).subscribe({
  next: (res) => {
    console.log("Response API:", res);
    this.notifyService.showSuccess("Container file deleted successfully", "Success");
    this.containerFiles = res.CRO;
     window.location.reload();
  },
  error: (err) => {
    console.error("❌ API Error while deleting file:", err);
    this.notifyService.showError("Failed to delete file", "Error");
  }
});

  
  }

}
