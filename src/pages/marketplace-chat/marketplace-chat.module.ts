import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MarketplaceChatPage } from './marketplace-chat';

@NgModule({
  declarations: [
    MarketplaceChatPage,
  ],
  imports: [
    IonicPageModule.forChild(MarketplaceChatPage),
  ],
})
export class MarketplaceChatPageModule {}
