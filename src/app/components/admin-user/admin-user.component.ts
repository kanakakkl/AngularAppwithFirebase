import { Component, OnInit, ViewChild, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AdminService } from './admin.service';
import { Adminmodel } from './adminmodel.model';
import { element } from 'protractor';
import { HttpClient } from '@angular/common/http';
import { filter } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { AdminModalComponent } from './admin-modal/admin-modal.component';
import { NewComponent } from '../../components/new/new.component';
import { ToastrService } from 'ngx-toastr';
import { format } from 'util';
// import { LoginserviceService } from "../../midlewares/login-service.service";
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-admin-user',
  templateUrl: './admin-user.component.html',
  styleUrls: ['./admin-user.component.scss'],
  providers: [AdminService, DatePipe]
})
export class AdminUserComponent implements OnInit {
  @ViewChild(AdminModalComponent) adminmodalchild: AdminModalComponent;
  @ViewChild(NewComponent) newadminmodalchild: NewComponent;
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
  timeNow: string;
  timeUpdate: string;
  adminList: Adminmodel[];
  ipArray = [];
  searchText: string;
  adminGuid: string;
  mdlViewSampleIsOpen: string;

  Systemip: any;
  convertedDate: any;
  updatedDate: any;
  convertTime: any;

  isModelActive: boolean;
  isAdnModelActive: boolean;
  editSelect: boolean;
  viewColor: boolean;
  rowColor: boolean;
  mdlSampleIsOpen: boolean;
  admSampleIsOpen: boolean;
  disabledFields: boolean;
  defaultInitial: boolean = true;
  dataKey: any;
  selectedRow: Number;
  setClickedRow: Function;
  adminData: any;
  toSearchText = [];

  actions = [
    { value: 'edit', viewValue: 'Edit' },
    { value: 'view', viewValue: 'View' },
    { value: 'delete', viewValue: 'Delete' },
  ]

  actionClick = function (value, data) {
    this.openModal(true);
    this.onSelect(data);
    this.dataKey = data.$key;
    if (value == 'edit') {
      this.editSelect = true;
      this.viewColor = false;
      this.disabledFields = false;
    }
    else if (value == 'view') {
      this.editSelect = false;
      this.viewColor = true;
      this.disabledFields = true;
    }

    else {
      this.openModal(false);
      this.deleteAdminUser(data);
    }
  }
  addBtnClick = function () {
    this.genaAdminUid();
    this.openAdnModal(true);
    this.newadminmodalchild.addAdminForm.reset();
  }

  private openModal(open: boolean): void {
    this.mdlSampleIsOpen = open;
    this.isModelActive = open;
  }
  private openAdnModal(open: boolean): void {
    this.admSampleIsOpen = open;
    this.isAdnModelActive = open;
  }

  private genaAdminUid() {
    function uuidv4() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }
    this.adminGuid = uuidv4();
    //console.log("uid from the string", this.adminGuid);
  }

  private updateAdminInfo(data): void {
    this.date = Math.floor((new Date()).getTime() / 1000);
    //console.log("Gmt updated date Time ", this.date);
    this.timeUpdate = this.date;
    var val, resData = [];
    val = this.dataKey;
    data.forEach(function (res) {
      if (res.$key != undefined && val == res.$key) {
        resData.push(res);
      }
    });
    var fD = this.adminmodalchild.userForm.value;
    if (resData != null) {
      resData[0].FirstName = fD.FirstName;
      resData[0].LastName = fD.LastName;
      resData[0].EmailId = fD.EmailId;
      resData[0].Phone = fD.Phone;
      resData[0].Role = fD.Role;
      resData[0].Status = fD.Status;
      // resData[0].UpdatesDateTime = "Sat Aug 11 2018 17:21:16 GMT+0530 (India Standard Time)";
      // resData[0].UpdatesDateTime = Date.now();
      resData[0].UpdatesDateTime = this.timeUpdate.toString();
    }


    this.adminService.updateData(resData[0]);
    this.openModal(false);
   // console.log("mani$$$$$", this.adminmodalchild);
  }
  private deleteAdminUser(data): void {
    this.spinner.show();
    var loginDetails = JSON.parse(localStorage.getItem('currentUser'));
    //console.log("*loginDetails*", loginDetails);
    if (loginDetails && loginDetails.Role == data.Role) {
      this.tostr.error('You are the Master Administrator');
    }
    else {
      this.adminService.deleteAdmin(data, this.spinner);
      this.numberOfPaginators = 0;
      this.paginators = [];
      this.defaultInitial = true;
      this.firstPage();
    }
    this.spinner.hide();
  }

  private addAdminUser(adnUserData): void {
    var format = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var addAdminFormData;
    this.date = Math.floor((new Date()).getTime() / 1000);
   // console.log("Gmt create Time ", this.date);
    this.timeNow = this.date;
    addAdminFormData = this.newadminmodalchild.addAdminForm.value;
    if (this.newadminmodalchild.addAdminForm.dirty && addAdminFormData.FirstName != null && addAdminFormData.FirstName != "" && addAdminFormData.LastName
      != null && addAdminFormData.LastName != "" && addAdminFormData.Phone != null && addAdminFormData.Phone != "" && addAdminFormData.EmailId != null && addAdminFormData.EmailId != "" &&
      addAdminFormData.Password != null && addAdminFormData.Password != "") {
      if (addAdminFormData.Phone.length < 7) {
        this.tostr.error('Phone number must be 7 digits.');
        return;
      }

      if (format.test(addAdminFormData.EmailId)) {
        if (addAdminFormData.Password.length >= 6) {
          var resAdnData = [];
          var adminFd = this.newadminmodalchild.addAdminForm.value;
          //console.log("from values", adminFd)
          let adminpassword = adminFd.Password;
          let encodedpassword = btoa(adminpassword);

          var mailId = adminFd.EmailId;
          var toastMsg = this.tostr;
          this.adminList.forEach(function (res) {
            if (res.EmailId == adminFd.EmailId) {
              mailId = "";
              toastMsg.error('Email already exists!');
              
            }

          });

          if (mailId != "") {
            resAdnData.push({
              FirstName: adminFd.FirstName,
              LastName: adminFd.LastName,
              EmailId: mailId,
              Password: encodedpassword,
              Phone: adminFd.Phone,
              Role: adminFd.Role,
              Status: "Active",
              AdminId: this.adminGuid,
              CreatedDateTime: this.timeNow.toString(),
              Ipaddress: this.ipArray[0].ip,
              UpdatesDateTime: this.timeNow.toString()
            })
            this.adminService.addAdmin(resAdnData[0]);
            this.openAdnModal(false);
            this.numberOfPaginators = 0;
            this.paginators = [];
            this.defaultInitial = true;
          }
        } else {
          this.tostr.error('Password must be 6 characters.');
          return;
        }

      } else {
        this.tostr.error('Please enter valid email.');
        return;
      }
    }

    else {
      this.tostr.error('Please enter all fields.');
    }

  }

  
  onSelect(selectedItem: any) {
    this.isModelActive = true;
   // console.log("Selected name: ", selectedItem.FirstName); // You get the Id of the selected item here
   // console.log("mani$$$$$1234567", this.adminmodalchild);
  }


  constructor(private spinner: NgxSpinnerService, private adminService: AdminService, private http: HttpClient, private datepipe: DatePipe, private tostr: ToastrService, private el: ElementRef) {
    this.setClickedRow = function (index) {
      this.selectedRow = index;
    }
    this.http.get<{ ip: string }>('https://jsonip.com')
      .subscribe(data => {
        //console.log('th data', data);
        this.ipArray.push(data);
        this.Systemip = data;
       // console.log('th data', this.ipArray[0].ip);
      })
  }


  ngOnInit() {
    this.spinner.show();
    this.isModelActive = false;
    var list = this.adminService.getData();
    list.snapshotChanges().subscribe(item => {

      this.adminList = [];
      item.forEach(element => {
        var y = element.payload.toJSON();
        y["$key"] = element.key;
        this.adminList.push(y as Adminmodel);
        this.getAdminDetails(this.adminList);
      });
      if (this.defaultInitial) {
        this.getAdminListPagination();
      }
      this.spinner.hide();
    });
  }

  ngAfterViewInit() {
   // console.log('this.pages', this.pages);

  }
  getAdminListPagination() {
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
     // console.log("Inside HERE");
      if(this.searchText.length < 7){
        this.firstPage();
      }
    } else if(this.toSearchText.length == 0){
      if(this.searchText == undefined || this.searchText == ""){
        return this.getAdminListpagings();
      }
      this.numberOfPaginators = 0;
      this.paginators = []; 
    } else {
      this.getAdminListpagings();
    }
  }

  getAdminListpagings(){
   // console.log("Inside HERE ADMIN");
    if(this.adminList && this.adminList.length != undefined){

      if (this.adminList && (this.adminList.length - 1) % this.itemsPerPage === 0) {
        this.numberOfPaginators = Math.floor((this.adminList.length - 1) / this.itemsPerPage);
      } else {
        this.numberOfPaginators = Math.floor((this.adminList.length - 1) / this.itemsPerPage + 1);
      }

      for (let i = 1; i <= this.numberOfPaginators; i++) {
        this.paginators.push(i);
      }
    }
  }
  async getAdminDetails(adminList) {
    let createdate, updatedtime;
    adminList.forEach(res => {
      createdate = res.CreatedDateTime;
      updatedtime = res.UpdatesDateTime;
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
    var adminData = [];
    if (!this.searchText) {
      this.toSearchText = [];
      this.getAdminListPagination();
      return this.adminList;
    }
    if (this.searchText) {
      adminData = this.adminList;
      this.toSearchText = this.filterIt(adminData, this.searchText);
     // console.log('1****', this.toSearchText.length, this.searchText);
      this.getAdminListPagination();
      return this.filterIt(adminData, this.searchText);
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
    this.firstVisibleIndex = this.activePage * this.itemsPerPage - this.itemsPerPage;
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
    this.firstVisibleIndex = this.activePage * this.itemsPerPage - this.itemsPerPage;
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
    this.firstVisibleIndex = this.activePage * this.itemsPerPage - this.itemsPerPage;
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



