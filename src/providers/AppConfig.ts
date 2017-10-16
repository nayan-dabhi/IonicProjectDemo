import { Injectable } from '@angular/core';
import { Platform, LoadingController, ToastController, AlertController, MenuController } from 'ionic-angular';
import { Network } from '@ionic-native/network';
import { Storage } from '@ionic/storage';
import { Toast } from '@ionic-native/toast';
import { Device } from '@ionic-native/device';
import { AppVersion } from '@ionic-native/app-version';

declare var cordova: any;

@Injectable()
export class AppConfig {
  public emailPattern = /^[_A-Za-z0-9/.]+([_A-Za-z0-9-/+/-/?/*/=///^/!/#/$/%/'/`/{/}/|/~/;]+)*@[A-Za-z0-9_-]+(\\.[A-Za-z0-9_-]+)*(\.[A-Za-z]{2,})$/;
  // public emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9]+\.([a-zA-Z]{3,5}|[a-zA-z]{2,5}\.[a-zA-Z]{2,5})$/;


  // App Components
  public mLoader: any;
  public mToast: any;

  // App User Data
  public mUserData: any;
  public isUserLoggedIn: boolean = false;

  constructor(
    public device: Device,
    public platform: Platform,
    public network: Network,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    private storage: Storage,
    private toast: Toast,
    private menuCtrl: MenuController,
    public appVersion: AppVersion) {

  }

  isRunOnMobileDevice() {
    return this.platform.is('mobile') ? true : false;
  }

  isRunOnAndroidDevice() {
    return this.platform.is('android') ? true : false;
  }

  isRunOnIos() {
    return this.platform.is('ios') ? true : false;
  }

  menuSwipeEnable(enable) {
    this.menuCtrl.swipeEnable(enable);
  }

  exitApp() {
    if (this.isRunOnMobileDevice()) {
      this.platform.exitApp();
    }
  }

  getDeviceUUID() {
    if (this.isRunOnMobileDevice()) {
      return this.device.uuid;
    }

    return "";
  }

  getAppVersion() {
    return new Promise((resolve, reject) => {
      if (this.isRunOnMobileDevice()) {
        this.appVersion.getVersionNumber().then(version => {
          resolve(version);
        });
      } else {
        resolve(null);
      }
    });
  }

  getFormattedArray(object: any) {
    let mDropdown = [];

    Object.keys(object).forEach(function(e) {
      mDropdown.push({ "key": e, "value": object[e] })
    });

    return mDropdown;
  }

  openNativeSetting(settingName) {
    if (typeof cordova.plugins.settings.openSetting != undefined) {
      cordova.plugins.settings.open(settingName, function(data) {
      }, function(err) {
      });
    } else {
    }

  }

  showLoading(message) {
    this.mLoader = this.loadingCtrl.create({
      duration: 30000,
      content: message
    });

    if (this.mLoader != null) {
      this.mLoader.onDidDismiss(() => {
      });

      this.mLoader.present();
    }
  }

  hideLoading() {
    if (this.mLoader != null) {
      this.mLoader.dismiss();
    }
  }

  // Local Toast
  showToast(msg, position, duration, isShowCloseBtn, closeButtonText, hideOnPageChange) {
    if (isShowCloseBtn) {
      this.mToast = this.toastCtrl.create({
        message: msg,
        position: position,
        duration: duration,
        showCloseButton: isShowCloseBtn,
        closeButtonText: closeButtonText,
        dismissOnPageChange: hideOnPageChange
      });
    } else {
      this.mToast = this.toastCtrl.create({
        message: msg,
        position: position,
        duration: duration,
        dismissOnPageChange: hideOnPageChange
      });
    }

    this.mToast.present();
  }

  hideToast() {
    if (this.mToast != null) {
      this.mToast.dismiss();
    }
  }

  showNativeToast(msg, position, duration) {
    if (this.isRunOnMobileDevice()) {
      this.toast.show(msg, duration, position).subscribe(
        toast => {
          console.log(toast);
        });
    } else {
      this.showToast(msg, position, duration, true, "ok", true);
    }
  }

  showAlertMsg(title, message) {
    let alert = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: ['Ok']
    });

    alert.present();
  }

  hasConnection() {
    if (this.isRunOnMobileDevice()) {
      // console.log(this.network.type);

      if (this.network.type == "unknown" || this.network.type == null || this.network.type == "none") {
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  }


  setDataInStorage(key, value) {
    return new Promise(resolve => {
      this.storage.set(key, value).then(success => {
        if (success) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }

  getDataFromStorage(key) {
    return new Promise(resolve => {
      this.storage.get(key).then((value) => {
        if (value != null) {
          resolve(value);
        } else {
          resolve(false);
        }
      });
    });
  }

  clearStorageByKey(key) {
    return new Promise(resolve => {
      this.storage.remove(key).then((value) => {
        if (value != null) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }

  clearLocalStorage() {
    this.storage.clear();
  }

  validateEmail(email) {
    if (this.emailPattern.test(email)) {
      return true;
    } else {
      return false;
    }
  }

  getfirstLatter(text) {
    if (text == null) {
      return "";
    } else {
      return text.substr(0, 1);
    }
  }

}

export class AppMsgConfig {
  // String Messages
  public Loading = "Loading...";
  public Error = "Error";
  public NetworkErrorMsg = "Network Error.";
  public InternetConnection = "Internet Connection";
  public NoInternetMsg = "No internet connection available.";
  public NoTextMsg = "No data available.";
  public NoMoreDataMsg = "No more data available.";

  public Yes = "Yes";
  public No = "No"

  public EmailRequiredMsg = "Enter email address.";
  public EmailValidMsg = "Please enter valid email address.";
  public PassowordRequiredMsg = "Enter password.";
  public MobileRequired = "Enter mobile number.";
  public MobileDigitLimit = "Mobile no must be 10 digit.";
  public MobileDigitNumeric = "Mobile no must be numeric.";

  // Login page
  public LoginSuccessMsg = "Login successfully.";
  public LogoutSuccessMsg = "Logout successfully.";

  constructor() {
  }

}
