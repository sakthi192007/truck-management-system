

import { HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { TokenService } from './accessToken';

@Injectable({
  providedIn: 'root'
})
export class HeadersService {
  accessToken: any;

  constructor(private tokenService: TokenService) {}
  getHeader(): HttpHeaders { return new HttpHeaders({ 'Content-Type': 'application/json', }); }
 getHeaders(): HttpHeaders {
  this.accessToken = this.tokenService.get_toke();
  return new HttpHeaders({'Content-Type': 'application/json','x-access-token': this.accessToken});}
      handleError(error: HttpErrorResponse): Observable<any> {
        let errorMessage = 'Unknown error occurred';
        if (error.error instanceof ErrorEvent) {
          errorMessage = `Error: ${error.error.message}`;
        } else {
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        console.error(errorMessage);
        return throwError(errorMessage);
      }
      
}
