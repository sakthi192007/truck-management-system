import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { UrlSegment } from '@angular/router';
import { TokenService } from 'src/app/service/accessToken';
import { ApiService } from 'src/app/service/apiservice'; 
import { AuthService } from 'src/app/service/auth.service'; 
import { HeadersService } from 'src/app/service/Headers';
// import { url } from 'inspector';
@Injectable({
  providedIn: 'root'
})
export class CampaignmasterService{
    private host = environment.APIEndpoint;
     constructor(private authservice: AuthService, private http: HttpClient, private tokenService: TokenService, private HeadersService: HeadersService) {
     }


  //vendordropdown
  dropdowngetvendor(){
    const URL = this.host + 'campaignmaster/getvendordata/';
    return this.http.get(URL, { headers: this.HeadersService.getHeaders() })
      .pipe(catchError(this.HeadersService.handleError));
  }
  insertcampaign(value:any){
    const URL = this.host + 'campaignmaster/';
 return this.http.post(URL, value, { headers: this.HeadersService.getHeaders() })
      .pipe(catchError(this.HeadersService.handleError));
  }

  insertcampaignitems(value:any){
    const URL = this.host + 'campaignmaster/items';
  return this.http.post(URL, value, { headers: this.HeadersService.getHeaders() })
      .pipe(catchError(this.HeadersService.handleError));
  }

  campaigngrid(){
    const URL = this.host +'campaignmaster/campaigngrid';
   return this.http.get(URL, { headers: this.HeadersService.getHeaders() })
      .pipe(catchError(this.HeadersService.handleError));
  }
  vendorcampaigngrid(id:any,value:any){
    const URL = this.host + 'campaignmaster/vendorcampaigndata/'+id+'/'+value;
   return this.http.get(URL, { headers: this.HeadersService.getHeaders() })
      .pipe(catchError(this.HeadersService.handleError));
  }
  PushtheWhatsapp(id:any){
    const URL = this.host + 'campaignmaster/Pushwhatsapp/'+id;
      return this.http.get(URL, { headers: this.HeadersService.getHeaders() })
      .pipe(catchError(this.HeadersService.handleError));
  }
  getvendor(id:any){
    const URL = this.host + 'campaignmaster/getvalue/'+id;
     return this.http.get(URL, { headers: this.HeadersService.getHeaders() })
      .pipe(catchError(this.HeadersService.handleError));
  }
  updatecampaign(data:any,id:any){
    const URL = this.host + 'campaignmaster/update/' + id;
      return this.http.put(URL, data, { headers: this.HeadersService.getHeaders() })
      .pipe(catchError(this.HeadersService.handleError));
  }
  updatecampaignitems(data:any,id:any){
    const URL = this.host + 'campaignmaster/updateItems/' + id;
    return this.http.put(URL, data, { headers: this.HeadersService.getHeaders() })
      .pipe(catchError(this.HeadersService.handleError));
  }
}