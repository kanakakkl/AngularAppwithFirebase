import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database'
import { category } from './categories.module';
import { UploadFileService } from '../../midlewares/upload-file.service';
import { FileUpload } from '../../midlewares/fileupload';
import { subcategory } from './subcategory.module';
import { Subject } from 'rxjs';
import { v4 as uuid } from 'uuid';
import * as firebase from 'firebase';


@Injectable({
  providedIn: 'root'
})
export class CategoryserviceService {
  categoryList: AngularFireList<any>;
  subcategoryList: AngularFireList<any>;
  selectedCategory: category = new category();
  selectedSubcategory: subcategory = new subcategory();
  fileUploads: ImageData[];
  selectedFiles: FileList;
  selectedCategoryName: any;
  currentFileUpload: FileUpload;
  private basePath = '/uploads';
  imageUrl: any;
  UploadedImageName: any;

  // Observable string sources
  private componentMethodCallSource = new Subject<any>();

  // Observable string streams
  componentMethodCalled$ = this.componentMethodCallSource.asObservable();

  constructor(private firebase: AngularFireDatabase, private uploadService: UploadFileService) { }

  pushFileToStorage(fileUpload: FileUpload, value, isCategory, isUpdateCategory, recordKey, spinner) {
    const metaData = { 'contentType': fileUpload.file.type };
    const storRef: firebase.storage.Reference = firebase.storage().ref().child(`${this.basePath}/${fileUpload.file.name}`);

    storRef.put(fileUpload.file, metaData)
      .then(snapshot => {
        return snapshot.ref.getDownloadURL();
      })

      .then(downloadURL => {
        console.log(`Successfully uploaded file and got download link - ${downloadURL}`);
        this.imageUrl = downloadURL;
        console.log('URL:' + this.imageUrl);
        fileUpload.url = this.imageUrl;
        fileUpload.name = fileUpload.file.name;
        console.log('fileUpload:' + JSON.stringify(fileUpload));

        if (isCategory != null) {
          isCategory ? (value.categoryImage = fileUpload.url) : (value.subcategoryImage = fileUpload.url);
        }

        if (isUpdateCategory != null) {
          isUpdateCategory ? (value.categoryImage = fileUpload.url) : (value.subcategoryImage = fileUpload.url);
        }

        this.saveFileData(fileUpload, value, isCategory, isUpdateCategory, recordKey, spinner, fileUpload.name);
        this.UploadedImageName = fileUpload.name;
      })

      .catch(error => {
        console.log(`Failed to upload file and get link - ${error}`);
      });
  }

  private saveFileData(fileUpload: FileUpload, value, isCategory, isUpdateCategory, recordKey, spinner, uploadedImgName) {
    this.firebase.list(`${this.basePath}/`).push(fileUpload);
    if (isCategory != null) {
      isCategory ? (this.insertCategory(value, spinner, uploadedImgName)) : (this.insersubCategory(value, spinner, uploadedImgName));
    }
    if (isUpdateCategory != null) {
      isUpdateCategory ? (this.updateCategory(value, null, recordKey, spinner, uploadedImgName)) : (this.updatesubCategory(value, null, recordKey, spinner, uploadedImgName));
    }
  }
  getcategoryData() {
    this.categoryList = this.firebase.list('category');
    return this.categoryList;
  }
  getsubcategoryData() {
    this.subcategoryList = this.firebase.list('subcategory');
    return this.subcategoryList;
  }
  insersubCategory(subcategory: subcategory, spinner, uploadedImgName) {
    if (!this.subcategoryList) {
      this.subcategoryList = this.getsubcategoryData();
    }
    this.subcategoryList.push(
      {
        Id: uuid(),
        CategoryName: subcategory.categoryName,
        SubcategoryName: subcategory.subcategoryName,
        ImageUrl: subcategory.subcategoryImage,
        ImageName: uploadedImgName,
        Status: subcategory.status,
        Show: true,
        Description: subcategory.subcategoryDescription,
        CreateTime: Date.now(),
        ModifyTime: Date.now()
      });
    this.selectedCategoryName = subcategory.subcategoryName;
    this.componentMethodCallSource.next(subcategory);
    spinner.hide();
  }
  updatesubCategory(subcategory: subcategory, imgUrl, recordKey, spinner, uploadedImgName) {
    this.subcategoryList.update(recordKey,
      {
        Id: subcategory.subcategoryId,
        CreateTime: subcategory.createTime,
        ModifyTime: Date.now(),
        CategoryName: subcategory.categoryName,
        SubcategoryName: subcategory.subcategoryName,
        ImageUrl: imgUrl || subcategory.subcategoryImage,
        ImageName: uploadedImgName,
        Status: subcategory.status,
        Show: subcategory.Show,
        Description: subcategory.subcategoryDescription
      });
    this.selectedCategoryName = subcategory.subcategoryName;
    this.componentMethodCallSource.next(subcategory);
    spinner.hide();
  }
  insertCategory(categories: category, spinner, uploadedImgName) {
    if (!this.categoryList) {
      this.categoryList = this.getcategoryData();
    }
    this.categoryList.push({
      Id : uuid(),
      CategoryName: categories.categoryName,
      ImageUrl: categories.categoryImage,
      ImageName: uploadedImgName,
      Status: categories.status,
      Show: true,
      CreateTime: Date.now(),
      ModifyTime: Date.now(),
      Description: categories.categoryDescription
    });
    this.componentMethodCallSource.next(subcategory);
    spinner.hide();
  }

  updateCategory(categories: category, imgUrl, recordKey, spinner, uploadedImgName) {
    this.categoryList.update(recordKey,
      {
        Id: categories.categoryId,
        CategoryName: categories.categoryName,
        ImageUrl: imgUrl || categories.categoryImage,
        ImageName: uploadedImgName,
        Description: categories.categoryDescription,
        Show: categories.Show,
        ModifyTime: Date.now(),
        CreateTime: categories.createTime || categories.CreateTime
      });
    this.componentMethodCallSource.next(subcategory);
  }

  hideCategory(categories: category) {
    this.categoryList.update(categories.$key,
      {
        Show: categories.Show
      });
    return this.categoryList;
  }

  hideSubCategory(subcategory: subcategory) {
    this.subcategoryList.update(subcategory.$key,
      {
        Show: subcategory.Show
      });
    return this.subcategoryList;
  }

}
