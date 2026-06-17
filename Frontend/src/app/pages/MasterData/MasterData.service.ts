import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { UrlSegment } from '@angular/router';

import { ApiService } from 'src/app/service/apiservice';
import { AuthService } from 'src/app/service/auth.service';
@Injectable({
  providedIn: 'root'
})
export class MasterdataService {
  currentuser: any;
  encryptSecretKey: any = '123456789asdfghjkl';
  httpOptions: any = {};
  private host = environment.APIEndpoint;
  constructor(private authservice: AuthService, private http: HttpClient) {
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
  //state
  getallstate() {
    let token = this.authservice.getCurrentuser();
    let accessToken = token.accessToken;

    const URL = this.host + 'Companycreation/getstate';
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
  //country
  getallcountry() {
    let token = this.authservice.getCurrentuser();
    let accessToken = token.accessToken;

    const URL = this.host + 'Companycreation/getcountry';
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
  //insert
  insertclientdetails(value: any) {

    let token = this.authservice.getCurrentuser();
    let accessToken = token.accessToken;
    const URL = this.host + 'Companycreation/post';
    const headers = new Headers({
      'Content-Type': 'application/json'
    });
    headers.append('x-access-token', accessToken);

    return this.http.post(URL, value, {
      headers: new HttpHeaders().set('x-access-token', accessToken)
    })
      .pipe(
        catchError(this.handleError)
      );
  }
  //update
  updateclientdetails(id: any, data: any) {
    let token = this.authservice.getCurrentuser();
    let accessToken = token.accessToken;
    const URL = this.host + 'Companycreation/update/' + id;
    const headers = new Headers({
      'Content-Type': 'application/json'
    });
    headers.append('x-access-token', accessToken);
    return this.http.put(URL, data, {
      headers: new HttpHeaders().set('x-access-token', accessToken)
    })
      .pipe(
        catchError(this.handleError)
      );
  }
  //delete
  deleteuser(id: any) {
    let token = this.authservice.getCurrentuser();
    let accessToken = token.accessToken;

    const URL = this.host + 'Companycreation/user/' + id;
    const headers = new Headers({ 'Content-Type': 'application/json' });
    headers.append('x-access-token', accessToken);
    return this.http.delete(URL, { headers: new HttpHeaders().set('x-access-token', accessToken) })
      .pipe(catchError(this.handleError));
  }
  //getgrid
  gridgetuser(id:any,role:any) {
    let token = this.authservice.getCurrentuser();
    let accessToken = token.accessToken;

    const URL = this.host + 'Companycreation/gridvalues/'+id+'/'+ role;
    const headers = new Headers({ 'Content-Type': 'application/json' });
    headers.append('x-access-token', accessToken);
    return this.http.get(URL, {
      headers: new HttpHeaders().set('x-access-token', accessToken)
    })
      .pipe(catchError(this.handleError));
  }
  //getupdate
  getallclientdata(id: any) {
    let token = this.authservice.getCurrentuser();
    let accessToken = token.accessToken;

    const URL = this.host + 'Companycreation/Usergetupdate/' + id;
    const headers = new Headers({ 'Content-Type': 'application/json' });
    headers.append('x-access-token', accessToken);
    return this.http.get(URL, { headers: new HttpHeaders().set('x-access-token', accessToken) })
      .pipe(catchError(this.handleError));
  }
  createSubadmin(data: any): Observable<any> {
    const token = this.authservice.getCurrentuser()?.accessToken;
    const URL = this.host + 'subadmin/create';
    return this.http
      .post(URL, data, {
        headers: new HttpHeaders().set('x-access-token', token),
      })
      .pipe(catchError(this.handleError));
  }

  getSubadminList(role:any,Id:any): Observable<any> {
    const token = this.authservice.getCurrentuser()?.accessToken;
    const URL = this.host + 'subadmin/Getall/' + role +'/'+ Id;
    return this.http
      .get(URL, {
        headers: new HttpHeaders().set('x-access-token', token),
      })
      .pipe(catchError(this.handleError));
  }

  getSubadminById(id: string): Observable<any> {
    const token = this.authservice.getCurrentuser()?.accessToken;
    const URL = this.host + 'subadmin/getvalue/' + id;
    return this.http
      .get(URL, {
        headers: new HttpHeaders().set('x-access-token', token),
      })
      .pipe(catchError(this.handleError));
  }

  updateSubadmin(id: string, data: any): Observable<any> {
    const token = this.authservice.getCurrentuser()?.accessToken;
    const URL = this.host + 'subadmin/update/' + id;
    return this.http
      .put(URL, data, {
        headers: new HttpHeaders().set('x-access-token', token),
      })
      .pipe(catchError(this.handleError));
  }

  deleteSubadmin(id: string): Observable<any> {
    const token = this.authservice.getCurrentuser()?.accessToken;
    const URL = this.host + 'subadmin/delete/' + id;
    return this.http
      .delete(URL, {
        headers: new HttpHeaders().set('x-access-token', token),
      })
      .pipe(catchError(this.handleError));
  }
checkEmailExists(emailExistsValidator: string) {
  const token = this.authservice.getCurrentuser();
  const accessToken = token.accessToken;

  const URL = `${this.host}Companycreation/CheckEmailExists?email=${emailExistsValidator}`;

  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'x-access-token': accessToken
  });

  return this.http.get<{ exists: boolean }>(URL, { headers });
}
}