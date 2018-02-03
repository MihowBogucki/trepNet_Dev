import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { marketplacechatPage } from './marketplace-chat';

@NgModule({
  declarations: [
    marketplacechatPage,
  ],
  imports: [
    IonicPageModule.forChild(marketplacechatPage),
  ],
})
export class MarketplaceChatPageModule {}
