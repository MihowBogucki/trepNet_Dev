import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import firebase from 'firebase';
import { firebaseConfig } from './credentials';
import { AngularFireModule } from 'angularfire2';

import { HomePage } from '../pages/home/home';
import { MarketplaceChatPage } from '../pages/marketplace-chat/marketplace-chat';
import { DirectoryPage } from '../pages/directory/directory';
import { ProfilePage } from '../pages/profile/profile';

@Component({
  templateUrl: 'app.html'
})

export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;
  activePage: any;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Marketplace', component: HomePage },
      { title: 'Interactions', component: MarketplaceChatPage },
      { title: 'Directory', component: DirectoryPage },
      { title: 'Profile', component: ProfilePage },
    ];

    this.activePage = this.pages[0];

    AngularFireModule.initializeApp(firebaseConfig);
    firebase.initializeApp(firebaseConfig);

    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
      if (!user) {
        this.rootPage = 'LoginPage';
        unsubscribe();
      } else {
        this.rootPage = HomePage;
        unsubscribe();
      }
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
    this.activePage = page;
  }

  checkActive(page){
    return page = this.activePage;
  };
}
