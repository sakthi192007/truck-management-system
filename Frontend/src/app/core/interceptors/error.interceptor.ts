import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { EMPTY, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../../service/auth.service';
import { Router } from "@angular/router";
import { NotificationService } from 'src/app/service/notification.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    validate!: boolean;

    constructor(private authService: AuthService, private router: Router,private notifyService : NotificationService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
            catchError(err => {
                console.log(err);
                
                if (err.status === 401) {
    let error = (err.error && (err.error.response_message || err.error.message)) || '';
    var matches = error.match(/created|exits|haveing|exist|having|OTP|Invalid|wrong|previous/g);

    if (matches == null) {
        this.notifyService.showError("Session Timed Out! Please Login", "Infologia Technologies");
        sessionStorage.clear();
        localStorage.clear();
        this.router.navigateByUrl('/Logout');
        return EMPTY; // Return an empty observable
    } else {
        this.notifyService.showError("Something went wrong", "Infologia Technologies");
        location.reload();
        return EMPTY; // Return an empty observable
    }
}

                if (err.status === 401) {
                    let error = err.error.response_message || err.error.message;
                    var str = error;
                    var matches = str.match(/created|exits|haveing|exist|having|OTP|Invalid|wrong|previous/g);
                    if (matches == null) {
                        this.notifyService.showError("Session Timed Out! Please Login", "Infologia Technologies");
                        sessionStorage.clear();
                        localStorage.clear();
                        this.router.navigateByUrl('/Logout');
                        return EMPTY; // Return an empty observable
                    } else {
                        this.notifyService.showError("Something went to wrong", "Infologia Technologies");
                        location.reload();
                        return EMPTY; // Return an empty observable
                    }
                } else if (err.status === 403) {
                    this.notifyService.showError("Your credentials are wrong..!!", "Infologia Technologies");
                    return EMPTY; // Return an empty observable
                } else if (err.status === 404) {
                    this.notifyService.showError("User/data not found..!!", "Infologia Technologies");
                    sessionStorage.clear();
                    localStorage.clear();
                    this.router.navigateByUrl('/Logout');
                    return EMPTY; // Return an empty observable
                } else if (err.status === 400) {
                    let error = err.error.response_message || err.error.message;
                    var str = error;
                    var matches = str.match(/created|exits|haveing|exist|having|previous/g);
                    if (matches == null) {
                        this.validate = true;
                        if (this.validate) {
                            this.validate = false;
                            this.notifyService.showError("Session Timed Out! Please Login", "Infologia Technologies");
                            sessionStorage.clear();
                            localStorage.clear();
                            this.router.navigateByUrl('/Logout');
                            return EMPTY; // Return an empty observable
                        } else {
                            sessionStorage.clear();
                            localStorage.clear();
                            this.router.navigateByUrl('/Logout');
                            return EMPTY; // Return an empty observable
                        }
                    } else {
                        this.notifyService.showError("Something went to wrong", "Infologia Technologies");
                        location.reload();
                        return EMPTY; // Return an empty observable
                    }
                } else if (err.status === 500) {
                    let error = err.error.response_message || err.error.message;
                    this.notifyService.showError("Something went to wrong", "Infologia Technologies");
                    location.reload();
                    return EMPTY; // Return an empty observable
                }

                const error = err.error.response_message || err.response_code || err.error.message;
                console.log(error);
                return throwError(error); // Ensure to return throwError for other errors
            })
        );
    }
}
