import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  getService(url: any, params?: any) {
    return this.http.get(url, params);
  }

  postService(url: any, data: JSON | FormData | any, params?: any) {
    return this.http.post(url, data, params)
  }

  putService(url: any, data: JSON | FormData | any, params?: any) {
    return this.http.put(url, data, params)
  }

  deleteService(url: any, params?: any) {
    return this.http.request('delete', url, params)
  }


}

