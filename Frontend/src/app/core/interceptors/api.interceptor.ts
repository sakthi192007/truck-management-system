import { HttpEvent, HttpHandler, HttpInterceptor, HttpResponse, HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, catchError, finalize } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { AuthService } from '../../service/auth.service';

@Injectable({
    providedIn: 'root'
})
export class APIInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthService) { }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let contentType = 'application/json';
        let accept=  'application/json';
        const currentUser = this.authenticationService.getCurrentuser();
        if (currentUser) {
            if (req.body instanceof FormData) {
                // we are sending a file here
                contentType = 'multipart/form-data';
              }
            const reqheader = req.clone({
                setHeaders: {
                    //'username': obj.RowGuid,
                    'x-access-token': `${currentUser.accessToken}`
                }
            });
            return next.handle(reqheader);
        } else {
            return next.handle(req);
        }
    }
}
