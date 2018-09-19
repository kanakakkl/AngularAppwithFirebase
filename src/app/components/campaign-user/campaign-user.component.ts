import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
//import * as XLSX from 'xlsx';
//import { campaign } from '../campaign-user/campaign-xl';
import { FileUtil } from './util';
import { Constants } from './test.constants';
import { CampaignUserService } from './campaign-user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { v4 as uuid } from 'uuid';
import { campaign } from './campaign.module';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-campaign-user',
  templateUrl: './campaign-user.component.html',
  styleUrls: ['./campaign-user.component.css']
})
export class CampaignUserComponent implements OnInit {
  @ViewChild('Upload')
  Upload: any;
  arrayBuffer: any;
  resultObj: any;
  file: File;
  searchText: string;
  campaign = [];
  csvUrl: string;
  csvRecords = [];
  headersMatch: boolean;
  defaultIntial: boolean = false;
  campaignsData = [
    "SequenceNo",
    "CampaignId",
    "Phone",
    "EmailId",
    "Subscription",
    "Country",
    "State",
    "City"
  ];

  modalFormSubscriptionName = new FormControl('', Validators.required);
  modalFormSubscriptionEmail = new FormControl('', Validators.email);

  constructor(private spinner: NgxSpinnerService, private _fileUtil: FileUtil, public campaignService: CampaignUserService, private tostr: ToastrService) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.spinner.show();
    this.defaultIntial = true;
    this.getCampaignsData();
  }

  getCampaignsData() {
    if (this.defaultIntial) {
      var list = this.campaignService.getCampaignsData();
      list.snapshotChanges().subscribe(item => {
        this.campaign = [];
        item.forEach(element => {
          var y = element.payload.toJSON();
          y["$key"] = element.key;
          this.campaign.push(y as campaign);
          console.log("this.campaign", this.campaign);
        });
      });
      this.spinner.hide();
    }
  }

  filterIt(arr, searchKey) {
    // return arr.filter((obj) => {
    //   return Object.keys(obj).some((key) => {
    //     return obj[key].includes(searchKey);
    //   });
    // });
  }
  incomingfile($event): void {
    const spinner = this.spinner;
    var campaignService = this.campaignService;
    var text = [];
    var tostr = this.tostr;
    var files = $event.srcElement.files;
    var campaign = this.campaign;

    if (Constants.validateHeaderAndRecordLengthFlag) {
      console.log("here")
      if (!this._fileUtil.isCSVFile(files[0])) {
        this.tostr.error("Please import valid .csv file.");
        this.fileReset();
        return;
      }
    }
    this.spinner.show();

    var input = $event.target;
    var reader = new FileReader();
    reader.readAsText(input.files[0]);
    reader.onload = (data) => {
      console.log("here1", reader.result)
      let csvData = reader.result.trim();
      let csvRecordsArray = csvData.split(/\r\n|\n/);

      var headerLength = -1;
      if (Constants.isHeaderPresentFlag) {
        console.log("here2")
        let headersRow = this._fileUtil.getHeaderArray(csvRecordsArray, Constants.tokenDelimeter);
        headerLength = headersRow.length;
      }

      this.csvRecords = this._fileUtil.getDataRecordsArrayFromCSVFile(csvRecordsArray,
        headerLength, Constants.validateHeaderAndRecordLengthFlag, Constants.tokenDelimeter, this.tostr, this.spinner);
      if (this.csvRecords == null && this.csvRecords.length <= 1) {
        this.fileReset();
      }
      if (this.csvRecords.length == 1) {
        this.tostr.error("No records to upload");
        this.fileReset();
        return;
      }

      this.headersMatch = this._fileUtil.validateHeaders(this.campaignsData, this.csvRecords[0]);
      console.log("this.headersMatch", this.headersMatch);

      console.log("this.headersMatch&&&", this.headersMatch);
      if (this.headersMatch) {
        console.log("here6")
        this.resultObj = this.csvToJson(reader.result);
        var resultObj = this.resultObj;
        console.log("this.resultObj", this.resultObj);
        var unique = [];
        for (var i = 0; i < resultObj.length; i++) {
          var found = false;

          for (var j = 0; j < campaign.length; j++) { // j < is missed;
            if (resultObj[i].CampaignId === campaign[j].CampaignId) {
              found = true;
              break;
            }
          }
          if (found == false) {
            unique.push(resultObj[i]);
          }
        }
        console.log("Unique",unique);
        campaign.forEach(function(data){
            resultObj.forEach(function(res){
             if(data.CampaignId === res.CampaignId){
               campaignService.updateCsvData(res,data.$key);
               console.log("update call inside");
             }
          });
        });
        if(unique && unique.length){
          unique.forEach(function(res){
            res.Id = uuid();
           campaignService.saveCsvData(res);
           console.log("create call inside");
          });
        }
      } else {
        tostr.error("Headers don't match!!");
        this.spinner.hide();
      }
    }

    reader.onerror = function () {
      tostr.error("Unable to read" + input.files[0]);
      spinner.hide();
    };

  };


  fileReset() {
    this.Upload.nativeElement.value = "";
    this.csvRecords = [];
    this.spinner.hide();
  }

  csvToJson(csvText) {
    console.log("here7")
    var lines = csvText.trim().split("\n");
    var result = [];
    var headers = lines[0].split(",");

    for (var i = 1; i < lines.length; i++) {
      var obj = {};
      var currentline = lines[i].split(",");

      for (var j = 0; j < headers.length; j++) {
        //trimming spaces and removing quotes
        headers[j] = headers[j].replace(/\s+/g, ' ').trim();
        headers[j] = JSON.stringify(headers[j]).replace(/"/g, '');
        headers[j] = headers[j].trim();
        //trimming spaces and removing quotes
        currentline[j] = currentline[j].replace(/\s+/g, ' ').trim();
        currentline[j] = JSON.stringify(currentline[j]).replace(/"/g, '');
        currentline[j] = currentline[j].trim();

        obj[headers[j]] = currentline[j];
      }

      result.push(obj);
    }
    this.spinner.hide();
    console.log("result", result);
    console.log(JSON.stringify(result));
    return result;
  }

  search() {
    if (!this.searchText) {
      return this.campaign;
    }
    if (this.searchText) {
      return this.filterIt(this.campaign, this.searchText);
    }
  }

}
