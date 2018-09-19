import { Injectable, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { WindowService } from './window.service';
import { adminusers } from './masteradmin.module';
import { AuthService } from './auth.service';
import { ToastrService } from 'ngx-toastr';
import { Type, ArrayType } from '@angular/compiler/src/output/output_ast';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { AngularFireAuth } from '../../../node_modules/angularfire2/auth';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';


@Injectable({
  providedIn: 'root'
})
export class LoginserviceService {
  private saveUsername: boolean = true;
  adminloginForm: FormGroup;
  masteradminlist: adminusers[];
  windowRef: any;
  authState: any = null;
  verifyResponse: any[] = [];
  isSuccess: boolean = false;
  loginUserName: String;
  loginUserRole: String;
  loginStatus: boolean = false;

  logincountClicks = 0;

  // Observable string sources
  private componentMethodCallSource = new Subject<any>();

  // Observable string streams
  componentMethodCalled$ = this.componentMethodCallSource.asObservable();

  constructor(private authservice: AuthService, private win: WindowService, private tostr: ToastrService,  private afAuth: AngularFireAuth, private firebase: AngularFireDatabase) { 
  }

  phoneLogin(form) {
    let ischecked = form.saveUsername;
    let formValues = form, appVerifier;
    console.log('form', form);
    this.windowRef = this.win.windowRef
    this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
      'size': 'invisible',
      'callback': function (response) { },
      'expired-callback': function () { }
    });
    this.windowRef.recaptchaVerifier.render()
    appVerifier = this.windowRef.recaptchaVerifier;

    var x = this.authservice.getData();
    x.snapshotChanges().subscribe(item => {
      this.masteradminlist = [];
      item.forEach(element => {
        var y = element.payload.toJSON();
        y["$key"] = element.key;
        this.masteradminlist.push(y as adminusers);
      });
      this.getLoginDetails(formValues, this.masteradminlist, appVerifier);
    });
    return this.verifyResponse;
  }

  async getLoginDetails(formValues, masteradminlist, appVerifier) {
    let empData, result;
    let phoneNumber, decodedString, err;
    empData = masteradminlist;

    var loginData;
    loginData = masteradminlist;
    console.log('loginData', loginData);

    empData.forEach(result => {
      if (formValues.value.email == result.EmailId) {
        decodedString = atob(result.Password);
        console.log(decodedString);
        this.loginUserName = result.EmailId;
      }
      if ((formValues.value.email == result.EmailId)
        && (formValues.value.password == decodedString)) {
        phoneNumber = result.Phone;
        this.loginUserRole = result.Role;;
        console.log('phoneNumber$', phoneNumber);
      }
    });
    if (phoneNumber.length > 0 && this.logincountClicks == 0) {
      firebase.auth().settings.appVerificationDisabledForTesting = true;
      this.logincountClicks++;
      await firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier)
        .then(result => {
          this.windowRef.confirmationResult = result;
          this.authState = result;
          this.verifyResponse.push(result);
          this.isSuccess = true;
          this.componentMethodCallSource.next();
          err = false;
          console.log("Successfully logged in");
        })
        .catch(error => {
          this.logincountClicks = 0;
          this.verifyResponse.push(error);
          err = true;
          this.tostr.error(this.verifyResponse[0].message);
        });
      if (err) {
        //do nothing
      } else {
        localStorage.setItem('currentUser', JSON.stringify({ token: "jwt will come later", username: this.loginUserName, Role: this.loginUserRole }));
        this.tostr.success('Sucessfully sent verification code.');
        console.log('VERIFICATION ID', this.verifyResponse[0].verificationId);
      }
    }
  }

  currentUser() {
    return JSON.parse(localStorage.getItem('currentUser'));
  }

  routesChecking(loginDetails, router) {debugger;
    if (loginDetails && loginDetails.Role == "VoicX Posts Administrator" && localStorage.getItem('login') == "true") {
      if ((window.location.pathname.indexOf('/userposts') == -1)) {
        router.navigate(["userposts"]);
      }
    } else {
      router.navigate(["login"]);
    }

    if (loginDetails && loginDetails.Role == "Strategic Reports Administrator" && localStorage.getItem('login') == "true") {
      if ((window.location.pathname.indexOf('/managementreports') == -1) && (window.location.pathname.indexOf('/dashboard') == -1)) {
        router.navigate(["dashboard"]);
      } else if ((window.location.pathname.indexOf('/managementreports') == 0)) {
        router.navigate(["managementreports"]);
      } else if ((window.location.pathname.indexOf('/dashboard') == 0)) {
        router.navigate(["dashboard"]);
      }
    } else {
      router.navigate(["login"]);
    }


    if (loginDetails && loginDetails.Role == "User and User Profile Administrator" && localStorage.getItem('login') == "true") {
      if ((window.location.pathname.indexOf('/campaignuser') == -1) && (window.location.pathname.indexOf('/user') == -1)) {
        router.navigate(["user"]);
      } else if ((window.location.pathname.indexOf('/campaignuser') == 0)) {
        router.navigate(["campaignuser"]);
      } else if ((window.location.pathname.indexOf('/user') == 0)) {
        router.navigate(["user"]);
      }
    } else {
      router.navigate(["login"]);
    }

    if (loginDetails && loginDetails.Role == "Master Administrator" && localStorage.getItem('login') == "true") {
      if ((window.location.pathname.indexOf('/login') == 0)) {
        router.navigate(["dashboard"]);
      } else if ((window.location.pathname.indexOf('/campaignuser') == 0)) {
        router.navigate(["campaignuser"]);
      } else if ((window.location.pathname.indexOf('/user') == 0) && (window.location.pathname.endsWith("user"))) {
        router.navigate(["user"]);
      } else if ((window.location.pathname.indexOf('/managementreports') == 0)) {
        router.navigate(["managementreports"]);
      } else if ((window.location.pathname.indexOf('/dashboard') == 0)) {
        router.navigate(["dashboard"]);
      } else if ((window.location.pathname.indexOf('/voicofthepeople2018/admin') == 0)) {
        router.navigate(["voicofthepeople2018/admin"]);
      } else if ((window.location.pathname.indexOf('/categories') == 0)) {
        router.navigate(["categories"]);
      } else if ((window.location.pathname.indexOf('/backgroundjobs') == 0)) {
        router.navigate(["backgroundjobs"]);
      } else if ((window.location.pathname.indexOf('/durations') == 0)) {
        router.navigate(["durations"]);
      } 
      else if ((window.location.pathname.indexOf('/generalsettings') == 0)) {
        router.navigate(["generalsettings"]); 
      }
      else if ((window.location.pathname.indexOf('/userposts') == 0) && (window.location.pathname.endsWith("posts"))) {
        router.navigate(["userposts"]);
      }
    } else {
      router.navigate(["login"]);
    }
  }

  clearLogin(){
      this.afAuth.auth.signOut().then(function(){
        localStorage.removeItem('currentUser');
        var user = JSON.parse(localStorage.getItem('currentUser'));
        console.log("KKKKKKL");
      });
  }


}
