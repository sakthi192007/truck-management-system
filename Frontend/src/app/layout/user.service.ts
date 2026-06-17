import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usernameSource = new BehaviorSubject<string | null>(null);
  currentUsername = this.usernameSource.asObservable();

  private profileImageSource = new BehaviorSubject<string>(
    localStorage.getItem('profileImage') || 'assets/default-profile.png'
  );
  currentProfileImage = this.profileImageSource.asObservable();

  updateProfileImage(newImageUrl: string) {
    this.profileImageSource.next(newImageUrl);
    localStorage.setItem('profileImage', newImageUrl);
  }
  
  setUsername(username: string) {
    this.usernameSource.next(username);
  }

  clearUsername() {
    this.usernameSource.next(null);
  }
}
