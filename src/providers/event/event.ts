import { Injectable } from "@angular/core";
import firebase from "firebase";
import { Events } from 'ionic-angular';

@Injectable()
export class EventProvider {
  currentUser: string;
  user2Key: any;
  public eventListRef: firebase.database.Reference;
  user2: any;
  messages = [];
  constructor(public events: Events) {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        //this.eventListRef = firebase.database().ref(`/userProfile/${user.uid}/marketplaceChat`);
        this.eventListRef = firebase.database().ref(`/marketplaceChat/`);
      }
    });
  }

  // initializeuser2(user2) {
  //   this.user2 = user2;
  // }
  initializeuser2(user2) {
    this.user2 = "XVeqVcrUsRgfcoRGlrIKKO43Px23";
    if (firebase.auth().currentUser.uid == this.user2)
      this.user2 = "6UICA5yT1IWZKrzLyit0YO4kHZj2";
  }

  createEvent(
    eventName: string,
    eventDate: string,
    eventPrice: number,
    eventCost: number
  ): firebase.database.ThenableReference {
    return this.eventListRef.push({
      name: eventName,
      date: eventDate,
      price: eventPrice * 1,
      cost: eventCost * 1,
      revenue: eventCost * -1
    });
  }

  getEventList() {
    let temp;
    this.user2 = "XVeqVcrUsRgfcoRGlrIKKO43Px23";
    if (firebase.auth().currentUser.uid == this.user2)
      this.user2 = "6UICA5yT1IWZKrzLyit0YO4kHZj2";

      this.currentUser = firebase.auth().currentUser.uid;

    this.eventListRef.child(firebase.auth().currentUser.uid).child(this.user2).on('value', (snapshot) => {
      this.messages = [];
      temp = snapshot.val();
      for (var temKey in temp) {
        this.messages.push(temp[temKey]);
      }
      this.events.publish('newmessage');
    })
  }

  addnewmessage(msg) {
    this.user2 = "XVeqVcrUsRgfcoRGlrIKKO43Px23";
    if (firebase.auth().currentUser.uid == this.user2)
      this.user2 = "6UICA5yT1IWZKrzLyit0YO4kHZj2";
      
    if (this.user2) {
      try {
        var promise = new Promise((resolve, reject) => {
          console.log(this.eventListRef.child(firebase.auth().currentUser.uid).child(this.user2));
          this.eventListRef.child(firebase.auth().currentUser.uid).child(this.user2).push({
            sentby: firebase.auth().currentUser.uid,
            message: msg,
            timestamp: firebase.database.ServerValue.TIMESTAMP
          }).then(() => {
            this.eventListRef.child(this.user2).child(firebase.auth().currentUser.uid).push({
              sentby: firebase.auth().currentUser.uid,
              message: msg,
              timestamp: firebase.database.ServerValue.TIMESTAMP
            }).then(() => {
              resolve(true);
            })
            //   .catch((err) => {
            //     reject(err);
            // })
          })
        })
        return promise;
      } catch (error) {
        console.log(error.message);
      }

    }
  }

  // getbuddymessages() {

  //   let temp;
  //   this.firebuddychats.child(firebase.auth().currentUser.uid).child(this.buddy.uid).on('value', (snapshot) => {
  //     this.buddymessages = [];
  //     temp = snapshot.val();
  //     for (var tempkey in temp) {
  //       this.buddymessages.push(temp[tempkey]);
  //     }
  //     this.events.publish('newmessage');
  //   })
  // }

  getEventDetail(eventId: string): firebase.database.Reference {
    return this.eventListRef.child(eventId);
  }

  addGuest(
    guestName: string,
    eventId: string,
    eventPrice: number,
    guestPicture: string = null
  ): PromiseLike<any> {
    return this.eventListRef
      .child(`${eventId}/guestList`)
      .push({ guestName })
      .then(newGuest => {
        this.eventListRef.child(eventId).transaction(event => {
          event.revenue += eventPrice;
          return event;
        });
        if (guestPicture != null) {
          firebase
            .storage()
            .ref(`/guestProfile/${newGuest.key}/profilePicture.png`)
            .putString(guestPicture, 'base64', { contentType: 'image/png' })
            .then(savedPicture => {
              this.eventListRef
                .child(`${eventId}/guestList/${newGuest.key}/profilePicture`)
                .set(savedPicture.downloadURL);
            });
        }
      });
  }

}
