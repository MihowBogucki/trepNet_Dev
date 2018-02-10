
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule, Injectable, Injector } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
import { Pro } from '@ionic/pro';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { MarketplaceChatPage } from '../pages/marketplace-chat/marketplace-chat';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { MarketplaceChatPageModule} from '../pages/marketplace-chat/marketplace-chat.module';
import { ProfilePageModule} from '../pages/profile/profile.module';
import { DirectoryPageModule} from '../pages/directory/directory.module';

import { PreloaderProvider } from '../providers/preloader/preloader';
import { MarketplaceProvider } from '../providers/marketplace/marketplace';
import { AuthProvider } from '../providers/auth/auth';
import { MarketplaceChatProvider } from '../providers/marketplace-chat/marketplace-chat';
import { ProfileProvider } from '../providers/profile/profile';
import { DirectoryProvider } from '../providers/directory/directory';
import { ChatProvider } from '../providers/chat/chat';
import { RequestsProvider } from '../providers/requests/requests';



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
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    MarketplaceChatPageModule,
    ProfilePageModule,
    DirectoryPageModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    MarketplaceChatPage
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
    [{ provide: ErrorHandler, useClass: MyErrorHandler }],
    DirectoryProvider,
    ChatProvider,
    RequestsProvider
  ]
})
export class AppModule {}
