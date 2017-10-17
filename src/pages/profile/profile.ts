import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, AlertController } from 'ionic-angular';

import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { Storage } from '@ionic/storage';

import { AppConfig, AppMsgConfig } from '../../providers/AppConfig';


@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})

export class ProfilePage {
  public loginData = {
    user_id: '',
    user_name: '',
    email: '',
    mobile_no: '',
    password: '',
    gender: '',
    job_type: '',
    message: '',
    profile_image: '',
    isUserLoggedIn: false,
    isSocialLogin: false,
    socialLoginType: "",
  };

  public SelectOptions = {
    title: 'Job Type',
    mode: 'md'
  };

  public mJobTypeListDD: any;

  public mSelectedImageURL: string = "";
  public mSelectedImageName: string = "";
  public fileTransfer: FileTransferObject = this.transfer.create();

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public appConfig: AppConfig,
    public appMsgConfig: AppMsgConfig,
    public actionSheetCtrl: ActionSheetController,
    public alertCtrl: AlertController,
    public camera: Camera,
    public file: File,
    public filePath: FilePath,
    public transfer: FileTransfer,
    public storageCtrl: Storage,
  ) {
  }

  ionViewDidEnter() {
    this.mJobTypeListDD = this.appConfig.mJobListDD;

    if (this.appConfig != null && this.appConfig.mUserData != "") {
      this.loginData = this.appConfig.mUserData;
    }
  }

  openCameraActionSheet() {
    if (this.appConfig.isRunOnMobileDevice()) {
      let actionSheet = this.actionSheetCtrl.create({
        title: 'Select Document',
        buttons: [{
          text: 'Load from Library',
          handler: () => {
            this.captureImage(this.camera.PictureSourceType.PHOTOLIBRARY, this.camera.DestinationType.FILE_URI);
          }
        }, {
          text: 'Use Camera',
          handler: () => {
            this.captureImage(this.camera.PictureSourceType.CAMERA, this.camera.DestinationType.FILE_URI);
          }
        }, {
          text: 'Cancel',
          role: 'cancel'
        }]
      });

      actionSheet.present();
    } else {
      this.appConfig.showAlertMsg("", "Camera plugin does not work in browser.");
    }
  }

  getExtenstionFromFile(file, onlyExt) {
    let filename = "";

    if (onlyExt) {
      filename = file.substring(file.lastIndexOf(".") + 1);
    } else {
      filename = file.substring(file.lastIndexOf("/") + 1);
    }

    return filename;
  }

  captureImage(sourceType, destinationType) {
    if (this.appConfig.isRunOnMobileDevice()) {
      let cameraOption = {
        sourceType: sourceType,
        destinationType: destinationType,
        encodingType: this.camera.EncodingType.JPEG,
        quality: 100,
        targetWidth: 1000,
        targetHeight: 1000,
        correctOrientation: true
      }

      this.camera.getPicture(cameraOption).then((resultData) => {
        if (destinationType == this.camera.DestinationType.DATA_URL) {
          this.mSelectedImageURL = "data:image/jpeg;base64," + resultData;
        } else if (destinationType == this.camera.DestinationType.FILE_URI) {
          // console.log(resultData);

          if (this.appConfig.isRunOnAndroidDevice() && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
            this.filePath.resolveNativePath(resultData)
              .then(filePath => {
                // console.log(filePath);

                let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
                let currentName = filePath.substring(filePath.lastIndexOf('/') + 1);
                // let fileExtension = this.getExtenstionFromFile(currentName, true);

                this.copyFileToLocalDir(correctPath, currentName, this.createFileName());

                // console.log(correctPath);
                // console.log(currentName);
              });
          } else {
            var correctPath = resultData.substr(0, resultData.lastIndexOf('/') + 1);
            var currentName = resultData.substr(resultData.lastIndexOf('/') + 1);
            // let fileExtension = this.getExtenstionFromFile(currentName, true);

            this.copyFileToLocalDir(correctPath, currentName, this.createFileName());

            // console.log(correctPath);
            // console.log(currentName);
          }
        }
      }, (err) => {
        this.appConfig.showAlertMsg("", err);
      });
    } else {
      this.appConfig.showAlertMsg("", "Camera plugin does not work in browser.");
    }
  }

  public createFileName() {
    return "img_" + new Date().getTime() + ".jpg";
  }

  public pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      return this.file.dataDirectory + img;
    }
  }

  copyFileToLocalDir(namePath, currentName, newFileName) {
    this.file.copyFile(namePath, currentName, this.file.dataDirectory, newFileName).then(success => {
      this.mSelectedImageName = newFileName;
      this.mSelectedImageURL = this.pathForImage(newFileName);

      this.loginData.profile_image = this.mSelectedImageURL;
      // console.log("imageName : " + this.mSelectedImageName);
      // console.log("imagePath : " + this.mSelectedImageURL);
    }, error => {
      this.appConfig.showAlertMsg("", "Error while storing file.");
    });
  }

  checkUsernameValidation() {
    let isValid = true;

    if (this.loginData.user_name == "") {
      isValid = false;
      this.appConfig.showNativeToast("Enter username.", "bottom", 3000);
    }

    return isValid;
  }

  checkEmailValidation() {
    let isValid: boolean = true;

    if (this.loginData.email == "") {
      isValid = false;
      this.appConfig.showNativeToast(this.appMsgConfig.EmailRequiredMsg, "bottom", 3000);
    } else if (!this.appConfig.validateEmail(this.loginData.email)) {
      isValid = false;
      this.appConfig.showNativeToast(this.appMsgConfig.EmailValidMsg, "bottom", 3000);
    }

    return isValid;
  }

  checkPasswordValidation() {
    let isValid = true;

    if (this.loginData.password == "") {
      isValid = false;
      this.appConfig.showNativeToast(this.appMsgConfig.PassowordRequiredMsg, "bottom", 3000);
    }

    return isValid;
  }

  validateForm() {
    let isValidate = true;

    if (!this.checkUsernameValidation()) {
      isValidate = false;
    } else if (!this.checkEmailValidation()) {
      isValidate = false;
    }

    return isValidate;
  }

  onClickUpdate() {
    if (this.validateForm()) {
      let mAlertSubmit = this.alertCtrl.create({
        title: "Profile",
        subTitle: "Are you sure you want to update this data?",
        buttons: [{
          text: this.appMsgConfig.No
        }, {
          text: this.appMsgConfig.Yes,
          handler: data => {
            this.storageCtrl.set('userData', this.loginData).then(() => {
              this.appConfig.mUserData = this.loginData;

              this.appConfig.showToast("Profile updated successfully.", "bottom", 3000, true, "Ok", true);
            }, (error) => {
              // console.log("storage error", error);
            });
          }
        }]
      });

      mAlertSubmit.present();
    }
  }

}
