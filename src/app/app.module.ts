import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { DatePipe } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LayoutModule } from '@angular/cdk/layout';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { HttpClientModule } from '@angular/common/http';
import {MatListModule, MatToolbarModule, MatButtonModule, MatSidenavModule, MatGridListModule, MatIconModule} from '@angular/material';

/*firebase*/
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { environment } from '../environments/environment';
import * as firebase from 'firebase';

/*ng npm modules */
import { ToastrModule } from 'ngx-toastr';
import { InternationalPhoneModule } from 'ng4-intl-phone';
import { NgxSpinnerModule } from 'ngx-spinner';

/*components of voicx app*/
import { AppComponent } from './app.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { AdminUserComponent } from './components/admin-user/admin-user.component';
import { NewtopicComponent } from './components/newtopic/newtopic.component';
import { AdminModalComponent } from './components/admin-user/admin-modal/admin-modal.component';
import { CampaignUserComponent } from './components/campaign-user/campaign-user.component';
import {CategoriesComponent} from './components/categories/categories.component';
import { PostUpgradeComponent } from './components/post-upgrade/post-upgrade.component';
import { CreateSubCategoryComponent } from './components/create-sub-category/create-sub-category.component';
import { UserComponent } from './components/user/user.component';
import { NewComponent } from './components/new/new.component';
import { UserModalComponent } from './components/user/user-modal/user-modal.component';
import { BackgroundJobsComponent } from './components/background-jobs/background-jobs.component';
import { DurationsComponent } from './components/durations/durations.component';
import { ManagementReportsComponent } from './components/management-reports/management-reports.component';
import { Ng2OrderModule } from 'ng2-order-pipe';
import { FileUtil } from '../app/components/campaign-user/util';

/*services */
import { UploadFileService } from './midlewares/upload-file.service';
import { WindowService } from '../app/midlewares/window.service';
import { AuthGuard } from './auth.guard';
import { CookieService } from 'ngx-cookie-service';
import { PostUpgradeModalComponent } from './components/post-upgrade/post-upgrade-modal/post-upgrade-modal.component';
import { VoicxSlashComponent } from './components/voicx-slash/voicx-slash.component';
import { GeneralSettingsComponent } from './components/general-settings/general-settings.component';

firebase.initializeApp(environment.firebaseConfig);

const routes: Routes = [
  { path: 'login', component: LoginPageComponent},
  { path: 'dashboard', component: DashboardComponent},
  { path: 'voicofthepeople2018/admin', component: AdminUserComponent,  canActivate: [AuthGuard] },
  { path: 'user', component: UserComponent},
  { path: 'campaignuser', component: CampaignUserComponent, canActivate: [AuthGuard]},
  { path: 'userposts', component: PostUpgradeComponent},
  { path: 'categories', component: CategoriesComponent, canActivate: [AuthGuard] },
  { path: 'backgroundjobs', component: BackgroundJobsComponent, canActivate: [AuthGuard]},
  { path: 'durations', component: DurationsComponent, canActivate: [AuthGuard]},
  { path: 'managementreports', component: ManagementReportsComponent, canActivate: [AuthGuard] },
  { path: 'voicxsplash', component: VoicxSlashComponent},
  { path: 'generalsettings', component: GeneralSettingsComponent},
  { path: '', redirectTo:'/login', pathMatch: 'full'}
];
 
@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    AdminUserComponent,
    NewtopicComponent,
    DashboardComponent,
    NavigationComponent,
    CategoriesComponent,
    UserComponent,
    CreateSubCategoryComponent,
    CampaignUserComponent,
    PostUpgradeComponent,
    AdminModalComponent,
    NewComponent,
    UserModalComponent,
    BackgroundJobsComponent,
    DurationsComponent,
    ManagementReportsComponent,
    PostUpgradeModalComponent,
    VoicxSlashComponent,
    GeneralSettingsComponent
  ],
  schemas: [ NO_ERRORS_SCHEMA ],
  imports: [
    BrowserModule,
    InternationalPhoneModule,
    Ng2OrderModule,
    MatListModule,
    MatGridListModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFirestoreModule, 
    AngularFireAuthModule, 
    AngularFireStorageModule,
    AngularFireDatabaseModule,
    HttpClientModule,
    NgxSpinnerModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-center',
      preventDuplicates: true,
      maxOpened:0,
      autoDismiss:false,
      timeOut:  1000,
    }),
    MDBBootstrapModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebaseConfig),
    RouterModule.forRoot(routes, { enableTracing: false }),
    BrowserAnimationsModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule
  ],
  providers: [WindowService,DatePipe, UploadFileService,CookieService, AuthGuard,FileUtil],
  bootstrap: [AppComponent]
})
export class AppModule { }
