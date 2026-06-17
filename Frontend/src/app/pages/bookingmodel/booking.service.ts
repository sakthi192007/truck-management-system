import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { UrlSegment } from '@angular/router';

import { ApiService } from 'src/app/service/apiservice'; 
import { AuthService } from 'src/app/service/auth.service'; 
// import { url } from 'inspector';
@Injectable({
  providedIn: 'root'
})
export class BookingService {
    currentuser: any;
    encryptSecretKey: any = '123456789asdfghjkl';
    httpOptions: any = {};
    private host = environment.APIEndpoint;
    private hostmobile = environment.APIEndpoint;
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


    //dropdown

    dropdowngetcustomer(userId:any,RoleId:any){
      let token=this.authservice.getCurrentuser();
      let accessToken = token.accessToken;
     
      const URL = this.host + 'bookingdetails/getcustomer/'+ userId+'/'+ RoleId;
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
    imdropdowngetcustomer(userId:any,RoleId:any){
      let token=this.authservice.getCurrentuser();
      let accessToken = token.accessToken;
     
      const URL = this.host + 'bookingdetails/imgetcustomer/'+ userId+'/'+ RoleId;
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
    dropdowngetgenerel(id:any){
      let token=this.authservice.getCurrentuser();
      let accessToken = token.accessToken;
     
      const URL = this.host + 'bookingdetails/getgenerel/'+id;
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
    dropdowngetlocation(id:any){
      let token=this.authservice.getCurrentuser();
      let accessToken = token.accessToken;
     
      const URL = this.host + 'invoicedetails/getportofloading/'+id;
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
    dropdowngetpoint(id:any){
      let token=this.authservice.getCurrentuser();
      let accessToken = token.accessToken;
     
      const URL = this.host + 'bookingdetails/pointofclear/'+id;
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
    dropdowngetStaffing(id:any){
      let token=this.authservice.getCurrentuser();
      let accessToken = token.accessToken;
     
      const URL = this.host + 'bookingdetails/Staffing/'+id;
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
  
 //export 
UploadFile(formData: FormData) {

  const token = this.authservice.getCurrentuser();
  const accessToken = token.accessToken;

  const URL = this.host + 'OcrDocument/process';

  const headers = new HttpHeaders({
    'x-access-token': accessToken
  });

  return this.http.post(URL, formData, { headers })
    .pipe(
      catchError(this.handleError)
    );
}

 insertEportbooking(value:any){

  let token=this.authservice.getCurrentuser();
  let accessToken = token.accessToken;
const URL = this.host + 'bookingExports';
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
insertEportbookingItems(value:any){

  let token=this.authservice.getCurrentuser();
  let accessToken = token.accessToken;
const URL = this.host + 'bookingExports/Exportitems';
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

       // get all api

      

       bookingGrid(id:any,role:any){
        let token=this.authservice.getCurrentuser();
        let accessToken = token.accessToken;
       
        const URL = this.host + 'bookingExports/getall/'+ id+'/'+ role;
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
      bookeddetails(id:any,role:any){
        let token=this.authservice.getCurrentuser();
        let accessToken = token.accessToken;
       
        const URL = this.host + 'bookingExports/allbooked/'+ id+'/'+ role;
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
     getdocumets(id:any){
        let token=this.authservice.getCurrentuser();
        let accessToken = token.accessToken;
       
        const URL = this.host + 'bookingExports/ExportDocumet/'+id;
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

      getbookingall(id:any){
        let token=this.authservice.getCurrentuser();
        let accessToken = token.accessToken;
       
        const URL = this.host + 'bookingExports/'+id;
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


      Deletebooking(id:any,value:any){

        let token=this.authservice.getCurrentuser();
      let accessToken = token.accessToken;
      const URL = this.host + 'bookingExports/delete/' + id;
      const headers = new Headers({'Content-Type': 'application/json'});
      headers.append('x-access-token', accessToken);
      return this.http.put(URL, value, { headers: new HttpHeaders().set('x-access-token', accessToken)})
        .pipe(catchError(this.handleError));

        
      }
      
      Exportemail(id: any) {
        let token = this.authservice.getCurrentuser();
        let accessToken = token.accessToken;
        const URL = this.host + 'bookingExports/bookingApproval/' + id ;
    
        return this.http.get(URL, {
            headers: new HttpHeaders().set('x-access-token', accessToken)
        })
        .pipe(
            catchError(this.handleError)
        );
    }


    
      getavailables(id:any){
        let token=this.authservice.getCurrentuser();
        let accessToken = token.accessToken;
       
        const URL = this.host + 'bookingdetails/getavailables/'+ id;
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
     
      updatebooking(id:any,data:any){
        let token=this.authservice.getCurrentuser();
        let accessToken = token.accessToken;
        const URL = this.host + 'bookingdetails/update/' + id;
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



   updateEportbooking(data:any,id:any){
   
          let token=this.authservice.getCurrentuser();
           let accessToken = token.accessToken;
        
         const URL = this.host + 'bookingExports/update/' + id;
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

  


      updateEportbookingItems(data:any,id:any){
        let token=this.authservice.getCurrentuser();
        let accessToken = token.accessToken;
        const URL = this.host + 'bookingExports/items/' + id;
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

     ExportBookingcancel(EB_id:any){
        let token=this.authservice.getCurrentuser();
        let accessToken = token.accessToken;
       
        const URL = this.host + 'bookingExports/bookingcancel/'+ EB_id;
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


//Import
   getimportview(id:any){
        let token=this.authservice.getCurrentuser();
        let accessToken = token.accessToken;
       
        const URL = this.host + 'Importbookings/view/'+id;
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
      getimportbookingall(id:any){
        let token=this.authservice.getCurrentuser();
        let accessToken = token.accessToken;
       
        const URL = this.host + 'Importbookings/'+id;
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
      bookingGridimport(id:any,role:any){
        let token=this.authservice.getCurrentuser();
        let accessToken = token.accessToken;
       
        const URL = this.host + 'Importbookings/getall/'+ id+'/'+ role;
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
      bookeddetailsimport(id:any,role:any){
        let token=this.authservice.getCurrentuser();
        let accessToken = token.accessToken;
       
        const URL = this.host + 'Importbookings/allbooked/'+ id+'/'+ role;
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
      updatebookingimport(id:any,data:any){
          let token=this.authservice.getCurrentuser();
          let accessToken = token.accessToken;
          const URL = this.host + 'Importbookings/update/' + id;
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
      insertImportbooking(value:any){

          let token=this.authservice.getCurrentuser();
          let accessToken = token.accessToken;
        const URL = this.host + 'Importbookings/Import';
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
      insertImportbookingItems(value:any){

          let token=this.authservice.getCurrentuser();
          let accessToken = token.accessToken;
        const URL = this.host + 'Importbookings/Importitems';
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
     ImportBookingapproval(IB_id:any){
          let token=this.authservice.getCurrentuser();
          let accessToken = token.accessToken;
         
          const URL = this.host + 'Importbookings/bookingApproval/'+ IB_id;
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
      UpdateImportbooking(data:any,id:any){
          let token=this.authservice.getCurrentuser();
          let accessToken = token.accessToken;
          const URL = this.host + 'Importbookings/booking/update/' + id;
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
      UpdateImportbookingItems(data:any,id:any){
          let token=this.authservice.getCurrentuser();
          let accessToken = token.accessToken;
          const URL = this.host + 'Importbookings/items/update/' + id;
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
      Deletebookingimport(id:any,value:any){

        let token=this.authservice.getCurrentuser();
      let accessToken = token.accessToken;
      const URL = this.host + 'Importbookings/delete/' + id;
      const headers = new Headers({'Content-Type': 'application/json'});
      headers.append('x-access-token', accessToken);
      return this.http.put(URL, value, { headers: new HttpHeaders().set('x-access-token', accessToken)})
        .pipe(catchError(this.handleError));

        
      }
     
       ImportBookingcancel(IB_id:any){
          let token=this.authservice.getCurrentuser();
          let accessToken = token.accessToken;
         
          const URL = this.host + 'Importbookings/bookingcancel/'+ IB_id;
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

      //events Export

  
      mile(id:any){
        let token=this.authservice.getCurrentuser();
        let accessToken = token.accessToken;
       
        const URL = this.host + 'ExportMilestone/mile/'+id;
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
      containers(id:any){
        let token=this.authservice.getCurrentuser();
        let accessToken = token.accessToken;
       
        const URL = this.host + 'ExportMilestone/container/'+id;
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
     
      
      insertbookingeventsItems(value:any){
        let token=this.authservice.getCurrentuser();
        let accessToken = token.accessToken;
      const URL = this.host + 'ExportMilestone/Events';
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
      updatebookingeventsItems(data:any,id:any){
        let token=this.authservice.getCurrentuser();
        let accessToken = token.accessToken;
        const URL = this.host + 'ExportMilestone/items/' + id;
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

      immile(id:any){
        let token=this.authservice.getCurrentuser();
        let accessToken = token.accessToken;
       
        const URL = this.host + 'ImportMilestone/mile/'+id;
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
      imcontainers(id:any){
        let token=this.authservice.getCurrentuser();
        let accessToken = token.accessToken;
       
        const URL = this.host + 'ImportMilestone/container/'+id;
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
     
      iminsertbookingeventsItems(value:any){
        let token=this.authservice.getCurrentuser();
        let accessToken = token.accessToken;
      const URL = this.host + 'ImportMilestone/Events';
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
      imupdatebookingeventsItems(data:any,id:any){
        let token=this.authservice.getCurrentuser();
        let accessToken = token.accessToken;
        const URL = this.host + 'ImportMilestone/items/' + id;
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
      add(id:any){
        let token=this.authservice.getCurrentuser();
        let accessToken = token.accessToken;
       
        const URL = this.host + 'bookingExports/add/'+ id;
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
      getadminEmail(){
        let token=this.authservice.getCurrentuser();
        let accessToken = token.accessToken;
       
        const URL = this.host + 'ExportMilestone/admin/';
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
      getclientEmail(id:any){
        let token=this.authservice.getCurrentuser();
        let accessToken = token.accessToken;
       
        const URL = this.host + 'ExportMilestone/client/'+id;
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

      dropmile(){
        let token=this.authservice.getCurrentuser();
        let accessToken = token.accessToken;
       
        const URL = this.host + 'bookingdetails/getMile';
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
      imdropmile(){
        let token=this.authservice.getCurrentuser();
        let accessToken = token.accessToken;
       
        const URL = this.host + 'bookingdetails/imgetMile';
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

      dropdowngetvendor(id:any){
        let token=this.authservice.getCurrentuser();
        let accessToken = token.accessToken;
       
        const URL = this.host + 'bookingdetails/getvendordata/'+id;
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
      //insert cfs
      insertcfs(value:any){
        let token=this.authservice.getCurrentuser();
        let accessToken = token.accessToken;
      const URL = this.host + 'cfscreation/cfscreation';
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

      uploadExportBookingFiles(value: any) {
         let token=this.authservice.getCurrentuser();
        let accessToken = token.accessToken;
  const URL = this.host + 'bookingExports/Exportfile';
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

  
     uploadImportBookingFiles(value: any) {
        let token=this.authservice.getCurrentuser();
        let accessToken = token.accessToken;
const URL = this.host + 'Importbookings/Importfile';
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

   dropdownshiper(id:any){
        let token=this.authservice.getCurrentuser();
        let accessToken = token.accessToken;
       
        const URL = this.host + 'bookingdetails/getshiperdata/'+id;
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

deletecorFiles(id: any,Bid:any) {
  let token = this.authservice.getCurrentuser();
  let accessToken = token.accessToken;
const URL = this.host + 'bookingExports/deleteCroFile/'+id+'/'+Bid;
  console.log("🔵 Final API URL:", URL);

  return this.http.delete(URL, {
    headers: new HttpHeaders().set('x-access-token', accessToken)
  }).pipe(
    catchError(this.handleError)
  );
}
deleteformFiles(id: any,Bid:any) {
  let token = this.authservice.getCurrentuser();
  let accessToken = token.accessToken;
const URL = this.hostmobile + 'bookingExports/formFiles/'+id+'/'+Bid;
  console.log("🔵 Final API URL:", URL);

  return this.http.delete(URL, {
    headers: new HttpHeaders().set('x-access-token', accessToken)
  }).pipe(
    catchError(this.handleError)
  );
}
deleteshipFile(id: any,Bid:any) {
  let token = this.authservice.getCurrentuser();
  let accessToken = token.accessToken;
const URL = this.hostmobile + 'bookingExports/shipFile/'+id+'/'+Bid;
  console.log("🔵 Final API URL:", URL);

  return this.http.delete(URL, {
    headers: new HttpHeaders().set('x-access-token', accessToken)
  }).pipe(
    catchError(this.handleError)
  );
}
deleteeirFile(id: any,Bid:any) {
  let token = this.authservice.getCurrentuser();
  let accessToken = token.accessToken;
const URL = this.hostmobile + 'bookingExports/eirFile/'+id+'/'+Bid;
  console.log("🔵 Final API URL:", URL);

  return this.http.delete(URL, {
    headers: new HttpHeaders().set('x-access-token', accessToken)
  }).pipe(
    catchError(this.handleError)
  );
}
deleteSealFile(id: any,Bid:any) {
  let token = this.authservice.getCurrentuser();
  let accessToken = token.accessToken;
const URL = this.hostmobile + 'bookingExports/SealFile/'+id+'/'+Bid;
  console.log("🔵 Final API URL:", URL);

  return this.http.delete(URL, {
    headers: new HttpHeaders().set('x-access-token', accessToken)
  }).pipe(
    catchError(this.handleError)
  );
}
deleteweighmentFile(id: any,Bid:any) {
 let token = this.authservice.getCurrentuser();
  let accessToken = token.accessToken;
const URL = this.hostmobile + 'bookingExports/weighmentFile/'+id+'/'+Bid;
  console.log("🔵 Final API URL:", URL);

  return this.http.delete(URL, {
    headers: new HttpHeaders().set('x-access-token', accessToken)
  }).pipe(
    catchError(this.handleError)
  );
}
deleteContainerFile(id: any,Bid:any) {
  let token = this.authservice.getCurrentuser();
  let accessToken = token.accessToken;
const URL = this.hostmobile + 'bookingExports/deleteContainerFile/'+id+'/'+Bid;
  console.log("🔵 Final API URL:", URL);

  return this.http.delete(URL, {
    headers: new HttpHeaders().set('x-access-token', accessToken)
  }).pipe(
    catchError(this.handleError)
  );
}

deletedeliveryFile(id: any,Bid:any) {
  let token = this.authservice.getCurrentuser();
  let accessToken = token.accessToken;
const URL = this.hostmobile + 'Importbookings/delivery/'+id+'/'+Bid;
  console.log("🔵 Final API URL:", URL);

  return this.http.delete(URL, {
    headers: new HttpHeaders().set('x-access-token', accessToken)
  }).pipe(
    catchError(this.handleError)
  );
}
deletepodFile(id: any,Bid:any) {
  let token = this.authservice.getCurrentuser();
  let accessToken = token.accessToken;
const URL = this.hostmobile + 'Importbookings/pod/'+id+'/'+Bid;
  console.log("🔵 Final API URL:", URL);

  return this.http.delete(URL, {
    headers: new HttpHeaders().set('x-access-token', accessToken)
  }).pipe(
    catchError(this.handleError)
  );
}
deletebillFile(id: any,Bid:any) {
  let token = this.authservice.getCurrentuser();
  let accessToken = token.accessToken;
const URL = this.hostmobile + 'Importbookings/bill/'+id+'/'+Bid;
  console.log("🔵 Final API URL:", URL);

  return this.http.delete(URL, {
    headers: new HttpHeaders().set('x-access-token', accessToken)
  }).pipe(
    catchError(this.handleError)
  );
}
deleteeirFiles(id: any,Bid:any) {
  let token = this.authservice.getCurrentuser();
  let accessToken = token.accessToken;
const URL = this.hostmobile + 'Importbookings/container/'+id+'/'+Bid;
  console.log("🔵 Final API URL:", URL);

  return this.http.delete(URL, {
    headers: new HttpHeaders().set('x-access-token', accessToken)
  }).pipe(
    catchError(this.handleError)
  );
}
deleteshipingFile(id: any,Bid:any) {
  let token = this.authservice.getCurrentuser();
  let accessToken = token.accessToken;
const URL = this.hostmobile + 'Importbookings/shipping/'+id+'/'+Bid;
  console.log("🔵 Final API URL:", URL);

  return this.http.delete(URL, {
    headers: new HttpHeaders().set('x-access-token', accessToken)
  }).pipe(
    catchError(this.handleError)
  );
}
  }
   
      
