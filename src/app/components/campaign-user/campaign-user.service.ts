import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class CampaignUserService {
  public items: AngularFireList<any[]>;
  
  constructor(db: AngularFireDatabase, private firebase: AngularFireDatabase) {
    this.items = db.list('/Campaigns');
  }

  getCampaignsData() {
    this.items = this.firebase.list('Campaigns');
    return this.items;
  }
  
  saveCsvData(data: AngularFireList<any>[]): void {
   // console.log("saveCsvData");
   this.items.push(data);
  }
  updateCsvData(data: AngularFireList<any>[], recordKey): void{
   // console.log("updateCsvData",recordKey);
    this.items.update(recordKey,data);
  }
}
