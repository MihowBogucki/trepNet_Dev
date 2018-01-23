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
    postType: string,
    category: string,
    title: string,
    description: string,
  ): firebase.database.ThenableReference {
    return this.marketplaceListRef.push({
      postType: postType,
      category: category,
      title: title,
      description: description
    });
  }

  getmarketplaceList(): firebase.database.Reference {
    return this.marketplaceListRef;
  }

  getmarketplaceDetail(marketplaceId: string): firebase.database.Reference {
    return this.marketplaceListRef.child(marketplaceId);
  }

}
