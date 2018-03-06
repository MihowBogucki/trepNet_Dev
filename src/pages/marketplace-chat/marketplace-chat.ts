import { Component } from '@angular/core';
import { NavController, NavParams, Events, AlertController, IonicPage } from 'ionic-angular';
import { RequestsProvider } from '../../providers/requests/requests';
import { ChatProvider } from '../../providers/chat/chat';

@IonicPage()

@Component({
  selector: "page-marketplace-chat",
  templateUrl: "marketplace-chat.html"
})
export class MarketplaceChatPage {
  myrequests;
  myinteractionsinprogress;
  constructor(public navCtrl: NavController, public navParams: NavParams, public requestservice: RequestsProvider,
              public events: Events, public alertCtrl: AlertController, public chatservice: ChatProvider) {
  }

  ionViewWillEnter() {
    this.requestservice.getmyrequests();
    this.requestservice.getmyfriends();

    this.myinteractionsinprogress = [];

    this.events.subscribe('gotrequests', () => {
      this.myrequests = [];
      this.myrequests = this.requestservice.userdetails;
    })

    this.events.subscribe('friends', () => {
      this.myinteractionsinprogress = [];
      this.myinteractionsinprogress = this.requestservice.myinteractionsinprogress; 
    })
  }

  ionViewDidLeave() {
    this.events.unsubscribe('gotrequests');
    this.events.unsubscribe('friends');
  }


  addbuddy() {
    this.navCtrl.push('BuddiesPage');
  }

  accept(item) {
    this.requestservice.acceptrequest(item).then(() => {
      
      let newalert = this.alertCtrl.create({
        title: 'Friend added',
        subTitle: 'Tap on the friend to chat with him',
        buttons: ['Okay']
      });
      newalert.present();
    })
  }

  ignore(item) {
    this.requestservice.deleterequest(item).then(() => {

    }).catch((err) => {
      alert(err);
    })
  }

  buddychat(buddy) {
    this.chatservice.initializebuddy(buddy);
    this.navCtrl.push('ChatPage');
  }
}
