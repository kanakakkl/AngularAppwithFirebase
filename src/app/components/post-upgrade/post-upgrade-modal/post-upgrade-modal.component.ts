import { Component, OnInit,Input,Optional } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
@Component({
  selector: 'app-post-upgrade-modal',
  templateUrl: './post-upgrade-modal.component.html',
  styleUrls: ['./post-upgrade-modal.component.css']
})
export class PostUpgradeModalComponent implements OnInit {
  postForm: FormGroup;

  FirstName: any;
  LastName: any;
  Phone : any;
  EmailId: any;
  // City : any;
  Topic: any;
  postStatus : any;


  @Input() pstData;
  @Input() postdataKey: any;
  constructor(private postfb: FormBuilder) { }

  ngOnInit() {
    var val,
    resData;
  val = this.postdataKey;
  resData = [];
  console.log("$$$$$$$$post data",resData);
  var g = this.pstData;
  g.forEach(function (res) {
    if (res.$key != undefined && val == res.$key) {
      resData.push(res);
    }
  });
  this.FirstName = resData[0].FirstName;
  this.LastName = resData[0].LastName;
  this.Phone = resData[0].Phone;
  this.EmailId = resData[0].Email;
  // this.City = resData[0].City;
  this.Topic = resData[0].TopicTitle;
  this.postStatus = resData[0].PostStatus;

  this.postForm = this.postfb.group({
    FirstName: [this.FirstName, Optional],
    LastName: [this.LastName, Optional],
    EmailId: [this.EmailId, Optional],
    Phone: [this.Phone, Optional],
    Topic: [this.Topic, Optional],
    // City :[this.City,Optional],
    postStatus : [this.postStatus,Optional]
  });

 

  }

}
