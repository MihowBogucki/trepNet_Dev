import { PreloaderProvider } from './../../providers/preloader/preloader';
import { Component, ViewChild } from "@angular/core";
import { NavController, Content, AlertController } from "ionic-angular";
import { MarketplaceProvider } from "../../providers/marketplace/marketplace";
import firebase from "firebase";
import { connreq } from '../../models/interfaces/request';
import { RequestsProvider } from '../../providers/requests/requests';

@Component({
  selector: "page-home",
  templateUrl: "home.html"
})

export class HomePage {
  newrequest = {} as connreq;
  groups: Array<any>;
  public items: any[] = [];
  @ViewChild(Content) content: Content
  public marketPlaceList: Array<any>;

  constructor(public navCtrl: NavController,
    public marketplaceProvider: MarketplaceProvider,
    public preloaderProvider: PreloaderProvider,
    public alertCtrl: AlertController,
    public requestservice: RequestsProvider
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
                date: snap.val().date,
                uid: snap.val().uId
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
  goToPostCreate(): void {
    this.navCtrl.push("PostCreatePage");
  }
  goToMarketPlaceChat(): void {
    this.navCtrl.push("MarketplaceChatPage");
  }


  sendreq(recipient) {
    this.newrequest.sender = firebase.auth().currentUser.uid;
    this.newrequest.recipient = recipient.uid;
    if (this.newrequest.sender === this.newrequest.recipient)
      alert('You are your friend always');
    else {
      let successalert = this.alertCtrl.create({
        title: 'Request sent',
        subTitle: 'Your request was sent to ' + recipient.firstName,
        buttons: ['ok']
      });
    
      this.requestservice.sendrequest(this.newrequest).then((res: any) => {
        if (res.success) {
          successalert.present();
          // let sentuser = this.filteredusers.indexOf(recipient);
          // this.filteredusers.splice(sentuser, 1);
        }
      }).catch((err) => {
        alert(err);
      })
    }
  }
  
}
