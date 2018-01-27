import { Injectable } from "@angular/core";
import firebase from "firebase";
import { ProfileProvider } from "../profile/profile";

@Injectable()
export class MarketplaceProvider {
  firstName: string;
  profilePicture: any;

  public marketplaceListRef: firebase.database.Reference;
  // public marketplaceListAllRef: firebase.database.Reference;

  constructor(
    public profileProvider: ProfileProvider,
  ) {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.marketplaceListRef = firebase
          .database()
          .ref(`/marketplace/${user.uid}/`);

          // this.marketplaceListAllRef = firebase
          //   .database()
          //   .ref(`/marketplace/`);
      }
    });
    // this.profileProvider.getUserProfile().on('value', userProfileSnapshot => {
    //   this.firstName = userProfileSnapshot.val().firstName;
    //   this.profilePicture = userProfileSnapshot.val().profilePicture;
    // });
  }

  createPost(postType: string,
    category: string,
    title: string,
    description: string): firebase.database.ThenableReference {
    return this.marketplaceListRef.push({
      firstName: this.firstName,
      profilePicture: this.profilePicture,
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

  getmarketplaceListAll(): firebase.database.Reference {
    return this.marketplaceListRef;
  }

  getmarketplaceDetail(marketplaceId: string): firebase.database.Reference {
    return this.marketplaceListRef.child(marketplaceId);
  }

}
