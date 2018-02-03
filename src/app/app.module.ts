import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule, Injectable, Injector } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
import { Pro } from '@ionic/pro';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { marketplacechatPage } from '../pages/marketplace-chat/marketplace-chat';
import { ListPage } from '../pages/list/list';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthProvider } from '../providers/auth/auth';
import { MarketplaceChatProvider } from '../providers/marketplace-chat/marketplace-chat';
import { ProfileProvider } from '../providers/profile/profile';

import { MarketplaceChatPageModule} from '../pages/marketplace-chat/marketplace-chat.module';
import { ProfilePageModule} from '../pages/profile/profile.module';
import { PreloaderProvider } from '../providers/preloader/preloader';
import { MarketplaceProvider } from '../providers/marketplace/marketplace';


const IonicPro = Pro.init('5275f5d3', {
  appVersion: "0.0.1"
});

@Injectable()
export class MyErrorHandler implements ErrorHandler {
  ionicErrorHandler: IonicErrorHandler;

  constructor(injector: Injector) {
    try {
      this.ionicErrorHandler = injector.get(IonicErrorHandler);
    } catch(e) {
      // Unable to get the IonicErrorHandler provider, ensure 
      // IonicErrorHandler has been added to the providers list below
    }
  }

  handleError(err: any): void {
    IonicPro.monitoring.handleNewError(err);
    // Remove this if you want to disable Ionic's auto exception handling
    // in development mode.
    this.ionicErrorHandler && this.ionicErrorHandler.handleError(err);
  }
}

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    MarketplaceChatPageModule,
    ProfilePageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    marketplacechatPage,
    ListPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthProvider,
    MarketplaceChatProvider,
    ProfileProvider,
    Camera,
    PreloaderProvider,
    MarketplaceProvider,
    IonicErrorHandler,
    [{ provide: ErrorHandler, useClass: MyErrorHandler }]
  ]
})
export class AppModule {}
