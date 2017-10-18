import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { GooglePlus } from '@ionic-native/google-plus';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { Storage } from '@ionic/storage';

import { AppConfig, AppMsgConfig } from '../../providers/AppConfig';
import { HomePage } from '../home/home';
import { RegisterPage } from '../register/register';

import { UserServiceProvider } from "../../providers/UserServiceProvider";

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
    public storageCtrl: Storage,
    public userService: UserServiceProvider
  ) {
  }

  openSignupPage() {
    this.navCtrl.push(RegisterPage);
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

        this.userService.login(this.loginData.email, this.loginData.password).then((data) => {
          let apiResult: any = data;
          if (apiResult.status.toString().toLowerCase() == "success") {
            let userData = {
              user_id: apiResult.user[0].id,
              user_name: '',
              email: apiResult.user[0].email,
              phone: apiResult.user[0].phone_no,
              password: apiResult.user[0].password,
              gender: (apiResult.user[0].gender.toString().toLowerCase() == "male") ? 1 : 2,
              job: apiResult.user[0].job,
              message: apiResult.user[0].message,
              profile_image: apiResult.user[0].p_avatar,
              isUserLoggedIn: true,
              isSocialLogin: false,
              socialLoginType: "",
            };
            this.appConfig.mUserData = userData;
            this.storageCtrl.set('userData', userData).then(() => {
              this.appConfig.hideLoading();
              this.appConfig.mUserData = userData;

              setTimeout(()=>{
                this.navCtrl.setRoot(HomePage);
              },3000);
              
            }, (error) => {
              // console.log("storage error", error);
            });
            this.appConfig.hideLoading();
            this.appConfig.showToast(apiResult.result, "bottom", 3000, true, "Ok", true);
          }else {
            this.appConfig.showToast(apiResult.result, "bottom", 3000, true, "Ok", true);
          }
        });
      } else {
        this.appConfig.hideLoading();
        this.appConfig.showToast(this.appMsgConfig.NoInternetMsg, "bottom", 3000, true, "Ok", true);
      }
    }
  }

  doGoogleLogin() {
    if (this.appConfig.hasConnection()) {
      this.googlePlus.login({}).then((data) => {
        this.appConfig.showToast(this.appMsgConfig.LoginSuccessMsg, "bottom", 3000, true, "Ok", true);

        setTimeout(() => {
          this.navCtrl.push(RegisterPage, {
            isSocialLogin: true,
            socialLoginType: "google",
            userData: data
          });
        }, 500);
      }, (err) => {
        this.appConfig.showToast("Can't login with google plus.", "bottom", 3000, true, "Ok", true);
      });
    } else {
      this.appConfig.showToast(this.appMsgConfig.NoInternetMsg, "bottom", 3000, true, "Ok", true);
    }
  }

  doFacebookLogin() {
    if (this.appConfig.hasConnection()) {
      let permissions = ['public_profile', 'user_friends', 'email'];

      this.facebook.login(permissions).then((response: FacebookLoginResponse) => {
        let userId = response.authResponse.userID;
        let params = new Array<string>();

        this.facebook.api("/me?fields=name,gender,email", params).then((user) => {
          this.appConfig.showToast(this.appMsgConfig.LoginSuccessMsg, "bottom", 3000, true, "Ok", true);

          setTimeout(() => {
            this.navCtrl.push(RegisterPage, {
              isSocialLogin: true,
              socialLoginType: "facebook",
              userData: {
                displayName: user.name,
                email: user.email,
                userId: userId,
                imageUrl: "https://graph.facebook.com/" + userId + "/picture?type=large"
              }
            });
          }, 500);
        });
      }).catch(e => {
        this.appConfig.showToast("Can't login with facebook.", "bottom", 3000, true, "Ok", true);
      });
    } else {
      this.appConfig.showToast(this.appMsgConfig.NoInternetMsg, "bottom", 3000, true, "Ok", true);
    }
  }

}
