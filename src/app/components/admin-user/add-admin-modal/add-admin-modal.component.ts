import { Component, OnInit,Optional } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-add-admin-modal',
  templateUrl: './add-admin-modal.component.html',
  styleUrls: ['./add-admin-modal.component.css']
})
export class AddAdminModalComponent implements OnInit {

  addAdminForm: FormGroup;
  FirstName: any;
  LastName: any;
  Phone: any;
  EmailId: any;
  Password:any;
  Status: any;
  Role: any;
  constructor(private adminformb: FormBuilder) { }

  ngOnInit() {
    this.addAdminForm = this.adminformb.group({
      FirstName: [this.FirstName, Optional],
      LastName: [this.LastName, Optional],
      Phone: [this.Phone, Optional],
      Password :[this.Phone,Optional],
      EmailId: [this.EmailId, Optional],
      Role: [this.Role, Optional],
      Status: [this.Status, Optional],
    });
  }

}
