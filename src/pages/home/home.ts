import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { MainPage } from '../main/main-page';
import { AppConfig, AppMsgConfig } from '../../providers/AppConfig';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  public mUserName: string = "";
  public mUserId: string = "";

  constructor(
    public navCtrl: NavController,
    public appConfig: AppConfig,
    public appMsgConfig: AppMsgConfig,
  ) {
  }

  ionViewDidEnter() {
    this.mUserName = this.appConfig.mUserData.user_name;
    this.mUserId = this.appConfig.mUserData.user_id;
  }

  doLogout() {
    this.appConfig.showToast(this.appMsgConfig.LogoutSuccessMsg, "bottom", 3000, true, "Ok", true);

    this.appConfig.clearLoginUserData();
    this.navCtrl.setRoot(MainPage);
  }

}
