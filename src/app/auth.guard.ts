import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './midlewares/auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private auth: AuthService,
    private route: Router) {
  }
  isAccessed: boolean = false;
  
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.auth.isLoggednIn()) {
      const loginDetails = JSON.parse(localStorage.getItem('currentUser'));
      (loginDetails.Role == "VoicX Posts Administrator" && location.pathname == "/userposts") ? this.isAccessed = true : '';
      (loginDetails.Role == "Strategic Reports Administrator" && (location.pathname == "/managementreports" || location.pathname == "/dashboard")) ? this.isAccessed = true : '';
      (loginDetails.Role == "User and User Profile Administrator" && (location.pathname == "/user" || location.pathname == "/campaignuser")) ? this.isAccessed = true : '';
      if (this.isAccessed) {
        return true;
      }else if(loginDetails.Role == "Master Administrator"){
        return true;
      } else {
        return false;
      }
    } else {
      this.route.navigate(["login"]);
      return false;
    }
  }
}
