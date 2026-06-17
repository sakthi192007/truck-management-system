import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
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
import { ApinvoiceService } from '../apinvoice.service';
import { ClientGridComponent } from '../../clientmodel/client-grid/client-grid.component';
import { debounceTime } from 'rxjs/operators';


@Component({
  selector: 'app-apinvoice',
  templateUrl: './apinvoice.component.html',
  styleUrl: './apinvoice.component.css'
})
export class APinvoiceComponent {
  invoiceForm!: FormGroup;
  portofloading: any;
  portofloadingselect: any;
  checkboxChecked: boolean = false;
  buttontext: string = 'Save';
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
  getbookingNumber: any[] = [];
  companydata: any[] = [];
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
  chargedata: any[] = [];
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
  valuesdata: any;
  sgstinvoice: any;
  cgstinvoice: any;
  igstinvoice: any;
  previousAmounts: number[] = [];
  payloads: any;
  advpymt: number | undefined;
  dropdownOpen = false;
  selectedBookingNumbers: string[] = [];
  isUpdateMode: boolean = false;
  currentuser: any;

  vendordropdownConfig = {
    displayKey: "VendorName",
    valueKey: 'CD_ID',
    bindValue: 'CD_ID',
    search: true,
    height: '250px',
    placeholder: "--Select--",
    limitTo: this.companydata?.length,
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


  constructor(private formBuilder: FormBuilder, private APIServies: ApinvoiceService, private comService: BookingService,
    private router: Router, private authService: AuthService, private http: HttpClient, private notifyService: NotificationService
  ) {
    this.postinvoicedata = 0;
    this.roleconcept = history.state.roledata;
    this.containerdata = history.state.roledataline;
    this.views = history.state.views;
    this.invoiceForm = this.formBuilder.group({
      rows1: this.formBuilder.array([]),
      department: this.formBuilder.control('', [Validators.required]),
      company: this.formBuilder.control('', [Validators.required]),
      bookingno: this.formBuilder.control(''),
      invoicedate: this.formBuilder.control('', [Validators.required]),
      dueinvoicedate: this.formBuilder.control('', [Validators.required]),
      invoiceref: this.formBuilder.control('', [Validators.required]),
      grandtotal: this.formBuilder.control(''),
      btmtotal: this.formBuilder.control(''),
      btmgst: this.formBuilder.control(''),
      btmcgst: this.formBuilder.control(''),
      btmigst: this.formBuilder.control(''),
      btmtotalsub: this.formBuilder.control(''),
      advpymt: this.formBuilder.control(''),
      balancedue: this.formBuilder.control(''),
    })
    if (this.roleconcept && this.roleconcept.length > 0) {
      this.buttontext = 'Update';
      const role = this.roleconcept[0];
      let formvalues = {
        department: this.roleconcept[0].Department,
        invoicedate: this.roleconcept[0].InvoiceDate,
        invoiceref: this.roleconcept[0].InvoiceReference,
        dueinvoicedate: this.roleconcept[0].InvoiceDueDate,
      };


      this.invoicekeys = this.roleconcept[0].AP_id;
      this.state = this.roleconcept[0].State;
      this.invoiceForm.patchValue(formvalues);
      this.selectDepartment = this.roleconcept[0].Department;
      this.APIServies.dropcompany(this.selectDepartment).subscribe(value => {
        this.containerselect = value;
        this.companydata = this.containerselect['data'];

          const id = String(this.roleconcept[0].VendorName);

    const selectedCustomer = this.companydata.find(
      c => String(c.CD_ID) === id
    );

    if (selectedCustomer) {
      setTimeout(() => {  
        this.invoiceForm.get('company')?.setValue(selectedCustomer);
      }, 50);
    }
       

      });
      this.selectCompanyName = this.roleconcept[0].VendorName;
      this.isUpdateMode = true;
      const bookingArray = this.roleconcept[0].BookingNo
        ? this.roleconcept[0].BookingNo.split(',')
        : [];

      this.invoiceForm.patchValue({ bookingno: bookingArray });
      this.selectedBookingNumbers = bookingArray;
      this.selectCompanyName = this.roleconcept[0].VendorName;

    }
 
  }
  loadLineItems() {
  if (!this.containerdata || this.containerdata.length === 0) return;

 this.row1.clear();
       if (this.containerdata && this.containerdata.length > 0) {
      this.row1.clear();
      this.grandTotal = 0;
      this.subTotalamount = 0;
      this.tablegst = 0;
      this.tablecgst = 0;
      this.tableigst = 0;

      for (let j = 0; j < this.containerdata.length; j++) {
        this.lengthitems = j.toString();
        this.addItemUpdate();
        const subtotal = parseFloat(this.containerdata[j].Amount) || 0;
        const cgstAmount = parseFloat(this.containerdata[j].CGST) || 0;
        const sgstAmount = parseFloat(this.containerdata[j].SGST) || 0;
        const igstAmount = parseFloat(this.containerdata[j].IGST) || 0;
        const Gstper = parseFloat(this.containerdata[j].Gstper) || 0;
        const rowFormGroup = this.row1.at(j) as FormGroup;
        rowFormGroup.patchValue({
          Amount: subtotal,
          sgst: sgstAmount,
          cgst: cgstAmount,
          igst: igstAmount,
          igstper: Gstper,
          sgstper: Gstper,
        });

        this.subTotalamount += subtotal;
        this.tablegst += sgstAmount;
        this.tablecgst += cgstAmount;
        this.tableigst += igstAmount;
      }

      const advpymt = parseFloat(this.roleconcept[0]?.Advpayment) || 0;

      if (this.state != 29) {
        this.grandTotal = this.subTotalamount + this.tableigst;
      } else {
        this.grandTotal = this.subTotalamount + this.tablegst + this.tablecgst;
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
    this.enabled = false;
    this.invoiceForm.get('advpymt')?.valueChanges.subscribe(() => {
      this.calculateBalanceDue();
    });
    this.calculateBalanceDue();
  }
  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }
  @HostListener('document:click', ['$event'])
  onOutsideClick(event: MouseEvent): void {
    if (this.dropdownContainer && !this.dropdownContainer.nativeElement.contains(event.target)) {
      this.dropdownOpen = false;
    }
  }

  @ViewChild('dropdownContainer') dropdownContainer!: ElementRef;
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
    this.APIServies.dropcompany(this.selectDepartment).subscribe(value => {
      this.containerselect = value;
      this.companydata = this.containerselect['data'];

    this.vendordropdownConfig = {
    displayKey: "VendorName",
    valueKey: 'CD_ID',
    bindValue: 'CD_ID',
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
   
    this.selectCompanyName = selectedItem.value.CD_ID; 

    this.APIServies.dropbookingnumber(this.selectCompanyName, this.selectDepartment).subscribe(value => {
      this.vendorselect = value;
      this.getbookingNumber = this.vendorselect['data'];
      this.selectedBookingNumbers = []; // Reset selection on new company change



    });
    this.APIServies.state(this.selectCompanyName).subscribe(value => {
      this.sateselect = value;
      this.statedata = this.sateselect['data'];
      this.state = this.statedata[0].State
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
    const checkbox = event.target as HTMLInputElement;
    const value = checkbox.value;
    if (checkbox.checked) {
      if (!this.selectedBookingNumbers.includes(value)) {
        this.selectedBookingNumbers.push(value);
      }
    } else {
      this.selectedBookingNumbers = this.selectedBookingNumbers.filter(v => v !== value);
    }
    this.row1.clear();
    this.grandTotal = 0;
    this.subTotalamount = 0;
    this.tablegst = 0;
    this.tablecgst = 0;
    this.tableigst = 0;
    this.selectedBookingNumbers.forEach((bookingNo, index) => {
      this.APIServies.dropcontainertype(bookingNo, this.selectDepartment).subscribe(value => {
        const containerdata = value['data'];
        if (containerdata && containerdata.length > 0) {
          for (let j = 0; j < containerdata.length; j++) {
            const data = containerdata[j];
            const subtotal = parseFloat(data.Amount);
            const sgstAmount = (subtotal * data.CGST) / 100;
            const cgstAmount = (subtotal * data.CGST) / 100;
            const igstAmount = sgstAmount + cgstAmount;
            this.lengthitems = this.row1.length.toString();
            this.addItemUpdate();
            const rowFormGroup = this.row1.at(this.row1.length - 1) as FormGroup;
            rowFormGroup.patchValue({
              chargedes: data.id,
              description: data.description,
              container: data.ContainerType,
              containerno: data.containernumber,
              hsncode: data.HsnCode,
              curre: data.curre,
              Amount: subtotal,
              sgst: sgstAmount,
              cgst: cgstAmount,
              igst: igstAmount,
              sgstper: data.sgstper,
              igstper: data.igstper,
            });
            this.subTotalamount += subtotal;
            this.tablegst += sgstAmount;
            this.tablecgst += cgstAmount;
            this.tableigst += igstAmount;
          }

          this.grandTotal = this.subTotalamount + this.tablegst + this.tablecgst;
          this.calculateGrandTotal();
        }
      });
    });
    this.invoiceForm.patchValue({ bookingno: this.selectedBookingNumbers });
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
      curre: this.containerdata?.[this.lengthitems]?.Currency || '',
      sgstper: this.containerdata?.[this.lengthitems]?.sgstper || '',
      igstper: this.containerdata?.[this.lengthitems]?.igstper || '',
      sgst: [''],
      cgst: [''],
      igst: ['']
    });
    this.row1.push(rowGroup);

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
    const transcharge = parseFloat(item.get('Amount')?.value) || 0;
    const sgstPercentage = parseFloat(item.get('sgstper')?.value) || 0;
    const igstPercentage = parseFloat(item.get('igstper')?.value) || 0;
    let sgstAmount = 0, cgstAmount = 0, igstAmount = 0;
    if (this.state != 29) {
      igstAmount = Number(((transcharge * igstPercentage) / 100).toFixed(2));
    } else {
      sgstAmount = Number(((transcharge * sgstPercentage / 2) / 100).toFixed(2));
      cgstAmount = Number(((transcharge * sgstPercentage / 2) / 100).toFixed(2));
    }
    item.get('sgst')?.setValue(sgstAmount, { emitEvent: false });
    item.get('cgst')?.setValue(cgstAmount, { emitEvent: false });
    item.get('igst')?.setValue(igstAmount, { emitEvent: false });
    this.subTotalamount = this.row1.value.reduce(
      (total: number, row: any) => total + (parseFloat(row.Amount) || 0),
      0
    );
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
    this.calculateBalanceDue();
  }

  calculateBalanceDue(): void {
    const advPayment = parseFloat(this.invoiceForm.get('advpymt')?.value) || 0;
    const grandTotal = parseFloat(this.invoiceForm.get('grandtotal')?.value) || 0;
    const balanceDue = Number((grandTotal - advPayment).toFixed(2));
    this.invoiceForm.get('balancedue')?.setValue(balanceDue, { emitEvent: false });
  }

  addItem() {
    const rowGroup = this.formBuilder.group({
      container: [''],
      containerno: [''],
      description: [''],
      chargedes: [''],
      Amount: [''],
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

  submit(itemsdata: any) {
    this.submitted = true;
    if (this.invoiceForm.invalid) return;
    if (!itemsdata.length) {
      this.notifyService.showWarning("Please add data in Buyer item details", "ApInvoices");
      return;
    }
    const { sgst_amount, cgst_amount, igst_amount, gsttype } = this.getGSTAmounts();
    const id = this.invoiceForm.value.id;
    const registerdata = this.invoiceForm.value;
    const formvalues = {
      companyId: registerdata.company.CD_ID,
     BookingNumber: this.invoiceForm.value.bookingno,
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
    };
    if (this.buttontext === 'Save') {
      this.createInvoice(formvalues, itemsdata);
    } else {
      this.updateInvoice(formvalues, itemsdata);
    }
  }

  createInvoice(formvalues: any, itemsdata: any) {
    this.APIServies.insertApInvoice(formvalues, this.postinvoicedata).subscribe(response => {
      this.invoiceID = response.data.id;
      this.InvoiceNumber = response.data.invoiceno;
      itemsdata.forEach((item: any, i: number) => {
        this.populateItemDetails(item, i);
      });
      this.APIServies.insertlistdata(itemsdata).subscribe(() => {
        this.notifyService.showSuccess("ApInvoice created successfully.", "ApInvoices");
        this.router.navigate(['/APInvoices'])
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
        this.notifyService.showSuccess("ApInvoices updated successfully.", "ApInvoices");
        this.router.navigate(['/APInvoices'])
      });
    });
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

  get f() {
    return this.invoiceForm.controls;
  }

  get row1() {
    return this.invoiceForm.get('rows1') as FormArray;
  }
  private getGSTAmounts() {
    if (this.state == 29) {
      return {
        sgst_amount: this.getValueFromElement('btmgst'),
        cgst_amount: this.getValueFromElement('btmcgst'),
        igst_amount: '0',
        gsttype: "0"
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
     const chargedescodes = item.chargedes.CD_ID; 
    item.sgst = this.getValueFromElement(suffix + 'sgst') || '0';
    item.sgstper = this.getValueFromElement(suffix + 'sgstper') || '0';
    item.igstper = this.state == 29 ? '0' : this.getValueFromElement(suffix + 'igstper') || '0';
    item.cgst = this.getValueFromElement(suffix + 'cgst') || '0';
    item.igst = this.state == 29 ? '0' : this.getValueFromElement(suffix + 'igst') || '0';
    item.Amount = this.getValueFromElement(suffix + 'Amount');
    item.description = this.getValueFromElement(suffix + 'description');
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
