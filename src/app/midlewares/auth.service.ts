import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database'
import { adminusers } from './masteradmin.module';
import * as firebase from 'firebase';
import { AngularFireAuth } from '../../../node_modules/angularfire2/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  masterAdminlist: AngularFireList<any>;
  selectedAdminlogin: adminusers = new adminusers();
  constructor(private firebase :AngularFireDatabase, private afAuth: AngularFireAuth) { }
  getData(){
    this.masterAdminlist = this.firebase.list('adminusers');
    return this.masterAdminlist;
    
  }

  insertEmployee()
  {
   
     
   
  }

  updateEmployee(){
   
  }

  deleteEmployee($key : string){
   
  }

  getToken() {
    return localStorage.getItem("currentUser")
  }
  isLoggednIn() {
    return this.getToken() !== null;
  }

  doLogOut(){
    return new Promise((resolve, reject) => {
      if(firebase.auth().currentUser){
        this.afAuth.auth.signOut().then(function(){
          localStorage.removeItem('currentUser');
          var user = JSON.parse(localStorage.getItem('currentUser'));
          console.log("*********************CURRENT USER**************",user);
          resolve();
          this.router.navigate(['/login']);

        }).catch(function(error) {
          // An error happened.
        });
        // resolve();
        // this.router.navigate(['/login']);
      }
      else{
        reject();
      }
    });
  }

}

