import { Component, OnInit, Optional } from '@angular/core';
import { NgForm, RequiredValidator } from '@angular/forms'
import { getLocaleDateFormat, Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import * as firebase from 'firebase';
import { WindowService } from '../../midlewares/window.service';
import { adminusers } from '../../midlewares/masteradmin.module';
import { AuthService } from '../../midlewares/auth.service';
import { Router } from "@angular/router";
import { LoginserviceService } from "../../midlewares/login-service.service";
import { FormGroup, Validators, FormControl, FormBuilder } from "@angular/forms";
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
})
export class LoginPageComponent implements OnInit {
  private saveUsername: boolean = true;
  adminloginForm: FormGroup;
  windowRef: any;
  verificationCode: string;
  user: any;
  isLoginActive: boolean = true;
  public Formdata: any = [];
  masteradminlist: adminusers[];
  saveDet: boolean = false;
  isChecked: boolean = false;
  isEmailMatch: boolean = false;
  isPasswordMatch: boolean = false;

  countClicks = 0;
  verifycountClicks = 0;

  constructor(private fb: FormBuilder, public authservice: AuthService,
    private tostr: ToastrService, private win: WindowService, private router: Router,
    private loginservice: LoginserviceService, private location: Location, private cookieService: CookieService) {

    this.adminloginForm = fb.group({
      $key: ['', Optional],
      email: ['', Optional],
      password: ['', Optional],
      code: ['', Optional],
      rememberme: ['', Optional]
    })

    
  }
  onCheckUser(event) {
    var s = event.target;
    if (s.checked) {
      this.isChecked = true;
    } else {
      this.isChecked = false;
    }
    //console.log("setting values", this.Formdata);
  }
  ngOnInit() {
    
    var x = this.authservice.getData();
    x.snapshotChanges().subscribe(item => {
      this.masteradminlist = [];
      item.forEach(element => {
        var y = element.payload.toJSON();
        y["$key"] = element.key;
        this.masteradminlist.push(y as adminusers);
      });
    });
    if (this.cookieService.check('email') && this.cookieService.check('password')) {
      this.Formdata.email = this.cookieService.get('email');
      this.Formdata.password = this.cookieService.get('password');
      this.Formdata.rememberme = this.cookieService.get('rememberme');
      this.isChecked = true;
      this.adminloginForm.markAsDirty();
    }

    this.loginservice.componentMethodCalled$.subscribe(
      () => {
        this.isLoginDisabled();
        this.isVerifyDisabled();
      }
    );
  }

  onSubmit(adminloginForm: NgForm) {
    var loginData;
    loginData = this.masteradminlist;
    if(this.countClicks <= 1){
      this.loginFormValidation(adminloginForm, loginData);
      console.log('Validations check!!');
    }
    if(this.countClicks == 1){
      this.loginservice.phoneLogin(adminloginForm);
      console.log('LOGGED IN!!');
    
    }
  }
  verifyCodeSubmit(adminloginForm: NgForm) {
    this.windowRef = this.win.windowRef;
    let verificationCode;
    if (this.adminloginForm.value.code && this.verifycountClicks == 0) {
      verificationCode = this.adminloginForm.value.code,
      this.verifycountClicks++;
        this.windowRef.confirmationResult
          .confirm(verificationCode)
          .then(result => {
            console.log("INSIDE INSIDE");
            this.user = result.user;
            console.log('this.user', result.user);
            this.loginservice.loginStatus = true;
            localStorage.setItem('login', this.loginservice.loginStatus.toString());
            this.navigatepageactivelink();
          })
          .catch(error => {
            this.verifycountClicks = 0
            console.log("CATCH ERROR");
            console.log(error);
            this.tostr.error("Enter valid verification code");
            //this.loginservice.isSuccess = false;
            //this.loginservice.clearLogin();
            //this.isVerifyDisabled();
            //this.countClicks = 0;
          });
    } else if( this.verifycountClicks == 0){
        this.tostr.error("Please enter the verification code");
    }
  
  }

  isLoginDisabled() {
    var formValues = this.adminloginForm.value; 
    if (this.adminloginForm.dirty
      && formValues.email != undefined
      && formValues.email.length > 0
      && formValues.password != undefined
      && formValues.password.length > 0) {
      if (this.loginservice.isSuccess || this.isChecked) {
        if (this.loginservice.isSuccess && this.isChecked) {
          this.cookieService.set('email', this.Formdata.email);
          this.cookieService.set('password', this.Formdata.password);
          this.cookieService.set('rememberme', this.Formdata.rememberme);
          return true;
        } else if(this.isChecked){
          return false;
        } else {
          this.cookieService.delete('email', this.Formdata.email);
          this.cookieService.delete('password', this.Formdata.password);
          this.cookieService.delete('rememberme', this.Formdata.rememberme);
          return true;
        }
      }
      return false;
    } else {
      return true;
    }
  }

  isVerifyDisabled() {
    var formValues = this.adminloginForm.value;
    if (this.adminloginForm.dirty
      && formValues.email != undefined
      && formValues.email.length > 0
      && formValues.password != undefined
      && formValues.password.length > 0) {
      if (this.loginservice.isSuccess) {
        return false;
      }
      return true;
    } else {
      return true;
    }

  }

  navigatepageactivelink() {
    const loginDetails = JSON.parse(localStorage.getItem('currentUser'));
    if (loginDetails.Role == "Master Administrator" || loginDetails.Role == "Strategic Reports Administrator")
      return this.router.navigate(['/dashboard']);
    if (loginDetails.Role == "VoicX Posts Administrator")
      return this.router.navigate(['/userposts']);
    if (loginDetails.Role == "User and User Profile Administrator")
      return this.router.navigate(['/user']);
  }

  loginFormValidation(formValues, loginData) {
    var isEmailMatch = this.isEmailMatch,
      isPasswordMatch = this.isPasswordMatch,
      record;
    var format = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(format.test(formValues.value.email) == false){
      this.tostr.error('Please enter valid emailId');
      return;
    }
    loginData.forEach(function (res) {
      (res.EmailId == formValues.value.email) ? isEmailMatch = true : '';
      if(res.EmailId == formValues.value.email){
        record = res;
        (atob(record.Password) == formValues.value.password) ? isPasswordMatch = true : '';
      }
    });

    if(!isEmailMatch){
      this.tostr.error("Email doesn't exists!!");
      return;
    }

    if(isEmailMatch && !isPasswordMatch){
      this.tostr.error('Your Password is incorrect');
      return;
    }

    if(isEmailMatch && isPasswordMatch){
      this.countClicks++;
      return;
    }
    
  }
}
