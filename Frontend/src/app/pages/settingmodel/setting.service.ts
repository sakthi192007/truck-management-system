import { Injectable } from '@angular/core';
import { HttpClient ,HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { TokenService } from 'src/app/service/accessToken';
import { AuthService } from 'src/app/service/auth.service';
import { HeadersService } from 'src/app/service/Headers';

@Injectable({
  providedIn: 'root'
})
export class SettingService {
  private host = environment.APIEndpoint;
  constructor(private authservice: AuthService, private http: HttpClient, private tokenService: TokenService, private HeadersService: HeadersService) {
  }

  gridgetuser(id: any, role: any) {

    const URL = this.host + 'userdetails/gridvalues/' + id + '/' + role;
    return this.http.get(URL, { headers: this.HeadersService.getHeaders() })
      .pipe(catchError(this.HeadersService.handleError));
  }
  GetUserdetails(id: any) {

    const URL = this.host + 'userdetails/Usergetupdate/' + id;
    return this.http.get(URL, { headers: this.HeadersService.getHeaders() })
      .pipe(catchError(this.HeadersService.handleError));
  }



  deleteuser(id: any) {


    const URL = this.host + 'userdetails/user/' + id;
    return this.http.delete(URL, { headers: this.HeadersService.getHeaders() })
      .pipe(catchError(this.HeadersService.handleError));
  }

  insertuserdetails(value: any) {


    const URL = this.host + 'userdetails/user';
    return this.http.post(URL, value, { headers: this.HeadersService.getHeaders() })
      .pipe(catchError(this.HeadersService.handleError));
  }

  Updateuserdetails(id: any, value: any) {

    const URL = this.host + 'userdetails/userupdate/' + id;
    return this.http.put(URL, value, { headers: this.HeadersService.getHeaders() })
      .pipe(catchError(this.HeadersService.handleError));

  }
  getrollname(id: any) {
    const URL = this.host + 'userdetails/getrollname/' + id;
    return this.http.get(URL, { headers: this.HeadersService.getHeaders() })
      .pipe(catchError(this.HeadersService.handleError));
  }
  //get
  getProfile(id: any): Observable<any> {

    const URL = this.host + 'profile/get/' + id;
    return this.http.get(URL, { headers: this.HeadersService.getHeaders() })
      .pipe(catchError(this.HeadersService.handleError));
  }

  //parentmenu
  insertparentmenu(value: any) {

    const URL = this.host + 'menudetails/parentmenu/post';
    return this.http.post(URL, value, { headers: this.HeadersService.getHeaders() })
      .pipe(catchError(this.HeadersService.handleError));
  }
  getallparentmenu() {
    const URL = this.host + 'menudetails/parentmenu/getall';
    return this.http.get(URL, { headers: this.HeadersService.getHeaders() })
      .pipe(catchError(this.HeadersService.handleError));
  }
  getbyidparentmenu(id: any) {


    const URL = this.host + 'menudetails/parentmenu/' + id;
    return this.http.get(URL, { headers: this.HeadersService.getHeaders() })
      .pipe(catchError(this.HeadersService.handleError));
  }
  deleteparentmenu(id: any) {


    const URL = this.host + 'menudetails/parentmenu/' + id;
    return this.http.delete(URL, { headers: this.HeadersService.getHeaders() })
      .pipe(catchError(this.HeadersService.handleError));
  }

  Updateparentmenu(id: any, value: any) {

    const URL = this.host + 'menudetails/parentmenu/' + id;
    return this.http.put(URL, value, { headers: this.HeadersService.getHeaders() })
      .pipe(catchError(this.HeadersService.handleError));

  }
  //Submenu

  insertsubmenu(value: any) {

    const URL = this.host + 'menudetails/submenu/post';
    return this.http.post(URL, value, { headers: this.HeadersService.getHeaders() })
      .pipe(catchError(this.HeadersService.handleError));
  }
  getallsubmenu() {

    const URL = this.host + 'menudetails/submenu/getall';
    return this.http.get(URL, { headers: this.HeadersService.getHeaders() })
      .pipe(catchError(this.HeadersService.handleError));
  }
  getbyidsubmenu(id: any) {


    const URL = this.host + 'menudetails/submenu/' + id;
    return this.http.get(URL, { headers: this.HeadersService.getHeaders() })
      .pipe(catchError(this.HeadersService.handleError));
  }
  deletesubmenu(id: any) {

    const URL = this.host + 'menudetails/submenu/' + id;
    return this.http.delete(URL, { headers: this.HeadersService.getHeaders() })
      .pipe(catchError(this.HeadersService.handleError));
  }

  Updatesubmenu(id: any, value: any) {
    const URL = this.host + 'menudetails/submenu/' + id;
    return this.http.put(URL, value, { headers: this.HeadersService.getHeaders() })
      .pipe(catchError(this.HeadersService.handleError));
  }
  Loadparentmenu() {

    const URL = this.host + 'menudetails/submenu/loaddropdown';
    return this.http.get(URL, { headers: this.HeadersService.getHeaders() })
      .pipe(catchError(this.HeadersService.handleError));

  }

  //Childmenu

  insertchildmenu(value: any) {

    const URL = this.host + 'menudetails/childmenu/post';
    return this.http.post(URL, value, { headers: this.HeadersService.getHeaders() })
      .pipe(catchError(this.HeadersService.handleError));
  }
  getallchildmenu() {

    const URL = this.host + 'menudetails/childmenu/getall';
    return this.http.get(URL, { headers: this.HeadersService.getHeaders() })
      .pipe(catchError(this.HeadersService.handleError));
  }
  getbyidchildmenu(id: any) {


    const URL = this.host + 'menudetails/childmenu/' + id;
    return this.http.get(URL, { headers: this.HeadersService.getHeaders() })
      .pipe(catchError(this.HeadersService.handleError));
  }
  deletechildmenu(id: any) {

    const URL = this.host + 'menudetails/childmenu/' + id;
    return this.http.delete(URL, { headers: this.HeadersService.getHeaders() })
      .pipe(catchError(this.HeadersService.handleError));
  }

  Updatechildmenu(id: any, value: any) {
    const URL = this.host + 'menudetails/childmenu/' + id;
    return this.http.put(URL, value, { headers: this.HeadersService.getHeaders() })
      .pipe(catchError(this.HeadersService.handleError));
  }
  Loadsubparentmenu(id: any) {

    const URL = this.host + 'menudetails/childmenu/loaddropdown/' + id;
    return this.http.get(URL, { headers: this.HeadersService.getHeaders() })
      .pipe(catchError(this.HeadersService.handleError));

  }

  //load menu for groupmaster checkbox//
  Loadmenuname() {

    const URL = this.host + 'menudetails/loadmenuname';
    return this.http.get(URL, { headers: this.HeadersService.getHeaders() })
      .pipe(catchError(this.HeadersService.handleError));

  }
  //groupmaster

 insertgroupmaster(value: any) {
     
      const URL = this.host +'groupmaster/insert';
      return this.http.post(URL,value, {  headers: this.HeadersService.getHeaders() })
    .pipe(catchError(this.HeadersService.handleError));
    }


  getallgroupmaster() {


    const URL = this.host + 'groupmaster';
    return this.http.get(URL, { headers: this.HeadersService.getHeaders() })
      .pipe(catchError(this.HeadersService.handleError));
  }
  getbyidgroupmaster(id: any) {

    const URL = this.host + 'groupmaster/' + id;
    return this.http.get(URL, { headers: this.HeadersService.getHeaders() })
      .pipe(catchError(this.HeadersService.handleError));
  }
  deletegroupmaster(id: any) {


    const URL = this.host + 'groupmaster/' + id;
    return this.http.delete(URL, { headers: this.HeadersService.getHeaders() })
      .pipe(catchError(this.HeadersService.handleError));
  }

  Updategroupmaster(id: any, value: any) {

    const URL = this.host + 'groupmaster/' + id;
    return this.http.put(URL, value, { headers: this.HeadersService.getHeaders() })
      .pipe(catchError(this.HeadersService.handleError));

  }

  GetRoleupdate(Role: any) {
    const URL = this.host + 'userdetails/getroleupdate/' + Role;
    return this.http.get(URL, { headers: this.HeadersService.getHeaders() })
      .pipe(catchError(this.HeadersService.handleError));
  }
  GetRole(Role: any) {
    const URL = this.host + 'userdetails/getrole/' + Role;
    return this.http.get(URL, { headers: this.HeadersService.getHeaders() })
      .pipe(catchError(this.HeadersService.handleError));
  }
  GetRoles(Role: any) {
    const URL = this.host + 'userdetails/getroles/' + Role;
    return this.http.get(URL, { headers: this.HeadersService.getHeaders() })
      .pipe(catchError(this.HeadersService.handleError));
  }
   Getnamelist(Role: any,User_ID:any) {
    const URL = this.host + 'userdetails/getnamelist/' + Role+'/'+User_ID;
    return this.http.get(URL, { headers: this.HeadersService.getHeaders() })
      .pipe(catchError(this.HeadersService.handleError));
  }
  GetRolemaster(Role: any) {
    const URL = this.host + 'userdetails/getrolemaster/' + Role;
    return this.http.get(URL, { headers: this.HeadersService.getHeaders() })
      .pipe(catchError(this.HeadersService.handleError));
  }
  getdropcompanydetails(Role: any, userId: any) {
    const URL = this.host + 'userdetails/getcompany/' + Role + '/' + userId;
    return this.http.get(URL, { headers: this.HeadersService.getHeaders() })
      .pipe(catchError(this.HeadersService.handleError));
  }
  getbranch(Id: any) {
    const URL = this.host + 'userdetails/getbranch/' + Id;
    return this.http.get(URL, { headers: this.HeadersService.getHeaders() })
      .pipe(catchError(this.HeadersService.handleError));
  }

  insertBranchdetails(value: any) {
    const URL = this.host + 'Branch';
    return this.http.post(URL, value, { headers: this.HeadersService.getHeaders() })
      .pipe(catchError(this.HeadersService.handleError));
  }
  UpdateBranchdetails(value: any, id: any) {
    const URL = this.host + 'Branch/update/' + id;
    return this.http.put(URL, value, { headers: this.HeadersService.getHeaders() })
      .pipe(catchError(this.HeadersService.handleError));

  }
  insertSubAdmindetails(value: any, Name: any, id: any, logo: any) {
    const URL = this.host + 'Branch/Subadmin/' + Name + '/' + id + '/' + logo;
    return this.http.post(URL, value, { headers: this.HeadersService.getHeaders() })
      .pipe(catchError(this.HeadersService.handleError));
  }
  UpdateSubAdmindetails(value: any, Name: any, id: any, logo: any) {
    const URL = this.host + 'Branch/Subadminupdate/' + Name + '/' + id + '/' + logo;
    return this.http.put(URL, value, { headers: this.HeadersService.getHeaders() })
      .pipe(catchError(this.HeadersService.handleError));

  }

  insertUserdetails(value: any, logo: any,companyName:any) {
    const URL = this.host + 'Branch/User/' + logo+'/'+companyName;
    return this.http.post(URL, value, { headers: this.HeadersService.getHeaders() })
      .pipe(catchError(this.HeadersService.handleError));
  }
  UpdateUserdetails(value: any, logo: any,companyName:any) {
    const URL = this.host + 'Branch/Userupdate/' + logo+'/'+companyName;
    return this.http.put(URL, value, { headers: this.HeadersService.getHeaders() })
      .pipe(catchError(this.HeadersService.handleError));

  }

   GetProfile(id:any){
      const URL = this.host + 'userdetails/getprofile/'+id;
      return this.http.get(URL, {  headers: this.HeadersService.getHeaders() })
      .pipe(catchError(this.HeadersService.handleError));
    }
  
    GetProfileimages(id:any){
      const URL = this.host + 'userdetails/getimage/'+id;
      return this.http.get(URL, {  headers: this.HeadersService.getHeaders() })
      .pipe(catchError(this.HeadersService.handleError));
    }
  
   
    profiledetails(value: any, id: any) {
    const URL = this.host + 'userdetails/profile/' + id;
    return this.http.put(URL, value)
      .pipe(catchError(this.HeadersService.handleError));
  }

    accessstatus(id:any,name:any){
      const URL = this.host + 'userdetails/Approval/'+id+'/'+name;
      return this.http.get(URL, {  headers: this.HeadersService.getHeaders() })
      .pipe(catchError(this.HeadersService.handleError));
    }

       checkEmailExists(emailExistsValidator: string) {
      const token = this.authservice.getCurrentuser();
      const accessToken = token.accessToken;
    
      const URL = `${this.host}userdetails/CheckEmailExists?email=${emailExistsValidator}`;
    
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': accessToken
      });
    
      return this.http.get<{ exists: boolean }>(URL, { headers });
    }
}