import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HeadersService } from '../service/Headers';

@Injectable({
  providedIn: 'root'
})

export class CampaigntextService {
getHeader:any;
handleError:any;
  private host = environment.APIEndpoint;
  constructor(private http: HttpClient,private HeadersService:HeadersService) {
      this.getHeader=this.HeadersService.getHeaders();
      this.handleError=this.HeadersService.handleError;
  }

  
  
  insertComments(value: any) {
    const URL = this.host + 'campaigncomment/commentcreation';
    return this.http.post(URL, value, { headers: this.getHeader() })
      .pipe(catchError(this.handleError));
  }

  getComments(id: any) {
    const URL = this.host + 'campaigncomment/' + id;
    return this.http.get(URL, { headers: this.getHeader() })
      .pipe(catchError(this.handleError));
  }

}