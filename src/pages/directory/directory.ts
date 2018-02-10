import { DirectoryProvider } from './../../providers/directory/directory';
import { PreloaderProvider } from './../../providers/preloader/preloader';
import { ViewChild } from '@angular/core';
import { Content, NavController } from 'ionic-angular';
import { Component } from '@angular/core';

@Component({
  selector: 'page-directory',
  templateUrl: 'directory.html'
})

export class DirectoryPage {
  searchQuery: string = '';
  items: string[];

  @ViewChild(Content) content: Content
  public directoryList: Array<any>;

  constructor(public navCtrl: NavController,
    public directoryProvider: DirectoryProvider,
    public preloaderProvider: PreloaderProvider
  ) {
  }

  ionViewDidLoad() {

    try {
      this.preloaderProvider.displayPreloader();
      this.initializeItems();
    } catch (error) {
      this.preloaderProvider.hidePreloader();
      console.log(error.message);
    }

  }

  initializeItems() {
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

  }

  getItems(ev: any) {
    // Reset items back to all of the items
    this.initializeItems();

    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.directoryList = this.directoryList.filter((item) => {
        return (item.firstName.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }
}

