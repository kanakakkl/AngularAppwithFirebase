import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { User} from './user.model';



@Injectable({
  providedIn: 'root'
})
export class UserService {
  userList : AngularFireList<any>;
  selectedAdmin : User = new User();

  constructor(private firebase :AngularFireDatabase) { }

  // getData()
  // {
  //   this.userList = this.firebase.list('users');
  //   return this.userList;
  // }
  getData()
  {
    this.userList = this.firebase.list('/users', ref => ref.orderByChild('IsDeleted').equalTo('false'))
    return this.userList;
  }
  updateUserData(usermodel : User) {
    this.userList.update(usermodel.$key,
      {
        FirstName: usermodel.FirstName,
        LastName:  usermodel.LastName,
        EmailId: usermodel.Email,
        PhoneNumber: usermodel.PhoneNumber,
        UserType : usermodel.UserType,
        Status: usermodel.Status,
        UpdatedDateTime : usermodel.UpdatedDateTime
      });
  }
  deleteUser(usermodel: User) {
    this.userList.update(usermodel.$key,
      {
        IsDeleted : "Deleted"
      });
  }

}
