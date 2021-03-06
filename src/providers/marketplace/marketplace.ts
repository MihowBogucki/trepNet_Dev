import { Injectable } from "@angular/core";
import firebase from "firebase";
import { ProfileProvider } from "../profile/profile";

@Injectable()
export class MarketplaceProvider {
  firstName: string;
  profilePicture: any;

  public marketplaceListUserRef: firebase.database.Reference;
  public marketplaceListAllRef: firebase.database.Reference;

  constructor(
    public profileProvider: ProfileProvider,
  ) {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        const rootRef = firebase.database().ref(`/marketplace/`);;

        this.marketplaceListUserRef = rootRef.child(`/${user.uid}/`);

        this.marketplaceListAllRef = rootRef;

        this.profileProvider.getUserProfile().on('value', userProfileSnapshot => {
          this.firstName = userProfileSnapshot.val().firstName;
          this.profilePicture = userProfileSnapshot.val().profilePicture;
        });
      }
    });

  }

  createPost(postType: string,
    category: string,
    title: string,
    description: string): firebase.database.ThenableReference {
    return this.marketplaceListAllRef.push({
      firstName: this.firstName,
      profilePicture: this.profilePicture,
      postType: postType,
      category: category,
      title: title,
      description: description,
      date: firebase.database.ServerValue.TIMESTAMP,
      uId: firebase.auth().currentUser.uid
    });
  }

  getmarketplaceList(): firebase.database.Reference {
    return this.marketplaceListUserRef;
  }

  getmarketplaceListAll(): firebase.database.Reference {
    return this.marketplaceListAllRef;
  }

  getmarketplaceDetail(marketplaceId: string): firebase.database.Reference {
    return this.marketplaceListAllRef.child(marketplaceId);
  }

}
