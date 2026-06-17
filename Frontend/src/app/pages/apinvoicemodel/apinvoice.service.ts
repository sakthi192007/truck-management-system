import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError} from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HeadersService } from 'src/app/service/Headers';
@Injectable({
  providedIn: 'root'
})
export class ApinvoiceService {
  getHeader: any;
  handleError: any;
  private host = environment.APIEndpoint;
  constructor( private http: HttpClient, private HeadersService: HeadersService) {
    this.getHeader = this.HeadersService.getHeaders();
    
  }

  dropcompany(id: any) {
    const URL = this.host + 'Apinvoices/getcompany/' + id;
    return this.http.get(URL, { headers: this.HeadersService.getHeaders() })
      .pipe(catchError(this.HeadersService.handleError));
  }
  dropcontainertype(booking: any, dep: any) {
    const URL = this.host + 'Apinvoices/invoicegetcontainer/' + booking + '/' + dep;
    return this.http.get(URL, { headers: this.HeadersService.getHeaders() })
      .pipe(catchError(this.HeadersService.handleError));
  }
  //invoicegrid
  invoicegrid(id:any,role:any) {
    const URL = this.host + 'Apinvoices/invoicegrid/'+ id+'/'+ role;
    return this.http.get(URL, { headers: this.HeadersService.getHeaders() })
      .pipe(catchError(this.HeadersService.handleError));
  }

  getallinvoice(id: any) {
    const URL = this.host + 'Apinvoices/getupdate/' + id;
    return this.http.get(URL, { headers: this.HeadersService.getHeaders() })
      .pipe(catchError(this.HeadersService.handleError));
  }
  ApprovalInvoice(value: any) {
    const URL = this.host + 'Apinvoices/approvel/' + value;
    return this.http.get(URL, { headers: this.HeadersService.getHeaders() })
      .pipe(catchError(this.HeadersService.handleError));
  }
  state(id: any) {
    const URL = this.host + 'Apinvoices/getstate/' + id;
    return this.http.get(URL, { headers: this.HeadersService.getHeaders() })
      .pipe(catchError(this.HeadersService.handleError));
  }

  //vendorname

  dropbookingnumber(id: any, Dep: any) {
    const URL = this.host + 'Apinvoices/getbookingnumber/' + id + '/' + Dep;
    return this.http.get(URL, { headers: this.HeadersService.getHeaders() })
      .pipe(catchError(this.HeadersService.handleError));
  }

  //code
  drocargecode(id: any) {
    const URL = this.host + 'Apinvoices/getDesc/' + id;
    return this.http.get(URL, { headers: this.HeadersService.getHeaders() })
      .pipe(catchError(this.HeadersService.handleError));
  }
  halting(bookinNumber: any, Halting: any, containertype: any) {
    const URL = this.host + 'Apinvoices/getHalting/' + bookinNumber + '/' + Halting + '/' + containertype;
    return this.http.get(URL, { headers: this.HeadersService.getHeaders() })
      .pipe(catchError(this.HeadersService.handleError));
  }
  dropcharge() {
    const URL = this.host + 'Apinvoices/getcharge/';
    return this.http.get(URL, { headers: this.HeadersService.getHeaders() })
      .pipe(catchError(this.HeadersService.handleError));
  }


  //insert
  insertApInvoice(value: any, id: any) {
    const URL = this.host + 'Apinvoices/apinvoice/insert/' + id;
    return this.http.post(URL, value, { headers: this.HeadersService.getHeaders() })
      .pipe(catchError(this.HeadersService.handleError));
  }
  updateinvoicedetails(data: any, id: any, post: any) {
    const URL = this.host + 'Apinvoices/update/' + id + '/' + post;
    return this.http.put(URL, data, { headers: this.HeadersService.getHeaders() })
      .pipe(catchError(this.HeadersService.handleError));

  }
  insertlistdata(value: any) {
    const URL = this.host + 'Apinvoices/apinvoice/list';
    return this.http.post(URL, value, { headers: this.HeadersService.getHeaders() })
      .pipe(catchError(this.HeadersService.handleError));
  }
  Updatelistdata(data: any, id: any,) {

    const URL = this.host + 'Apinvoices/listupdate/' + id;
    return this.http.put(URL, data, { headers: this.HeadersService.getHeaders() })
      .pipe(catchError(this.HeadersService.handleError));
  }
  //companyname
  dropdowngetvendor(id:any) {
    const URL = this.host + 'apinvoicetds/getvendordata/'+id;
    return this.http.get(URL, { headers: this.HeadersService.getHeaders() })
      .pipe(catchError(this.HeadersService.handleError));
  }
  dropbookingnumbers(id: any) {
    const URL = this.host + 'apinvoicetds/getbookingnumber/' + id;
    return this.http.get(URL, { headers: this.HeadersService.getHeaders() })
      .pipe(catchError(this.HeadersService.handleError));
  }
  //insert entrypayment
  insertentrypayment(value: any) {
    const URL = this.host + 'apinvoicetds/';
    return this.http.post(URL, value, { headers: this.HeadersService.getHeaders() })
      .pipe(catchError(this.HeadersService.handleError));
  }
  //update
  updateentrypayment(id: any, value: any) {
    const URL = this.host + 'apinvoicetds/update/' + id;
    return this.http.put(URL, value, { headers: this.HeadersService.getHeaders() })
      .pipe(catchError(this.HeadersService.handleError));
  }


  insertinvoicedata(id: any) {
    const URL = this.host + 'apinvoicetds/invoices/' + id + '/';
    return this.http.get(URL, { headers: this.HeadersService.getHeaders() })
      .pipe(catchError(this.HeadersService.handleError));
  }
  //paymentgrid
  paymentgrid(id:any,role:any) {

    const URL = this.host + 'apinvoicetds/paymentgrid/'+ id+'/'+ role;
    return this.http.get(URL, { headers: this.HeadersService.getHeaders() })
      .pipe(catchError(this.HeadersService.handleError));
  }

  getallpayment(id: any) {


    const URL = this.host + 'apinvoicetds/getupdate/' + id;
    return this.http.get(URL, { headers: this.HeadersService.getHeaders() })
      .pipe(catchError(this.HeadersService.handleError));
  }
  insertlistpayment(value: any) {


    const URL = this.host + 'apinvoicetds/invoicetds/list';
    return this.http.post(URL, value, { headers: this.HeadersService.getHeaders() })
      .pipe(catchError(this.HeadersService.handleError));

  }
  updatelistpayment(data: any, id: any,) {
    const URL = this.host + 'apinvoicetds/listupdate/' + id;
    return this.http.put(URL, data, { headers: this.HeadersService.getHeaders() })
      .pipe(catchError(this.HeadersService.handleError));
  }
}
