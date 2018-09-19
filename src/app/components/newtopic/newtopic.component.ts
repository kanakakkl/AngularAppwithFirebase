import { Component, OnInit, Input,  Optional } from '@angular/core';
import {  FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
@Component({
  selector: 'app-newtopic',
  templateUrl: './newtopic.component.html',
  styleUrls: ['./newtopic.component.scss'],

})
export class NewtopicComponent implements OnInit {
  imageUrl : string="assets/img/noimage.png"
   fileToUpload : File=null;
   categoryForm: FormGroup;
   @Input() categorydatakey: any;

  constructor(private fb: FormBuilder) { 
    this.categoryForm = fb.group({
      createTime: ['',Optional],
      categoryId: ['',Optional],
      categoryName: ['',Optional],
      categoryImage: ['',Optional],
      categoryDescription: ['',Optional],
      status: ['',Optional],
      Show:['',Optional]
    });
  }

  ngOnInit() {
  }
  handleFileInput (file :FileList){
    this.fileToUpload=file.item(0);
    // show image
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
      // after here 'file' can be accessed and used for further process
    }

}
