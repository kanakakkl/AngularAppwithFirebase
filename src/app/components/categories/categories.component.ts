import { Component, ViewChild, OnInit } from '@angular/core';
import { NewtopicComponent } from '../newtopic/newtopic.component';
import { CreateSubCategoryComponent } from '../create-sub-category/create-sub-category.component';
import { UploadFileService } from '../../midlewares/upload-file.service';
import { FileUpload } from '../../midlewares/fileupload';
import { CategoryserviceService } from './categoryservice.service';
import { category } from './categories.module';
import { subcategory } from './subcategory.module';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import * as firebase from 'firebase';
import { Ng2OrderModule } from 'ng2-order-pipe';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})

export class CategoriesComponent implements OnInit {
  @ViewChild(NewtopicComponent) categorychild: NewtopicComponent;
  @ViewChild(CreateSubCategoryComponent) subcategorychild: CreateSubCategoryComponent;

  currentFileUpload: FileUpload;
  subcurrentFileUpload: FileUpload;

  searchText: string;
  updatedCategoryName: any;

  order: string = 'CategoryName';
  categoryRec = [];
  subcategoryRec = [];


  isCreateSubCategory: boolean = false;
  isCategory: boolean = false;
  isUpdateCategory: boolean = false;
  mdlSampleIsOpen: boolean = false;
  defaultInitial: boolean = true;
  isCategoryTitle: boolean;
  isDuplicate: boolean = false;
  isSubDuplicate: boolean = false;
  isUpdateDuplicate: boolean = false;
  isUpdateSubDuplicate: boolean = false;
  isSubcategory: boolean;
  subcategory: boolean = true;
  status: boolean = false;
  public show: boolean = false;
  showElement: boolean = false;

  domSelectorList: any;
  domSubSelectorList: any;
  domSelectorListicon: any;
  categories: any;
  subcategories: any;
  SelectedSubcategories: any;

  editedImgUrl: any;
  editedCategoryRecKey: any;
  editedSubcategoryRecKey: any;
  editedsubcategoryImgUrl: any;
  selected: any;
  selectedCategoryName: any;
  createdCategoryName: any;
  previousCategoryName: any;
  previousSubCategoryName: any;
  updateSubcatImgname: any;
  updatecatImgname: any;
  selectedSubCategoryId: any;
  tohideRelatedcategoryRec: any;

  private openModal(open: boolean, subcategoryrecord, isSubcategoryTitle): void {
    this.subcategoryRec.splice(0, this.subcategoryRec.length);
    this.mdlSampleIsOpen = open;
    this.defaultInitial = false;
    if (isSubcategoryTitle) {
      this.isSubcategory = true;
    } else {
      this.isSubcategory = false;
    }
    if (subcategoryrecord) {
      this.editedSubcategoryRecKey = subcategoryrecord.$key;
      this.subcategoryRec.push(subcategoryrecord);
      this.subcategorychild.imageUrl = subcategoryrecord.ImageUrl;
      this.editedsubcategoryImgUrl = subcategoryrecord.ImageUrl;
      this.previousSubCategoryName = subcategoryrecord.SubcategoryName;
      this.subcategorychild.subCategoryForm.setValue({
        subcategoryId: subcategoryrecord.Id,
        createTime: subcategoryrecord.CreateTime, categoryName: subcategoryrecord.CategoryName,
        subcategoryName: subcategoryrecord.SubcategoryName,
        subcategoryImage: "", subcategoryDescription: subcategoryrecord.Description, status: subcategoryrecord.Status,
        Show: subcategoryrecord.Show
      });
    } else {
      this.previousSubCategoryName = null;
      this.subcategorychild.subCategoryForm.reset();
      this.subcategorychild.imageUrl = "assets/img/noimage.png";
    }
  }

  private openCategoryModal(open: boolean, categoryrecord, isTitle): void {
    this.categoryRec.splice(0, this.categoryRec.length);
    this.isCreateSubCategory = open;
    this.defaultInitial = false;
    if (isTitle) {
      this.isCategoryTitle = true;
    } else {
      this.isCategoryTitle = false;
    }
    if (categoryrecord) {
      this.editedCategoryRecKey = categoryrecord.$key;
      this.categoryRec.push(categoryrecord);
      this.categorychild.imageUrl = categoryrecord.ImageUrl;
      this.editedImgUrl = categoryrecord.ImageUrl;
      this.previousCategoryName = categoryrecord.CategoryName;
      this.categorychild.categoryForm.setValue({ createTime: categoryrecord.CreateTime, categoryId: categoryrecord.Id, categoryName: categoryrecord.CategoryName, categoryImage: "", categoryDescription: categoryrecord.Description, status: categoryrecord.Status, Show: categoryrecord.Show });
    } else {
      this.previousCategoryName = null;
      this.categorychild.categoryForm.reset();
      this.categorychild.imageUrl = "assets/img/noimage.png";
    }
  }

  constructor(private spinner: NgxSpinnerService, public uploadService: UploadFileService, private createcategoryservice: CategoryserviceService, private tostr: ToastrService) {
    var sublist = this.createcategoryservice.getsubcategoryData();
    sublist.snapshotChanges().subscribe(item => {
      this.subcategories = [];
      item.forEach(element => {
        var y = element.payload.toJSON();
        y["$key"] = element.key;
        this.subcategories.push(y as subcategory);
      });
    });
  }

  ngOnInit() {
    this.spinner.show();
    var list = this.createcategoryservice.getcategoryData();
    list.snapshotChanges().subscribe(item => {
      this.categories = [];
      item.forEach(element => {
        var y = element.payload.toJSON();
        y["$key"] = element.key;
        this.categories.push(y as category);
      });
      //this is our comparator function
      this.categories.sort(this.DateComparator);
      if (this.defaultInitial && this.categories.length > 0) {
        this.getRelatedSubcategories(this.categories[0]);
      } else if (this.tohideRelatedcategoryRec && this.defaultInitial == false) {
        this.getRelatedSubcategories(this.tohideRelatedcategoryRec);
      }
      this.spinner.hide();
    });

    this.createcategoryservice.componentMethodCalled$.subscribe(
      () => {
        this.getSubCategories(this.selectedCategoryName);
      }
    );
  }

  DateComparator(dateAPair, dateBPair) {
    var DateA = new Date(dateAPair.CreateTime);
    var DateB = new Date(dateBPair.CreateTime);
    if (DateA > DateB) {
      return -1;
    } else if (DateA < DateB) {
      return 1;
    } else {
      return 0;
    }
  }

  public getSubCategories(categoryVal) {
    if (this.updatedCategoryName && categoryVal != this.updatedCategoryName.categoryName) {
      categoryVal = this.updatedCategoryName;
    } else if (this.createdCategoryName != undefined) {
      categoryVal = this.createdCategoryName;
    }
    var sublist = this.createcategoryservice.getsubcategoryData();
    sublist.snapshotChanges().subscribe(item => {
      this.subcategories = [];
      item.forEach(element => {
        var y = element.payload.toJSON();
        y["$key"] = element.key;
        this.subcategories.push(y as subcategory);
      });
      this.getRelatedSubcategories(categoryVal);
    });
  }

  getRelatedSubcategories(category) {
    if (category == null) {
      return;
    }
    this.selectedCategoryName = category;
    this.selected = category.CategoryName || category.categoryName;
    var subCategoriesData = this.subcategories;
    var categoryId = category.Id || category.categoryId;
    var Subcategorieslist = [];

    if (subCategoriesData == undefined) {
      return;
    }

    subCategoriesData.forEach(function (res) {
      if (res.CategoryName == categoryId) {
        Subcategorieslist.push(res);
      }
    });
    this.SelectedSubcategories = Subcategorieslist;
    this.updatedCategoryName = undefined;
    this.createdCategoryName = undefined;
    this.spinner.hide();
  }

  isActive(item) {
    return this.selected === item;
  };

  createCategory() {
    var categoryFormData, categoryFormUrl;
    categoryFormData = this.categorychild.categoryForm.value;
    categoryFormUrl = this.categorychild.imageUrl;
    if (this.categorychild.categoryForm.dirty != false &&
      (categoryFormData.categoryName != null && (categoryFormData.categoryName && categoryFormData.categoryName.trim() != ""))
      && (categoryFormData.categoryDescription != null && (categoryFormData.categoryDescription && categoryFormData.categoryDescription.trim() != "")) && categoryFormUrl != "assets/img/noimage.png") {
      this.duplicationCheck(categoryFormData);
      if (!this.isDuplicate) {
        let file = this.categorychild.fileToUpload;
        this.currentFileUpload = new FileUpload(file);
        this.currentFileUpload.url = this.categorychild.imageUrl;
        this.isCategory = true;
        this.categorychild.categoryForm.value.status = "active";
        this.createdCategoryName = categoryFormData;
        this.previousCategoryName = categoryFormData.categoryName;
        this.createcategoryservice.pushFileToStorage(this.currentFileUpload, this.categorychild.categoryForm.value, this.isCategory, null, null, this.spinner);
        this.openCategoryModal(false, null, null);
        this.spinner.show();
      } else {
        this.tostr.error("category already exists!!.")
      }
    } else {
      this.tostr.error('Please fill all fields to create category');
    }
  }
  CreateSubCategory() {
    var subcategoryFormData, subcategoryFormUrl;
    subcategoryFormData = this.subcategorychild.subCategoryForm.value;
    subcategoryFormUrl = this.subcategorychild.imageUrl;
    this.defaultInitial = false;
    if (this.subcategorychild.subCategoryForm.dirty != false
      && (subcategoryFormData.categoryName != null && (subcategoryFormData.categoryName && subcategoryFormData.categoryName.trim() != ""))
      && (subcategoryFormData.subcategoryName != null && (subcategoryFormData.subcategoryName && subcategoryFormData.subcategoryName.trim() != ""))
      && (subcategoryFormData.subcategoryDescription != null && (subcategoryFormData.subcategoryDescription && subcategoryFormData.subcategoryDescription.trim() != ""))
      && subcategoryFormUrl != "assets/img/noimage.png") {
      this.duplicationSubcatCheck(subcategoryFormData);
      if (!this.isSubDuplicate) {
        let file = this.subcategorychild.fileToUpload;
        this.subcurrentFileUpload = new FileUpload(file);
        this.subcurrentFileUpload.url = this.subcategorychild.imageUrl;
        this.isCategory = false;
        this.subcategorychild.subCategoryForm.value.status = "active";
        this.previousSubCategoryName = subcategoryFormData.subcategoryName;
        this.createcategoryservice.pushFileToStorage(this.subcurrentFileUpload, this.subcategorychild.subCategoryForm.value, this.isCategory, null, null, this.spinner);
        this.openModal(false, null, null);
        this.spinner.show();
      } else {
        this.tostr.error("subcategory already exists!!.");
      }

    } else {
      this.tostr.error('Please fill all fields to create sub-category');
    }

  }

  updateCategory() {
    var categoryFormName, categoryFormDesc, categoryFormUrl, categoryFormData;

    categoryFormData = this.categorychild.categoryForm.value;
    categoryFormUrl = this.categorychild.imageUrl;
    this.updatedCategoryName = categoryFormData;
    this.duplicationupdateCheck(categoryFormData);
    if (!this.isUpdateDuplicate) {
      if (this.editedImgUrl != categoryFormUrl) {
        let file = this.categorychild.fileToUpload;
        this.currentFileUpload = new FileUpload(file);
        this.currentFileUpload.url = this.categorychild.imageUrl;
        this.isUpdateCategory = true;
        this.createcategoryservice.pushFileToStorage(this.currentFileUpload, categoryFormData, null, this.isUpdateCategory, this.editedCategoryRecKey, this.spinner);
      } else {
        this.createcategoryservice.updateCategory(categoryFormData, categoryFormUrl, this.editedCategoryRecKey, this.spinner, null);
      }
      this.openCategoryModal(false, null, null);
      this.spinner.show();
    } else {
      this.tostr.error("category already exists!!.");
    }
  }


  updateSubCategory() {
    var subcategoryFormName, categoryName,
      subcategoryFormDesc, subcategoryFormUrl,
      subcategoryFormData, str, val;

    subcategoryFormData = this.subcategorychild.subCategoryForm.value;
    subcategoryFormUrl = this.subcategorychild.imageUrl;
    this.defaultInitial = false;
    this.duplicationUpdateSubcatCheck(subcategoryFormData);

    if (!this.isUpdateSubDuplicate) {
      if (this.editedsubcategoryImgUrl != subcategoryFormUrl) {
        let file = this.subcategorychild.fileToUpload;
        this.currentFileUpload = new FileUpload(file);
        this.currentFileUpload.url = this.subcategorychild.imageUrl;
        this.isUpdateCategory = false;
        this.createcategoryservice.pushFileToStorage(this.currentFileUpload, subcategoryFormData, null, this.isUpdateCategory, this.editedSubcategoryRecKey, this.spinner);
      } else {
        this.createcategoryservice.updatesubCategory(subcategoryFormData, subcategoryFormUrl, this.editedSubcategoryRecKey, this.spinner, null);
      }
      this.openModal(false, null, null);
    } else {
      this.tostr.error("subcategory already exists!!.");
    }
  }

  isCategoryDisabled() {
    var categoryFormDirty, record,
      categoryFormName, categoryFormDesc,
      categoryFormUrl, str, val;

    categoryFormDirty = this.categorychild.categoryForm.dirty;
    record = (this.categoryRec != null) ? this.categoryRec : null;
    categoryFormName = this.categorychild.categoryForm.value.categoryName;
    categoryFormDesc = this.categorychild.categoryForm.value.categoryDescription;
    categoryFormUrl = this.categorychild.imageUrl;

    str = this.categorychild.categoryForm.value.categoryImage;
    if (str != null) {
      if (str != "") {
        val = str.replace(/\\/g, "/");
        this.updatecatImgname = val.substring(val.lastIndexOf("/") + 1, val.length);
      }
    }

    if (record && categoryFormDirty) {
      if ((record[0].CategoryName.trim() != categoryFormName.trim() && categoryFormName.length > 0)
        || (record[0].Description.trim() != categoryFormDesc.trim() && categoryFormDesc.length > 0)
        || (this.updatecatImgname && record[0].ImageName != this.updatecatImgname)) {
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  }


  isSubcategoryDisabled() {
    var subcategoryFormDirty, record,
      subcategoryFormName, categoryName,
      subcategoryFormDesc, subcategoryFormUrl, str, val;

    subcategoryFormDirty = this.subcategorychild.subCategoryForm.dirty;
    record = (this.subcategoryRec != null) ? this.subcategoryRec : null;
    categoryName = this.subcategorychild.subCategoryForm.value.categoryName;
    subcategoryFormName = this.subcategorychild.subCategoryForm.value.subcategoryName;
    subcategoryFormDesc = this.subcategorychild.subCategoryForm.value.subcategoryDescription;
    subcategoryFormUrl = this.subcategorychild.imageUrl;

    str = this.subcategorychild.subCategoryForm.value.subcategoryImage;
    if (str != null) {
      if (str != "") {
        val = str.replace(/\\/g, "/");
        this.updateSubcatImgname = val.substring(val.lastIndexOf("/") + 1, val.length);
      }
    }

    if (record && subcategoryFormDirty) {
      if ((record[0].CategoryName != categoryName && categoryName.length > 0)
        || (record[0].SubcategoryName.trim() != subcategoryFormName.trim() && subcategoryFormName.length > 0)
        || (record[0].Description.trim() != subcategoryFormDesc.trim() && subcategoryFormDesc.length > 0)
        || (this.updateSubcatImgname && record[0].ImageName != this.updateSubcatImgname)) {
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }

  }

  hideCategory(categoryrecord, e, i) {
    categoryrecord.Show = false;
    this.showElement = true;
    this.createcategoryservice.hideCategory(categoryrecord);
    this.relatedSubcategories(categoryrecord, false);
  }

  relatedSubcategories(category, val) {
    this.defaultInitial = false;
    this.tohideRelatedcategoryRec = category;
    var subCategoriesData = this.subcategories;
    var categoryId = category.Id;
    var Subcategorieslist = [];
    var service = this.createcategoryservice;

    if (subCategoriesData == undefined) {
      return;
    }
    subCategoriesData.forEach(function (res) {
      if (res.CategoryName == categoryId) {
        res.Show = val;
        service.hideSubCategory(res);
      }
    });
  }

  showCategory(categoryrecord, $event, i) {
    categoryrecord.Show = true;
    this.showElement = false;
    this.createcategoryservice.hideCategory(categoryrecord);
    this.relatedSubcategories(categoryrecord, true);
  }

  hideSubCategory(subcategoryrecord, e, index) {
    subcategoryrecord.Show = false;
    this.createcategoryservice.hideSubCategory(subcategoryrecord);
  }

  showSubCategory(subcategory, $event, i) {
    var ele = this.showElement;
    this.categories.forEach(function (res) {
      if (res.Id == subcategory.CategoryName) {
        if (res.Show == false) {
          ele = true;
        }
      }
    })
    if (!this.showElement && !ele) {
      subcategory.Show = true;
      this.createcategoryservice.hideSubCategory(subcategory);
    }
  }

  fireEvent(e) {
    this.isEllipsisActive(e);
    var elementList = document.querySelectorAll('p');
    for (var idx = 0; idx < elementList.length; idx++) {
      if (this.isEllipsisActive(elementList.item(idx))) {
        elementList.item(idx).title = elementList.item(idx).innerHTML;
      }
    }
  }

  isEllipsisActive(e) {
    return e.offsetWidth < e.scrollWidth;
  }

  duplicationCheck(formData) {
    var categoryRec = this.categories,
      isExists;
    categoryRec.forEach(function (element) {
      var recCategoryName = element.CategoryName,
        formCategoryName = formData.categoryName;
      recCategoryName = recCategoryName.toLowerCase();
      formCategoryName = formCategoryName.toLowerCase();
      if (recCategoryName.replace(/\s/g, "") == formCategoryName.replace(/\s/g, "")) {
        isExists = true;
      }
    });
    this.isDuplicate = isExists;
  }

  duplicationupdateCheck(formData) {
    var categoryRec = this.categories,
      prevCategoryName = this.previousCategoryName,
      isExists;

    categoryRec.forEach(function (element) {
      var recCategoryName = element.CategoryName,
        formCategoryName = formData.categoryName;
      recCategoryName = recCategoryName.toLowerCase();
      formCategoryName = formCategoryName.toLowerCase();
      prevCategoryName = prevCategoryName.toLowerCase();
      if (recCategoryName.replace(/\s/g, "") == formCategoryName.replace(/\s/g, "")
        && recCategoryName.replace(/\s/g, "") != prevCategoryName.replace(/\s/g, "")) {
        isExists = true;
      }
    });
    this.isUpdateDuplicate = isExists;
  }

  duplicationSubcatCheck(formData) {
    var subcategoryRec = this.subcategories,
      isExists;
    subcategoryRec.forEach(function (element) {
      var recSubcategoryName = element.SubcategoryName,
        formSubcategoryName = formData.subcategoryName;
      recSubcategoryName = recSubcategoryName.toLowerCase();
      formSubcategoryName = formSubcategoryName.toLowerCase();
      if (recSubcategoryName.replace(/\s/g, "") == formSubcategoryName.replace(/\s/g, "")) {
        isExists = true;
      }
    });
    this.isSubDuplicate = isExists;
  }

  duplicationUpdateSubcatCheck(formData) {
    var subcategoryRec = this.subcategories,
      prevSubcategoryName = this.previousSubCategoryName,
      isExists;
    subcategoryRec.forEach(function (element) {
      var recSubcategoryName = element.SubcategoryName,
        formSubcategoryName = formData.subcategoryName;
      recSubcategoryName = recSubcategoryName.toLowerCase();
      formSubcategoryName = formSubcategoryName.toLowerCase();
      prevSubcategoryName = prevSubcategoryName.toLowerCase();
      if (recSubcategoryName.replace(/\s/g, "") == formSubcategoryName.replace(/\s/g, "") &&
        recSubcategoryName.replace(/\s/g, "") != prevSubcategoryName.replace(/\s/g, "")) {
        isExists = true;
      }
    });
    this.isUpdateSubDuplicate = isExists;
  }

  filterIt(arr, searchKey) {
    searchKey = searchKey.toLowerCase();
    return arr.filter((obj) => {
      return Object.keys(obj).some((key) => {
        if (obj[key] != null && typeof obj[key] != "number") {
          var cat = obj["CategoryName"].replace(/\s/g, "");
          cat = cat.toLowerCase();
          var searchText = searchKey.replace(/\s/g, "");
          if (cat == searchText) {
            this.getRelatedSubcategories(obj);
            return cat.includes(searchText);
          } else if (obj["CategoryName"]) {
            this.getRelatedSubcategories(null);
            return cat.includes(searchText);
          }
        }
      });
    });
  }
  search() {
    if (!this.searchText) {
      return this.categories;
    }
    if (this.searchText) {
      return this.filterIt(this.categories, this.searchText);
    }
  }
}

