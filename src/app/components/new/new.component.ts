import { Component, OnInit,Optional,Input } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from '../admin-user/admin.service';
import { Adminmodel } from '../admin-user/adminmodel.model';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.css']
})
export class NewComponent implements OnInit {
  addAdminForm: FormGroup;
  FirstName: any;
  LastName: any;
  Phone: any;
  EmailId: any;
  Password:any;
  Status: any;
  Role: any;
 // myPhone:any;
 adminList: Adminmodel[];

  // @Input() myData;

  constructor(private formb: FormBuilder,private tostr: ToastrService,private adminService: AdminService) {}

  ngOnInit() {

    var list = this.adminService.getData();
    list.snapshotChanges().subscribe(item => {

      this.adminList = [];
      item.forEach(element => {
        var y = element.payload.toJSON();
        y["$key"] = element.key;
        this.adminList.push(y as Adminmodel);
        // this.getAdminDetails(this.adminList);
      });
    });

    this.addAdminForm = this.formb.group({
      FirstName: [this.FirstName, Optional],
      LastName: [this.LastName, Optional],
     // myPhone: [this.myPhone, Optional],
      Phone: [this.Phone, Optional],
      Password :[this.Phone,Optional],
      EmailId: [this.EmailId, Optional],
      Role: [this.Role, Optional],
      Status: [this.Status, Optional],
    });
  }

  // var g = this.myData;
  // g.forEach(function (res) {
  //   if (res.$key != undefined && val == res.$key) {
  //     resData.push(res);
  //   }

  values = '';
  onKeyUp(event: any) {debugger;
      this.values = event.target.value;
      console.log("enetred values",this.values);
      var s = this.adminList;
      var ts = this.tostr;
      s.forEach(function (res) {
        if (res.EmailId == event.target.value) {
          // this.EmailId = "";
          ts.error('Email already exists!');
        }

      });
  };

  isEntered(e){
    var target = e.currentTarget
      if(target.classList.contains('countruCls')){
        target.classList.remove('countruCls');
      }else{
        target.classList.add('countruCls');
      }
  }
  

}
