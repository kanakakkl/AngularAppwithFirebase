import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, } from 'angularfire2/database'
import { Adminmodel} from './adminmodel.model';


@Injectable({
  providedIn: 'root'
})
export class AdminService {
    
  adminList : AngularFireList<any>;
  selectedAdmin : Adminmodel = new Adminmodel();

  constructor(private firebase :AngularFireDatabase) { }

  // getData()
  // {
  //   this.adminList = this.firebase.list('adminusers');
  //   return this.adminList;
  // }
  getData()
  {
    this.adminList = this.firebase.list('/adminusers', ref => ref.orderByChild('isDeleted').equalTo(''))
    return this.adminList;
  }

  addAdmin(data : Adminmodel) {
    this.adminList.push({
    AdminId:data.AdminId,
    EmailId:data.EmailId,
    FirstName:data.FirstName,
    LastName:data.LastName,
    Password: data.Password,
    CreatedDateTime:data.CreatedDateTime,
    Phone: data.Phone,
    Role: data.Role,
    Status: data.Status,
    Ipaddress: data.Ipaddress,
    isDeleted : "",
    UpdatesDateTime : data.UpdatesDateTime
    });
  }
  updateData(adminmodel : Adminmodel) {
    this.adminList.update(adminmodel.$key,
      {
        FirstName: adminmodel.FirstName,
        LastName:  adminmodel.LastName,
        EmailId: adminmodel.EmailId,
        Phone: adminmodel.Phone,
        Role: adminmodel.Role,
        Status: adminmodel.Status,
        UpdatesDateTime : adminmodel.UpdatesDateTime
      });
  }

  deleteAdmin(adminmodel: Adminmodel,spinner) {
    this.adminList.update(adminmodel.$key,
      {
       isDeleted : "Deleted"
      });
      spinner.hide();
  }
}


