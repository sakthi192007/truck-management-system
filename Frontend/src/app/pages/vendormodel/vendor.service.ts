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
export class VendorService {
    currentuser: any;
   accessToken: any;
  encryptSecretKey: any = '123456789asdfghjkl';
  httpOptions: any = {};
  private host = environment.APIEndpoint;
  constructor(private authservice: AuthService, private http: HttpClient,private tokenService: TokenService) {
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
    getallbank(id:any) {
     
       let token=this.authservice.getCurrentuser();
        let accessToken = token.accessToken;
     
      const URL = this.host + 'vendordetails/bankgrid/'+id;
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
    getallvehicle(id:any) {
     
       let token=this.authservice.getCurrentuser();
        let accessToken = token.accessToken;
     
      const URL = this.host + 'vendordetails/getvehiclegrid/'+id;
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
    getalladdvehicle(id:any) {
     
       let token=this.authservice.getCurrentuser();
        let accessToken = token.accessToken;
     
      const URL = this.host + 'vendordetails/getaddvehiclegrid/'+id;
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
    getalldriver(id:any) {
     
       let token=this.authservice.getCurrentuser();
        let accessToken = token.accessToken;
     
      const URL = this.host + 'vendordetails/getdrivergrid/'+id;
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
    getalltypecontainer(){
     
       let token=this.authservice.getCurrentuser();
        let accessToken = token.accessToken;
     
      const URL = this.host + 'vendordetails/getcontainer/';
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
   
    getupdatebankdetails(id:any){
       let token=this.authservice.getCurrentuser();
        let accessToken = token.accessToken;
     
     
      const URL = this.host + 'vendordetails/bankgetupdate/'+id;
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
    getupdatevehicledetails(id:any){
     
       let token=this.authservice.getCurrentuser();
        let accessToken = token.accessToken;
     
      const URL = this.host + 'vendordetails/vehiclegetupdate/'+id;
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
  
    getupdatedriverdetails(id:any){
     
     
       let token=this.authservice.getCurrentuser();
        let accessToken = token.accessToken;
      const URL = this.host + 'vendordetails/drivergetupdate/'+id;
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
    insertcompanydetails(value:any){

       let token=this.authservice.getCurrentuser();
        let accessToken = token.accessToken;
     
    const URL = this.host + 'vendordetails/vendor/comapany';
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
     insertUservendordetails(value:any,User_Id:any,vendorId:any){

       let token=this.authservice.getCurrentuser();
        let accessToken = token.accessToken;
     
    const URL = this.host + 'clientdetails/Vendor/'+User_Id+'/'+vendorId;
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
    Updatecompanydetails(id:any,data:any){

       let token=this.authservice.getCurrentuser();
        let accessToken = token.accessToken;
     
      const URL = this.host + 'vendordetails/company/update/' + id;
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
    insertbankdetails(value:any){
  let token=this.authservice.getCurrentuser();
        let accessToken = token.accessToken;
     
     
    const URL = this.host + 'vendordetails/vendor/bank';
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
    Updatebankdetails(id:any,data:any){

       let token=this.authservice.getCurrentuser();
        let accessToken = token.accessToken;
     
      const URL = this.host + 'vendordetails/bank/update/' + id;
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
    insertvehicledetails(value:any){

       let token=this.authservice.getCurrentuser();
        let accessToken = token.accessToken;
     
    const URL = this.host + 'vendordetails/vendor/vehicle';
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
    updatevehicledetails(id:any,data:any){
       let token=this.authservice.getCurrentuser();
        let accessToken = token.accessToken;
     
      const URL = this.host + 'vendordetails/vehicle/update/' + id;
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
    insertdriverdetails(value:any){
  let token=this.authservice.getCurrentuser();
        let accessToken = token.accessToken;
     
     
    const URL = this.host + 'vendordetails/vendor/driver';
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
    updatedriverdetails(id:any,data:any){
     
       let token=this.authservice.getCurrentuser();
        let accessToken = token.accessToken;

      const URL = this.host + 'vendordetails/driver/update/' + id;
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
    deletebank(id:any){
     
       let token=this.authservice.getCurrentuser();
        let accessToken = token.accessToken;

      const URL = this.host + 'vendordetails/bank/' + id;
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
    deletedrivers(id:any){
       let token=this.authservice.getCurrentuser();
        let accessToken = token.accessToken;
      const URL = this.host + 'vendordetails/driver/' + id;
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
    deletevehicles(id:any){
       let token=this.authservice.getCurrentuser();
        let accessToken = token.accessToken;
     

      const URL = this.host + 'vendordetails/vehicle/' + id;
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
    ventorGrid(id:any,role:any) {
     
       let token=this.authservice.getCurrentuser();
        let accessToken = token.accessToken;
     
      const URL = this.host + 'vendordetails/getvendor/'+ id+'/'+ role;
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
    getall(id:any){
     
       let token=this.authservice.getCurrentuser();
        let accessToken = token.accessToken;
     
      const URL = this.host + 'vendordetails/update/'+id;
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
    insertvendorprice(value:any){
     
       let token=this.authservice.getCurrentuser();
        let accessToken = token.accessToken;
    const URL = this.host + 'Vendorpricedetails';
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
    vendorpricegrid(id:any,role:any){
     
       let token=this.authservice.getCurrentuser();
        let accessToken = token.accessToken;
     
      const URL = this.host + 'Vendorpricedetails/vendorpricegrid/'+id+'/'+role;
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
    vendorpricegridapproval(id:any,role:any){
       let token=this.authservice.getCurrentuser();
        let accessToken = token.accessToken;
     
     
      const URL = this.host + 'Vendorpricedetails/approvaldata/'+id+'/'+role;
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
    getpendingprice(){
       let token=this.authservice.getCurrentuser();
        let accessToken = token.accessToken;
     
     
      const URL = this.host + 'Vendorpricedetails';
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
    Approvevendorprice(value:any){
      
  let token=this.authservice.getCurrentuser();
        let accessToken = token.accessToken;
     
       
        const URL = this.host + 'Vendorpricedetails/approvel/' + value;
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
    //
    getpricedetails(id:any){
       let token=this.authservice.getCurrentuser();
        let accessToken = token.accessToken;
       
        const URL = this.host + 'Vendorpricedetails/Getupdate/' + id;
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
    
    updatepricedetails(id:any,value:any){
     
       let token=this.authservice.getCurrentuser();
        let accessToken = token.accessToken;
      const URL = this.host + 'Vendorpricedetails/update/' + id;
      const headers = new Headers({
        'Content-Type': 'application/json'
      });
      headers.append('x-access-token', accessToken);
      return this.http.put(URL, value, {
        headers: new HttpHeaders().set('x-access-token', accessToken)
      })
        .pipe(
          catchError(this.handleError)
        );
    }
    //import
    vendorpricegridimp(id:any,role:any){
     
       let token=this.authservice.getCurrentuser();
        let accessToken = token.accessToken;
     
      const URL = this.host + 'Vendorpricedetails/imvendorpricegrid/'+id+'/'+role;
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
    vendorpricegridapprovalimp(id:any,role:any){
     
       let token=this.authservice.getCurrentuser();
        let accessToken = token.accessToken;
     
      const URL = this.host + 'Vendorpricedetails/imapprovaldata/'+id+'/'+role;
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
    getpendingpriceimp(){
     
       let token=this.authservice.getCurrentuser();
        let accessToken = token.accessToken;
     
      const URL = this.host + 'Vendorpricedetails';
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
    impApprovevendorprice(value:any){
       let token=this.authservice.getCurrentuser();
        let accessToken = token.accessToken;
     
      const URL = this.host + 'Vendorpricedetails/imapprovel/' + value;
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
    impgetpricedetails(id:any){
       let token=this.authservice.getCurrentuser();
        let accessToken = token.accessToken;
       
        const URL = this.host + 'Vendorpricedetails/imGetupdate/' + id;
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
    insertimpvendorprice(value:any){
       let token=this.authservice.getCurrentuser();
        let accessToken = token.accessToken;
     
    const URL = this.host + 'Vendorpricedetails/import/';
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
    updateimppricedetails(id:any,value:any){
     
       let token=this.authservice.getCurrentuser();
        let accessToken = token.accessToken;
      const URL = this.host + 'Vendorpricedetails/import/update/' + id;
      const headers = new Headers({
        'Content-Type': 'application/json'
      });
      headers.append('x-access-token', accessToken);
      return this.http.put(URL, value, {
        headers: new HttpHeaders().set('x-access-token', accessToken)
      })
        .pipe(
          catchError(this.handleError)
        );
    }
    dropdowngetcustomer(userId:any,RoleId:any){
     
       let token=this.authservice.getCurrentuser();
        let accessToken = token.accessToken;
     
      const URL = this.host + 'Vendorpricedetails/getcustomer/'+ userId+'/'+ RoleId;
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
    checkEmailExists(emailExistsValidator: string) {
  const token = this.authservice.getCurrentuser();
  const accessToken = token.accessToken;

  const URL = `${this.host}vendordetails/CheckEmailExists?email=${emailExistsValidator}`;

  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'x-access-token': accessToken
  });

  return this.http.get<{ exists: boolean }>(URL, { headers });
}
}