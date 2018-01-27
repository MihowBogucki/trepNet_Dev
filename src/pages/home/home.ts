import { PreloaderProvider } from './../../providers/preloader/preloader';
import { Component } from "@angular/core";
import { NavController } from "ionic-angular";
import { MarketplaceProvider } from "../../providers/marketplace/marketplace";
import firebase from "firebase";

@Component({
  selector: "page-home",
  templateUrl: "home.html"
})
export class HomePage {
  public marketPlaceList: Array<any>;

  constructor(public navCtrl: NavController,
              public marketplaceProvider: MarketplaceProvider,
              public preloaderProvider: PreloaderProvider
            ) {
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
              });
              this.preloaderProvider.hidePreloader();

              return false;
            });
          });
        } catch (error) {
          this.preloaderProvider.hidePreloader();


          console.log(error.message);
        }
      }
    });
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
    this.navCtrl.push("EventListPage");
  }
  goToPostCreate(): void {
    this.navCtrl.push("PostCreatePage");
  }

}
