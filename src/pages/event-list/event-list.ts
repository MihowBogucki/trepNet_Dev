import { Component, NgZone, ViewChild } from "@angular/core";
import { IonicPage, NavController, Events, Content } from "ionic-angular";
import { EventProvider } from "../../providers/event/event";
import firebase from "firebase";

@IonicPage()
@Component({
  selector: "page-event-list",
  templateUrl: "event-list.html"
})
export class EventListPage {
  currentUser: string;
  public eventList: Array<any>;
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
    public eventProvider: EventProvider,
    public events: Events,
    public zone: NgZone
  ) { 
    //this.photoURL = firebase.auth().currentUser.photoURL;
    this.photoURL = "https://firebasestorage.googleapis.com/v0/b/trepnet-58387.appspot.com/o/userProfile%2F6UICA5yT1IWZKrzLyit0YO4kHZj2%2FuserPhoto?alt=media&token=059253f0-e18b-4701-a9c7-127ad7c8cc21";
    //this.user2 = this.eventProvider.user2;
    this.displayName = "Test user";
    this.photoURLUser2 = "https://firebasestorage.googleapis.com/v0/b/trepnet-58387.appspot.com/o/userProfile%2FXVeqVcrUsRgfcoRGlrIKKO43Px23%2FuserPhoto?alt=media&token=ed81a278-63ab-43d2-b4a8-0d233dce77db";
   
    this.scrollto();
    this.events.subscribe('newmessage', () => {
      this.allmessages = [];
      this.imgornot = [];


      this.zone.run(() => {
        this.allmessages = this.eventProvider.messages;
        this.currentUser = firebase.auth().currentUser.uid;
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
    this.eventProvider.addnewmessage(this.newmessage).then(() => {
      this.content.scrollToBottom();
      this.newmessage = '';
    })
  }

  ionViewDidLoad() {
    this.eventProvider.getEventList();
    // this.eventProvider.getEventList().on("value", eventListSnapshot => {
    //   this.eventList = [];
    //   eventListSnapshot.forEach(snap => {
    //     this.eventList.push({
    //       id: snap.key,
    //       name: snap.val().name,
    //       price: snap.val().price,
    //       date: snap.val().date
    //     });
    //     return false;
    //   });
    // });
  }

  goToEventDetail(eventId):void {
    this.navCtrl.push('EventDetailPage', { eventId: eventId });
  }
  goToCreate(): void {
    this.navCtrl.push("EventCreatePage");
  }
  
}
