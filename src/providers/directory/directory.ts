import { Injectable } from "@angular/core";
import firebase from "firebase";

@Injectable()
export class DirectoryProvider {

  public directoryListAllRef: firebase.database.Query;


  constructor() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {

        this.directoryListAllRef = firebase.database().ref(`/userProfile`).orderByChild('firstName');
      }
    });

  }

  getdirectoryListAll(): firebase.database.Query{
    return this.directoryListAllRef;
  }

}
