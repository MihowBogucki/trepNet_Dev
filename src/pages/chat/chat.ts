import { Component, NgZone, ViewChild } from '@angular/core';
import { NavController, Events, Content, Platform, ActionSheetController, IonicPage } from 'ionic-angular';
import firebase from "firebase";

import { ChatProvider } from "../../providers/chat/chat";


@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {

  buddy: any;
currentUser: string;
  public marketplacechat: Array<any>;
  @ViewChild('content') content: Content;
  user2: any;
  displayName: any;
  photoURLUser2: any;
  newmessage;
  allmessages = [];


  photoURL;
  imgornot;
  constructor(
    public navCtrl: NavController,
    public chatProvider: ChatProvider,
    public events: Events,
    public zone: NgZone,
    public platform: Platform,
    public actionsheetCtrl: ActionSheetController
  ) { 
    //this.photoURL = firebase.auth().currentUser.photoURL;
    //this.photoURL = "https://firebasestorage.googleapis.com/v0/b/trepnet-58387.appspot.com/o/userProfile%2F6UICA5yT1IWZKrzLyit0YO4kHZj2%2FuserPhoto?alt=media&token=059253f0-e18b-4701-a9c7-127ad7c8cc21";
   
    this.scrollto();

    this.events.subscribe('newmessage', () => {
      this.allmessages = [];
      //this.imgornot = [];

      this.zone.run(() => {
        this.allmessages = this.chatProvider.messages;
        this.buddy = this.chatProvider.buddy;
        this.currentUser = firebase.auth().currentUser.uid;
        this.photoURL = this.chatProvider.profilePicture;
        // for (var key in this.allmessages) {
        //   if (this.allmessages[key].message.substring(0, 4) == 'http')
        //     this.imgornot.push(true);
        //   else
        //     this.imgornot.push(false);        
        // }
      })
      
      
    })
  }
  
  scrollto() {
    setTimeout(() => {
      this.content.scrollToBottom();
    }, 1000);
  }

  addmessage() {
    this.chatProvider.addnewmessage(this.newmessage).then(() => {
      this.content.scrollToBottom();
      this.newmessage = '';
    })
  }

  ionViewDidLoad() {
    this.chatProvider.getmarketplacechat();
  }
  
  openMenu() {
    let actionSheet = this.actionsheetCtrl.create({
      title: 'Actions',
      cssClass: 'action-sheets-basic-page',
      buttons: [
        {
          text: 'Offer Info',
          icon: 'information-circle',
          handler: () => {
            console.log('info clicked');
          }
        },
        {
          text: 'Accept',
          role: 'destructive',
          icon: 'checkmark-circle',
          handler: () => {
            console.log('Accept clicked');
          }
        },
        {
          text: 'Reject',
          icon: 'close-circle',
          handler: () => {
            console.log('Reject clicked');
            alert("Reject clicked!");
          }
        },
        {
          text: 'Counter Offer',
          icon: 'git-compare',
          handler: () => {
            console.log('Counter offer');
          }
        },
        {
          text: 'Cancel',
          role: 'cancel', // will always sort to be on the bottom
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

}
