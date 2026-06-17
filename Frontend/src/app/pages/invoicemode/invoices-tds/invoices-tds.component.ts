import { Component } from '@angular/core';
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

@Component({
  selector: 'app-invoices-tds',
  templateUrl: './invoices-tds.component.html',
  styleUrl: './invoices-tds.component.css'
})
export class InvoicesTDSComponent {
  invoicetdsForm!: FormGroup;
  buttontext: string = 'Submit';
  submitted = false;
  companydata: any;
  currentuser: any;
  userId: any;
  RoleId: any;
  PR_ID: any;
  getvendordata: any[] = [];
  vendorselect: any;
  getinvoiceNumber: any[] = [];
  selectCompanyName: any;
  SubTotal: any;
  percent: any;
  amount: any;
  type: any;
  tds: any;
  book: any;
  roleconcept: any;
  views: any;
  invoiceNumber: any;
  grandTotal: number = 0;
  insertinvoicedata: any;
  InvoiceID: any;
  BR_key: any;
  APE_id: any;
  itemsdata: any;
  PaymentID: any;
  lengthitems: any;
  containerdata: any;
  apkey: any;
  Sub_Total: any;
  trans_amount: any;

  clientdropdownConfig = {
    displayKey: "CompanyName",
    valueKey: 'Client_Id',
    bindValue: 'Client_Id',
    search: true,
    height: '250px',
    placeholder: "--Select Client Name--",
    limitTo: this.getvendordata?.length,
    noResultsFound: "No results found!",
    searchPlaceholder: "Search...",
    clearOnSelection: false
  };

 invoicedropdownConfig = {
    displayKey: "InvoiceNumber",
    valueKey: 'InvoiceNumber',
    bindValue: 'InvoiceNumber',
    search: true,
    height: '250px',
    placeholder: "--Select Invoice No--",
    limitTo: this.getinvoiceNumber?.length,
    noResultsFound: "No results found!",
    searchPlaceholder: "Search...",
    clearOnSelection: false
  };

  typedata = [
    { TypeId: 0, Type_name: 'Debit' },
    { TypeId: 1, Type_name: 'Credit' }
  ];

  typedropdownConfig = {
    displayKey: "Type_name",
    height: '250px',
    placeholder: "--Select--",
    limitTo: this.typedata?.length,
    noResultsFound: "No results found!",
    clearOnSelection: false
  };

  constructor(
    private formBuilder: FormBuilder,
    private APIServies: InvoiceService,
    private comService: BookingService,
    private router: Router,
    private authService: AuthService,
    private http: HttpClient,
    private notifyService: NotificationService
  ) {
    this.roleconcept = history.state.roledata;
    this.containerdata = history.state.roledataline;
    this.views = history.state.views;

    this.invoicetdsForm = this.formBuilder.group({
      rows1: this.formBuilder.array([]),
      invoiceno: this.formBuilder.control(''),
      invoicedate: this.formBuilder.control('', [Validators.required]),
      company: this.formBuilder.control('', [Validators.required]),
      grandtotal: this.formBuilder.control(''),
      SubTotal: this.formBuilder.control(''),
      gst: this.formBuilder.control(''),
      type: this.formBuilder.control(''),
      payments: this.formBuilder.control(''),
      balancedueAmount: this.formBuilder.control(''),
      netdue: this.formBuilder.control(''),
      Percentnumber: this.formBuilder.control(''),
      Amounts: this.formBuilder.control(''),

    });
 
    if (this.containerdata && this.containerdata.length) {
      this.row1.clear();
      for (let j = 0; j < this.containerdata.length; j++) {
        const item = this.containerdata[j];
        const rowGroup = this.formBuilder.group({
          refno: [item.Paymenttransactionno || ''],
          payment: [item.Paymentamount || ''],
          paydate: [item.Paymentdate || ''],
        });
        this.row1.push(rowGroup);
      }
    }


  }

  ngOnInit(): void {
    this.currentuser = this.authService.getCurrentuser();
    this.userId = this.currentuser.id;
    this.RoleId = this.currentuser.User_Roleid;

    this.getAll();

  }
  PercentnumberChange(): void {
    const percent = parseFloat(this.invoicetdsForm.get('Percentnumber')?.value) || 0;

    if (!isNaN(percent)) {
      const amount = (this.Sub_Total * percent) / 100;
      const netDue = this.grandTotal - amount;

      this.invoicetdsForm.patchValue({
        Amounts: amount.toFixed(2),
        netdue: netDue.toFixed(2)
      });

      const payments = parseFloat(this.invoicetdsForm.get('payments')?.value) || 0;
      const balance = netDue - payments;

      this.invoicetdsForm.patchValue({
        balancedueAmount: balance.toFixed(2)
      });
    } else {
      this.invoicetdsForm.patchValue({
        Amounts: '',
        netdue: '',
        balancedueAmount: ''
      });
    }
  }

  sum(index: number): void {
    this.trans_amount = this.row1.value.reduce(
      (total: number, row: any) => total + (parseFloat(row.payment) || 0),
      0
    );

    this.invoicetdsForm.patchValue({
      payments: this.trans_amount.toFixed(2)
    });

    const netDue = parseFloat(this.invoicetdsForm.get('netdue')?.value) || 0;
    const balance = netDue - this.trans_amount;

    this.invoicetdsForm.patchValue({
      balancedueAmount: balance.toFixed(2)
    });
  }


  getAll() {

     let apiLoaded = 0;
  let totalApi = 1; 

  const checkComplete = () => {
    apiLoaded++;
    if (apiLoaded === totalApi) {
      this.loadLineItems(); 
    }
  };

    this.APIServies.dropdowngetvendor(this.userId).subscribe(value => {
      this.vendorselect = value;
      this.getvendordata = this.vendorselect['data'];

    this.clientdropdownConfig = {
    displayKey: "CompanyName",
    valueKey: 'Client_Id',
    bindValue: 'Client_Id',
    search: true,
    height: '250px',
    placeholder: "--Select Client Name--",
    limitTo: this.getvendordata?.length,
    noResultsFound: "No results found!",
    searchPlaceholder: "Search...",
    clearOnSelection: false
  };
   checkComplete();
    });
  }
loadLineItems(){
   if (this.roleconcept && this.roleconcept.length) {
      this.buttontext = 'Update';
      const role = this.roleconcept[0];

        const id = String(this.roleconcept[0].ClientName);
        const ids = String(this.roleconcept[0].Type);

    const selectedCustomer = this.getvendordata.find(
      c => String(c.Client_Id) === id
    );
    const selectedType = this.typedata.find(
      c => String(c.TypeId) === ids
    );


      let formvalues = {
        company: selectedCustomer || null,
        invoicedate: this.roleconcept[0].InvoiceDate,
        SubTotal: this.roleconcept[0].SubTotal,
        gst:this.roleconcept[0].GST,
        grandtotal: this.roleconcept[0].GrandTotal,
        type: selectedType || null,
        payments: this.roleconcept[0].Payment,
        balancedueAmount: this.roleconcept[0].Balanceamount,
        netdue: this.roleconcept[0].TDS,
        Percentnumber: this.roleconcept[0].Percentage,
        Amounts: this.roleconcept[0].Amount,
      };
      this.apkey = this.roleconcept[0].APE_id;
      this.APIServies.dropbookingnumbers(this.roleconcept[0].ClientName).subscribe(value => {
        this.vendorselect = value;
        this.getinvoiceNumber = this.vendorselect['data'];
        this.invoicetdsForm.patchValue({
    invoiceno: this.getinvoiceNumber.find(b => b.InvoiceNumber === this.roleconcept[0].InvoiceNumber)?.InvoiceNumber
  });

      });

      this.InvoiceID = this.roleconcept[0].APE_id;
      this.APE_id = this.roleconcept[0].APE_id;
      this.invoicetdsForm.patchValue(formvalues);
    }
}
  onCompanyName(selectedItem: any): void {
const selectCompanyName = selectedItem.value.Client_Id; 
    this.APIServies.dropbookingnumbers(selectCompanyName).subscribe(value => {
      this.vendorselect = value;
      this.getinvoiceNumber = this.vendorselect['data'];
      this.book = this.getinvoiceNumber[0].InvoiceNumber;

    this.invoicedropdownConfig = {
    displayKey: "InvoiceNumber",
    valueKey: 'InvoiceNumber',
    bindValue: 'InvoiceNumber',
    search: true,
    height: '250px',
    placeholder: "--Select Invoice No--",
    limitTo: this.getinvoiceNumber?.length,
    noResultsFound: "No results found!",
    searchPlaceholder: "Search...",
    clearOnSelection: false
  };
    });
  }

  onExportBookingChange(selectedItem: any): void {

     const selectedInvoiceNumber = selectedItem.value.InvoiceNumber; 

    this.APIServies.insertinvoicedata(selectedInvoiceNumber).subscribe(value => {
      if (value) {
        this.invoicetdsForm.patchValue({
          SubTotal: value.SubTotal,
          gst: value.GST,
          grandtotal: value.GrandTotal
        });
        this.Sub_Total = value.SubTotal,
          this.grandTotal = value.GrandTotal;
      }
    });
  }

  get f() {
    return this.invoicetdsForm.controls;
  }

   submit(itemsdata: any) {
     this.submitted = true;

     if (this.invoicetdsForm.invalid) {
       return;
     }

     if (!itemsdata.length) {
      this.notifyService.showWarning("Please add data item details", "Invoices TDS");
       return;
     }
    const formvalues = this.invoicetdsForm.value;
      formvalues.UserID = this.userId;

    if (this.buttontext === 'Submit') {
      this.createPaymententry(formvalues, itemsdata);
    } else {
      this.updatePaymententry(formvalues, itemsdata);
    }
   }

  createPaymententry(formvalues: any, itemsdata: any) {
    this.APIServies.insertentrypayment(formvalues).subscribe(response => {
      if (response && response.data) {
        const invoiceID = response.data.id;
        //  const invoiceNumber = response.data.invoiceno;

        const updatedItems = itemsdata.map((item: any) => ({
          ...item,
          invoiceID: invoiceID
        }));

        this.APIServies.insertlistpayment(updatedItems).subscribe(() => {
          this.notifyService.showSuccess("Payment entry created successfully.", "Payment entry");
          this.router.navigate(['/Paymententry']);
        }, error => {
          this.notifyService.showError("Error saving item details", "Payment entry");
        });
      }
    });
  }

  updatePaymententry(formvalues: any, itemsdata: any) {
    this.APIServies.updateentrypayment(this.apkey, formvalues).subscribe(response => {
      if (response && response.success) {
        const updatedItems = itemsdata.map((item: any) => ({
          ...item,
          invoiceID: this.apkey
        }));

      }
      this.APIServies.updatelistpayment(itemsdata, this.apkey).subscribe(() => {
        this.notifyService.showSuccess("Payment entry successfully.", "Payment entry");
        this.router.navigate(['/Paymententry'])
      });
    });

  }

  addItem() {
    const rowGroup = this.formBuilder.group({
      refno: [''],
      payment: [''],
      paydate: [''],

    });
    this.row1.push(rowGroup);

  }

  addItemUpdate() {
    const rowGroup = this.formBuilder.group({
      refno: this.containerdata?.[this.lengthitems]?.Paymenttransactionno || '',
      payment: this.containerdata?.[this.lengthitems]?.Payment || '',
      paydate: this.containerdata?.[this.lengthitems]?.Paymentdate || '',


    });
    this.row1.push(rowGroup);
  }

  removeItem(index: number): void {

    this.row1.removeAt(index);
    this.sum(index);
  }

  get row1() {
    return this.invoicetdsForm.get('rows1') as FormArray;
  }
}
