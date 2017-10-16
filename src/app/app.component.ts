import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';

import { Storage } from '@ionic/storage';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { IntroPage } from '../pages/intro-page/intro-page'
import { MainPage } from '../pages/main/main-page';
import { HomePage } from '../pages/home/home';
import { ProfilePage } from '../pages/profile/profile';

@Component({
  templateUrl: 'app.html'
})

export class MyApp {
  @ViewChild(Nav) navCtrl: Nav;
  rootPage: any;
  pages: Array<{title: string, component: any}>;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public storageCtrl: Storage) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'Profile', component: ProfilePage }
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.checkPageRedirection();
    });
  }

  openPage(page) {
    this.navCtrl.setRoot(page.component);
  }

  checkPageRedirection() {
    this.storageCtrl.get('isTutorialShow').then((value) => {
      if (value != null && value == true) {
        this.rootPage = IntroPage;
      } else {
        this.rootPage = MainPage;
      }
    });
  }

  doLogout() {
    this.navCtrl.setRoot(MainPage);
  }

}
