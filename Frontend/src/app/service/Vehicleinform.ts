import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service';

// Vehicle info interface
export interface VehicleInfo {
  VehicleID: number;
  BookingNumber: string;
  TruckNumber: string;
  DriverName: string;
  DriverMobile: string;
  DieselAllowed: string;
  DieselActual: string;
  DieselCost: string;
  status: number | string;   // make sure this exists
  spancolur1?: string;       // <-- add this
  statusname1?: string;
}

// API response wrapper
export interface VehicleApiResponse {
  success: boolean;
  data: VehicleInfo[];
}

@Injectable({
  providedIn: 'root'
})
export class Vehicleinform {

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
  insertVehicleInformation(data: any): Observable<any> {
    const token = this.authservice.getCurrentuser();
    const accessToken = token.accessToken;
    const URL = this.host + 'VehicleInformation/insert';
    return this.http.post(URL, data, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': accessToken
      })
    }).pipe(catchError(this.handleError));
  }

  // Get all vehicle records
  getVehicles(id:any): Observable<VehicleApiResponse> {
    const token = this.authservice.getCurrentuser();
    const accessToken = token.accessToken;
    const URL = this.host + 'VehicleInformation/getAllVehicle/'+id;
    return this.http.get<VehicleApiResponse>(URL, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': accessToken
      })
    }).pipe(catchError(this.handleError));
  }

  // Get vehicle by ID
  getVehicleById(id: number): Observable<any> {
    const token = this.authservice.getCurrentuser();
    const accessToken = token.accessToken;
    const URL = this.host + `VehicleInformation/getVehicleById/${id}`;
    return this.http.get(URL, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': accessToken
      })
    }).pipe(catchError(this.handleError));
  }

updateVehicle(id: number, data: any): Observable<any> {
  const token = this.authservice.getCurrentuser();
  const accessToken = token.accessToken;
  const URL = this.host + `VehicleInformation/updaterecords/${id}`;
  return this.http.put(URL, data, {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'x-access-token': accessToken
    })
  }).pipe(catchError(this.handleError));
}
deleteVehicle(id: number): Observable<any> {
  const token = this.authservice.getCurrentuser();
  const accessToken = token.accessToken;
  const URL = this.host + `VehicleInformation/deletevehiclegrid/${id}`;

  return this.http.put(URL, { status: '1' }, {   
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': accessToken
    }
  });
}




}
