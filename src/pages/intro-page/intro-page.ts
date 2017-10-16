import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { MainPage } from '../main/main-page';


@Component({
  selector: 'page-intro-page',
  templateUrl: 'intro-page.html'
})

export class IntroPage {

  public slides: any = [{
    title: "Welcome to the Docs!",
    description: "The <b>Ionic Component Documentation</b> showcases a number of useful components that are included out of the box with Ionic.",
    image: "assets/img/ica-slidebox-img-1.png",
  }, {
      title: "What is Ionic?",
      description: "<b>Ionic Framework</b> is an open source SDK that enables developers to build high quality mobile apps with web technologies like HTML, CSS, and JavaScript.",
      image: "assets/img/ica-slidebox-img-2.png",
    }, {
      title: "What is Ionic Cloud?",
      description: "The <b>Ionic Cloud</b> is a cloud platform for managing and scaling Ionic apps with integrated services like push notifications, native builds, user auth, and live updating.",
      image: "assets/img/ica-slidebox-img-3.png",
    }];

  constructor(public navCtrl: NavController,
    public storageCtrl: Storage) {
  }

  openPage() {
    this.storageCtrl.set('isTutorialShow', false);

    this.navCtrl.setRoot(MainPage);
  }

}
