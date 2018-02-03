import { DirectoryProvider } from './../../providers/directory/directory';
import { PreloaderProvider } from './../../providers/preloader/preloader';
import { ViewChild } from '@angular/core';
import { Content, NavController } from 'ionic-angular';
import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import firebase from "firebase";

@Component({
  selector: 'page-directory',
  templateUrl: 'directory.html'
})

export class DirectoryPage {
  @ViewChild(Content) content: Content
  public directoryList: Array<any>;

  constructor(public navCtrl: NavController,
    public directoryProvider: DirectoryProvider,
    public preloaderProvider: PreloaderProvider
  ) {
  }

  ionViewDidLoad() {

    // firebase.auth().onAuthStateChanged(user => {
    //   if (user) {
    try {
      this.preloaderProvider.displayPreloader();

      this.directoryProvider.getdirectoryListAll().on("value", directoryAllListSnapshot => {
        this.directoryList = [];
        directoryAllListSnapshot.forEach(snap => {
          this.directoryList.push({
            id: snap.key,
            firstName: snap.val().firstName,
            lastName: snap.val().lastName,
            profilePicture: snap.val().profilePicture,
            profession: snap.val().profession,
          });
          return false;
        });
        this.preloaderProvider.hidePreloader();
      });
    } catch (error) {
      this.preloaderProvider.hidePreloader();
      console.log(error.message);
    }
    // }
    // });
  }
}

