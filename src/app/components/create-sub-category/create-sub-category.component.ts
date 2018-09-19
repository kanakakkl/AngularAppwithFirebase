import { Component, OnInit, Optional } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {CategoryserviceService} from '../categories/categoryservice.service';
import { category } from '../categories/categories.module';

@Component({
  selector: 'app-create-sub-category',
  templateUrl: './create-sub-category.component.html',
  styleUrls: ['./create-sub-category.component.scss']
})
export class CreateSubCategoryComponent implements OnInit {
  imageUrl : string="assets/img/noimage.png"
  fileToUpload : File=null;
  subCategoryForm: FormGroup;
  categorieslist: any;
  constructor(private fb: FormBuilder, private createcategoryservice: CategoryserviceService) {
     this.subCategoryForm = fb.group({
        subcategoryId: ['',Optional],
        categoryName: ['',Optional],
        createTime: ['', Optional],
        subcategoryName: ['',Optional],
        subcategoryImage: ['',Optional],
        subcategoryDescription: ['',Optional],
        status: ['',Optional],
        Show: ['',Optional]
     })
   }

  ngOnInit() {
    var list = this.createcategoryservice.getcategoryData();
    list.snapshotChanges().subscribe(item => {
      this.categorieslist = [];
      item.forEach(element => {
        var y = element.payload.toJSON();
        y["$key"] = element.key;
        this.categorieslist.push(y as category);
      });
    });

  }
  handleFileInput (file :FileList){
    this.fileToUpload=file.item(0);
    // show image in top
    var reader=new FileReader();
    reader.onload=(event:any)=>{
      this.imageUrl=event.target.result;
    }
   reader.readAsDataURL(this.fileToUpload);
  }
  importFile(event) {
    if (event.target.files.length == 0) {
       //console.log("No file selected!");
       return
    }
      let file: File = event.target.files[0];
    }
}