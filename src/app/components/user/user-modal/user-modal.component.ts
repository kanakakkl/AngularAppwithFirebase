import { Component, OnInit,Input,Optional } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { User } from '../user.model';

@Component({
  selector: 'app-user-modal',
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.css']
})
export class UserModalComponent implements OnInit {
  nomUserForm: FormGroup;

  FirstName: any;
  LastName: any;
  Phone: any;
  EmailId: any;
  Status : any;
  userType: any;

  @Input() usrData;
  @Input() usrdisabledFieldsInchild: boolean;
  @Input() usrdataKey: any;

  constructor( private userfb: FormBuilder) { }

  ngOnInit() {
    var val,
    resData;
  val = this.usrdataKey;
  resData = [];
  console.log("$$$$$$$$user data",resData);
  var g = this.usrData;
  g.forEach(function (res) {
    if (res.$key != undefined && val == res.$key) {
      resData.push(res);
    }
  });
  this.FirstName = resData[0].FirstName;
  this.LastName = resData[0].LastName;
  this.Phone = resData[0].PhoneNumber;
  this.EmailId = resData[0].Email;
  this.userType = resData[0].UserType;
  this.Status = resData[0].Status;

  this.nomUserForm = this.userfb.group({
    FirstName: [this.FirstName, Optional],
    LastName: [this.LastName, Optional],
    Phone: [this.Phone, Optional],
    EmailId: [this.EmailId, Optional],
    userType :[this.userType,Optional],
    Status : [this.Status,Optional]
  });

  if (this.usrdisabledFieldsInchild) {
    this.nomUserForm.disable();
  }

  }



}
