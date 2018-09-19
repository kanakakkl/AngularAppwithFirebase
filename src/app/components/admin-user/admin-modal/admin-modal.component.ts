import { Component, OnInit, Input, Optional } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AdminService } from '../admin.service';
import { Adminmodel } from '../adminmodel.model';

@Component({
  selector: 'app-admin-modal',
  templateUrl: './admin-modal.component.html',
  styleUrls: ['./admin-modal.component.css']
})
export class AdminModalComponent implements OnInit {
  userForm: FormGroup;

  isValidFormSubmitted = null;

  question = [];
  // ipaddress :any;
  FirstName: any;
  LastName: any;
  Phone: any;
  EmailId: any;
  Status: any;
  Role: any;

  @Input() myData;
  @Input() disabledFieldsInchild: boolean;
  @Input() dataKey: any;

  @Input() mdlViewSampleIsOpen: string;

  constructor(private adminService: AdminService, private adminfb: FormBuilder) { }

  ngOnInit() {
   var val,
      resData;
    val = this.dataKey;
    resData = [];
    var g = this.myData;
    g.forEach(function (res) {
      if (res.$key != undefined && val == res.$key) {
        resData.push(res);
      }
    });
    this.FirstName = resData[0].FirstName;
    this.LastName = resData[0].LastName;
    this.Phone = resData[0].Phone;
    this.EmailId = resData[0].EmailId;
    this.Role = resData[0].Role;
    this.Status = resData[0].Status;

    this.userForm = this.adminfb.group({
      FirstName: [this.FirstName, Optional],
      LastName: [this.LastName, Optional],
      Phone: [this.Phone, Optional],
      EmailId: [this.EmailId, Optional],
      Role: [this.Role, Optional],
      Status: [this.Status, Optional],
    });

    if (this.disabledFieldsInchild) {
      this.userForm.disable();
    }


  }

  onFormSubmit() {
    this.isValidFormSubmitted = false;
  }
  get userName() {
    return this.userForm.get('userName');
  }
  get phone() {
    return this.userForm.get('phone');
  }
  get email() {
    return this.userForm.get('email');
  }
  get status() {
    return this.userForm.get('status');
  }

}
