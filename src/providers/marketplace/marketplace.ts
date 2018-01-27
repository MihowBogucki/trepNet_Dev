import { Injectable } from "@angular/core";
import firebase from "firebase";

@Injectable()
export class MarketplaceProvider {
  public marketplaceListRef: firebase.database.Reference;
  constructor() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.marketplaceListRef = firebase
          .database()
          .ref(`/marketplace/${user.uid}/`);
      }
    });
  }

  createPost(
    //User Details
    // uId: string,
    userName: string,
    userProfilePicture: string,

    //Post Details
    postType: string,
    category: string,
    title: string,
    description: string

  ): firebase.database.ThenableReference {
    return this.marketplaceListRef.push({
      userName: userName,
      userProfilePicture: userProfilePicture,
      postType: postType,
      category: category,
      title: title,
      description: description,
      date: Date.now()
    });
  }

  getmarketplaceList(): firebase.database.Reference {
    return this.marketplaceListRef;
  }

  getmarketplaceDetail(marketplaceId: string): firebase.database.Reference {
    return this.marketplaceListRef.child(marketplaceId);
  }

}
