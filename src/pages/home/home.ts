import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { MainPage } from '../main/main-page';
import { AppConfig, AppMsgConfig } from '../../providers/AppConfig';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  constructor(
    public navCtrl: NavController,
    public appConfig: AppConfig,
    public appMsgConfig: AppMsgConfig,
  ) {
  }

  doLogout() {
    this.appConfig.showToast(this.appMsgConfig.LogoutSuccessMsg, "bottom", 3000, true, "Ok", true);

    this.appConfig.isUserLoggedIn = false;
    this.navCtrl.setRoot(MainPage);
  }

}
