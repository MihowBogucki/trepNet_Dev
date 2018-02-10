import { PreloaderProvider } from './../../providers/preloader/preloader';
import { Component, ViewChild } from "@angular/core";
import { NavController, Content } from "ionic-angular";
import { MarketplaceProvider } from "../../providers/marketplace/marketplace";
import firebase from "firebase";

@Component({
  selector: "page-home",
  templateUrl: "home.html"
})

export class HomePage {
  groups: Array<any>;
  public items: any[] = [];
  @ViewChild(Content) content: Content
  public marketPlaceList: Array<any>;

  constructor(public navCtrl: NavController,
    public marketplaceProvider: MarketplaceProvider,
    public preloaderProvider: PreloaderProvider
  ) {
    setTimeout(() => {
      for (let i = 0; i < 100; i++) {
        this.items[i] = i
      }
    }, 300)

    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        try {
          this.preloaderProvider.displayPreloader();

          this.marketplaceProvider.getmarketplaceListAll().on("value", marketPlaceAllListSnapshot => {
            this.marketPlaceList = [];
            marketPlaceAllListSnapshot.forEach(snap => {
              this.marketPlaceList.push({
                id: snap.key,
                firstName: snap.val().firstName,
                profilePicture: snap.val().profilePicture,
                postType: snap.val().postType,
                category: snap.val().category,
                title: snap.val().title,
                description: snap.val().description,
                date: snap.val().date
              // var date = new Date();

              // date; //# => Fri Apr 01 2011 11:14:50 GMT+0200 (CEST)

              // date.setDate(date.getDate() - 1);

              // date; //# => Thu Mar 31 2011 11:14:50 GMT+0200 (CEST)
              // if (snap.val().date > date)
              //   this.marketPlaceList.push({
              //     groupName: "Today",
              //     marketPlaceList: [{
              //       id: snap.key,
              //       firstName: snap.val().firstName,
              //       profilePicture: snap.val().profilePicture,
              //       postType: snap.val().postType,
              //       category: snap.val().category,
              //       title: snap.val().title,
              //       description: snap.val().description,
              //       date: snap.val().date
              //     }
              //     ]
              //   })
              // else
              //   this.groups.push({
              //     groupName: "Yesterday",
              //     marketPlaceList: [{
              //       id: snap.key,
              //       firstName: snap.val().firstName,
              //       profilePicture: snap.val().profilePicture,
              //       postType: snap.val().postType,
              //       category: snap.val().category,
              //       title: snap.val().title,
              //       description: snap.val().description,
              //       date: snap.val().date
              //     }
              //     ]
              });
              return false;
            });
            this.preloaderProvider.hidePreloader();
          });
        } catch (error) {
          this.preloaderProvider.hidePreloader();
          console.log(error.message);
        }
      }
    });
  }

  callFunction() {
    this.content.scrollToBottom(0)
  }

  ionViewDidLoad() {
  }

  goToProfile(): void {
    this.navCtrl.push("ProfilePage");
  }
  goToCreate(): void {
    this.navCtrl.push("EventCreatePage");
  }
  goToList(): void {
    this.navCtrl.push("marketplacechatPage");
  }
  goToPostCreate(): void {
    this.navCtrl.push("PostCreatePage");
  }
}
