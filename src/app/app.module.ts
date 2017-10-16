import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpModule } from '@angular/http';
import { IonicStorageModule } from '@ionic/storage';

// Native Plugins
import { Device } from '@ionic-native/device';
import { Network } from '@ionic-native/network';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Toast } from '@ionic-native/toast';
import { AppVersion } from '@ionic-native/app-version';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { GooglePlus } from '@ionic-native/google-plus';
import { Facebook } from '@ionic-native/facebook';


import { MyApp } from './app.component';
import { IntroPage } from '../pages/intro-page/intro-page';
import { ConnectionPage } from '../pages/connection/connection';
import { MainPage } from '../pages/main/main-page';
import { RegisterPage } from '../pages/register/register';
import { HomePage } from '../pages/home/home';
import { ProfilePage } from '../pages/profile/profile';

// Services
import { AppConfig, AppMsgConfig } from '../providers/AppConfig';


@NgModule({
  declarations: [
    MyApp,
    IntroPage,
    ConnectionPage,
    MainPage,
    RegisterPage,
    HomePage,
    ProfilePage,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp, {
      backButtonText: '',
      backButtonIcon: 'md-arrow-back',
      tabsHighlight: true,
      tabsPlacement: 'top',
      tabsHideOnSubPages: true
    }),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    IntroPage,
    ConnectionPage,
    MainPage,
    RegisterPage,
    HomePage,
    ProfilePage,
  ],
  providers: [
    AppConfig,
    AppMsgConfig,
    Device,
    Network,
    StatusBar,
    SplashScreen,
    Toast,
    AppVersion,
    InAppBrowser,
    GooglePlus,
    Facebook,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule { }
