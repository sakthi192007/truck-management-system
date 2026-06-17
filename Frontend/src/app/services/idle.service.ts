import { Injectable, NgZone } from '@angular/core';
import { fromEvent, merge, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { all_api_service } from 'src/app/service/all_api_service';
import { Router } from '@angular/router';
@Injectable({ providedIn: 'root' })


export class IdleService {
  private idleTime = 30 * 60 * 1000; // 5 minutes
  private idleStatus$ = new Subject<boolean>();
  private idleTimer: any;
  private lastActivityTime = Date.now();

accesstoken:any;
refreshtoken:any;

  constructor(private APIServies: all_api_service,private ngZone: NgZone,private router: Router) {
    

     if (this.router.url == '/' || this.router.url == '/Login' || this.router.url == '/Logout' || this.router.url == '/CampaignChat'
      || this.router.url == '/ForgotPassword' || this.router.url == '/LinkExpired' || this.router.url == '/ResetPassword' || this.router.url == '/verifyotp') {
    }else{

    
    this.startWatching();
    }

  
  }

  get idleStatus() {
    return this.idleStatus$.asObservable();
  }

  public reset(): void {
    this.lastActivityTime = Date.now();
    this.idleStatus$.next(false);
    clearTimeout(this.idleTimer);
    this.resetTimer();
  }


  startWatching(): void {
    this.ngZone.runOutsideAngular(() => {
      const activityEvents = merge(
        // fromEvent(window, 'mousemove').pipe(tap(() => console.log('Mouse Move'))),
        fromEvent(window, 'click').pipe(tap(() => console.log('Click'))),
        fromEvent(window, 'keydown').pipe(tap(() => console.log('Key Down'))),
        fromEvent(window, 'scroll').pipe(tap(() => console.log('Scroll')))
      );

      activityEvents.subscribe(() => {
  const now = Date.now();
  const wasIdle = now - this.lastActivityTime >= this.idleTime;
  this.lastActivityTime = now;
  this.resetTimer();

  const userId = sessionStorage.getItem('id');

  if (userId) {

    this.APIServies.setUserIdleStatus(userId, false).subscribe({
      next: (data: any) => {
         this.accesstoken = data['accessToken'];
         this.refreshtoken = data['refreshToken'];
         
           sessionStorage.removeItem('accessToken');
           sessionStorage.removeItem('refreshToken');

           sessionStorage.setItem('accessToken', this.accesstoken);
           sessionStorage.setItem('refreshToken', this.refreshtoken);
      },
      error: (err: any) => {
        console.error('Idle sync failed', err);
      }
    });
  }
});
      
      this.resetTimer();
    });
  }

  private resetTimer(): void {
    clearTimeout(this.idleTimer);
    this.idleTimer = setTimeout(() => {
      const now = Date.now();
      const diff = now - this.lastActivityTime;
      if (diff >= this.idleTime) {
        this.ngZone.run(() => {
          console.log('Idle Detected');
          this.idleStatus$.next(true);
        });
      } else {
        this.resetTimer();
      }
    }, this.idleTime);
  }
}
