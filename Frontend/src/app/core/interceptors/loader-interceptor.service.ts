import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoaderService } from '../../service/loader.service';
import { NotificationService } from 'src/app/service/notification.service';

@Injectable()
export class MyInterceptor implements HttpInterceptor {
  private requests: HttpRequest<any>[] = [];

  constructor(
    private loaderService: LoaderService,
    private notifyService: NotificationService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.requests.push(req);
    this.loaderService.isLoading.next(true);

    return new Observable<HttpEvent<any>>(observer => {
      const subscription = next.handle(req).subscribe(
        event => {
          if (event instanceof HttpResponse) {
            this.removeRequest(req);
            observer.next(event);
          }
        },
        (error: HttpErrorResponse) => {
          this.removeRequest(req);

          // Log error to console
          console.error('API Request Error:', {
            url: req.url,
            status: error.status,
            message: error.message,
            error: error.error
          });

          // Show user-friendly error message
          const errorMessage = this.getErrorMessage(error);
          this.notifyService.showError(errorMessage, "Infologia Technologies");

          observer.error(error);
        },
        () => {
          this.removeRequest(req);
          observer.complete();
        }
      );

      // Cancel request if needed
      return () => {
        this.removeRequest(req);
        subscription.unsubscribe();
      };
    });
  }

  private removeRequest(req: HttpRequest<any>) {
    const i = this.requests.indexOf(req);
    if (i >= 0) {
      this.requests.splice(i, 1);
    }
    this.loaderService.isLoading.next(this.requests.length > 0);
  }

  private getErrorMessage(error: HttpErrorResponse): string {
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      return `Client error: ${error.error.message}`;
    } else {
      // Server-side error
      switch (error.status) {
        case 0:
          return 'No response from server (CORS or network error)';
        case 400:
          return 'Bad Request';
        case 401:
          return 'Unauthorized - please login again';
        case 403:
          return 'Forbidden - access denied';
        case 404:
          return 'Not Found - check the API endpoint';
        case 500:
          return 'Internal Server Error';
        default:
          return `Error ${error.status}: ${error.message}`;
      }
    }
  }
}
