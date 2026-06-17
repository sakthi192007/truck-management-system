import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { UrlSegment } from '@angular/router';
import { TokenService } from 'src/app/service/accessToken';
import { HeadersService } from 'src/app/service/Headers';
import { AuthService } from 'src/app/service/auth.service';
// import { url } from 'inspector';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

 currentuser: any;
    encryptSecretKey: any = '123456789asdfghjkl';
    httpOptions: any = {};
    private host = environment.APIEndpoint;
    constructor(private authservice: AuthService,private http: HttpClient) {
      this.httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          // Authorization: 'Bearer '
        })
      };
    }
    private handleError(error: HttpErrorResponse): Observable<any> {
      let errorMessage = 'Unknown error occurred';
      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = `Error: ${error.error.message}`;
      } else {
        // Server-side error
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      }
      console.error(errorMessage);
      return throwError(errorMessage);
    }
    checkEmailExists(email: string) {
  const token = this.authservice.getCurrentuser();
  const accessToken = token.accessToken;

  const URL = `${this.host}clientdetails/CheckEmailExists?email=${email}`;

  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'x-access-token': accessToken
  });

  return this.http.get<{ exists: boolean }>(URL, { headers });
}
  clientGrid(id: any, role: any) {
     let token=this.authservice.getCurrentuser();
      let accessToken = token.accessToken;

    const URL = this.host + 'clientdetails/allget/' + id + '/' + role;
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
  getallclient(id: any) {
     let token=this.authservice.getCurrentuser();
      let accessToken = token.accessToken;
    const URL = this.host + 'clientdetails/getupdate/' + id;
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

  getallstate() {
     let token=this.authservice.getCurrentuser();
      let accessToken = token.accessToken;
    const URL = this.host + 'clientdetails/getstate';
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

  getallbusiness() {
     let token=this.authservice.getCurrentuser();
      let accessToken = token.accessToken;
    const URL = this.host + 'clientdetails/getbusiness';
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
  getallcountry() {
     let token=this.authservice.getCurrentuser();
      let accessToken = token.accessToken;
    const URL = this.host + 'clientdetails/getcountry';
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

  insertclientdetails(value: any) {
     let token=this.authservice.getCurrentuser();
      let accessToken = token.accessToken;
    const URL = this.host + 'clientdetails/post';
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
insertUserclientdetails(value: any,Id:any,clientId:any) {
     let token=this.authservice.getCurrentuser();
      let accessToken = token.accessToken;
    const URL = this.host + 'clientdetails/User/'+Id+'/'+clientId;
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

  updateclientdetails(id: any, data: any) {
     let token=this.authservice.getCurrentuser();
      let accessToken = token.accessToken;
    const URL = this.host + 'clientdetails/update/' + id;
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
  customers(id:any,role:any) {
     let token=this.authservice.getCurrentuser();
      let accessToken = token.accessToken;
    const URL = this.host + 'clientdetails/customers/'+id+'/'+role;
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
  importcustomers(id:any,role:any) {
     let token=this.authservice.getCurrentuser();
      let accessToken = token.accessToken;
    const URL = this.host + 'clientdetails/importcustomers/'+id+'/'+role;
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

  // insertprice
  insertclientprice(value: any) {
     let token=this.authservice.getCurrentuser();
      let accessToken = token.accessToken;
    const URL = this.host + 'Clientspricedetails/';
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

  iminsertclientprice(value: any) {
     let token=this.authservice.getCurrentuser();
      let accessToken = token.accessToken;
    const URL = this.host + 'Clientspricedetails/import/';
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
  clientpricegrid(id:any,role:any) {
     let token=this.authservice.getCurrentuser();
      let accessToken = token.accessToken;
    const URL = this.host + 'Clientspricedetails/clientpricegrid/'+id+'/'+role;
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
  imclientpricegrid(id:any,role:any) {
     let token=this.authservice.getCurrentuser();
      let accessToken = token.accessToken;
    const URL = this.host + 'Clientspricedetails/imclientpricegrid/'+id+'/'+role;
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
  clientpricegridapproval(id:any,role:any) {
     let token=this.authservice.getCurrentuser();
      let accessToken = token.accessToken;
    const URL = this.host + 'Clientspricedetails/approvaldata/'+id+'/'+role;
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
  imclientpricegridapproval(id:any,role:any) {
     let token=this.authservice.getCurrentuser();
      let accessToken = token.accessToken;
    const URL = this.host + 'Clientspricedetails/imapprovaldata/'+id+'/'+role;
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
  getpendingprice() {
     let token=this.authservice.getCurrentuser();
      let accessToken = token.accessToken;
    const URL = this.host + 'Clientspricedetails';
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
  Approveclientprice(value: any) {
     let token=this.authservice.getCurrentuser();
      let accessToken = token.accessToken;
    const URL = this.host + 'Clientspricedetails/approvel/' + value;
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

  imApproveclientprice(value: any) {
     let token=this.authservice.getCurrentuser();
      let accessToken = token.accessToken;
    const URL = this.host + 'Clientspricedetails/imapprovel/' + value;
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
  getpricedetails(id: any) {
     let token=this.authservice.getCurrentuser();
      let accessToken = token.accessToken;
    const URL = this.host + 'Clientspricedetails/Getupdate/' + id;
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
  imgetpricedetails(id: any) {
     let token=this.authservice.getCurrentuser();
      let accessToken = token.accessToken;
    const URL = this.host + 'Clientspricedetails/imGetupdate/' + id;
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
  updatepricedetails(id: any, value: any) {
     let token=this.authservice.getCurrentuser();
      let accessToken = token.accessToken;
    const URL = this.host + 'Clientspricedetails/update/' + id;
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
  imupdatepricedetails(id: any, value: any) {
     let token=this.authservice.getCurrentuser();
      let accessToken = token.accessToken;
    const URL = this.host + 'Clientspricedetails/import/update/' + id;
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
  dropdowngetcustomer(userId: any, RoleId: any) {
     let token=this.authservice.getCurrentuser();
      let accessToken = token.accessToken;
    const URL = this.host + 'bookingdetails/getcustomer/' + userId + '/' + RoleId;
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
}