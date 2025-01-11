import { Injectable } from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {catchError, Observable, throwError} from "rxjs";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private router: Router) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const storedToken = localStorage.getItem('auth_app_token');

    // Parse the token if it exists and extract the 'actual_token' from the object
    if (storedToken) {
      const tokenObj = JSON.parse(storedToken); // Parse the JSON string
      const actualToken = tokenObj?.value; // Extract the 'value' field

      if (actualToken) {
        // Clone the request and add the token to the Authorization header
        const clonedRequest = req.clone({
          setHeaders: {
            Authorization: `Bearer ${actualToken}`,
          }
        });

        return next.handle(clonedRequest).pipe(
          catchError((error: HttpErrorResponse) => {
            // Check if the error is a 401 Unauthorized
            if (error.status === 401 || error.status === 403) {
              // Token is invalid or expired. Perform logout and navigate to login
              this.handleUnauthorized();
            }
            return throwError(error);
          })
        );
    } }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 || error.status === 403) {
          this.handleUnauthorized();
        }
        return throwError(error);
      })
    );
  }

  private handleUnauthorized() {
    // Clear the local storage
    localStorage.removeItem('auth_app_token');

    // Navigate to the login page
    this.router.navigate(['/auth/login']);
  }
}
