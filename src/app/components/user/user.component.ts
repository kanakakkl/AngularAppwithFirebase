import { Component, OnInit, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { UserService } from './user.service';
import { User } from './user.model';
import { element } from 'protractor';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { UserModalComponent } from './user-modal/user-modal.component';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
  providers: [UserService, DatePipe]
})
export class UserComponent implements OnInit {
  @ViewChild(UserModalComponent) usermodalchild: UserModalComponent;
  @ViewChildren('pages') pages: QueryList<any>;
  itemsPerPage = 10;
  numberOfVisiblePaginators = 10;
  numberOfPaginators = 0;
  paginators: Array<any> = [];
  activePage = 1;
  firstVisibleIndex = 0;
  lastVisibleIndex: number = this.itemsPerPage;
  firstVisiblePaginator = 0;
  lastVisiblePaginator = this.numberOfVisiblePaginators;

  private date;
  userList: User[];
  searchText: string;
  ipAddress: any;
  convertedDate: any;
  convertTime: any;
  usrmdlSampleIsOpen: boolean;
  usrdisabledFields: boolean;
  viewColor: boolean;
  usrdataKey: any;
  updatedDate: any;
  userTimeUpdate: string;
  isUsrModelActive: boolean;
  defaultInitial: boolean = true;
  selectedRow: Number;
  setClickedRow: Function;
  toSearchText = [];

  modalFormSubscriptionName = new FormControl('', Validators.required);
  modalFormSubscriptionEmail = new FormControl('', Validators.email);

  actions = [
    { value: 'edit', viewValue: 'Edit' },
    { value: 'view', viewValue: 'View' },
    { value: 'delete', viewValue: 'Delete' },
  ]
  actionClick = function (value, data) {
    this.openUsrModal(true);
    this.onSelect(data);
    this.usrdataKey = data.$key;
    if (value == 'edit') {
      this.editSelect = true;
      this.viewColor = false;
      this.usrdisabledFields = false;
    }
    else if (value == 'view') {
      this.editSelect = false;
      this.viewColor = true;
      this.usrdisabledFields = true;
    }
    else {
      this.openUsrModal(false);
      this.deleteUser(data);
    }
  }

  private openUsrModal(open: boolean): void {
    this.isUsrModelActive = open;
    this.usrmdlSampleIsOpen = open;
  }

  // this is update user code
  private updateUserInfo(data): void {
    this.date = Math.floor((new Date()).getTime() / 1000);
    // alert(this.date);
    this.userTimeUpdate = this.date;
    var val, resData = [];
    val = this.usrdataKey;
    data.forEach(function (res) {
      if (res.$key != undefined && val == res.$key) {
        resData.push(res);
      }
    });
    var fD = this.usermodalchild.nomUserForm.value;
    //console.log("Fd Values", fD)
    if (resData != null) {
      resData[0].FirstName = fD.FirstName;
      resData[0].LastName = fD.LastName;
      resData[0].EmailId = fD.EmailId;
      resData[0].PhoneNumber = fD.Phone;
      resData[0].UserType = fD.userType;
      resData[0].Status = fD.Status;
      resData[0].UpdatedDateTime = this.userTimeUpdate.toString();
    }


    this.userService.updateUserData(resData[0]);
    this.openUsrModal(false);
    // this.numberOfPaginators = 0;
    // this.paginators = [];
    // this.defaultInitial = true;
  }

  private deleteUser(data): void {

    this.userService.deleteUser(data);
    this.numberOfPaginators = 0;
    this.paginators = [];
    this.defaultInitial = true;
    this.firstPage();
  }

  onSelect(selectedItem: any) {
    this.isUsrModelActive = true;
   // console.log("Selected name: ", selectedItem.FirstName); // You get the Id of the selected item here
    // console.log("mani$$$$$1234567", this.adminmodalchild);
  }
  constructor(private spinner: NgxSpinnerService, private userService: UserService, private http: HttpClient, private datepipe: DatePipe) {
    // this.date = new Date();
    this.setClickedRow = function (index) {
      this.selectedRow = index;
    }

    this.http.get<{ ip: string }>('https://jsonip.com')
      .subscribe(data => {
        //console.log('th data', data);
        this.ipAddress = data
      })
  }

  ngOnInit() {
    this.spinner.show();
    this.isUsrModelActive = false;
    var list = this.userService.getData();
    list.snapshotChanges().subscribe(item => {
      this.userList = [];
      item.forEach(element => {
        var y = element.payload.toJSON();
        y["$key"] = element.key;
        this.userList.push(y as User);

        this.getUserDetails(this.userList);

      });
      if (this.defaultInitial) {
        this.getUserListPagination();
      }
      this.spinner.hide();
    });
  }

  getUserListPagination() {
    this.defaultInitial = false;
    this.numberOfPaginators = 0;
    this.paginators = [];
    if (this.toSearchText && this.toSearchText.length > 0) {
      if (this.toSearchText.length == 1) {
        if (this.toSearchText && this.toSearchText.length % this.itemsPerPage === 0) {
          this.numberOfPaginators = Math.floor(this.toSearchText.length / this.itemsPerPage);
        } else {
          this.numberOfPaginators = Math.floor(this.toSearchText.length / this.itemsPerPage + 1);
        }
      } else {
        if (this.toSearchText && (this.toSearchText.length - 1) % this.itemsPerPage === 0) {
          this.numberOfPaginators = Math.floor((this.toSearchText.length - 1) / this.itemsPerPage);
        } else {
          this.numberOfPaginators = Math.floor((this.toSearchText.length - 1) / this.itemsPerPage + 1);
        }
      }
      for (let i = 1; i <= this.numberOfPaginators; i++) {
        this.paginators.push(i);
      }
      //console.log("Inside HERE");
      if(this.searchText.length < 7){
        this.firstPage();
      }
    } else if (this.toSearchText.length == 0) {
      if(this.searchText == undefined || this.searchText == ""){
        return this.getPaginations();
      }
      this.numberOfPaginators = 0;
      this.paginators = [];
    } else {
      this.getPaginations();
    }
  }

  getPaginations() {
   // console.log("Inside HERE USER");
    if (this.userList && this.userList.length != undefined) {
      if (this.userList && (this.userList.length - 1) % this.itemsPerPage === 0) {
        this.numberOfPaginators = Math.floor((this.userList.length - 1) / this.itemsPerPage);
      } else {
        this.numberOfPaginators = Math.floor((this.userList.length - 1) / this.itemsPerPage + 1);
      }
      for (let i = 1; i <= this.numberOfPaginators; i++) {
        this.paginators.push(i);
      }
    }
  }

  async getUserDetails(userList) {

    //let adminData = adminList;
    let createdate, updatedtime;
    //console.log("ammmmmuser list$$$ :", userList);
    userList.forEach(res => {
      createdate = res.CreateDateTime;
      updatedtime = res.UpdatedDateTime;
      // alert(createdate);
     // console.log("date form the user", createdate);

      this.convertedDate = this.datepipe.transform(createdate, 'M/d/yy, h:mm a');
      this.updatedDate = this.datepipe.transform(updatedtime, 'M/d/yy, h:mm a');
      // this.convertTime = this.datepipe.transform(createdate, 'hh:mm a');
      res.convertedDate = this.convertedDate;
      res.updatedDate = this.updatedDate;
    });

  }

  filterIt(arr, searchKey) {
    searchKey = searchKey.toLowerCase();
    var searchText = searchKey.replace(/\s/g, "");
    return arr.filter((obj) => {
      return Object.keys(obj).some((key) => {
        if (obj[key] != null && typeof obj[key] != "number") {
          var cat = obj[key].replace(/\s/g, "");
          cat = cat.toLowerCase();
          return cat.includes(searchText);
        }
      });
    });
  }

  search() {
    var userData = [];
    if (!this.searchText) {
      this.toSearchText = [];
      this.getUserListPagination();
      return this.userList;
    }
    if (this.searchText) {
      userData = this.userList;
      this.toSearchText = this.filterIt(userData, this.searchText);
     // console.log('2****', this.toSearchText.length, this.searchText);
      this.getUserListPagination();
      return this.filterIt(userData, this.searchText);
    }
  }

  changePage(event: any) {
    if (event.target.text > 1 && event.target.text <= this.numberOfPaginators) {
      this.activePage = +event.target.text;
      this.firstVisibleIndex = this.activePage * this.itemsPerPage - this.itemsPerPage + 1;
      this.lastVisibleIndex = this.activePage * this.itemsPerPage;
    } else if (event.target.text >= 1 && event.target.text <= this.numberOfPaginators) {
      this.activePage = +event.target.text;
      this.firstVisibleIndex = this.activePage * this.itemsPerPage - this.itemsPerPage;
      this.lastVisibleIndex = this.activePage * this.itemsPerPage;
    }
  }

  nextPage(event: any) {
    if (this.pages.last.nativeElement.classList.contains('active')) {
      if ((this.numberOfPaginators - this.numberOfVisiblePaginators) >= this.lastVisiblePaginator) {
        this.firstVisiblePaginator += this.numberOfVisiblePaginators;
        this.lastVisiblePaginator += this.numberOfVisiblePaginators;
      } else {
        this.firstVisiblePaginator += this.numberOfVisiblePaginators;
        this.lastVisiblePaginator = this.numberOfPaginators;
      }
    }

    this.activePage += 1;
    this.firstVisibleIndex = this.activePage * this.itemsPerPage - this.itemsPerPage + 1;
    this.lastVisibleIndex = this.activePage * this.itemsPerPage;
  }

  previousPage(event: any) {
    if (this.pages.first.nativeElement.classList.contains('active')) {
      if ((this.lastVisiblePaginator - this.firstVisiblePaginator) === this.numberOfVisiblePaginators) {
        this.firstVisiblePaginator -= this.numberOfVisiblePaginators;
        this.lastVisiblePaginator -= this.numberOfVisiblePaginators;
      } else {
        this.firstVisiblePaginator -= this.numberOfVisiblePaginators;
        this.lastVisiblePaginator -= (this.numberOfPaginators % this.numberOfVisiblePaginators);
      }
    }

    this.activePage -= 1;
    this.firstVisibleIndex = this.activePage * this.itemsPerPage - this.itemsPerPage + 1;
    this.lastVisibleIndex = this.activePage * this.itemsPerPage;
  }

  firstPage() {
    this.activePage = 1;
    this.firstVisibleIndex = this.activePage * this.itemsPerPage - this.itemsPerPage;
    this.lastVisibleIndex = this.activePage * this.itemsPerPage;
    this.firstVisiblePaginator = 0;
    this.lastVisiblePaginator = this.numberOfVisiblePaginators;
  }

  lastPage() {
    this.activePage = this.numberOfPaginators;
    this.firstVisibleIndex = this.activePage * this.itemsPerPage - this.itemsPerPage + 1;
    this.lastVisibleIndex = this.activePage * this.itemsPerPage;

    if (this.numberOfPaginators % this.numberOfVisiblePaginators === 0) {
      this.firstVisiblePaginator = this.numberOfPaginators - this.numberOfVisiblePaginators;
      this.lastVisiblePaginator = this.numberOfPaginators;
    } else {
      this.lastVisiblePaginator = this.numberOfPaginators;
      this.firstVisiblePaginator = this.lastVisiblePaginator - (this.numberOfPaginators % this.numberOfVisiblePaginators);
    }
  }

}