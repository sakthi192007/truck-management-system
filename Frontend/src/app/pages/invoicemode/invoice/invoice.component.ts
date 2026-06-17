import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  Validators,
  FormArray,
  FormControl,
  AbstractControl,
  FormBuilder,

} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { all_api_service } from 'src/app/service/all_api_service';
import { AuthService } from 'src/app/service/auth.service';
import { NotificationService } from 'src/app/service/notification.service';
import { forkJoin, Subject } from 'rxjs';
import { BookingService } from '../../bookingmodel/booking.service';
import { InvoiceService } from '../invoice.service';
import { ClientGridComponent } from '../../clientmodel/client-grid/client-grid.component';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css'],
})
export class InvoiceComponent {
  invoiceForm!: FormGroup;
  portofloading: any;
  portofloadingselect: any;
  checkboxChecked: boolean = false;
  buttontext: string = 'Submit';
  submitted = false;
  amount: any;
  gstAmount: any;
  gstvalues: any;
  gstTotalamount: any;
  totalAmount: any
  vendordata: any;
  vendorselect: any;
  loop: any;
  locations: any;
  locationsselect: any;
  invoiceid: any;
  gstmount: any
  pricesubamount: any;
  //customer
  getcustomerdata: any;
  customerselect: any;
  userId: any;
  RoleId: any;
  custdata: any;
  //container
  containerselect: any;
  containerdata: any;
  //halting
  haltingcharge: any;
  haltingchargeselect: any;
  //invoicetotal
  form: any;
  getbookingNumber: any[]=[];
  companydata: any[]=[];
  selectedValue: any;
  selectvalues: any;
  containerNumber: any;
  selectcontainer: any;
  selectCompanyName: any
  lengthitems: any;
  book: any;
  enabled: boolean = false;
  Haltingselect: any;
  gethaltingAmount: any;
  chargedataselect: any;
  chargedata: any[]=[];
  values: any;
  state: any;
  statedata: any;
  sateselect: any
  grandTotal: any
  invoiceID: any;
  gstRate = 0.18;
  selectDepartment: any;
  sgstAmount: any;
  subTotalamount: any;
  tablegst: any;
  tablecgst: any;
  tableigst: any;
  getinformation: any;
  getinformationadd: any;
  InvoiceNumber: any;
  charge_codeDes: any;
  invoicekeys: any;
  roleconcept: any;
  views: any;
  postinvoicedata: any;

  gstAmountsum: any;
  igstAmountsum: any;
  advpymtsum: any;

  valuesdata: any;

  sgstinvoice: any;
  cgstinvoice: any;
  igstinvoice: any;
  previousAmounts: number[] = [];
  payloads: any;
  advpymt: any;
  balancedue: any;
  currentuser: any;


  companydropdownConfig = {
    displayKey: "CompanyName",
    valueKey: 'Client_Id',
    bindValue: 'Client_Id',
    search: true,
    height: '250px',
    placeholder: "--Select--",
    limitTo: this.companydata?.length,
    noResultsFound: "No results found!",
    searchPlaceholder: "Search...",
    clearOnSelection: false
  };

  bookingdropdownConfig = {
    displayKey: "BookingNumber",
    valueKey: 'BookingNumber',
    bindValue: 'BookingNumber',
    search: true,
    height: '250px',
    placeholder: "--Select--",
    limitTo: this.getbookingNumber?.length,
    noResultsFound: "No results found!",
    searchPlaceholder: "Search...",
    clearOnSelection: false
  };

   chargedropdownConfig = {
    displayKey: "ChargeDescription",
    valueKey: 'Cd_id',
    bindValue: 'Cd_id',
    search: true,
    height: '250px',
    placeholder: "--Select--",
    limitTo: this.chargedata?.length,
    noResultsFound: "No results found!",
    searchPlaceholder: "Search...",
    clearOnSelection: false
  };

  branchstate:any;

  constructor(
    private formBuilder: FormBuilder,
    private APIServies: InvoiceService,
    private comService: BookingService,
    private router: Router,
    private authService: AuthService,
    private http: HttpClient,
    private notifyService: NotificationService
  ) {

     this.currentuser = this.authService.getCurrentuser();
    this.userId = this.currentuser.id;
    this.RoleId = this.currentuser.User_Roleid;
    this.branchstate=this.currentuser.Branch_details[0].State;
  

    this.postinvoicedata = 0;
    this.roleconcept = history.state.roledata;
    this.containerdata = history.state.roledataline;
    this.views = history.state.views;


    this.invoiceForm = this.formBuilder.group({
      rows1: this.formBuilder.array([]),
      bookingno: this.formBuilder.control(''),
      invoicedate: this.formBuilder.control('', [Validators.required]),
      dueinvoicedate: this.formBuilder.control('', [Validators.required]),
      department: this.formBuilder.control('', [Validators.required]),
      company: this.formBuilder.control('', [Validators.required]),
      invoiceref: this.formBuilder.control(''),
      grandtotal: this.formBuilder.control(''),
      btmtotal: this.formBuilder.control(''),
      btmgst: this.formBuilder.control(''),
      btmcgst: this.formBuilder.control(''),
      btmigst: this.formBuilder.control(''),
      btmtotalsub: this.formBuilder.control(''),
      advpymt: this.formBuilder.control(''),
      balancedue: this.formBuilder.control(''),

    });


    if (this.roleconcept && this.roleconcept.length > 0) {
      this.buttontext = 'Update';
      const role = this.roleconcept[0];
      let formvalues = {
        department: this.roleconcept[0].Department,
        invoicedate: this.roleconcept[0].InvoiceDate,
        invoiceref: this.roleconcept[0].InvoiceReference,
        dueinvoicedate: this.roleconcept[0].InvoiceDueDate,
      };
      this.invoicekeys = this.roleconcept[0].I_id;

       const stateclient = this.roleconcept[0].State;

  if (this.branchstate === stateclient) {
    this.state = "29";
  } else {
    this.state = "40";
  }

     
      this.invoiceForm.patchValue(formvalues);

      this.selectDepartment = this.roleconcept[0].Department;



      this.APIServies.dropcompany(this.selectDepartment,this.userId).subscribe(value => {
        this.containerselect = value;
        this.companydata = this.containerselect['data'];
        

        const id = String(this.roleconcept[0].CompanyName);

    const selectedCustomer = this.companydata.find(
      c => String(c.Client_Id) === id
    );

    if (selectedCustomer) {
      setTimeout(() => {  
        this.invoiceForm.get('company')?.setValue(selectedCustomer);
      }, 50);
    }

      

      });
      this.selectCompanyName = this.roleconcept[0].CompanyName;
      this.APIServies.dropbookingnumber(this.selectCompanyName, this.selectDepartment,this.userId).subscribe(value => {
        this.vendorselect = value;
        this.getbookingNumber = this.vendorselect['data'];
        this.book = this.getbookingNumber[0].BookingNumber;

        this.invoiceForm.patchValue({ bookingno: this.roleconcept[0].BookingNo });
      });

      this.selectCompanyName = this.roleconcept[0].CompanyName;

    }
  


  }

loadLineItems() {
  if (!this.containerdata || this.containerdata.length === 0) return;

 this.row1.clear();
      if (this.containerdata && this.containerdata.length > 0) {
        this.grandTotal = 0;
        this.subTotalamount = 0;
        this.tablegst = 0;
        this.tablecgst = 0;
        this.tableigst = 0;

        for (let j = 0; j < this.containerdata.length; j++) {
          this.lengthitems = j.toString();
          this.addItemUpdate();

          const item = this.containerdata[j];
          const subtotal = parseFloat(item.Amount) || 0;
          const sgstAmount = parseFloat(item.SGST) || 0;
          const cgstAmount = parseFloat(item.CGST) || 0;
          const igstAmount = parseFloat(item.IGST) || 0;
          const Gstper = parseFloat(item.Gstper) || 0;
          const GstIper = parseFloat(item.Igstper) || 0;

          const rowFormGroup = this.row1.at(j) as FormGroup;
          rowFormGroup.patchValue({
            Amount: subtotal,
            sgst: sgstAmount,
            cgst: cgstAmount,
            igst: igstAmount,
            igstper: GstIper,
            sgstper: Gstper,
          });

          this.subTotalamount += subtotal;
          this.tablegst += sgstAmount;
          this.tablecgst += cgstAmount;
          this.tableigst += igstAmount;
        }

        const advpymt = parseFloat(this.roleconcept[0].Advpayment) || 0;



        if (this.state == 29) {
          this.grandTotal = this.subTotalamount + this.tablecgst + this.tablegst;
        } else {
          this.grandTotal = this.subTotalamount + this.tableigst;
        }

        const balanceDue = this.grandTotal - advpymt;

        this.invoiceForm.get('btmtotal')?.setValue(this.subTotalamount, { emitEvent: false });
        this.invoiceForm.get('btmgst')?.setValue(this.tablegst, { emitEvent: false });
        this.invoiceForm.get('btmcgst')?.setValue(this.tablecgst, { emitEvent: false });
        this.invoiceForm.get('btmigst')?.setValue(this.tableigst, { emitEvent: false });
        this.invoiceForm.get('grandtotal')?.setValue(this.grandTotal, { emitEvent: false });
        this.invoiceForm.get('advpymt')?.setValue(advpymt, { emitEvent: false });
        this.invoiceForm.get('balancedue')?.setValue(balanceDue, { emitEvent: false });
      }
}
  ngOnInit() {

    this.currentuser = this.authService.getCurrentuser();
    this.userId = this.currentuser.id;
    this.RoleId = this.currentuser.User_Roleid;
    this.selling();

  

    this.enabled = false
    this.invoiceForm.get('advpymt')?.valueChanges.subscribe(() => {
      this.calculateBalanceDue();
    });


    this.calculateBalanceDue();

  }


  selling() {
  let apiLoaded = 0;
  let totalApi = 1; 

  const checkComplete = () => {
    apiLoaded++;
    if (apiLoaded === totalApi) {
      this.loadLineItems(); 
    }
  };
    this.APIServies.dropcharge().subscribe(value => {
      this.chargedataselect = value;
      this.chargedata = this.chargedataselect['data'];

      this.chargedropdownConfig = {
    displayKey: "ChargeDescription",
    valueKey: 'Cd_id',
    bindValue: 'Cd_id',
    search: true,
    height: '250px',
    placeholder: "--Select--",
    limitTo: this.chargedata?.length,
    noResultsFound: "No results found!",
    searchPlaceholder: "Search...",
    clearOnSelection: false
  };
  checkComplete();
    });
  }
  onDepartment(event: any): void {
    this.selectDepartment = event.target.value;
    this.APIServies.dropcompany(this.selectDepartment,this.userId).subscribe(value => {
      this.containerselect = value;
      this.companydata = this.containerselect['data'];

    this.companydropdownConfig = {
    displayKey: "CompanyName",
    valueKey: 'Client_Id',
    bindValue: 'Client_Id',
    search: true,
    height: '250px',
    placeholder: "--Select--",
    limitTo: this.companydata?.length,
    noResultsFound: "No results found!",
    searchPlaceholder: "Search...",
    clearOnSelection: false
  };

    });

  }
  onCompanyName(selectedItem: any): void {
   
    this.selectCompanyName = selectedItem.value.Client_Id; 
   
    this.APIServies.dropbookingnumber(this.selectCompanyName, this.selectDepartment,this.userId).subscribe(value => {
      this.vendorselect = value;
      this.getbookingNumber = this.vendorselect['data'];
      this.book = this.getbookingNumber[0].BookingNumber;

      this.bookingdropdownConfig = {
    displayKey: "BookingNumber",
    valueKey: 'BookingNumber',
    bindValue: 'BookingNumber',
    search: true,
    height: '250px',
    placeholder: "--Select--",
    limitTo: this.getbookingNumber?.length,
    noResultsFound: "No results found!",
    searchPlaceholder: "Search...",
    clearOnSelection: false
  };
    });
    this.APIServies.state(this.selectCompanyName).subscribe(value => {
     this.sateselect = value;
this.statedata = this.sateselect?.data || [];

if (this.statedata.length > 0) {
  const stateclient = this.statedata[0]?.State;

  if (this.branchstate === stateclient) {
    this.state = "29";
  } else {
    this.state = "40";
  }
} else {
  // Optional: handle case where statedata is empty this.state = "";
  console.warn("No state data found for selected value");
}
    });

  }


  onhaltingChange(event: any, index: number): void {
    let selecthalting = event.target.value;
    let containerValue = this.row1.at(index).get('container')?.value;

    this.APIServies.halting(this.book, selecthalting, containerValue).subscribe(value => {
      this.Haltingselect = value;
      let haltingAmount = this.Haltingselect['data'][0].Amount;

      this.row1.at(index).get('haltingamount')?.setValue(haltingAmount);
    });
  }
  onExportBookingChange(event: any): void {
    this.selectedValue = event.value.BookingNumber;
    this.APIServies.dropcontainertype(this.selectedValue, this.selectDepartment).subscribe(value => {
      this.selectvalues = value;
      this.containerdata = this.selectvalues['data'];
      this.row1.clear();
      if (this.containerdata && this.containerdata.length > 0) {
        this.grandTotal = 0;
        this.subTotalamount = 0;
        this.tablegst = 0;
        this.tablecgst = 0;
        this.tableigst = 0;
        for (let j = 0; j < this.containerdata.length; j++) {
          this.lengthitems = j.toString();
          this.addItemUpdate();
          var subtotal = this.containerdata[j].Amount;
          var ContainerType = this.containerdata[j].ContainerType;
          var containernumber = this.containerdata[j].containernumber;
          var id = this.containerdata[j].id;


    const ChargeCodess = this.chargedata.find(
    c => String(c.CD_ID) === id
  );

          var HsnCode = this.containerdata[j].HsnCode;
          var Vehicleno = this.containerdata[j].Vehicleno;
          var curre = this.containerdata[j].curre;
          var description = this.containerdata[j].description;
          var percentagegst = this.containerdata[j].sgstper;
          var percentageIgst = this.containerdata[j].igstper;

          var sgstAmount = (parseFloat(subtotal) * this.containerdata[j].CGST) / 100;
          var sgstIAmount = (parseFloat(subtotal) * this.containerdata[j].CGST) / 100;
          var igstamout = sgstAmount + sgstIAmount;
          const rowFormGroup = this.row1.at(j) as FormGroup;
          rowFormGroup.patchValue({
            chargedes: ChargeCodess || null,
            description: description,
            container: ContainerType,
            containerno: containernumber,
            hsncode: HsnCode,
            vehicleno: Vehicleno,
            curre: curre,
            Amount: subtotal,
            sgst: sgstAmount,
            cgst: sgstAmount,
            igst: igstamout,
            sgstper: percentagegst,
            igstper: percentageIgst,
          });
          this.subTotalamount += parseFloat(subtotal);
          this.tablegst += sgstIAmount;
          this.tablecgst += sgstIAmount;
          this.tableigst += igstamout;


        }
        var subvalue = this.subTotalamount;
        var gstvalue = this.tablegst;
        var cgst = this.tablecgst;
        this.grandTotal = parseFloat(subvalue) + parseFloat(gstvalue) + parseFloat(cgst);
        this.calculateGrandTotal()
      }
    });

  }
  onchargedesChange(event: any, index: number): void {
    this.selectedValue = event.value.CD_ID;
    this.APIServies.drocargecode(this.selectedValue).subscribe(value => {
      let select_values = value;
      this.charge_codeDes = select_values['data'];

      let description = this.charge_codeDes[0].ChargeDescription;
      let hsncodes = this.charge_codeDes[0].SAC_HSN;
      this.sgstinvoice = this.charge_codeDes[0].SGST;
      this.cgstinvoice = this.charge_codeDes[0].CGST;
      this.igstinvoice = this.charge_codeDes[0].IGST;

      this.row1.at(index).get('description')?.setValue(description);
      this.row1.at(index).get('hsncode')?.setValue(hsncodes);

    });

  }


  sum(index: number): void {
    const item = this.row1.at(index) as FormGroup;

    // Parse input values as numbers
    const transcharge = parseFloat(item.get('Amount')?.value) || 0;
    const sgstPercentage = parseFloat(item.get('sgstper')?.value) || 0;
    const igstPercentage = parseFloat(item.get('igstper')?.value) || 0;

    let sgstAmount = 0, cgstAmount = 0, igstAmount = 0;

    // GST Calculation
    if (this.state != 29) {
      igstAmount = Number(((transcharge * igstPercentage) / 100).toFixed(2));
    } else {
      sgstAmount = Number(((transcharge * sgstPercentage / 2) / 100).toFixed(2));
      cgstAmount = Number(((transcharge * sgstPercentage / 2) / 100).toFixed(2));
    }

    // Set calculated values to form controls
    item.get('sgst')?.setValue(sgstAmount, { emitEvent: false });
    item.get('cgst')?.setValue(cgstAmount, { emitEvent: false });
    item.get('igst')?.setValue(igstAmount, { emitEvent: false });

    // Sub Total Calculation
    this.subTotalamount = this.row1.value.reduce(
      (total: number, row: any) => total + (parseFloat(row.Amount) || 0),
      0
    );

    // Total GST Calculations
    const totalSGST = this.row1.value.reduce(
      (total: number, row: any) => total + (parseFloat(row.sgst) || 0),
      0
    );
    const totalCGST = this.row1.value.reduce(
      (total: number, row: any) => total + (parseFloat(row.cgst) || 0),
      0
    );
    const totalIGST = this.row1.value.reduce(
      (total: number, row: any) => total + (parseFloat(row.igst) || 0),
      0
    );

    // Compute Grand Total
    if (this.state != 29) {
      this.grandTotal = this.subTotalamount + totalIGST;
      this.invoiceForm.get('btmigst')?.setValue(Number(totalIGST.toFixed(2)), { emitEvent: false });
    } else {
      this.grandTotal = this.subTotalamount + totalSGST + totalCGST;
      this.invoiceForm.get('btmgst')?.setValue(Number(totalSGST.toFixed(2)), { emitEvent: false });
      this.invoiceForm.get('btmcgst')?.setValue(Number(totalCGST.toFixed(2)), { emitEvent: false });
    }

    this.invoiceForm.get('btmtotal')?.setValue(Number(this.subTotalamount.toFixed(2)), { emitEvent: false });
    this.invoiceForm.get('grandtotal')?.setValue(Number(this.grandTotal.toFixed(2)), { emitEvent: false });

    // Calculate Balance Due
    this.calculateBalanceDue();
  }

  calculateBalanceDue(): void {
    const advPayment = parseFloat(this.invoiceForm.get('advpymt')?.value) || 0;
    const grandTotal = parseFloat(this.invoiceForm.get('grandtotal')?.value) || 0;

    const balanceDue = Number((grandTotal - advPayment).toFixed(2));
    this.invoiceForm.get('balancedue')?.setValue(balanceDue, { emitEvent: false });
  }


  removeItem(index: number): void {

    const item = this.row1.at(index) as FormGroup;


    const amount = +item.get('Amount')?.value || 0;
    const sgstAmount = +item.get('sgst')?.value || 0;
    const cgstAmount = +item.get('cgst')?.value || 0;
    const igstAmount = +item.get('igst')?.value || 0;


    this.subTotalamount -= amount;
    this.tablegst -= sgstAmount;
    this.tablecgst -= cgstAmount;
    this.tableigst -= igstAmount;


    this.row1.removeAt(index);


    this.calculateGrandTotal();
  }
  calculateGrandTotal(): void {

    let amount = 0, sgstAmount = 0, cgstAmount = 0, igstAmount = 0;


    const formArrayList: any[] = this.invoiceForm.get('rows1')?.value;
    formArrayList.forEach(element => {
      amount += +element.Amount || 0;
      sgstAmount += +element.sgst || 0;
      cgstAmount += +element.cgst || 0;
      igstAmount += +element.igst || 0;
    });


    const total = amount + sgstAmount + cgstAmount;


    this.invoiceForm.get('btmtotal')?.setValue(amount);
    this.invoiceForm.get('btmgst')?.setValue(sgstAmount);
    this.invoiceForm.get('btmcgst')?.setValue(cgstAmount);
    this.invoiceForm.get('btmigst')?.setValue(igstAmount);
    this.invoiceForm.get('grandtotal')?.setValue(total);



    this.subTotalamount = amount;
    this.tablegst = sgstAmount;
    this.tablecgst = cgstAmount;
    this.tableigst = igstAmount;
    this.grandTotal = total;
  }


  addItem() {
    const rowGroup = this.formBuilder.group({
      container: [''],
      containerno: [''],
      description: [''],
      chargedes: [''],
      Amount: [''],
      Vehicleno: [''],
      hsncode: [''],
      curre: [''],
      sgst: [''],
      cgst: [''],
      igst: [''],
      sgstper: [''],
      igstper: [''],
    });
    this.row1.push(rowGroup);
  }



  addItemUpdate() {
      const item = this.containerdata[this.lengthitems];
 const ChargeCode_Id = String(item?.ChargeCode);

    const ChargeCodess = this.chargedata.find(
    c => String(c.CD_ID) === ChargeCode_Id
  );

    const rowGroup = this.formBuilder.group({
      container: this.containerdata?.[this.lengthitems]?.ContainerType || '',
      containerno: this.containerdata?.[this.lengthitems]?.ContainerNo || '',
      description: this.containerdata?.[this.lengthitems]?.Description || '',
      chargedes: ChargeCodess || null,
      Amount: this.containerdata?.[this.lengthitems]?.Amount || '',
      hsncode: this.containerdata?.[this.lengthitems]?.HSNCode || '',
      Vehicleno: this.containerdata?.[this.lengthitems]?.Vehicleno || '',
       curre: this.containerdata?.[this.lengthitems]?.Currency || '',
      sgstper: this.containerdata?.[this.lengthitems]?.sgstper || '',
      igstper: this.containerdata?.[this.lengthitems]?.Igstper || '',
      sgst: [''],
      cgst: [''],
      igst: ['']
    });
    this.row1.push(rowGroup);

  }

  get f() {
    return this.invoiceForm.controls;
  }

  get row1() {
    return this.invoiceForm.get('rows1') as FormArray;
  }

  postInvoice(itemsdata: any) {
    this.submitted = true;
    if (this.invoiceForm.invalid) return;

    if (!itemsdata.length) {
      this.notifyService.showWarning("Please add data in Buyer item details", "seller Invoices");
      return;
    }

    let { sgst_amount, cgst_amount, igst_amount, gsttype } = this.getGSTAmounts();

    const registerdata = this.invoiceForm.value;
    const advpymt = this.invoiceForm.get('advpymt')?.value || 0;
    this.currentuser = this.authService.getCurrentuser();
    this.userId = this.currentuser.id;

        let Booking = registerdata.bookingno.BookingNumber; 
  if(Booking){
Booking = registerdata.bookingno.BookingNumber;
  }else{
 Booking = registerdata.bookingno;
  }
    

    const formvalues = {
      companyId: this.invoiceForm.value.company.Client_Id,
      BookingNumber: Booking,
      invoice_date: registerdata.invoicedate,
      dueinvoicedate: registerdata.dueinvoicedate,
      invoice_ref: this.invoiceForm.value.invoiceref,
      department: this.invoiceForm.value.department,
      btmtotal: (<HTMLInputElement>document.getElementById('btmtotal')).value,
      grandtotal: (<HTMLInputElement>document.getElementById('grandtotal')).value,
      btmgst: sgst_amount,
      btmcgst: cgst_amount,
      btmigst: igst_amount,
      gsttype: gsttype,
      advpymt: (<HTMLInputElement>document.getElementById('advpymt')).value,
      balancedue: (<HTMLInputElement>document.getElementById('balancedue')).value,
      CreatedBy: this.userId,

      Roleid:this.RoleId,
      CompanyName :this.currentuser.Branch_details[0].CompanyName,
UserName:this.currentuser.Branch_details[0].UserName,
Address:this.currentuser.Branch_details[0].Address,
City:this.currentuser.Branch_details[0].City,
PostalCode:this.currentuser.Branch_details[0].PostalCode,
PhoneNumber:this.currentuser.Branch_details[0].PhoneNumber,
Email:this.currentuser.Branch_details[0].Email,
GSTNo:this.currentuser.Branch_details[0].GSTNo,
Image:this.currentuser.Branch_details[0].Image


    };

    if (this.buttontext === 'Submit') {
      this.createInvoiceTax(formvalues, itemsdata);
    } else {
      this.updateInvoicesTax(formvalues, itemsdata);
    }
  }

  submit(itemsdata: any) {

    this.submitted = true;
    if (this.invoiceForm.invalid) return;

    if (!itemsdata.length) {
      this.notifyService.showWarning("Please add data in Buyer item details", "seller Invoices");
      return;
    }

    let { sgst_amount, cgst_amount, igst_amount, gsttype } = this.getGSTAmounts();

    const registerdata = this.invoiceForm.value;
    const advpymt = this.invoiceForm.get('advpymt')?.value || 0;
    this.currentuser = this.authService.getCurrentuser();
    this.userId = this.currentuser.id;

    let Booking = registerdata.bookingno.BookingNumber; 
  if(Booking){
Booking = registerdata.bookingno.BookingNumber;
  }else{
 Booking = registerdata.bookingno;
  }
    

    const formvalues = {
      companyId: this.invoiceForm.value.company.Client_Id,
      BookingNumber: Booking,
      invoice_date: registerdata.invoicedate,
      dueinvoicedate: registerdata.dueinvoicedate,
      invoice_ref: this.invoiceForm.value.invoiceref,
      department: this.invoiceForm.value.department,
      btmtotal: (<HTMLInputElement>document.getElementById('btmtotal')).value,
      grandtotal: (<HTMLInputElement>document.getElementById('grandtotal')).value,
      btmgst: sgst_amount,
      btmcgst: cgst_amount,
      btmigst: igst_amount,
      gsttype: gsttype,
      advpymt: (<HTMLInputElement>document.getElementById('advpymt')).value,
      balancedue: (<HTMLInputElement>document.getElementById('balancedue')).value,
      CreatedBy: this.userId,

      Roleid:this.RoleId,
      CompanyName :this.currentuser.Branch_details[0].CompanyName,
UserName:this.currentuser.Branch_details[0].UserName,
Address:this.currentuser.Branch_details[0].Address,
City:this.currentuser.Branch_details[0].City,
PostalCode:this.currentuser.Branch_details[0].PostalCode,
PhoneNumber:this.currentuser.Branch_details[0].PhoneNumber,
Email:this.currentuser.Branch_details[0].Email,
GSTNo:this.currentuser.Branch_details[0].GSTNo,
Image:this.currentuser.Branch_details[0].Image


    };
    if (this.buttontext === 'Submit') {
      this.createInvoice(formvalues, itemsdata);
    } else {
      this.updateInvoice(formvalues, itemsdata);
    }
  }

  createInvoice(formvalues: any, itemsdata: any) {
    this.APIServies.insertinvoicedetails(formvalues, this.postinvoicedata).subscribe(response => {
      this.invoiceID = response.data.id;
      this.InvoiceNumber = response.data.invoiceno;

      itemsdata.forEach((item: any, i: number) => {
        this.populateItemDetails(item, i);
      });

      this.APIServies.insertlistdata(itemsdata).subscribe(() => {
        this.notifyService.showSuccess("Invoice created successfully.", "seller Invoices");
        this.router.navigate(['/InvoiceDetails'])
      });
    });
  }

  updateInvoice(formvalues: any, itemsdata: any) {
    this.APIServies.updateinvoicedetails(formvalues, this.invoicekeys, this.postinvoicedata).subscribe(response => {
      this.invoiceID = response.data.id;
      this.InvoiceNumber = response.data.invoiceno;

      itemsdata.forEach((item: any, i: number) => {
        this.populateItemDetails(item, i);
      });

      this.APIServies.Updatelistdata(itemsdata, this.invoicekeys).subscribe(() => {
        this.notifyService.showSuccess("Invoice updated successfully.", "seller Invoices");
        this.router.navigate(['/InvoiceDetails'])
      });
    });
  }
  createInvoiceTax(formvalues: any, itemsdata: any) {
    this.APIServies.insertinvoicedetails(formvalues, this.postinvoicedata).subscribe(response => {
      this.invoiceID = response.data.id;
      this.InvoiceNumber = response.data.invoiceno;

      itemsdata.forEach((item: any, i: number) => {
        this.populateItemDetails(item, i);
      });

      this.APIServies.insertlistdata(itemsdata).subscribe(() => {
          this.sendInvoiceEmail(itemsdata, formvalues, this.InvoiceNumber);
        this.notifyService.showSuccess("Invoice created successfully.", "seller Invoices");
      });
    });
  }

  updateInvoicesTax(formvalues: any, itemsdata: any) {
    this.APIServies.updateinvoicedetails(formvalues, this.invoicekeys, this.postinvoicedata).subscribe(response => {
      this.invoiceID = response.data.id;
      this.InvoiceNumber = response.data.invoiceno;

      itemsdata.forEach((item: any, i: number) => {
        this.populateItemDetails(item, i);
      });

      this.APIServies.Updatelistdata(itemsdata, this.invoicekeys).subscribe(() => {
          this.sendInvoiceEmail(itemsdata, formvalues, this.InvoiceNumber);
        this.notifyService.showSuccess("Invoice updated successfully.", "seller Invoices");
       
      });
    });
  }
 createInvoiceCredit(formvalues: any, itemsdata: any) {
    this.APIServies.insertinvoicedetails(formvalues, this.postinvoicedata).subscribe(response => {
      this.invoiceID = response.data.id;
      this.InvoiceNumber = response.data.invoiceno;

      itemsdata.forEach((item: any, i: number) => {
        this.populateItemDetails(item, i);
      });

      this.APIServies.insertlistdata(itemsdata).subscribe(() => {
           let invNo=this.InvoiceNumber 
          this.payloads = { itemsdata, formvalues,invNo};
       this.APIServies.Credit(this.payloads).subscribe(
        (res: any) => {
          if (res?.filename) {
            const fileUrl = `${environment.APIEndpoint}TaxInvoice/${res.filename}`;
            window.open(fileUrl, '_blank');

          }
        });
       
      });
    });
  }

  updateInvoicesCredit(formvalues: any, itemsdata: any) {
    this.APIServies.updateinvoicedetails(formvalues, this.invoicekeys, this.postinvoicedata).subscribe(response => {
      this.invoiceID = response.data.id;
      this.InvoiceNumber = response.data.invoiceno;

      itemsdata.forEach((item: any, i: number) => {
        this.populateItemDetails(item, i);
      });

      this.APIServies.Updatelistdata(itemsdata, this.invoicekeys).subscribe(() => {
        let invNo=this.InvoiceNumber 
          this.payloads = { itemsdata, formvalues,invNo};
       this.APIServies.Credit(this.payloads).subscribe(
        (res: any) => {
          if (res?.filename) {
            const fileUrl = `${environment.APIEndpoint}TaxInvoice/${res.filename}`;
            window.open(fileUrl, '_blank');

          }
        });
       
      });
    });
  }
  sendInvoiceEmail(itemsdata: any, formvalues: any, InvoiceNumber: any) {
    this.payloads = { itemsdata, formvalues, InvoiceNumber };
      this.APIServies.Previesemail(this.payloads).subscribe(res => {
        if (res && res.filename) {
          const fileUrl = `${environment.APIEndpoint}TaxInvoice/${res.filename}`;
          window.open(fileUrl, '_blank');
        }
         this.router.navigate(['/InvoiceDetails'])
      });
  }
  Preview(itemsdata: any) {
    this.submitted = true;
    if (this.invoiceForm.invalid) {
      return;
    }

    if (!itemsdata.length) {
      alert('Please add data in Buyer item details');
      return;
    }


    let { sgst_amount, cgst_amount, igst_amount, gsttype } = this.getGSTAmounts();

    const registerdata = this.invoiceForm.value;
    const advpymt = this.invoiceForm.get('advpymt')?.value || 0;
    let formattedDate = registerdata.invoicedate;
    let dueinvoicedate = registerdata.dueinvoicedate;


    const dateObj = new Date(formattedDate);

    const day = dateObj.getDate().toString().padStart(2, '0');
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const year = dateObj.getFullYear();

    let invoicedata = `${day}/${month}/${year}`;


    const datedue = new Date(dueinvoicedate);

    const day1 = datedue.getDate().toString().padStart(2, '0');
    const month1 = (datedue.getMonth() + 1).toString().padStart(2, '0');
    const year1 = datedue.getFullYear();

    let duedate = `${day1}/${month1}/${year1}`;


    this.currentuser = this.authService.getCurrentuser();

    let Booking = registerdata.bookingno.BookingNumber; 
  if(Booking){
Booking = registerdata.bookingno.BookingNumber;
  }else{
 Booking = registerdata.bookingno;
  }
    
    const formvalues = {

      companyId: registerdata.company.Client_Id,
      BookingNumber: Booking,
      invoice_date: invoicedata,
      dueinvoicedate: duedate,
      invoice_ref: registerdata.invoiceref,
      department: registerdata.department,
      btmtotal: this.getValueFromElement('btmtotal'),
      grandtotal: this.getValueFromElement('grandtotal'),

      btmgst: sgst_amount,
      btmcgst: cgst_amount,
      btmigst: igst_amount,
      gsttype: gsttype,
      advpymt: advpymt,
      balancedue: this.getValueFromElement('balancedue'),
      
CompanyName :this.currentuser.Branch_details[0].CompanyName,
UserName:this.currentuser.Branch_details[0].UserName,
Address:this.currentuser.Branch_details[0].Address,
City:this.currentuser.Branch_details[0].City,
PostalCode:this.currentuser.Branch_details[0].PostalCode,
PhoneNumber:this.currentuser.Branch_details[0].PhoneNumber,
Email:this.currentuser.Branch_details[0].Email,
GSTNo:this.currentuser.Branch_details[0].GSTNo,
Image:this.currentuser.Branch_details[0].Image

    };

    itemsdata.forEach((item: any, i: number) => {
      this.populateItemDetails(item, i);
    });

    const payload = {
      itemsdata: itemsdata,
      formvalues: formvalues,

    };
    console.log(payload);
    this.APIServies.InPrevies(payload).subscribe(
      (res: any) => {
        if (res?.filename) {

          const fileUrl = `${environment.APIEndpoint}invoice/${res.filename}`;
          window.open(fileUrl, '_blank');


        }
      },
      (error: any) => {
        console.error({ error });
      }
    );
  }
  Credit(itemsdata: any) {
     this.submitted = true;
    if (this.invoiceForm.invalid) return;

    if (!itemsdata.length) {
      this.notifyService.showWarning("Please add data in Buyer item details", "seller Invoices");
      return;
    }

    let { sgst_amount, cgst_amount, igst_amount, gsttype } = this.getGSTAmounts();

    const registerdata = this.invoiceForm.value;
    const advpymt = this.invoiceForm.get('advpymt')?.value || 0;
    this.currentuser = this.authService.getCurrentuser();
    this.userId = this.currentuser.id;

        let Booking = registerdata.bookingno.BookingNumber; 
  if(Booking){
Booking = registerdata.bookingno.BookingNumber;
  }else{
 Booking = registerdata.bookingno;
  }
    

    const formvalues = {
      companyId: this.invoiceForm.value.company.Client_Id,
      BookingNumber: Booking,
      invoice_date: registerdata.invoicedate,
      dueinvoicedate: registerdata.dueinvoicedate,
      invoice_ref: this.invoiceForm.value.invoiceref,
      department: this.invoiceForm.value.department,
      btmtotal: (<HTMLInputElement>document.getElementById('btmtotal')).value,
      grandtotal: (<HTMLInputElement>document.getElementById('grandtotal')).value,
      btmgst: sgst_amount,
      btmcgst: cgst_amount,
      btmigst: igst_amount,
      gsttype: gsttype,
      advpymt: (<HTMLInputElement>document.getElementById('advpymt')).value,
      balancedue: (<HTMLInputElement>document.getElementById('balancedue')).value,
      CreatedBy: this.userId,

      Roleid:this.RoleId,
      CompanyName :this.currentuser.Branch_details[0].CompanyName,
UserName:this.currentuser.Branch_details[0].UserName,
Address:this.currentuser.Branch_details[0].Address,
City:this.currentuser.Branch_details[0].City,
PostalCode:this.currentuser.Branch_details[0].PostalCode,
PhoneNumber:this.currentuser.Branch_details[0].PhoneNumber,
Email:this.currentuser.Branch_details[0].Email,
GSTNo:this.currentuser.Branch_details[0].GSTNo,
Image:this.currentuser.Branch_details[0].Image


    };

    if (this.buttontext === 'Submit') {
      this.createInvoiceCredit(formvalues, itemsdata);
    } else {
      this.updateInvoicesCredit(formvalues, itemsdata);
    }
  }

  private getGSTAmounts() {
    if (this.state == 29) {
      return {
        sgst_amount: this.getValueFromElement('btmgst'),
        cgst_amount: this.getValueFromElement('btmcgst'),

        igst_amount: '0',
        gsttype: "0",
        //advpymt:"0"
      };
    } else {
      return {
        sgst_amount: '0',
        cgst_amount: '0',
        igst_amount: this.getValueFromElement('btmigst'),
        gsttype: "1"
      };
    }
  }
private populateItemDetails(item: any, index: number) {
  const suffix = index.toString();
 let chargedescodes = item.chargedes.CD_ID; 
  if(chargedescodes){

  }else{
 chargedescodes = item.chargedes; 
  }
 

  item.sgst = this.getValueFromElement(suffix + 'sgst') || '0';
  item.sgstper = this.getValueFromElement(suffix + 'sgstper') || '0';

  item.igstper = this.state == 29 ? '0' : (this.getValueFromElement(suffix + 'igstper') || '0');
  item.cgst = this.getValueFromElement(suffix + 'cgst') || '0';

  item.igst = this.state == 29 ? '0' : (this.getValueFromElement(suffix + 'igst') || '0');

  item.Amount = this.getValueFromElement(suffix + 'Amount');
  item.description = this.getValueFromElement(suffix + 'description');
  item.Vehicleno = this.getValueFromElement(suffix + 'Vehicleno');
  item.hsncode = this.getValueFromElement(suffix + 'hsncode');
  item.curre = this.getValueFromElement(suffix + 'curre');

  item.chargedes = chargedescodes; 
  item.container = this.getValueFromElement(suffix + 'container');
  item.containerno = this.getValueFromElement(suffix + 'containerno');
  item.invoiceID = this.invoiceID;
}

 
  private getValueFromElement(elementId: string) {
    return (<HTMLInputElement>document.getElementById(elementId))?.value || '0';
  }


}
