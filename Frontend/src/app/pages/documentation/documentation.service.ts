import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HeadersService } from 'src/app/service/Headers';

@Injectable({
  providedIn: 'root',
})
export class PODService {

 getHeader:any;
 handleError:any;

  private host = environment.APIEndpoint;
  constructor(private http: HttpClient,private HeadersService: HeadersService) {
  this.getHeader = this.HeadersService.getHeaders();
  this.handleError = this.HeadersService.handleError;
  }

  insertPOD(value: any,id:any) {
    const URL = this.host + 'pod/'+id;
    return this.http.post(URL,value, { headers: this.getHeader })
    .pipe(catchError(this.handleError));
  }

  generatePDF(data: any) {
    const URL = this.host + 'pdf/generate-pdf';
    return this.http.post(URL,data, { headers: this.getHeader })
    .pipe(catchError(this.handleError));
  }
  generate_PDF(id: any) {

     const URL = this.host + 'pdf/getall/'+id;
    return this.http.get(URL, { headers: this.HeadersService.getHeaders() })
      .pipe(catchError(this.HeadersService.handleError));

    
  }

  getHost(): string {
    return this.host;
  }

  podgrid(id:any){
    const URL = this.host + 'pod/getall/'+id;
    return this.http.get(URL, { headers: this.HeadersService.getHeaders() })
      .pipe(catchError(this.HeadersService.handleError));
  }
  getbooking(id:any){
    const URL = this.host + 'pod/getalls/Bookings/'+id;
    return this.http.get(URL, { headers: this.HeadersService.getHeaders() })
      .pipe(catchError(this.HeadersService.handleError));
  }
  
  getBookingDetails(bookingNumber: string) {
  const URL = this.host + 'pod/booking/' + bookingNumber;
  return this.http.get(URL, { headers: this.HeadersService.getHeaders() })
    .pipe(catchError(this.HeadersService.handleError));
}

}
