import {Injectable, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {NbTokenPack} from "@nebular/auth";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isAuthenticated = false;
  private readonly authSecretKey = 'auth_app_token';
  private user: any = null;

  constructor(private router: Router) {
    this.isAuthenticated = !!localStorage.getItem(this.authSecretKey);
    this.loadCurrentUser();
  }

  getUserId(): number {
    return this.user?.id
  }

  getToken(): string | null {
    const storedToken: string | null = localStorage.getItem('auth_app_token');
    if (!storedToken) {
      return null;
    }

    const tokenObj: NbTokenPack = JSON.parse(storedToken);
    return tokenObj?.value;
  }

  loadCurrentUser(): void {
    const token = localStorage.getItem(this.authSecretKey);
    if (token && !this.isTokenExpired(token)) {
      const payload = this.decodeToken(token);
      this.user = payload; // Assuming user data is stored in the token's payload
    } else {
      this.user = null;
      localStorage.removeItem(this.authSecretKey); // Remove expired token
    }
  }

  isAuthenticatedUser(): boolean {
    return this.isAuthenticated;
  }



  isAdmin(): boolean {
    this.loadCurrentUser();
    return this.user?.roles?.includes('ADMIN'); // Check if roles include 'ADMIN'
  }

  getCurrentUser(): any {
    this.loadCurrentUser();
    return this.user;
  }

  logout() {
    // Perform logout logic, like clearing the token or session data
    localStorage.removeItem(this.authSecretKey);
    this.router.navigate(['/auth/login']);
  }

  private decodeToken(token: string): any {
    try {
      const payloadBase64 = token.split('.')[1]; // Decode the payload
      const payload = decodeURIComponent(
        atob(payloadBase64)
          .split('')
          .map((char) => '%' + char.charCodeAt(0).toString(16).padStart(2, '0'))
          .join('')
      );
      return JSON.parse(payload); // Convert payload into a JSON object
    } catch (e) {
      console.error('Error decoding token', e);
      return null;
    }
  }

  private isTokenExpired(token: string): boolean {
    const payload = this.decodeToken(token);
    if (!payload || !payload.exp) {
      return true; // Invalid or missing `exp` field
    }
    const expiryDate = payload.exp * 1000; // `exp` is in seconds, convert to milliseconds
    return Date.now() > expiryDate;
  }

}
