import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, } from 'angularfire2/database'
import { PostUpgrade} from './post-upgrade.model';
import {User } from '../user/user.model';
import { category } from '../categories/categories.module';




@Injectable({
  providedIn: 'root'
})
export class PostUpgradeService {

  postUpgardeList : AngularFireList<any>;
  selectedPost : PostUpgrade = new PostUpgrade();
  userList : AngularFireList<any>;
  selectedAdmin : User = new User();
  PostCategoryList: AngularFireList<any>;
  selectedCategory: category = new category();

  constructor(private firebase :AngularFireDatabase) { }

   getPostUserData()
  {
    this.userList = this.firebase.list('users');
    return this.userList;
  }

   getPostData()
  {
    this.postUpgardeList = this.firebase.list('posts');
    return this.postUpgardeList;
  }

  getpostCategoryData() {
    this.PostCategoryList = this.firebase.list('category');
    return this.PostCategoryList;
  }

  updatePostData(postmodel :PostUpgrade) {
    this.postUpgardeList.update(postmodel.$key,
      {
        // FirstName: postmodel.FirstName,
        // LastName:  postmodel.LastName,
        // Email: postmodel.EmailId,
        // Phone: postmodel.Phone,
        TopicTitle :postmodel.TopicTitle,
        PostStatus : postmodel.PostStatus
       
      });
  }
}
