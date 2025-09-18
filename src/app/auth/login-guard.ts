import { CanActivate, CanActivateFn, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from './auth-service';

@Injectable({
  providedIn: 'root'
})

export class LoginGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}
  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/home']);
      return false;
    } else {
      return true;
    }
  }
  
}
