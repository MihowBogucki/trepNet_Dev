import { RequestsProvider } from './../requests/requests';
import { Injectable } from '@angular/core';
import { NavController, NavParams, Events, AlertController } from 'ionic-angular';
import { ChatProvider } from '../../providers/chat/chat';

@Injectable()
export class MarketplaceChatProvider {
  myrequests;
  myfriends;
  constructor(public navCtrl: NavController, public navParams: NavParams, 
              public events: Events, public alertCtrl: AlertController, 
              public chatservice: ChatProvider,
              public requestservice: RequestsProvider,
            ){}
            

  ionViewWillEnter() {
    this.requestservice.getmyrequests();
    this.requestservice.getmyfriends();
    this.myfriends = [];
    this.events.subscribe('gotrequests', () => {
      this.myrequests = [];
      this.myrequests = this.requestservice.userdetails;
    })
    this.events.subscribe('friends', () => {
      this.myfriends = [];
      this.myfriends = this.requestservice.myinteractionsinprogress; 
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
    this.navCtrl.push('BuddychatPage');
  }

}
