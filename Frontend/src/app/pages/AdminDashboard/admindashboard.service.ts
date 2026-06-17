import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HeadersService } from 'src/app/service/Headers';

@Injectable({
    providedIn: 'root'
})
export class AdminDashboardServices {
    getHeader: any;
    handleError: any;
    private host = environment.APIEndpoint;
    constructor(private http: HttpClient, private HeadersService: HeadersService) {
        this.getHeader = this.HeadersService.getHeaders();
    }
    getClientmonthwise() {
        const URL = this.host + 'AdminDashboard/getclientcount/';
        return this.http.get(URL, { headers: this.HeadersService.getHeaders() })
            .pipe(catchError(this.HeadersService.handleError));
    }

    getClientsCount(){
         const URL = this.host + 'AdminDashboard/getclienttotalcount/';
        return this.http.get(URL, { headers: this.HeadersService.getHeaders() })
            .pipe(catchError(this.HeadersService.handleError));
    }

    getActiveclients(){
         const URL = this.host + 'AdminDashboard/getactiveclients/';
        return this.http.get(URL, { headers: this.HeadersService.getHeaders() })
            .pipe(catchError(this.HeadersService.handleError));
    }

}