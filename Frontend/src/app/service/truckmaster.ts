import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service';
// Vehicle info interface
export interface Truckmasterinfo {
  TruckID: number;
  BookingNumber: string;
  AssetA_C: string;
  AdvanceA_C: string;
 status: number | string;   // make sure this exists
  spancolur1?: string;       // <-- add this
  statusname1?: string;

}
// API response wrapper
export interface TruckmasterApiResponse {
  success: boolean;
  data: Truckmasterinfo[];
}

@Injectable({
  providedIn: 'root'
})
export class Truckmasterinform {

  private host = environment.APIEndpoint;
  constructor(private authservice: AuthService, private http: HttpClient) {}
  private handleError(error: HttpErrorResponse): Observable<any> {
    let errorMessage = 'Unknown error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
  // Insert new vehicle record
  InsertTruckMasterInformation(data: any): Observable<any> {
    const token = this.authservice.getCurrentuser();
    const accessToken = token.accessToken;
    const URL = this.host + 'VehicleInformation/truckinsert';
    return this.http.post(URL, data, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': accessToken
      })
    }).pipe(catchError(this.handleError));
  }
  // Get all vehicle records
  getTruckmaster(id:any): Observable<TruckmasterApiResponse> {
    const token = this.authservice.getCurrentuser();
    const accessToken = token.accessToken;
    const URL = this.host + 'VehicleInformation/getAllTruck/'+id;
    return this.http.get<TruckmasterApiResponse>(URL, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': accessToken
      })
    }).pipe(catchError(this.handleError));
  }

  // Get vehicle by ID
  GetTruckMasterById(id: number): Observable<any> {
    const token = this.authservice.getCurrentuser();
    const accessToken = token.accessToken;
    const URL = this.host + `VehicleInformation/getTruckById/${id}`;
    return this.http.get(URL, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': accessToken
      })
    }).pipe(catchError(this.handleError));
  }

updateTruckMaster(id: number, data: any): Observable<any> {
  const token = this.authservice.getCurrentuser();
  const accessToken = token.accessToken;
  const URL = this.host + `VehicleInformation/updateTruckRecords/${id}`;
  return this.http.put(URL, data, {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'x-access-token': accessToken
    })
  }).pipe(catchError(this.handleError));
}

deleteTruckmaster(id: number): Observable<any> {
  const token = this.authservice.getCurrentuser();
  const accessToken = token.accessToken;
  const URL = this.host + `VehicleInformation/deleteTruckmastergrid/${id}`;

  return this.http.put(URL, { Status: '1' }, {   
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': accessToken
    }
  });
}





}
