import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { UrlSegment } from '@angular/router';
import { ApiService } from 'src/app/service/apiservice';
import { AuthService } from 'src/app/service/auth.service';
import { TokenService } from 'src/app/service/accessToken';
// import { url } from 'inspector';
@Injectable({
  providedIn: 'root'
})
export class ReportService {
  currentuser: any;
  accessToken: any;
  encryptSecretKey: any = '123456789asdfghjkl';
  httpOptions: any = {};
  private host = environment.APIEndpoint;
  constructor(private authservice: AuthService, private http: HttpClient, private tokenService: TokenService) {
    this.accessToken = this.tokenService.accessToken;
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        // Authorization: 'Bearer '
      })
    };
  }
  monthlygrid(id:any) {

    let token = this.authservice.getCurrentuser();
    let accessToken = token.accessToken;

    const URL = this.host + 'Report/monthlygrid/'+id;
    const headers = new Headers({
      'Content-Type': 'application/json'
    });
    headers.append('x-access-token', accessToken);
    return this.http.get(URL, {
      headers: new HttpHeaders().set('x-access-token', accessToken)
    })

  }
  monthlygridimport(id:any) {

    let token = this.authservice.getCurrentuser();
    let accessToken = token.accessToken;

    const URL = this.host + 'Report/monthlygridimport/'+id;
    const headers = new Headers({
      'Content-Type': 'application/json'
    });
    headers.append('x-access-token', accessToken);
    return this.http.get(URL, {
      headers: new HttpHeaders().set('x-access-token', accessToken)
    })

  }
  importreportgrid(id:any) {
    let token = this.authservice.getCurrentuser();
    let accessToken = token.accessToken;


    const URL = this.host + 'Report/importreportgrid/'+id;
    const headers = new Headers({
      'Content-Type': 'application/json'
    });
    headers.append('x-access-token', accessToken);
    return this.http.get(URL, {
      headers: new HttpHeaders().set('x-access-token', accessToken)
    })

  }
  exportreportgrid(id:any) {
    let token = this.authservice.getCurrentuser();
    let accessToken = token.accessToken;

    const URL = this.host + 'Report/exportreportgrid/'+id;
    const headers = new Headers({
      'Content-Type': 'application/json'
    });
    headers.append('x-access-token', accessToken);
    return this.http.get(URL, {
      headers: new HttpHeaders().set('x-access-token', accessToken)
    })

  }
  invoicegrid(id:any) {
    let token = this.authservice.getCurrentuser();
    let accessToken = token.accessToken;


    const URL = this.host + 'Report/invoicegrid/'+id;
    const headers = new Headers({
      'Content-Type': 'application/json'
    });
    headers.append('x-access-token', accessToken);
    return this.http.get(URL, {
      headers: new HttpHeaders().set('x-access-token', accessToken)
    })

  }
  invoicegridimp(id:any) {

    let token = this.authservice.getCurrentuser();
    let accessToken = token.accessToken;


    const URL = this.host + 'Report/invoicegridimp/'+id;
    const headers = new Headers({
      'Content-Type': 'application/json'
    });
    headers.append('x-access-token', accessToken);
    return this.http.get(URL, {
      headers: new HttpHeaders().set('x-access-token', accessToken)
    })

  }
  vendorreportgrid(id:any) {
    let token = this.authservice.getCurrentuser();
    let accessToken = token.accessToken;
    const URL = this.host + 'Report/vendorreportgrid/'+id;
    const headers = new Headers({
      'Content-Type': 'application/json'
    });
    headers.append('x-access-token', accessToken);
    return this.http.get(URL, {
      headers: new HttpHeaders().set('x-access-token', accessToken)
    })

  }
  vendorreportimportgrid(id:any) {
    let token = this.authservice.getCurrentuser();
    let accessToken = token.accessToken;



    const URL = this.host + 'Report/vendorreportimportgrid/'+id;
    const headers = new Headers({
      'Content-Type': 'application/json'
    });
    headers.append('x-access-token', accessToken);
    return this.http.get(URL, {
      headers: new HttpHeaders().set('x-access-token', accessToken)
    })

  }
  gstreportgrid(id:any){
     let token = this.authservice.getCurrentuser();
    let accessToken = token.accessToken;



    const URL = this.host + 'Report/gstgrid/'+id;
    const headers = new Headers({
      'Content-Type': 'application/json'
    });
    headers.append('x-access-token', accessToken);
    return this.http.get(URL, {
      headers: new HttpHeaders().set('x-access-token', accessToken)
    })
  }
   tdsreportgrid(id:any){
     let token = this.authservice.getCurrentuser();
    let accessToken = token.accessToken;



    const URL = this.host + 'Report/tdsgrid/'+id;
    const headers = new Headers({
      'Content-Type': 'application/json'
    });
    headers.append('x-access-token', accessToken);
    return this.http.get(URL, {
      headers: new HttpHeaders().set('x-access-token', accessToken)
    })
  }
}

