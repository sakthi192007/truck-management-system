import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IdleService } from './services/idle.service';
import { HttpClient } from '@angular/common/http';
declare var $: any; 
 import { all_api_service } from 'src/app/service/all_api_service';
 
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Infologia Technologies';
 
  isSidebarClosed = false;
  isSidebarMobile=false;
 
  
  constructor(private router: Router,
    private idleService: IdleService,
    private http: HttpClient,private APIServies: all_api_service
  ) { }
  public displayLayout(): boolean {
    if (this.router.url == '/' || this.router.url == '/Login' || this.router.url == '/Logout' || this.router.url == '/CampaignChat'
      || this.router.url == '/ForgotPassword' || this.router.url == '/LinkExpired' || this.router.url == '/ResetPassword' || this.router.url == '/verifyotp') {
      return false;
    }
 this.idle();
    return true;
  }
 
  togglemobile() {
    document.body.classList.remove('pace-done', 'sidebar-enable');
  }
 
  toggleSidebar() {
    this.isSidebarClosed = !this.isSidebarClosed;
    if (this.isSidebarClosed) {
      document.body.setAttribute('data-sidebar-size', 'sm');
    } else {
 
      document.body.removeAttribute('data-sidebar-size')
      document.body.classList.add('pace-done', 'sidebar-enable');
 
    }
 
  }
 
 idle(): void {
    this.idleService.idleStatus.subscribe(isIdle => {
      const userId = sessionStorage.getItem('id');
      if (!userId) {
        console.warn('No userId found in sessionStorage');
        return;
      }

      this.APIServies.setUserIdleStatus(userId, isIdle).subscribe({
        next: (data: any) => {
          console.log(`Backend updated: ${isIdle ? 'idle' : 'active'}`, data);

          if (isIdle) {
            const confirmed = confirm("You were idle. Click OK to continue using the app.");
            console.log('User clicked:', confirmed);

            if (confirmed) {
              alert('Would send API now'); 
              this.APIServies.setUserIdleStatus(userId, false).subscribe({
                next: (data: any) => {
                  console.log("User confirmed active again", data);
                  this.idleService.reset(); 
                },
                error: (err: any) => console.error('Error on reactivation', err)
              });
            } else {
              console.log("Cancel clicked - logging out...");
              sessionStorage.clear();
              this.router.navigate(['/Login']);
            }
          }
        },
        error: (err: any) => {
          console.error('Initial idle state update failed', err);
        }
      });
    });
  }
}
 
 