import { Component, OnInit, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { PostUpgradeService } from './post-upgrade.service';
import { PostUpgrade } from './post-upgrade.model';
import { User } from '../user/user.model';
import { category } from '../categories/categories.module';
import { ToastrService } from 'ngx-toastr';
import { format } from 'util';
import { PostUpgradeModalComponent } from './post-upgrade-modal/post-upgrade-modal.component';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-post-upgrade',
  templateUrl: './post-upgrade.component.html',
  styleUrls: ['./post-upgrade.component.css'],
  providers: [PostUpgradeService]
})
export class PostUpgradeComponent implements OnInit {
  @ViewChild(PostUpgradeModalComponent) postmodalchild: PostUpgradeModalComponent;
  @ViewChildren('pages') pages: QueryList<any>;
  itemsPerPage = 10;
  numberOfVisiblePaginators = 10;
  numberOfPaginators: number;
  paginators: Array<any> = [];
  activePage = 1;
  firstVisibleIndex = 0;
  lastVisibleIndex: number = this.itemsPerPage;
  firstVisiblePaginator = 0;
  lastVisiblePaginator = this.numberOfVisiblePaginators;
  searchText: string;
  postList: PostUpgrade[];
  postUserList: User[];
  postCatgoryList: category[];
  combineArray: any[];
  catCombineArray: any[];
  postlistarray: PostUpgrade[];
  catPostListArray: category[];
  postSampleIsOpen: boolean;
  isPostModelActive: boolean;
  viewColor: boolean;
  postdataKey: any;
  selectedRow: Number;
  setClickedRow: Function;
  defaultInitial: boolean = true;
  toSearchText = [];

  actions = [
    { value: 'edit', viewValue: 'Edit' },
    { value: 'view', viewValue: 'View' },
  ]

  actionClick = function (value, data) {
    this.openPostModal(true);
    this.onSelect(data);
    this.postdataKey = data.$key;
    if (value == 'edit') {
      this.editSelect = true;
      this.viewColor = false;
      // this.usrdisabledFields = false;
    }

    else {
      this.editSelect = false;
      this.viewColor = true;
    }
  }

  private openPostModal(open: boolean): void {
    this.isPostModelActive = open;
    this.postSampleIsOpen = open;
  }
  modalFormSubscriptionName = new FormControl('', Validators.required);
  modalFormSubscriptionEmail = new FormControl('', Validators.email);

  // this is update user code
  private updatepostInfo(data): void {
    // this.date =  Math.floor((new Date()).getTime() / 1000);
    // alert(this.date);
    //this.userTimeUpdate = this.date;
    var val, resData = [];
    val = this.postdataKey;
    data.forEach(function (res) {
      if (res.$key != undefined && val == res.$key) {
        resData.push(res);
      }
    });
    var fD = this.postmodalchild.postForm.value;
    // console.log("Fd Values", fD)
    if (resData != null) {
      resData[0].FirstName = fD.FirstName;
      resData[0].LastName = fD.LastName;
      resData[0].Email = fD.EmailId;
      resData[0].Phone = fD.Phone;
      resData[0].TopicTitle = fD.Topic;
      resData[0].PostStatus = fD.postStatus;
      // resData[0].UpdatedDateTime = this.userTimeUpdate.toString();
    }


    this.postService.updatePostData(resData[0]);
    this.getDetails();
    this.openPostModal(false);
    // console.log("mani$$$$$", this.postmodalchild);
  }

  onSelect(selectedItem: any) {
    this.isPostModelActive = true;
    // console.log("Selected name: ", selectedItem.FirstName); // You get the Id of the selected item here
    // console.log("mani$$$$$1234567", this.adminmodalchild);
  }

  constructor(private postService: PostUpgradeService, public spinner: NgxSpinnerService) {
    this.setClickedRow = function (index) {
      this.selectedRow = index;
    }
  }

  ngOnInit() {
    this.spinner.show();
    this.getDetails();
  }

  getUserListPagination() {
    // this.defaultInitial = false;
    // if (this.catPostListArray && this.catPostListArray.length % this.itemsPerPage === 0) {
    //   this.numberOfPaginators = Math.floor(this.catPostListArray.length / this.itemsPerPage);
    // } else {
    //   this.numberOfPaginators = Math.floor(this.catPostListArray.length / this.itemsPerPage + 1);
    // }

    // for (let i = 1; i <= this.numberOfPaginators; i++) {
    //   this.paginators.push(i);
    // }
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
    if (this.catPostListArray && this.catPostListArray.length != undefined) {
      if (this.catPostListArray && (this.catPostListArray.length - 1) % this.itemsPerPage === 0) {
        this.numberOfPaginators = Math.floor((this.catPostListArray.length - 1) / this.itemsPerPage);
      } else {
        this.numberOfPaginators = Math.floor((this.catPostListArray.length - 1) / this.itemsPerPage + 1);
      }
      for (let i = 1; i <= this.numberOfPaginators; i++) {
        this.paginators.push(i);
      }
    }
  }

  getDetails() {
    var list = this.postService.getPostData();
    var postList = [];
    list.snapshotChanges().subscribe(item => {
      item.forEach(element => {
        var y = element.payload.toJSON();
        y["$key"] = element.key;
        postList.push(y as PostUpgrade);
      });
      this.postList = postList;
      this.manipulateData();
      this.getRecords(postList);
      // console.log("postliTTTTTT$$", this.postList);
    });
  }

  getRecords(postList) {
    this.postList = [];
    postList = [];
    var list = this.postService.getPostData();
    list.snapshotChanges().subscribe(item => {
      item.forEach(element => {
        var y = element.payload.toJSON();
        y["$key"] = element.key;
        postList.push(y as PostUpgrade);
      });
      this.postList = postList;
      this.manipulateData();
      // console.log("postliTTTTTT$$records", this.postList);
    });
    var postlist = this.postService.getPostUserData();
    postlist.snapshotChanges().subscribe(item => {
      this.postUserList = [];
      item.forEach(element => {
        var z = element.payload.toJSON();
        z["$key"] = element.key;
        this.postUserList.push(z as User);

      });
      // console.log("user data post", this.postUserList);
      this.compare(this.postList, this.postUserList);
    });

    var catList = this.postService.getpostCategoryData();
    var postCatList = [];
    catList.snapshotChanges().subscribe(item => {


      item.forEach(element => {
        var v = element.payload.toJSON();
        v["$key"] = element.key;
        postCatList.push(v as PostUpgrade);
      });
      this.postCatgoryList = postCatList;
      // this.manipulateData();
      // console.log("postCAETliTTTTTT$$", this.postCatgoryList);
      this.compareCategories(this.postList, this.postCatgoryList);
    });
  }

  manipulateData() {
    this.postList.forEach((x: any) => { // iterate outer array
      x.Address = Object.entries(x.Address).map(([key, value]) => ({ key, value }));
    })
  }

  filterIt(arr, searchKey) {
    searchKey = searchKey.toLowerCase();
    var searchText = searchKey.replace(/\s/g, "");
    var found = false;
    return arr.filter((obj) => {
      return Object.keys(obj).some((key) => {
        found = false;
        if(typeof obj[key] == "object" && key == "Address"){
          obj[key].forEach(function(res){
            var val = res.value.toLowerCase();
            val = val.replace(/\s/g, "");
            if(val.includes(searchText)){
              found = true;
            }
          })
        }
        if(found){
          // console.log("obj[key]",obj[key]);
          return true;
        }
        if (obj[key] != null && obj[key] != "MediaUrl" && obj[key] != "ImageUrl" &&
           typeof obj[key] != "boolean" &&
           typeof obj[key] != "number" &&
           key != "Comments" &&
           key != "Address" && key != "LikedUsers"  && key != "SharedUsers" && key != "SmileUsers" && key != "DisLikedUsers" ) {  
          var cat = obj[key].replace(/\s/g, "");
              cat = cat.toLowerCase();
          return cat.includes(searchText);
        }

      });
    });
  }

  search() {
    var userPostData = [];
    if (!this.searchText) {
      this.toSearchText = [];
      this.getUserListPagination();
      return this.catPostListArray;
    }
    if (this.searchText) {
      //console.log(this.catPostListArray);
      // userPostData = this.catPostListArray;
      // return this.filterIt(userPostData, this.searchText);
      userPostData = this.catPostListArray;
      this.toSearchText = this.filterIt(userPostData, this.searchText);
      // console.log('2****', this.toSearchText.length, this.searchText);
      this.getUserListPagination();
      return this.filterIt(userPostData, this.searchText);
    }
  }

  compare(postlist, postuser) {
    this.combineArray = [];
    this.postlistarray = postlist;
    postlist.forEach((e1) => postuser.forEach((e2) => {
      if (e1.UserId === e2.UserId) {
        this.combineArray.push(e2);
      }
    }
    ));

    for (var i = 0; i < this.postlistarray.length; i++) {
      this.postlistarray[i]["FirstName"] = this.combineArray[i].FirstName;
      this.postlistarray[i]["LastName"] = this.combineArray[i].LastName;
      this.postlistarray[i]["Phone"] = this.combineArray[i].PhoneNumber;
      this.postlistarray[i]["Email"] = this.combineArray[i].Email;

    }
    // console.log("combimneArray", this.postlistarray);
    return this.postlistarray;
  }

  compareCategories(postlist, postcatlist) {
    this.catCombineArray = []
    this.catPostListArray = postlist;
    postlist.forEach((c1) => postcatlist.forEach((c2) => {
      if (c1.CategoryId === c2.Id) {
        this.catCombineArray.push(c2);
      }
    }

    ));
    if (this.catPostListArray && this.catCombineArray.length > 0) {
      for (var i = 0; i < this.catPostListArray.length; i++) {
        this.catPostListArray[i]["CategoryName"] = this.catCombineArray[i].CategoryName;

      }
    }
    // console.log("catCombineArray", this.catPostListArray);
    if (this.defaultInitial) {
      this.getUserListPagination();
    }
    this.spinner.hide();
    return this.catPostListArray;

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
    this.firstVisibleIndex = this.activePage * this.itemsPerPage - this.itemsPerPage ; // need to change here for resolve pagination issue
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
