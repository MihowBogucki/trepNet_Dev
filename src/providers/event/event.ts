import { Injectable } from "@angular/core";
import firebase from "firebase";
import { Events } from 'ionic-angular';

@Injectable()
export class EventProvider {
  public eventListRef: firebase.database.Reference;
  user2: any;
  messages = [];
  constructor(public events: Events) {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.eventListRef = firebase.database().ref(`/userProfile/${user.uid}/marketplaceChat`);
      }
    });
  }

  // initializeuser2(user2) {
  //   this.user2 = user2;
  // }
  initializeuser2(user2) {
    this.user2 = "kuN6b8asK4XtUTEsiqyeSfKStGC2";
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
    this.user2 = "kuN6b8asK4XtUTEsiqyeSfKStGC2";
    console.log(this.eventListRef.child(firebase.auth().currentUser.uid));
    console.log(this.eventListRef.child(firebase.auth().currentUser.uid).child(this.user2));
    this.eventListRef.child(firebase.auth().currentUser.uid).child(this.user2).on('value', (snapshot) => {
      this.messages = [];
      temp = snapshot.val();
      for (var temKey in temp) {
        this.messages.push(temp[temKey]);
      }
      this.events.publish('newmessage');
    })
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
): PromiseLike < any > {
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
