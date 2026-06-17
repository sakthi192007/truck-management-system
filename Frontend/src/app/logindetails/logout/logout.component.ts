import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('refreshToken');
      sessionStorage.removeItem('id');
      sessionStorage.removeItem('User_Roleid');
      sessionStorage.removeItem('CompanyName');
      sessionStorage.removeItem('Image');
      sessionStorage.removeItem('currentUser');

  }


}
