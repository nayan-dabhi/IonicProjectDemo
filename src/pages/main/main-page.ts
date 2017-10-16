import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { GooglePlus } from '@ionic-native/google-plus';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';

import { AppConfig, AppMsgConfig } from '../../providers/AppConfig';
import { HomePage } from '../home/home';
import { RegisterPage } from '../register/register';


@Component({
  selector: 'page-main',
  templateUrl: 'main-page.html'
})

export class MainPage {
  public loginData = {
    email: '',
    password: ''
  };

  constructor(
    public navCtrl: NavController,
    public appConfig: AppConfig,
    public appMsgConfig: AppMsgConfig,
    public googlePlus: GooglePlus,
    public facebook: Facebook,
  ) {
  }

  checkValidation() {
    if (!this.checkEmailValidation()) {
      return false;
    } else if (!this.checkPasswordValidation()) {
      return false;
    } else {
      return true;
    }
  }

  checkEmailValidation() {
    if (this.loginData.email == "") {
      this.appConfig.showNativeToast(this.appMsgConfig.EmailRequiredMsg, "bottom", 3000);
      return false;
    } else if (!this.appConfig.validateEmail(this.loginData.email)) {
      this.appConfig.showNativeToast(this.appMsgConfig.EmailValidMsg, "bottom", 3000);
      return false;
    } else {
      return true;
    }
  }

  checkPasswordValidation() {
    if (this.loginData.password == "") {
      this.appConfig.showNativeToast(this.appMsgConfig.PassowordRequiredMsg, "bottom", 3000);
      return false;
    } else {
      return true;
    }
  }

  doLogin() {
    if (this.checkValidation()) {
      if (this.appConfig.hasConnection()) {
        this.appConfig.showLoading(this.appMsgConfig.Loading);

        this.appConfig.isUserLoggedIn = true;

        setTimeout(() => {
          this.appConfig.hideLoading();

          this.navCtrl.setRoot(HomePage);
        }, 500);
      } else {
        this.appConfig.showToast(this.appMsgConfig.NoInternetMsg, "bottom", 3000, true, "Ok", true);
      }
    }
  }

  openSignupPage() {
    this.navCtrl.push(RegisterPage);
  }

  doGoogleLogin() {
    if (this.appConfig.hasConnection()) {
      this.googlePlus.login({}).then((user) => {
        console.log(user);
      }, (err) => {
        console.log(err);
        this.appConfig.showToast("Can't login with google plus.", "bottom", 3000, true, "Ok", true);
      });
    } else {
      this.appConfig.showToast(this.appMsgConfig.NoInternetMsg, "bottom", 3000, true, "Ok", true);
    }
  }

  doFacebookLogin() {
    if (this.appConfig.hasConnection()) {
      this.facebook.login([
        'public_profile',
        'user_friends',
        'email']).then((res: FacebookLoginResponse) => {
          console.log('Logged into Facebook!', res);
        }).catch(e => {
          console.log('Error logging into Facebook', e);
        });
    } else {
      this.appConfig.showToast(this.appMsgConfig.NoInternetMsg, "bottom", 3000, true, "Ok", true);
    }
  }

}
