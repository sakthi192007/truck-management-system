import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import * as feather from 'feather-icons';
import { BookingService } from 'src/app/pages/bookingmodel/booking.service';
import { NavigationEnd, Router } from '@angular/router';
import { UserService } from '../user.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  username: any;
  isDropdownOpen: boolean = false;
  isDarkMode: boolean = true;
  userId: any;
  role_id: any;
  userdata: any;
  aadhar: any;
  Image: any;
  ClientImages: any;

  @Output() toggle = new EventEmitter<void>();
  userdatadetails: any;
  logoUrl: any;
  role: any;
  CompanyName:any;


  constructor(private APIServies: BookingService, private router: Router, private userService: UserService) {
    //this.aadhar = "../../../assets/images/truck/truck.gif";

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const ProfileImages = sessionStorage.getItem('ProfileImage');
        const img = sessionStorage.getItem('Image');
 this.ClientImages = `${environment.APIEndpoint}ClientImages/${img}`;
 if(ProfileImages ==null || ProfileImages =='null' ){
   this.aadhar = "../../../assets/male.png";
  
 }else{
 this.aadhar = `${environment.APIEndpoint}ProfileImages/${ProfileImages}`;


 }
      
      }
    });

  }


  ngOnInit(): void {
    this.userService.currentUsername.subscribe(name => {
     this.username = sessionStorage.getItem('UserName');
    });
  this.userService.currentProfileImage.subscribe(image => {
      this.aadhar = image;
      
    });
    this.userId = sessionStorage.getItem('id');
    this.role_id = sessionStorage.getItem('User_Roleid');
    this.CompanyName = sessionStorage.getItem('CompanyName');
    this.username = sessionStorage.getItem('UserName');
    this.Image = sessionStorage.getItem('Image');
    this.ClientImages = `${environment.APIEndpoint}ClientImages/` + this.Image;
    this.role = sessionStorage.getItem('User_Roleid');
    feather.replace();

  }

  toggleSidebar() {
    this.userId = sessionStorage.getItem('id');
    this.role_id = sessionStorage.getItem('User_Roleid');
   this.CompanyName = sessionStorage.getItem('CompanyName');
    this.username = sessionStorage.getItem('UserName');
    this.Image = sessionStorage.getItem('Image');
    this.ClientImages = `${environment.APIEndpoint}ClientImages/` + this.Image;
    this.role = sessionStorage.getItem('User_Roleid');
    this.toggle.emit();
  }


  onLogin() {
   
  }
  toggleMode() {
    this.isDarkMode = !this.isDarkMode;
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  toggleMoon() {
    document.body.classList.remove('pace-done', 'sidebar-enable');
  }






}
