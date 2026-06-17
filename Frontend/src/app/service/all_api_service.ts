import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { HeadersService } from './Headers';
import { Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service';
@Injectable({
  providedIn: 'root'
})
export class all_api_service {
    currentuser: any;
   accessToken: any;
  httpOptions: any = {};
  private host = environment.APIEndpoint;
    constructor(private authservice: AuthService, private http: HttpClient,private HeadersService:HeadersService) {
        this.httpOptions = {
             headers: new HttpHeaders({
               'Content-Type': 'application/json',
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
    Forgotpassword(Email:any){
      return this.http.post(this.host + 'register/forgot/' + Email, this.HeadersService.getHeader())
      .pipe(catchError(this.HeadersService.handleError));
    }
    verifyotp(Otp:any,Email:any){
      return this.http.post(this.host + 'register/verifyotp/'+ Otp+'/'+ Email, this.HeadersService.getHeader())
      .pipe(catchError(this.HeadersService.handleError));
    }
    resetpassword(value:any,id:any){
      return this.http.put(this.host + 'register/resetpassword/'+ value+'/'+ id, this.HeadersService.getHeader())
      .pipe(catchError(this.HeadersService.handleError));
    }
  
    bookingtow(id:any,role:any){
         let token=this.authservice.getCurrentuser();
        let accessToken = token.accessToken;
      const URL = this.host + 'bookingdetails/gettoecontaine/'+ id+'/'+ role;
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
    bookingfor(id:any,role:any){
        let token=this.authservice.getCurrentuser();
        let accessToken = token.accessToken;
      const URL = this.host + 'bookingdetails/getforcontaine/'+ id+'/'+ role;
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
    dropdowngetvendors(){
       let token=this.authservice.getCurrentuser();
        let accessToken = token.accessToken;
      const URL = this.host + 'bookingdetails/getvendor';
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
    mapdata(id:any,role:any){
       let token=this.authservice.getCurrentuser();
        let accessToken = token.accessToken;
      const URL = this.host + 'VehicleInformation/mapdetails/'+id+'/'+role;
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
    livemapdata(Containernumber:any,Dep:any){
        let token=this.authservice.getCurrentuser();
        let accessToken = token.accessToken;
      const URL = this.host + 'VehicleInformation/livemapdetails/'+ Containernumber+'/'+ Dep;
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

    EXmilestonedetails(Containernumber:any){
        let token=this.authservice.getCurrentuser();
        let accessToken = token.accessToken;
      const URL = this.host + 'VehicleInformation/milestonedetails/Export/'+ Containernumber;
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
    IMmilestonedetails(Containernumber:any){
        let token=this.authservice.getCurrentuser();
        let accessToken = token.accessToken;
      const URL = this.host + 'VehicleInformation/milestonedetails/Import/'+ Containernumber;
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
  changePassword(id:any, formData: any) {
      let token=this.authservice.getCurrentuser();
        let accessToken = token.accessToken;
  const URL = this.host + 'userdetails/change-password/'+id;
   const headers = new Headers({
        'Content-Type': 'application/json'
      });
      headers.append('x-access-token', accessToken);
      return this.http.post(URL,formData, {
        headers: new HttpHeaders().set('x-access-token', accessToken)
      })
        .pipe(
          catchError(this.handleError)
        );

}
setUserIdleStatus(userId: string, isIdle: boolean) {
    let token=this.authservice.getCurrentuser();
        let accessToken = token.accessToken;

  const URL = this.host + 'session/idle';
  const body = { userId, isIdle };
 const headers = new Headers({
        'Content-Type': 'application/json'
      });
      headers.append('x-access-token', accessToken);
      return this.http.post(URL,body, {
        headers: new HttpHeaders().set('x-access-token', accessToken)
      })
        .pipe(
          catchError(this.handleError)
        );
}

  
  }
  
   
      
