import { Injectable } from "@angular/core";
import firebase from "firebase";
import { Events } from 'ionic-angular';

@Injectable()
export class ChatProvider {
  currentUser: string;
  user2Key: any;
  public marketplaceChatListRef: firebase.database.Reference;
  user2: any;
  buddy: any;
  messages = [];
  constructor(public events: Events) {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.marketplaceChatListRef = firebase.database().ref(`/marketplaceChat/`);
      }
    });
  }

  initializeuser2(user2) {
    this.user2 = "XVeqVcrUsRgfcoRGlrIKKO43Px23";
    if (firebase.auth().currentUser.uid == this.user2)
      this.user2 = "6UICA5yT1IWZKrzLyit0YO4kHZj2";
  }
  
  initializebuddy(buddy) {
    this.buddy = buddy;
  }

  createEvent(
    eventName: string,
    eventDate: string,
    eventPrice: number,
    eventCost: number
  ): firebase.database.ThenableReference {
    return this.marketplaceChatListRef.push({
      name: eventName,
      date: eventDate,
      price: eventPrice * 1,
      cost: eventCost * 1,
      revenue: eventCost * -1
    });
  }

  getmarketplacechat() {
    let temp;
    this.user2 = "XVeqVcrUsRgfcoRGlrIKKO43Px23";
    if (firebase.auth().currentUser.uid == this.user2)
      this.user2 = "6UICA5yT1IWZKrzLyit0YO4kHZj2";

      this.currentUser = firebase.auth().currentUser.uid;

    this.marketplaceChatListRef.child(firebase.auth().currentUser.uid).child(this.user2).on('value', (snapshot) => {
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
          console.log(this.marketplaceChatListRef.child(firebase.auth().currentUser.uid).child(this.user2));
          this.marketplaceChatListRef.child(firebase.auth().currentUser.uid).child(this.user2).push({
            sentby: firebase.auth().currentUser.uid,
            message: msg,
            timestamp: firebase.database.ServerValue.TIMESTAMP
          }).then(() => {
            this.marketplaceChatListRef.child(this.user2).child(firebase.auth().currentUser.uid).push({
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

  getEventDetail(eventId: string): firebase.database.Reference {
    return this.marketplaceChatListRef.child(eventId);
  }

  addGuest(
    guestName: string,
    eventId: string,
    eventPrice: number,
    guestPicture: string = null
  ): PromiseLike<any> {
    return this.marketplaceChatListRef
      .child(`${eventId}/guestList`)
      .push({ guestName })
      .then(newGuest => {
        this.marketplaceChatListRef.child(eventId).transaction(event => {
          event.revenue += eventPrice;
          return event;
        });
        if (guestPicture != null) {
          firebase
            .storage()
            .ref(`/guestProfile/${newGuest.key}/profilePicture.png`)
            .putString(guestPicture, 'base64', { contentType: 'image/png' })
            .then(savedPicture => {
              this.marketplaceChatListRef
                .child(`${eventId}/guestList/${newGuest.key}/profilePicture`)
                .set(savedPicture.downloadURL);
            });
        }
      });
  }
}
