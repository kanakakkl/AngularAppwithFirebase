import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from "@angular/router";
import { AuthService } from '../../midlewares/auth.service';
import { adminusers } from '../../midlewares/masteradmin.module';
import { LoginPageComponent } from '../login-page/login-page.component';
import { LoginserviceService } from "../../midlewares/login-service.service";

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
  providers: [LoginPageComponent, AuthService]
})
export class NavigationComponent {
  public isAccess: boolean = true;
  public isUserAccess: boolean = true;
  public isUserPostAccess: boolean = true;
  public isStrategicAccess: boolean = true;

  public html: string = '<a href="">Log out</a>';

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  constructor(private breakpointObserver: BreakpointObserver, private router: Router, private auth: AuthService, public logincmp: LoginPageComponent,  private loginservice: LoginserviceService) { }

  ngOnInit() {
      this.permissionsList();
  }

  isActive(viewLocation) {
    var active = (viewLocation === window.location.pathname);
     return active;
  };

  permissionsList() {
    var loginDetails = JSON.parse(localStorage.getItem('currentUser'));
    console.log("*loginDetails*", loginDetails);
    if (loginDetails && loginDetails.Role == "Master Administrator") {
      this.isAccess = true;
      this.isUserAccess = true;
      this.isUserPostAccess = true;
      this.isStrategicAccess = true;
    } else if (loginDetails && loginDetails.Role == "VoicX Posts Administrator") {
      this.isAccess = false;
      this.isUserAccess = false;
      this.isUserPostAccess = true;
      this.isStrategicAccess = false;
    } else if (loginDetails && loginDetails.Role == "Strategic Reports Administrator") {
      this.isAccess = false;
      this.isUserAccess = false;
      this.isUserPostAccess = false;
      this.isStrategicAccess = true;
    } else if (loginDetails && loginDetails.Role == "User and User Profile Administrator") {
      this.isAccess = false;
      this.isUserAccess = true;
      this.isUserPostAccess = false;
      this.isStrategicAccess = false;
    }
  }

  doLogOut() {
    this.logincmp.countClicks = 0;
    this.loginservice.loginStatus = false;
    localStorage.setItem('login', this.loginservice.loginStatus.toString());
    this.auth.doLogOut();
  }
}
