import { Injectable } from "@angular/core";
import firebase from "firebase";
import { Events } from 'ionic-angular';
import { ProfileProvider } from "../profile/profile";

@Injectable()
export class ChatProvider {
  phoneNo: any;
  profilePicture: any;
  public marketplaceChatListRef: firebase.database.Reference;
  public profileProvider: ProfileProvider;
  photoURL: string;
  currentUser: string;
  buddy: any;
  messages = [];
  constructor(public events: Events) {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.marketplaceChatListRef = firebase.database().ref(`/marketplaceChat/`);
      }
    });
  }

  initializebuddy(buddy) {
    this.buddy = buddy;
  }

  getmarketplacechat() {
    let temp;
    //this.user2 = "XVeqVcrUsRgfcoRGlrIKKO43Px23";
    // if (firebase.auth().currentUser.uid == this.user2)
    //   this.user2 = "6UICA5yT1IWZKrzLyit0YO4kHZj2";

    this.currentUser = firebase.auth().currentUser.uid;    
    // this.profileProvider.getUserProfile().on('value', userProfileSnapshot => {
    //   this.phoneNo = userProfileSnapshot.val().phoneNo;
    //   this.profilePicture = userProfileSnapshot.val().profilePicture;
    // });
    this.buddy;

    this.marketplaceChatListRef.child(firebase.auth().currentUser.uid).child(this.buddy.uid).on('value', (snapshot) => {
      this.messages = [];
      temp = snapshot.val();
      for (var temKey in temp) {
        this.messages.push(temp[temKey]);
      }
      this.events.publish('newmessage', this.buddy);
    })
  }

  addnewmessage(msg) {
    try {
      var promise = new Promise((resolve, reject) => {
        console.log(this.marketplaceChatListRef.child(firebase.auth().currentUser.uid).child(this.buddy.uid));
        this.marketplaceChatListRef.child(firebase.auth().currentUser.uid).child(this.buddy.uid).push({
          sentby: firebase.auth().currentUser.uid,
          message: msg,
          timestamp: firebase.database.ServerValue.TIMESTAMP
        }).then(() => {
          this.marketplaceChatListRef.child(this.buddy.uid).child(firebase.auth().currentUser.uid).push({
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
