import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { UrlSegment } from '@angular/router';
import { TokenService } from 'src/app/service/accessToken';
import { ApiService } from 'src/app/service/apiservice'; 
import { AuthService } from 'src/app/service/auth.service'; 
// import { url } from 'inspector';
@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
    accessToken: any;
    private host = environment.APIEndpoint;
    constructor(private authservice: AuthService,private http: HttpClient,private tokenService: TokenService) {
    }
   getHeaders(): HttpHeaders {return new HttpHeaders({'Content-Type': 'application/json','x-access-token': this.accessToken});}

    private handleError(error: HttpErrorResponse): Observable<any> {
      let errorMessage = 'Unknown error occurred';
      if (error.error instanceof ErrorEvent) {
        errorMessage = `Error: ${error.error.message}`;
      } else {
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      }
      console.error(errorMessage);
      return throwError(errorMessage);
    }
   dropbookingnumber(id:any,Dep:any,userId:any){
     let token = this.authservice.getCurrentuser();
        let accessToken = token.accessToken;
     const URL = this.host + 'invoicedetails/getbookingnumber/'+id+'/'+Dep+'/'+userId;
    const headers = new Headers({
          'Content-Type': 'application/json'
        });
        headers.append('x-access-token', accessToken);
        return this.http.get(URL, {
          headers: new HttpHeaders().set('x-access-token', accessToken)
        })
          .pipe(
            catchError(this.handleError)
          );
    }
    state(id:any){
       let token = this.authservice.getCurrentuser();
        let accessToken = token.accessToken;
     const URL = this.host + 'invoicedetails/getstate/'+id;
    const headers = new Headers({
          'Content-Type': 'application/json'
        });
        headers.append('x-access-token', accessToken);
        return this.http.get(URL, {
          headers: new HttpHeaders().set('x-access-token', accessToken)
        })
          .pipe(
            catchError(this.handleError)
          );
    }
    
    dropcompany(id:any,userId:any){
       let token = this.authservice.getCurrentuser();
        let accessToken = token.accessToken;
     const URL = this.host + 'invoicedetails/getcompany/'+id+'/'+userId;
    const headers = new Headers({
          'Content-Type': 'application/json'
        });
        headers.append('x-access-token', accessToken);
        return this.http.get(URL, {
          headers: new HttpHeaders().set('x-access-token', accessToken)
        })
          .pipe(
            catchError(this.handleError)
          );
    }
    dropcontainertype(booking:any,dep:any){
       let token = this.authservice.getCurrentuser();
        let accessToken = token.accessToken;
     const URL = this.host + 'invoicedetails/invoicegetcontainer/'+booking+'/'+dep;
    const headers = new Headers({
          'Content-Type': 'application/json'
        });
        headers.append('x-access-token', accessToken);
        return this.http.get(URL, {
          headers: new HttpHeaders().set('x-access-token', accessToken)
        })
          .pipe(
            catchError(this.handleError)
          );
    }
    dropcontainernumber(booking:any){
       let token = this.authservice.getCurrentuser();
        let accessToken = token.accessToken;
     const URL = this.host + 'invoicedetails/getcontainernumber/'+booking;
     const headers = new Headers({
          'Content-Type': 'application/json'
        });
        headers.append('x-access-token', accessToken);
        return this.http.get(URL, {
          headers: new HttpHeaders().set('x-access-token', accessToken)
        })
          .pipe(
            catchError(this.handleError)
          );
    }
    halting(bookinNumber:any,Halting:any,containertype:any){
       let token = this.authservice.getCurrentuser();
        let accessToken = token.accessToken;
     const URL = this.host + 'invoicedetails/getHalting/'+bookinNumber+'/'+Halting+'/'+containertype;
    const headers = new Headers({
          'Content-Type': 'application/json'
        });
        headers.append('x-access-token', accessToken);
        return this.http.get(URL, {
          headers: new HttpHeaders().set('x-access-token', accessToken)
        })
          .pipe(
            catchError(this.handleError)
          );
    }
    dropcharge(){
       let token = this.authservice.getCurrentuser();
        let accessToken = token.accessToken;
     const URL = this.host + 'invoicedetails/getcharge/';
     const headers = new Headers({
          'Content-Type': 'application/json'
        });
        headers.append('x-access-token', accessToken);
        return this.http.get(URL, {
          headers: new HttpHeaders().set('x-access-token', accessToken)
        })
          .pipe(
            catchError(this.handleError)
          );
    }
    dropchargelist(id_value:any){
       let token = this.authservice.getCurrentuser();
        let accessToken = token.accessToken;
     const URL = this.host + 'invoicedetails/getchargeid/'+id_value;
   const headers = new Headers({
          'Content-Type': 'application/json'
        });
        headers.append('x-access-token', accessToken);
        return this.http.get(URL, {
          headers: new HttpHeaders().set('x-access-token', accessToken)
        })
          .pipe(
            catchError(this.handleError)
          );
    }
   
 
    //invoice s
    Deleteinvoice(id:any){
       let token = this.authservice.getCurrentuser();
        let accessToken = token.accessToken;
     const URL = this.host + 'invoicedetails/' + id;

     const headers = new Headers({
          'Content-Type': 'application/json'
        });
        headers.append('x-access-token', accessToken);
        return this.http.delete(URL, {
          headers: new HttpHeaders().set('x-access-token', accessToken)
        })
          .pipe(
            catchError(this.handleError)
          );

   
    }
    drocargecode(id:any){
       let token = this.authservice.getCurrentuser();
        let accessToken = token.accessToken;
     const URL = this.host + 'invoicedetails/getDesc/'+id;
    const headers = new Headers({
          'Content-Type': 'application/json'
        });
        headers.append('x-access-token', accessToken);
        return this.http.get(URL, {
          headers: new HttpHeaders().set('x-access-token', accessToken)
        })
          .pipe(
            catchError(this.handleError)
          );
    }
    invoicegrid(id:any,role:any){
       let token = this.authservice.getCurrentuser();
        let accessToken = token.accessToken;
     const URL = this.host +'invoicedetails/invoicegrid/'+ id+'/'+ role;
    const headers = new Headers({
          'Content-Type': 'application/json'
        });
        headers.append('x-access-token', accessToken);
        return this.http.get(URL, {
          headers: new HttpHeaders().set('x-access-token', accessToken)
        })
          .pipe(
            catchError(this.handleError)
          );
    }
    invoicegridcomplete(id:any,role:any){
       let token = this.authservice.getCurrentuser();
        let accessToken = token.accessToken;
     const URL = this.host + 'invoicedetails/invoicegridcomplete/'+ id+'/'+ role;
   const headers = new Headers({
          'Content-Type': 'application/json'
        });
        headers.append('x-access-token', accessToken);
        return this.http.get(URL, {
          headers: new HttpHeaders().set('x-access-token', accessToken)
        })
          .pipe(
            catchError(this.handleError)
          );
    }
    getallinvoice(id:any){
       let token = this.authservice.getCurrentuser();
        let accessToken = token.accessToken;
     const URL = this.host + 'invoicedetails/getupdate/'+id;
    const headers = new Headers({
          'Content-Type': 'application/json'
        });
        headers.append('x-access-token', accessToken);
        return this.http.get(URL, {
          headers: new HttpHeaders().set('x-access-token', accessToken)
        })
          .pipe(
            catchError(this.handleError)
          );
    }
    ApprovalInvoice(value:any){
       let token = this.authservice.getCurrentuser();
        let accessToken = token.accessToken;
     const URL = this.host + 'invoicedetails/approvel/' + value;
   const headers = new Headers({
          'Content-Type': 'application/json'
        });
        headers.append('x-access-token', accessToken);
        return this.http.get(URL, {
          headers: new HttpHeaders().set('x-access-token', accessToken)
        })
          .pipe(
            catchError(this.handleError)
          );
    }
   updateinvoicedetails(data:any,id:any,post:any){
     let token = this.authservice.getCurrentuser();
        let accessToken = token.accessToken;
     const URL = this.host + 'pdfdownload/update/' + id+'/'+post;
      const headers = new Headers({
          'Content-Type': 'application/json'
        });
        headers.append('x-access-token', accessToken);
        return this.http.put(URL,data, {
          headers: new HttpHeaders().set('x-access-token', accessToken)
        })
          .pipe(
            catchError(this.handleError)
          );
    }
    Updatelistdata(data:any,id:any,){
       let token = this.authservice.getCurrentuser();
        let accessToken = token.accessToken;
     const URL = this.host + 'pdfdownload/listupdate/' + id;
      const headers = new Headers({
          'Content-Type': 'application/json'
        });
        headers.append('x-access-token', accessToken);
        return this.http.put(URL,data, {
          headers: new HttpHeaders().set('x-access-token', accessToken)
        })
          .pipe(
            catchError(this.handleError)
          );
    }
    InPrevies(value:any){
       let token = this.authservice.getCurrentuser();
        let accessToken = token.accessToken;
    const URL = this.host + 'pdfdownload/pdfinvoicedownload/';
    const headers = new Headers({
          'Content-Type': 'application/json'
        });
        headers.append('x-access-token', accessToken);
        return this.http.post(URL,value, {
          headers: new HttpHeaders().set('x-access-token', accessToken)
        })
          .pipe(
            catchError(this.handleError)
          );

     
    }
 //credit
 Credit(value:any){
   let token = this.authservice.getCurrentuser();
        let accessToken = token.accessToken;
  const URL = this.host + 'pdfdownload/creditinvoicedownload/';
  const headers = new Headers({
          'Content-Type': 'application/json'
        });
        headers.append('x-access-token', accessToken);
        return this.http.post(URL,value, {
          headers: new HttpHeaders().set('x-access-token', accessToken)
        })
          .pipe(
            catchError(this.handleError)
          );
}

    Previes(value:any){
       let token = this.authservice.getCurrentuser();
        let accessToken = token.accessToken;
     const URL = this.host + 'pdfdownload/pdfdownload/' + value;
    const headers = new Headers({
          'Content-Type': 'application/json'
        });
        headers.append('x-access-token', accessToken);
        return this.http.get(URL, {
          headers: new HttpHeaders().set('x-access-token', accessToken)
        })
          .pipe(
            catchError(this.handleError)
          );
    }
   


    Previesemail(value:any){
       let token = this.authservice.getCurrentuser();
        let accessToken = token.accessToken;
   const URL = this.host + 'pdfdownload/sendemail';
    const headers = new Headers({
          'Content-Type': 'application/json'
        });
        headers.append('x-access-token', accessToken);
        return this.http.post(URL,value, {
          headers: new HttpHeaders().set('x-access-token', accessToken)
        })
          .pipe(
            catchError(this.handleError)
          );

    }
 
    demos(value:any){
       let token = this.authservice.getCurrentuser();
        let accessToken = token.accessToken;
   const URL = this.host + 'demopdfdata/demos';
    const headers = new Headers({
          'Content-Type': 'application/json'
        });
        headers.append('x-access-token', accessToken);
        return this.http.post(URL,value, {
          headers: new HttpHeaders().set('x-access-token', accessToken)
        })
          .pipe(
            catchError(this.handleError)
          );
    }
   
    insertinvoicedetails(value:any,id:any){
       let token = this.authservice.getCurrentuser();
        let accessToken = token.accessToken;
   const URL = this.host + 'pdfdownload/pdfdownload/insert/'+id;
    const headers = new Headers({
          'Content-Type': 'application/json'
        });
        headers.append('x-access-token', accessToken);
        return this.http.post(URL,value, {
          headers: new HttpHeaders().set('x-access-token', accessToken)
        })
          .pipe(
            catchError(this.handleError)
          );

     
    }
    insertlistdata(value:any){
       let token = this.authservice.getCurrentuser();
        let accessToken = token.accessToken;
   const URL = this.host + 'pdfdownload/pdfdownload/list';
    const headers = new Headers({
          'Content-Type': 'application/json'
        });
        headers.append('x-access-token', accessToken);
        return this.http.post(URL,value, {
          headers: new HttpHeaders().set('x-access-token', accessToken)
        })
          .pipe(
            catchError(this.handleError)
          );

     
    }
    //companyname
    dropdowngetvendor(id:any){
       let token = this.authservice.getCurrentuser();
        let accessToken = token.accessToken;
     const URL = this.host + 'invoicetds/getvendordata/'+id;
    const headers = new Headers({
          'Content-Type': 'application/json'
        });
        headers.append('x-access-token', accessToken);
        return this.http.get(URL, {
          headers: new HttpHeaders().set('x-access-token', accessToken)
        })
          .pipe(
            catchError(this.handleError)
          );
    }
    dropbookingnumbers(id:any){
       let token = this.authservice.getCurrentuser();
        let accessToken = token.accessToken;
     const URL = this.host + 'invoicetds/getbookingnumber/'+id+'/';
    const headers = new Headers({
          'Content-Type': 'application/json'
        });
        headers.append('x-access-token', accessToken);
        return this.http.get(URL, {
          headers: new HttpHeaders().set('x-access-token', accessToken)
        })
          .pipe(
            catchError(this.handleError)
          );
    }
    //insert entrypayment
    insertentrypayment(value:any){
       let token = this.authservice.getCurrentuser();
        let accessToken = token.accessToken;
     const URL = this.host + 'invoicetds/';
  const headers = new Headers({
          'Content-Type': 'application/json'
        });
        headers.append('x-access-token', accessToken);
        return this.http.post(URL,value, {
          headers: new HttpHeaders().set('x-access-token', accessToken)
        })
          .pipe(
            catchError(this.handleError)
          );
    }
    //update
    updateentrypayment(id: any, value: any) {
       let token = this.authservice.getCurrentuser();
        let accessToken = token.accessToken;
      const URL = this.host + 'invoicetds/update/' + id;
       const headers = new Headers({
          'Content-Type': 'application/json'
        });
        headers.append('x-access-token', accessToken);
        return this.http.put(URL,value, {
          headers: new HttpHeaders().set('x-access-token', accessToken)
        })
          .pipe(
            catchError(this.handleError)
          );
   
    }
    
    
    insertinvoicedata(id: any) {
       let token = this.authservice.getCurrentuser();
        let accessToken = token.accessToken;
     const URL = this.host + 'invoicetds/invoices/' + id + '/';
  const headers = new Headers({
          'Content-Type': 'application/json'
        });
        headers.append('x-access-token', accessToken);
        return this.http.get(URL, {
          headers: new HttpHeaders().set('x-access-token', accessToken)
        })
          .pipe(
            catchError(this.handleError)
          );
    }
    //paymentgrid
    paymentgrid(id:any,role:any) {
       let token = this.authservice.getCurrentuser();
        let accessToken = token.accessToken;
     const URL = this.host + 'invoicetds/paymentgrid/'+ id+'/'+ role;
  const headers = new Headers({
          'Content-Type': 'application/json'
        });
        headers.append('x-access-token', accessToken);
        return this.http.get(URL, {
          headers: new HttpHeaders().set('x-access-token', accessToken)
        })
          .pipe(
            catchError(this.handleError)
          );
    }
    
    getallpayment(id:any){
       let token = this.authservice.getCurrentuser();
        let accessToken = token.accessToken;
     const URL = this.host + 'invoicetds/getupdate/'+id;
     const headers = new Headers({
          'Content-Type': 'application/json'
        });
        headers.append('x-access-token', accessToken);
        return this.http.get(URL, {
          headers: new HttpHeaders().set('x-access-token', accessToken)
        })
          .pipe(
            catchError(this.handleError)
          );
    }


    insertlistpayment(value:any){
       let token = this.authservice.getCurrentuser();
        let accessToken = token.accessToken;
    const URL = this.host + 'invoicetds/invoicetds/list';
    const headers = new Headers({
          'Content-Type': 'application/json'
        });
        headers.append('x-access-token', accessToken);
        return this.http.post(URL,value, {
          headers: new HttpHeaders().set('x-access-token', accessToken)
        })
          .pipe(
            catchError(this.handleError)
          );
    
     
    }
    updatelistpayment(data:any,id:any,){
       let token = this.authservice.getCurrentuser();
        let accessToken = token.accessToken;
     const URL = this.host + 'invoicetds/listupdate/' + id;
    const headers = new Headers({
          'Content-Type': 'application/json'
        });
        headers.append('x-access-token', accessToken);
        return this.http.put(URL,data, {
          headers: new HttpHeaders().set('x-access-token', accessToken)
        })
          .pipe(
            catchError(this.handleError)
          );
    }
}