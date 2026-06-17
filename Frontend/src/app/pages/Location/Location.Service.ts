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
export class LocationService {

  currentuser: any;
  accessToken: any;
    encryptSecretKey: any = '123456789asdfghjkl';
    httpOptions: any = {};
    private host = environment.APIEndpoint;
    constructor(private authservice: AuthService,private http: HttpClient,private tokenService: TokenService) {
       this.accessToken = this.tokenService.accessToken;
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


  insertdata(value: any) {

     let token=this.authservice.getCurrentuser();
        let accessToken = token.accessToken;
    const URL = this.host + 'lacation/';
    const headers = new Headers({
      'Content-Type': 'application/json'
    });
    headers.append('x-access-token',accessToken);

    return this.http.post(URL, value, {
      headers: new HttpHeaders().set('x-access-token',accessToken)
    })
      .pipe(
        catchError(this.handleError)
      );


  }
  getlocation(id:any){
    let token=this.authservice.getCurrentuser();
        let accessToken = token.accessToken;
 const URL = this.host + 'lacation/'+id;
    const headers = new Headers({
      'Content-Type': 'application/json'
    });
    headers.append('x-access-token',accessToken);
    return this.http.get(URL, {
      headers: new HttpHeaders().set('x-access-token',accessToken)
    })
      .pipe(
        catchError(this.handleError)
      );
  }
  Updatedata(value: any,id:any) {
    
     let token=this.authservice.getCurrentuser();
        let accessToken = token.accessToken;
    const URL = this.host + 'lacation/update/'+id;
    const headers = new Headers({
      'Content-Type': 'application/json'
    });
    headers.append('x-access-token',accessToken);
    return this.http.put(URL, value, {
      headers: new HttpHeaders().set('x-access-token',accessToken)
    })
      .pipe(
        catchError(this.handleError)
      );
  }
   
   dropdownget(){
        let token=this.authservice.getCurrentuser();
        let accessToken = token.accessToken;
       
        const URL = this.host + 'lacation/getportdescription';
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
  locationGrid(id:any,role:any) {  
     let token=this.authservice.getCurrentuser();
        let accessToken = token.accessToken;
    const URL = this.host + 'lacation/get/'+ id+'/'+ role;
    return this.http.get(URL, 
      { headers: new HttpHeaders({
         'Content-Type': 'application/json', 'x-access-token':accessToken 
        }) }).pipe(catchError(this.handleError)); }
}