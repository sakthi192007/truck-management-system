import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HeadersService } from 'src/app/service/Headers';

@Injectable({
  providedIn: 'root'
})
export class BookingallocationService {
  getHeader: any;
  handleError: any;
  private host = environment.APIEndpoint;
  constructor(private http: HttpClient, private HeadersService: HeadersService) {
    this.getHeader = this.HeadersService.getHeaders();

  }
  dropdowngetvendor() {
    const URL = this.host + 'bookingallocation/getvendordata/';
    return this.http.get(URL, { headers: this.HeadersService.getHeaders() })
      .pipe(catchError(this.HeadersService.handleError));
  }
  dropdowngetcompany() {
    const URL = this.host + 'bookingallocation/getcompanydata/';
    return this.http.get(URL, { headers: this.HeadersService.getHeaders() })
      .pipe(catchError(this.HeadersService.handleError));
  }

  dropbookingnumbers(id: any) {
    const URL = this.host + 'bookingallocation/getbookingnumber/' + id + '/';
    return this.http.get(URL, { headers: this.HeadersService.getHeaders() })
      .pipe(catchError(this.HeadersService.handleError));
  }
  insertallocation(value: any) {
    const URL = this.host + 'bookingallocation/bookingdata/';
    return this.http.post(URL, value, { headers: this.HeadersService.getHeaders() })
      .pipe(catchError(this.HeadersService.handleError));
  }

  updateallocation(id: any, value: any) {
    const URL = this.host + 'bookingallocation/update/' + id;
    return this.http.put(URL, value, { headers: this.HeadersService.getHeaders() })
      .pipe(catchError(this.HeadersService.handleError));
  }
  allocationgrid(id:any,role:any) {
    const URL = this.host + 'bookingallocation/allocationgrid/'+ id+'/'+ role;
    return this.http.get(URL, { headers: this.HeadersService.getHeaders() })
      .pipe(catchError(this.HeadersService.handleError));
  }

  getallocationgrid(id: any) {
    const URL = this.host + 'bookingallocation/Getupdate/' + id;
    return this.http.get(URL, { headers: this.HeadersService.getHeaders() })
      .pipe(catchError(this.HeadersService.handleError));
  }
}