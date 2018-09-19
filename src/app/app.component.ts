import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { LoginserviceService } from "./midlewares/login-service.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  isLoggedIn : boolean;
  isInitial : boolean;

  constructor(private router: Router, private loginservice: LoginserviceService) { }
  ngOnInit() {
    const loginDetails = JSON.parse(localStorage.getItem('currentUser'));
    const referrer = document.referrer;
    this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        let urlSlice = e.url.toString().substr(0, 10);
        let urlRedirectsSlice = e.urlAfterRedirects.toString().substr(0, 10);
        if ((urlSlice.indexOf('login') !== -1) || (urlRedirectsSlice.indexOf('login') !== -1) ){
         if(window.location.pathname == "/voicxsplash"){
           this.isInitial = true;
           this.isLoggedIn = undefined;
           console.log("Here1");
         }else{
            this.isLoggedIn = false;
         }
        }
        else {
         if(window.location.pathname == "/voicxsplash"){
          this.isInitial = true;
          this.isLoggedIn = undefined;
          console.log("Here2");
        }else{
          this.isLoggedIn = true;
        }
        }
      }
    });
   if(window.location.pathname == "/voicxsplash"){
    //do nothing
   }else{
     this.loginservice.routesChecking(loginDetails, this.router);
   }
  }
}
