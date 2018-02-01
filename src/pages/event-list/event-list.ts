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
  public eventList: Array<any>;
  @ViewChild('content') content: Content;
  user2: any;
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
    this.photoURL = firebase.auth().currentUser.photoURL;
    this.scrollto();
    this.events.subscribe('newmessage', () => {
      this.allmessages = [];
      this.imgornot = [];
      this.zone.run(() => {
        this.allmessages = this.eventProvider.messages;
        for (var key in this.allmessages) {
          if (this.allmessages[key].message.substring(0, 4) == 'http')
            this.imgornot.push(true);
          else
            this.imgornot.push(false);
        }
      })
      
      
    })
  }
  
  scrollto() {
    setTimeout(() => {
      this.content.scrollToBottom();
    }, 1000);
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
